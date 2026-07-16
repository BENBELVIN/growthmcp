export const integrations = [
  { name: "Google Search Console", short: "GSC", color: "#4285F4" },
  { name: "Google Trends", short: "Trends", color: "#34A853" },
  { name: "Cursor", short: "Cursor", color: "#F5F5F5" },
  { name: "GitHub", short: "GitHub", color: "#E6EDF3" },
  { name: "PostHog", short: "PostHog", color: "#F54E00" },
  { name: "Google Analytics", short: "GA4", color: "#F9AB00" },
  { name: "TikTok", short: "TikTok", color: "#FE2C55" },
  { name: "X", short: "X", color: "#FFFFFF" },
  { name: "LinkedIn", short: "LinkedIn", color: "#0A66C2" },
] as const;

export const mcpTools = [
  {
    name: "get_growth_tasks",
    description: "Prioritized growth actions ranked by expected impact.",
  },
  {
    name: "get_search_console",
    description: "Queries, pages, CTR, and position changes from GSC.",
  },
  {
    name: "get_keyword_opportunities",
    description: "High-intent keywords you're close to ranking for.",
  },
  {
    name: "get_trending_topics",
    description: "Rising topics across Trends and social signals.",
  },
] as const;
