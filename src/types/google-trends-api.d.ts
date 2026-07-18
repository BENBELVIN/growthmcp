declare module "google-trends-api" {
  type TrendsOptions = {
    keyword: string | string[];
    startTime?: Date;
    endTime?: Date;
    geo?: string | string[];
    hl?: string;
    timezone?: number;
    category?: number;
    property?: string;
    resolution?: "COUNTRY" | "REGION" | "CITY" | "DMA";
    granularTimeResolution?: boolean;
  };

  type TrendsMethod = (
    options: TrendsOptions,
    callback?: (err: Error | null, results: string) => void
  ) => Promise<string>;

  const googleTrends: {
    interestOverTime: TrendsMethod;
    interestByRegion: TrendsMethod;
    relatedQueries: TrendsMethod;
    relatedTopics: TrendsMethod;
    autoComplete: TrendsMethod;
    dailyTrends: TrendsMethod;
    realTimeTrends: TrendsMethod;
  };

  export = googleTrends;
}
