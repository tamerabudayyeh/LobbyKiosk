/*
  # Update restaurant_specials categories for proper kiosk display

  1. Change category constraint from 'soup', 'dish', 'special' to 'dish-of-day', 'offers', 'specialties'
  2. Update existing data to match new categories
  3. This aligns database schema with the UI component expectations
*/

-- Drop the existing check constraint
ALTER TABLE restaurant_specials DROP CONSTRAINT IF EXISTS restaurant_specials_category_check;

-- Add new check constraint with updated categories
ALTER TABLE restaurant_specials ADD CONSTRAINT restaurant_specials_category_check 
CHECK (category IN ('dish-of-day', 'offers', 'specialties'));

-- Update existing data to match new categories
-- Convert 'soup' to 'offers' (soups can be part of offers)  
UPDATE restaurant_specials SET category = 'offers' WHERE category = 'soup';

-- Convert 'dish' to 'dish-of-day' (featured main dishes)
UPDATE restaurant_specials SET category = 'dish-of-day' WHERE category = 'dish';

-- Convert 'special' to 'specialties' (premium items)
UPDATE restaurant_specials SET category = 'specialties' WHERE category = 'special';

-- Clear existing data and insert new structured data that matches the UI design
DELETE FROM restaurant_specials;

-- Insert new data with proper categories
INSERT INTO restaurant_specials (category, title, description, image_url, price, display_order) VALUES
  -- Dish of the Day
  ('dish-of-day', 'Mediterranean Lamb Tagine', 'Slow-cooked lamb with apricots, almonds, and aromatic spices, served with saffron couscous and fresh mint yogurt', 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=800&q=80', '$34', 1),
  
  -- Special Offers  
  ('offers', 'Business Lunch Special', 'Three-course executive lunch: soup, main course, and dessert with coffee. Perfect for business meetings.', 'https://images.unsplash.com/photo-1560963689-b5682b6440f8?auto=format&fit=crop&w=800&q=80', '$28', 1),
  ('offers', 'Happy Hour Special', 'Premium cocktails, wine selection, and appetizer platters. Available Monday-Friday 5:00-7:00 PM.', 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80', '20% Off', 2),
  ('offers', 'Weekend Brunch Buffet', 'All-you-can-eat brunch buffet featuring international cuisine, fresh pastries, and bottomless mimosas.', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80', '$42', 3),
  
  -- Restaurant Specialties
  ('specialties', 'Signature Jerusalem Grill', 'Mixed grill featuring lamb kebab, chicken shawarma, and beef kufta with tahini and fresh pita', 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=800&q=80', '$38', 1),
  ('specialties', 'Pan-Seared Sea Bass', 'Fresh Mediterranean sea bass with lemon herb crust, roasted vegetables, and saffron cream sauce', 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?auto=format&fit=crop&w=800&q=80', '$32', 2),
  ('specialties', 'Dry-Aged Ribeye Steak', '28-day aged ribeye with bone marrow butter, truffle mashed potatoes, and seasonal vegetables', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80', '$48', 3),
  ('specialties', 'Roasted Duck Breast', 'Five-spice duck breast with pomegranate molasses, wild rice pilaf, and caramelized root vegetables', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80', '$36', 4),
  ('specialties', 'Lobster Thermidor', 'Fresh lobster tail with cognac cream sauce, herb butter, and golden Gruyère crust', 'https://images.unsplash.com/photo-1539136788836-5699e78bfc75?auto=format&fit=crop&w=800&q=80', '$52', 5),
  ('specialties', 'Vegetarian Tasting Plate', 'Seasonal selection of roasted vegetables, quinoa tabbouleh, hummus varieties, and fresh baked bread', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80', '$24', 6),
  ('specialties', 'Chef''s Signature Risotto', 'Creamy Arborio rice with wild mushrooms, truffle oil, aged Parmesan, and fresh herbs', 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=800&q=80', '$26', 7);