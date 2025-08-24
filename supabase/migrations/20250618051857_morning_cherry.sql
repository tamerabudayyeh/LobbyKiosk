/*
  # Create ads table

  1. New Tables
    - `ads`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text, optional)
      - `image_url` (text, required)
      - `duration` (integer, required - duration in seconds)
      - `is_active` (boolean, default true)
      - `display_order` (integer, default 0)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `ads` table
    - Add policy for public read access to active ads
    - Add policy for authenticated users to manage all ads
*/

CREATE TABLE IF NOT EXISTS ads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text NOT NULL,
  duration integer NOT NULL,
  is_active boolean DEFAULT true NOT NULL,
  display_order integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE ads ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active ads
CREATE POLICY "Public can read active ads"
  ON ads
  FOR SELECT
  TO public
  USING (is_active = true);

-- Allow authenticated users to manage all ads
CREATE POLICY "Authenticated users can manage ads"
  ON ads
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create trigger to automatically update updated_at on ads table
CREATE TRIGGER update_ads_updated_at
  BEFORE UPDATE ON ads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();