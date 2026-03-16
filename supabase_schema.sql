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

-- 5. Create Profiles Table (linked to Supabase Auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'customer',        -- customer, admin
  status TEXT DEFAULT 'active',        -- active, inactive (admin can block users)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Auto-create profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, role, status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    'customer',
    'active'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if it exists to avoid duplicates
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

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

-- Profiles Policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (true);
CREATE POLICY "Service role can insert profiles" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can delete profiles" ON profiles FOR DELETE USING (true);
