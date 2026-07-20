"use client";

import Link from "next/link";
import { ArrowUpRight, Lock } from "lucide-react";
import { useWorkspace } from "@/components/dashboard/workspace-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { enginePaths } from "@/lib/data/dashboard";

/** App store sources (from the former App tab). */
const APP_STORE_SOURCES = [
  {
    id: "asc",
    name: "App Store Connect",
    description: "Downloads, ratings, and listing conversion.",
  },
  {
    id: "play",
    name: "Google Play Console",
    description: "Installs, ratings, and store listing performance.",
  },
  {
    id: "revenuecat",
    name: "RevenueCat",
    description: "Subscriptions and revenue for this project.",
  },
] as const;

/** Product / web analytics (from the former App tab). */
const ANALYTICS_SOURCES = [
  {
    id: "posthog",
    name: "PostHog",
    description: "Product analytics and conversion funnels.",
  },
  {
    id: "web-analytics",
    name: "Web Analytics",
    description: "Site conversion and engagement for this project.",
  },
] as const;

export function ConvertLayerPage({
  defaultTab = "app-stores",
}: {
  defaultTab?: "app-stores" | "analytics";
}) {
  const { currentProject, setAddProjectOpen } = useWorkspace();

  if (!currentProject) {
    return (
      <div className="flex-1 p-6 sm:p-8 lg:p-10">
        <div className="mx-auto w-full max-w-6xl space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Convert Layer
          </h2>
          <p className="text-muted-foreground">
            Select a project to connect product and app analytics.
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
              Product & app analytics
            </p>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Convert Layer
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              Product growth for{" "}
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

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Downloads", value: "—" },
            { label: "Subscriptions", value: "—" },
            { label: "Revenue", value: "—" },
            { label: "Reviews", value: "—" },
          ].map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl border border-border/70 p-5"
            >
              <p className="text-xs text-muted-foreground">{metric.label}</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">
                {metric.value}
              </p>
            </div>
          ))}
        </section>

        <Tabs key={defaultTab} defaultValue={defaultTab} className="gap-6">
          <TabsList
            variant="line"
            className="h-auto w-full justify-start gap-0 rounded-none border-b border-border/70 bg-transparent p-0"
          >
            <TabsTrigger
              value="app-stores"
              className="rounded-none px-4 py-2.5 text-sm data-active:bg-transparent"
            >
              App Stores
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="rounded-none px-4 py-2.5 text-sm data-active:bg-transparent"
            >
              PostHog / Web Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="app-stores" className="mt-2 outline-none">
            <section className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold tracking-tight">
                  App store sources
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  App Store Connect, Google Play Console, and RevenueCat — from
                  the former App tab.
                </p>
              </div>
              <ul className="grid gap-3 sm:grid-cols-3">
                {APP_STORE_SOURCES.map((source) => (
                  <li
                    key={source.id}
                    className="flex flex-col justify-between gap-4 rounded-2xl border border-border/70 p-5"
                  >
                    <div>
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
                      className="h-8 w-fit rounded-full"
                    >
                      <Lock className="size-3.5" />
                      Connect
                    </Button>
                  </li>
                ))}
              </ul>
            </section>
          </TabsContent>

          <TabsContent value="analytics" className="mt-2 outline-none">
            <section className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold tracking-tight">
                  Product & web analytics
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  PostHog and web analytics for conversion funnels — from the
                  former App tab.
                </p>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {ANALYTICS_SOURCES.map((source) => (
                  <li
                    key={source.id}
                    className="flex flex-col justify-between gap-4 rounded-2xl border border-border/70 p-5"
                  >
                    <div>
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
                      className="h-8 w-fit rounded-full"
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

        <section className="rounded-2xl border border-dashed border-border/70 px-6 py-10 text-center">
          <p className="text-sm text-muted-foreground">
            Downloads, ratings, and conversion metrics will appear here once an
            app or analytics integration is connected to this project.
          </p>
        </section>
      </div>
    </div>
  );
}
