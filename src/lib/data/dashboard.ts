export const navItems = [
  { href: "/dashboard", label: "Overview", icon: "LayoutDashboard" },
  { href: "/dashboard/demand", label: "Demand", icon: "Radar" },
  { href: "/dashboard/supply", label: "Supply", icon: "Megaphone" },
  { href: "/dashboard/convert", label: "Convert", icon: "Target" },
  {
    href: "/dashboard/engine",
    label: "MCP & Integrations",
    icon: "Blocks",
  },
  { href: "/dashboard/settings", label: "Settings", icon: "Settings" },
] as const;

/** Canonical paths for the MCP & Integrations engine area. */
export const enginePaths = {
  root: "/dashboard/engine",
  mcp: "/dashboard/engine/mcp",
  integrations: "/dashboard/engine/integrations",
  gsc: "/dashboard/engine/integrations/gsc",
  bing: "/dashboard/engine/integrations/bing",
} as const;
