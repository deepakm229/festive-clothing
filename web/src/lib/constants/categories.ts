export const CLOTH_CATEGORIES = ["Men", "Women", "Kids"] as const;
export type ClothCategory = (typeof CLOTH_CATEGORIES)[number];

export const CLOTH_SUBCATEGORIES = [
  "Kurta",
  "Lehenga",
  "Sherwani",
  "Saree",
  "Indo-Western",
  "Anarkali",
  "Gown",
] as const;

export const CATEGORY_SLUGS: Record<ClothCategory, string> = {
  Men: "men",
  Women: "women",
  Kids: "kids",
};

const SLUG_TO_CATEGORY: Record<string, ClothCategory> = {
  men: "Men",
  women: "Women",
  kids: "Kids",
};

export function categoryToSlug(category: string): string {
  return category.toLowerCase();
}

export function slugToCategory(slug: string): ClothCategory | null {
  return SLUG_TO_CATEGORY[slug.toLowerCase()] ?? null;
}

export function subcategoryToSlug(subcategory: string): string {
  return subcategory.toLowerCase().replace(/\s+/g, "-");
}

export function slugToSubcategory(
  slug: string,
  candidates: string[],
): string | null {
  const normalized = slug.toLowerCase().replace(/-/g, " ");
  const match = candidates.find(
    (c) => c.toLowerCase().replace(/\s+/g, " ") === normalized,
  );
  return match ?? null;
}

export function isNumericSlug(slug: string): boolean {
  return /^\d+$/.test(slug);
}

export const SUBCATEGORY_IMAGE_PATHS: Record<string, string> = {
  Kurta: "site/category-men.jpg",
  Lehenga: "site/category-lehenga.jpg",
  Sherwani: "site/category-men.jpg",
  Saree: "site/category-lehenga.jpg",
  "Indo-Western": "site/category-festive.jpg",
  Anarkali: "site/category-lehenga.jpg",
  Gown: "site/category-lehenga.jpg",
};

export type SiteImageField = "categoryMen" | "categoryWomen" | "categoryKids";

export const SUBCATEGORY_SITE_IMAGE_FIELD: Partial<
  Record<string, SiteImageField>
> = {
  Kurta: "categoryMen",
  Sherwani: "categoryMen",
  Lehenga: "categoryWomen",
  Saree: "categoryWomen",
  Anarkali: "categoryWomen",
  Gown: "categoryWomen",
  "Indo-Western": "categoryKids",
};

export function getSubcategoryStoragePath(subcategory: string): string | null {
  return SUBCATEGORY_IMAGE_PATHS[subcategory] ?? null;
}

export function formatClothMeta(cloth: {
  category?: string | null;
  subcategory?: string | null;
  festival?: string | null;
}): string {
  return [cloth.category, cloth.subcategory, cloth.festival]
    .filter(Boolean)
    .join(" · ");
}
