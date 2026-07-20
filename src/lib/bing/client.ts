import { refreshAccessToken } from "@/lib/bing/oauth";
import { opportunityScore } from "@/lib/gsc/client";

export type BingDimRow = {
  key: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

export type BingDailyPoint = {
  date: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

export type BingRangeKey = "24h" | "7d" | "28d" | "3m";

export const BING_RANGE_OPTIONS: {
  key: BingRangeKey;
  label: string;
  days: number;
}[] = [
  { key: "24h", label: "24 hours", days: 1 },
  { key: "7d", label: "7 days", days: 7 },
  { key: "28d", label: "28 days", days: 28 },
  { key: "3m", label: "3 months", days: 90 },
];

export const BING_UI_PREVIEW_LIMIT = 10;
export const BING_UI_EXPANDED_LIMIT = 25;
export const BING_AGENT_LIMIT = 100;

export type BingOverviewStats = {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  topQueries: BingDimRow[];
  topPages: BingDimRow[];
  queryOpportunities: BingDimRow[];
  pageOpportunities: BingDimRow[];
  daily: BingDailyPoint[];
  range: { startDate: string; endDate: string; key: BingRangeKey };
  propertyUri: string;
};

type BingQueryStatsRow = {
  Query?: string;
  Clicks?: number;
  Impressions?: number;
  AvgClickPosition?: number;
  AvgImpressionPosition?: number;
  Date?: string;
};

type BingTrafficRow = {
  Clicks?: number;
  Impressions?: number;
  Date?: string;
};

type BingSite = {
  Url?: string;
  IsVerified?: boolean;
};

const API_BASE = "https://ssl.bing.com/webmaster/api.svc/json";

function todayIso(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "UTC",
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

/** Parse Bing `/Date(ms±offset)/` or ISO strings into YYYY-MM-DD. */
export function parseBingDate(value: string | undefined): string | null {
  if (!value) return null;
  const msMatch = /\/Date\((-?\d+)(?:[+-]\d{4})?\)\//.exec(value);
  if (msMatch) {
    return new Date(Number(msMatch[1])).toISOString().slice(0, 10);
  }
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value.slice(0, 10);
  }
  const parsed = Date.parse(value);
  if (!Number.isNaN(parsed)) {
    return new Date(parsed).toISOString().slice(0, 10);
  }
  return null;
}

async function bingGet<T>(
  accessToken: string,
  method: string,
  params?: Record<string, string>
): Promise<T> {
  const url = new URL(`${API_BASE}/${method}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      url.searchParams.set(k, v);
    }
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Bing ${method} failed: ${text}`);
  }

  const json = (await res.json()) as { d?: T; Message?: string };
  if (json.d === undefined) {
    throw new Error(json.Message ?? `Bing ${method} returned empty payload`);
  }
  return json.d;
}

export async function listBingSites(accessToken: string): Promise<string[]> {
  const sites = await bingGet<BingSite[]>(accessToken, "GetUserSites");
  return (sites ?? [])
    .filter((s) => s.IsVerified !== false && s.Url)
    .map((s) => s.Url as string);
}

function aggregateDimRows(
  rows: BingQueryStatsRow[],
  startDate: string,
  endDate: string
): BingDimRow[] {
  const map = new Map<
    string,
    { clicks: number; impressions: number; positionWeighted: number }
  >();

  for (const row of rows) {
    const key = (row.Query ?? "").trim();
    if (!key) continue;
    const date = parseBingDate(row.Date);
    if (date && (date < startDate || date > endDate)) continue;

    const clicks = row.Clicks ?? 0;
    const impressions = row.Impressions ?? 0;
    const position =
      row.AvgImpressionPosition ?? row.AvgClickPosition ?? 0;

    const prev = map.get(key) ?? {
      clicks: 0,
      impressions: 0,
      positionWeighted: 0,
    };
    prev.clicks += clicks;
    prev.impressions += impressions;
    prev.positionWeighted += position * Math.max(impressions, 1);
    map.set(key, prev);
  }

  return [...map.entries()].map(([key, v]) => {
    const impressions = v.impressions;
    const clicks = v.clicks;
    const weight = Math.max(impressions, 1);
    return {
      key,
      clicks,
      impressions,
      ctr: impressions > 0 ? clicks / impressions : 0,
      position: v.positionWeighted / weight,
    };
  });
}

function rankDimRows(
  rows: BingDimRow[],
  opts: {
    sortBy: "clicks" | "impressions" | "opportunity";
    limit: number;
  }
): BingDimRow[] {
  return [...rows]
    .sort((a, b) => {
      if (opts.sortBy === "opportunity") {
        const diff = opportunityScore(b) - opportunityScore(a);
        if (diff !== 0) return diff;
        if (b.impressions !== a.impressions) return b.impressions - a.impressions;
        return a.key.localeCompare(b.key);
      }
      if (opts.sortBy === "impressions") {
        if (b.impressions !== a.impressions) return b.impressions - a.impressions;
        if (b.clicks !== a.clicks) return b.clicks - a.clicks;
      } else {
        if (b.clicks !== a.clicks) return b.clicks - a.clicks;
        if (b.impressions !== a.impressions) return b.impressions - a.impressions;
      }
      return a.key.localeCompare(b.key);
    })
    .slice(0, opts.limit);
}

type SupabaseLike = {
  from: (table: string) => {
    update: (values: Record<string, unknown>) => {
      eq: (
        column: string,
        value: string
      ) => PromiseLike<{ error: { message: string } | null }>;
    };
  };
};

export async function getValidAccessToken(
  supabase: SupabaseLike,
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

  // Bing may rotate refresh tokens — always persist a new one when returned.
  await supabase
    .from("bing_connections")
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

export async function fetchBingOverview(
  accessToken: string,
  propertyUri: string,
  rangeKey: BingRangeKey = "28d"
): Promise<BingOverviewStats> {
  const option =
    BING_RANGE_OPTIONS.find((o) => o.key === rangeKey) ?? BING_RANGE_OPTIONS[2];

  const [queryRows, pageRows, trafficRows] = await Promise.all([
    bingGet<BingQueryStatsRow[]>(accessToken, "GetQueryStats", {
      siteUrl: propertyUri,
    }),
    bingGet<BingQueryStatsRow[]>(accessToken, "GetPageStats", {
      siteUrl: propertyUri,
    }),
    bingGet<BingTrafficRow[]>(accessToken, "GetRankAndTrafficStats", {
      siteUrl: propertyUri,
    }),
  ]);

  const dailyAll = (trafficRows ?? [])
    .map((row) => {
      const date = parseBingDate(row.Date);
      if (!date) return null;
      const clicks = row.Clicks ?? 0;
      const impressions = row.Impressions ?? 0;
      return {
        date,
        clicks,
        impressions,
        ctr: impressions > 0 ? clicks / impressions : 0,
        position: 0,
      };
    })
    .filter((r): r is BingDailyPoint => r !== null)
    .sort((a, b) => a.date.localeCompare(b.date));

  const endDate =
    dailyAll[dailyAll.length - 1]?.date ?? addDaysIso(todayIso(), -1);
  const startDate = addDaysIso(endDate, -(Math.max(option.days, 1) - 1));

  const daily = dailyAll.filter(
    (d) => d.date >= startDate && d.date <= endDate
  );

  const clicks = daily.reduce((s, d) => s + d.clicks, 0);
  const impressions = daily.reduce((s, d) => s + d.impressions, 0);
  const ctr = impressions > 0 ? clicks / impressions : 0;

  const queries = aggregateDimRows(queryRows ?? [], startDate, endDate);
  const pages = aggregateDimRows(pageRows ?? [], startDate, endDate);

  const positionWeight = pages.reduce(
    (s, p) => s + p.position * Math.max(p.impressions, 1),
    0
  );
  const positionDenom = pages.reduce(
    (s, p) => s + Math.max(p.impressions, 1),
    0
  );
  const position = positionDenom > 0 ? positionWeight / positionDenom : 0;

  return {
    clicks,
    impressions,
    ctr,
    position,
    topQueries: rankDimRows(queries, {
      sortBy: "clicks",
      limit: BING_AGENT_LIMIT,
    }),
    topPages: rankDimRows(pages, {
      sortBy: "impressions",
      limit: BING_AGENT_LIMIT,
    }),
    queryOpportunities: rankDimRows(queries, {
      sortBy: "opportunity",
      limit: BING_AGENT_LIMIT,
    }),
    pageOpportunities: rankDimRows(pages, {
      sortBy: "opportunity",
      limit: BING_AGENT_LIMIT,
    }),
    daily,
    range: { startDate, endDate, key: option.key },
    propertyUri,
  };
}
