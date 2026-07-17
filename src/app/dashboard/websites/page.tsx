import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ensureCurrentWorkspace } from "@/lib/workspace/ensure-workspace";
import { listWebsites } from "@/lib/websites/queries";
import { WebsiteCard } from "@/components/dashboard/website-card";
import { Button } from "@/components/ui/button";
import { BentoCard } from "@/components/dashboard/bento-card";

export const metadata: Metadata = { title: "Websites" };

export default async function WebsitesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const workspace = await ensureCurrentWorkspace(
    user.id,
    user.user_metadata?.full_name ?? user.user_metadata?.name
  );
  const websites = await listWebsites(workspace.id);

  return (
    <div className="flex-1 p-4 sm:p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Websites
            </h2>
            <p className="mt-2 text-muted-foreground">
              Sites in {workspace.name}. Integrations and growth data attach
              here.
            </p>
          </div>
          <Button
            className="h-10 shrink-0 rounded-full bg-primary px-5 text-primary-foreground"
            asChild
          >
            <Link href="/dashboard/websites/new">
              <Plus className="size-4" />
              Add Website
            </Link>
          </Button>
        </div>

        {websites.length === 0 ? (
          <BentoCard className="p-8 text-center">
            <h3 className="text-base font-semibold tracking-tight">
              No websites yet
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Add your first site to start connecting Search Console and growth
              data.
            </p>
            <Button
              className="mt-6 h-10 rounded-full bg-primary px-5 text-primary-foreground"
              asChild
            >
              <Link href="/dashboard/websites/new">
                <Plus className="size-4" />
                Add Website
              </Link>
            </Button>
          </BentoCard>
        ) : (
          <div className="space-y-4">
            {websites.map((website) => (
              <WebsiteCard key={website.id} website={website} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
