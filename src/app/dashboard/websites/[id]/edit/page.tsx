import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ensureCurrentWorkspace } from "@/lib/workspace/ensure-workspace";
import { getWebsite } from "@/lib/websites/queries";
import { WebsiteForm } from "@/components/dashboard/website-form";
import { BentoCard } from "@/components/dashboard/bento-card";

export const metadata: Metadata = { title: "Edit Website" };

export default async function EditWebsitePage({
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
      <div className="mx-auto max-w-lg space-y-6">
        <div>
          <Link
            href={`/dashboard/websites/${website.id}`}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            {website.name}
          </Link>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
            Edit Website
          </h2>
          <p className="mt-2 text-muted-foreground">
            Update the name or URL for this site.
          </p>
        </div>

        <BentoCard className="p-6 sm:p-8">
          <WebsiteForm
            mode="edit"
            websiteId={website.id}
            defaultName={website.name}
            defaultUrl={website.url}
          />
        </BentoCard>
      </div>
    </div>
  );
}
