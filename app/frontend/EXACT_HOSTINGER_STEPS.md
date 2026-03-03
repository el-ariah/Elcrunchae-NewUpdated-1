# 🚀 El Crunchae — EXACT Step-by-Step Hostinger Import Guide

> **This guide assumes you have an existing WordPress site on Hostinger.**
> The El Crunchae store will live at `your-domain.com/shop/`
> Your WordPress site stays untouched at `your-domain.com/`

---

## 📥 STEP 0: Download All Project Files

1. In this Atoms chat, click the **Share** button (top-right corner)
2. Click **Export** to download a ZIP file of all project files
3. Extract the ZIP on your computer
4. Inside the extracted folder, locate these key folders:
   ```
   app/frontend/dist/          ← Built frontend (HTML, CSS, JS, images)
   app/frontend/api/           ← PHP backend files
   app/frontend/mysql-migration.sql  ← Database setup script
   app/frontend/deploy/        ← Pre-configured deployment files
   ```

---

## 🗄️ STEP 1: Setup the MySQL Database

### 1.1 — Open phpMyAdmin
1. Go to https://hpanel.hostinger.com
2. Log in with your Hostinger account
3. Click on your website/domain
4. In the left sidebar, click **Databases** → **phpMyAdmin**
5. Click **Enter phpMyAdmin** button

### 1.2 — Select Your Database
1. In phpMyAdmin, look at the left sidebar
2. Click on your database name (e.g., `u233052549_elcrunchae` or similar)
3. If you don't have a database yet:
   - Go back to hPanel → **Databases** → **MySQL Databases**
   - Create a new database:
     - Database name: `elcrunchae` (Hostinger will prefix it like `u233052549_elcrunchae`)
     - Username: `elcrunchae_admin` (Hostinger will prefix it)
     - Password: Choose a strong password
   - Click **Create**
   - **WRITE DOWN** the full database name, username, and password — you'll need them in Step 3

### 1.3 — Run the Migration SQL
1. In phpMyAdmin, click on your database name in the left sidebar
2. Click the **SQL** tab at the top of the page
3. Open the file `app/frontend/mysql-migration.sql` from your downloaded files in a text editor (Notepad, VS Code, etc.)
4. **Select All** (Ctrl+A) and **Copy** (Ctrl+C) the entire contents
5. **Paste** (Ctrl+V) into the SQL text box in phpMyAdmin
6. Click the **Go** button at the bottom

### 1.4 — Verify It Worked
After running, you should see success messages. Check:
1. Click on your database name in the left sidebar — you should see **5 tables**:
   - `users` (1 row — the admin account)
   - `products` (6 rows — sample products)
   - `reviews` (0 rows)
   - `orders` (0 rows)
   - `order_items` (0 rows)
2. Click on `products` → you should see 6 freeze-dried products listed
3. Click on `users` → you should see 1 admin user: `admin@elcrunchae.com`

✅ **Database is ready!**

---

## 📂 STEP 2: Upload Files to Hostinger

### 2.1 — Open File Manager
1. Go to Hostinger hPanel
2. Click **Files** → **File Manager**
3. Navigate to `public_html/` (this is your WordPress root directory)

### 2.2 — Create the Shop Folder
1. While inside `public_html/`, click **New Folder** at the top
2. Name it: `shop`
3. Press Enter or click Create

### 2.3 — Upload Frontend Files (dist/ folder)
1. Double-click to open the `shop/` folder
2. Now upload these files from your computer's `app/frontend/dist/` folder:

**Upload the modified index.html:**
- From your downloaded files, go to `app/frontend/deploy/shop/`
- Upload `index.html` from this `deploy/shop/` folder (NOT from `dist/` — the deploy version has correct paths for subdirectory)

**Upload favicon:**
- From `app/frontend/dist/`, upload `favicon.svg`

**Upload robots.txt:**
- From `app/frontend/dist/`, upload `robots.txt`

