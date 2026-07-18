"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  fetchGscOverview,
  getValidAccessToken,
} from "@/lib/gsc/client";
import { buildCommandCenter, type CommandCenterData } from "@/lib/gsc/command-center";
import { getGscConnectionSecret } from "@/lib/gsc/queries";
import { listTrendOpportunities } from "@/lib/trends/repository";
import { buildUnifiedPriorities } from "@/lib/growth/priorities";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

/**
 * Overview command centre: merged Top priorities from Search Console + Trends.
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
    const connection = await getGscConnectionSecret(websiteId);
    if (
      !connection ||
      connection.status !== "connected" ||
      !connection.property_uri
    ) {
      const command = buildCommandCenter(null, trendOpportunities);
      return {
        connected: false,
        command: command.priorities.length > 0 ? command : null,
      };
    }

    const accessToken = await getValidAccessToken(supabase, connection);
    const stats = await fetchGscOverview(
      accessToken,
      connection.property_uri,
      "28d"
    );

    return {
      connected: true,
      command: buildCommandCenter(stats, trendOpportunities),
    };
  } catch (e) {
    // Still surface Trends-only priorities if GSC fails
    const command = buildCommandCenter(null, trendOpportunities);
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
    const connection = await getGscConnectionSecret(websiteId);
    if (
      !connection ||
      connection.status !== "connected" ||
      !connection.property_uri
    ) {
      return {
        priorities: buildUnifiedPriorities({
          gscStats: null,
          trendOpportunities,
          limit,
        }),
      };
    }

    const accessToken = await getValidAccessToken(supabase, connection);
    const stats = await fetchGscOverview(
      accessToken,
      connection.property_uri,
      "28d"
    );

    return {
      priorities: buildUnifiedPriorities({
        gscStats: stats,
        trendOpportunities,
        limit,
      }),
    };
  } catch (e) {
    return {
      priorities: buildUnifiedPriorities({
        gscStats: null,
        trendOpportunities,
        limit,
      }),
      error: e instanceof Error ? e.message : "Failed to load priorities",
    };
  }
}
