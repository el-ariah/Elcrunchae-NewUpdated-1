# 🚀 El Crunchae — Hostinger WordPress Integration Guide

## Overview

You have an existing WordPress website on Hostinger. This guide shows you how to add the El Crunchae eCommerce store **alongside** your WordPress site, so both coexist on the same domain.

**Architecture:**
```
your-domain.com/           → WordPress (existing)
your-domain.com/shop/      → El Crunchae React App (new)
your-domain.com/shop/api/  → PHP/MySQL Backend API (new)
```

---

## 📋 Prerequisites

- Hostinger hPanel access
- WordPress already installed on your domain
- File Manager or FTP access
- phpMyAdmin access (for database)

---

## STEP 1: Database Setup (phpMyAdmin)

### 1.1 Open phpMyAdmin
1. Log in to **Hostinger hPanel** → https://hpanel.hostinger.com
2. Go to **Databases** → **phpMyAdmin**
3. Select your existing database (e.g., `u233052549_el-ariah.com`) or create a new one

### 1.2 Run the Migration SQL
1. Click on your database name in the left sidebar
2. Click the **SQL** tab at the top
3. Copy and paste the **entire contents** of the file `mysql-migration.sql` into the SQL text box
4. Click **Go** to execute

This creates 5 tables:
| Table | Purpose |
|-------|---------|
| `users` | User accounts & authentication |
| `products` | Product catalog (6 sample products included) |
| `reviews` | Customer reviews |
| `orders` | Order records |
| `order_items` | Individual items within orders |

It also inserts:
- 1 admin user: `admin@elcrunchae.com` / `admin123` (⚠️ change password after first login!)
- 6 sample products (Strawberry, Mango, Banana, Peas, Corn, Biryani)

### 1.3 Verify Tables Created
After running the SQL, you should see all 5 tables in the left sidebar. Click on `products` to verify the 6 sample rows are there.

---

## STEP 2: Prepare the Build Files

### 2.1 What You Need to Upload

The built project is in the `dist/` folder. Here's what it contains:

```
dist/
├── index.html              ← Main HTML entry point
├── favicon.svg             ← Site favicon
├── robots.txt              ← SEO robots file
├── assets/                 ← JS, CSS, images (brand, products, team)
│   ├── brand/              ← Logo files
│   ├── products/           ← Product category images
│   ├── team/               ← Team member photos
│   ├── index-*.css         ← Compiled CSS
│   ├── index-*.js          ← Compiled React app
│   └── *-vendor-*.js       ← Vendor libraries
└── images/                 ← Product photos
    ├── FreezeDriedStrawberry.jpg
    ├── FreezeDriedMango.jpg
    ├── FreezeDriedBananas.jpg
    ├── FreezeDriedPeas.jpg
    ├── FreezeDriedCorn.jpg
    ├── FreezeDriedBiryani.jpg
    ├── Product.jpg
    └── ProductBox.jpg
```

Additionally, you need the `api/` folder:
```
api/
├── .htaccess     ← Apache config for API
├── config.php    ← Database connection & JWT auth
├── auth.php      ← Login/Register endpoints
├── products.php  ← Product CRUD endpoints
├── reviews.php   ← Review endpoints
└── orders.php    ← Order endpoints
```

### 2.2 Modify `dist/index.html` for Subdirectory

Since the app will live at `/shop/` instead of root `/`, you need to update the base path.

Open `dist/index.html` and add a `<base>` tag inside `<head>`:

```html
<head>
  <base href="/shop/" />
  <!-- ... rest of head ... -->
</head>
```

Also update the asset paths in `index.html`. Change:
```html
<script type="module" crossorigin src="/assets/index-DoFuaOKD.js"></script>
<link rel="stylesheet" crossorigin href="/assets/index-DoMcmV1s.css">
```
To:
```html
<script type="module" crossorigin src="./assets/index-DoFuaOKD.js"></script>
<link rel="stylesheet" crossorigin href="./assets/index-DoMcmV1s.css">
```

(Change `/assets/` to `./assets/` — use relative paths)

---

## STEP 3: Update API Configuration

### 3.1 Edit `api/config.php`

Open `api/config.php` and update these values with your **actual Hostinger MySQL credentials**:

```php
// Database credentials — UPDATE THESE!
define('DB_HOST', 'localhost');                        // Usually 'localhost' on Hostinger
define('DB_NAME', 'u233052549_your_database_name');   // Your actual database name
define('DB_USER', 'u233052549_your_username');         // Your actual database username
define('DB_PASS', 'your_secure_password');              // Your actual database password

// IMPORTANT: Change this to a unique random string!
define('JWT_SECRET', 'your_unique_random_secret_key_here_make_it_long_2024');
```

**To find your database credentials on Hostinger:**
1. hPanel → **Databases** → **MySQL Databases**
2. Your database name, username, and password are listed there
3. If you forgot the password, you can reset it from this page

### 3.2 Update CORS Origin (Recommended for Security)

