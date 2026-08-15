-- Run in Supabase Dashboard → SQL Editor (after rpc_functions.sql)
-- Adds subcategory for 2nd-level drill-down (Kurta, Lehenga, etc.)
-- category column remains 1st level: Men, Women, Kids

ALTER TABLE clothes
  ADD COLUMN IF NOT EXISTS subcategory TEXT;

CREATE INDEX IF NOT EXISTS idx_clothes_category_subcategory
  ON clothes (category, subcategory);

-- Backfill subcategory from product name for existing rows
UPDATE clothes SET subcategory = 'Kurta'
  WHERE subcategory IS NULL AND name ILIKE '%kurta%';

UPDATE clothes SET subcategory = 'Lehenga'
  WHERE subcategory IS NULL AND name ILIKE '%lehenga%';

UPDATE clothes SET subcategory = 'Sherwani'
  WHERE subcategory IS NULL AND name ILIKE '%sherwani%';

UPDATE clothes SET subcategory = 'Saree'
  WHERE subcategory IS NULL AND name ILIKE '%saree%';

-- Normalize legacy seed values: category was Kurta/Lehenga, move to subcategory
UPDATE clothes SET subcategory = category, category = 'Men'
  WHERE category = 'Kurta';

UPDATE clothes SET subcategory = category, category = 'Women'
  WHERE category = 'Lehenga';
