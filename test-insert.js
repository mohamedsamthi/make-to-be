import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qawcnogudduhjefsrbxo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhd2Nub2d1ZGR1aGplZnNyYnhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3ODYxNTQsImV4cCI6MjA4ODM2MjE1NH0.Hzu4o_HQ8j0X_PWTWF4Qs8V3AflDdNz8CPuO9woha7o'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testInsert() {
  const productData = {
    name: 'Test Name',
    description: 'Test Description',
    price: 100,
    discount_price: null,
    category: 'watches',
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'],
    sizes: [],
    colors: [],
    stock: 10,
    featured: false
  }
  
  const { data, error } = await supabase.from('products').insert([productData]).select().single()
  console.log('Result:', { data, error })
}

testInsert()
