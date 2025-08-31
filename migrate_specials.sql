-- Migration script to update restaurant_specials categories
-- This script updates the existing categories to match the new structure:
-- 'dish-of-day' -> 'dish'
-- 'soup' or old 'offers' -> 'offers' (for promotional offers)
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
SET category = 'offers' 
WHERE category = 'soup' OR category = 'offers';

UPDATE restaurant_specials 
SET category = 'special' 
WHERE category = 'specialties' OR category = 'special';

-- Verify the changes
SELECT DISTINCT category, COUNT(*) as count 
FROM restaurant_specials 
GROUP BY category;

-- Note: After running this migration, you can add your daily specials through the admin panel:
-- 1. Special Offers: Category = 'offers' (for promotional deals, discounts, etc.)
-- 2. Dish of the Day: Category = 'dish' (for the featured main dish)
-- 3. Today's Specials: Category = 'special' (for steaks, fish, soups, and other special items)