import { createClient } from "@/lib/supabase/server";
import type { Cloth } from "@/lib/types";

type ClothFilters = {
  search?: string;
  category?: string;
  festival?: string;
  size?: string;
};

export async function getClothes(filters: ClothFilters = {}): Promise<Cloth[]> {
  const supabase = await createClient();
  let query = supabase
    .from("clothes")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (filters.category) {
    query = query.eq("category", filters.category);
  }
  if (filters.festival) {
    query = query.eq("festival", filters.festival);
  }
  if (filters.size) {
    query = query.eq("size", filters.size);
  }
  if (filters.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`,
    );
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as Cloth[];
}

export async function getClothById(id: number): Promise<Cloth | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clothes")
    .select("*")
    .eq("id", id)
    .eq("active", true)
    .single();

  if (error) return null;
  return data as Cloth;
}

export async function getFeaturedClothes(limit = 4): Promise<Cloth[]> {
  const clothes = await getClothes();
  return clothes.slice(0, limit);
}

export async function getFilterOptions() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clothes")
    .select("category, festival, size")
    .eq("active", true);

  if (error) throw new Error(error.message);

  const categories = [
    ...new Set(data?.map((r) => r.category).filter(Boolean)),
  ] as string[];
  const festivals = [
    ...new Set(data?.map((r) => r.festival).filter(Boolean)),
  ] as string[];
  const sizes = [...new Set(data?.map((r) => r.size).filter(Boolean))] as string[];

  return { categories, festivals, sizes };
}
