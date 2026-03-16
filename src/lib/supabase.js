import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qawcnogudduhjefsrbxo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhd2Nub2d1ZGR1aGplZnNyYnhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3ODYxNTQsImV4cCI6MjA4ODM2MjE1NH0.Hzu4o_HQ8j0X_PWTWF4Qs8V3AflDdNz8CPuO9woha7o'

// Create a single supabase client with auth lock fix
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    // Increase lock timeout to prevent "Lock broken by steal" errors
    lock: { acquireTimeout: 15000 },
    // Use localStorage instead of default to avoid lock contention
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'sb-make-to-be-auth',
  },
  // Disable realtime global config to reduce connections
  realtime: {
    params: {
      eventsPerSecond: 2,
    },
  },
})
