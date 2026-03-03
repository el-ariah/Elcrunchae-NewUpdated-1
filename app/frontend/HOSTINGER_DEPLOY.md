# El Crunchae — Hostinger Deployment Guide (Supabase Backend)

This project is a **fully standalone React + Supabase** application with **zero** dependency on Atoms Cloud. It can be deployed to Hostinger, Vercel, Netlify, or any static hosting provider.

---

## Prerequisites

- **Node.js** ≥ 18 and **pnpm** (or npm/yarn)
- A **Supabase** account: https://supabase.com
- A **Hostinger** hosting plan (Website Builder or VPS)

---

## Step 1: Set Up Supabase

### 1.1 Create a Supabase Project

1. Go to https://supabase.com/dashboard and create a new project.
2. Note your **Project URL** and **Anon (public) Key** from Settings → API.

### 1.2 Run the Database Migration

Go to your Supabase Dashboard → SQL Editor and run the contents of `supabase-migration.sql`. This creates all necessary tables:

- `products` — Product catalog
- `reviews` — Customer reviews
- `orders` — Order records
- `order_items` — Items within each order

### 1.3 Configure Authentication (Optional)

If you want Google OAuth login:

1. Go to Supabase Dashboard → Authentication → Providers → Google
2. Enable Google provider
3. Add your Google OAuth Client ID and Secret
4. Set the redirect URL to: `https://your-domain.com/auth/callback`

### 1.4 Update Supabase Credentials

Edit `src/lib/supabase.ts` and replace the placeholder values:

```typescript
const supabaseUrl = "https://YOUR_PROJECT_ID.supabase.co";
const supabaseAnonKey = "YOUR_ANON_KEY_HERE";
```

Or create a `.env` file (recommended):

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

And update `supabase.ts` to read from env:

```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://your-project-id.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "your-anon-key";
```

---

## Step 2: Build the Project

```bash
# Install dependencies
pnpm install

# Build for production
pnpm run build
```

This creates a `dist/` folder with all static files.

---

## Step 3: Deploy to Hostinger

### Option A: Hostinger File Manager (Shared Hosting)

1. Log in to Hostinger → hPanel
2. Go to **File Manager**
3. Navigate to `public_html/` (or your domain's root folder)
4. **Upload** all contents of the `dist/` folder
5. Create an `.htaccess` file in `public_html/` for SPA routing:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### Option B: Hostinger VPS

1. SSH into your VPS
2. Install Node.js and a web server (nginx recommended)
3. Upload the `dist/` folder to `/var/www/elcrunchae/`
4. Configure nginx:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/elcrunchae;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Option C: Hostinger Git Deployment

1. Push your code to a GitHub repository
2. In Hostinger hPanel → Git → Connect repository
3. Set the build command: `pnpm install && pnpm run build`
4. Set the publish directory: `dist`

---

## Step 4: Seed Product Data

After deploying, add products via:

1. **Supabase Dashboard** → Table Editor → `products` table → Insert rows
2. Or use the **Admin panel** at `/admin` (requires authentication)

### Sample Product Insert (SQL):

```sql
INSERT INTO products (slug, name, category, category_label, description, long_description, weight, price, original_price, image, nutrition_highlights, shelf_life, how_to_use, badge, sku, stock_quantity, is_active, sort_order)
VALUES (
  'strawberry',
  'Freeze Dried Strawberry',
  'fruits',
  'Fruits',
  'Crispy, naturally sweet strawberries with 97% nutrients retained',
  'Our premium freeze-dried strawberries are sourced from the finest farms...',
  '50g',
  299,
  399,
  '/images/FreezeDriedStrawberry.jpg',
  '["Rich in Vitamin C", "High in Antioxidants", "Natural Fiber"]',
  '24 months',
  'Enjoy as a snack, add to cereals, smoothies, or desserts',
  'Bestseller',
  'FD-FRT-STR-50',
  100,
  true,
  1
);
```

---

## Step 5: Payment Integration (Optional)

For Stripe payments, create Supabase Edge Functions:

1. `create-payment-session` — Creates a Stripe checkout session
2. `verify-payment` — Verifies payment status

Set the `STRIPE_SECRET_KEY` as a Supabase secret:

```bash
supabase secrets set STRIPE_SECRET_KEY=sk_live_xxx
```

---

## Project Structure

```
dist/                    ← Upload this to Hostinger
├── index.html           ← Main entry point
├── assets/              ← JS, CSS bundles
├── images/              ← Product images
└── favicon.svg

src/                     ← Source code (not deployed)
├── lib/
│   ├── api.ts           ← All data operations (Supabase)
│   ├── auth.ts          ← Authentication (Supabase Auth)
│   ├── supabase.ts      ← Supabase client initialization
│   ├── security.ts      ← Input validation & sanitization
│   └── config.ts        ← Configuration
├── pages/               ← Route pages
├── components/          ← Reusable UI components
└── contexts/            ← React contexts (Auth, Cart)
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Blank page after deploy | Add `.htaccess` for SPA routing (see Step 3A) |
| API errors | Check Supabase URL and Anon Key in `supabase.ts` |
| Auth not working | Verify Google OAuth redirect URL matches your domain |
| Images not loading | Ensure images are in the `dist/` folder or use absolute URLs |
| CORS errors | Add your domain to Supabase → Settings → API → Allowed Origins |

---

## Key Differences from Atoms Cloud Version

This standalone version:
- ✅ Uses **only** `@supabase/supabase-js` for backend
- ✅ **No** `@metagptx/web-sdk` dependency
- ✅ **No** `@metagptx/vite-plugin-source-locator` dependency
- ✅ **No** runtime config endpoint needed
- ✅ Works on **any** static hosting provider
- ✅ All data operations go directly to Supabase