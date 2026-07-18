/**
 * MCP tool handlers — no Next.js cookies / redirects.
 * Uses the service-role Supabase client so Cursor can call GrowthMCP locally.
 */

import { createAdminClient } from "@/lib/supabase/admin";
import {
  fetchGscOverview,
  getValidAccessToken,
  type GscOverviewStats,
} from "@/lib/gsc/client";
import { buildCommandCenter } from "@/lib/gsc/command-center";
import { buildUnifiedPriorities } from "@/lib/growth/priorities";
import { listTrendOpportunities } from "@/lib/trends/repository";
import type { Website } from "@/types/database";

type Admin = ReturnType<typeof createAdminClient>;

function resolveWebsiteId(explicit?: string) {
  return explicit?.trim() || process.env.GROWTHMCP_WEBSITE_ID?.trim() || null;
}

async function getWebsite(admin: Admin, websiteId: string): Promise<Website> {
  const { data, error } = await admin
    .from("websites")
    .select("*")
    .eq("id", websiteId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error(`Project not found: ${websiteId}`);
  return data as Website;
}

async function loadGscStats(
  admin: Admin,
  websiteId: string
): Promise<GscOverviewStats | null> {
  const { data: connection, error } = await admin
    .from("gsc_connections")
    .select(
      "id, website_id, workspace_id, property_uri, status, access_token, refresh_token, token_expires_at, last_synced_at"
    )
    .eq("website_id", websiteId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (
    !connection ||
    connection.status !== "connected" ||
    !connection.property_uri
  ) {
    return null;
  }

  const accessToken = await getValidAccessToken(admin as never, {
    id: connection.id,
    access_token: connection.access_token,
    refresh_token: connection.refresh_token,
    token_expires_at: connection.token_expires_at,
  });

  return fetchGscOverview(accessToken, connection.property_uri, "28d");
}

export async function mcpListProjects() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("websites")
    .select("id, name, url, logo_url, workspace_id, created_at")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return { projects: data ?? [] };
}

export async function mcpGetGrowthPriorities(websiteId?: string, limit = 15) {
  const id = resolveWebsiteId(websiteId);
  if (!id) {
    throw new Error(
      "websiteId is required (or set GROWTHMCP_WEBSITE_ID in the MCP server env)."
    );
  }

  const admin = createAdminClient();
  const website = await getWebsite(admin, id);
  const [stats, trendOpportunities] = await Promise.all([
    loadGscStats(admin, id),
    listTrendOpportunities(admin, id, "open").catch(() => []),
  ]);

  const priorities = buildUnifiedPriorities({
    gscStats: stats,
    trendOpportunities,
    limit,
  });

  return {
    project: { id: website.id, name: website.name, url: website.url },
    priorities,
    count: priorities.length,
  };
}

export async function mcpGetProjectContext(websiteId?: string) {
  const id = resolveWebsiteId(websiteId);
  if (!id) {
    throw new Error(
      "websiteId is required (or set GROWTHMCP_WEBSITE_ID in the MCP server env)."
    );
  }

  const admin = createAdminClient();
  const website = await getWebsite(admin, id);
  const [stats, trendOpportunities] = await Promise.all([
    loadGscStats(admin, id),
    listTrendOpportunities(admin, id, "open").catch(() => []),
  ]);

  const command = buildCommandCenter(stats, trendOpportunities);

  return {
    project: {
      id: website.id,
      name: website.name,
      url: website.url,
    },
    opportunityScore: command.opportunityScore,
    weekSummary: command.weekSummary,
    channels: command.channels,
    connectedIntegrations: command.connectedIntegrations,
    topPriorities: command.priorities.slice(0, 5),
    recommendedContent: command.recommendedContent,
    recentWins: command.recentWins,
    searchConsoleConnected: Boolean(stats),
    trendsOpportunityCount: trendOpportunities.length,
  };
}

/** Channel-oriented alias used by MCP docs / Cursor. */
export async function mcpGetProjectOverview(websiteId?: string) {
  return mcpGetProjectContext(websiteId);
}

export async function mcpGetSeoInsights(websiteId?: string) {
  const id = resolveWebsiteId(websiteId);
  if (!id) {
    throw new Error(
      "websiteId is required (or set GROWTHMCP_WEBSITE_ID in the MCP server env)."
    );
  }

  const [searchConsole, trends] = await Promise.all([
    mcpGetSearchConsole(id),
    mcpGetTrendOpportunities(id),
  ]);

  return {
    channel: "seo" as const,
    searchConsole,
    trends,
  };
}

export async function mcpGetSocialInsights(websiteId?: string) {
  const id = resolveWebsiteId(websiteId);
  if (!id) {
    throw new Error(
      "websiteId is required (or set GROWTHMCP_WEBSITE_ID in the MCP server env)."
    );
  }

  const admin = createAdminClient();
  const website = await getWebsite(admin, id);

  return {
    channel: "social" as const,
    project: { id: website.id, name: website.name, url: website.url },
    connected: false,
    platforms: ["tiktok", "instagram", "x"] as const,
    message:
      "Social integrations are not connected yet. Connect TikTok, Instagram, or X on the Integrations page.",
    metrics: {
      bestPerformingContent: null,
      viewsGrowth: null,
      winningHooks: null,
    },
  };
}

export async function mcpGetAppMetrics(websiteId?: string) {
  const id = resolveWebsiteId(websiteId);
  if (!id) {
    throw new Error(
      "websiteId is required (or set GROWTHMCP_WEBSITE_ID in the MCP server env)."
    );
  }

  const admin = createAdminClient();
  const website = await getWebsite(admin, id);

  return {
    channel: "app" as const,
    project: { id: website.id, name: website.name, url: website.url },
    connected: false,
    sources: ["app_store_connect", "revenuecat", "posthog"] as const,
    message:
      "App growth integrations are not connected yet. Connect App Store Connect, RevenueCat, or PostHog on the Integrations page.",
    metrics: {
      downloads: null,
      subscriptions: null,
      revenue: null,
      reviews: null,
      conversion: null,
    },
  };
}

export async function mcpGetSearchConsole(websiteId?: string) {
  const id = resolveWebsiteId(websiteId);
  if (!id) {
    throw new Error(
      "websiteId is required (or set GROWTHMCP_WEBSITE_ID in the MCP server env)."
    );
  }

  const admin = createAdminClient();
  const website = await getWebsite(admin, id);
  const stats = await loadGscStats(admin, id);

  if (!stats) {
    return {
      project: { id: website.id, name: website.name, url: website.url },
      connected: false,
      message: "Search Console is not connected for this project.",
    };
  }

  return {
    project: { id: website.id, name: website.name, url: website.url },
    connected: true,
    range: stats.range,
    propertyUri: stats.propertyUri,
    totals: {
      clicks: stats.clicks,
      impressions: stats.impressions,
      ctr: stats.ctr,
      position: stats.position,
    },
    topQueries: stats.topQueries.slice(0, 25),
    topPages: stats.topPages.slice(0, 25),
    pageOpportunities: stats.pageOpportunities.slice(0, 15),
    queryOpportunities: stats.queryOpportunities.slice(0, 15),
  };
}

export async function mcpGetTrendOpportunities(websiteId?: string) {
  const id = resolveWebsiteId(websiteId);
  if (!id) {
    throw new Error(
      "websiteId is required (or set GROWTHMCP_WEBSITE_ID in the MCP server env)."
    );
  }

  const admin = createAdminClient();
  const website = await getWebsite(admin, id);
  const opportunities = await listTrendOpportunities(admin, id, "open").catch(
    () => []
  );

  return {
    project: { id: website.id, name: website.name, url: website.url },
    opportunities,
    count: opportunities.length,
  };
}

export async function mcpGetRecommendedContent(websiteId?: string) {
  const id = resolveWebsiteId(websiteId);
  if (!id) {
    throw new Error(
      "websiteId is required (or set GROWTHMCP_WEBSITE_ID in the MCP server env)."
    );
  }

  const admin = createAdminClient();
  const website = await getWebsite(admin, id);
  const [stats, trendOpportunities] = await Promise.all([
    loadGscStats(admin, id),
    listTrendOpportunities(admin, id, "open").catch(() => []),
  ]);
  const command = buildCommandCenter(stats, trendOpportunities);

  return {
    project: { id: website.id, name: website.name, url: website.url },
    recommendedContent: command.recommendedContent,
  };
}

export function jsonResult(data: unknown) {
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(data, null, 2),
      },
    ],
  };
}

export function errorResult(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return {
    content: [{ type: "text" as const, text: `Error: ${message}` }],
    isError: true as const,
  };
}
