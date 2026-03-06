-- Make To Be - E-commerce Supabase Schema
-- Run this in the Supabase SQL Editor

-- 1. Create Products Table
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  discount_price NUMERIC,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  sizes TEXT[] DEFAULT '{}',
  colors TEXT[] DEFAULT '{}',
  stock INTEGER NOT NULL DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  rating NUMERIC DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Orders Table
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  customer_address TEXT NOT NULL,
  total NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',          -- pending, confirmed, processing, shipped, delivered, cancelled
  payment_status TEXT DEFAULT 'pending',  -- pending, paid, refunded
  items JSONB NOT NULL,                   -- [{ product_id, product_name, quantity, price, size, color }]
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Reviews Table
CREATE TABLE reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  admin_reply TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Promotions Table
CREATE TABLE promotions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  discount_percentage INTEGER DEFAULT 0,
  banner_color TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

-- 5. Create Policies (Allow Public Read, Admin All)
-- In a real app, you would restrict INSERT/UPDATE/DELETE to authenticated admins only.
-- For this demo, we can allow public select and let your admin panel use the Service Role key or public access.

-- Products Policies
CREATE POLICY "Public can view active products" ON products FOR SELECT USING (true);
CREATE POLICY "Admins can insert products" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update products" ON products FOR UPDATE USING (true);
CREATE POLICY "Admins can delete products" ON products FOR DELETE USING (true);

-- Orders Policies
CREATE POLICY "Public can insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view their own orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Admins can update orders" ON orders FOR UPDATE USING (true);
CREATE POLICY "Admins can delete orders" ON orders FOR DELETE USING (true);

-- Reviews Policies
CREATE POLICY "Public can view reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Public can insert reviews" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update reviews" ON reviews FOR UPDATE USING (true);
CREATE POLICY "Admins can delete reviews" ON reviews FOR DELETE USING (true);

-- Promotions Policies
CREATE POLICY "Public can view active promotions" ON promotions FOR SELECT USING (true);
CREATE POLICY "Admins can manage promotions" ON promotions FOR ALL USING (true);
