-- Run in Supabase Dashboard → SQL Editor (after storage_and_admin.sql)
-- Site marketing images: storage paths in clothes-images bucket + metadata table

-- Public bucket required for next/image and getPublicUrl() to work
UPDATE storage.buckets SET public = true WHERE id = 'clothes-images';

CREATE TABLE IF NOT EXISTS site_assets (
  key TEXT PRIMARY KEY,
  storage_path TEXT NOT NULL,
  alt_text TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE site_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read site assets"
  ON site_assets FOR SELECT
  USING (true);

-- Lets npm run migrate:site-images upload to clothes-images/site/ using the anon key (no login).
-- Scoped to the site/ prefix only; product uploads still require authenticated admin.
DROP POLICY IF EXISTS "Anon can upload site assets" ON storage.objects;
CREATE POLICY "Anon can upload site assets"
  ON storage.objects FOR INSERT
  TO anon
  WITH CHECK (
    bucket_id = 'clothes-images'
    AND (storage.foldername(name))[1] = 'site'
  );

DROP POLICY IF EXISTS "Anon can update site assets" ON storage.objects;
CREATE POLICY "Anon can update site assets"
  ON storage.objects FOR UPDATE
  TO anon
  USING (
    bucket_id = 'clothes-images'
    AND (storage.foldername(name))[1] = 'site'
  )
  WITH CHECK (
    bucket_id = 'clothes-images'
    AND (storage.foldername(name))[1] = 'site'
  );

INSERT INTO site_assets (key, storage_path, alt_text) VALUES
  ('hero', 'site/hero.jpg', 'Festive clothing hero banner'),
  ('promo', 'site/promo.jpg', 'Festival season promo banner'),
  ('category_men', 'site/category-men.jpg', 'Man in traditional sherwani'),
  ('category_women', 'site/category-lehenga.jpg', 'Woman in ornate red lehenga'),
  ('category_kids', 'site/category-festive.jpg', 'Kids in traditional festive wear'),
  ('placeholder', 'site/placeholder.jpg', 'Outfit placeholder')
ON CONFLICT (key) DO UPDATE SET
  storage_path = EXCLUDED.storage_path,
  alt_text = EXCLUDED.alt_text,
  updated_at = now();

-- Remove legacy category keys superseded by category_men / category_women / category_kids
DELETE FROM site_assets
WHERE key IN ('category_kurta', 'category_lehenga', 'category_festive');
