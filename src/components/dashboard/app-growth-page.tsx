"use client";

import Link from "next/link";
import { ArrowUpRight, Lock } from "lucide-react";
import { useWorkspace } from "@/components/dashboard/workspace-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const SOURCES = [
  {
    id: "asc",
    name: "App Store Connect",
    description: "Downloads, ratings, and listing conversion.",
  },
  {
    id: "revenuecat",
    name: "RevenueCat",
    description: "Subscriptions and revenue for this project.",
  },
  {
    id: "posthog",
    name: "PostHog",
    description: "Product analytics and conversion funnels.",
  },
] as const;

export function AppGrowthPage() {
  const { currentProject, setAddProjectOpen } = useWorkspace();

  if (!currentProject) {
    return (
      <div className="flex-1 p-6 sm:p-8 lg:p-10">
        <div className="mx-auto w-full max-w-6xl space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">App</h2>
          <p className="text-muted-foreground">
            Select a project to connect app growth sources.
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
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              App
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              Product growth for{" "}
              <span className="text-foreground">{currentProject.name}</span>
            </p>
          </div>
          <Button variant="outline" className="h-9 rounded-full" asChild>
            <Link href="/dashboard/engine/integrations">
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

        <section className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold tracking-tight">Sources</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Connect App Store Connect, RevenueCat, or PostHog to this project.
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-3">
            {SOURCES.map((source) => (
              <li
                key={source.id}
                className="flex flex-col justify-between gap-4 rounded-2xl border border-border/70 p-5"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-medium tracking-tight">{source.name}</h4>
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

        <section className="rounded-2xl border border-dashed border-border/70 px-6 py-10 text-center">
          <p className="text-sm text-muted-foreground">
            Downloads, ratings, and conversion metrics will appear here once an
            app integration is connected to this project.
          </p>
        </section>
      </div>
    </div>
  );
}
