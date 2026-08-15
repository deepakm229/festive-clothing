import { createClient } from "@/lib/supabase/server";
import type { ClothCategory } from "@/lib/constants/categories";
import type { Cloth } from "@/lib/types";

type ClothFilters = {
  search?: string;
  category?: string;
  subcategory?: string;
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
  if (filters.subcategory) {
    query = query.eq("subcategory", filters.subcategory);
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

export async function getSubcategoriesForCategory(
  category: ClothCategory,
): Promise<string[]> {
  const cards = await getSubcategoryCardsForCategory(category);
  return cards.map((c) => c.name);
}

export type SubcategoryCardData = {
  name: string;
  imageUrl: string | null;
};

export async function getSubcategoryCardsForCategory(
  category: ClothCategory,
): Promise<SubcategoryCardData[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clothes")
    .select("subcategory, image_url")
    .eq("active", true)
    .eq("category", category)
    .not("subcategory", "is", null)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  const bySubcategory = new Map<string, string | null>();
  for (const row of data ?? []) {
    if (row.subcategory && !bySubcategory.has(row.subcategory)) {
      bySubcategory.set(row.subcategory, row.image_url);
    }
  }

  return Array.from(bySubcategory.entries()).map(([name, imageUrl]) => ({
    name,
    imageUrl,
  }));
}

export async function getFilterOptions(category?: string) {
  const supabase = await createClient();
  let query = supabase
    .from("clothes")
    .select("category, subcategory, festival, size")
    .eq("active", true);

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  const categories = [
    ...new Set(data?.map((r) => r.category).filter(Boolean)),
  ] as string[];
  const subcategories = [
    ...new Set(data?.map((r) => r.subcategory).filter(Boolean)),
  ] as string[];
  const festivals = [
    ...new Set(data?.map((r) => r.festival).filter(Boolean)),
  ] as string[];
  const sizes = [...new Set(data?.map((r) => r.size).filter(Boolean))] as string[];

  return { categories, subcategories, festivals, sizes };
}
