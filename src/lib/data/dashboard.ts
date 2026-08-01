export const navItems = [
  { href: "/dashboard", label: "Overview", icon: "LayoutDashboard" },
  {
    href: "/dashboard/keyword-opportunities",
    label: "Keyword Opportunities",
    icon: "Radar",
  },
  {
    href: "/dashboard/content-rankings",
    label: "Content & Rankings",
    icon: "FileText",
  },
  { href: "/dashboard/settings", label: "Settings", icon: "Settings" },
] as const;

/** Integration setup paths under Settings. */
export const settingsPaths = {
  root: "/dashboard/settings",
  gsc: "/dashboard/settings/integrations/gsc",
  bing: "/dashboard/settings/integrations/bing",
} as const;
