# 🔧 El Crunchae — Complete Hostinger Fix Guide

This guide addresses the **3 main issues** you're experiencing after migrating to Hostinger:
1. ❌ Images not loading
2. ❌ Database tables not fully populated (only 6 of 20 products)
3. ❌ Team member photos missing on About page

---

## 🚨 Root Cause Analysis

### Issue 1: Images Not Loading
**Why**: The old SQL migration stored image paths like `/images/FreezeDriedStrawberry.jpg`, but the actual product images are in `/assets/products/fruits/strawberry.png`. Additionally, on Hostinger under `/shop/`, all paths need the `/shop/` prefix (e.g., `/shop/assets/products/fruits/strawberry.png`).

### Issue 2: Database Incomplete
**Why**: The old `mysql-migration.sql` only contained 6 sample products. The app has 20 products total (7 fruits, 5 vegetables, 6 cooked food, plus 2 more).

### Issue 3: Team Photos Missing
**Why**: The About page referenced image files that don't exist (`ElCrunchae.jpg`, `NaveenYeshodara.jpg`, etc.). The actual team images are `team_member_0.png` through `team_member_4.jpg` in the `assets/team/` folder.

---

## ✅ Step-by-Step Fix

### Step 1: Rebuild the Frontend

The code has been updated to fix team member image paths. You need to rebuild:

```bash
cd app/frontend
pnpm run build
```

This creates a fresh `dist/` folder with all fixes applied.

### Step 2: Fix the Database (CRITICAL)

#### Option A: Fresh Install (Recommended)
If you can drop and recreate tables:

1. Go to **Hostinger hPanel** → **Databases** → **phpMyAdmin**
2. Select your database (e.g., `u233052549_el-ariah.com`)
3. Click the **Import** tab
4. Upload the NEW file: **`mysql-migration-complete.sql`**
5. Click **Go** to execute

This will:
- Drop and recreate all tables
- Insert ALL 20 products with correct image paths
- Create the admin user

#### Option B: Keep Existing Data
If you want to keep existing users/orders:

1. Go to phpMyAdmin
2. Click the **SQL** tab
3. Run this to delete only old products and re-insert:

```sql
-- Delete old products (this will also delete related reviews due to CASCADE)
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM reviews;
DELETE FROM products;

-- Then import ONLY the product INSERT statements from mysql-migration-complete.sql
-- Copy all the INSERT INTO products (...) VALUES (...) lines and run them
```

### Step 3: Fix Image Paths in Database for /shop/

After importing the SQL, run this in phpMyAdmin's SQL tab:

```sql
-- Prepend /shop to all product image paths
UPDATE products SET image = CONCAT('/shop', image) WHERE image NOT LIKE '/shop%' AND image != '';
UPDATE products SET box_image = CONCAT('/shop', box_image) WHERE box_image NOT LIKE '/shop%' AND box_image != '' AND box_image IS NOT NULL;
```

**Verification**: After running, check that paths look like:
```
/shop/assets/products/fruits/strawberry.png
/shop/assets/products/vegetables/beetroot.png
/shop/assets/products/cooked-food/chicken-biryani.png
```

### Step 4: Upload Files to Hostinger

#### 4a. Upload the NEW dist/ folder
1. Go to **hPanel** → **File Manager**
2. Navigate to `public_html/shop/`
3. **Delete the old contents** (except the `api/` folder)
4. Upload ALL contents from the new `dist/` folder

#### 4b. Verify the file structure
Your `public_html/shop/` should look like this:

