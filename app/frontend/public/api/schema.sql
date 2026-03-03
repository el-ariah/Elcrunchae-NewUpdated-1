-- ============================================================
-- El Crunchae — MySQL Schema for Hostinger
-- Run this SQL in your Hostinger phpMyAdmin to set up the database.
-- ============================================================

-- Users table (JWT auth)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL DEFAULT 'Customer',
    role ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    category ENUM('fruits', 'vegetables', 'cooked-food') NOT NULL DEFAULT 'fruits',
    category_label VARCHAR(100) NOT NULL DEFAULT 'Fruits',
    description TEXT,
    long_description TEXT,
    weight VARCHAR(50) DEFAULT '50g',
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    original_price DECIMAL(10,2) DEFAULT 0,
    image VARCHAR(500) DEFAULT '',
    box_image VARCHAR(500) DEFAULT '',
    nutrition_highlights JSON DEFAULT NULL,
    shelf_life VARCHAR(100) DEFAULT '12 months',
    how_to_use TEXT,
    badge VARCHAR(50) DEFAULT '',
    sku VARCHAR(50) DEFAULT '',
    stock_quantity INT DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    sort_order INT DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_active (is_active),
    INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    reviewer_name VARCHAR(100) NOT NULL DEFAULT 'Anonymous',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_product (product_id),
    INDEX idx_user (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    status ENUM('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    shipping_fee DECIMAL(10,2) DEFAULT 0,
    shipping_name VARCHAR(100) DEFAULT '',
    shipping_address TEXT,
    shipping_city VARCHAR(100) DEFAULT '',
    shipping_state VARCHAR(100) DEFAULT '',
    shipping_pincode VARCHAR(10) DEFAULT '',
    shipping_phone VARCHAR(20) DEFAULT '',
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
    razorpay_order_id VARCHAR(100) DEFAULT '',
    razorpay_payment_id VARCHAR(100) DEFAULT '',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_razorpay (razorpay_order_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT DEFAULT 0,
    product_name VARCHAR(200) NOT NULL,
    product_image VARCHAR(500) DEFAULT '',
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    INDEX idx_order (order_id),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Insert default admin user (password: admin123)
-- CHANGE THIS PASSWORD after first login!
-- ============================================================
INSERT INTO users (email, password_hash, name, role, created_at) VALUES
('admin@elcrunchae.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'admin', NOW())
ON DUPLICATE KEY UPDATE name = name;
-- Note: The password hash above is for "password" — change it!
-- To generate a new hash, use: php -r "echo password_hash('your_password', PASSWORD_DEFAULT);"

-- ============================================================
-- Insert sample products (same as existing data)
-- ============================================================
INSERT INTO products (slug, name, category, category_label, description, long_description, weight, price, original_price, image, box_image, nutrition_highlights, shelf_life, how_to_use, badge, sku, stock_quantity, is_active, sort_order) VALUES
('strawberry', 'Freeze Dried Strawberry', 'fruits', 'Fruits', 'Crispy, naturally sweet strawberries with 97% nutrients retained.', 'Our premium freeze-dried strawberries are picked at peak ripeness and processed using advanced freeze-drying technology. Each berry retains its vibrant color, natural sweetness, and up to 97% of its original nutrients. Perfect as a healthy snack, cereal topper, or baking ingredient.', '50g', 349, 449, '/images/Strawberry.jpg', '/images/Strawberry.jpg', '["Rich in Vitamin C","High in Antioxidants","Natural Fiber","Low Calorie"]', '24 months', 'Enjoy straight from the pack, add to cereals, yogurt, smoothies, or use in baking. Store in a cool, dry place.', 'Bestseller', 'FD-FRT-STR-50', 100, 1, 1),
('mango', 'Freeze Dried Mango', 'fruits', 'Fruits', 'Alphonso mango slices with intense tropical flavor.', 'Made from premium Alphonso mangoes, our freeze-dried mango slices deliver an explosion of tropical flavor in every bite. The advanced freeze-drying process preserves the natural sweetness and nutritional profile of fresh mangoes.', '50g', 399, 499, '/images/Mango.jpg', '/images/Mango.jpg', '["Rich in Vitamin A","High in Vitamin C","Natural Fiber","Potassium Rich"]', '24 months', 'Enjoy as a snack, add to trail mix, desserts, or smoothies. Store in a cool, dry place.', 'Popular', 'FD-FRT-MNG-50', 80, 1, 2),
('banana', 'Freeze Dried Banana', 'fruits', 'Fruits', 'Crispy banana chips with natural sweetness.', 'Our freeze-dried banana slices offer a delightful crunch with the natural sweetness of ripe bananas. Rich in potassium and essential nutrients, they make a perfect on-the-go snack.', '50g', 249, 349, '/images/photo1772420462.jpg', '/images/Banana.jpg', '["High in Potassium","Natural Energy","Vitamin B6","Dietary Fiber"]', '24 months', 'Eat directly, add to cereal, or blend into smoothies. Store in a cool, dry place.', '', 'FD-FRT-BAN-50', 120, 1, 3),
('blueberry', 'Freeze Dried Blueberry', 'fruits', 'Fruits', 'Antioxidant-rich blueberries with a satisfying crunch.', 'Premium blueberries freeze-dried to perfection. Each berry bursts with flavor and is packed with antioxidants, making them one of the healthiest snack options available.', '30g', 449, 549, '/images/Blueberries.jpg', '/images/Blueberry.jpg', '["Super Antioxidant","Rich in Vitamin K","Brain Health","Low Sugar"]', '24 months', 'Perfect for snacking, adding to yogurt, oatmeal, or baking. Store in a cool, dry place.', 'Premium', 'FD-FRT-BLU-30', 60, 1, 4),
('sweet-corn', 'Freeze Dried Sweet Corn', 'vegetables', 'Vegetables', 'Crunchy sweet corn kernels, perfect for snacking.', 'Our freeze-dried sweet corn retains the natural sweetness and crunch of fresh corn. A versatile ingredient that can be enjoyed as a snack or added to soups, salads, and recipes.', '50g', 199, 299, '/images/SweetCorn.jpg', '/images/SweetCorn.jpg', '["Natural Fiber","Vitamin B Complex","Antioxidants","Iron Rich"]', '24 months', 'Snack directly, add to soups, salads, or rehydrate for cooking. Store in a cool, dry place.', 'Value Pack', 'FD-VEG-CRN-50', 150, 1, 5),
('peas', 'Freeze Dried Green Peas', 'vegetables', 'Vegetables', 'Crispy green peas packed with protein and fiber.', 'Premium green peas freeze-dried to preserve their vibrant color and nutritional value. High in plant protein and fiber, they make an excellent healthy snack alternative.', '50g', 179, 249, '/images/photo1772420462.jpg', '/images/photo1772420461.jpg', '["High Protein","Rich in Fiber","Vitamin K","Iron & Zinc"]', '24 months', 'Enjoy as a crunchy snack, add to trail mix, or rehydrate for cooking. Store in a cool, dry place.', '', 'FD-VEG-PEA-50', 130, 1, 6),
('biryani', 'Freeze Dried Chicken Biryani', 'cooked-food', 'Cooked Food', 'Authentic biryani ready in 5 minutes — just add hot water.', 'Experience the rich flavors of authentic Indian biryani anytime, anywhere. Our freeze-dried biryani is prepared by expert chefs using traditional recipes and premium ingredients, then freeze-dried to lock in flavor and nutrition.', '100g', 299, 399, '/images/Biryani.jpg', '/images/Biryani.jpg', '["Complete Meal","High Protein","Rich in Spices","Ready in 5 Min"]', '18 months', 'Add 150ml hot water, stir well, cover and wait 5 minutes. Enjoy your meal!', 'New', 'FD-CKD-BIR-100', 70, 1, 7),
('paneer-tikka', 'Freeze Dried Paneer Tikka', 'cooked-food', 'Cooked Food', 'Smoky paneer tikka — just rehydrate and enjoy.', 'Premium paneer tikka marinated in authentic Indian spices and freeze-dried. Simply rehydrate with hot water for a delicious, protein-rich meal or snack.', '80g', 349, 449, '/images/PaneerTikka.jpg', '/images/PaneerTikka.jpg', '["High Protein","Calcium Rich","Traditional Recipe","Ready in 5 Min"]', '18 months', 'Add 100ml hot water, stir gently, cover and wait 5 minutes. Serve hot.', '', 'FD-CKD-PTK-80', 50, 1, 8)
ON DUPLICATE KEY UPDATE name = VALUES(name);