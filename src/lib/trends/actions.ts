"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  fetchGscOverview,
  getValidAccessToken,
} from "@/lib/gsc/client";
import { getGscConnectionSecret } from "@/lib/gsc/queries";
import {
  listProjectTrends,
  listTrendOpportunities,
  replaceOpenTrendOpportunities,
  upsertProjectTrends,
} from "@/lib/trends/repository";
import {
  bundlesFromStoredTrends,
  fetchTrendsForProject,
  formatTrendDeltaPercent,
  generateTrendOpportunities,
  type GscQuerySeed,
  type InterestOverTimePoint,
  type RegionInterestItem,
  type RelatedQueryItem,
  type RelatedTopicItem,
} from "@/services/google-trends";
import type { ProjectTrend, TrendOpportunity } from "@/types/database";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

export type TrendsInsightsPayload = {
  trends: ProjectTrend[];
  opportunities: TrendOpportunity[];
  chartSeries: InterestOverTimePoint[];
  relatedQueries: RelatedQueryItem[];
  relatedTopics: RelatedTopicItem[];
  regions: RegionInterestItem[];
  trendingKeywords: {
    keyword: string;
    interestScore: number;
    trendDirection: string;
    deltaPercent: number | null;
  }[];
  lastSyncedAt: string | null;
  gscConnected: boolean;
};

function mergeTimeline(trends: ProjectTrend[]): InterestOverTimePoint[] {
  const primary = trends[0];
  if (!primary) return [];
  return (primary.interest_over_time ?? []) as InterestOverTimePoint[];
}

