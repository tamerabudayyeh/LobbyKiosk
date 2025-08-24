import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Create a placeholder client if environment variables are not set
export const supabase = createClient(supabaseUrl, supabaseKey);

// Export a flag to check if Supabase is properly configured
export const isSupabaseConfigured = !!(
  import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_ANON_KEY &&
  import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co'
);