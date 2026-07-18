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
    name: "get_growth_priorities",
    description:
      "Source of truth — unified Top priorities for Cursor to implement.",
  },
  {
    name: "get_project_context",
    description: "Opportunity score, week summary, and priorities preview.",
  },
  {
    name: "get_search_console",
    description: "GSC totals, top queries/pages, and opportunity rows.",
  },
  {
    name: "get_trend_opportunities",
    description: "Open Trends / demand opportunities for the project.",
  },
  {
    name: "get_recommended_content",
    description: "Content ideas with demand but weak coverage.",
  },
  {
    name: "list_projects",
    description: "List GrowthMCP projects available to this connection.",
  },
] as const;
