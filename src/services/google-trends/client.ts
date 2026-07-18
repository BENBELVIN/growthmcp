/**
 * Thin adapter over `google-trends-api`.
 * This is the ONLY module that may import the unofficial package.
 * Swap this file when Google ships an official Trends API.
 */

import googleTrends from "google-trends-api";
import type { TrendsQueryOptions } from "./types";

const MAX_ATTEMPTS = 4;
const BASE_BACKOFF_MS = 1500;

function toPackageOptions(options: TrendsQueryOptions) {
  return {
    keyword: options.keyword,
    startTime: options.startTime,
    endTime: options.endTime,
    geo: options.geo ?? "",
    hl: options.hl ?? "en-US",
    category: options.category ?? 0,
    resolution: options.resolution,
  };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function describePayload(raw: string) {
  const trimmed = raw.trim();
  if (trimmed.startsWith("<") || /error\s*429/i.test(trimmed)) {
    return "rate_limited";
  }
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    return "json_like";
  }
  return "unknown";
}

/**
 * Unofficial Trends often returns HTML (429) or empty bodies when throttled.
 */
export function parseTrendsPayload(raw: unknown): unknown {
  if (raw == null) {
    throw new Error("Google Trends returned an empty response");
  }
  if (typeof raw !== "string") return raw;

  const trimmed = raw.trim();
  if (!trimmed) {
    throw new Error("Google Trends returned an empty response");
  }

  const kind = describePayload(trimmed);
  if (kind === "rate_limited") {
    throw new Error("Google Trends rate limited (HTTP 429)");
  }

  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    throw new Error(
      `Google Trends returned an unparseable response (${kind}, ${trimmed.length} chars)`
    );
  }
}

async function callRaw(
  method: (opts: Record<string, unknown>) => Promise<string>,
  options: TrendsQueryOptions
): Promise<unknown> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const raw = await method(toPackageOptions(options));
      return parseTrendsPayload(raw);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      const retryable =
        /rate limited|429|unparseable|empty response|ECONNRESET|ETIMEDOUT/i.test(
          lastError.message
        );
      if (!retryable || attempt === MAX_ATTEMPTS) break;
      const wait = BASE_BACKOFF_MS * attempt + Math.floor(Math.random() * 500);
      await sleep(wait);
    }
  }

  throw lastError ?? new Error("Google Trends request failed");
}

export async function fetchInterestOverTimeRaw(options: TrendsQueryOptions) {
  return callRaw(
    googleTrends.interestOverTime as (
      opts: Record<string, unknown>
    ) => Promise<string>,
    options
  );
}

export async function fetchRelatedQueriesRaw(options: TrendsQueryOptions) {
  return callRaw(
    googleTrends.relatedQueries as (
      opts: Record<string, unknown>
    ) => Promise<string>,
    options
  );
}

export async function fetchRelatedTopicsRaw(options: TrendsQueryOptions) {
  return callRaw(
    googleTrends.relatedTopics as (
      opts: Record<string, unknown>
    ) => Promise<string>,
    options
  );
}

export async function fetchInterestByRegionRaw(options: TrendsQueryOptions) {
  return callRaw(
    googleTrends.interestByRegion as (
      opts: Record<string, unknown>
    ) => Promise<string>,
    {
      ...options,
      resolution: options.resolution ?? "COUNTRY",
    }
  );
}
