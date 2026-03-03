/**
 * Core types and data layer for El Crunchae.
 * Uses PHP/MySQL backend on Hostinger.
 */

import {
  products as localProducts,
  getProductById as getLocalProductById,
} from "./products";

// ─── API Base URL ────────────────────────────────────────────
// In production on Hostinger, the API files sit at /api/
// During local dev, you can override this via env variable
const API_BASE = import.meta.env.VITE_API_BASE || "/api";

// ─── Auth Token Management ───────────────────────────────────

function getToken(): string | null {
  return localStorage.getItem("ec_token");
}

function setToken(token: string) {
  localStorage.setItem("ec_token", token);
}

function removeToken() {
  localStorage.removeItem("ec_token");
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

// ─── PHP Backend Availability Check ──────────────────────────
// In dev (Vite), PHP files aren't executed — they return HTML.
// We detect this and fall back to localStorage-based mock auth.

let _phpAvailable: boolean | null = null;

async function isPhpBackendAvailable(): Promise<boolean> {
  if (_phpAvailable !== null) return _phpAvailable;
  try {
    const res = await fetch(`${API_BASE}/auth.php?action=ping`, { method: "GET" });
    const text = await res.text();
    // If the response starts with '<', it's HTML (Vite fallback), not JSON
    _phpAvailable = !text.trimStart().startsWith("<");
  } catch {
    _phpAvailable = false;
  }
  return _phpAvailable;
}

// ─── Local Auth Fallback (for dev/preview without PHP) ───────

const LOCAL_USERS_KEY = "ec_local_users";

interface LocalUser {
  id: number;
  email: string;
  name: string;
  role: string;
  passwordHash: string;
}

function getLocalUsers(): LocalUser[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveLocalUsers(users: LocalUser[]) {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}

// Simple hash for local dev only (NOT secure — just for preview)
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return "lh_" + Math.abs(hash).toString(36);
}

function localLogin(email: string, password: string): { token: string; user: AuthUser } {
  const users = getLocalUsers();
  const found = users.find((u) => u.email === email);
  if (!found || found.passwordHash !== simpleHash(password)) {
    throw new Error("Invalid email or password");
  }
  const token = "local_" + btoa(JSON.stringify({ user_id: found.id, exp: Date.now() + 7 * 86400000 }));
  const user: AuthUser = { id: found.id, email: found.email, name: found.name, role: found.role };
  return { token, user };
}

function localRegister(email: string, password: string, name: string): { token: string; user: AuthUser } {
  const users = getLocalUsers();
  if (users.find((u) => u.email === email)) {
    throw new Error("An account with this email already exists");
  }
  const newUser: LocalUser = {
    id: Date.now(),
    email,
    name: name || "Customer",
    role: "customer",
    passwordHash: simpleHash(password),
  };
  users.push(newUser);
  saveLocalUsers(users);
  const token = "local_" + btoa(JSON.stringify({ user_id: newUser.id, exp: Date.now() + 7 * 86400000 }));
  const user: AuthUser = { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role };
  return { token, user };
}

function localGetCurrentUser(): AuthUser | null {
  const token = getToken();
  if (!token || !token.startsWith("local_")) return null;
  try {
    const payload = JSON.parse(atob(token.replace("local_", "")));
    if (payload.exp < Date.now()) return null;
    const users = getLocalUsers();
    const found = users.find((u) => u.id === payload.user_id);
    if (!found) return null;
    return { id: found.id, email: found.email, name: found.name, role: found.role };
  } catch {
    return null;
  }
}

// ─── Types ───────────────────────────────────────────────────

export interface Product {
  id: string;
  dbId: number;
  name: string;
  category: "fruits" | "vegetables" | "cooked-food";
  categoryLabel: string;
  description: string;
  longDescription: string;
  weight: string;
  price: number;
  originalPrice?: number;
  image: string;
  boxImage?: string;
  nutritionHighlights: string[];
  shelfLife: string;
  howToUse: string;
  badge?: string;
  sku?: string;
  stockQuantity?: number;
  isActive?: boolean;
  sortOrder?: number;
}

interface ProductEntity {
  id: number;
  slug: string;
  name: string;
  category: string;
  category_label: string;
  description: string;
  long_description: string;
  weight: string;
  price: number;
  original_price: number | null;
  image: string;
  box_image: string;
  nutrition_highlights: string | string[];
  shelf_life: string;
  how_to_use: string;
  badge: string;
  sku: string;
  stock_quantity: number;
  is_active: boolean;
  sort_order: number;
}

function parseNutritionHighlights(raw: string | string[]): string[] {
  if (Array.isArray(raw)) return raw;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return raw.split(",").map((s) => s.trim());
  }
}

