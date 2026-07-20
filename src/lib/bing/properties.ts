/**
 * Prefer the www URL-prefix property for a Bing Webmaster site.
 * Bing typically returns http(s) URLs ending with /.
 */
export function preferBingProperty(
  projectUrl: string,
  siteUrls: string[]
): { preferred: string | null; ranked: string[] } {
  let host: string;
  try {
    host = new URL(projectUrl).hostname.replace(/^www\./i, "").toLowerCase();
  } catch {
    return { preferred: null, ranked: siteUrls };
  }

  const score = (site: string) => {
    let hostname: string;
    try {
      hostname = new URL(site).hostname.replace(/^www\./i, "").toLowerCase();
    } catch {
      return 0;
    }
    if (hostname !== host) {
      return site.toLowerCase().includes(host) ? 10 : 0;
    }
    const lower = site.toLowerCase();
    if (lower.includes(`://www.${host}`)) return 100;
    if (lower.includes(`://${host}`)) return 60;
    return 40;
  };

  const ranked = [...siteUrls].sort((a, b) => score(b) - score(a));
  const wwwMatch = siteUrls.find((s) => {
    try {
      const u = new URL(s);
      return u.hostname.toLowerCase() === `www.${host}`;
    } catch {
      return false;
    }
  });

  const preferred =
    wwwMatch ?? ranked.find((s) => score(s) >= 60) ?? null;

  return {
    preferred,
    ranked: wwwMatch
      ? [wwwMatch, ...ranked.filter((s) => s !== wwwMatch)]
      : ranked,
  };
}
