-- Migration script to update restaurant_specials categories
-- This script updates the existing categories to match the new structure:
-- 'dish-of-day' -> 'dish'
-- 'offers' -> 'soup' 
-- 'specialties' -> 'special'

-- First, let's check what categories currently exist
SELECT DISTINCT category, COUNT(*) as count 
FROM restaurant_specials 
GROUP BY category;

-- Update the categories to match new structure
UPDATE restaurant_specials 
SET category = 'dish' 
WHERE category = 'dish-of-day' OR category = 'dish';

UPDATE restaurant_specials 
SET category = 'soup' 
WHERE category = 'offers' OR category = 'soup';

UPDATE restaurant_specials 
SET category = 'special' 
WHERE category = 'specialties' OR category = 'special';

-- Verify the changes
SELECT DISTINCT category, COUNT(*) as count 
FROM restaurant_specials 
GROUP BY category;

-- Note: After running this migration, you can add your daily specials through the admin panel:
-- 1. Soup of the Day: Category = 'soup'
-- 2. Dish of the Day: Category = 'dish' 
-- 3. Today's Specials (4 items): Category = 'special' for each item