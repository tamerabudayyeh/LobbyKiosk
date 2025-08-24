/*
  # Fix Row Level Security policies for events and ads tables

  1. Security Updates
    - Add specific INSERT policy for authenticated users on events table
    - Add specific UPDATE policy for authenticated users on events table
    - Add specific INSERT policy for authenticated users on ads table
    - Add specific UPDATE policy for authenticated users on ads table
    - Remove overly broad "ALL" policies and replace with specific ones
    - Keep existing SELECT policies for public access to active records

  2. Changes Made
    - Drop existing broad policies that may be causing conflicts
    - Create granular policies for each operation type
    - Ensure authenticated users can perform all CRUD operations
    - Maintain public read access to active records only
*/

-- Drop existing policies that might be too broad or conflicting
DROP POLICY IF EXISTS "Authenticated users can manage events" ON events;
DROP POLICY IF EXISTS "Authenticated users can manage ads" ON ads;

-- Create specific policies for events table
CREATE POLICY "Authenticated users can insert events"
  ON events
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update events"
  ON events
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete events"
  ON events
  FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can select all events"
  ON events
  FOR SELECT
  TO authenticated
  USING (true);

-- Create specific policies for ads table
CREATE POLICY "Authenticated users can insert ads"
  ON ads
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update ads"
  ON ads
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete ads"
  ON ads
  FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can select all ads"
  ON ads
  FOR SELECT
  TO authenticated
  USING (true);

-- Ensure the existing public read policies remain (these should already exist)
-- But recreate them to be sure they're properly configured
DROP POLICY IF EXISTS "Public can read active events" ON events;
DROP POLICY IF EXISTS "Public can read active ads" ON ads;

CREATE POLICY "Public can read active events"
  ON events
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Public can read active ads"
  ON ads
  FOR SELECT
  TO public
  USING (is_active = true);