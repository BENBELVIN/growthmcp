"use client";

import Link from "next/link";
import { ArrowUpRight, Lock } from "lucide-react";
import { TrendsInsightsCard } from "@/components/dashboard/trends-insights-card";
import { useWorkspace } from "@/components/dashboard/workspace-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { enginePaths } from "@/lib/data/dashboard";

const LISTENING_SOURCES = [
  {
    id: "reddit",
    name: "Reddit",
    status: "soon" as const,
    description: "Thread and subreddit intent signals for your category.",
  },
  {
    id: "tiktok-listening",
    name: "TikTok",
    status: "soon" as const,
    description: "Trend and sound tracking for demand before you publish.",
  },
  {
    id: "x-listening",
    name: "X / Twitter",
    status: "soon" as const,
    description: "Trend tracking and conversation monitoring around your topic.",
  },
] as const;

export function DemandLayerPage({
  defaultTab = "google-trends",
}: {
  defaultTab?: "google-trends" | "keyword-research" | "social-listening";
}) {
  const { currentProject, setAddProjectOpen } = useWorkspace();

  if (!currentProject) {
    return (
      <div className="flex-1 p-6 sm:p-8 lg:p-10">
        <div className="mx-auto w-full max-w-6xl space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Demand Layer</h2>
          <p className="text-muted-foreground">
            Select a project to explore market intent — Trends, keywords, and
            social listening.
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
              Market & intent
            </p>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Demand Layer
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              What people are searching and talking about for{" "}
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
              value="google-trends"
              className="rounded-none px-4 py-2.5 text-sm data-active:bg-transparent"
            >
              Google Trends
            </TabsTrigger>
            <TabsTrigger
              value="keyword-research"
              className="rounded-none px-4 py-2.5 text-sm data-active:bg-transparent"
            >
              Keyword Research
            </TabsTrigger>
            <TabsTrigger
              value="social-listening"
              className="rounded-none px-4 py-2.5 text-sm data-active:bg-transparent"
            >
              Social Listening
            </TabsTrigger>
          </TabsList>

          <TabsContent value="google-trends" className="mt-2 outline-none">
            <TrendsInsightsCard websiteId={currentProject.id} />
          </TabsContent>

          <TabsContent value="keyword-research" className="mt-2 outline-none">
            <section className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold tracking-tight">
                  Google Keyword Planner
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Search volume, competition, and keyword ideas for this project.
                </p>
              </div>
              <div className="rounded-2xl border border-dashed border-border/70 px-6 py-10 text-center">
                <Badge variant="outline" className="h-5 font-normal">
                  Soon
                </Badge>
                <p className="mt-3 text-sm text-muted-foreground">
                  Keyword Planner will surface volume and opportunity keywords
                  here once connected in MCP &amp; Integrations.
                </p>
                <Button
                  variant="outline"
                  className="mt-5 h-9 rounded-full"
                  asChild
                >
                  <Link href={enginePaths.integrations}>
                    Open integrations
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            </section>
          </TabsContent>

          <TabsContent value="social-listening" className="mt-2 outline-none">
            <section className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold tracking-tight">
                  Social Listening
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Reddit and TikTok trend tracking — monitor intent before you
                  publish.
                </p>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {LISTENING_SOURCES.map((source) => (
                  <li
                    key={source.id}
                    className="flex items-start justify-between gap-4 rounded-2xl border border-border/70 p-5"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-medium tracking-tight">
                          {source.name}
                        </h4>
                        <Badge variant="outline" className="h-5 font-normal">
                          Soon
                        </Badge>
                      </div>
                      <p className="mt-1.5 text-sm text-muted-foreground">
                        {source.description}
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
