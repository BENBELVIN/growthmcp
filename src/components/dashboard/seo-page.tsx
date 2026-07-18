"use client";

import { GscOverviewCard } from "@/components/dashboard/gsc-overview-card";
import { TrendsInsightsCard } from "@/components/dashboard/trends-insights-card";
import { useWorkspace } from "@/components/dashboard/workspace-provider";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function SeoPage() {
  const { currentProject, setAddProjectOpen } = useWorkspace();

  if (!currentProject) {
    return (
      <div className="flex-1 p-6 sm:p-8 lg:p-10">
        <div className="mx-auto w-full max-w-6xl space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">SEO</h2>
          <p className="text-muted-foreground">
            Select a project to explore Search Console and Trends signals.
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
        <header className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            SEO
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            Search growth signals for{" "}
            <span className="text-foreground">{currentProject.name}</span>
          </p>
        </header>

        <Tabs defaultValue="search-console" className="gap-6">
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
              value="google-trends"
              className="rounded-none px-4 py-2.5 text-sm data-active:bg-transparent"
            >
              Google Trends
            </TabsTrigger>
            <TabsTrigger
              value="aeo"
              disabled
              className="rounded-none px-4 py-2.5 text-sm data-active:bg-transparent"
            >
              AEO / AI search
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search-console" className="mt-2 outline-none">
            <GscOverviewCard websiteId={currentProject.id} />
          </TabsContent>

          <TabsContent value="google-trends" className="mt-2 outline-none">
            <TrendsInsightsCard websiteId={currentProject.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
