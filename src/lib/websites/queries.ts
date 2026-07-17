import { createClient } from "@/lib/supabase/server";
import type { Website } from "@/types/database";

export async function listWebsites(workspaceId: string): Promise<Website[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("websites")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getWebsite(
  websiteId: string,
  workspaceId: string
): Promise<Website | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("websites")
    .select("*")
    .eq("id", websiteId)
    .eq("workspace_id", workspaceId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export function normalizeWebsiteUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    const url = new URL(withProtocol);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }
    if (!url.hostname.includes(".")) {
      return null;
    }
    return url.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}
