/**
 * Isolated Google Trends provider for GrowthMCP.
 *
 * Swap boundary: replace `client.ts` (and parsers if needed) when Google
 * publishes an official Trends API. Keep `service.ts` / `sync.ts` signatures stable.
 */

export type {
  InterestOverTimePoint,
  KeywordTrendsBundle,
  ProjectTrendsSyncResult,
  RegionInterestItem,
  RelatedQueryItem,
  RelatedTopicItem,
  TrendDirection,
  TrendOpportunityDraft,
  TrendsQueryOptions,
} from "./types";

export {
  getInterestOverTime,
  getRelatedQueries,
  getRelatedTopics,
  getInterestByRegion,
  getKeywordTrendsBundle,
  type TrendsExtrasLevel,
} from "./service";

export {
  fetchTrendsForProject,
  generateTrendOpportunities,
  selectSeedKeywords,
  bundlesFromStoredTrends,
  type GscQuerySeed,
  type SyncProjectTrendsInput,
} from "./sync";

export { formatTrendDeltaPercent } from "./parser";
