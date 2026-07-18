import type { createClient } from "@/lib/supabase/server";
import type {
  InterestOverTimePoint,
  KeywordTrendsBundle,
  RegionInterestItem,
  RelatedQueryItem,
  RelatedTopicItem,
  TrendOpportunityDraft,
} from "@/services/google-trends";
import type {
  ProjectTrend,
  TrendOpportunity,
  TrendOpportunityStatus,
} from "@/types/database";

type Supabase = Awaited<ReturnType<typeof createClient>>;

export async function listProjectTrends(
  supabase: Supabase,
  websiteId: string
): Promise<ProjectTrend[]> {
  const { data, error } = await supabase
    .from("project_trends")
    .select("*")
    .eq("website_id", websiteId)
    .order("interest_score", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as ProjectTrend[];
}

export async function listTrendOpportunities(
  supabase: Supabase,
  websiteId: string,
  status: TrendOpportunityStatus = "open"
): Promise<TrendOpportunity[]> {
  const { data, error } = await supabase
    .from("trend_opportunities")
    .select("*")
    .eq("website_id", websiteId)
    .eq("status", status)
    .order("trend_score", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as TrendOpportunity[];
}

export async function upsertProjectTrends(
  supabase: Supabase,
  params: {
    websiteId: string;
    workspaceId: string;
    bundles: KeywordTrendsBundle[];
    syncedAt: string;
  }
) {
  const rows = params.bundles.map((bundle) => ({
    website_id: params.websiteId,
    workspace_id: params.workspaceId,
    keyword: bundle.keyword,
    interest_score: bundle.interestScore,
    trend_direction: bundle.trendDirection,
    related_queries: bundle.relatedQueries as RelatedQueryItem[],
    related_topics: bundle.relatedTopics as RelatedTopicItem[],
    interest_over_time: bundle.interestOverTime as InterestOverTimePoint[],
    interest_by_region: bundle.interestByRegion as RegionInterestItem[],
    region: bundle.geo,
    last_synced_at: params.syncedAt,
  }));

  if (rows.length === 0) return;

  const { error } = await supabase.from("project_trends").upsert(rows, {
    onConflict: "website_id,keyword",
  });

  if (error) throw new Error(error.message);
}

export async function replaceOpenTrendOpportunities(
  supabase: Supabase,
  params: {
    websiteId: string;
    workspaceId: string;
    drafts: TrendOpportunityDraft[];
  }
) {
  // Never wipe open opportunities with an empty replacement set.
  if (params.drafts.length === 0) return;

  const { error: deleteError } = await supabase
    .from("trend_opportunities")
    .delete()
    .eq("website_id", params.websiteId)
    .eq("status", "open");

  if (deleteError) throw new Error(deleteError.message);

  const { error } = await supabase.from("trend_opportunities").insert(
    params.drafts.map((draft) => ({
      website_id: params.websiteId,
      workspace_id: params.workspaceId,
      keyword: draft.keyword,
      reason: draft.reason,
      trend_score: draft.trendScore,
      status: draft.status,
    }))
  );

  if (error) throw new Error(error.message);
}
