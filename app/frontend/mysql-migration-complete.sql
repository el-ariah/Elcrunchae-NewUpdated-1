-- ============================================================
-- El Crunchae — COMPLETE MySQL Migration SQL
-- Run this in phpMyAdmin on Hostinger (hPanel → Databases → phpMyAdmin)
-- 
-- IMPORTANT: This replaces the old mysql-migration.sql
-- It includes ALL 20 products with CORRECT image paths
-- ============================================================

-- Drop existing tables if re-running (remove these lines if you want to keep existing data)
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

-- 1. USERS TABLE
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
-- DEFAULT ADMIN USER
-- Email: admin@elcrunchae.com  |  Password: admin123
-- CHANGE THIS PASSWORD after first login!
-- ============================================================
INSERT INTO users (email, password_hash, name, role) VALUES
('admin@elcrunchae.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'admin');

-- ============================================================
-- ALL 20 PRODUCTS WITH CORRECT IMAGE PATHS
-- 
-- Image paths use /assets/products/... which matches the actual
-- file structure in the dist/assets/products/ folder.
-- 
-- AFTER uploading to Hostinger /shop/, run the fix-image-paths
-- query at the bottom to prepend /shop/ to all paths.
-- ============================================================

-- === FRUITS (7 products) ===
INSERT INTO products (slug, name, category, category_label, description, long_description, weight, price, original_price, image, box_image, nutrition_highlights, shelf_life, how_to_use, badge, sku, stock_quantity, is_active, sort_order) VALUES
('strawberry', 'Freeze Dried Strawberry', 'fruits', 'Fruits',
 'Crispy, naturally sweet strawberries retaining 97% nutrients. Perfect for snacking, smoothies & desserts.',
 'Our premium freeze-dried strawberries are carefully selected at peak ripeness and processed using advanced freeze-drying technology to lock in flavor, color, and 97% of their original nutrients. Each piece delivers an intense burst of natural strawberry flavor with a satisfying crunch. No added sugar, no preservatives — just pure fruit goodness.',
 '50g', 299.00, 399.00,
 '/assets/products/fruits/strawberry.png',
 '/assets/products/fruits/strawberry-box.png',
 '["Rich in Vitamin C", "High in Antioxidants", "Natural Fiber", "Zero Added Sugar"]',
 '12 months',
 'Enjoy straight from the pack, add to cereals, smoothies, yogurt, or use as a topping for desserts and cakes.',
 'Bestseller', 'FD-FRT-STR-50', 100, 1, 1),

('mango', 'Freeze Dried Mango', 'fruits', 'Fruits',
 'Tropical Alphonso mango pieces, intensely flavorful with a light crispy texture.',
 'Experience the king of fruits in its most convenient form. Our freeze-dried mango slices are made from premium Alphonso mangoes, capturing their rich tropical flavor and vibrant golden color. Each piece is light, crispy, and bursting with natural sweetness — a guilt-free snack that tastes like summer all year round.',
 '50g', 349.00, 449.00,
 '/assets/products/fruits/mango.png',
 '',
 '["Rich in Vitamin A & C", "Natural Beta-Carotene", "Digestive Enzymes", "No Preservatives"]',
 '12 months',
 'Snack directly, blend into smoothies, add to trail mix, or use as a natural sweetener in baking.',
 'Popular', 'FD-FRT-MNG-50', 80, 1, 2),

('kiwi', 'Freeze Dried Kiwi', 'fruits', 'Fruits',
 'Tangy and refreshing kiwi slices with a delightful crunch and vibrant green color.',
 'Our freeze-dried kiwi slices retain the tangy-sweet flavor and stunning emerald green color of fresh kiwis. Packed with more Vitamin C than oranges, these crispy slices are a nutritional powerhouse. The unique sweet-tart flavor profile makes them irresistible for both kids and adults.',
 '40g', 329.00, 429.00,
 '/assets/products/fruits/kiwi.png',
 '/assets/products/fruits/kiwi-box.png',
 '["2x Vitamin C vs Oranges", "Rich in Vitamin K", "Natural Enzymes", "Low Calorie"]',
 '12 months',
 'Eat as a snack, add to fruit salads, cereals, or use as a garnish for cocktails and desserts.',
 '', 'FD-FRT-KWI-40', 90, 1, 3),

('blueberry', 'Freeze Dried Blueberry', 'fruits', 'Fruits',
 'Superfood blueberries packed with antioxidants, perfect for health-conscious snacking.',
 'These tiny powerhouses are freeze-dried at peak freshness to preserve their incredible antioxidant content. Our blueberries deliver a concentrated burst of sweet-tart flavor with every bite. Known as a superfood, they are perfect for boosting your daily nutrition while satisfying your snack cravings.',
 '40g', 399.00, 499.00,
 '/assets/products/fruits/blueberry.png',
 '/assets/products/fruits/blueberry-box.png',
 '["Highest Antioxidants", "Brain Health Support", "Rich in Vitamin K", "Anti-inflammatory"]',
 '12 months',
 'Add to oatmeal, yogurt, smoothie bowls, baking recipes, or enjoy as a standalone superfood snack.',
 'Superfood', 'FD-FRT-BLU-40', 70, 1, 4),

('dragon-fruit', 'Freeze Dried Dragon Fruit', 'fruits', 'Fruits',
 'Exotic pink dragon fruit with a subtle sweetness and stunning visual appeal.',
 'Our freeze-dried dragon fruit captures the exotic beauty and delicate flavor of this tropical superfruit. The vibrant magenta color and unique spotted texture make it a visual treat, while its subtle sweetness and nutritional benefits make it a smart snacking choice. Rich in prebiotics and natural enzymes.',
 '40g', 449.00, 549.00,
 '/assets/products/fruits/dragon-fruit-box.png',
 '',
 '["Rich in Prebiotics", "Natural Iron Source", "Vitamin C Boost", "Gut Health Support"]',
 '12 months',
 'Snack directly, add to smoothie bowls for color, mix into granola, or use as a decorative food topping.',
 'Exotic', 'FD-FRT-DRG-40', 60, 1, 5),

('pineapple', 'Freeze Dried Pineapple', 'fruits', 'Fruits',
 'Sweet and tangy pineapple rings with a satisfying crunch and tropical flavor.',
 'Transport yourself to the tropics with our freeze-dried pineapple. Each piece captures the intense sweet-tangy flavor of perfectly ripe pineapples. Rich in bromelain enzyme, these crispy tropical treats support digestion while delivering a burst of sunshine in every bite.',
 '50g', 299.00, 399.00,
 '/assets/products/fruits/pineapple-box.png',
 '',
 '["Bromelain Enzyme", "Vitamin C Rich", "Anti-inflammatory", "Digestive Aid"]',
 '12 months',
 'Enjoy as a snack, add to tropical trail mix, use in baking, or rehydrate for cooking and cocktails.',
 '', 'FD-FRT-PIN-50', 85, 1, 6),

('jamun', 'Freeze Dried Jamun', 'fruits', 'Fruits',
 'Traditional Indian black plum with a unique sweet-astringent taste and health benefits.',
 'Rediscover the beloved Indian jamun in a modern, convenient form. Our freeze-dried jamun preserves the distinctive deep purple color and unique sweet-astringent flavor of this traditional fruit. Known in Ayurveda for its blood sugar management properties, it is a heritage superfruit for the modern age.',
 '40g', 349.00, 449.00,
 '/assets/products/fruits/jamun.png',
 '',
 '["Blood Sugar Support", "Rich in Iron", "Ayurvedic Heritage", "Natural Antioxidants"]',
 '12 months',
 'Eat directly as a snack, add to desserts, or use in traditional Indian preparations and health drinks.',
 '', 'FD-FRT-JMN-40', 75, 1, 7);

-- === VEGETABLES (5 products) ===
INSERT INTO products (slug, name, category, category_label, description, long_description, weight, price, original_price, image, box_image, nutrition_highlights, shelf_life, how_to_use, badge, sku, stock_quantity, is_active, sort_order) VALUES
('beetroot', 'Freeze Dried Beetroot', 'vegetables', 'Vegetables',
 'Vibrant ruby-red beetroot chips packed with nitrates for energy and stamina.',
 'Our freeze-dried beetroot retains its stunning deep ruby color and earthy-sweet flavor. Rich in natural nitrates, iron, and folate, these crispy beetroot pieces are a favorite among athletes and health enthusiasts. Use them as a nutritious snack or a versatile ingredient in your kitchen.',
 '50g', 249.00, 349.00,
 '/assets/products/vegetables/beetroot.png',
 '',
 '["Natural Nitrates", "Iron Rich", "Folate Source", "Stamina Booster"]',
 '12 months',
 'Snack directly, add to salads, blend into smoothies, or crush as a natural food coloring for recipes.',
 'Energy Boost', 'FD-VEG-BET-50', 120, 1, 8),

('broccoli', 'Freeze Dried Broccoli', 'vegetables', 'Vegetables',
 'Nutrient-dense broccoli florets with a mild flavor, perfect for soups and meals.',
 'Our freeze-dried broccoli florets preserve the incredible nutritional profile of fresh broccoli in a convenient, shelf-stable form. Rich in sulforaphane, vitamins K and C, and dietary fiber, these florets rehydrate beautifully for cooking or can be enjoyed as a crunchy, healthy snack.',
 '50g', 229.00, 329.00,
 '/assets/products/vegetables/broccoli-box.png',
 '',
 '["Sulforaphane Rich", "Vitamin K & C", "High Fiber", "Cancer-Fighting Properties"]',
 '12 months',
 'Rehydrate with hot water for cooking, add to soups, stir-fries, pasta, or enjoy as a crunchy snack.',
 '', 'FD-VEG-BRC-50', 100, 1, 9),

('carrot', 'Freeze Dried Carrot', 'vegetables', 'Vegetables',
 'Sweet and crunchy carrot pieces rich in beta-carotene for eye health.',
 'Our freeze-dried carrots capture the natural sweetness and vibrant orange color of farm-fresh carrots. Packed with beta-carotene (which converts to Vitamin A), these crunchy pieces support eye health, immunity, and skin health. A versatile ingredient for both snacking and cooking.',
 '50g', 199.00, 299.00,
 '/assets/products/vegetables/carrot.png',
 '',
 '["Beta-Carotene Rich", "Eye Health Support", "Vitamin A Source", "Natural Sweetness"]',
 '12 months',
 'Snack directly, add to soups, stews, fried rice, or rehydrate for use in salads and cooking.',
 '', 'FD-VEG-CRT-50', 130, 1, 10),

('sweet-corn', 'Freeze Dried Sweet Corn', 'vegetables', 'Vegetables',
 'Golden sweet corn kernels with a natural buttery sweetness kids love.',
 'Our freeze-dried sweet corn kernels deliver the satisfying pop and natural buttery sweetness of freshly harvested corn. Each golden kernel is perfectly preserved to maintain its flavor, color, and nutritional value. A family-friendly snack that is especially popular with children.',
 '50g', 199.00, 279.00,
 '/assets/products/vegetables/sweet-corn.png',
 '',
 '["Natural Fiber", "B Vitamins", "Lutein for Eyes", "Kid-Friendly"]',
 '12 months',
 'Enjoy as a crunchy snack, add to salads, soups, chaats, or rehydrate for use in cooking.',
 'Kids Favorite', 'FD-VEG-CRN-50', 150, 1, 11),

('green-peas', 'Freeze Dried Green Peas', 'vegetables', 'Vegetables',
 'Protein-rich green peas with a satisfying crunch and natural sweetness.',
 'Our freeze-dried green peas are a protein-packed snacking revolution. Each pea delivers a satisfying crunch with a naturally sweet flavor. Rich in plant protein, fiber, and essential vitamins, they are an excellent alternative to processed snacks for the whole family.',
 '50g', 179.00, 259.00,
 '/assets/products/vegetables/green-peas.png',
 '',
 '["Plant Protein", "High Fiber", "Vitamin K", "Iron Source"]',
 '12 months',
 'Snack directly, add to trail mix, use in pulao, soups, or crush as a coating for other foods.',
 '', 'FD-VEG-PEA-50', 160, 1, 12);

-- === COOKED FOOD (6 products) ===
INSERT INTO products (slug, name, category, category_label, description, long_description, weight, price, original_price, image, box_image, nutrition_highlights, shelf_life, how_to_use, badge, sku, stock_quantity, is_active, sort_order) VALUES
('chicken-biryani', 'Freeze Dried Chicken Biryani', 'cooked-food', 'Cooked Food',
 'Authentic Hyderabadi-style chicken biryani — just add hot water for a complete meal.',
 'Experience the royal flavors of authentic Hyderabadi chicken biryani in minutes. Our freeze-dried biryani preserves the aromatic spices, tender chicken pieces, and perfectly cooked basmati rice. Simply add hot water and wait 5 minutes for a restaurant-quality meal anywhere, anytime. Perfect for travel, camping, office, or emergency food supply.',
 '100g', 299.00, 399.00,
 '/assets/products/cooked-food/chicken-biryani.png',
 '',
 '["Complete Meal", "High Protein", "Authentic Spices", "No Preservatives"]',
 '24 months',
 'Open the pack, add 150ml hot water, close and wait 5 minutes. Stir gently and enjoy your meal!',
 'Bestseller', 'FD-CKD-BRY-100', 60, 1, 13),

('prawn-biryani', 'Freeze Dried Prawn Biryani', 'cooked-food', 'Cooked Food',
 'Coastal-style prawn biryani with aromatic spices — ready in just 5 minutes.',
 'Savor the coastal flavors of prawn biryani without the hassle of cooking. Our freeze-dried version captures the essence of fresh prawns, fragrant basmati rice, and a blend of traditional spices. Each pack delivers a complete, satisfying meal that is perfect for seafood lovers on the go.',
 '100g', 349.00, 449.00,
 '/assets/products/cooked-food/prawn-biryani.png',
 '',
 '["Omega-3 Fatty Acids", "High Protein", "Complete Meal", "Authentic Coastal Recipe"]',
 '24 months',
 'Open the pack, add 150ml hot water, close and wait 5 minutes. Stir gently and enjoy!',
 'Premium', 'FD-CKD-PRW-100', 50, 1, 14),

('chole-bhatura', 'Freeze Dried Chole Bhatura', 'cooked-food', 'Cooked Food',
 'North Indian classic chole bhatura — rich, spicy chickpea curry ready in minutes.',
 'Enjoy the beloved North Indian street food classic anywhere in the world. Our freeze-dried chole bhatura features rich, spicy chickpea curry with authentic Punjabi flavors. The perfectly balanced blend of spices creates a hearty, satisfying meal that tastes just like homemade.',
 '80g', 249.00, 349.00,
 '/assets/products/cooked-food/chole-bhatura.png',
 '',
 '["Plant Protein", "High Fiber", "Iron Rich", "Traditional Recipe"]',
 '24 months',
 'Add 120ml hot water to the pack, wait 5 minutes, stir well. Serve with bread or rice.',
 '', 'FD-CKD-CHB-80', 70, 1, 15),

('dal-makhni', 'Freeze Dried Dal Makhni', 'cooked-food', 'Cooked Food',
 'Creamy, buttery dal makhni with slow-cooked flavors — comfort food made instant.',
 'Our freeze-dried dal makhni captures the rich, creamy essence of this beloved Punjabi classic. Made with black lentils and kidney beans slow-cooked with butter and cream, then freeze-dried to perfection. Each serving delivers the authentic restaurant-quality taste of dal makhni in just 5 minutes.',
 '80g', 229.00, 329.00,
 '/assets/products/cooked-food/dal-makhni.png',
 '',
 '["Plant Protein", "Creamy & Rich", "Slow-Cooked Flavor", "Comfort Food"]',
 '24 months',
 'Add 120ml hot water, wait 5 minutes, stir well. Best enjoyed with rice, roti, or naan.',
 'Comfort Food', 'FD-CKD-DLM-80', 80, 1, 16),

('palak-paneer', 'Freeze Dried Palak Paneer', 'cooked-food', 'Cooked Food',
 'Creamy spinach and cottage cheese curry — a nutritious vegetarian delight.',
 'Our freeze-dried palak paneer combines the goodness of fresh spinach with soft paneer cubes in a creamy, mildly spiced gravy. This vegetarian favorite is packed with iron, calcium, and protein. Simply add hot water for a wholesome, restaurant-quality meal that is both nutritious and delicious.',
 '80g', 249.00, 349.00,
 '/assets/products/cooked-food/palak-paneer.png',
 '',
 '["Iron & Calcium", "High Protein", "Vegetarian", "Spinach Superfood"]',
 '24 months',
 'Add 120ml hot water, wait 5 minutes, stir gently. Serve with rice, roti, or naan.',
 '', 'FD-CKD-PPR-80', 75, 1, 17),

('pav-bhaji', 'Freeze Dried Pav Bhaji', 'cooked-food', 'Cooked Food',
 'Mumbai iconic street food — spicy mixed vegetable curry ready in minutes.',
 'Bring the taste of Mumbai streets to your table with our freeze-dried pav bhaji. This iconic dish features a rich, buttery blend of mashed vegetables with aromatic pav bhaji masala. Each pack delivers the authentic street-food experience with the convenience of instant preparation.',
 '80g', 229.00, 329.00,
 '/assets/products/cooked-food/pav-bhaji.png',
 '',
 '["Mixed Vegetables", "Rich in Fiber", "Mumbai Street Food", "Buttery Flavor"]',
 '24 months',
 'Add 100ml hot water, wait 5 minutes, stir well. Serve with buttered pav or bread.',
 '', 'FD-CKD-PVB-80', 90, 1, 18);

-- ============================================================
-- AFTER uploading to Hostinger under /shop/, run this to fix paths:
-- ============================================================
-- UPDATE products SET image = CONCAT('/shop', image) WHERE image NOT LIKE '/shop%' AND image != '';
-- UPDATE products SET box_image = CONCAT('/shop', box_image) WHERE box_image NOT LIKE '/shop%' AND box_image != '' AND box_image IS NOT NULL;