function mapEntityToProduct(entity: ProductEntity): Product {
  return {
    id: entity.slug,
    dbId: entity.id,
    name: entity.name,
    category: entity.category as "fruits" | "vegetables" | "cooked-food",
    categoryLabel: entity.category_label,
    description: entity.description,
    longDescription: entity.long_description,
    weight: entity.weight,
    price: entity.price,
    originalPrice: entity.original_price || undefined,
    image: entity.image,
    boxImage: entity.box_image || undefined,
    nutritionHighlights: parseNutritionHighlights(entity.nutrition_highlights),
    shelfLife: entity.shelf_life,
    howToUse: entity.how_to_use,
    badge: entity.badge || undefined,
    sku: entity.sku || undefined,
    stockQuantity: entity.stock_quantity,
    isActive: entity.is_active,
    sortOrder: entity.sort_order,
  };
}

function mapLocalProduct(p: (typeof localProducts)[number]): Product {
  return {
    id: p.id,
    dbId: 0,
    name: p.name,
    category: p.category,
    categoryLabel: p.categoryLabel,
    description: p.description,
    longDescription: p.longDescription,
    weight: p.weight,
    price: p.price,
    originalPrice: p.originalPrice,
    image: p.image,
    boxImage: p.boxImage,
    nutritionHighlights: p.nutritionHighlights,
    shelfLife: p.shelfLife,
    howToUse: p.howToUse,
    badge: p.badge,
    isActive: true,
  };
}

// ─── Products ────────────────────────────────────────────────

export async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE}/products.php`);
    if (!res.ok) throw new Error("API error");
    const data = await res.json();
    const items = data?.products;
    if (items && items.length > 0) {
      return items.map((item: ProductEntity) => mapEntityToProduct(item));
    }
    return localProducts.map(mapLocalProduct);
  } catch (error) {
    console.warn("API unavailable, using local product data:", error);
    return localProducts.map(mapLocalProduct);
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_BASE}/products.php?slug=${encodeURIComponent(slug)}`);
    if (!res.ok) throw new Error("API error");
    const data = await res.json();
    const product = data?.product;
    if (product) {
      return mapEntityToProduct(product);
    }
    const local = getLocalProductById(slug);
    return local ? mapLocalProduct(local) : null;
  } catch (error) {
    console.warn("API unavailable, using local product data for slug:", slug);
    const local = getLocalProductById(slug);
    return local ? mapLocalProduct(local) : null;
  }
}

// ─── Reviews ─────────────────────────────────────────────────

export interface Review {
  id: number;
  userId: string;
  productId: number;
  rating: number;
  reviewText: string;
  reviewerName: string;
  createdAt: string;
}

export async function fetchReviewsByProductId(productId: number): Promise<Review[]> {
  try {
    const res = await fetch(`${API_BASE}/reviews.php?product_id=${productId}`);
    if (!res.ok) throw new Error("API error");
    const data = await res.json();
    const items = data?.reviews || [];
    return items.map((item: any) => ({
      id: item.id,
      userId: String(item.user_id || ""),
      productId: item.product_id,
      rating: item.rating,
      reviewText: item.review_text || "",
      reviewerName: item.reviewer_name || "Anonymous",
      createdAt: item.created_at || "",
    }));
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return [];
  }
}

export async function createReview(reviewData: {
  product_id: number;
  rating: number;
  review_text: string;
  reviewer_name: string;
}): Promise<Review | null> {
  try {
    const res = await fetch(`${API_BASE}/reviews.php`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(reviewData),
    });
    if (!res.ok) throw new Error("API error");
    const data = await res.json();
    const item = data?.review;
    if (!item) return null;
    return {
      id: item.id,
      userId: String(item.user_id || ""),
      productId: item.product_id,
      rating: item.rating,
      reviewText: item.review_text || "",
      reviewerName: item.reviewer_name || "Anonymous",
      createdAt: item.created_at || "",
    };
  } catch (error) {
    console.error("Failed to create review:", error);
    return null;
  }
}

// ─── Testimonials ────────────────────────────────────────────

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatarUrl: string;
  isFeatured: boolean;
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  // Testimonials are hardcoded since we don't have a PHP endpoint for them
  return [];
}

// ─── Orders ──────────────────────────────────────────────────

export interface Order {
  id: number;
  status: string;
  totalAmount: number;
  shippingFee: number;
  shippingName: string;
  shippingCity: string;
  paymentStatus: string;
  razorpayOrderId: string;
  createdAt: string;
}

