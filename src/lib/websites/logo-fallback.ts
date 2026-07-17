function googleFaviconUrl(hostname: string) {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=128`;
}

/** Client-safe fallback when logo_url is missing. */
export function fallbackProjectLogo(siteUrl: string): string {
  try {
    const hostname = new URL(siteUrl).hostname.replace(/^www\./, "");
    return googleFaviconUrl(hostname);
  } catch {
    return googleFaviconUrl("example.com");
  }
}

export { googleFaviconUrl };
