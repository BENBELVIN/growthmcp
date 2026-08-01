import type { Metadata } from "next";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { getActiveContextCookies } from "@/lib/workspace/context-cookies";
import { listWebsites } from "@/lib/websites/queries";
import { ensureCurrentWorkspace } from "@/lib/workspace/ensure-workspace";
import { IntegrationsPanel } from "@/components/dashboard/integrations-panel";
import { BentoCard } from "@/components/dashboard/bento-card";
import type {
  BingConnectionPublic,
  GscConnectionPublic,
} from "@/types/database";

export const metadata: Metadata = { title: "Settings" };

const PUBLIC_FIELDS =
  "id, website_id, workspace_id, property_uri, status, last_error, last_synced_at, created_at, updated_at";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{
    gsc?: string;
    gsc_error?: string;
    bing?: string;
    bing_error?: string;
  }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const workspace = await ensureCurrentWorkspace(user);
  const ctx = await getActiveContextCookies();
  const projects = await listWebsites(workspace.id);
  const currentProject =
    projects.find((p) => p.id === ctx.websiteId) ?? projects[0] ?? null;

  let initialGsc: GscConnectionPublic | null = null;
  let initialBing: BingConnectionPublic | null = null;

  if (currentProject) {
    const [{ data: gsc }, { data: bing }] = await Promise.all([
      supabase
        .from("gsc_connections")
        .select(PUBLIC_FIELDS)
        .eq("website_id", currentProject.id)
        .maybeSingle(),
      supabase
        .from("bing_connections")
        .select(PUBLIC_FIELDS)
        .eq("website_id", currentProject.id)
        .maybeSingle(),
    ]);
    initialGsc = gsc;
    initialBing = bing;
  }

  await cookies();

  const flash = {
    success:
      params.gsc === "connected"
        ? "Google Search Console connected. We preferred the www property when available."
        : params.bing === "connected"
          ? "Bing Webmaster connected. We preferred the www site when available."
          : undefined,
    error: params.gsc_error
      ? decodeURIComponent(params.gsc_error)
      : params.bing_error
        ? decodeURIComponent(params.bing_error)
        : undefined,
  };

  return (
    <div className="flex-1 p-6 sm:p-8 lg:p-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Settings
          </h2>
          <p className="mt-2 text-muted-foreground">
            Connect data sources and manage your workspace.
          </p>
        </div>

        <IntegrationsPanel
          initialGsc={initialGsc}
          initialBing={initialBing}
          flash={flash}
        />

        <BentoCard className="p-6">
          <h3 className="text-sm font-semibold tracking-tight">Account</h3>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Workspace</dt>
              <dd className="font-medium">{workspace.name}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Active project</dt>
              <dd className="truncate font-medium">
                {currentProject?.name ?? "None"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Signed in as</dt>
              <dd className="truncate font-medium">{user.email}</dd>
            </div>
          </dl>
        </BentoCard>
      </div>
    </div>
  );
}