```
public_html/shop/
├── index.html
├── .htaccess
├── assets/
│   ├── index-XXXXX.css          ← Vite-generated CSS
│   ├── index-XXXXX.js           ← Vite-generated JS
│   ├── products/
│   │   ├── fruits/
│   │   │   ├── strawberry.png
│   │   │   ├── strawberry-box.png
│   │   │   ├── mango.png
│   │   │   ├── kiwi.png
│   │   │   ├── kiwi-box.png
│   │   │   ├── blueberry.png
│   │   │   ├── blueberry-box.png
│   │   │   ├── dragon-fruit-box.png
│   │   │   ├── pineapple-box.png
│   │   │   ├── jamun.png
│   │   │   ├── freeze-dried-fruits.jpeg
│   │   │   └── full-box.png
│   │   ├── vegetables/
│   │   │   ├── beetroot.png
│   │   │   ├── broccoli-box.png
│   │   │   ├── carrot.png
│   │   │   ├── sweet-corn.png
│   │   │   └── green-peas.png
│   │   └── cooked-food/
│   │       ├── chicken-biryani.png
│   │       ├── prawn-biryani.png
│   │       ├── chole-bhatura.png
│   │       ├── dal-makhni.png
│   │       ├── palak-paneer.png
│   │       └── pav-bhaji.png
│   ├── brand/
│   │   ├── logo.png              ← CRITICAL: Logo file
│   │   ├── logo-full.jpeg
│   │   ├── tagline.png
│   │   ├── whatsapp-img.jpeg
│   │   ├── chatgpt-1.png
│   │   ├── chatgpt-2.png
│   │   ├── chatgpt-3.png
│   │   └── chatgpt-4.png
│   └── team/
│       ├── team_member_0.png     ← Christeena
│       ├── team_member_1.jpg     ← Nischitha
│       ├── team_member_2.jpg     ← Naveen
│       ├── team_member_3.jpg     ← Manikumar
│       ├── team_member_4.jpg     ← Dr. Jayram
│       ├── slide1_img_0.png
│       └── slide1_img_1.jpg
├── images/                        ← Keep for backward compatibility
│   ├── FreezeDriedStrawberry.jpg
│   ├── FreezeDriedMango.jpg
│   ├── FreezeDriedBananas.jpg
│   ├── FreezeDriedPeas.jpg
│   ├── FreezeDriedCorn.jpg
│   ├── FreezeDriedBiryani.jpg
│   ├── Image.jpg
│   ├── Product.jpg
│   └── ProductBox.jpg
├── favicon.svg
├── robots.txt
└── api/
    ├── .htaccess
    ├── config.php
    ├── auth.php
    ├── products.php
    ├── reviews.php
    └── orders.php
```

### Step 5: Verify API Configuration

Edit `public_html/shop/api/config.php` and confirm your database credentials:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'u233052549_el-ariah.com');     // Your actual DB name
define('DB_USER', 'u233052549_naveen_sy@wire');    // Your actual DB user
define('DB_PASS', 'Nov&22009');                     // Your actual DB password
define('JWT_SECRET', 'change-this-to-a-random-string-at-least-32-chars');
```

### Step 6: Verify .htaccess Files

#### `public_html/shop/.htaccess`:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /shop/

  # Don't rewrite API requests
  RewriteRule ^api/ - [L]

  # Don't rewrite files and directories that exist
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d

  # Rewrite everything else to index.html for React Router
  RewriteRule . index.html [L]
</IfModule>
```

#### `public_html/.htaccess` (WordPress root — add BEFORE WordPress block):
```apache
# BEGIN El Crunchae
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteRule ^shop(/.*)?$ - [L]
</IfModule>
# END El Crunchae
```

---

## 🧪 Testing Checklist

After completing all steps, verify each URL:

| Test | URL | Expected |
|------|-----|----------|
| Homepage | `yourdomain.com/shop/` | Hero image loads, products visible |
| Logo | Check navbar | El Crunchae logo visible |
| Products page | `yourdomain.com/shop/products` | All 20 products with images |
| Product detail | `yourdomain.com/shop/products/strawberry` | Product image + details |
| About page | `yourdomain.com/shop/about` | Team photos visible |
| API test | `yourdomain.com/shop/api/products.php` | JSON with 20 products |
| Category filter | `yourdomain.com/shop/products?category=fruits` | 7 fruit products |
| Cart | `yourdomain.com/shop/cart` | Cart page loads |
| WordPress | `yourdomain.com/` | WordPress site unaffected |

