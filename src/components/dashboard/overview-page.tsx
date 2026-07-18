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

function toneClass(tone: "positive" | "negative" | "neutral") {
  if (tone === "positive") return "text-emerald-400";
  if (tone === "negative") return "text-rose-400";
  return "text-foreground";
}

function impactVariant(impact: PriorityCard["impact"]) {
  if (impact === "High") return "default" as const;
  if (impact === "Medium") return "secondary" as const;
  return "outline" as const;
}

function sourceLabel(source: PriorityCard["source"]) {
  return source === "trends" ? "Trends" : "Search Console";
}

function OverviewSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-24 animate-pulse rounded-2xl bg-muted/30" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted/20" />
        ))}
      </div>
      <div className="h-48 animate-pulse rounded-2xl bg-muted/20" />
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
      <div className="flex-1 p-6 sm:p-10">
        <div className="max-w-2xl space-y-5">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Hey, {firstName}
          </h2>
          <p className="text-lg text-muted-foreground">
            Add a project to see what to work on today.
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

  return (
    <div className="flex-1 p-6 sm:p-8 lg:p-10">
      <div className="mx-auto w-full max-w-6xl space-y-10">
        {/* Greeting + project */}
        <header className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">Hey, {firstName}</p>
            <h2 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
              What should you work on today?
            </h2>
          </div>

          <div className="flex shrink-0 items-center gap-4 sm:gap-5">
            <ProjectLogo
              name={currentProject.name}
              url={currentProject.url}
              logoUrl={currentProject.logo_url}
              size="xl"
              className="shadow-lg shadow-black/25 ring-1 ring-white/10"
            />
            <div className="min-w-0">
              <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                Current project
              </p>
              <h3 className="mt-1 truncate text-xl font-semibold tracking-tight sm:text-2xl">
                {currentProject.name}
              </h3>
              <p className="mt-1 truncate text-sm text-muted-foreground">
                {host}
              </p>
            </div>
          </div>
        </header>

        {loading && <OverviewSkeleton />}

        {!loading && !connected && (
          <section className="rounded-2xl border border-border/70 bg-muted/10 px-6 py-10 sm:px-8">
            <div className="flex size-10 items-center justify-center rounded-xl bg-muted/60">
              <Sparkles className="size-4 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold tracking-tight">
              Connect Search Console to unlock priorities
            </h3>
            <p className="mt-2 max-w-lg text-sm text-muted-foreground">
              Overview turns live search data into a short list of actions.
              Connect GSC for this project to see opportunity score, weekly
              shifts, and what to fix next.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button className="h-9 rounded-full" asChild>
                <Link href="/dashboard/integrations">
                  Connect Search Console
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                className="h-9 rounded-full border-border"
                asChild
              >
                <Link href="/dashboard/insights">Browse Insights</Link>
              </Button>
            </div>
          </section>
        )}

        {!loading && connected && error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        {!loading && connected && command && (
          <>
            {/* Opportunity score */}
            <section className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)]">
              <div className="rounded-2xl border border-border/70 bg-gradient-to-b from-muted/30 to-transparent p-6 sm:p-7">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Opportunity score
                </p>
                <div className="mt-4 flex items-end gap-3">
                  <span className="text-5xl font-semibold tracking-tight tabular-nums sm:text-6xl">
                    {command.opportunityScore.score}
                  </span>
                  <span className="mb-2 text-sm text-muted-foreground">/ 100</span>
                </div>
                <p className="mt-3 text-sm font-medium text-foreground">
                  {command.opportunityScore.label}
                </p>
                <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
                  {command.opportunityScore.detail}
                </p>
              </div>

              <div className="rounded-2xl border border-border/70 p-6 sm:p-7">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    This week
                  </p>
                  <Link
                    href="/dashboard/insights"
                    className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    View Insights
                  </Link>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {command.weekSummary.map((item) => (
                    <div key={item.id} className="min-w-0">
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p
                        className={cn(
                          "mt-1.5 text-xl font-semibold tracking-tight tabular-nums",
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
              </div>
            </section>

            {/* Top priorities — unified GSC + Trends queue for MCP/Cursor */}
            <section className="space-y-4">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">
                    Top priorities
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Ranked queue from Search Console + Trends — what Cursor
                    should implement next via MCP
                  </p>
                </div>
              </div>

              {command.priorities.length === 0 ? (
                <p className="rounded-2xl border border-border/60 px-5 py-8 text-center text-sm text-muted-foreground">
                  No strong opportunities in this period yet.
                </p>
              ) : (
                <div className="grid gap-3">
                  {command.priorities.map((item, index) => (
                    <article
                      key={item.id}
                      className="group flex flex-col gap-4 rounded-2xl border border-border/70 bg-card/40 p-5 transition-colors hover:border-border sm:flex-row sm:items-center sm:justify-between sm:p-6"
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
                            {sourceLabel(item.source)}
                          </Badge>
                          {item.kind === "keyword" && (
                            <Badge variant="secondary" className="h-5 font-normal">
                              Keyword
                            </Badge>
                          )}
                        </div>
                        <h4 className="truncate font-medium tracking-tight">
                          {item.label}
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
                        className="h-9 shrink-0 rounded-full"
                        asChild
                      >
                        <Link href="/dashboard/mcp">
                          Work in Cursor
                          <ArrowRight className="size-3.5" />
                        </Link>
                      </Button>
                    </article>
                  ))}
                </div>
              )}
            </section>

            {/* Recommended content + completed */}
            <section className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">
                    Recommended content
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Queries with demand but weak coverage
                  </p>
                </div>
                {command.recommendedContent.length === 0 ? (
                  <p className="rounded-2xl border border-border/60 px-5 py-8 text-sm text-muted-foreground">
                    No content gaps surfaced yet.
                  </p>
                ) : (
                  <ul className="divide-y divide-border/50 rounded-2xl border border-border/70">
                    {command.recommendedContent.map((idea) => (
                      <li key={idea.id} className="px-5 py-4">
                        <p className="text-sm font-medium tracking-tight">
                          {idea.title}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          {idea.reason}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">
                    Recently completed
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Actions you&apos;ve shipped from GrowthMCP
                  </p>
                </div>
                <div className="flex min-h-[180px] flex-col items-start justify-center rounded-2xl border border-dashed border-border/70 px-5 py-8">
                  <CheckCircle2 className="size-5 text-muted-foreground/70" />
                  <p className="mt-3 text-sm text-muted-foreground">
                    Completed actions will appear here once you start shipping
                    from Cursor via MCP.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-5 h-8 rounded-full"
                    asChild
                  >
                    <Link href="/dashboard/mcp">Set up MCP</Link>
                  </Button>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
