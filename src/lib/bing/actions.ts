"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  fetchBingOverview,
  getValidAccessToken,
  listBingSites,
  type BingOverviewStats,
  type BingRangeKey,
} from "@/lib/bing/client";
import { preferBingProperty } from "@/lib/bing/properties";
import { getBingConnectionSecret } from "@/lib/bing/queries";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

export async function listSelectableBingProperties(websiteId: string) {
  const { supabase } = await requireUser();
  const connection = await getBingConnectionSecret(websiteId);
  if (!connection) {
    return { error: "Connect Bing Webmaster first.", sites: [] as string[] };
  }

  const { data: website } = await supabase
    .from("websites")
    .select("url")
    .eq("id", websiteId)
    .maybeSingle();

  if (!website) {
    return { error: "Project not found.", sites: [] as string[] };
  }

  try {
    const accessToken = await getValidAccessToken(
      supabase as never,
      connection
    );
    const sites = await listBingSites(accessToken);
    const { preferred, ranked } = preferBingProperty(website.url, sites);
    return { sites: ranked, preferred, projectUrl: website.url };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Failed to list Bing sites",
      sites: [] as string[],
    };
  }
}

export async function selectBingProperty(websiteId: string, propertyUri: string) {
  const { supabase } = await requireUser();
  const connection = await getBingConnectionSecret(websiteId);
  if (!connection) {
    return { error: "No Bing connection found." };
  }

  const { error } = await supabase
    .from("bing_connections")
    .update({
      property_uri: propertyUri,
      status: "connected",
      last_error: null,
      last_synced_at: new Date().toISOString(),
    })
    .eq("id", connection.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard", "layout");
  redirect("/dashboard/engine/integrations?bing=connected");
}

export async function disconnectBing(websiteId: string) {
  const { supabase } = await requireUser();
  const { error } = await supabase
    .from("bing_connections")
    .delete()
    .eq("website_id", websiteId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard", "layout");
  return { ok: true };
}

export async function getBingOverviewForWebsite(
  websiteId: string,
  rangeKey: BingRangeKey = "28d"
): Promise<{
  stats: BingOverviewStats | null;
  error?: string;
  connected: boolean;
}> {
  const { supabase } = await requireUser();
  const connection = await getBingConnectionSecret(websiteId);

  if (!connection || connection.status !== "connected" || !connection.property_uri) {
    return { stats: null, connected: false };
  }

  try {
    const accessToken = await getValidAccessToken(
      supabase as never,
      connection
    );
    const stats = await fetchBingOverview(
      accessToken,
      connection.property_uri,
      rangeKey
    );

    await supabase
      .from("bing_connections")
      .update({ last_synced_at: new Date().toISOString(), last_error: null })
      .eq("id", connection.id);

    return { stats, connected: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load Bing data";
    await supabase
      .from("bing_connections")
      .update({ status: "error", last_error: message })
      .eq("id", connection.id);
    return { stats: null, connected: true, error: message };
  }
}
