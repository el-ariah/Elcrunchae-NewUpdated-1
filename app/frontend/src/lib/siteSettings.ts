/**
 * Site settings stored in localStorage for admin-configurable options.
 * These settings control visual aspects of the website that can be
 * adjusted from the Admin panel without code changes.
 */

export interface SiteSettings {
  heroOverlayOpacity: number; // 0 to 100 (percentage)
  heroMobileOverlayOpacity: number; // 0 to 100 (percentage for mobile)
}

const SETTINGS_KEY = "ec_site_settings";

const defaultSettings: SiteSettings = {
  heroOverlayOpacity: 65,
  heroMobileOverlayOpacity: 75,
};

export function getSiteSettings(): SiteSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...defaultSettings };
    const parsed = JSON.parse(raw);
    return {
      heroOverlayOpacity:
        typeof parsed.heroOverlayOpacity === "number"
          ? parsed.heroOverlayOpacity
          : defaultSettings.heroOverlayOpacity,
      heroMobileOverlayOpacity:
        typeof parsed.heroMobileOverlayOpacity === "number"
          ? parsed.heroMobileOverlayOpacity
          : defaultSettings.heroMobileOverlayOpacity,
    };
  } catch {
    return { ...defaultSettings };
  }
}

export function saveSiteSettings(settings: SiteSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export { defaultSettings };