export async function fetchOrders(): Promise<Order[]> {
  try {
    const res = await fetch(`${API_BASE}/orders.php`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("API error");
    const data = await res.json();
    const items = data?.orders || [];
    return items.map((item: any) => ({
      id: item.id,
      status: item.status,
      totalAmount: item.total,
      shippingFee: item.shipping_fee || 0,
      shippingName: item.shipping_name || "",
      shippingCity: item.shipping_city || "",
      paymentStatus: item.payment_status || "pending",
      razorpayOrderId: item.razorpay_order_id || "",
      createdAt: item.created_at || "",
    }));
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return [];
  }
}

export async function fetchOrderItems(orderId: number) {
  try {
    const res = await fetch(`${API_BASE}/orders.php?id=${orderId}`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("API error");
    const data = await res.json();
    return data?.items || [];
  } catch (error) {
    console.error("Failed to fetch order items:", error);
    return [];
  }
}

// ─── Payments (Razorpay) ─────────────────────────────────────

export interface RazorpayOrderResponse {
  order_id: number;
  razorpay_order_id: string;
  razorpay_key_id: string;
  amount: number;
  currency: string;
}

export async function createPaymentSession(payload: {
  items: Array<{
    product_id: number;
    product_name: string;
    product_image: string;
    quantity: number;
    unit_price: number;
  }>;
  shipping_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_pincode: string;
  shipping_phone: string;
}): Promise<RazorpayOrderResponse> {
  const res = await fetch(`${API_BASE}/razorpay.php?action=create_order`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Payment failed" }));
    throw new Error(err.error || "Payment failed");
  }
  return res.json();
}

export async function verifyPayment(data: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  order_id: number;
}): Promise<{ status: string; order_id: number; payment_status: string; message: string }> {
  const res = await fetch(`${API_BASE}/razorpay.php?action=verify_payment`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Verification failed" }));
    throw new Error(err.error || "Verification failed");
  }
  return res.json();
}

// ─── Product CRUD (Admin) ────────────────────────────────────

export async function createProduct(data: Record<string, any>): Promise<any> {
  const res = await fetch(`${API_BASE}/products.php`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create product");
  return res.json();
}

export async function updateProduct(dbId: number, data: Record<string, any>): Promise<any> {
  const res = await fetch(`${API_BASE}/products.php?id=${dbId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
}

export async function deleteProduct(dbId: number): Promise<void> {
  const res = await fetch(`${API_BASE}/products.php?id=${dbId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete product");
}

// ─── Auth ────────────────────────────────────────────────────

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: string;
}

export async function loginUser(email: string, password: string): Promise<{ token: string; user: AuthUser }> {
  const phpOk = await isPhpBackendAvailable();

  if (!phpOk) {
    // Fallback: localStorage-based auth for dev/preview
    const result = localLogin(email, password);
    setToken(result.token);
    localStorage.setItem("ec_user", JSON.stringify(result.user));
    return result;
  }

  const res = await fetch(`${API_BASE}/auth.php?action=login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Login failed");
  setToken(data.token);
  localStorage.setItem("ec_user", JSON.stringify(data.user));
  return data;
}

export async function registerUser(email: string, password: string, name: string): Promise<{ token: string; user: AuthUser }> {
  const phpOk = await isPhpBackendAvailable();

  if (!phpOk) {
    // Fallback: localStorage-based auth for dev/preview
    const result = localRegister(email, password, name);
    setToken(result.token);
    localStorage.setItem("ec_user", JSON.stringify(result.user));
    return result;
  }

  const res = await fetch(`${API_BASE}/auth.php?action=register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Registration failed");
  setToken(data.token);
  localStorage.setItem("ec_user", JSON.stringify(data.user));
  return data;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const token = getToken();
  if (!token) return null;

  // If using local auth token, resolve locally
  if (token.startsWith("local_")) {
    const localUser = localGetCurrentUser();
    if (localUser) {
      localStorage.setItem("ec_user", JSON.stringify(localUser));
      return localUser;
    }
    removeToken();
    localStorage.removeItem("ec_user");
    return null;
  }

  // First try cached user
  const cached = localStorage.getItem("ec_user");
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // fall through to API call
    }
  }

  const phpOk = await isPhpBackendAvailable();
  if (!phpOk) {
    // PHP not available, clear stale token
    removeToken();
    localStorage.removeItem("ec_user");
    return null;
  }

  try {
    const res = await fetch(`${API_BASE}/auth.php?action=me`, {
      headers: authHeaders(),
    });
    if (!res.ok) {
      removeToken();
      localStorage.removeItem("ec_user");
      return null;
    }
    const data = await res.json();
    const user = data?.user;
    if (user) {
      localStorage.setItem("ec_user", JSON.stringify(user));
      return user;
    }
    return null;
  } catch {
    return null;
  }
}

export function logout() {
  removeToken();
  localStorage.removeItem("ec_user");
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

// ─── Utility ─────────────────────────────────────────────────

export function openCheckoutUrl(url: string) {
  window.location.href = url;
}

// ─── Categories ──────────────────────────────────────────────

export const categories = [
  {
    id: "fruits",
    name: "Freeze Dried Fruits",
    description: "Crispy, naturally sweet fruits with 97% nutrients retained",
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-50",
    textColor: "text-green-700",
  },
  {
    id: "vegetables",
    name: "Freeze Dried Vegetables",
    description: "Nutrient-dense veggies perfect for cooking and snacking",
    color: "from-orange-500 to-amber-600",
    bgColor: "bg-orange-50",
    textColor: "text-orange-700",
  },
  {
    id: "cooked-food",
    name: "Freeze Dried Cooked Food",
    description: "Complete meals ready in 5 minutes — just add hot water",
    color: "from-red-500 to-rose-600",
    bgColor: "bg-red-50",
    textColor: "text-red-700",
  },
];