"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowRight, RefreshCw, TrendingUp } from "lucide-react";
import {
  getTrendsInsightsForWebsite,
  syncTrendsForWebsite,
  type TrendsInsightsPayload,
} from "@/lib/trends/actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function TrendsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-48 animate-pulse rounded-full bg-muted/40" />
      <div className="h-56 animate-pulse rounded-2xl bg-muted/20" />
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-muted/20" />
        ))}
      </div>
    </div>
  );
}

function directionTone(direction: string) {
  if (direction === "rising") return "text-emerald-400";
  if (direction === "falling") return "text-rose-400";
  return "text-muted-foreground";
}

export function TrendsInsightsCard({ websiteId }: { websiteId: string }) {
  const [data, setData] = useState<TrendsInsightsPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await getTrendsInsightsForWebsite(websiteId);
    setLoading(false);
    setData(res.data);
    setError(res.error ?? null);
  }, [websiteId]);

  useEffect(() => {
    void load();
  }, [load]);

  const onSync = async () => {
    setSyncing(true);
    setError(null);
    const res = await syncTrendsForWebsite(websiteId);
    setSyncing(false);
    if (!res.ok) {
      setError(res.error ?? "Sync failed");
      return;
    }
    if (res.error) {
      setError(res.error);
    }
    await load();
  };

  if (loading && !data) return <TrendsSkeleton />;

  if (!data || (data.trends.length === 0 && !loading)) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center overflow-hidden rounded-[22%] bg-muted/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logos/trends.png" alt="" className="size-6 object-contain" />
            </span>
            <div>
              <h3 className="text-lg font-semibold tracking-tight">Google Trends</h3>
              <p className="text-sm text-muted-foreground">
                Enrich Search Console with demand signals
              </p>
            </div>
          </div>
          <Button
            onClick={() => void onSync()}
            disabled={syncing}
            className="h-9 rounded-full"
          >
            <RefreshCw className={cn("size-3.5", syncing && "animate-spin")} />
            {syncing ? "Syncing…" : "Sync Trends"}
          </Button>
        </div>

        <div className="rounded-2xl border border-dashed border-border/70 bg-muted/10 px-6 py-12">
          <TrendingUp className="size-5 text-muted-foreground" />
          <h4 className="mt-4 text-base font-semibold tracking-tight">
            No Trends data yet
          </h4>
          <p className="mt-2 max-w-lg text-sm text-muted-foreground">
            Sync pulls interest for your Search Console top queries (or brand
            seeds) and generates GrowthMCP opportunities. Trends is enrichment —
            not the source of truth.
          </p>
          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
          {!data?.gscConnected && (
            <Button
              variant="outline"
              className="mt-5 h-9 rounded-full"
              asChild
            >
              <Link href="/dashboard/engine/integrations">
                Connect Search Console for better seeds
              </Link>
            </Button>
          )}
        </div>
      </div>
    );
  }

  const primaryKeyword = data.trends[0]?.keyword;

  return (
    <div className={cn("space-y-8", loading && "opacity-70")}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center overflow-hidden rounded-[22%] bg-muted/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logos/trends.png" alt="" className="size-6 object-contain" />
          </span>
          <div>
            <h3 className="text-lg font-semibold tracking-tight">Google Trends</h3>
            <p className="text-sm text-muted-foreground">
              {primaryKeyword ? (
                <>
                  Interest for{" "}
                  <span className="text-foreground">{primaryKeyword}</span>
                </>
              ) : (
                "Demand signals for this project"
              )}
              {data.lastSyncedAt && (
                <>
                  <span className="text-muted-foreground/50"> · </span>
                  Synced{" "}
                  {new Date(data.lastSyncedAt).toLocaleString("en-GB", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </>
              )}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {data.trends.length} Trends keyword
              {data.trends.length === 1 ? "" : "s"} cached
              {data.opportunities.length > 0 &&
                ` · ${data.opportunities.length} GrowthMCP opportunities`}
              . Sparse related/region data means Google throttled those
              endpoints — opportunities still come from Trends + Search Console.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => void onSync()}
          disabled={syncing}
          className="h-9 rounded-full border-border"
        >
          <RefreshCw className={cn("size-3.5", syncing && "animate-spin")} />
          {syncing ? "Syncing…" : "Refresh"}
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* Opportunity cards — primary GrowthMCP output */}
      <section className="space-y-3">
        <div>
          <h4 className="text-sm font-semibold tracking-tight">Opportunities</h4>
          <p className="mt-1 text-xs text-muted-foreground">
            Generated by GrowthMCP from Trends + Search Console context
          </p>
        </div>
        {data.opportunities.length === 0 ? (
          <p className="rounded-2xl border border-border/60 px-5 py-6 text-sm text-muted-foreground">
            No open Trends opportunities right now. Refresh after Search Console
            has more query data.
          </p>
        ) : (
          <div className="grid gap-3">
            {data.opportunities.map((opp) => (
              <article
                key={opp.id}
                className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card/40 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h5 className="font-medium tracking-tight">{opp.keyword}</h5>
                    <Badge variant="secondary" className="h-5">
                      Score {Math.round(Number(opp.trend_score))}
                    </Badge>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {opp.reason}
                  </p>
                </div>
                <Button size="sm" className="h-9 shrink-0 rounded-full" asChild>
                  <Link href="/dashboard/engine/mcp">
                    Work in Cursor
                    <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Interest over time */}
      <section className="space-y-3">
        <h4 className="text-sm font-semibold tracking-tight">Interest over time</h4>
        <div className="h-64 w-full rounded-2xl border border-border/60 p-3 sm:p-4">
          {data.chartSeries.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No timeline data
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.chartSeries}>
                <defs>
                  <linearGradient id="trendsInterest" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34A853" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#34A853" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "oklch(0.68 0.01 260)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  minTickGap={28}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: "oklch(0.68 0.01 260)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={32}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#34A853"
                  strokeWidth={2}
                  fill="url(#trendsInterest)"
                  name="Interest"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Related queries */}
        <section className="space-y-3">
          <h4 className="text-sm font-semibold tracking-tight">Related queries</h4>
          <ul className="divide-y divide-border/50 rounded-2xl border border-border/70">
            {data.relatedQueries.length === 0 && (
              <li className="px-4 py-6 text-sm text-muted-foreground">
                No related queries yet.
              </li>
            )}
            {data.relatedQueries.slice(0, 10).map((q) => (
              <li
                key={`${q.type}-${q.query}`}
                className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
              >
                <span className="min-w-0 truncate font-medium">{q.query}</span>
                <span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                  <Badge
                    variant={q.type === "rising" ? "default" : "outline"}
                    className="h-5 capitalize"
                  >
                    {q.type}
                  </Badge>
                  {String(q.value)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Related topics */}
        <section className="space-y-3">
          <h4 className="text-sm font-semibold tracking-tight">Related topics</h4>
          <ul className="divide-y divide-border/50 rounded-2xl border border-border/70">
            {data.relatedTopics.length === 0 && (
              <li className="px-4 py-6 text-sm text-muted-foreground">
                No related topics yet.
              </li>
            )}
            {data.relatedTopics.slice(0, 10).map((t) => (
              <li
                key={`${t.kind}-${t.topic}`}
                className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
              >
                <span className="min-w-0 truncate font-medium">{t.title}</span>
                <span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                  <Badge
                    variant={t.kind === "rising" ? "default" : "outline"}
                    className="h-5 capitalize"
                  >
                    {t.kind}
                  </Badge>
                  {String(t.value)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Regional interest */}
        <section className="space-y-3">
          <h4 className="text-sm font-semibold tracking-tight">
            Regional interest
          </h4>
          <ul className="divide-y divide-border/50 rounded-2xl border border-border/70">
            {data.regions.length === 0 && (
              <li className="px-4 py-6 text-sm text-muted-foreground">
                No regional data yet.
              </li>
            )}
            {data.regions.slice(0, 8).map((r) => (
              <li
                key={r.geoCode}
                className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
              >
                <span className="font-medium">{r.geoName}</span>
                <span className="tabular-nums text-muted-foreground">
                  {r.value}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Trending keywords */}
        <section className="space-y-3">
          <h4 className="text-sm font-semibold tracking-tight">
            Trending keywords
          </h4>
          <ul className="divide-y divide-border/50 rounded-2xl border border-border/70">
            {data.trendingKeywords.map((k) => (
              <li
                key={k.keyword}
                className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{k.keyword}</p>
                  <p className={cn("text-xs capitalize", directionTone(k.trendDirection))}>
                    {k.trendDirection}
                    {k.deltaPercent !== null &&
                      ` · ${k.deltaPercent > 0 ? "+" : ""}${k.deltaPercent}%`}
                  </p>
                </div>
                <span className="tabular-nums text-muted-foreground">
                  {k.interestScore}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
