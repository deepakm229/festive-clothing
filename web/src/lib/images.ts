import { getStoragePublicUrl } from "./storage";
import {
  getSubcategoryStoragePath,
  SUBCATEGORY_SITE_IMAGE_FIELD,
  type SiteImageField,
} from "./constants/categories";
import type { SiteImages } from "./data/site-assets";

export const PLACEHOLDER_IMAGE = getStoragePublicUrl("site/placeholder.jpg");

const allowedHosts = new Set([
  ...(process.env.NEXT_PUBLIC_SUPABASE_URL
    ? [new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname]
    : []),
]);

/** Returns a next/image-safe URL, falling back when the value is missing or unconfigured. */
export function getClothImageUrl(imageUrl: string | null | undefined): string {
  if (!imageUrl?.trim()) return PLACEHOLDER_IMAGE;

  try {
    const url = new URL(imageUrl);
    if (!allowedHosts.has(url.hostname)) {
      return PLACEHOLDER_IMAGE;
    }
    return imageUrl;
  } catch {
    return PLACEHOLDER_IMAGE;
  }
}

/** Image for subcategory cards: product photo first, then style site asset, then placeholder. */
export function getSubcategoryImageUrl(
  subcategory: string,
  productImageUrl?: string | null,
): string {
  const productUrl = getClothImageUrl(productImageUrl);
  if (productUrl !== PLACEHOLDER_IMAGE) {
    return productUrl;
  }

  const storagePath = getSubcategoryStoragePath(subcategory);
  if (storagePath) {
    return getStoragePublicUrl(storagePath);
  }

  return PLACEHOLDER_IMAGE;
}

/** Prefer curated site assets on category landing pages (cache-busted URLs). */
export function getCategorySubcategoryImageUrl(
  subcategory: string,
  siteImages: SiteImages,
  productImageUrl?: string | null,
): string {
  const field: SiteImageField | undefined =
    SUBCATEGORY_SITE_IMAGE_FIELD[subcategory];
  if (field && siteImages[field]) {
    return siteImages[field];
  }

  return getSubcategoryImageUrl(subcategory, productImageUrl);
}
