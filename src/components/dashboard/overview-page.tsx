"use client";

import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { GscOverviewCard } from "@/components/dashboard/gsc-overview-card";
import { ProjectLogo } from "@/components/dashboard/project-logo";
import { useWorkspace } from "@/components/dashboard/workspace-provider";
import { Button } from "@/components/ui/button";

export function OverviewPage() {
  const { user, currentProject, setAddProjectOpen } = useWorkspace();
  const firstName =
    (user.user_metadata?.full_name as string | undefined)?.split(" ")[0] ??
    (user.user_metadata?.name as string | undefined)?.split(" ")[0] ??
    "there";

  if (!currentProject) {
    return (
      <div className="flex-1 p-6 sm:p-10">
        <div className="max-w-2xl space-y-5">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Hey, {firstName}
          </h2>
          <p className="text-lg text-muted-foreground">
            No project selected yet.
          </p>
          <Button
            type="button"
            onClick={() => setAddProjectOpen(true)}
            className="h-10 rounded-full bg-primary px-5 text-primary-foreground"
          >
            <Plus className="size-4" />
            Add Project
          </Button>
        </div>
      </div>
    );
  }

  const host = currentProject.url.replace(/^https?:\/\//, "");

  return (
    <div className="flex-1 p-6 sm:p-10">
      <div className="max-w-5xl space-y-10">
        <header className="space-y-5">
          <div className="flex items-center gap-5 sm:gap-6">
            <ProjectLogo
              name={currentProject.name}
              url={currentProject.url}
              logoUrl={currentProject.logo_url}
              size="xl"
              className="shadow-lg shadow-black/25 ring-1 ring-white/10"
            />
            <div className="min-w-0">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {currentProject.name}
              </h2>
              <p className="mt-2 truncate text-sm text-muted-foreground sm:text-base">
                {host}
              </p>
            </div>
          </div>
          <div>
            <p className="text-lg text-muted-foreground">Hey, {firstName}</p>
            <p className="mt-1 text-base text-muted-foreground">
              Overview for this project
            </p>
          </div>
        </header>

        <GscOverviewCard websiteId={currentProject.id} />

        <div className="flex flex-wrap gap-3">
          <Button
            className="h-10 rounded-full bg-primary px-5 text-primary-foreground"
            asChild
          >
            <Link href="/dashboard/integrations">
              Manage integrations
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button
            variant="outline"
            className="h-10 rounded-full border-border bg-muted/60 px-5"
            asChild
          >
            <Link href="/dashboard/mcp">Set up MCP</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
