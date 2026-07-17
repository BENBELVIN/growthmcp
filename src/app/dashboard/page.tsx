import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ensureCurrentWorkspace } from "@/lib/workspace/ensure-workspace";
import { listWebsites } from "@/lib/websites/queries";
import { BentoCard } from "@/components/dashboard/bento-card";
import { Button } from "@/components/ui/button";
import { weekBreakdown } from "@/lib/data/dashboard";

export const metadata: Metadata = {
  title: "Overview",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const workspace = await ensureCurrentWorkspace(
    user.id,
    user.user_metadata?.full_name ?? user.user_metadata?.name
  );
  const websites = await listWebsites(workspace.id);

  if (websites.length === 0) {
    redirect("/dashboard/websites/new");
  }

  const firstName =
    (user.user_metadata?.full_name as string | undefined)?.split(" ")[0] ??
    (user.user_metadata?.name as string | undefined)?.split(" ")[0] ??
    "there";

  return (
    <div className="flex-1 p-4 sm:p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Hey, {firstName}
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Here&apos;s the breakdown this week across{" "}
            {websites.length === 1
              ? websites[0].name
              : `${websites.length} websites`}
            .
          </p>
        </div>

        <div className="space-y-4">
          {weekBreakdown.map((item) => (
            <BentoCard key={item.title} className="p-6">
              <h3 className="text-base font-semibold tracking-tight">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </BentoCard>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button
            className="h-10 rounded-full bg-primary px-5 text-primary-foreground"
            asChild
          >
            <Link href="/dashboard/integrations">
              Connect your data
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button
            variant="outline"
            className="h-10 rounded-full border-border bg-muted/60 px-5"
            asChild
          >
            <Link href="/dashboard/websites">Manage websites</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
