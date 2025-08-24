/*
  # Disable Row Level Security

  1. Security Changes
    - Disable RLS on events table
    - Disable RLS on ads table
    - Remove all existing RLS policies
  
  2. Purpose
    - Allow unrestricted access to events and ads tables
    - Fix authentication errors in admin panel
*/

-- First, drop all policies before disabling RLS
DO $$
BEGIN
  -- Drop policies for events table
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'Authenticated users can delete events') THEN
    DROP POLICY "Authenticated users can delete events" ON events;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'Authenticated users can insert events') THEN
    DROP POLICY "Authenticated users can insert events" ON events;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'Authenticated users can select all events') THEN
    DROP POLICY "Authenticated users can select all events" ON events;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'Authenticated users can update events') THEN
    DROP POLICY "Authenticated users can update events" ON events;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'Public can read active events') THEN
    DROP POLICY "Public can read active events" ON events;
  END IF;

  -- Drop policies for ads table
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ads' AND policyname = 'Authenticated users can delete ads') THEN
    DROP POLICY "Authenticated users can delete ads" ON ads;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ads' AND policyname = 'Authenticated users can insert ads') THEN
    DROP POLICY "Authenticated users can insert ads" ON ads;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ads' AND policyname = 'Authenticated users can select all ads') THEN
    DROP POLICY "Authenticated users can select all ads" ON ads;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ads' AND policyname = 'Authenticated users can update ads') THEN
    DROP POLICY "Authenticated users can update ads" ON ads;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ads' AND policyname = 'Public can read active ads') THEN
    DROP POLICY "Public can read active ads" ON ads;
  END IF;
END $$;

-- Now disable RLS on both tables
ALTER TABLE IF EXISTS events DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ads DISABLE ROW LEVEL SECURITY;