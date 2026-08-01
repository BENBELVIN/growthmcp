"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BingOverviewCard } from "@/components/dashboard/bing-overview-card";
import { GscOverviewCard } from "@/components/dashboard/gsc-overview-card";
import { useWorkspace } from "@/components/dashboard/workspace-provider";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { settingsPaths } from "@/lib/data/dashboard";

export function ContentRankingsPage({
  defaultTab = "search-console",
}: {
  defaultTab?: "search-console" | "bing";
}) {
  const { currentProject, setAddProjectOpen } = useWorkspace();

  if (!currentProject) {
    return (
      <div className="flex-1 p-6 sm:p-8 lg:p-10">
        <div className="mx-auto w-full max-w-6xl space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Content & Rankings
          </h2>
          <p className="text-muted-foreground">
            Add a project to see how your pages rank and perform in search.
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
              Visibility & performance
            </p>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Content & Rankings
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              See what ranks, what&apos;s gaining momentum, and what needs work
              for{" "}
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

        <Tabs key={defaultTab} defaultValue={defaultTab} className="gap-6">
          <TabsList
            variant="line"
            className="h-auto w-full justify-start gap-0 rounded-none border-b border-border/70 bg-transparent p-0"
          >
            <TabsTrigger
              value="search-console"
              className="rounded-none px-4 py-2.5 text-sm data-active:bg-transparent"
            >
              Google Search Console
            </TabsTrigger>
            <TabsTrigger
              value="bing"
              className="rounded-none px-4 py-2.5 text-sm data-active:bg-transparent"
            >
              Bing Webmaster
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search-console" className="mt-2 outline-none">
            <GscOverviewCard websiteId={currentProject.id} />
          </TabsContent>

          <TabsContent value="bing" className="mt-2 outline-none">
            <BingOverviewCard websiteId={currentProject.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
