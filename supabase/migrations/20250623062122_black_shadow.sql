/*
  # Create restaurant_specials table

  1. New Tables
    - `restaurant_specials`
      - `id` (uuid, primary key)
      - `category` (text, required - 'soup', 'dish', 'special')
      - `title` (text, required)
      - `description` (text, required)
      - `image_url` (text, required)
      - `price` (text, optional)
      - `is_available` (boolean, default true)
      - `display_order` (integer, default 0)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Disable RLS for unrestricted access (matching existing tables)
    - Add trigger for automatic updated_at timestamp updates

  3. Initial Data
    - Insert sample restaurant specials data
*/

CREATE TABLE IF NOT EXISTS restaurant_specials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL CHECK (category IN ('soup', 'dish', 'special')),
  title text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  price text,
  is_available boolean DEFAULT true NOT NULL,
  display_order integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Disable RLS to match existing tables
ALTER TABLE restaurant_specials DISABLE ROW LEVEL SECURITY;

-- Create trigger to automatically update updated_at on restaurant_specials table
CREATE TRIGGER update_restaurant_specials_updated_at
  BEFORE UPDATE ON restaurant_specials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO restaurant_specials (category, title, description, image_url, display_order) VALUES
  ('soup', 'Potato Leek Soup', 'Creamy and comforting soup made with fresh potatoes and leeks, garnished with herbs', 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=800', 1),
  ('soup', 'Pumpkin Sage Soup', 'Velvety pumpkin soup infused with aromatic sage and a touch of cream', 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800', 2),
  ('soup', 'Crushed Green Wheat Soup', 'Traditional Middle Eastern soup with crushed green wheat, herbs, and spices', 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=800', 3),
  ('dish', 'Chicken Maqlobe', 'Traditional upside-down rice dish with tender chicken, mixed vegetables, and aromatic spices, served with fresh yogurt', 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=800', 1),
  ('special', 'Dry-aged NY Steak', 'Premium dry-aged New York strip steak, grilled to perfection and served with seasonal vegetables', 'https://images.pexels.com/photos/361184/asparagus-steak-veal-steak-veal-361184.jpeg?auto=compress&cs=tinysrgb&w=800', 1),
  ('special', 'Dry-aged T-bone Steak', 'Exceptional dry-aged T-bone steak with rich marbling, cooked to your preference', 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=800', 2),
  ('special', 'Dry-aged Entrecôte Steak', 'Tender dry-aged entrecôte steak with perfect char and juicy interior, accompanied by chef''s selection', 'https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=800', 3);