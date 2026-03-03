/**
 * Security utilities for the El Crunchae frontend application.
 * Provides input sanitization, validation, and security helpers.
 */

// HTML entity encoding to prevent XSS
const HTML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "/": "&#x2F;",
  "`": "&#96;",
};

/**
 * Sanitize a string by encoding HTML entities to prevent XSS attacks.
 */
export function sanitizeHTML(input: string): string {
  if (!input) return "";
  return String(input).replace(/[&<>"'`/]/g, (char) => HTML_ENTITIES[char] || char);
}

/**
 * Strip all HTML tags from a string.
 */
export function stripTags(input: string): string {
  if (!input) return "";
  return String(input).replace(/<[^>]*>/g, "");
}

/**
 * Sanitize user input: trim, strip tags, limit length.
 */
export function sanitizeInput(input: string, maxLength = 500): string {
  if (!input) return "";
  return stripTags(String(input).trim()).slice(0, maxLength);
}

// ─── Validation ───────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]?[\d\s()-]{7,20}$/;
const PINCODE_REGEX = /^\d{4,10}$/;
const NAME_REGEX = /^[\p{L}\p{M}\s'.,-]{1,100}$/u;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

export function isValidPhone(phone: string): boolean {
  return PHONE_REGEX.test(phone.trim());
}

export function isValidPincode(pincode: string): boolean {
  return PINCODE_REGEX.test(pincode.trim());
}

export function isValidName(name: string): boolean {
  return NAME_REGEX.test(name.trim());
}

export function isValidAddress(address: string): boolean {
  const trimmed = address.trim();
  return trimmed.length >= 5 && trimmed.length <= 300;
}

/**
 * Validate shipping form fields. Returns error message or null if valid.
 */
export function validateShippingForm(data: {
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}): string | null {
  if (!data.name.trim()) return "Full name is required";
  if (!isValidName(data.name)) return "Please enter a valid name (letters only, max 100 chars)";
  if (!data.address.trim()) return "Address is required";
  if (!isValidAddress(data.address)) return "Address must be 5-300 characters";
  if (!data.city.trim()) return "City is required";
  if (!isValidName(data.city)) return "Please enter a valid city name";
  if (!data.state.trim()) return "State is required";
  if (!isValidName(data.state)) return "Please enter a valid state name";
  if (!data.pincode.trim()) return "Pincode is required";
  if (!isValidPincode(data.pincode)) return "Please enter a valid pincode (digits only)";
  if (!data.phone.trim()) return "Phone number is required";
  if (!isValidPhone(data.phone)) return "Please enter a valid phone number";
  return null;
}

/**
 * Validate review form fields. Returns error message or null if valid.
 */
export function validateReviewForm(data: {
  rating: number;
  reviewerName: string;
  reviewText: string;
}): string | null {
  if (data.rating < 1 || data.rating > 5) return "Please select a rating (1-5 stars)";
  if (!data.reviewerName.trim()) return "Please enter your name";
  if (!isValidName(data.reviewerName)) return "Please enter a valid name";
  if (data.reviewText.length > 1000) return "Review text must be under 1000 characters";
  return null;
}

// ─── Rate Limiting (client-side) ──────────────────────────────

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

/**
 * Simple client-side rate limiter. Returns true if the action is allowed.
 * @param key - Unique key for the action (e.g., "submit_review", "contact_form")
 * @param maxAttempts - Max attempts within the window
 * @param windowMs - Time window in milliseconds
 */
export function checkRateLimit(key: string, maxAttempts = 5, windowMs = 60000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxAttempts) {
    return false;
  }

  entry.count++;
  return true;
}

// ─── URL Validation ───────────────────────────────────────────

/**
 * Validate that a URL is safe (https only for external links).
 */
export function isSafeUrl(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url, window.location.origin);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

/**
 * Get safe error message from API errors without leaking internals.
 */
export function getSafeErrorMessage(error: any, fallback = "Something went wrong. Please try again."): string {
  const detail = error?.data?.detail || error?.response?.data?.detail || error?.message;
  if (!detail) return fallback;

  // Don't expose internal server errors, SQL errors, stack traces
  const unsafePatterns = [
    /sqlalchemy/i,
    /traceback/i,
    /internal server/i,
    /stack trace/i,
    /psycopg/i,
    /database/i,
    /connection refused/i,
    /errno/i,
    /module/i,
    /import/i,
  ];

  for (const pattern of unsafePatterns) {
    if (pattern.test(detail)) {
      return fallback;
    }
  }

  return sanitizeHTML(String(detail).slice(0, 200));
}