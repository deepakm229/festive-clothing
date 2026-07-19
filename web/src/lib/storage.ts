const BUCKET = "clothes-images";

export function getStoragePublicUrl(storagePath: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not configured");
  }
  return `${base}/storage/v1/object/public/${BUCKET}/${storagePath}`;
}
