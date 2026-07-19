import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { getStoragePublicUrl } from "@/lib/storage";

export type SiteImages = {
  hero: string;
  promo: string;
  categoryKurta: string;
  categoryLehenga: string;
  categoryFestive: string;
  placeholder: string;
};

const DEFAULT_PATHS = {
  hero: "site/hero.jpg",
  promo: "site/promo.jpg",
  categoryKurta: "site/category-kurta.jpg",
  categoryLehenga: "site/category-lehenga.jpg",
  categoryFestive: "site/category-festive.jpg",
  placeholder: "site/placeholder.jpg",
} as const;

const KEY_TO_FIELD: Record<string, keyof SiteImages> = {
  hero: "hero",
  promo: "promo",
  category_kurta: "categoryKurta",
  category_lehenga: "categoryLehenga",
  category_festive: "categoryFestive",
  placeholder: "placeholder",
};

function getDefaultSiteImages(): SiteImages {
  return {
    hero: getStoragePublicUrl(DEFAULT_PATHS.hero),
    promo: getStoragePublicUrl(DEFAULT_PATHS.promo),
    categoryKurta: getStoragePublicUrl(DEFAULT_PATHS.categoryKurta),
    categoryLehenga: getStoragePublicUrl(DEFAULT_PATHS.categoryLehenga),
    categoryFestive: getStoragePublicUrl(DEFAULT_PATHS.categoryFestive),
    placeholder: getStoragePublicUrl(DEFAULT_PATHS.placeholder),
  };
}

export const getSiteImages = cache(async (): Promise<SiteImages> => {
  const defaults = getDefaultSiteImages();

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("site_assets").select("key, storage_path");

    if (error || !data?.length) {
      return defaults;
    }

    const images = { ...defaults };
    for (const row of data) {
      const field = KEY_TO_FIELD[row.key];
      if (field && row.storage_path) {
        images[field] = getStoragePublicUrl(row.storage_path);
      }
    }
    return images;
  } catch {
    return defaults;
  }
});
