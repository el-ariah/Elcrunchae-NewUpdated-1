-- ============================================================
-- El Crunchae — Supabase Migration SQL
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- 1. PRODUCTS TABLE (public, no RLS needed for reads)
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  category_label TEXT NOT NULL,
  description TEXT DEFAULT '',
  long_description TEXT DEFAULT '',
  weight TEXT DEFAULT '',
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  original_price NUMERIC(10,2),
  image TEXT DEFAULT '',
  box_image TEXT DEFAULT '',
  nutrition_highlights TEXT DEFAULT '[]',
  shelf_life TEXT DEFAULT '',
  how_to_use TEXT DEFAULT '',
  badge TEXT DEFAULT '',
  sku TEXT DEFAULT '',
  stock_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Anyone can read products
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

-- Only authenticated users with admin role can modify
CREATE POLICY "Only admins can insert products"
  ON products FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only admins can update products"
  ON products FOR UPDATE
  USING (auth.role() = 'authenticated');


-- 2. REVIEWS TABLE (user-specific writes, public reads)
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT DEFAULT '',
  reviewer_name TEXT DEFAULT 'Anonymous',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read reviews
CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT
  USING (true);

-- Authenticated users can create their own reviews
CREATE POLICY "Users can create their own reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);


-- 3. ORDERS TABLE (user-specific)
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'pending',
  stripe_session_id TEXT,
  subtotal NUMERIC(10,2) DEFAULT 0,
  shipping_fee NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) DEFAULT 0,
  shipping_name TEXT DEFAULT '',
  shipping_address TEXT DEFAULT '',
  shipping_city TEXT DEFAULT '',
  shipping_state TEXT DEFAULT '',
  shipping_pincode TEXT DEFAULT '',
  shipping_phone TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Users can only see their own orders
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own orders
CREATE POLICY "Users can create their own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own orders
CREATE POLICY "Users can update their own orders"
  ON orders FOR UPDATE
  USING (auth.uid() = user_id);


-- 4. ORDER_ITEMS TABLE (user-specific)
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  product_name TEXT DEFAULT '',
  product_image TEXT DEFAULT '',
  quantity INTEGER DEFAULT 1,
  unit_price NUMERIC(10,2) DEFAULT 0,
  total_price NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Users can only see their own order items
CREATE POLICY "Users can view their own order items"
  ON order_items FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own order items
CREATE POLICY "Users can create their own order items"
  ON order_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);


-- ============================================================
-- OPTIONAL: Insert sample product data
-- Uncomment and modify as needed
-- ============================================================
/*
INSERT INTO products (slug, name, category, category_label, description, long_description, weight, price, original_price, image, box_image, nutrition_highlights, shelf_life, how_to_use, badge, sku, stock_quantity, is_active, sort_order)
VALUES
  ('freeze-dried-strawberry', 'Freeze Dried Strawberry', 'fruits', 'Freeze Dried Fruits', 'Crispy, naturally sweet strawberries', 'Premium freeze-dried strawberries...', '50g', 299, 399, '/images/FreezeDriedStrawberry.jpg', '/images/FreezeDriedStrawberry.jpg', '["Rich in Vitamin C", "High in Antioxidants"]', '25+ Years', 'Eat as a snack or add to cereals', 'Bestseller', 'FD-STR-50', 100, true, 1);
*/