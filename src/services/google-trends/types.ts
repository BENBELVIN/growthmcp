/**
 * Google Trends provider types.
 * Isolated from the unofficial `google-trends-api` package shapes so we can
 * swap to Google's official Trends API later without changing app code.
 */

export type TrendDirection = "rising" | "stable" | "falling" | "unknown";

export type InterestOverTimePoint = {
  date: string;
  value: number;
};

export type RelatedQueryItem = {
  query: string;
  value: number | string;
  type: "top" | "rising";
};

export type RelatedTopicItem = {
  topic: string;
  title: string;
  type: string;
  value: number | string;
  kind: "top" | "rising";
};

export type RegionInterestItem = {
  geoCode: string;
  geoName: string;
  value: number;
};

export type TrendsQueryOptions = {
  keyword: string | string[];
  startTime?: Date;
  endTime?: Date;
  geo?: string;
  hl?: string;
  category?: number;
  resolution?: "COUNTRY" | "REGION" | "CITY" | "DMA";
};

export type KeywordTrendsBundle = {
  keyword: string;
  geo: string;
  interestOverTime: InterestOverTimePoint[];
  interestScore: number;
  trendDirection: TrendDirection;
  relatedQueries: RelatedQueryItem[];
  relatedTopics: RelatedTopicItem[];
  interestByRegion: RegionInterestItem[];
};

export type TrendOpportunityDraft = {
  keyword: string;
  reason: string;
  trendScore: number;
  status: "open";
};

export type ProjectTrendsSyncResult = {
  websiteId: string;
  keywordsSynced: number;
  opportunitiesCreated: number;
  trends: KeywordTrendsBundle[];
  opportunities: TrendOpportunityDraft[];
  syncedAt: string;
};
