"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Plus,
  Sparkles,
} from "lucide-react";
import { ProjectLogo } from "@/components/dashboard/project-logo";
import { useWorkspace } from "@/components/dashboard/workspace-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getOverviewCommandCenter } from "@/lib/growth/actions";
import {
  type CommandCenterData,
  type PriorityCard,
} from "@/lib/gsc/command-center";
import { cn } from "@/lib/utils";
import { settingsPaths } from "@/lib/data/dashboard";

function toneClass(tone: "positive" | "negative" | "neutral") {
  if (tone === "positive") return "text-emerald-600";
  if (tone === "negative") return "text-rose-600";
  return "text-foreground";
}

function impactVariant(impact: PriorityCard["impact"]) {
  if (impact === "High") return "default" as const;
  if (impact === "Medium") return "secondary" as const;
  return "outline" as const;
}

function actionType(item: PriorityCard): string {
  if (item.source === "trends") return "Create new page";
  if (item.kind === "page") return "Improve this page";
  if (item.kind === "keyword") return "Target this keyword";
  return "Update existing page";
}

function sourceLabel(source: PriorityCard["source"]) {
  if (source === "trends") return "Keyword Opportunities";
  if (source === "bing") return "Bing";
  return "Search Console";
}

function priorityHref(item: PriorityCard): string {
  if (item.source === "trends") return "/dashboard/keyword-opportunities";
  return "/dashboard/content-rankings";
}

function OverviewSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-3xl bg-muted/30" />
        ))}
      </div>
      <div className="h-48 animate-pulse rounded-3xl bg-muted/20" />
    </div>
  );
}