**Upload the assets folder:**
- In File Manager, inside `shop/`, click **New Folder** → name it `assets`
- Open the `assets/` folder
- Upload ALL files and folders from `app/frontend/dist/assets/`:

  **JavaScript & CSS files (upload directly into shop/assets/):**
  - `form-vendor-CBRsc90s.js`
  - `index-DR-k54dw.js`
  - `index-DoMcmV1s.css`
  - `query-vendor-BhuHbeNr.js`
  - `react-vendor-CBRsc90s.js`
  - `router-vendor-TWLlgEtW.js`
  - `ui-vendor-BdqrFUPU.js`
  - `utils-vendor-B1m2W7tu.js`

  **Brand images (create subfolder):**
  - Create folder `brand` inside `assets/`
  - Upload into `assets/brand/`: `chatgpt-1.png`, `chatgpt-2.png`, `chatgpt-3.png`, `chatgpt-4.png`, `logo-full.jpeg`, `logo.png`, `tagline.png`, `whatsapp-img.jpeg`

  **Product images (create subfolder):**
  - Create folder `products` inside `assets/`
  - Inside `products/`, create folder `fruits`
  - Upload into `assets/products/fruits/`: ALL .png and .jpg files (amazon-1.jpg through amazon-9.jpg, blueberry-box.png, blueberry.png, dragon-fruit-box.png, freeze-dried-fruits.jpeg, full-box.png, jamun.png, kiwi-box.png, kiwi.png, mango.png, pineapple-box.png, strawberry-box.png, strawberry.png)
  - Inside `products/`, create folder `vegetables`
  - Upload into `assets/products/vegetables/`: beetroot.png, broccoli-box.png, carrot.png, green-peas.png, sweet-corn.png
  - Inside `products/`, create folder `cooked-food`
  - Upload into `assets/products/cooked-food/`: chicken-biryani.png, chole-bhatura.png, dal-makhni.png, palak-paneer.png, pav-bhaji.png, prawn-biryani.png

  **Team images (create subfolder):**
  - Create folder `team` inside `assets/`
  - Upload into `assets/team/`: slide1_img_0.png, slide1_img_1.jpg, team_member_0.png, team_member_1.jpg, team_member_2.jpg, team_member_3.jpg, team_member_4.jpg

**Upload the images folder:**
- Go back to `shop/` folder
- Create folder `images` inside `shop/`
- Upload into `images/`: FreezeDriedBananas.jpg, FreezeDriedBiryani.jpg, FreezeDriedCorn.jpg, FreezeDriedMango.jpg, FreezeDriedPeas.jpg, FreezeDriedStrawberry.jpg, Product.jpg, ProductBox.jpg

### 2.4 — Upload API Files (PHP Backend)
1. Go back to `shop/` folder
2. Create folder `api` inside `shop/`
3. Open the `api/` folder
4. Upload these 6 files from `app/frontend/api/`:
   - `.htaccess`
   - `config.php`
   - `auth.php`
   - `products.php`
   - `reviews.php`
   - `orders.php`

### 2.5 — Upload the .htaccess for React Router
1. Go back to `shop/` folder
2. Upload `.htaccess` from `app/frontend/deploy/shop/.htaccess`
   - ⚠️ If File Manager doesn't show `.htaccess` files, click the **Settings** gear icon → check **Show Hidden Files**

### 2.6 — Verify Final Structure
Your `public_html/shop/` should look exactly like this:
```
public_html/
├── wp-admin/              ← WordPress (DON'T TOUCH)
├── wp-content/            ← WordPress (DON'T TOUCH)
├── wp-includes/           ← WordPress (DON'T TOUCH)
├── .htaccess              ← WordPress (will edit in Step 5)
├── index.php              ← WordPress (DON'T TOUCH)
│
└── shop/                  ← YOUR NEW STORE
    ├── .htaccess          ← React Router rules (from deploy/shop/)
    ├── index.html         ← Modified entry page (from deploy/shop/)
    ├── favicon.svg
    ├── robots.txt
    │
    ├── assets/
    │   ├── brand/         ← 8 brand image files
    │   ├── products/
    │   │   ├── fruits/    ← 18 fruit image files
    │   │   ├── vegetables/← 5 vegetable image files
    │   │   └── cooked-food/← 6 cooked food image files
    │   ├── team/          ← 7 team image files
    │   ├── index-DR-k54dw.js
    │   ├── index-DoMcmV1s.css
    │   ├── ui-vendor-BdqrFUPU.js
    │   ├── utils-vendor-B1m2W7tu.js
    │   ├── query-vendor-BhuHbeNr.js
    │   ├── router-vendor-TWLlgEtW.js
    │   ├── react-vendor-CBRsc90s.js
    │   └── form-vendor-CBRsc90s.js
    │
    ├── images/            ← 8 product photos for database
    │   ├── FreezeDriedStrawberry.jpg
    │   ├── FreezeDriedMango.jpg
    │   ├── FreezeDriedBananas.jpg
    │   ├── FreezeDriedPeas.jpg
    │   ├── FreezeDriedCorn.jpg
    │   ├── FreezeDriedBiryani.jpg
    │   ├── Product.jpg
    │   └── ProductBox.jpg
    │
    └── api/               ← PHP Backend
        ├── .htaccess
        ├── config.php     ← Database config (edit in Step 3!)
        ├── auth.php
        ├── products.php
        ├── reviews.php
        └── orders.php
```

