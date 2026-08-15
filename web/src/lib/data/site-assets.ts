import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { getStoragePublicUrl, withCacheBuster } from "@/lib/storage";

export type SiteImages = {
  hero: string;
  promo: string;
  categoryMen: string;
  categoryWomen: string;
  categoryKids: string;
  placeholder: string;
};

const DEFAULT_PATHS = {
  hero: "site/hero.jpg",
  promo: "site/promo.jpg",
  categoryMen: "site/category-men.jpg",
  categoryWomen: "site/category-lehenga.jpg",
  categoryKids: "site/category-festive.jpg",
  placeholder: "site/placeholder.jpg",
} as const;

const KEY_TO_FIELD: Record<string, keyof SiteImages> = {
  hero: "hero",
  promo: "promo",
  category_men: "categoryMen",
  category_women: "categoryWomen",
  category_kids: "categoryKids",
  placeholder: "placeholder",
};

function getDefaultSiteImages(): SiteImages {
  return {
    hero: getStoragePublicUrl(DEFAULT_PATHS.hero),
    promo: getStoragePublicUrl(DEFAULT_PATHS.promo),
    categoryMen: getStoragePublicUrl(DEFAULT_PATHS.categoryMen),
    categoryWomen: getStoragePublicUrl(DEFAULT_PATHS.categoryWomen),
    categoryKids: getStoragePublicUrl(DEFAULT_PATHS.categoryKids),
    placeholder: getStoragePublicUrl(DEFAULT_PATHS.placeholder),
  };
}

export const getSiteImages = cache(async (): Promise<SiteImages> => {
  const defaults = getDefaultSiteImages();

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_assets")
      .select("key, storage_path, updated_at");

    if (error || !data?.length) {
      return defaults;
    }

    const images = { ...defaults };
    const bestByField = new Map<
      keyof SiteImages,
      { storagePath: string; updatedAt: string }
    >();

    for (const row of data) {
      const field = KEY_TO_FIELD[row.key];
      if (!field || !row.storage_path) continue;

      const updatedAt = row.updated_at ?? "";
      const existing = bestByField.get(field);
      if (!existing || updatedAt > existing.updatedAt) {
        bestByField.set(field, {
          storagePath: row.storage_path,
          updatedAt,
        });
      }
    }

    for (const [field, { storagePath, updatedAt }] of bestByField) {
      images[field] = withCacheBuster(
        getStoragePublicUrl(storagePath),
        updatedAt,
      );
    }

    return images;
  } catch {
    return defaults;
  }
});
