-- Fix the category constraint to accept the new 'offers' category
-- This script updates the check constraint on the restaurant_specials table

-- First, drop the existing check constraint
ALTER TABLE restaurant_specials 
DROP CONSTRAINT IF EXISTS restaurant_specials_category_check;

-- Add the new check constraint with updated categories
ALTER TABLE restaurant_specials 
ADD CONSTRAINT restaurant_specials_category_check 
CHECK (category IN ('offers', 'dish', 'special'));

-- Verify the constraint is updated
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'restaurant_specials'::regclass
AND contype = 'c';

-- Now you can insert/update records with the 'offers' category
-- Example: Update existing 'soup' categories to 'offers'
UPDATE restaurant_specials 
SET category = 'offers' 
WHERE category = 'soup';

-- Note: After running this script, you can add items with these categories:
-- 'offers' - For promotional deals and special offers
-- 'dish' - For dish of the day
-- 'special' - For today's specials (steaks, fish, soups, etc.)