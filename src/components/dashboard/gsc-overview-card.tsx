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
import {
  GSC_RANGE_OPTIONS,
  GSC_UI_EXPANDED_LIMIT,
  GSC_UI_PREVIEW_LIMIT,
  type GscOverviewStats,
  type GscRangeKey,
} from "@/lib/gsc/client";
import { formatGscCountry, shortPagePath } from "@/lib/gsc/labels";
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
    <div className="w-full space-y-6">
      <div>
        <div className="h-5 w-40 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-3 w-56 animate-pulse rounded bg-muted/70" />
      </div>
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-border/40 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-background p-5 sm:p-6">
            <div className="h-3 w-20 animate-pulse rounded bg-muted" />
            <div className="mt-3 h-8 w-16 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-2xl bg-muted/20" />
    </div>
  );
}

export function GscOverviewCard({ websiteId }: { websiteId: string }) {
  const [stats, setStats] = useState<GscOverviewStats | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [rangeKey, setRangeKey] = useState<GscRangeKey>("28d");
  const [active, setActive] = useState<Record<MetricKey, boolean>>({
    clicks: true,
    impressions: true,
    ctr: false,
    position: false,
  });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void getGscOverviewForWebsite(websiteId, rangeKey).then((res) => {
      if (cancelled) return;
      setLoading(false);
      setConnected(res.connected);
      setStats(res.stats);
      setError(res.error ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [websiteId, rangeKey]);

  const chartData = useMemo(() => stats?.daily ?? [], [stats]);

  const rangePicker = (
    <div className="flex flex-wrap gap-1.5 rounded-full bg-muted/40 p-1 ring-1 ring-border/60">
      {GSC_RANGE_OPTIONS.map((opt) => (
        <button
          key={opt.key}
          type="button"
          onClick={() => setRangeKey(opt.key)}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
            rangeKey === opt.key
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );

  if (loading && !stats) return <GscSkeleton />;

  if (!connected) {
    return (
      <div className="py-8">
        <div className="flex size-12 items-center justify-center rounded-[22%] bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logos/gsc.svg" alt="" className="size-7" />
        </div>
        <h3 className="mt-4 text-lg font-semibold tracking-tight">
          Search Console
        </h3>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
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

  if ((error || !stats) && !loading) {
    return (
      <div className="space-y-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-semibold tracking-tight">Search Console</h3>
          {rangePicker}
        </div>
        <p className="text-sm text-destructive">
          {error ?? "Could not load Search Console data."}
        </p>
      </div>
    );
  }

  if (!stats) return <GscSkeleton />;

  return (
    <div className={cn("w-full space-y-8", loading && "opacity-70")}>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center overflow-hidden rounded-[22%]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logos/gsc.svg" alt="" className="size-6" />
          </span>
          <div>
            <h3 className="text-lg font-semibold tracking-tight">
              Search Console
            </h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {formatRange(stats.range.startDate, stats.range.endDate)}
              <span className="text-muted-foreground/50"> · </span>
              <span className="font-mono text-[11px]">
                {stats.propertyUri}
              </span>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {rangePicker}
          <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-emerald-400 ring-1 ring-emerald-500/20">
            Live
          </span>
        </div>
      </div>

      {/* Metric toggles — GSC style */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {METRICS.map((m) => {
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
                "relative rounded-2xl px-4 py-4 text-left transition-colors sm:px-5 sm:py-5",
                on
                  ? "bg-muted/40 ring-1 ring-border/80"
                  : "opacity-55 hover:bg-muted/20 hover:opacity-80"
              )}
            >
              <span
                className="absolute inset-x-4 top-0 h-0.5 rounded-full transition-opacity sm:inset-x-5"
                style={{
                  background: m.color,
                  opacity: on ? 1 : 0,
                }}
              />
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon
                  className="size-3.5"
                  style={{ color: on ? m.color : undefined }}
                />
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
      <div className="-mx-1 w-full sm:mx-0">
        <div className="h-72 w-full sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
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

      {/* Dimension tables — Queries / Pages / Countries */}
      <GscDimensionTables stats={stats} />
    </div>
  );
}

type DimTab = "queries" | "pages" | "countries";

function GscDimensionTables({ stats }: { stats: GscOverviewStats }) {
  const [tab, setTab] = useState<DimTab>("queries");
  /** How many query/page rows to show; countries stay compact. */
  const [visibleLimit, setVisibleLimit] = useState(GSC_UI_PREVIEW_LIMIT);

  const tabs: { id: DimTab; label: string; empty: string; header: string }[] = [
    {
      id: "queries",
      label: "Queries",
      empty: "No queries in this period.",
      header: "Top queries",
    },
    {
      id: "pages",
      label: "Pages",
      empty: "No pages in this period.",
      header: "Top pages",
    },
    {
      id: "countries",
      label: "Countries",
      empty: "No countries in this period.",
      header: "Country",
    },
  ];

  const allRows =
    tab === "queries"
      ? stats.topQueries
      : tab === "pages"
        ? stats.topPages
        : stats.topCountries;

  const expandable = tab === "queries" || tab === "pages";
  const rows = expandable ? allRows.slice(0, visibleLimit) : allRows;
  const remaining = expandable ? Math.max(allRows.length - visibleLimit, 0) : 0;

  const showMore = () => {
    setVisibleLimit((n) => {
      if (n <= GSC_UI_PREVIEW_LIMIT) return GSC_UI_EXPANDED_LIMIT;
      return allRows.length;
    });
  };

  const selectTab = (id: DimTab) => {
    setTab(id);
    setVisibleLimit(GSC_UI_PREVIEW_LIMIT);
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex flex-wrap gap-1 rounded-full bg-muted/40 p-1 ring-1 ring-border/60">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => selectTab(t.id)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
                  tab === t.id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {tab === "queries" && "Top search queries by clicks"}
            {tab === "pages" && "Top landing pages by impressions"}
            {tab === "countries" && "Traffic by country by clicks"}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="border-b border-border/70 text-xs text-muted-foreground">
              <th className="pb-3 pr-4 font-medium">
                {tabs.find((t) => t.id === tab)?.header}
              </th>
              <th className="pb-3 px-4 text-right font-medium">Clicks</th>
              <th className="pb-3 px-4 text-right font-medium">Impr.</th>
              <th className="pb-3 px-4 text-right font-medium">CTR</th>
              <th className="pb-3 pl-4 text-right font-medium">Position</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              const label =
                tab === "countries"
                  ? formatGscCountry(row.key)
                  : tab === "pages"
                    ? shortPagePath(row.key)
                    : row.key;
              const title = tab === "pages" ? row.key : label;

              return (
                <tr
                  key={`${tab}-${row.key}-${idx}`}
                  className="border-b border-border/40 last:border-0"
                >
                  <td
                    className="max-w-[280px] truncate py-3.5 pr-4 font-medium text-foreground sm:max-w-md"
                    title={title}
                  >
                    {label}
                  </td>
                  <td className="px-4 py-3.5 text-right tabular-nums text-[#4285F4]">
                    {new Intl.NumberFormat("en").format(row.clicks)}
                  </td>
                  <td className="px-4 py-3.5 text-right tabular-nums text-[#A142F4]">
                    {new Intl.NumberFormat("en").format(row.impressions)}
                  </td>
                  <td className="px-4 py-3.5 text-right tabular-nums text-muted-foreground">
                    {(row.ctr * 100).toFixed(1)}%
                  </td>
                  <td className="py-3.5 pl-4 text-right tabular-nums text-muted-foreground">
                    {row.position.toFixed(1)}
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="py-8 text-center text-muted-foreground"
                >
                  {tabs.find((t) => t.id === tab)?.empty}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {remaining > 0 && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={showMore}
            className="rounded-full px-4 py-1.5 text-xs font-medium text-muted-foreground ring-1 ring-border/70 transition-colors hover:bg-muted/50 hover:text-foreground"
          >
            Show more ({remaining} more)
          </button>
        </div>
      )}
    </div>
  );
}
