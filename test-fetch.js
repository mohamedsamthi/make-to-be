import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qawcnogudduhjefsrbxo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhd2Nub2d1ZGR1aGplZnNyYnhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3ODYxNTQsImV4cCI6MjA4ODM2MjE1NH0.Hzu4o_HQ8j0X_PWTWF4Qs8V3AflDdNz8CPuO9woha7o'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testFetch() {
  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false })
  console.log(JSON.stringify(data, null, 2))
}

testFetch()
