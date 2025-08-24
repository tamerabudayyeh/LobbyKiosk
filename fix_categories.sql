-- Fix restaurant_specials table to accept the correct categories

-- First, drop the existing constraint if it exists
ALTER TABLE restaurant_specials DROP CONSTRAINT IF EXISTS restaurant_specials_category_check;

-- Add the new constraint with the correct categories
ALTER TABLE restaurant_specials ADD CONSTRAINT restaurant_specials_category_check 
CHECK (category IN ('dish-of-day', 'offers', 'specialties'));

-- Update existing records to use the new categories
-- You can customize these based on your items
UPDATE restaurant_specials 
SET category = CASE 
    WHEN title LIKE '%Maqloba%' OR title LIKE '%Chicken%' THEN 'dish-of-day'
    WHEN title LIKE '%Soup%' OR title LIKE '%Lunch%' THEN 'offers'
    WHEN title LIKE '%Steak%' OR title LIKE '%NY%' THEN 'specialties'
    ELSE 'specialties'
END;

-- Verify the update
SELECT id, title, category FROM restaurant_specials;