export function OverviewPage() {
  const { user, currentProject, setAddProjectOpen } = useWorkspace();
  const firstName =
    (user.user_metadata?.full_name as string | undefined)?.split(" ")[0] ??
    (user.user_metadata?.name as string | undefined)?.split(" ")[0] ??
    "there";

  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [command, setCommand] = useState<CommandCenterData | null>(null);

  useEffect(() => {
    if (!currentProject) {
      setLoading(false);
      setConnected(false);
      setCommand(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    void getOverviewCommandCenter(currentProject.id).then((res) => {
      if (cancelled) return;
      setLoading(false);
      setConnected(res.connected || Boolean(res.command));
      setError(res.error ?? null);
      setCommand(res.command);
    });

    return () => {
      cancelled = true;
    };
  }, [currentProject]);

  const host = useMemo(
    () => currentProject?.url.replace(/^https?:\/\//, "") ?? "",
    [currentProject]
  );

  if (!currentProject) {
    return (
      <div className="flex-1 p-6 sm:p-8 lg:p-10">
        <div className="mx-auto w-full max-w-6xl space-y-5">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Hey, {firstName}
          </h2>
          <p className="text-lg text-muted-foreground">
            Add a project to start growing organic traffic.
          </p>
          <Button
            type="button"
            onClick={() => setAddProjectOpen(true)}
            className="h-10 rounded-full bg-primary px-5 text-primary-foreground shadow-lg shadow-primary/20"
          >
            <Plus className="size-4" />
            Add Project
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 sm:p-8 lg:p-10">
      <div className="mx-auto w-full max-w-6xl space-y-10">
        <header className="space-y-2">
          <p className="text-sm text-muted-foreground">Hey, {firstName}</p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            What should you do next to grow traffic?
          </h2>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            Your SEO command centre — search demand, rankings, and the highest-impact
            actions for {currentProject.name}.
          </p>
        </header>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div className="flex items-center gap-4 rounded-3xl border border-border bg-card p-5 shadow-sm sm:gap-5 sm:p-6">
            <ProjectLogo
              name={currentProject.name}
              url={currentProject.url}
              logoUrl={currentProject.logo_url}
              size="xl"
              className="shadow-sm ring-1 ring-border"
            />
            <div className="min-w-0">
              <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                Active project
              </p>
              <h3 className="mt-1 truncate text-xl font-semibold tracking-tight sm:text-2xl">
                {currentProject.name}
              </h3>
              <p className="mt-1 truncate text-sm text-muted-foreground">
                {host}
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              SEO health
            </p>
            {loading ? (
              <div className="mt-4 h-8 animate-pulse rounded-lg bg-muted/30" />
            ) : command ? (
              <>
                <p className="mt-3 text-sm text-foreground">
                  Opportunity score{" "}
                  <span className="text-2xl font-semibold tabular-nums">
                    {command.opportunityScore.score}
                  </span>
                  <span className="text-muted-foreground">
                    {" "}
                    · {command.opportunityScore.label}
                  </span>
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {command.opportunityScore.detail}
                </p>
              </>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                Connect Search Console to unlock your SEO overview.
              </p>
            )}
            {!loading && command && command.connectedIntegrations.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2 border-t border-border/60 pt-4">
                {command.connectedIntegrations.map((name) => (
                  <Badge key={name} variant="secondary" className="font-normal">
                    {name}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </section>

        {loading && <OverviewSkeleton />}

        {!loading && !connected && (
          <section className="rounded-3xl border border-border bg-card px-6 py-10 shadow-sm sm:px-8">
            <div className="flex size-10 items-center justify-center rounded-xl bg-brand/10">
              <Sparkles className="size-4 text-brand" />
            </div>
            <h3 className="mt-4 text-lg font-semibold tracking-tight">
              Connect Search Console to get started
            </h3>
            <p className="mt-2 max-w-lg text-sm text-muted-foreground">
              growseo analyses your search visibility and keyword demand to show
              exactly what to create or improve next.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                className="h-9 rounded-full shadow-lg shadow-primary/20"
                asChild
              >
                <Link href={settingsPaths.root}>
                  Connect in Settings
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                className="h-9 rounded-full border-border"
                asChild
              >
                <Link href="/dashboard/content-rankings">Browse rankings</Link>
              </Button>
            </div>
          </section>
        )}

        {!loading && connected && error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        {!loading && connected && command && (
          <>
            <section className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold tracking-tight">
                  Search performance
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Key metrics from your connected data sources
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {command.seoMetrics.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-3xl border border-border bg-card p-5 shadow-sm"
                  >
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p
                      className={cn(
                        "mt-2 text-2xl font-semibold tracking-tight tabular-nums",
                        toneClass(item.tone)
                      )}
                    >
                      {item.value}
                    </p>
                    {item.delta && (
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {item.delta}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold tracking-tight">
                  Recommended actions
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Ranked by impact — what to create, update, or target next
                </p>
              </div>

              {command.priorities.length === 0 ? (
                <p className="rounded-3xl border border-border bg-card px-5 py-8 text-center text-sm text-muted-foreground shadow-sm">
                  No strong opportunities in this period yet. Check back after
                  syncing more data.
                </p>
              ) : (
                <div className="grid gap-3">
                  {command.priorities.map((item, index) => (
                    <article
                      key={item.id}
                      className="group flex flex-col gap-4 rounded-3xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-brand/30 sm:flex-row sm:items-center sm:justify-between sm:p-6"
                    >
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-[11px] text-muted-foreground">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <Badge
                            variant={impactVariant(item.impact)}
                            className="h-5"
                          >
                            {item.impact} impact
                          </Badge>
                          <Badge variant="outline" className="h-5 font-normal">
                            {actionType(item)}
                          </Badge>
                          <Badge variant="secondary" className="h-5 font-normal">
                            {sourceLabel(item.source)}
                          </Badge>
                        </div>
                        <h4 className="truncate font-medium tracking-tight">
                          {item.kind === "page"
                            ? `Improve ${item.label}`
                            : item.label}
                        </h4>
                        <p className="text-sm text-foreground/90">
                          {item.opportunity}
                        </p>
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          {item.why}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="h-9 shrink-0 rounded-full shadow-sm"
                        asChild
                      >
                        <Link href={priorityHref(item)}>
                          View details
                          <ArrowRight className="size-3.5" />
                        </Link>
                      </Button>
                    </article>
                  ))}
                </div>
              )}
            </section>

            {command.recommendedContent.length > 0 && (
              <section className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">
                    Content to create
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Keywords with demand but no strong page yet
                  </p>
                </div>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {command.recommendedContent.map((idea) => (
                    <li
                      key={idea.id}
                      className="rounded-3xl border border-border bg-card p-5 shadow-sm"
                    >
                      <Badge variant="outline" className="h-5 font-normal">
                        Create new page
                      </Badge>
                      <p className="mt-2 font-medium tracking-tight">
                        {idea.title}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {idea.reason}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {command.recentWins.length > 0 && (
              <section className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">
                    Connected sources
                  </h3>
                </div>
                <ul className="divide-y divide-border/50 rounded-3xl border border-border bg-card shadow-sm">
                  {command.recentWins.map((win) => (
                    <li key={win.id} className="flex items-start gap-3 px-5 py-4">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                      <div>
                        <p className="text-sm font-medium tracking-tight">
                          {win.label}
                        </p>
                        {win.detail && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {win.detail}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
