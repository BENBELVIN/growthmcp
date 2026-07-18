import type {
  InterestOverTimePoint,
  RegionInterestItem,
  RelatedQueryItem,
  RelatedTopicItem,
  TrendDirection,
} from "./types";

/** Raw JSON from google-trends-api is loosely typed; parse defensively. */

type TimelinePoint = {
  time?: string;
  formattedTime?: string;
  value?: number[];
};

type RankedKeyword = {
  query?: string;
  topic?: { mid?: string; title?: string; type?: string };
  value?: number | string;
  formattedValue?: string;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export function parseInterestOverTime(raw: unknown): InterestOverTimePoint[] {
  const root = asRecord(raw);
  const defaultObj = asRecord(root?.default);
  const timeline = asArray<TimelinePoint>(defaultObj?.timelineData);

  return timeline
    .map((point) => {
      const value = Array.isArray(point.value) ? Number(point.value[0] ?? 0) : 0;
      const date =
        point.formattedTime ||
        (point.time
          ? new Date(Number(point.time) * 1000).toISOString().slice(0, 10)
          : "");
      return { date, value: Number.isFinite(value) ? value : 0 };
    })
    .filter((p) => p.date.length > 0);
}

export function parseRelatedQueries(raw: unknown): RelatedQueryItem[] {
  const root = asRecord(raw);
  const defaultObj = asRecord(root?.default);
  const ranked = asArray<Record<string, unknown>>(defaultObj?.rankedList);
  const items: RelatedQueryItem[] = [];

  ranked.forEach((list, listIndex) => {
    const keywords = asArray<RankedKeyword>(list.rankedKeyword);
    const type: RelatedQueryItem["type"] = listIndex === 0 ? "top" : "rising";
    for (const k of keywords) {
      const query = (k.query ?? "").trim();
      if (!query) continue;
      items.push({
        query,
        value: k.value ?? k.formattedValue ?? 0,
        type,
      });
    }
  });

  return items;
}

export function parseRelatedTopics(raw: unknown): RelatedTopicItem[] {
  const root = asRecord(raw);
  const defaultObj = asRecord(root?.default);
  const ranked = asArray<Record<string, unknown>>(defaultObj?.rankedList);
  const items: RelatedTopicItem[] = [];

  ranked.forEach((list, listIndex) => {
    const keywords = asArray<RankedKeyword>(list.rankedKeyword);
    const kind: RelatedTopicItem["kind"] = listIndex === 0 ? "top" : "rising";
    for (const k of keywords) {
      const title = (k.topic?.title ?? "").trim();
      const mid = (k.topic?.mid ?? title).trim();
      if (!title && !mid) continue;
      items.push({
        topic: mid,
        title: title || mid,
        type: k.topic?.type ?? "Topic",
        value: k.value ?? k.formattedValue ?? 0,
        kind,
      });
    }
  });

  return items;
}

export function parseInterestByRegion(raw: unknown): RegionInterestItem[] {
  const root = asRecord(raw);
  const defaultObj = asRecord(root?.default);
  const geoMap = asArray<Record<string, unknown>>(defaultObj?.geoMapData);

  return geoMap
    .map((row) => {
      const values = asArray<number>(row.value);
      const value = Number(values[0] ?? 0);
      return {
        geoCode: String(row.geoCode ?? ""),
        geoName: String(row.geoName ?? row.geoCode ?? ""),
        value: Number.isFinite(value) ? value : 0,
      };
    })
    .filter((r) => r.geoCode.length > 0)
    .sort((a, b) => b.value - a.value);
}

export function computeInterestScore(series: InterestOverTimePoint[]): number {
  if (series.length === 0) return 0;
  const recent = series.slice(-8);
  const avg =
    recent.reduce((sum, p) => sum + p.value, 0) / Math.max(recent.length, 1);
  return Math.round(Math.max(0, Math.min(100, avg)));
}

export function computeTrendDirection(
  series: InterestOverTimePoint[]
): TrendDirection {
  if (series.length < 4) return "unknown";
  const mid = Math.floor(series.length / 2);
  const prior = series.slice(0, mid);
  const recent = series.slice(mid);
  const avg = (pts: InterestOverTimePoint[]) =>
    pts.reduce((s, p) => s + p.value, 0) / Math.max(pts.length, 1);
  const priorAvg = avg(prior);
  const recentAvg = avg(recent);
  if (priorAvg <= 0 && recentAvg <= 0) return "stable";
  const delta = ((recentAvg - priorAvg) / Math.max(priorAvg, 1)) * 100;
  if (delta >= 12) return "rising";
  if (delta <= -12) return "falling";
  return "stable";
}

export function formatTrendDeltaPercent(
  series: InterestOverTimePoint[]
): number | null {
  if (series.length < 4) return null;
  const mid = Math.floor(series.length / 2);
  const prior =
    series.slice(0, mid).reduce((s, p) => s + p.value, 0) / Math.max(mid, 1);
  const recent =
    series.slice(mid).reduce((s, p) => s + p.value, 0) /
    Math.max(series.length - mid, 1);
  if (prior <= 0) return recent > 0 ? 100 : null;
  return Math.round(((recent - prior) / prior) * 100);
}
