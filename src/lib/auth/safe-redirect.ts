export function getSafeReturnUrl(url: string | null | undefined, fallback = "/dashboard"): string {
  if (!url) return fallback;

  try {
    // Only allow absolute paths (e.g. "/dashboard")
    // If the URL starts with "http://" or "//" it could be a phishing redirect
    if (url.startsWith("/") && !url.startsWith("//")) {
      return url;
    }
  } catch {
    // Return fallback on any parsing error
  }

  return fallback;
}
