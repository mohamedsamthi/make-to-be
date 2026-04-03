import { createClient } from '@supabase/supabase-js'

/* Vercel / local: set VITE_SUPABASE_* in Project → Environment Variables (Production + Preview) */
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://qawcnogudduhjefsrbxo.supabase.co'
const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhd2Nub2d1ZGR1aGplZnNyYnhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3ODYxNTQsImV4cCI6MjA4ODM2MjE1NH0.Hzu4o_HQ8j0X_PWTWF4Qs8V3AflDdNz8CPuO9woha7o'

// Main client - used for auth operations (login, signup, session)
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'sb-mtb-v2-auth',
  },
})

// Data-only client - NO auth, NO Web Locks, guaranteed fast queries
// This ensures products always load even if auth session is stuck
export const supabaseData = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
})
