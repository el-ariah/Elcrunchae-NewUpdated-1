/**
 * Runtime configuration — PHP/MySQL backend on Hostinger.
 */

export async function loadRuntimeConfig(): Promise<void> {
  // No runtime config needed — API is served from the same domain
  return;
}

export function getAPIBaseURL(): string {
  return import.meta.env.VITE_API_BASE || "/api";
}

export const config = {
  get API_BASE_URL() {
    return getAPIBaseURL();
  },
};