In `api/config.php`, change:
```php
header("Access-Control-Allow-Origin: *");
```
To:
```php
header("Access-Control-Allow-Origin: https://your-domain.com");
```

Replace `your-domain.com` with your actual domain.

---

## STEP 4: Upload Files to Hostinger

### Option A: Using File Manager (Easier)

1. Log in to **Hostinger hPanel**
2. Go to **Files** → **File Manager**
3. Navigate to `public_html/` (this is your WordPress root)
4. Create a new folder called **`shop`** inside `public_html/`
5. Open the `shop/` folder
6. Upload the following from your `dist/` folder:
   - `index.html` (the modified version with `<base href="/shop/">`)
   - `favicon.svg`
   - `robots.txt`
   - `assets/` folder (entire folder with all subfolders)
   - `images/` folder (entire folder)
7. Create a folder called **`api`** inside `shop/`
8. Upload all PHP files into `shop/api/`:
   - `.htaccess`
   - `config.php` (the updated version)
   - `auth.php`
   - `products.php`
   - `reviews.php`
   - `orders.php`

### Option B: Using FTP (For Large Uploads)

1. hPanel → **Files** → **FTP Accounts**
2. Note your FTP credentials (or create a new FTP account)
3. Use an FTP client like **FileZilla**:
   - Host: `ftp.your-domain.com`
   - Username: your FTP username
   - Password: your FTP password
   - Port: `21`
4. Navigate to `/public_html/`
5. Create `shop/` folder
6. Upload everything as described above

### Final File Structure on Hostinger:
```
public_html/
├── wp-admin/           ← WordPress (existing, DON'T TOUCH)
├── wp-content/         ← WordPress (existing, DON'T TOUCH)
├── wp-includes/        ← WordPress (existing, DON'T TOUCH)
├── wp-config.php       ← WordPress (existing, DON'T TOUCH)
├── index.php           ← WordPress (existing, DON'T TOUCH)
├── .htaccess           ← WordPress (existing, will modify)
│
└── shop/               ← NEW: El Crunchae App
    ├── index.html      ← React app entry
    ├── favicon.svg
    ├── robots.txt
    ├── assets/         ← CSS, JS, brand images, product images, team photos
    │   ├── brand/
    │   ├── products/
    │   ├── team/
    │   ├── index-DoMcmV1s.css
    │   ├── index-DoFuaOKD.js
    │   └── *-vendor-*.js
    ├── images/         ← Product photos for database references
    │   ├── FreezeDriedStrawberry.jpg
    │   ├── FreezeDriedMango.jpg
    │   └── ...
    └── api/            ← PHP Backend
        ├── .htaccess
        ├── config.php
        ├── auth.php
        ├── products.php
        ├── reviews.php
        └── orders.php
```

---

## STEP 5: Configure .htaccess for React Router

### 5.1 Create `.htaccess` in the `shop/` folder

Create a new file `public_html/shop/.htaccess` with this content:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /shop/

  # Don't rewrite API requests — let PHP handle them
  RewriteRule ^api/ - [L]

  # Don't rewrite existing files and directories
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d

  # Send everything else to index.html (React Router handles it)
  RewriteRule ^ index.html [QSA,L]
</IfModule>
```

### 5.2 Update WordPress Root `.htaccess`

Edit `public_html/.htaccess` and add this **BEFORE** the WordPress rewrite rules:

```apache
# El Crunchae Shop — Don't let WordPress handle /shop/ URLs
RewriteRule ^shop(/.*)?$ - [L]
```

Your full `public_html/.htaccess` should look like:

```apache
# BEGIN El Crunchae
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteRule ^shop(/.*)?$ - [L]
</IfModule>
# END El Crunchae

# BEGIN WordPress
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteRule ^index\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
</IfModule>
# END WordPress
```

⚠️ **Important:** The El Crunchae rules MUST come BEFORE the WordPress rules!

---

## STEP 6: Update Frontend API Base URL

The React app needs to know where the API is. Since both live under `/shop/`, the default `/api` path should work. But to be safe, you can set an environment variable.

### Option: Hardcode the API path

If the default doesn't work, edit `dist/index.html` and add before the script tags:

```html
<script>
  window.__API_BASE__ = '/shop/api';
