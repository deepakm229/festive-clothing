"use server";

import { createClient } from "@/lib/supabase/server";
import type { Booking, Cloth } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const clothSchema = z.object({
  name: z.string().min(2),
  category: z.string().optional(),
  festival: z.string().optional(),
  description: z.string().optional(),
  size: z.string().optional(),
  price: z.coerce.number().positive(),
  security_deposit: z.coerce.number().min(0).default(0),
  image_url: z.string().optional(),
  active: z.coerce.boolean().default(true),
});

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

export async function loginAction(
  _prevState: { error?: string } | null,
  formData: FormData,
) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirect") as string) || "/admin";

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  redirect(redirectTo);
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function getAdminClothById(id: number): Promise<Cloth | null> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clothes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as Cloth;
}

export async function getAdminClothes(): Promise<Cloth[]> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clothes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as Cloth[];
}

export async function getAdminBookings(): Promise<Booking[]> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("*, clothes(id, name, category, festival)")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as Booking[];
}

export async function saveClothAction(
  formData: FormData,
  id?: number,
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  const parsed = clothSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category") || undefined,
    festival: formData.get("festival") || undefined,
    description: formData.get("description") || undefined,
    size: formData.get("size") || undefined,
    price: formData.get("price"),
    security_deposit: formData.get("security_deposit") || 0,
    image_url: formData.get("image_url") || undefined,
    active: formData.get("active") === "on" || formData.get("active") === "true",
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid data",
    };
  }

  const supabase = await createClient();

  if (id) {
    const { error } = await supabase
      .from("clothes")
      .update(parsed.data)
      .eq("id", id);
    if (error) return { success: false, error: error.message };
  } else {
    const { error } = await supabase.from("clothes").insert(parsed.data);
    if (error) return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/clothes");
  revalidatePath("/admin/clothes");
  return { success: true };
}

export async function deleteClothAction(
  id: number,
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("clothes").delete().eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/");
  revalidatePath("/clothes");
  revalidatePath("/admin/clothes");
  return { success: true };
}

export async function updateBookingStatusAction(
  id: number,
  status: string,
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/bookings");
  return { success: true };
}

export async function uploadClothImageAction(
  formData: FormData,
): Promise<{ success: boolean; url?: string; error?: string }> {
  await requireAdmin();

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return { success: false, error: "No file selected" };
  }

  const supabase = await createClient();
  const ext = file.name.split(".").pop() ?? "jpg";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("clothes-images")
    .upload(fileName, file, { upsert: false });

  if (uploadError) {
    return { success: false, error: uploadError.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("clothes-images").getPublicUrl(fileName);

  return { success: true, url: publicUrl };
}