async function loadGscQuerySeeds(
  supabase: Awaited<ReturnType<typeof createClient>>,
  websiteId: string
): Promise<GscQuerySeed[]> {
  try {
    const connection = await getGscConnectionSecret(websiteId);
    if (
      !connection ||
      connection.status !== "connected" ||
      !connection.property_uri
    ) {
      return [];
    }
    const accessToken = await getValidAccessToken(supabase, connection);
    const stats = await fetchGscOverview(
      accessToken,
      connection.property_uri,
      "28d"
    );
    const merged = [...stats.topQueries, ...stats.queryOpportunities].map(
      (q) => ({
        query: q.key,
        clicks: q.clicks,
        impressions: q.impressions,
        position: q.position,
      })
    );
    const seen = new Set<string>();
    return merged.filter((q) => {
      const key = q.query.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  } catch {
    return [];
  }
}

/** Rebuild opportunity cards from cached Trends rows (no live Google calls). */
async function rebuildOpportunitiesFromCache(
  supabase: Awaited<ReturnType<typeof createClient>>,
  websiteId: string,
  workspaceId: string,
  trends: ProjectTrend[],
  gscQueries: GscQuerySeed[]
) {
  if (trends.length === 0) return [];
  const drafts = generateTrendOpportunities(
    bundlesFromStoredTrends(trends),
    gscQueries
  );
  await replaceOpenTrendOpportunities(supabase, {
    websiteId,
    workspaceId,
    drafts,
  });
  return listTrendOpportunities(supabase, websiteId, "open");
}

export async function getTrendsInsightsForWebsite(
  websiteId: string
): Promise<{ data: TrendsInsightsPayload | null; error?: string }> {
  const { supabase } = await requireUser();

  try {
    const [trends, gsc] = await Promise.all([
      listProjectTrends(supabase, websiteId),
      getGscConnectionSecret(websiteId),
    ]);

    let opportunities: TrendOpportunity[] = [];

    // Always regenerate GrowthMCP opportunities from cached Trends + live GSC
    // so copy/logic improvements apply without waiting for a live Trends crawl.
    if (trends.length > 0) {
      const website = await supabase
        .from("websites")
        .select("workspace_id")
        .eq("id", websiteId)
        .maybeSingle();
      if (website.data?.workspace_id) {
        const gscQueries = await loadGscQuerySeeds(supabase, websiteId);
        opportunities = await rebuildOpportunitiesFromCache(
          supabase,
          websiteId,
          website.data.workspace_id,
          trends,
          gscQueries
        );
      }
    } else {
      opportunities = await listTrendOpportunities(supabase, websiteId, "open");
    }

    const relatedQueries = trends.flatMap(
      (t) => (t.related_queries ?? []) as RelatedQueryItem[]
    );
    const relatedTopics = trends.flatMap(
      (t) => (t.related_topics ?? []) as RelatedTopicItem[]
    );
    const regions = trends
      .flatMap((t) => (t.interest_by_region ?? []) as RegionInterestItem[])
      .sort((a, b) => b.value - a.value)
      .slice(0, 12);

    const queryMap = new Map<string, RelatedQueryItem>();
    for (const q of relatedQueries) {
      const key = q.query.toLowerCase();
      const existing = queryMap.get(key);
      if (!existing || (q.type === "rising" && existing.type !== "rising")) {
        queryMap.set(key, q);
      }
    }

    const topicMap = new Map<string, RelatedTopicItem>();
    for (const t of relatedTopics) {
      const key = t.title.toLowerCase();
      const existing = topicMap.get(key);
      if (!existing || (t.kind === "rising" && existing.kind !== "rising")) {
        topicMap.set(key, t);
      }
    }

    const lastSyncedAt =
      trends
        .map((t) => t.last_synced_at)
        .filter(Boolean)
        .sort()
        .at(-1) ?? null;

    return {
      data: {
        trends,
        opportunities,
        chartSeries: mergeTimeline(trends),
        relatedQueries: Array.from(queryMap.values()).slice(0, 20),
        relatedTopics: Array.from(topicMap.values()).slice(0, 20),
        regions,
        trendingKeywords: trends.slice(0, 12).map((t) => ({
          keyword: t.keyword,
          interestScore: Number(t.interest_score),
          trendDirection: t.trend_direction,
          deltaPercent: formatTrendDeltaPercent(
            (t.interest_over_time ?? []) as InterestOverTimePoint[]
          ),
        })),
        lastSyncedAt,
        gscConnected: gsc?.status === "connected",
      },
    };
  } catch (e) {
    return {
      data: null,
      error: e instanceof Error ? e.message : "Failed to load Trends data",
    };
  }
}

export async function syncTrendsForWebsite(websiteId: string): Promise<{
  ok: boolean;
  error?: string;
  synced?: number;
  opportunities?: number;
}> {
  const { supabase } = await requireUser();

  const { data: website, error: websiteError } = await supabase
    .from("websites")
    .select("id, workspace_id, name, url")
    .eq("id", websiteId)
    .maybeSingle();

  if (websiteError || !website) {
    return { ok: false, error: websiteError?.message ?? "Project not found" };
  }

  const gscQueries = await loadGscQuerySeeds(supabase, websiteId);

  try {
    const result = await fetchTrendsForProject({
      websiteId: website.id,
      websiteUrl: website.url,
      websiteName: website.name,
      gscQueries,
      geo: "GB",
      maxKeywords: 8,
    });

    // Never wipe existing Trends/opportunities when Google returns nothing.
    if (result.trends.length === 0) {
      const existing = await listProjectTrends(supabase, websiteId);
      if (existing.length > 0) {
        const rebuilt = generateTrendOpportunities(
          bundlesFromStoredTrends(existing),
          gscQueries
        );
        if (rebuilt.length > 0) {
          await replaceOpenTrendOpportunities(supabase, {
            websiteId: website.id,
            workspaceId: website.workspace_id,
            drafts: rebuilt,
          });
        }
        return {
          ok: true,
          synced: 0,
          opportunities: rebuilt.length,
          error:
            "Google Trends throttled live fetch — rebuilt opportunities from cached keywords.",
        };
      }
      return {
        ok: false,
        error:
          "Google Trends returned no data (likely rate limited). Wait a minute and try again.",
      };
    }

    await upsertProjectTrends(supabase, {
      websiteId: website.id,
      workspaceId: website.workspace_id,
      bundles: result.trends,
      syncedAt: result.syncedAt,
    });

    // Prefer freshly generated opps; if empty, still rebuild from stored+new rows
    const drafts =
      result.opportunities.length > 0
        ? result.opportunities
        : generateTrendOpportunities(result.trends, gscQueries);

    await replaceOpenTrendOpportunities(supabase, {
      websiteId: website.id,
      workspaceId: website.workspace_id,
      drafts,
    });

    return {
      ok: true,
      synced: result.keywordsSynced,
      opportunities: drafts.length,
    };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Trends sync failed",
    };
  }
}
