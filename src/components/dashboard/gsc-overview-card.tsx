"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowUpRight, MousePointerClick, Eye, Percent, Crosshair } from "lucide-react";
import { getGscOverviewForWebsite } from "@/lib/gsc/actions";
import type { GscOverviewStats } from "@/lib/gsc/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type MetricKey = "clicks" | "impressions" | "ctr" | "position";

const METRICS: {
  key: MetricKey;
  label: string;
  color: string;
  icon: typeof MousePointerClick;
  format: (n: number) => string;
}[] = [
  {
    key: "clicks",
    label: "Total clicks",
    color: "#4285F4",
    icon: MousePointerClick,
    format: (n) => new Intl.NumberFormat("en").format(Math.round(n)),
  },
  {
    key: "impressions",
    label: "Total impressions",
    color: "#A142F4",
    icon: Eye,
    format: (n) => new Intl.NumberFormat("en").format(Math.round(n)),
  },
  {
    key: "ctr",
    label: "Average CTR",
    color: "#34A853",
    icon: Percent,
    format: (n) => `${(n * 100).toFixed(1)}%`,
  },
  {
    key: "position",
    label: "Average position",
    color: "#FA7B17",
    icon: Crosshair,
    format: (n) => n.toFixed(1),
  },
];

function formatDay(iso: string) {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

function formatRange(start: string, end: string) {
  const a = new Date(`${start}T00:00:00Z`);
  const b = new Date(`${end}T00:00:00Z`);
  return `${a.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })} – ${b.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`;
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string; dataKey: string }[];
  label?: string;
}) {
  if (!active || !payload?.length || !label) return null;
  return (
    <div className="rounded-xl border border-border/80 bg-popover/95 px-3 py-2 text-xs shadow-xl backdrop-blur">
      <p className="mb-1.5 font-medium text-foreground">{formatDay(label)}</p>
      <div className="space-y-1">
        {payload.map((p) => {
          const meta = METRICS.find((m) => m.key === p.dataKey);
          return (
            <div key={p.dataKey} className="flex items-center gap-2">
              <span
                className="size-1.5 rounded-full"
                style={{ background: p.color }}
              />
              <span className="text-muted-foreground">{meta?.label ?? p.name}</span>
              <span className="ml-auto font-medium text-foreground">
                {meta?.format(p.value) ?? p.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GscSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-border/60 bg-card/40">
      <div className="border-b border-border/60 px-5 py-4 sm:px-6">
        <div className="h-5 w-40 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-3 w-56 animate-pulse rounded bg-muted/70" />
      </div>
      <div className="grid grid-cols-2 border-b border-border/60 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border-border/60 p-5 sm:p-6 lg:border-r lg:last:border-r-0">
            <div className="h-3 w-20 animate-pulse rounded bg-muted" />
            <div className="mt-3 h-8 w-16 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
      <div className="h-64 animate-pulse bg-muted/20" />
    </div>
  );
}

export function GscOverviewCard({ websiteId }: { websiteId: string }) {
  const [stats, setStats] = useState<GscOverviewStats | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<Record<MetricKey, boolean>>({
    clicks: true,
    impressions: true,
    ctr: false,
    position: false,
  });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void getGscOverviewForWebsite(websiteId).then((res) => {
      if (cancelled) return;
      setLoading(false);
      setConnected(res.connected);
      setStats(res.stats);
      setError(res.error ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [websiteId]);

  const chartData = useMemo(() => stats?.daily ?? [], [stats]);

  if (loading) return <GscSkeleton />;

  if (!connected) {
    return (
      <div className="rounded-3xl border border-dashed border-border/80 bg-card/30 p-8 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-muted ring-1 ring-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logos/gsc.svg" alt="" className="size-7" />
        </div>
        <h3 className="mt-4 text-lg font-semibold tracking-tight">
          Search Console
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
          Connect Google Search Console to see clicks, impressions, CTR, and
          ranking queries for this project.
        </p>
        <Button
          asChild
          className="mt-5 h-10 rounded-full bg-primary px-5 text-primary-foreground"
        >
          <Link href="/dashboard/integrations">
            Connect Search Console
            <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-6">
        <h3 className="font-semibold tracking-tight">Search Console</h3>
        <p className="mt-2 text-sm text-destructive">
          {error ?? "Could not load Search Console data."}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-b from-card/90 to-card/40 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset]">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border/60 px-5 py-5 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-white/5 ring-1 ring-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logos/gsc.svg" alt="" className="size-6" />
          </span>
          <div>
            <h3 className="text-lg font-semibold tracking-tight">
              Search Console
            </h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {formatRange(stats.range.startDate, stats.range.endDate)}
            </p>
          </div>
        </div>
        <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-emerald-400 ring-1 ring-emerald-500/20">
          Live
        </span>
      </div>

      {/* Metric toggles — GSC style */}
      <div className="grid grid-cols-2 border-b border-border/60 lg:grid-cols-4">
        {METRICS.map((m, i) => {
          const Icon = m.icon;
          const on = active[m.key];
          const value =
            m.key === "clicks"
              ? stats.clicks
              : m.key === "impressions"
                ? stats.impressions
                : m.key === "ctr"
                  ? stats.ctr
                  : stats.position;

          return (
            <button
              key={m.key}
              type="button"
              onClick={() =>
                setActive((prev) => ({ ...prev, [m.key]: !prev[m.key] }))
              }
              className={cn(
                "relative px-5 py-5 text-left transition-colors sm:px-6",
                i % 2 === 0 && "border-r border-border/60",
                i < 2 && "border-b border-border/60 lg:border-b-0",
                i < 3 && "lg:border-r",
                on ? "bg-white/[0.03]" : "hover:bg-white/[0.02] opacity-70"
              )}
            >
              <span
                className="absolute inset-x-0 top-0 h-0.5 transition-opacity"
                style={{
                  background: m.color,
                  opacity: on ? 1 : 0,
                }}
              />
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon className="size-3.5" style={{ color: on ? m.color : undefined }} />
                <span className="text-xs font-medium">{m.label}</span>
              </div>
              <p
                className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl"
                style={{ color: on ? m.color : undefined }}
              >
                {m.format(value)}
              </p>
            </button>
          );
        })}
      </div>

      {/* Chart */}
      <div className="border-b border-border/60 px-2 py-4 sm:px-4 sm:py-6">
        <div className="h-64 w-full sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="gscClicks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4285F4" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#4285F4" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gscImpressions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#A142F4" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#A142F4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke="rgba(255,255,255,0.06)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tickFormatter={formatDay}
                tick={{ fill: "oklch(0.68 0.01 260)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                minTickGap={28}
              />
              <YAxis
                yAxisId="left"
                tick={{ fill: "oklch(0.68 0.01 260)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={36}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fill: "oklch(0.68 0.01 260)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={40}
                reversed={active.position && !active.ctr}
                hide={!active.ctr && !active.position}
              />
              <Tooltip content={<ChartTooltip />} />
              {active.impressions && (
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="impressions"
                  stroke="#A142F4"
                  strokeWidth={2}
                  fill="url(#gscImpressions)"
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                />
              )}
              {active.clicks && (
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="clicks"
                  stroke="#4285F4"
                  strokeWidth={2.5}
                  fill="url(#gscClicks)"
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                />
              )}
              {active.ctr && (
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="ctr"
                  stroke="#34A853"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                />
              )}
              {active.position && (
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="position"
                  stroke="#FA7B17"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Queries table */}
      <div className="px-5 py-5 sm:px-6 sm:py-6">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h4 className="text-sm font-semibold tracking-tight">Queries</h4>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Top search queries in this period
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-border/60">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30 text-xs text-muted-foreground">
                <th className="px-4 py-3 font-medium">Top queries</th>
                <th className="px-4 py-3 text-right font-medium">Clicks</th>
                <th className="px-4 py-3 text-right font-medium">Impr.</th>
                <th className="px-4 py-3 text-right font-medium">CTR</th>
                <th className="px-4 py-3 text-right font-medium">Position</th>
              </tr>
            </thead>
            <tbody>
              {stats.topQueries.map((q, idx) => (
                <tr
                  key={`${q.query}-${idx}`}
                  className="border-b border-border/40 last:border-0 hover:bg-white/[0.02]"
                >
                  <td className="max-w-[220px] truncate px-4 py-3 font-medium text-foreground sm:max-w-none">
                    {q.query}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-[#4285F4]">
                    {new Intl.NumberFormat("en").format(q.clicks)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-[#A142F4]">
                    {new Intl.NumberFormat("en").format(q.impressions)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                    {(q.ctr * 100).toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                    {q.position.toFixed(1)}
                  </td>
                </tr>
              ))}
              {stats.topQueries.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No queries in this period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
