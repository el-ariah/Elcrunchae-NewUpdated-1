-- ============================================================
-- El Crunchae — MySQL Migration SQL
-- Run this in phpMyAdmin on Hostinger (hPanel → Databases → phpMyAdmin)
-- Database: u233052549_el-ariah.com
-- ============================================================

-- 1. USERS TABLE (for authentication)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) DEFAULT '',
  role ENUM('user', 'admin') DEFAULT 'user',
  last_login DATETIME DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  category_label VARCHAR(255) NOT NULL,
  description TEXT DEFAULT NULL,
  long_description TEXT DEFAULT NULL,
  weight VARCHAR(50) DEFAULT '',
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  original_price DECIMAL(10,2) DEFAULT NULL,
  image VARCHAR(500) DEFAULT '',
  box_image VARCHAR(500) DEFAULT '',
  nutrition_highlights JSON DEFAULT NULL,
  shelf_life VARCHAR(100) DEFAULT '',
  how_to_use TEXT DEFAULT NULL,
  badge VARCHAR(100) DEFAULT '',
  sku VARCHAR(100) DEFAULT '',
  stock_quantity INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  sort_order INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_slug (slug),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  rating TINYINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT DEFAULT NULL,
  reviewer_name VARCHAR(255) DEFAULT 'Anonymous',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
  stripe_session_id VARCHAR(255) DEFAULT NULL,
  subtotal DECIMAL(10,2) DEFAULT 0.00,
  shipping_fee DECIMAL(10,2) DEFAULT 0.00,
  total DECIMAL(10,2) DEFAULT 0.00,
  shipping_name VARCHAR(255) DEFAULT '',
  shipping_address TEXT DEFAULT NULL,
  shipping_city VARCHAR(255) DEFAULT '',
  shipping_state VARCHAR(255) DEFAULT '',
  shipping_pincode VARCHAR(20) DEFAULT '',
  shipping_phone VARCHAR(20) DEFAULT '',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. ORDER_ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT DEFAULT NULL,
  product_name VARCHAR(255) DEFAULT '',
  product_image VARCHAR(500) DEFAULT '',
  quantity INT DEFAULT 1,
  unit_price DECIMAL(10,2) DEFAULT 0.00,
  total_price DECIMAL(10,2) DEFAULT 0.00,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
  INDEX idx_order_id (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- INSERT DEFAULT ADMIN USER
-- Password: admin123 (change this immediately after first login!)
-- The hash below is for 'admin123' using PHP password_hash with BCRYPT
-- ============================================================
INSERT INTO users (email, password_hash, name, role) VALUES
('admin@elcrunchae.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'admin');

-- ============================================================
-- SAMPLE PRODUCT DATA
-- ============================================================
INSERT INTO products (slug, name, category, category_label, description, long_description, weight, price, original_price, image, nutrition_highlights, shelf_life, how_to_use, badge, sku, stock_quantity, is_active, sort_order) VALUES
('freeze-dried-strawberry', 'Freeze Dried Strawberry', 'fruits', 'Freeze Dried Fruits', 'Crispy, naturally sweet strawberries with 97% nutrients retained', 'Our premium freeze-dried strawberries are carefully selected from the finest farms and processed using advanced freeze-drying technology to preserve their natural sweetness, vibrant color, and nutritional value. Each piece retains up to 97% of the original nutrients.', '50g', 299.00, 399.00, '/images/FreezeDriedStrawberry.jpg', '["Rich in Vitamin C", "High in Antioxidants", "Natural Fiber Source"]', '25+ Years', 'Enjoy as a snack, add to cereals, smoothies, yogurt, or use in baking and desserts.', 'Bestseller', 'FD-FRT-STR-50', 100, 1, 1),

('freeze-dried-mango', 'Freeze Dried Mango', 'fruits', 'Freeze Dried Fruits', 'Tropical mango slices bursting with natural flavor', 'Premium Alphonso mangoes, freeze-dried to perfection. Each slice captures the intense tropical flavor and aroma of fresh mangoes while providing a satisfying crunch.', '50g', 349.00, 449.00, '/images/FreezeDriedMango.jpg', '["Rich in Vitamin A", "Good Source of Fiber", "Natural Energy Boost"]', '25+ Years', 'Perfect as a standalone snack, in trail mixes, or as a topping for ice cream and desserts.', 'New', 'FD-FRT-MNG-50', 80, 1, 2),

('freeze-dried-banana', 'Freeze Dried Banana', 'fruits', 'Freeze Dried Fruits', 'Crunchy banana chips with intense natural sweetness', 'Our freeze-dried bananas offer a delightful crunch with concentrated banana flavor. Rich in potassium and natural energy, they make the perfect healthy snack.', '50g', 249.00, 329.00, '/images/FreezeDriedBananas.jpg', '["High in Potassium", "Natural Energy", "Good Source of Vitamin B6"]', '25+ Years', 'Eat directly as a snack, blend into smoothies, or crush and use as a topping.', '', 'FD-FRT-BAN-50', 120, 1, 3),

('freeze-dried-peas', 'Freeze Dried Green Peas', 'vegetables', 'Freeze Dried Vegetables', 'Crispy green peas packed with plant protein', 'Premium green peas freeze-dried to maintain their vibrant color, sweet flavor, and nutritional benefits. A protein-rich snack that the whole family will love.', '100g', 199.00, 279.00, '/images/FreezeDriedPeas.jpg', '["High in Plant Protein", "Rich in Iron", "Good Source of Fiber"]', '25+ Years', 'Snack directly, add to soups, salads, or rehydrate for cooking.', '', 'FD-VEG-PEA-100', 150, 1, 4),

('freeze-dried-corn', 'Freeze Dried Sweet Corn', 'vegetables', 'Freeze Dried Vegetables', 'Sweet and crunchy corn kernels', 'Naturally sweet corn kernels freeze-dried for maximum crunch and flavor retention. Perfect for snacking or adding to your favorite recipes.', '100g', 179.00, 249.00, '/images/FreezeDriedCorn.jpg', '["Good Source of Fiber", "Contains Antioxidants", "Natural Sweetness"]', '25+ Years', 'Enjoy as a snack, add to salads, soups, or rehydrate for cooking.', '', 'FD-VEG-CRN-100', 200, 1, 5),

('freeze-dried-biryani', 'Freeze Dried Chicken Biryani', 'cooked-food', 'Freeze Dried Cooked Food', 'Authentic Hyderabadi biryani — ready in 5 minutes', 'Experience the rich flavors of authentic Hyderabadi chicken biryani, freeze-dried for convenience. Simply add hot water and enjoy a restaurant-quality meal anywhere.', '150g', 449.00, 599.00, '/images/FreezeDriedBiryani.jpg', '["Complete Meal", "High in Protein", "Rich in Spices & Herbs"]', '25+ Years', 'Add 200ml of hot water, stir well, cover and wait 5 minutes. Your biryani is ready!', 'Popular', 'FD-CKD-BRY-150', 60, 1, 6);