import { googleFaviconUrl } from "@/lib/websites/logo-fallback";

const PRIVATE_HOST =
  /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.|0\.|\[::1\]|.*\.local)$/i;

function isSafeHostname(hostname: string) {
  if (!hostname || !hostname.includes(".")) return false;
  if (PRIVATE_HOST.test(hostname)) return false;
  return true;
}

function absolutize(href: string, base: string) {
  try {
    return new URL(href, base).toString();
  } catch {
    return null;
  }
}

/** Prefer apple-touch / large icons, then any icon link. */
function extractIconFromHtml(html: string, baseUrl: string): string | null {
  const linkRe = /<link\b[^>]*rel=["']([^"']*)["'][^>]*>/gi;
  const candidates: { href: string; score: number }[] = [];

  let match: RegExpExecArray | null;
  while ((match = linkRe.exec(html)) !== null) {
    const tag = match[0];
    const rel = match[1].toLowerCase();
    if (!/(icon|apple-touch-icon)/.test(rel)) continue;

    const hrefMatch = tag.match(/href=["']([^"']+)["']/i);
    if (!hrefMatch?.[1]) continue;

    const href = absolutize(hrefMatch[1], baseUrl);
    if (!href) continue;

    let score = 1;
    if (rel.includes("apple-touch-icon")) score += 5;
    const sizes = tag.match(/sizes=["'](\d+)x(\d+)["']/i);
    if (sizes) score += Math.min(Number(sizes[1]) / 32, 8);
    if (href.endsWith(".svg")) score += 2;
    if (href.endsWith(".png")) score += 1;

    candidates.push({ href, score });
  }

  candidates.sort((a, b) => b.score - a.score);
  return candidates[0]?.href ?? null;
}

async function fetchWithTimeout(url: string, ms = 4000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent": "GrowthMCP/1.0 (+https://growthmcp.app)",
      },
    });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Resolve a logo URL for a project site.
 * Tries the site's own icon links, then falls back to Google's favicon service.
 */
export async function resolveProjectLogo(siteUrl: string): Promise<string> {
  let parsed: URL;
  try {
    parsed = new URL(siteUrl);
  } catch {
    return googleFaviconUrl("example.com");
  }

  const hostname = parsed.hostname.replace(/^www\./, "");
  const fallback = googleFaviconUrl(hostname);

  if (!isSafeHostname(hostname)) {
    return fallback;
  }

  try {
    const res = await fetchWithTimeout(parsed.origin + "/");
    if (res.ok) {
      const html = await res.text();
      const icon = extractIconFromHtml(html, parsed.origin);
      if (icon) return icon;
    }
  } catch {
    // Network / timeout — use fallback
  }

  return fallback;
}
