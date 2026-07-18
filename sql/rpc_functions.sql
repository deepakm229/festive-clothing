-- Run this in Supabase Dashboard → SQL Editor
-- Creates tables + RPC functions for the Festive Clothing app

-- Tables (skip if you already created them)
CREATE TABLE IF NOT EXISTS clothes (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  festival TEXT,
  description TEXT,
  size TEXT,
  price NUMERIC(10, 2) NOT NULL,
  security_deposit NUMERIC(10, 2) DEFAULT 0,
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bookings (
  id BIGSERIAL PRIMARY KEY,
  cloth_id BIGINT NOT NULL REFERENCES clothes(id),
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  booking_from DATE NOT NULL,
  booking_to DATE NOT NULL,
  status TEXT DEFAULT 'pending',
  remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  CHECK (booking_to >= booking_from)
);

-- Sample data
INSERT INTO clothes (name, category, festival, description, size, price, security_deposit, active)
VALUES
  ('Red Silk Kurta', 'Kurta', 'Diwali', 'Traditional silk kurta with gold embroidery', 'M', 800, 500, true),
  ('Lehenga Set', 'Lehenga', 'Navratri', 'Vibrant lehenga with matching dupatta', 'S', 1500, 1000, true)
ON CONFLICT DO NOTHING;

-- RPC: check if a cloth is available for a date range
CREATE OR REPLACE FUNCTION check_availability(
  p_cloth_id BIGINT,
  p_from DATE,
  p_to DATE
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1
    FROM bookings
    WHERE cloth_id = p_cloth_id
      AND status <> 'Cancelled'
      AND booking_from <= p_to
      AND booking_to >= p_from
  );
END;
$$;

-- RPC: create a booking only when dates are available
CREATE OR REPLACE FUNCTION create_booking(
  p_cloth_id BIGINT,
  p_customer_name TEXT,
  p_phone TEXT,
  p_email TEXT,
  p_booking_from DATE,
  p_booking_to DATE,
  p_remarks TEXT DEFAULT NULL
)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_booking_id BIGINT;
BEGIN
  IF NOT check_availability(p_cloth_id, p_booking_from, p_booking_to) THEN
    RAISE EXCEPTION 'Cloth is not available for the selected dates';
  END IF;

  INSERT INTO bookings (
    cloth_id, customer_name, phone, email,
    booking_from, booking_to, remarks, status
  )
  VALUES (
    p_cloth_id, p_customer_name, p_phone, p_email,
    p_booking_from, p_booking_to, p_remarks, 'pending'
  )
  RETURNING id INTO v_booking_id;

  RETURN v_booking_id;
END;
$$;

-- Allow anon/authenticated roles to call these RPCs
GRANT EXECUTE ON FUNCTION check_availability(BIGINT, DATE, DATE) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION create_booking(BIGINT, TEXT, TEXT, TEXT, DATE, DATE, TEXT) TO anon, authenticated;

-- Optional: allow read access to clothes table for the demo
ALTER TABLE clothes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active clothes"
  ON clothes FOR SELECT
  USING (active = true);

CREATE POLICY "Anyone can create bookings via RPC"
  ON bookings FOR INSERT
  WITH CHECK (true);
