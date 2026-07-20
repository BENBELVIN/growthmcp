import { createClient } from "@/lib/supabase/server";
import type { BingConnectionPublic } from "@/types/database";

const PUBLIC_FIELDS =
  "id, website_id, workspace_id, property_uri, status, last_error, last_synced_at, created_at, updated_at" as const;

export async function getBingConnectionForWebsite(
  websiteId: string
): Promise<BingConnectionPublic | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bing_connections")
    .select(PUBLIC_FIELDS)
    .eq("website_id", websiteId)
    .maybeSingle();

  if (error) {
    if (error.message.includes("bing_connections")) return null;
    throw new Error(error.message);
  }

  return data;
}

export async function getBingConnectionSecret(websiteId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bing_connections")
    .select(
      "id, website_id, workspace_id, property_uri, status, access_token, refresh_token, token_expires_at, last_synced_at"
    )
    .eq("website_id", websiteId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}
