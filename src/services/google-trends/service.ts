/**
 * Public Google Trends service API for GrowthMCP.
 * App code should import from here (or the package index) — never from client.ts.
 */

import {
  fetchInterestByRegionRaw,
  fetchInterestOverTimeRaw,
  fetchRelatedQueriesRaw,
  fetchRelatedTopicsRaw,
} from "./client";
import {
  computeInterestScore,
  computeTrendDirection,
  parseInterestByRegion,
  parseInterestOverTime,
  parseRelatedQueries,
  parseRelatedTopics,
} from "./parser";
import type {
  InterestOverTimePoint,
  KeywordTrendsBundle,
  RegionInterestItem,
  RelatedQueryItem,
  RelatedTopicItem,
  TrendsQueryOptions,
} from "./types";

const DEFAULT_LOOKBACK_DAYS = 90;
const ENDPOINT_GAP_MS = 1600;

export type TrendsExtrasLevel = "none" | "related" | "full";

function withDefaultWindow(options: TrendsQueryOptions): TrendsQueryOptions {
  const endTime = options.endTime ?? new Date();
  const startTime =
    options.startTime ??
    new Date(endTime.getTime() - DEFAULT_LOOKBACK_DAYS * 24 * 60 * 60 * 1000);
  return { ...options, startTime, endTime };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getInterestOverTime(
  options: TrendsQueryOptions
): Promise<InterestOverTimePoint[]> {
  const raw = await fetchInterestOverTimeRaw(withDefaultWindow(options));
  return parseInterestOverTime(raw);
}

export async function getRelatedQueries(
  options: TrendsQueryOptions
): Promise<RelatedQueryItem[]> {
  const raw = await fetchRelatedQueriesRaw(withDefaultWindow(options));
  return parseRelatedQueries(raw);
}

export async function getRelatedTopics(
  options: TrendsQueryOptions
): Promise<RelatedTopicItem[]> {
  const raw = await fetchRelatedTopicsRaw(withDefaultWindow(options));
  return parseRelatedTopics(raw);
}

export async function getInterestByRegion(
  options: TrendsQueryOptions
): Promise<RegionInterestItem[]> {
  const raw = await fetchInterestByRegionRaw(withDefaultWindow(options));
  return parseInterestByRegion(raw);
}

async function safeCall<T>(
  label: string,
  fn: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.warn(
      `[google-trends] ${label}:`,
      error instanceof Error ? error.message : error
    );
    return fallback;
  }
}

/**
 * Fetch a Trends bundle for one keyword.
 * Interest-over-time is required; extras degrade gracefully under throttling.
 */
export async function getKeywordTrendsBundle(
  keyword: string,
  opts?: {
    geo?: string;
    hl?: string;
    extras?: TrendsExtrasLevel;
  }
): Promise<KeywordTrendsBundle> {
  const geo = opts?.geo ?? "";
  const extras: TrendsExtrasLevel = opts?.extras ?? "full";
  const base: TrendsQueryOptions = {
    keyword,
    geo,
    hl: opts?.hl ?? "en-US",
  };

  const interestOverTime = await getInterestOverTime(base);

  let relatedQueries: RelatedQueryItem[] = [];
  let relatedTopics: RelatedTopicItem[] = [];
  let interestByRegion: RegionInterestItem[] = [];

  if (extras === "related" || extras === "full") {
    await sleep(ENDPOINT_GAP_MS);
    relatedQueries = await safeCall(
      `relatedQueries "${keyword}"`,
      () => getRelatedQueries(base),
      []
    );
  }

  if (extras === "full") {
    await sleep(ENDPOINT_GAP_MS);
    relatedTopics = await safeCall(
      `relatedTopics "${keyword}"`,
      () => getRelatedTopics(base),
      []
    );

    await sleep(ENDPOINT_GAP_MS);
    interestByRegion = await safeCall(
      `interestByRegion "${keyword}"`,
      () => getInterestByRegion(base),
      []
    );
  }

  return {
    keyword,
    geo: geo || "worldwide",
    interestOverTime,
    interestScore: computeInterestScore(interestOverTime),
    trendDirection: computeTrendDirection(interestOverTime),
    relatedQueries,
    relatedTopics,
    interestByRegion,
  };
}
