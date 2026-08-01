"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { TrendsInsightsCard } from "@/components/dashboard/trends-insights-card";
import { useWorkspace } from "@/components/dashboard/workspace-provider";
import { Button } from "@/components/ui/button";
import { settingsPaths } from "@/lib/data/dashboard";

export function KeywordOpportunitiesPage() {
  const { currentProject, setAddProjectOpen } = useWorkspace();

  if (!currentProject) {
    return (
      <div className="flex-1 p-6 sm:p-8 lg:p-10">
        <div className="mx-auto w-full max-w-6xl space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Keyword Opportunities
          </h2>
          <p className="text-muted-foreground">
            Add a project to discover what people search for and what content to
            create.
          </p>
          <Button
            type="button"
            onClick={() => setAddProjectOpen(true)}
            className="h-10 rounded-full"
          >
            Add Project
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 sm:p-8 lg:p-10">
      <div className="mx-auto w-full max-w-6xl space-y-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              Search demand
            </p>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Keyword Opportunities
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              Find what people search for and what content to create for{" "}
              <span className="text-foreground">{currentProject.name}</span>
            </p>
          </div>
          <Button variant="outline" className="h-9 rounded-full" asChild>
            <Link href={settingsPaths.root}>
              Connect data sources
              <ArrowUpRight className="size-3.5" />
            </Link>
          </Button>
        </header>

        <TrendsInsightsCard websiteId={currentProject.id} />
      </div>
    </div>
  );
}
