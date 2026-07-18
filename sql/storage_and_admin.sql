-- Run in Supabase Dashboard → SQL Editor (after rpc_functions.sql)
-- Storage bucket + admin policies for Festive Clothing web app

-- Storage bucket for cloth images
INSERT INTO storage.buckets (id, name, public)
VALUES ('clothes-images', 'clothes-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access to images
CREATE POLICY "Public can view cloth images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'clothes-images');

-- Authenticated admins can upload images
CREATE POLICY "Admins can upload cloth images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'clothes-images');

CREATE POLICY "Admins can update cloth images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'clothes-images');

CREATE POLICY "Admins can delete cloth images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'clothes-images');

-- Admin write policies for clothes (authenticated users)
CREATE POLICY "Admins can insert clothes"
  ON clothes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update clothes"
  ON clothes FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Admins can delete clothes"
  ON clothes FOR DELETE
  TO authenticated
  USING (true);

-- Admin read/update for bookings
CREATE POLICY "Admins can read all bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can update bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (true);
