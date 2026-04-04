-- Make To Be - E-commerce Supabase Schema
-- Run this in the Supabase SQL Editor

-- UUID helper (used by this schema and the app)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

-- 4b. Create Promotional Videos Table (used by FeaturedVideo & PromoVideoPage)
-- NOTE: The frontend expects:
-- - id, title, url
-- - is_active boolean
-- - original_audio boolean
-- - promoted_products (array of product IDs) for video-wise promotions
CREATE TABLE promotional_videos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  original_audio BOOLEAN DEFAULT true,
  promoted_products UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4c. Create Messages Table (used by ContactPage, AdminMessagesPage, ProfilePage)
-- NOTE: The frontend expects:
-- - id, name, email, phone, message
-- - status: unread | replied | read
-- - chat_history: [{ sender, message, time, ... }]
-- - admin_reply text
-- - readbyuser / readbyadmin booleans
-- - user_id (optional)
CREATE TABLE messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  chat_history JSONB DEFAULT '[]'::jsonb,
  admin_reply TEXT,
  readbyadmin BOOLEAN DEFAULT false,
  readbyuser BOOLEAN DEFAULT false,
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
ALTER TABLE promotional_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Storage uses its own RLS controls
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

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

-- Promotional Videos Policies
CREATE POLICY "Public can view promotional videos" ON promotional_videos FOR SELECT USING (true);
CREATE POLICY "Public can manage promotional videos" ON promotional_videos FOR ALL USING (true) WITH CHECK (true);

-- Messages Policies
CREATE POLICY "Public can view messages" ON messages FOR SELECT USING (true);
CREATE POLICY "Public can insert messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update messages" ON messages FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public can delete messages" ON messages FOR DELETE USING (true);

-- Profiles Policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (true);
CREATE POLICY "Service role can insert profiles" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can delete profiles" ON profiles FOR DELETE USING (true);

-- Storage Policies (uploads & reads for the two buckets used by the app)
-- This app uploads images/videos directly from the frontend admin UI.
-- The existing project uses very permissive policies (client-side admin auth),
-- so these policies match that behavior for compatibility.
-- Buckets themselves are created by server/setup_supabase.js (run once).
DROP POLICY IF EXISTS "Public can read products bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public can write products bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public can read promotions bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public can write promotions bucket" ON storage.objects;

CREATE POLICY "Public can read products bucket" ON storage.objects
FOR SELECT USING (bucket_id = 'products');

CREATE POLICY "Public can write products bucket" ON storage.objects
FOR ALL USING (bucket_id = 'products') WITH CHECK (bucket_id = 'products');

CREATE POLICY "Public can read promotions bucket" ON storage.objects
FOR SELECT USING (bucket_id = 'promotions');

CREATE POLICY "Public can write promotions bucket" ON storage.objects
FOR ALL USING (bucket_id = 'promotions') WITH CHECK (bucket_id = 'promotions');
