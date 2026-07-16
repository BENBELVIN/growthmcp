export const overviewMetrics = [
  {
    id: "opportunities",
    label: "Today's Opportunities",
    value: "12",
    delta: "+4 vs yesterday",
    trend: "up" as const,
    detail: "3 high impact · 5 medium · 4 quick wins",
  },
  {
    id: "growth-score",
    label: "Growth Score",
    value: "78",
    delta: "+6 this week",
    trend: "up" as const,
    detail: "Search + content momentum improving",
  },
  {
    id: "visibility",
    label: "Search Visibility",
    value: "64%",
    delta: "+2.1% (7d)",
    trend: "up" as const,
    detail: "Impressions up on 18 ranking pages",
  },
  {
    id: "content-health",
    label: "Content Health",
    value: "81",
    delta: "2 pages need refresh",
    trend: "neutral" as const,
    detail: "Freshness score across published URLs",
  },
] as const;

export const aiRecommendations = [
  {
    id: "r1",
    priority: "High",
    title: "Refresh /pricing — CTR down 18% at position 4.2",
    impact: "+1.4k clicks / mo estimated",
    source: "Search Console",
    action: "Rewrite hero + FAQ for 'pricing calculator' intent",
  },
  {
    id: "r2",
    priority: "High",
    title: "Ship landing page for 'AI growth MCP'",
    impact: "Keyword rising +140% (Trends)",
    source: "Trends + GSC",
    action: "Create /ai-growth-mcp with comparison section",
  },
  {
    id: "r3",
    priority: "Medium",
    title: "Turn 'keyword opportunities' thread into a short video",
    impact: "High save rate on similar LinkedIn posts",
    source: "LinkedIn",
    action: "90s screen recording + caption for Cursor workflow",
  },
  {
    id: "r4",
    priority: "Medium",
    title: "Expand docs for get_trending_topics()",
    impact: "Reduces agent hallucination on topic scope",
    source: "MCP usage",
    action: "Add response schema examples to docs",
  },
] as const;

export const activityFeed = [
  {
    id: "a1",
    type: "gsc" as const,
    title: "Query cluster shifted",
    body: "'mcp server setup' impressions +32% · avg position 9.1 → 7.4",
    time: "14m ago",
  },
  {
    id: "a2",
    type: "trend" as const,
    title: "Rising topic detected",
    body: "'growth context for agents' broke breakout on Google Trends (US)",
    time: "1h ago",
  },
  {
    id: "a3",
    type: "task" as const,
    title: "AI task completed",
    body: "Cursor applied meta title updates on 6 blog posts",
    time: "2h ago",
  },
  {
    id: "a4",
    type: "gsc" as const,
    title: "Page lost CTR",
    body: "/blog/search-console-mcp CTR 4.8% → 3.1% at stable position",
    time: "3h ago",
  },
  {
    id: "a5",
    type: "social" as const,
    title: "Social spike",
    body: "X thread on MCP tools: 4.2k impressions · 9.1% engagement",
    time: "5h ago",
  },
  {
    id: "a6",
    type: "trend" as const,
    title: "Related query emerging",
    body: "'posthog mcp' related interest +64% week over week",
    time: "Yesterday",
  },
] as const;

export const gscChanges = [
  {
    page: "/docs/mcp-tools",
    metric: "Clicks",
    before: "842",
    after: "1,104",
    change: "+31%",
  },
  {
    page: "/pricing",
    metric: "CTR",
    before: "5.2%",
    after: "4.3%",
    change: "-17%",
  },
  {
    page: "/blog/growth-agents",
    metric: "Position",
    before: "11.4",
    after: "8.9",
    change: "+2.5",
  },
  {
    page: "/integrations/gsc",
    metric: "Impressions",
    before: "12.4k",
    after: "15.1k",
    change: "+22%",
  },
] as const;

export const trendChanges = [
  {
    topic: "MCP server for marketing",
    region: "US",
    interest: 78,
    change: "+140%",
  },
  {
    topic: "Cursor growth workflow",
    region: "Global",
    interest: 62,
    change: "+86%",
  },
  {
    topic: "AI SEO agent",
    region: "UK",
    interest: 54,
    change: "+41%",
  },
  {
    topic: "Search Console API MCP",
    region: "US",
    interest: 49,
    change: "+33%",
  },
] as const;

export const recentTasks = [
  {
    id: "t1",
    title: "Update /pricing meta + H1 for calculator intent",
    status: "In progress",
    assignee: "Cursor",
    due: "Today",
  },
  {
    id: "t2",
    title: "Draft outline: AI Growth MCP landing page",
    status: "Queued",
    assignee: "Agent",
    due: "Tomorrow",
  },
  {
    id: "t3",
    title: "Refresh 3 decaying blog posts (CTR gap)",
    status: "Done",
    assignee: "Cursor",
    due: "Yesterday",
  },
  {
    id: "t4",
    title: "Produce LinkedIn video from keyword opportunities post",
    status: "Queued",
    assignee: "You",
    due: "Fri",
  },
] as const;

export const connectedIntegrations = [
  { name: "Google Search Console", status: "Connected", lastSync: "2m ago" },
  { name: "Google Trends", status: "Connected", lastSync: "12m ago" },
  { name: "PostHog", status: "Connected", lastSync: "5m ago" },
  { name: "Google Analytics", status: "Connected", lastSync: "8m ago" },
  { name: "GitHub", status: "Connected", lastSync: "1h ago" },
  { name: "LinkedIn", status: "Needs reconnect", lastSync: "3d ago" },
  { name: "X", status: "Connected", lastSync: "22m ago" },
  { name: "TikTok", status: "Not connected", lastSync: "—" },
] as const;

export const conversationExample = {
  user: "How do I grow my app this week?",
  assistant: [
    {
      title: "Improve these pages",
      items: [
        "/pricing — rewrite for calculator intent (CTR gap at pos 4.2)",
        "/docs/mcp-tools — add schema examples (high impressions, soft CTR)",
        "/blog/search-console-mcp — refresh title; CTR slipped 1.7pts",
      ],
    },
    {
      title: "Create these articles",
      items: [
        "“Give your AI growth context with MCP” — rising branded + category query",
        "“How Cursor uses Search Console via MCP” — strong social save signal",
      ],
    },
    {
      title: "Make these videos",
      items: [
        "90s walkthrough: asking Cursor for this week's growth tasks",
        "Screen share: get_keyword_opportunities() → shipped PR",
      ],
    },
    {
      title: "Build these landing pages",
      items: [
        "/ai-growth-mcp — capture breakout Trends query",
        "/integrations/posthog — intent match for analytics + agents",
      ],
    },
  ],
} as const;

export const navItems = [
  { href: "/dashboard", label: "Overview", icon: "LayoutDashboard" },
  { href: "/dashboard/growth", label: "Growth", icon: "TrendingUp" },
  { href: "/dashboard/seo", label: "SEO", icon: "Search" },
  { href: "/dashboard/content", label: "Content", icon: "FileText" },
  { href: "/dashboard/social", label: "Social", icon: "Share2" },
  { href: "/dashboard/tasks", label: "Tasks", icon: "ListTodo" },
  { href: "/dashboard/integrations", label: "Integrations", icon: "Plug" },
  { href: "/dashboard/mcp", label: "MCP", icon: "Terminal" },
  { href: "/dashboard/settings", label: "Settings", icon: "Settings" },
] as const;
