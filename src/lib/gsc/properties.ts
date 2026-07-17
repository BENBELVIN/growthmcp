/**
 * Prefer the www URL-prefix property for a project site.
 * Order: https://www.host/ → sc-domain:host → https://host/ → other matches
 */
export function preferWwwProperty(
  projectUrl: string,
  siteUrls: string[]
): { preferred: string | null; ranked: string[] } {
  let host: string;
  try {
    host = new URL(projectUrl).hostname.replace(/^www\./i, "").toLowerCase();
  } catch {
    return { preferred: null, ranked: siteUrls };
  }

  const wwwUrl = `https://www.${host}/`;
  const apexUrl = `https://${host}/`;
  const domainProp = `sc-domain:${host}`;

  const score = (site: string) => {
    const s = site.toLowerCase();
    if (s === wwwUrl || s === `https://www.${host}`) return 100;
    if (s === domainProp) return 80;
    if (s === apexUrl || s === `https://${host}`) return 60;
    if (s.includes(host)) return 20;
    return 0;
  };

  const ranked = [...siteUrls].sort((a, b) => score(b) - score(a));
  const preferred = ranked.find((s) => score(s) >= 60) ?? null;

  // Always force www when present
  const wwwMatch = siteUrls.find(
    (s) => s.toLowerCase() === wwwUrl || s.toLowerCase() === `https://www.${host}`
  );

  return {
    preferred: wwwMatch ?? preferred,
    ranked: wwwMatch
      ? [wwwMatch, ...ranked.filter((s) => s !== wwwMatch)]
      : ranked,
  };
}

export function normalizeGscSiteUrl(siteUrl: string) {
  if (siteUrl.startsWith("sc-domain:")) return siteUrl;
  try {
    const u = new URL(siteUrl);
    const path = u.pathname.endsWith("/") ? u.pathname : `${u.pathname}/`;
    return `${u.origin}${path === "//" ? "/" : path}`;
  } catch {
    return siteUrl;
  }
}
