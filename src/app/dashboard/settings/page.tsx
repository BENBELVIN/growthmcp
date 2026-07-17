import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ensureCurrentWorkspace } from "@/lib/workspace/ensure-workspace";
import { listWebsites } from "@/lib/websites/queries";
import { getActiveContextCookies } from "@/lib/workspace/context-cookies";
import { BentoCard } from "@/components/dashboard/bento-card";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const workspace = await ensureCurrentWorkspace(user);
  const cookies = await getActiveContextCookies();
  const projects = await listWebsites(workspace.id);
  const currentProject =
    projects.find((p) => p.id === cookies.websiteId) ?? projects[0] ?? null;

  return (
    <div className="flex-1 p-4 sm:p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Settings
          </h2>
          <p className="mt-2 text-muted-foreground">
            Account preferences for your workspace.
          </p>
        </div>

        <BentoCard className="p-6">
          <h3 className="text-sm font-semibold tracking-tight">Context</h3>
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
