import {
  opportunityScore as scoreRowOpportunity,
  type GscOverviewStats,
} from "@/lib/gsc/client";
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

export type WeekSummaryItem = {
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

export type CommandCenterData = {
  opportunityScore: OpportunityScore;
  weekSummary: WeekSummaryItem[];
  priorities: PriorityCard[];
  recommendedContent: ContentIdea[];
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

/**
 * How much actionable opportunity the engine sees — not business health.
 */
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
        Math.min(100, pageSignal * 0.7 * 1.8 + querySignal * 0.3 * 1.8 + trendsBoost)
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
        ? `${highImpact} high-impact items in Top priorities — start there.`
        : "Several strong opportunities are waiting — work the priority queue.";
  } else if (score >= 40) {
    label = "Solid opportunities still open";
    detail =
      "A clear set of next actions remains across Search Console and Trends.";
  } else {
    label = "Most obvious opportunities addressed";
    detail =
      "Fewer easy wins right now — dig into Insights for subtler moves.";
  }

  return { score, label, detail };
}

export function buildCommandCenter(
  stats: GscOverviewStats | null,
  trendOpportunities: TrendOpportunity[] = []
): CommandCenterData {
  const priorities = buildUnifiedPriorities({
    gscStats: stats,
    trendOpportunities,
    limit: 8,
  });

  if (!stats) {
    return {
      opportunityScore: computeOpportunityScore(null, priorities),
      weekSummary: [
        {
          id: "impressions",
          label: "Impression change",
          value: "—",
          tone: "neutral",
        },
        {
          id: "rankings",
          label: "Ranking changes",
          value: "—",
          tone: "neutral",
        },
        {
          id: "opportunities",
          label: "Open opportunities",
          value: String(priorities.length),
          delta: "From Trends + Search Console",
          tone: priorities.length > 0 ? "positive" : "neutral",
        },
        {
          id: "losing",
          label: "Pages losing traffic",
          value: "—",
          tone: "neutral",
        },
      ],
      priorities,
      recommendedContent: [],
    };
  }

  const { recent, prior } = splitDaily(stats);
  const recentImp = sumMetric(recent, "impressions");
  const priorImp = sumMetric(prior, "impressions");
  const impDelta = pctChange(recentImp, priorImp);

  const recentPos = avgPosition(recent);
  const priorPos = avgPosition(prior);
  const posDelta =
    priorPos > 0 && recentPos > 0 ? priorPos - recentPos : null;

  const gscNew = stats.pageOpportunities.filter(
    (p) => p.impressions >= 10 && p.clicks <= 2
  ).length;
  const trendsOpen = trendOpportunities.length;

  const losing = stats.pageOpportunities
    .filter((p) => p.position > 20 || (p.impressions >= 15 && p.ctr < 0.02))
    .slice(0, 8).length;

  const weekSummary: WeekSummaryItem[] = [
    {
      id: "impressions",
      label: "Impression change",
      value: formatPct(impDelta) ?? "—",
      delta:
        priorImp > 0
          ? `${new Intl.NumberFormat("en").format(recentImp)} vs prior half`
          : undefined,
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
      id: "rankings",
      label: "Ranking changes",
      value:
        posDelta === null
          ? "—"
          : `${posDelta > 0 ? "↑" : posDelta < 0 ? "↓" : "→"} ${Math.abs(posDelta).toFixed(1)}`,
      delta: `Avg position ${stats.position.toFixed(1)}`,
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
      id: "opportunities",
      label: "Open opportunities",
      value: String(priorities.length),
      delta: `${gscNew} Search Console · ${trendsOpen} Trends`,
      tone: priorities.length > 0 ? "positive" : "neutral",
    },
    {
      id: "losing",
      label: "Pages losing traffic",
      value: String(losing),
      delta: "Weak CTR or deep rankings",
      tone: losing > 3 ? "negative" : losing > 0 ? "neutral" : "positive",
    },
  ];

  const recommendedContent: ContentIdea[] = stats.queryOpportunities
    .filter((q) => q.impressions >= 5 && q.clicks <= 1)
    .slice(0, 5)
    .map((q) => ({
      id: q.key,
      title: q.key,
      reason: `${new Intl.NumberFormat("en").format(q.impressions)} impressions with little click-through — strong topic to cover or refresh.`,
      impressions: q.impressions,
    }));

  return {
    opportunityScore: computeOpportunityScore(stats, priorities),
    weekSummary,
    priorities,
    recommendedContent,
  };
}
