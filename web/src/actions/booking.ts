"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const bookingSchema = z.object({
  clothId: z.coerce.number().positive(),
  customerName: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number required"),
  email: z.string().email("Valid email required"),
  bookingFrom: z.string().min(1, "Start date required"),
  bookingTo: z.string().min(1, "End date required"),
  remarks: z.string().optional(),
});

export async function checkAvailabilityAction(
  clothId: number,
  from: string,
  to: string,
): Promise<{ available: boolean; error?: string }> {
  if (!from || !to) {
    return { available: false, error: "Please select both dates" };
  }
  if (to < from) {
    return { available: false, error: "End date must be on or after start date" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("check_availability", {
    p_cloth_id: clothId,
    p_from: from,
    p_to: to,
  });

  if (error) return { available: false, error: error.message };
  return { available: Boolean(data) };
}

export async function createBookingAction(
  formData: FormData,
): Promise<{ success: boolean; bookingId?: number; error?: string }> {
  const parsed = bookingSchema.safeParse({
    clothId: formData.get("clothId"),
    customerName: formData.get("customerName"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    bookingFrom: formData.get("bookingFrom"),
    bookingTo: formData.get("bookingTo"),
    remarks: formData.get("remarks") || undefined,
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid form data",
    };
  }

  const { clothId, customerName, phone, email, bookingFrom, bookingTo, remarks } =
    parsed.data;

  if (bookingTo < bookingFrom) {
    return { success: false, error: "End date must be on or after start date" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_booking", {
    p_cloth_id: clothId,
    p_customer_name: customerName,
    p_phone: phone,
    p_email: email,
    p_booking_from: bookingFrom,
    p_booking_to: bookingTo,
    p_remarks: remarks ?? null,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/bookings");
  return { success: true, bookingId: data as number };
}
