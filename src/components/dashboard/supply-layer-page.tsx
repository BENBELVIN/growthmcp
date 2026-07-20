"use client";

import Link from "next/link";
import { ArrowUpRight, Lock } from "lucide-react";
import { BingOverviewCard } from "@/components/dashboard/bing-overview-card";
import { GscOverviewCard } from "@/components/dashboard/gsc-overview-card";
import { useWorkspace } from "@/components/dashboard/workspace-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { enginePaths } from "@/lib/data/dashboard";

/** Publishing / scheduling platforms (from the former Social tab). */
const PUBLISHING_PLATFORMS = [
  {
    id: "tiktok",
    name: "TikTok",
    status: "soon" as const,
    description: "Scheduling, views, engagement, and winning hook patterns.",
  },
  {
    id: "x",
    name: "X",
    status: "soon" as const,
    description: "Post scheduling, impressions, and engagement signals.",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    status: "soon" as const,
    description: "Professional publishing and tracking for this project.",
  },
  {
    id: "instagram",
    name: "Instagram",
    status: "soon" as const,
    description: "Reels and post performance for this project.",
  },
  {
    id: "youtube-shorts",
    name: "YouTube Shorts",
    status: "future" as const,
    description: "Short-form video performance — coming later.",
  },
] as const;

export function SupplyLayerPage({
  defaultTab = "search-console",
}: {
  defaultTab?: "search-console" | "bing" | "social-publishing";
}) {
  const { currentProject, setAddProjectOpen } = useWorkspace();

  if (!currentProject) {
    return (
      <div className="flex-1 p-6 sm:p-8 lg:p-10">
        <div className="mx-auto w-full max-w-6xl space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Supply Layer</h2>
          <p className="text-muted-foreground">
            Select a project to explore visibility — Search Console, Bing, and
            social publishing.
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
              Visibility & search
            </p>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Supply Layer
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              Where you show up and what you publish for{" "}
              <span className="text-foreground">{currentProject.name}</span>
            </p>
          </div>
          <Button variant="outline" className="h-9 rounded-full" asChild>
            <Link href={enginePaths.integrations}>
              Manage integrations
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
            <TabsTrigger
              value="social-publishing"
              className="rounded-none px-4 py-2.5 text-sm data-active:bg-transparent"
            >
              Social Publishing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search-console" className="mt-2 outline-none">
            <GscOverviewCard websiteId={currentProject.id} />
          </TabsContent>

          <TabsContent value="bing" className="mt-2 outline-none">
            <BingOverviewCard websiteId={currentProject.id} />
          </TabsContent>

          <TabsContent value="social-publishing" className="mt-2 outline-none">
            <section className="space-y-8">
              <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Content performance", value: "—" },
                  { label: "Views", value: "—" },
                  { label: "Engagement", value: "—" },
                  { label: "Best hooks", value: "—" },
                ].map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-2xl border border-border/70 p-5"
                  >
                    <p className="text-xs text-muted-foreground">
                      {metric.label}
                    </p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">
                      {metric.value}
                    </p>
                  </div>
                ))}
              </section>

              <section className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">
                    Platforms
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Scheduling and tracking for TikTok, X, LinkedIn, and more —
                    moved here from the former Social tab.
                  </p>
                </div>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {PUBLISHING_PLATFORMS.map((platform) => (
                    <li
                      key={platform.id}
                      className="flex items-start justify-between gap-4 rounded-2xl border border-border/70 p-5"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-medium tracking-tight">
                            {platform.name}
                          </h4>
                          <Badge variant="outline" className="h-5 font-normal">
                            {platform.status === "future" ? "Future" : "Soon"}
                          </Badge>
                        </div>
                        <p className="mt-1.5 text-sm text-muted-foreground">
                          {platform.description}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled
                        className="h-8 shrink-0 rounded-full"
                      >
                        <Lock className="size-3.5" />
                        Connect
                      </Button>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-2xl border border-dashed border-border/70 px-6 py-10 text-center">
                <p className="text-sm text-muted-foreground">
                  Content patterns and winning hooks will appear here once a
                  social publishing integration is connected to this project.
                </p>
              </section>
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