✅ **All files uploaded!**

---

## ⚙️ STEP 3: Configure the Backend (config.php)

### 3.1 — Edit config.php on Hostinger
1. In File Manager, navigate to `public_html/shop/api/`
2. Right-click on `config.php` → click **Edit**
3. Find these lines (around line 21-24):

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'u233052549_el-ariah.com');
define('DB_USER', 'u233052549_naveen_sy@wire');
define('DB_PASS', 'Nov&22009');
```

4. **Replace with YOUR actual Hostinger database credentials:**

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'u233052549_YOUR_DB_NAME');
define('DB_USER', 'u233052549_YOUR_DB_USER');
define('DB_PASS', 'YOUR_ACTUAL_PASSWORD');
```

**Where to find your credentials:**
- Go to hPanel → **Databases** → **MySQL Databases**
- Your database name, username are listed there
- If you forgot the password, click **Reset Password**

5. Also change the JWT secret (line 27):
```php
define('JWT_SECRET', 'CHANGE_THIS_TO_ANY_RANDOM_LONG_STRING_2024_xyz123');
```
Just type any random long string — this is used for login security.

6. **Optional but recommended** — Update CORS for security (line 8):
Change:
```php
header("Access-Control-Allow-Origin: *");
```
To:
```php
header("Access-Control-Allow-Origin: https://your-actual-domain.com");
```

7. Click **Save** (or the disk icon)

✅ **Backend configured!**

---

## 🔗 STEP 4: Configure the Frontend (React Router)

The `deploy/shop/.htaccess` file you uploaded in Step 2.5 handles this automatically. It contains:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /shop/

  # Don't rewrite API requests
  RewriteRule ^api/ - [L]

  # Don't rewrite existing files
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d

  # Everything else → React app
  RewriteRule ^ index.html [QSA,L]
</IfModule>
```

This ensures:
- `/shop/api/products.php` → goes to PHP (backend)
- `/shop/products` → goes to React (frontend routing)
- `/shop/assets/logo.png` → serves the actual file

✅ **Frontend routing configured!**

---

## 🔧 STEP 5: Update WordPress .htaccess

This is **CRITICAL** — without this, WordPress will intercept `/shop/` URLs.

### 5.1 — Edit WordPress .htaccess
1. In File Manager, navigate to `public_html/`
2. Find `.htaccess` (enable "Show Hidden Files" in settings if you can't see it)
3. Right-click → **Edit**
4. You'll see something like:

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

5. **Add these lines BEFORE `# BEGIN WordPress`:**

```apache
# BEGIN El Crunchae
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteRule ^shop(/.*)?$ - [L]
</IfModule>
# END El Crunchae
```

6. Your complete `.htaccess` should now look like:

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

7. Click **Save**

✅ **WordPress configured to coexist with El Crunchae!**

---

## 🖼️ STEP 6: Fix Product Image Paths in Database

Since the store lives at `/shop/`, the product images in the database need updated paths.

### 6.1 — Run the Fix SQL
1. Go to phpMyAdmin (hPanel → Databases → phpMyAdmin)
2. Click on your database
3. Click the **SQL** tab
4. Paste this and click **Go**:

```sql
UPDATE products SET image = CONCAT('/shop', image) WHERE image NOT LIKE '/shop%' AND image != '';
```

### 6.2 — Verify
1. Click on the `products` table
2. Check the `image` column — paths should now show `/shop/images/FreezeDriedStrawberry.jpg` etc.

✅ **Image paths fixed!**

---

## ✅ STEP 7: Test Everything

### 7.1 — Test the API
Open your browser and go to:
```
https://your-domain.com/shop/api/products.php
```

**Expected result:** A JSON response showing 6 products like:
```json
{
  "data": [
    {
      "id": 1,
      "name": "Freeze Dried Strawberry",
      "price": 299.00,
      ...
    },
    ...
  ]
}
```

**If you get an error:**
- "Database connection failed" → Check credentials in `config.php` (Step 3)
- "500 Internal Server Error" → Check hPanel → Advanced → Error Logs
- "404 Not Found" → Check that `products.php` exists in `shop/api/`

