/*
  # Create events table

  1. New Tables
    - `events`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text, required)
      - `start_time` (timestamptz, required)
      - `end_time` (timestamptz, required)
      - `location` (text, required)
      - `image_url` (text, optional)
      - `is_active` (boolean, default true)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `events` table
    - Add policy for public read access to active events
    - Add policy for authenticated users to manage all events
*/

CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  location text NOT NULL,
  image_url text,
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active events
CREATE POLICY "Public can read active events"
  ON events
  FOR SELECT
  TO public
  USING (is_active = true);

-- Allow authenticated users to manage all events
CREATE POLICY "Authenticated users can manage events"
  ON events
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at on events table
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();