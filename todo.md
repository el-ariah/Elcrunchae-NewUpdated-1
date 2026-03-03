# El Crunchae - Supabase + Hostinger Migration Plan

## Design Guidelines (Unchanged)
- **Primary Colors**: Green (#15803d, #166534), Orange (#ea580c), Cream (#FAFAF5)
- **Typography**: System fonts, clean and modern
- **Style**: Existing organic/natural theme maintained

## Architecture: Dual Backend Support
The app will support BOTH Atoms Cloud and Supabase backends via an environment variable toggle:
- `VITE_BACKEND=atoms` → Uses @metagptx/web-sdk (default, current behavior)
- `VITE_BACKEND=supabase` → Uses @supabase/supabase-js

## Files to Create

### 1. Supabase Client Config
- `app/frontend/src/lib/supabase.ts` — Supabase client initialization

### 2. SQL Migration
- `app/frontend/supabase-migration.sql` — Complete SQL for Supabase tables + RLS policies

### 3. Supabase Data Layer
- `app/frontend/src/lib/supabase-api.ts` — All CRUD functions using Supabase client

### 4. Supabase Auth
- `app/frontend/src/lib/supabase-auth.ts` — Auth functions using Supabase Auth

### 5. Unified Backend Switcher
- `app/frontend/src/lib/backend.ts` — Environment-based switcher between Atoms/Supabase

### 6. Updated Pages (modify existing)
- `app/frontend/src/lib/api.ts` — Re-export from backend.ts switcher
- `app/frontend/src/contexts/AuthContext.tsx` — Use backend switcher for auth
- `app/frontend/src/pages/Cart.tsx` — Use backend switcher
- `app/frontend/src/pages/Orders.tsx` — Use backend switcher
- `app/frontend/src/pages/PaymentSuccess.tsx` — Use backend switcher
- `app/frontend/src/pages/ProductDetail.tsx` — Use backend switcher

### 7. Deployment Guide
- `app/frontend/HOSTINGER_DEPLOY.md` — Complete deployment guide

### 8. Build & Verify
- Run lint + build to ensure everything works

## Supabase Project Details
- URL: https://kplytcewvhdcksclgftp.supabase.co
- Publishable Key: sb_publishable_nkuzO9R75b6-6ifu0AzE5g_sSqNkaIV