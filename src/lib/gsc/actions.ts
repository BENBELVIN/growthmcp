"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  fetchGscOverview,
  getValidAccessToken,
  listGscSites,
} from "@/lib/gsc/client";
import { preferWwwProperty } from "@/lib/gsc/properties";
import { getGscConnectionSecret } from "@/lib/gsc/queries";
import type { GscOverviewStats, GscRangeKey } from "@/lib/gsc/client";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

export async function listSelectableGscProperties(websiteId: string) {
  const { supabase } = await requireUser();
  const connection = await getGscConnectionSecret(websiteId);
  if (!connection) {
    return { error: "Connect Google Search Console first.", sites: [] as string[] };
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
    const accessToken = await getValidAccessToken(supabase, connection);
    const sites = await listGscSites(accessToken);
    const { preferred, ranked } = preferWwwProperty(website.url, sites);
    return { sites: ranked, preferred, projectUrl: website.url };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Failed to list GSC properties",
      sites: [] as string[],
    };
  }
}

export async function selectGscProperty(websiteId: string, propertyUri: string) {
  const { supabase } = await requireUser();
  const connection = await getGscConnectionSecret(websiteId);
  if (!connection) {
    return { error: "No GSC connection found." };
  }

  const { error } = await supabase
    .from("gsc_connections")
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
  redirect("/dashboard/integrations?gsc=connected");
}

export async function disconnectGsc(websiteId: string) {
  const { supabase } = await requireUser();
  const { error } = await supabase
    .from("gsc_connections")
    .delete()
    .eq("website_id", websiteId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard", "layout");
  return { ok: true };
}

export async function getGscOverviewForWebsite(
  websiteId: string,
  rangeKey: GscRangeKey = "28d"
): Promise<{ stats: GscOverviewStats | null; error?: string; connected: boolean }> {
  const { supabase } = await requireUser();
  const connection = await getGscConnectionSecret(websiteId);

  if (!connection || connection.status !== "connected" || !connection.property_uri) {
    return { stats: null, connected: false };
  }

  try {
    const accessToken = await getValidAccessToken(supabase, connection);
    const stats = await fetchGscOverview(
      accessToken,
      connection.property_uri,
      rangeKey
    );

    await supabase
      .from("gsc_connections")
      .update({ last_synced_at: new Date().toISOString(), last_error: null })
      .eq("id", connection.id);

    return { stats, connected: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load GSC data";
    await supabase
      .from("gsc_connections")
      .update({ status: "error", last_error: message })
      .eq("id", connection.id);
    return { stats: null, connected: true, error: message };
  }
}
