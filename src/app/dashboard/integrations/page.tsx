import type { Metadata } from "next";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { getActiveContextCookies } from "@/lib/workspace/context-cookies";
import { listWebsites } from "@/lib/websites/queries";
import { ensureCurrentWorkspace } from "@/lib/workspace/ensure-workspace";
import { IntegrationsPanel } from "@/components/dashboard/integrations-panel";
import type { GscConnectionPublic } from "@/types/database";

export const metadata: Metadata = { title: "Integrations" };

const PUBLIC_FIELDS =
  "id, website_id, workspace_id, property_uri, status, last_error, last_synced_at, created_at, updated_at";

export default async function IntegrationsPage({
  searchParams,
}: {
  searchParams: Promise<{ gsc?: string; gsc_error?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let initialGsc: GscConnectionPublic | null = null;

  if (user) {
    const workspace = await ensureCurrentWorkspace(user);
    const ctx = await getActiveContextCookies();
    const projects = await listWebsites(workspace.id);
    const project =
      projects.find((p) => p.id === ctx.websiteId) ?? projects[0] ?? null;

    if (project) {
      const { data } = await supabase
        .from("gsc_connections")
        .select(PUBLIC_FIELDS)
        .eq("website_id", project.id)
        .maybeSingle();
      initialGsc = data;
    }
  }

  // Ensure cookies() is read so Next treats this as dynamic
  await cookies();

  const flash = {
    success:
      params.gsc === "connected"
        ? "Google Search Console connected. We preferred the www property when available."
        : undefined,
    error: params.gsc_error
      ? decodeURIComponent(params.gsc_error)
      : undefined,
  };

  return <IntegrationsPanel initialGsc={initialGsc} flash={flash} />;
}
