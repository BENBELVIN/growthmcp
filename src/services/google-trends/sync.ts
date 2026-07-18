/**
 * Trends sync orchestration for a GrowthMCP project (website).
 * GrowthMCP remains source of truth — Trends only enriches opportunity signals.
 */

import { getKeywordTrendsBundle } from "./service";
import { formatTrendDeltaPercent } from "./parser";
import type {
  KeywordTrendsBundle,
  ProjectTrendsSyncResult,
  TrendOpportunityDraft,
} from "./types";

export type GscQuerySeed = {
  query: string;
  clicks: number;
  impressions: number;
  position: number;
};

export type SyncProjectTrendsInput = {
  websiteId: string;
  websiteUrl: string;
  websiteName: string;
  gscQueries: GscQuerySeed[];
  /** ISO 3166-2 / Trends geo, e.g. "GB". Empty = worldwide. */
  geo?: string;
  maxKeywords?: number;
};

function hostFromUrl(url: string) {
  try {
    return new URL(
      url.startsWith("http") ? url : `https://${url}`
    ).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function brandTokens(name: string, url: string): string[] {
  const host = hostFromUrl(url);
  const parts = [name, host.split(".")[0] ?? ""]
    .join(" ")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 3);
  return Array.from(new Set(parts));
}

/** Prefer GSC demand; fall back to brand/host seeds so Trends still works. */
export function selectSeedKeywords(input: SyncProjectTrendsInput): string[] {
  const limit = input.maxKeywords ?? 8;
  const fromGsc = input.gscQueries
    .slice()
    .sort((a, b) => {
      const aWords = a.query.trim().split(/\s+/).length;
      const bWords = b.query.trim().split(/\s+/).length;
      const aScore = a.impressions / Math.max(aWords, 1);
      const bScore = b.impressions / Math.max(bWords, 1);
      if (bScore !== aScore) return bScore - aScore;
      return aWords - bWords;
    })
    .map((q) => q.query.trim())
    .filter((q) => {
      const words = q.split(/\s+/).length;
      return q.length >= 3 && q.length <= 60 && words <= 5;
    });

  const seeds = [...fromGsc];
  if (seeds.length < Math.min(3, limit)) {
    for (const token of brandTokens(input.websiteName, input.websiteUrl)) {
      if (!seeds.includes(token)) seeds.push(token);
      if (seeds.length >= limit) break;
    }
  }

  return Array.from(new Set(seeds)).slice(0, limit);
}

/** Exact match only — fuzzy includes() was dropping related queries like
 *  "mounjaro constipation relief" because it contains a GSC seed. */
function gscHasExactQuery(seeds: GscQuerySeed[], keyword: string) {
  const needle = keyword.toLowerCase().trim();
  return seeds.some((q) => q.query.toLowerCase().trim() === needle);
}

function gscBestMatch(seeds: GscQuerySeed[], keyword: string) {
  const needle = keyword.toLowerCase().trim();
  return (
    seeds.find((q) => q.query.toLowerCase().trim() === needle) ??
    seeds.find((q) => {
      const qn = q.query.toLowerCase().trim();
      return qn.length >= 4 && (needle.includes(qn) || qn.includes(needle));
    }) ??
    null
  );
}

/**
 * Turn Trends + GSC into GrowthMCP opportunities.
 * Trends enriches; Search Console fills gaps when Trends coverage is thin.
 */
export function generateTrendOpportunities(
  bundles: KeywordTrendsBundle[],
  gscQueries: GscQuerySeed[]
): TrendOpportunityDraft[] {
  const drafts: TrendOpportunityDraft[] = [];
  const seen = new Set<string>();

  const push = (draft: TrendOpportunityDraft) => {
    const key = draft.keyword.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    drafts.push(draft);
  };

  for (const bundle of bundles) {
    const delta = formatTrendDeltaPercent(bundle.interestOverTime);
    const match = gscBestMatch(gscQueries, bundle.keyword);
    const isRising =
      bundle.trendDirection === "rising" || (delta !== null && delta >= 15);
    const noRanking = !match || match.impressions < 5;
    const deepRanking = Boolean(match && match.position > 15);
    const lowClicks = Boolean(
      match && match.clicks <= 2 && match.impressions >= 5
    );

    if (isRising || noRanking || deepRanking || lowClicks) {
      const trendBit =
        delta !== null
          ? `Trends ${delta > 0 ? "+" : ""}${delta}%.`
          : bundle.trendDirection === "rising"
            ? "Trends rising."
            : null;

      let reason: string;
      if (noRanking) {
        reason = [trendBit, "No Search Console ranking yet. Create a dedicated page."]
          .filter(Boolean)
          .join(" ");
      } else if (deepRanking) {
        reason = [
          trendBit,
          `Search Console position ${match!.position.toFixed(1)}.`,
          "Strengthen content to climb into the top 10.",
        ]
          .filter(Boolean)
          .join(" ");
      } else if (lowClicks) {
        reason = [
          trendBit,
          `${match!.impressions} impressions, ${match!.clicks} clicks.`,
          "Improve title and meta to lift CTR.",
        ]
          .filter(Boolean)
          .join(" ");
      } else {
        reason = [
          trendBit,
          `Ranking around position ${match!.position.toFixed(1)}.`,
          "Refresh the page to capture more demand.",
        ]
          .filter(Boolean)
          .join(" ");
      }

      push({
        keyword: bundle.keyword,
        reason,
        trendScore: Math.min(
          100,
          Math.round(
            Math.max(bundle.interestScore, 10) * 0.55 +
              Math.max(delta ?? (isRising ? 30 : 10), 0) * 0.45
          )
        ),
        status: "open",
      });
    }

    for (const related of bundle.relatedQueries) {
      if (gscHasExactQuery(gscQueries, related.query)) continue;
      const isRelatedRising = related.type === "rising";
      const numericValue =
        typeof related.value === "number" ? related.value : null;
      if (!isRelatedRising && numericValue !== null && numericValue < 20) {
        continue;
      }

      const valueLabel =
        typeof related.value === "string"
          ? related.value
          : isRelatedRising
            ? `+${related.value}`
            : String(related.value);

      push({
        keyword: related.query,
        reason: isRelatedRising
          ? `Rising related query (${valueLabel}) with no ranking. Create a page.`
          : `Strong related query (${valueLabel}) near “${bundle.keyword}” with no ranking. Create a page.`,
        trendScore: Math.min(
          100,
          Math.round(
            Math.max(bundle.interestScore, 10) * 0.35 +
              (numericValue !== null
                ? Math.min(numericValue, 100) * (isRelatedRising ? 0.65 : 0.5)
                : isRelatedRising
                  ? 55
                  : 40)
          )
        ),
        status: "open",
      });
    }
  }

  // Fill from Search Console when Trends coverage is thin
  for (const q of gscQueries
    .slice()
    .filter((row) => row.impressions >= 8)
    .filter(
      (row) => row.position > 12 || (row.clicks <= 1 && row.impressions >= 8)
    )
    .sort((a, b) => b.impressions - a.impressions)) {
    if (seen.has(q.query.toLowerCase())) continue;
    const ctr = q.impressions > 0 ? q.clicks / q.impressions : 0;
    push({
      keyword: q.query,
      reason: `Search Console: ${q.impressions} impressions at position ${q.position.toFixed(1)} (${(ctr * 100).toFixed(1)}% CTR). ${
        q.position > 20 || q.clicks === 0
          ? "Create or expand a page."
          : "Improve content and CTR."
      }`,
      trendScore: Math.min(
        100,
        Math.round(
          Math.min(q.impressions, 80) * 0.7 +
            Math.max(0, 40 - q.position) * 0.5 +
            (1 - Math.min(ctr, 0.1) / 0.1) * 15
        )
      ),
      status: "open",
    });
  }

  return drafts
    .sort((a, b) => b.trendScore - a.trendScore)
    .slice(0, 25);
}

/** Rebuild bundles from persisted project_trends rows (no live Trends API). */
export function bundlesFromStoredTrends(
  rows: Array<{
    keyword: string;
    interest_score: number;
    trend_direction: string;
    related_queries: unknown;
    related_topics: unknown;
    interest_over_time: unknown;
    interest_by_region: unknown;
    region: string | null;
  }>
): KeywordTrendsBundle[] {
  return rows.map((row) => ({
    keyword: row.keyword,
    geo: row.region ?? "worldwide",
    interestOverTime:
      (row.interest_over_time ?? []) as KeywordTrendsBundle["interestOverTime"],
    interestScore: Number(row.interest_score) || 0,
    trendDirection:
      (row.trend_direction as KeywordTrendsBundle["trendDirection"]) ||
      "unknown",
    relatedQueries:
      (row.related_queries ?? []) as KeywordTrendsBundle["relatedQueries"],
    relatedTopics:
      (row.related_topics ?? []) as KeywordTrendsBundle["relatedTopics"],
    interestByRegion:
      (row.interest_by_region ?? []) as KeywordTrendsBundle["interestByRegion"],
  }));
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Fetch Trends for selected keywords (rate-limited). Persistence is caller's job. */
export async function fetchTrendsForProject(
  input: SyncProjectTrendsInput
): Promise<ProjectTrendsSyncResult> {
  const keywords = selectSeedKeywords(input);
  const trends: KeywordTrendsBundle[] = [];

  for (let i = 0; i < keywords.length; i++) {
    const keyword = keywords[i];
    try {
      const extras = i < 2 ? "full" : i < 5 ? "related" : "none";
      const bundle = await getKeywordTrendsBundle(keyword, {
        geo: input.geo,
        extras,
      });
      trends.push(bundle);
    } catch (error) {
      console.warn(
        `[google-trends] failed for "${keyword}":`,
        error instanceof Error ? error.message : error
      );
    }
    if (i < keywords.length - 1) await sleep(2800);
  }

  const opportunities = generateTrendOpportunities(trends, input.gscQueries);
  const syncedAt = new Date().toISOString();

  return {
    websiteId: input.websiteId,
    keywordsSynced: trends.length,
    opportunitiesCreated: opportunities.length,
    trends,
    opportunities,
    syncedAt,
  };
}
