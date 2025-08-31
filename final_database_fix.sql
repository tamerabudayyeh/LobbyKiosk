-- FINAL DATABASE FIX - Run this in Supabase SQL Editor
-- This will definitively fix the constraint issue

-- Step 1: Check current constraint
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'restaurant_specials'::regclass
AND contype = 'c';

-- Step 2: Drop ALL check constraints on the table (in case there are multiple)
DO $$ 
DECLARE 
    constraint_name text;
BEGIN 
    FOR constraint_name IN 
        SELECT conname 
        FROM pg_constraint 
        WHERE conrelid = 'restaurant_specials'::regclass 
        AND contype = 'c'
    LOOP 
        EXECUTE 'ALTER TABLE restaurant_specials DROP CONSTRAINT ' || constraint_name;
    END LOOP; 
END $$;

-- Step 3: Check what categories currently exist in the data
SELECT DISTINCT category, COUNT(*) as count 
FROM restaurant_specials 
GROUP BY category
ORDER BY category;

-- Step 4: Update any existing invalid categories
UPDATE restaurant_specials 
SET category = 'dish-of-day' 
WHERE category NOT IN ('dish-of-day', 'offers', 'specialties') 
AND category SIMILAR TO '%(dish|main|entree)%';

UPDATE restaurant_specials 
SET category = 'offers' 
WHERE category NOT IN ('dish-of-day', 'offers', 'specialties') 
AND category SIMILAR TO '%(offer|special|deal|promo)%';

UPDATE restaurant_specials 
SET category = 'specialties' 
WHERE category NOT IN ('dish-of-day', 'offers', 'specialties');

-- Step 5: Verify all data now has valid categories
SELECT DISTINCT category, COUNT(*) as count 
FROM restaurant_specials 
GROUP BY category
ORDER BY category;

-- Step 6: Add the correct constraint
ALTER TABLE restaurant_specials 
ADD CONSTRAINT restaurant_specials_category_check 
CHECK (category IN ('dish-of-day', 'offers', 'specialties'));

-- Step 7: Verify the new constraint
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'restaurant_specials'::regclass
AND contype = 'c';

-- SUCCESS! You should now be able to add/edit items with these categories:
-- 'dish-of-day' - Dish of the Day
-- 'offers' - Special Offers
-- 'specialties' - Restaurant Specialties