import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ensureCurrentWorkspace } from "@/lib/workspace/ensure-workspace";
import { getWebsite } from "@/lib/websites/queries";
import { BentoCard } from "@/components/dashboard/bento-card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Website" };

export default async function WebsiteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const workspace = await ensureCurrentWorkspace(
    user.id,
    user.user_metadata?.full_name ?? user.user_metadata?.name
  );
  const website = await getWebsite(id, workspace.id);

  if (!website) {
    notFound();
  }

  return (
    <div className="flex-1 p-4 sm:p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <Link
            href="/dashboard/websites"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Websites
          </Link>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {website.name}
              </h2>
              <a
                href={website.url}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
              >
                {website.url}
                <ExternalLink className="size-3.5" />
              </a>
            </div>
            <Button
              variant="outline"
              className="h-10 rounded-full border-border bg-muted/40 px-5"
              asChild
            >
              <Link href={`/dashboard/websites/${website.id}/edit`}>
                <Pencil className="size-4" />
                Edit
              </Link>
            </Button>
          </div>
        </div>

        <BentoCard className="p-6">
          <h3 className="text-sm font-semibold tracking-tight">Overview</h3>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Name</dt>
              <dd className="font-medium">{website.name}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">URL</dt>
              <dd className="truncate font-medium">{website.url}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Workspace</dt>
              <dd className="font-medium">{workspace.name}</dd>
            </div>
          </dl>
          <p className="mt-6 text-sm text-muted-foreground">
            Integrations and growth data for this site will appear here next.
          </p>
        </BentoCard>
      </div>
    </div>
  );
}
