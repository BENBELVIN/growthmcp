"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  fetchGscOverview,
  getValidAccessToken as getGscAccessToken,
} from "@/lib/gsc/client";
import {
  fetchBingOverview,
  getValidAccessToken as getBingAccessToken,
  type BingOverviewStats,
} from "@/lib/bing/client";
import { buildCommandCenter, type CommandCenterData } from "@/lib/gsc/command-center";
import { getGscConnectionSecret } from "@/lib/gsc/queries";
import { getBingConnectionSecret } from "@/lib/bing/queries";
import { listTrendOpportunities } from "@/lib/trends/repository";
import { buildUnifiedPriorities } from "@/lib/growth/priorities";
import type { GscOverviewStats } from "@/lib/gsc/client";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

async function loadGscStats(
  supabase: Awaited<ReturnType<typeof createClient>>,
  websiteId: string
): Promise<GscOverviewStats | null> {
  const connection = await getGscConnectionSecret(websiteId);
  if (
    !connection ||
    connection.status !== "connected" ||
    !connection.property_uri
  ) {
    return null;
  }
  const accessToken = await getGscAccessToken(supabase, connection);
  return fetchGscOverview(accessToken, connection.property_uri, "28d");
}

async function loadBingStats(
  supabase: Awaited<ReturnType<typeof createClient>>,
  websiteId: string
): Promise<BingOverviewStats | null> {
  const connection = await getBingConnectionSecret(websiteId);
  if (
    !connection ||
    connection.status !== "connected" ||
    !connection.property_uri
  ) {
    return null;
  }
  const accessToken = await getBingAccessToken(supabase, connection);
  return fetchBingOverview(accessToken, connection.property_uri, "28d");
}

/**
 * Overview command centre: merged Top priorities from Search Console + Bing + Trends.
 * This is the queue MCP should expose to Cursor.
 */
export async function getOverviewCommandCenter(websiteId: string): Promise<{
  connected: boolean;
  command: CommandCenterData | null;
  error?: string;
}> {
  const { supabase } = await requireUser();

  let trendOpportunities = [] as Awaited<
    ReturnType<typeof listTrendOpportunities>
  >;
  try {
    trendOpportunities = await listTrendOpportunities(
      supabase,
      websiteId,
      "open"
    );
  } catch {
    trendOpportunities = [];
  }

  try {
    const [gscStats, bingStats] = await Promise.all([
      loadGscStats(supabase, websiteId).catch(() => null),
      loadBingStats(supabase, websiteId).catch(() => null),
    ]);

    const command = buildCommandCenter(
      gscStats,
      trendOpportunities,
      bingStats
    );
    const connected = Boolean(gscStats || bingStats || trendOpportunities.length);

    return {
      connected,
      command:
        connected || command.priorities.length > 0 ? command : null,
    };
  } catch (e) {
    const command = buildCommandCenter(null, trendOpportunities, null);
    return {
      connected: trendOpportunities.length > 0,
      command: command.priorities.length > 0 ? command : null,
      error: e instanceof Error ? e.message : "Failed to load overview",
    };
  }
}

/**
 * MCP-ready priority queue (same merge as Overview, configurable limit).
 */
export async function getGrowthPrioritiesForWebsite(
  websiteId: string,
  limit = 15
) {
  const { supabase } = await requireUser();

  let trendOpportunities = [] as Awaited<
    ReturnType<typeof listTrendOpportunities>
  >;
  try {
    trendOpportunities = await listTrendOpportunities(
      supabase,
      websiteId,
      "open"
    );
  } catch {
    trendOpportunities = [];
  }

  try {
    const [gscStats, bingStats] = await Promise.all([
      loadGscStats(supabase, websiteId).catch(() => null),
      loadBingStats(supabase, websiteId).catch(() => null),
    ]);

    return {
      priorities: buildUnifiedPriorities({
        gscStats,
        bingStats,
        trendOpportunities,
        limit,
      }),
    };
  } catch (e) {
    return {
      priorities: buildUnifiedPriorities({
        gscStats: null,
        bingStats: null,
        trendOpportunities,
        limit,
      }),
      error: e instanceof Error ? e.message : "Failed to load priorities",
    };
  }
}
