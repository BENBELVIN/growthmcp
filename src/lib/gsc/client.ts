import { refreshAccessToken } from "@/lib/gsc/oauth";
import type { createClient } from "@/lib/supabase/server";

type Supabase = Awaited<ReturnType<typeof createClient>>;

export type GscSiteEntry = {
  siteUrl: string;
  permissionLevel?: string;
};

export type GscSearchRow = {
  keys?: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

export type GscDimRow = {
  key: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

export type GscQueryRow = GscDimRow;
export type GscPageRow = GscDimRow;
export type GscCountryRow = GscDimRow;

export type GscDailyPoint = {
  date: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

export type GscRangeKey = "24h" | "7d" | "28d" | "3m";

export const GSC_RANGE_OPTIONS: {
  key: GscRangeKey;
  label: string;
  days: number;
}[] = [
  { key: "24h", label: "24 hours", days: 1 },
  { key: "7d", label: "7 days", days: 7 },
  { key: "28d", label: "28 days", days: 28 },
  { key: "3m", label: "3 months", days: 90 },
];

/** Compact dashboard preview. */
export const GSC_UI_PREVIEW_LIMIT = 10;
/** Expanded dashboard table before showing the full agent set. */
export const GSC_UI_EXPANDED_LIMIT = 25;
/** Rows kept for MCP / agents (and dashboard “show all”). */
export const GSC_AGENT_LIMIT = 100;

export type GscDimSort = "clicks" | "impressions" | "opportunity";

export type GscOverviewStats = {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  /** Ranked by clicks — dashboard + MCP volume view. */
  topQueries: GscDimRow[];
  /** Ranked by impressions — dashboard + MCP visibility view. */
  topPages: GscDimRow[];
  topCountries: GscDimRow[];
  /** High impressions / weak CTR — primary MCP action list. */
  queryOpportunities: GscDimRow[];
  /** High impressions / weak CTR — primary MCP action list. */
  pageOpportunities: GscDimRow[];
  daily: GscDailyPoint[];
  range: { startDate: string; endDate: string; key: GscRangeKey };
  propertyUri: string;
};

function encodeSiteUrl(siteUrl: string) {
  return encodeURIComponent(siteUrl);
}

/** GSC dates are calendar days in America/Los_Angeles (PST/PDT). */
function gscToday(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function addDaysIso(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}

/** Operator-heavy SEO tool queries — hide from the table after ranking. */
function isNoisyQuery(query: string) {
  const q = query.toLowerCase();
  if (q.includes("-site:")) return true;
  if ((q.match(/"/g) ?? []).length >= 4) return true;
  if (q.length > 100) return true;
  return false;
}

/**
 * Visibility that isn't converting. Boosts striking-distance positions (4–20)
 * where title/meta/content tweaks can move the needle.
 */
export function opportunityScore(row: Pick<GscDimRow, "impressions" | "ctr" | "position">) {
  const ctrGap = 1 - Math.min(Math.max(row.ctr, 0), 1);
  const positionBoost =
    row.position >= 4 && row.position <= 20
      ? 1.25
      : row.position > 20 && row.position <= 40
        ? 1.1
        : 1;
  return row.impressions * ctrGap * positionBoost;
}

export function rankGscRows(
  rows: GscSearchRow[] | undefined,
  opts?: {
    filterNoise?: boolean;
    sortBy?: GscDimSort;
    limit?: number;
  }
): GscDimRow[] {
  const sortBy = opts?.sortBy ?? "clicks";
  const limit = opts?.limit ?? GSC_AGENT_LIMIT;

  return (rows ?? [])
    .map((row) => ({
      key: (row.keys?.[0] ?? "").trim(),
      clicks: row.clicks ?? 0,
      impressions: row.impressions ?? 0,
      ctr: row.ctr ?? 0,
      position: row.position ?? 0,
    }))
    .filter((r) => r.key.length > 0)
    .sort((a, b) => {
      if (sortBy === "opportunity") {
        const diff = opportunityScore(b) - opportunityScore(a);
        if (diff !== 0) return diff;
        if (b.impressions !== a.impressions) return b.impressions - a.impressions;
        return a.key.localeCompare(b.key);
      }
      if (sortBy === "impressions") {
        if (b.impressions !== a.impressions) return b.impressions - a.impressions;
        if (b.clicks !== a.clicks) return b.clicks - a.clicks;
      } else {
        if (b.clicks !== a.clicks) return b.clicks - a.clicks;
        if (b.impressions !== a.impressions) return b.impressions - a.impressions;
      }
      return a.key.localeCompare(b.key);
    })
    .filter((r) => (opts?.filterNoise ? !isNoisyQuery(r.key) : true))
    .slice(0, limit);
}

export async function listGscSites(accessToken: string): Promise<string[]> {
  const res = await fetch("https://www.googleapis.com/webmasters/v3/sites", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GSC sites list failed: ${text}`);
  }

  const json = (await res.json()) as { siteEntry?: GscSiteEntry[] };
  return (json.siteEntry ?? []).map((s) => s.siteUrl);
}

export async function querySearchAnalytics(
  accessToken: string,
  siteUrl: string,
  body: Record<string, unknown>
): Promise<{ rows?: GscSearchRow[] }> {
  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeSiteUrl(siteUrl)}/searchAnalytics/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GSC searchAnalytics failed: ${text}`);
  }

  return (await res.json()) as { rows?: GscSearchRow[] };
}

export async function getValidAccessToken(
  supabase: Supabase,
  connection: {
    id: string;
    access_token: string;
    refresh_token: string;
    token_expires_at: string;
  }
) {
  const expiresAt = new Date(connection.token_expires_at).getTime();
  const needsRefresh = expiresAt - Date.now() < 60_000;

  if (!needsRefresh) {
    return connection.access_token;
  }

  const tokens = await refreshAccessToken(connection.refresh_token);
  const tokenExpiresAt = new Date(
    Date.now() + tokens.expires_in * 1000
  ).toISOString();

  await supabase
    .from("gsc_connections")
    .update({
      access_token: tokens.access_token,
      token_expires_at: tokenExpiresAt,
      ...(tokens.refresh_token
        ? { refresh_token: tokens.refresh_token }
        : {}),
    })
    .eq("id", connection.id);

  return tokens.access_token;
}

/**
 * Resolve a GSC-style preset window ending on the latest day with data (PST).
 * days=1 → that single latest day ("24 hours" in the UI).
 */
async function resolveRange(
  accessToken: string,
  propertyUri: string,
  days: number
): Promise<{ startDate: string; endDate: string }> {
  const todayPst = gscToday();
  const probeEnd = addDaysIso(todayPst, -1);
  // Probe far enough back to find the newest available day
  const probeStart = addDaysIso(probeEnd, -Math.max(days + 14, 45));

  const probe = await querySearchAnalytics(accessToken, propertyUri, {
    startDate: probeStart,
    endDate: probeEnd,
    searchType: "web",
    dataState: "all",
    dimensions: ["date"],
    rowLimit: 250,
  });

  const dates = (probe.rows ?? [])
    .map((r) => r.keys?.[0])
    .filter((d): d is string => Boolean(d))
    .sort();

  const endDate = dates[dates.length - 1] ?? probeEnd;
  const startDate = addDaysIso(endDate, -(Math.max(days, 1) - 1));
  return { startDate, endDate };
}

export async function fetchGscOverview(
  accessToken: string,
  propertyUri: string,
  rangeKey: GscRangeKey = "28d"
): Promise<GscOverviewStats> {
  const option =
    GSC_RANGE_OPTIONS.find((o) => o.key === rangeKey) ?? GSC_RANGE_OPTIONS[2];

  const { startDate, endDate } = await resolveRange(
    accessToken,
    propertyUri,
    option.days
  );

  const base = {
    startDate,
    endDate,
    searchType: "web" as const,
    dataState: "all" as const,
  };

  const daySpan = option.days;

  const [totals, byDate, queries, pages, countries] = await Promise.all([
    querySearchAnalytics(accessToken, propertyUri, {
      ...base,
      dimensions: [],
      rowLimit: 1,
    }),
    querySearchAnalytics(accessToken, propertyUri, {
      ...base,
      dimensions: ["date"],
      rowLimit: Math.min(Math.max(daySpan + 5, 32), 250),
    }),
    querySearchAnalytics(accessToken, propertyUri, {
      ...base,
      dimensions: ["query"],
      rowLimit: 1000,
      startRow: 0,
    }),
    querySearchAnalytics(accessToken, propertyUri, {
      ...base,
      dimensions: ["page"],
      rowLimit: 1000,
      startRow: 0,
    }),
    querySearchAnalytics(accessToken, propertyUri, {
      ...base,
      dimensions: ["country"],
      rowLimit: 250,
      startRow: 0,
    }),
  ]);

  const daily = (byDate.rows ?? [])
    .map((row) => ({
      date: row.keys?.[0] ?? "",
      clicks: row.clicks ?? 0,
      impressions: row.impressions ?? 0,
      ctr: row.ctr ?? 0,
      position: row.position ?? 0,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const aggregate = totals.rows?.[0];
  const summedClicks = daily.reduce((s, d) => s + d.clicks, 0);
  const summedImpressions = daily.reduce((s, d) => s + d.impressions, 0);

  const clicks = aggregate?.clicks ?? summedClicks;
  const impressions = aggregate?.impressions ?? summedImpressions;
  const ctr =
    aggregate?.ctr ?? (impressions > 0 ? clicks / impressions : 0);
  const position = aggregate?.position ?? 0;

  return {
    clicks,
    impressions,
    ctr,
    position,
    topQueries: rankGscRows(queries.rows, {
      filterNoise: true,
      sortBy: "clicks",
      limit: GSC_AGENT_LIMIT,
    }),
    topPages: rankGscRows(pages.rows, {
      sortBy: "impressions",
      limit: GSC_AGENT_LIMIT,
    }),
    topCountries: rankGscRows(countries.rows, {
      sortBy: "clicks",
      limit: GSC_UI_PREVIEW_LIMIT,
    }),
    queryOpportunities: rankGscRows(queries.rows, {
      filterNoise: true,
      sortBy: "opportunity",
      limit: GSC_AGENT_LIMIT,
    }),
    pageOpportunities: rankGscRows(pages.rows, {
      sortBy: "opportunity",
      limit: GSC_AGENT_LIMIT,
    }),
    daily,
    range: { startDate, endDate, key: option.key },
    propertyUri,
  };
}
