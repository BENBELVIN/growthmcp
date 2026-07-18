/**
 * GrowthMCP unified priority queue.
 * Source of truth for Overview "Top priorities" and (later) MCP → Cursor.
 * Merges Search Console page opportunities + Trends keyword opportunities.
 */

import {
  opportunityScore as scoreRowOpportunity,
  type GscDimRow,
  type GscOverviewStats,
} from "@/lib/gsc/client";
import { shortPagePath } from "@/lib/gsc/labels";
import type { TrendOpportunity } from "@/types/database";

export type PrioritySource = "search_console" | "trends";
export type PriorityKind = "page" | "keyword";

export type PriorityCard = {
  id: string;
  /** Canonical target: page URL or keyword/topic to create/improve. */
  target: string;
  /** Short display label for the UI. */
  label: string;
  opportunity: string;
  why: string;
  impact: "High" | "Medium" | "Low";
  source: PrioritySource;
  kind: PriorityKind;
  /** Unified 0–100 rank score for sorting / MCP. */
  score: number;
};

function impactFromScore(score: number): PriorityCard["impact"] {
  if (score >= 45) return "High";
  if (score >= 20) return "Medium";
  return "Low";
}

function normalizeKey(value: string) {
  return value.toLowerCase().trim().replace(/\s+/g, " ");
}

function pageOpportunityLabel(row: GscDimRow): string {
  if (row.impressions >= 20 && row.ctr < 0.03) {
    return "Improve title & meta CTR";
  }
  if (row.position >= 4 && row.position <= 20) {
    return "Push into top 3 rankings";
  }
  if (row.position > 20) {
    return "Strengthen content depth";
  }
  return "Capture more of existing demand";
}

function fromGscPages(rows: GscDimRow[]): PriorityCard[] {
  return rows.map((row) => {
    const score = Math.min(100, Math.round(scoreRowOpportunity(row)));
    return {
      id: `gsc-page:${row.key}`,
      target: row.key,
      label: shortPagePath(row.key),
      opportunity: pageOpportunityLabel(row),
      why: `${new Intl.NumberFormat("en").format(row.impressions)} impressions · ${(row.ctr * 100).toFixed(1)}% CTR · pos ${row.position.toFixed(1)}`,
      impact: impactFromScore(score),
      source: "search_console" as const,
      kind: "page" as const,
      score,
    };
  });
}

function fromTrendOpportunities(rows: TrendOpportunity[]): PriorityCard[] {
  return rows.map((row) => {
    const score = Math.min(100, Math.round(Number(row.trend_score) || 0));
    const create =
      /create/i.test(row.reason) && !/strengthen|improve|refresh/i.test(row.reason);
    return {
      id: `trends:${row.id}`,
      target: row.keyword,
      label: row.keyword,
      opportunity: create
        ? "Create page for rising demand"
        : "Capture Trends + Search demand",
      why: row.reason,
      impact: impactFromScore(score),
      source: "trends" as const,
      kind: "keyword" as const,
      score,
    };
  });
}

/**
 * Merge GSC + Trends into one ranked queue.
 * Dedupes near-duplicates by normalized target; keeps the higher score.
 */
export function buildUnifiedPriorities(input: {
  gscStats?: GscOverviewStats | null;
  trendOpportunities?: TrendOpportunity[];
  limit?: number;
}): PriorityCard[] {
  const limit = input.limit ?? 8;
  const gscCards = fromGscPages(
    input.gscStats?.pageOpportunities.slice(0, 12) ?? []
  );
  const trendCards = fromTrendOpportunities(
    (input.trendOpportunities ?? []).slice(0, 15)
  );

  const byKey = new Map<string, PriorityCard>();

  for (const card of [...gscCards, ...trendCards]) {
    const key = normalizeKey(card.target);
    const existing = byKey.get(key);
    if (!existing || card.score > existing.score) {
      // If both sources hit the same target, prefer keeping GSC page target
      // when scores are close and kinds differ.
      if (
        existing &&
        existing.kind === "page" &&
        card.kind === "keyword" &&
        card.score - existing.score < 8
      ) {
        byKey.set(key, {
          ...existing,
          why: `${existing.why} · Also in Trends.`,
          score: Math.max(existing.score, card.score),
          impact: impactFromScore(Math.max(existing.score, card.score)),
        });
      } else if (
        existing &&
        existing.source !== card.source &&
        Math.abs(existing.score - card.score) < 12
      ) {
        byKey.set(key, {
          ...card,
          why: `${card.why} · Also signaled by ${
            card.source === "trends" ? "Search Console" : "Trends"
          }.`,
          score: Math.max(existing.score, card.score),
          impact: impactFromScore(Math.max(existing.score, card.score)),
        });
      } else {
        byKey.set(key, card);
      }
    }
  }

  return Array.from(byKey.values())
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.label.localeCompare(b.label);
    })
    .slice(0, limit);
}