### 7.2 — Test the Frontend
Open your browser and go to:
```
https://your-domain.com/shop/
```

**Expected result:** The El Crunchae homepage with:
- ✅ Logo in the top-left corner
- ✅ Product cards showing freeze-dried products with images
- ✅ Navigation working (Products, About, Contact pages)
- ✅ Cart functionality

**If products don't show:**
- The app has a built-in fallback — it loads local static product data even if the API is unavailable
- Check browser console (F12 → Console) for any errors

### 7.3 — Test Authentication
1. Click the user/login icon
2. Register a new account with email and password
3. Try the admin login: `admin@elcrunchae.com` / `admin123`
4. Navigate to `/shop/admin` for the admin panel

### 7.4 — Test WordPress
```
https://your-domain.com/
```
**Expected:** Your WordPress site loads normally, completely unaffected.

✅ **Everything is live!**

---

## 🔗 STEP 8: Add Shop Link to WordPress

### Option A: WordPress Menu (Recommended)
1. Log in to WordPress Admin (`your-domain.com/wp-admin`)
2. Go to **Appearance** → **Menus**
3. Under "Custom Links":
   - URL: `/shop/`
   - Link Text: `Shop` or `🛒 Store`
4. Click **Add to Menu**
5. Click **Save Menu**

### Option B: Add a Button to Any Page
In the WordPress editor, add this HTML block:
```html
<div style="text-align: center; margin: 30px 0;">
  <a href="/shop/" style="display: inline-block; background: #16a34a; color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-size: 18px; font-weight: bold;">
    🛒 Visit Our Store
  </a>
</div>
```

---

## 🔒 STEP 9: Security Checklist (Do This Before Going Live!)

- [ ] **Change admin password:** Log in as admin → go to profile → change from `admin123`
- [ ] **Change JWT_SECRET:** Edit `shop/api/config.php` → change to a random 50+ character string
- [ ] **Restrict CORS:** Change `Access-Control-Allow-Origin: *` to your actual domain
- [ ] **Enable HTTPS:** hPanel → SSL → ensure SSL is active (Hostinger provides free SSL)
- [ ] **File permissions:** In File Manager, set PHP files to `644` and directories to `755`

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| "404 Not Found" on `/shop/` | Check `index.html` exists in `public_html/shop/` |
| "404" on `/shop/products` (subpages) | Check `shop/.htaccess` has the rewrite rules |
| API returns "Database connection failed" | Verify credentials in `shop/api/config.php` |
| Products load but no images | Run the image path fix SQL (Step 6) |
| WordPress site broken | Remove the El Crunchae block from `public_html/.htaccess` |
| Can't see `.htaccess` files | File Manager Settings → enable "Show Hidden Files" |
| "500 Internal Server Error" | Check hPanel → Advanced → Error Logs for details |
| Login/Register not working | Check `shop/api/auth.php` exists and `config.php` has correct DB credentials |
| CORS errors in browser console | Update `Access-Control-Allow-Origin` in `config.php` to match your domain |

---

## 📊 Quick Reference: All Files & Their Locations

| Source File (from download) | Upload To (on Hostinger) |
|---|---|
| `deploy/shop/index.html` | `public_html/shop/index.html` |
| `deploy/shop/.htaccess` | `public_html/shop/.htaccess` |
| `dist/favicon.svg` | `public_html/shop/favicon.svg` |
| `dist/robots.txt` | `public_html/shop/robots.txt` |
| `dist/assets/*` (all files & folders) | `public_html/shop/assets/*` |
| `dist/images/*` (8 jpg files) | `public_html/shop/images/*` |
| `api/.htaccess` | `public_html/shop/api/.htaccess` |
| `api/config.php` | `public_html/shop/api/config.php` ← EDIT THIS! |
| `api/auth.php` | `public_html/shop/api/auth.php` |
| `api/products.php` | `public_html/shop/api/products.php` |
| `api/reviews.php` | `public_html/shop/api/reviews.php` |
| `api/orders.php` | `public_html/shop/api/orders.php` |
| `mysql-migration.sql` | Run in phpMyAdmin (don't upload) |
| `deploy/fix-image-paths.sql` | Run in phpMyAdmin (don't upload) |

---

**Total files to upload: ~65 files across 10 folders**
**Estimated time: 15-20 minutes**

🎉 **That's it! Your El Crunchae store is now integrated with your WordPress site!**