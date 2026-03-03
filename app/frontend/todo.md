# El Crunchae - Full Stack Update with Atoms Cloud + Razorpay

## Design Guidelines (Existing - Preserved)
- **Primary**: #FAFAF5 (Cream background), #1B5E20 (Green-800), #2E7D32 (Green-700)
- **Accent**: #E65100 (Orange-600), #F59E0B (Amber-500)
- **Typography**: System fonts, clean modern style
- **Style**: Natural, organic, premium food brand

## Tasks

### 1. Hero Image Restoration
- Copy user's uploaded image (24) as hero background → `/assets/hero/hero-original.png`
- Update `Index.tsx` HERO_BG to use local path

### 2. Database Tables (Atoms Cloud)
- `products` table (create_only=false, public data)
- `orders` table (create_only=true, user-specific)
- `order_items` table (create_only=true, user-specific)
- `reviews` table (create_only=true, user-specific)
- `testimonials` table (create_only=false, public data)

### 3. Seed Product Data
- Insert all 20 products from products.ts into Atoms Cloud
- Use existing local image paths

### 4. Razorpay Integration (Backend)
- Create `backend/routers/payments.py` with Razorpay order creation + verification
- Create `backend/services/razorpay_service.py` for Razorpay API calls

### 5. Frontend Updates (Files to modify)
- `src/lib/api.ts` → Replace PHP API calls with Atoms Cloud Web SDK
- `src/lib/auth.ts` → Use Atoms Cloud auth (client.auth)
- `src/contexts/AuthContext.tsx` → Use Atoms Cloud auth
- `src/contexts/CartContext.tsx` → Keep localStorage cart (no change needed)
- `src/pages/Index.tsx` → Update hero image path
- `src/pages/Cart.tsx` → Razorpay checkout integration
- `src/pages/PaymentSuccess.tsx` → Razorpay verification
- `src/pages/Orders.tsx` → Fetch from Atoms Cloud
- `src/components/LoginModal.tsx` → Use Atoms Cloud auth

### 6. Build & Verify
- Run lint + build
- CheckUI verification

## File Count: 7 files to modify/create (within limit)
1. `src/lib/api.ts` (rewrite for Atoms Cloud)
2. `src/lib/auth.ts` (rewrite for Atoms Cloud)  
3. `src/contexts/AuthContext.tsx` (rewrite for Atoms Cloud)
4. `src/pages/Index.tsx` (hero image fix)
5. `src/pages/Cart.tsx` (Razorpay checkout)
6. `src/pages/PaymentSuccess.tsx` (Razorpay verify)
7. `backend/routers/payments.py` (Razorpay backend)