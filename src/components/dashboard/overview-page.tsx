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

function channelLabel(source: PriorityCard["source"]) {
  return "SEO";
}

function sourceDetail(source: PriorityCard["source"]) {
  return source === "trends" ? "Trends" : "Search Console";
}

function OverviewSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-24 animate-pulse rounded-2xl bg-muted/30" />
      <div className="grid gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-40 animate-pulse rounded-2xl bg-muted/20" />
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
      <div className="flex-1 p-6 sm:p-8 lg:p-10">
        <div className="mx-auto w-full max-w-6xl space-y-5">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Hey, {firstName}
          </h2>
          <p className="text-lg text-muted-foreground">
            Add a project to see what is happening across growth channels.
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
        <header className="space-y-2">
          <p className="text-sm text-muted-foreground">Hey, {firstName}</p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            What is happening across your project?
          </h2>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            Cross-channel signals and what to do next — not a raw analytics dump.
          </p>
        </header>

        {/* Project summary */}
        <section className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div className="flex items-center gap-4 rounded-2xl border border-border/70 p-5 sm:gap-5 sm:p-6">
            <ProjectLogo
              name={currentProject.name}
              url={currentProject.url}
              logoUrl={currentProject.logo_url}
              size="xl"
              className="shadow-lg shadow-black/25 ring-1 ring-white/10"
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

          <div className="rounded-2xl border border-border/70 p-5 sm:p-6">
            <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              Connected integrations
            </p>
            {loading ? (
              <div className="mt-4 h-8 animate-pulse rounded-lg bg-muted/30" />
            ) : command && command.connectedIntegrations.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {command.connectedIntegrations.map((name) => (
                  <Badge key={name} variant="secondary" className="font-normal">
                    {name}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                None yet —{" "}
                <Link
                  href="/dashboard/integrations"
                  className="text-foreground underline-offset-4 hover:underline"
                >
                  connect a channel
                </Link>
              </p>
            )}
            <div className="mt-5 border-t border-border/50 pt-4">
              <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                Growth health
              </p>
              {loading ? (
                <div className="mt-3 h-8 animate-pulse rounded-lg bg-muted/30" />
              ) : command ? (
                <p className="mt-2 text-sm text-foreground">
                  Opportunity score{" "}
                  <span className="font-semibold tabular-nums">
                    {command.opportunityScore.score}
                  </span>
                  <span className="text-muted-foreground">
                    {" "}
                    · {command.opportunityScore.label}
                  </span>
                </p>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">
                  Placeholder until more channels are connected
                </p>
              )}
            </div>
          </div>
        </section>

        {loading && <OverviewSkeleton />}

        {!loading && !connected && (
          <section className="rounded-2xl border border-border/70 bg-muted/10 px-6 py-10 sm:px-8">
            <div className="flex size-10 items-center justify-center rounded-xl bg-muted/60">
              <Sparkles className="size-4 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold tracking-tight">
              Connect a growth channel to unlock Overview
            </h3>
            <p className="mt-2 max-w-lg text-sm text-muted-foreground">
              Overview combines SEO, Social, and App signals into what to work
              on next. Start with Search Console for this project.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button className="h-9 rounded-full" asChild>
                <Link href="/dashboard/integrations">
                  Open Integrations
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                className="h-9 rounded-full border-border"
                asChild
              >
                <Link href="/dashboard/seo">Browse SEO</Link>
              </Button>
            </div>
          </section>
        )}

        {!loading && connected && error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        {!loading && connected && command && (
          <>
            {/* Growth overview cards */}
            <section className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold tracking-tight">
                  Growth overview
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Channel snapshots — open a channel for full detail
                </p>
              </div>
              <div className="grid gap-4 lg:grid-cols-3">
                {command.channels.map((channel) => (
                  <Link
                    key={channel.id}
                    href={channel.href}
                    className="group flex flex-col rounded-2xl border border-border/70 p-5 transition-colors hover:border-border sm:p-6"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-semibold tracking-tight">
                        {channel.title}
                      </h4>
                      <Badge
                        variant={channel.connected ? "secondary" : "outline"}
                        className="h-5 font-normal"
                      >
                        {channel.connected ? "Live" : "Soon"}
                      </Badge>
                    </div>
                    <dl className="mt-4 space-y-2">
                      {channel.metrics.map((m) => (
                        <div
                          key={m.label}
                          className="flex items-baseline justify-between gap-3"
                        >
                          <dt className="text-xs text-muted-foreground">
                            {m.label}
                          </dt>
                          <dd className="text-sm font-medium tabular-nums">
                            {m.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                    <p className="mt-4 border-t border-border/50 pt-3 text-xs leading-relaxed text-muted-foreground group-hover:text-foreground/80">
                      {channel.highlight}
                    </p>
                  </Link>
                ))}
              </div>
            </section>

            {/* This week (SEO-backed until other channels live) */}
            <section className="rounded-2xl border border-border/70 p-6 sm:p-7">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  This week
                </p>
                <Link
                  href="/dashboard/seo"
                  className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  View SEO
                </Link>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            </section>

            {/* Top growth opportunities */}
            <section className="space-y-4">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">
                    Top growth opportunities
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Ranked across channels — what Cursor should implement via MCP
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
                            {channelLabel(item.source)}
                          </Badge>
                          <Badge variant="secondary" className="h-5 font-normal">
                            {sourceDetail(item.source)}
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

              {/* Placeholder social/app opportunities */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-dashed border-border/60 px-5 py-4">
                  <Badge variant="outline" className="h-5 font-normal">
                    Social
                  </Badge>
                  <p className="mt-2 text-sm font-medium">
                    Create more videos using winning hook patterns
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Available once TikTok / Instagram is connected
                  </p>
                </div>
                <div className="rounded-2xl border border-dashed border-border/60 px-5 py-4">
                  <Badge variant="outline" className="h-5 font-normal">
                    App
                  </Badge>
                  <p className="mt-2 text-sm font-medium">
                    Improve App Store conversion
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Available once App Store Connect is connected
                  </p>
                </div>
              </div>
            </section>

            {/* Recent wins */}
            <section className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold tracking-tight">
                  Recent wins
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Milestones and shipped actions for this project
                </p>
              </div>
              {command.recentWins.length === 0 ? (
                <div className="flex min-h-[140px] flex-col items-start justify-center rounded-2xl border border-dashed border-border/70 px-5 py-8">
                  <CheckCircle2 className="size-5 text-muted-foreground/70" />
                  <p className="mt-3 text-sm text-muted-foreground">
                    Wins appear here as you connect channels and ship from
                    Cursor.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-border/50 rounded-2xl border border-border/70">
                  {command.recentWins.map((win) => (
                    <li key={win.id} className="flex items-start gap-3 px-5 py-4">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-400" />
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
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
