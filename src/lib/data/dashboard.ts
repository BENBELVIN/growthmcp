export const navItems = [
  { href: "/dashboard", label: "Overview", icon: "LayoutDashboard" },
  { href: "/dashboard/mcp", label: "MCP", icon: "Terminal" },
  { href: "/dashboard/integrations", label: "Integrations", icon: "Plug" },
  { href: "/dashboard/settings", label: "Settings", icon: "Settings" },
] as const;

export const weekBreakdown = [
  {
    title: "Search Console",
    body: "Impressions are up on your core pages. A few ranking URLs lost CTR — worth a refresh.",
  },
  {
    title: "Google Trends",
    body: "Interest around AI growth tooling and MCP workflows is rising. Good week to publish into that demand.",
  },
  {
    title: "What to do next",
    body: "Connect Search Console and Trends, then ask Cursor what to improve this week via GrowthMCP.",
  },
] as const;
