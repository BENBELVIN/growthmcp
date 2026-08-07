import {
  opportunityScore as scoreRowOpportunity,
  type GscOverviewStats,
} from "@/lib/gsc/client";
import type { BingOverviewStats } from "@/lib/bing/client";
import {
  buildUnifiedPriorities,
  type PriorityCard,
} from "@/lib/growth/priorities";
import type { TrendOpportunity } from "@/types/database";

export type { PriorityCard } from "@/lib/growth/priorities";

export type OpportunityScore = {
  score: number;
  label: string;
  detail: string;
};

export type SeoMetric = {
  id: string;
  label: string;
  value: string;
  delta?: string;
  tone: "positive" | "negative" | "neutral";
};

export type ContentIdea = {
  id: string;
  title: string;
  reason: string;
  impressions: number;
};

export type RecentWin = {
  id: string;
  label: string;
  detail?: string;
};

export type CommandCenterData = {
  opportunityScore: OpportunityScore;
  totalImpressions: number | null;
  impressionsDeltaPct: number | null;
  seoMetrics: SeoMetric[];
  priorities: PriorityCard[];
  recommendedContent: ContentIdea[];
  recentWins: RecentWin[];
  connectedIntegrations: string[];
};

function pctChange(current: number, previous: number): number | null {
  if (previous <= 0) return current > 0 ? 100 : null;
  return ((current - previous) / previous) * 100;
}

