import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ensureCurrentWorkspace } from "@/lib/workspace/ensure-workspace";
import { BentoCard } from "@/components/dashboard/bento-card";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const workspace = await ensureCurrentWorkspace(
    user.id,
    user.user_metadata?.full_name ?? user.user_metadata?.name
  );

  return (
    <div className="flex-1 p-4 sm:p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Settings
          </h2>
          <p className="mt-2 text-muted-foreground">
            Workspace and account preferences.
          </p>
        </div>

        <BentoCard className="p-6">
          <h3 className="text-sm font-semibold tracking-tight">Workspace</h3>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Name</dt>
              <dd className="font-medium">{workspace.name}</dd>
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