---

## 🔧 Troubleshooting

### Images still broken?
1. **Check browser DevTools** (F12 → Network tab) — look at the failing image URL
2. If URL is `/assets/products/fruits/strawberry.png` (missing `/shop/`):
   - The build may not have the correct base path. Verify `dist/index.html` contains `<script src="/shop/assets/..."`
3. If URL is `/shop/assets/products/fruits/strawberry.png` but still 404:
   - The file doesn't exist on the server. Check File Manager to confirm the file is there
4. If URL is `/shop/images/FreezeDriedStrawberry.jpg`:
   - The database still has old paths. Re-run the complete SQL migration

### Products showing from local data instead of database?
- The app falls back to local data when the API is unreachable
- Test the API directly: `yourdomain.com/shop/api/products.php`
- If you get an error, check `config.php` database credentials
- Check PHP error logs in hPanel → Advanced → Error Logs

### White/blank page?
- Check browser console (F12) for JavaScript errors
- Verify `index.html` is in `public_html/shop/`
- Verify `.htaccess` is correct

### 404 on page refresh?
- The `.htaccess` in `/shop/` is missing or incorrect
- Verify `mod_rewrite` is enabled (it usually is on Hostinger)

---

## 📋 Quick Reference: Image Path Mapping

| Product | Database Path (after fix) | Actual File |
|---------|--------------------------|-------------|
| Strawberry | `/shop/assets/products/fruits/strawberry.png` | `shop/assets/products/fruits/strawberry.png` |
| Mango | `/shop/assets/products/fruits/mango.png` | `shop/assets/products/fruits/mango.png` |
| Kiwi | `/shop/assets/products/fruits/kiwi.png` | `shop/assets/products/fruits/kiwi.png` |
| Blueberry | `/shop/assets/products/fruits/blueberry.png` | `shop/assets/products/fruits/blueberry.png` |
| Dragon Fruit | `/shop/assets/products/fruits/dragon-fruit-box.png` | `shop/assets/products/fruits/dragon-fruit-box.png` |
| Pineapple | `/shop/assets/products/fruits/pineapple-box.png` | `shop/assets/products/fruits/pineapple-box.png` |
| Jamun | `/shop/assets/products/fruits/jamun.png` | `shop/assets/products/fruits/jamun.png` |
| Beetroot | `/shop/assets/products/vegetables/beetroot.png` | `shop/assets/products/vegetables/beetroot.png` |
| Broccoli | `/shop/assets/products/vegetables/broccoli-box.png` | `shop/assets/products/vegetables/broccoli-box.png` |
| Carrot | `/shop/assets/products/vegetables/carrot.png` | `shop/assets/products/vegetables/carrot.png` |
| Sweet Corn | `/shop/assets/products/vegetables/sweet-corn.png` | `shop/assets/products/vegetables/sweet-corn.png` |
| Green Peas | `/shop/assets/products/vegetables/green-peas.png` | `shop/assets/products/vegetables/green-peas.png` |
| Chicken Biryani | `/shop/assets/products/cooked-food/chicken-biryani.png` | `shop/assets/products/cooked-food/chicken-biryani.png` |
| Prawn Biryani | `/shop/assets/products/cooked-food/prawn-biryani.png` | `shop/assets/products/cooked-food/prawn-biryani.png` |
| Chole Bhatura | `/shop/assets/products/cooked-food/chole-bhatura.png` | `shop/assets/products/cooked-food/chole-bhatura.png` |
| Dal Makhni | `/shop/assets/products/cooked-food/dal-makhni.png` | `shop/assets/products/cooked-food/dal-makhni.png` |
| Palak Paneer | `/shop/assets/products/cooked-food/palak-paneer.png` | `shop/assets/products/cooked-food/palak-paneer.png` |
| Pav Bhaji | `/shop/assets/products/cooked-food/pav-bhaji.png` | `shop/assets/products/cooked-food/pav-bhaji.png` |