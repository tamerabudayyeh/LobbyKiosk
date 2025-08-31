-- Safe migration script to update category constraint
-- This handles existing data before changing the constraint

-- Step 1: Check what categories currently exist in the database
SELECT DISTINCT category, COUNT(*) as count 
FROM restaurant_specials 
GROUP BY category
ORDER BY category;

-- Step 2: Update existing categories to match new structure
-- Update any 'soup' entries to 'offers'
UPDATE restaurant_specials 
SET category = 'offers' 
WHERE category = 'soup';

-- Update any old category names if they exist
UPDATE restaurant_specials 
SET category = 'dish' 
WHERE category = 'dish-of-day';

UPDATE restaurant_specials 
SET category = 'special' 
WHERE category = 'specialties';

-- Update any other non-standard categories (safety measure)
UPDATE restaurant_specials 
SET category = 'special' 
WHERE category NOT IN ('offers', 'dish', 'special');

-- Step 3: Verify all categories are now valid
SELECT DISTINCT category, COUNT(*) as count 
FROM restaurant_specials 
GROUP BY category
ORDER BY category;

-- Step 4: Now safely drop and recreate the constraint
ALTER TABLE restaurant_specials 
DROP CONSTRAINT IF EXISTS restaurant_specials_category_check;

-- Step 5: Add the new constraint with updated categories
ALTER TABLE restaurant_specials 
ADD CONSTRAINT restaurant_specials_category_check 
CHECK (category IN ('offers', 'dish', 'special'));

-- Step 6: Verify the constraint is updated
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'restaurant_specials'::regclass
AND contype = 'c';

-- Success! The categories are now:
-- 'offers' - For promotional deals and special offers
-- 'dish' - For dish of the day
-- 'special' - For today's specials (steaks, fish, soups, etc.)