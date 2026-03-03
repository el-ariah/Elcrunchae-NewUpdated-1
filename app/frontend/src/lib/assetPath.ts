/**
 * Resolves a public asset path.
 * Since the app is deployed at root (/), paths are used as-is.
 * External URLs (https://) and data URIs are returned unchanged.
 */
export function assetPath(path: string): string {
  // Don't modify external URLs or data URIs
  if (path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  // Ensure path starts with /
  if (!path.startsWith('/')) {
    return `/${path}`;
  }
  return path;
}