</script>
```

Then in the React code, the `api.ts` uses:
```js
const API_BASE = import.meta.env.VITE_API_BASE || "/api";
```

Since we're in a subdirectory, you may need to rebuild with the correct API base. The simplest fix is to update the built JS. But first, try the default — it may work because the API calls use relative paths.

**If API calls fail**, the easiest fix is:
1. Go back to the source code
2. Change `api.ts` line: `const API_BASE = import.meta.env.VITE_API_BASE || "/api";`
3. To: `const API_BASE = import.meta.env.VITE_API_BASE || "/shop/api";`
4. Rebuild: `pnpm run build`
5. Re-upload the new `dist/` files

---

## STEP 7: Test Everything

### 7.1 Test the API directly
Open these URLs in your browser:

```
https://your-domain.com/shop/api/products.php
```

You should see a JSON response with your 6 products. If you get an error:
- Check database credentials in `config.php`
- Check that tables were created in phpMyAdmin
- Check PHP error logs in hPanel → **Advanced** → **Error Logs**

### 7.2 Test the Frontend

```
https://your-domain.com/shop/
```

You should see the El Crunchae homepage with products loaded from the database.

### 7.3 Test Authentication

1. Click the user icon → Register a new account
2. Try logging in with the admin account: `admin@elcrunchae.com` / `admin123`
3. Access the admin panel at `/shop/admin`

### 7.4 Test WordPress Still Works

```
https://your-domain.com/
```

Your WordPress site should load normally, unaffected.

---

## STEP 8: Add a Link from WordPress to the Shop

### Option A: WordPress Menu
1. WordPress Admin → **Appearance** → **Menus**
2. Add a **Custom Link**:
   - URL: `/shop/`
   - Link Text: `Shop` or `El Crunchae Store`
3. Save Menu

### Option B: WordPress Page with Redirect
1. Create a new WordPress page called "Shop"
2. Add a redirect using a plugin like **Redirection** or add this to your theme's `functions.php`:

```php
// Redirect /shop-page/ to /shop/
add_action('template_redirect', function() {
    if (is_page('shop-page')) {
        wp_redirect('/shop/', 301);
        exit;
    }
});
```

### Option C: Add a Button/Banner
Add HTML to any WordPress page or widget:

```html
<a href="/shop/" class="shop-button" style="display:inline-block; background:#16a34a; color:white; padding:12px 24px; border-radius:8px; text-decoration:none; font-weight:bold;">
  🛒 Visit Our Store
</a>
```

---

## 🔧 Troubleshooting

### Problem: "404 Not Found" on `/shop/`
- Ensure `index.html` exists in `public_html/shop/`
- Check that `.htaccess` in `shop/` folder is correct
- Verify `mod_rewrite` is enabled (it usually is on Hostinger)

### Problem: API returns "Database connection failed"
- Double-check credentials in `api/config.php`
- Verify the database exists in phpMyAdmin
- Make sure the database user has permissions on the database

### Problem: Products don't load (but API works)
- Check browser console (F12 → Console) for errors
- The API base URL might be wrong — try updating to `/shop/api`
- Check CORS headers in `config.php`

### Problem: Images don't show
- Verify `images/` folder was uploaded to `public_html/shop/images/`
- Verify `assets/` folder was uploaded to `public_html/shop/assets/`
- Check that image paths in the database match: `/images/FreezeDriedStrawberry.jpg`
- Since the app is in `/shop/`, database image paths should be `/shop/images/FreezeDriedStrawberry.jpg`

**Fix image paths in database:**
Run this SQL in phpMyAdmin:
```sql
UPDATE products SET image = CONCAT('/shop', image) WHERE image NOT LIKE '/shop%';
```

### Problem: React Router pages show 404
- Ensure `shop/.htaccess` has the rewrite rules
- Ensure WordPress `.htaccess` has the `RewriteRule ^shop` exclusion

### Problem: WordPress site broken after changes
- Restore the original WordPress `.htaccess` (remove only the El Crunchae section)
- WordPress default `.htaccess` is:
```apache
# BEGIN WordPress
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteRule ^index\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
</IfModule>
# END WordPress
```

---

## 🔒 Security Checklist (Before Going Live)

- [ ] Change admin password from `admin123` to something strong
- [ ] Change `JWT_SECRET` in `config.php` to a random 64-character string
- [ ] Update CORS origin from `*` to your actual domain
- [ ] Remove or restrict the admin registration endpoint
- [ ] Enable HTTPS (Hostinger provides free SSL)
- [ ] Set proper file permissions: PHP files `644`, directories `755`

---

## 📁 Files to Download

Export all project files from this chat using the **Share** button (top-right) → **Export**. The key files you need:

1. `mysql-migration.sql` — Database setup
2. `api/` folder — All 6 PHP files
3. `dist/` folder — Built frontend (after modifying index.html)

---

## 🎯 Quick Summary

| Step | Action | Where |
|------|--------|-------|
| 1 | Run `mysql-migration.sql` | phpMyAdmin |
| 2 | Update `api/config.php` with real DB credentials | Local/Editor |
| 3 | Modify `dist/index.html` (add base href, relative paths) | Local/Editor |
| 4 | Upload `dist/` contents + `api/` to `public_html/shop/` | File Manager/FTP |
| 5 | Create `shop/.htaccess` for React Router | File Manager |
| 6 | Update WordPress `.htaccess` to exclude `/shop/` | File Manager |
| 7 | Test API, frontend, and WordPress | Browser |
| 8 | Add shop link to WordPress menu | WordPress Admin |

That's it! Your El Crunchae store will be live at `your-domain.com/shop/` alongside your WordPress site. 🎉