function formatPct(n: number | null): string | undefined {
  if (n === null) return undefined;
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(0)}%`;
}

function splitDaily(stats: GscOverviewStats) {
  const daily = stats.daily;
  if (daily.length < 4) {
    return { recent: daily, prior: [] as typeof daily };
  }
  const mid = Math.floor(daily.length / 2);
  return {
    prior: daily.slice(0, mid),
    recent: daily.slice(mid),
  };
}

function sumMetric(
  rows: GscOverviewStats["daily"],
  key: "clicks" | "impressions"
) {
  return rows.reduce((s, d) => s + d[key], 0);
}

function avgPosition(rows: GscOverviewStats["daily"]) {
  if (rows.length === 0) return 0;
  const weighted = rows.reduce(
    (acc, d) => ({
      pos: acc.pos + d.position * Math.max(d.impressions, 1),
      weight: acc.weight + Math.max(d.impressions, 1),
    }),
    { pos: 0, weight: 0 }
  );
  return weighted.weight > 0 ? weighted.pos / weighted.weight : 0;
}

function computeOpportunityScore(
  stats: GscOverviewStats | null,
  priorities: PriorityCard[]
): OpportunityScore {
  if (!stats && priorities.length === 0) {
    return {
      score: 0,
      label: "No signals yet",
      detail: "Connect Search Console and sync Trends to surface priorities.",
    };
  }

  const highImpact = priorities.filter((p) => p.impact === "High").length;
  const avgPriority =
    priorities.reduce((s, p) => s + p.score, 0) /
    Math.max(priorities.length, 1);

  let score: number;
  if (stats) {
    const topPages = stats.pageOpportunities.slice(0, 10);
    const topQueries = stats.queryOpportunities.slice(0, 10);
    const pageSignal =
      topPages.reduce((s, row) => s + scoreRowOpportunity(row), 0) /
      Math.max(topPages.length, 1);
    const querySignal =
      topQueries.reduce((s, row) => s + scoreRowOpportunity(row), 0) /
      Math.max(topQueries.length, 1);
    const trendsBoost = Math.min(
      25,
      priorities.filter((p) => p.source === "trends").length * 4
    );
    score = Math.round(
      Math.max(
        0,
        Math.min(
          100,
          pageSignal * 0.7 * 1.8 + querySignal * 0.3 * 1.8 + trendsBoost
        )
      )
    );
  } else {
    score = Math.round(Math.min(100, avgPriority));
  }

  let label: string;
  let detail: string;

  if (score >= 70) {
    label = "High-impact improvements available";
    detail =
      highImpact > 0
        ? `${highImpact} high-impact items ready — start there.`
        : "Several strong opportunities are waiting in your priority queue.";
  } else if (score >= 40) {
    label = "Solid opportunities still open";
    detail =
      "Clear next actions remain across Search Console and Trends.";
  } else {
    label = "Most obvious wins addressed";
    detail =
      "Fewer easy wins right now — dig into Content & Rankings for subtler moves.";
  }

  return { score, label, detail };
}

function formatClicksDelta(stats: GscOverviewStats | null): string {
  if (!stats) return "—";
  const { recent, prior } = splitDaily(stats);
  const recentClicks = sumMetric(recent, "clicks");
  const priorClicks = sumMetric(prior, "clicks");
  return formatPct(pctChange(recentClicks, priorClicks)) ?? "—";
}

function countPagesInSearch(stats: GscOverviewStats | null): number {
  if (!stats) return 0;
  const keys = new Set([
    ...stats.topPages.map((p) => p.key),
    ...stats.pageOpportunities.map((p) => p.key),
  ]);
  return keys.size;
}

function countPagesNeedingAttention(stats: GscOverviewStats | null): number {
  if (!stats) return 0;
  return stats.pageOpportunities.filter(
    (p) => p.position > 20 || (p.impressions >= 15 && p.ctr < 0.02)
  ).length;
}

function buildSeoMetrics(
  stats: GscOverviewStats | null,
  bingStats: BingOverviewStats | null,
  priorities: PriorityCard[]
): SeoMetric[] {
  const { recent, prior } = stats
    ? splitDaily(stats)
    : { recent: [], prior: [] };
  const impDelta = stats
    ? pctChange(sumMetric(recent, "impressions"), sumMetric(prior, "impressions"))
    : null;
  const recentPos = stats ? avgPosition(recent) : 0;
  const priorPos = stats ? avgPosition(prior) : 0;
  const posDelta =
    stats && priorPos > 0 && recentPos > 0 ? priorPos - recentPos : null;

  const clicks =
    stats?.clicks ??
    (bingStats ? bingStats.clicks : null);
  const impressions =
    stats?.impressions ??
    (bingStats ? bingStats.impressions : null);
  const position = stats?.position ?? null;

  return [
    {
      id: "clicks",
      label: "Organic clicks",
      value:
        clicks !== null
          ? new Intl.NumberFormat("en").format(Math.round(clicks))
          : "—",
      delta: stats ? formatClicksDelta(stats) : undefined,
      tone:
        stats && formatClicksDelta(stats)?.startsWith("+")
          ? "positive"
          : stats && formatClicksDelta(stats)?.startsWith("-")
            ? "negative"
            : "neutral",
    },
    {
      id: "impressions",
      label: "Impressions",
      value:
        impressions !== null
          ? new Intl.NumberFormat("en").format(Math.round(impressions))
          : "—",
      delta: impDelta !== null ? formatPct(impDelta) : undefined,
      tone:
        impDelta === null
          ? "neutral"
          : impDelta > 2
            ? "positive"
            : impDelta < -2
              ? "negative"
              : "neutral",
    },
    {
      id: "position",
      label: "Average position",
      value: position !== null ? position.toFixed(1) : "—",
      delta:
        posDelta === null
          ? undefined
          : `${posDelta > 0 ? "↑" : posDelta < 0 ? "↓" : "→"} ${Math.abs(posDelta).toFixed(1)}`,
      tone:
        posDelta === null
          ? "neutral"
          : posDelta > 0.3
            ? "positive"
            : posDelta < -0.3
              ? "negative"
              : "neutral",
    },
    {
      id: "indexed",
      label: "Pages in search",
      value: stats ? String(countPagesInSearch(stats)) : "—",
      delta: stats ? "Tracked in Search Console" : undefined,
      tone: "neutral",
    },
    {
      id: "opportunities",
      label: "Ranking opportunities",
      value: String(priorities.length),
      delta: `${priorities.filter((p) => p.impact === "High").length} high impact`,
      tone: priorities.length > 0 ? "positive" : "neutral",
    },
    {
      id: "attention",
      label: "Pages needing attention",
      value: stats ? String(countPagesNeedingAttention(stats)) : "—",
      delta: "Weak CTR or page 2+",
      tone:
        stats && countPagesNeedingAttention(stats) > 3
          ? "negative"
          : stats && countPagesNeedingAttention(stats) > 0
            ? "neutral"
            : "positive",
    },
  ];
}

function buildRecentWins(
  stats: GscOverviewStats | null,
  bingStats: BingOverviewStats | null = null
): RecentWin[] {
  const wins: RecentWin[] = [];
  if (stats) {
    wins.push({
      id: "gsc-connected",
      label: "Connected Google Search Console",
      detail: "Search data feeding your SEO overview",
    });
  }
  if (bingStats) {
    wins.push({
      id: "bing-connected",
      label: "Connected Bing Webmaster",
      detail: "Bing ranking signals included in your overview",
    });
  }
  return wins;
}

export function buildCommandCenter(
  stats: GscOverviewStats | null,
  trendOpportunities: TrendOpportunity[] = [],
  bingStats: BingOverviewStats | null = null
): CommandCenterData {
  const priorities = buildUnifiedPriorities({
    gscStats: stats,
    bingStats,
    trendOpportunities,
    limit: 8,
  });

  const connectedIntegrations = [
    ...(stats ? ["Google Search Console"] : []),
    ...(bingStats ? ["Bing Webmaster"] : []),
    ...(trendOpportunities.length > 0 ? ["Google Trends"] : []),
  ];

  const recommendedContent: ContentIdea[] = stats
    ? stats.queryOpportunities
        .filter((q) => q.impressions >= 5 && q.clicks <= 1)
        .slice(0, 5)
        .map((q) => ({
          id: q.key,
          title: q.key,
          reason: `${new Intl.NumberFormat("en").format(q.impressions)} impressions with little click-through — strong topic to cover or refresh.`,
          impressions: q.impressions,
        }))
    : [];

  const { recent, prior } = stats
    ? splitDaily(stats)
    : { recent: [], prior: [] as GscOverviewStats["daily"] };
  const impressionsDeltaPct = stats
    ? pctChange(sumMetric(recent, "impressions"), sumMetric(prior, "impressions"))
    : null;
  const totalImpressions =
    stats?.impressions ?? (bingStats ? bingStats.impressions : null);

  return {
    opportunityScore: computeOpportunityScore(stats, priorities),
    totalImpressions,
    impressionsDeltaPct,
    seoMetrics: buildSeoMetrics(stats, bingStats, priorities),
    priorities,
    recommendedContent,
    recentWins: buildRecentWins(stats, bingStats),
    connectedIntegrations,
  };
}
