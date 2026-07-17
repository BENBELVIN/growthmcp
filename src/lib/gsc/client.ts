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

export type GscQueryRow = {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

export type GscDailyPoint = {
  date: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

export type GscOverviewStats = {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  topQueries: GscQueryRow[];
  daily: GscDailyPoint[];
  range: { startDate: string; endDate: string };
};

function encodeSiteUrl(siteUrl: string) {
  return encodeURIComponent(siteUrl);
}

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

/** Operator-heavy SEO tool queries — deprioritize in the UI. */
function isNoisyQuery(query: string) {
  const q = query.toLowerCase();
  if (q.includes("-site:")) return true;
  if ((q.match(/"/g) ?? []).length >= 4) return true;
  if (q.length > 80) return true;
  return false;
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

export async function fetchGscOverview(
  accessToken: string,
  propertyUri: string
): Promise<GscOverviewStats> {
  const end = new Date();
  end.setUTCDate(end.getUTCDate() - 3); // GSC data lag
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 27);

  const startDate = isoDate(start);
  const endDate = isoDate(end);

  const [totals, byDate, queries] = await Promise.all([
    querySearchAnalytics(accessToken, propertyUri, {
      startDate,
      endDate,
      dimensions: [],
      rowLimit: 1,
    }),
    querySearchAnalytics(accessToken, propertyUri, {
      startDate,
      endDate,
      dimensions: ["date"],
      rowLimit: 32,
    }),
    querySearchAnalytics(accessToken, propertyUri, {
      startDate,
      endDate,
      dimensions: ["query"],
      rowLimit: 50,
    }),
  ]);

  const total = totals.rows?.[0];

  const daily = (byDate.rows ?? [])
    .map((row) => ({
      date: row.keys?.[0] ?? "",
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: row.ctr,
      position: row.position,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const mapped = (queries.rows ?? []).map((row) => ({
    query: row.keys?.[0] ?? "",
    clicks: row.clicks,
    impressions: row.impressions,
    ctr: row.ctr,
    position: row.position,
  }));

  const clean = mapped
    .filter((q) => q.query && !isNoisyQuery(q.query))
    .sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions);

  const fallback = mapped.sort(
    (a, b) => b.clicks - a.clicks || b.impressions - a.impressions
  );

  const topQueries = (clean.length >= 5 ? clean : fallback).slice(0, 10);

  return {
    clicks: total?.clicks ?? 0,
    impressions: total?.impressions ?? 0,
    ctr: total?.ctr ?? 0,
    position: total?.position ?? 0,
    topQueries,
    daily,
    range: { startDate, endDate },
  };
}
