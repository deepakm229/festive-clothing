const BUCKET = "clothes-images";

export function getStoragePublicUrl(storagePath: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not configured");
  }
  return `${base}/storage/v1/object/public/${BUCKET}/${storagePath}`;
}

/** Append a version query param so browsers and next/image refetch after storage overwrites. */
export function withCacheBuster(url: string, version?: string | null): string {
  if (!version) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}v=${encodeURIComponent(version)}`;
}
