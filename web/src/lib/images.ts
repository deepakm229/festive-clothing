import { getStoragePublicUrl } from "./storage";

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
