import Link from "next/link";
import { Logo } from "@/components/shared/logo";

const columns = [
  {
    title: "Product",
    links: [
      { href: "#features", label: "Features" },
      { href: "#integrations", label: "Integrations" },
      { href: "/dashboard", label: "Dashboard" },
      { href: "#developers", label: "MCP Tools" },
    ],
  },
  {
    title: "Developers",
    links: [
      { href: "/docs", label: "Documentation" },
      { href: "/docs#tools", label: "Tool reference" },
      { href: "/dashboard/mcp", label: "MCP setup" },
      { href: "https://modelcontextprotocol.io", label: "About MCP" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "#", label: "Changelog" },
      { href: "#", label: "Security" },
      { href: "#", label: "Status" },
      { href: "#", label: "Contact" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            Developer infrastructure that gives AI agents the growth context to
            improve your product.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <p className="mb-4 text-sm font-medium text-foreground">{col.title}</p>
            <ul className="space-y-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} GrowthMCP. All rights reserved.</p>
          <p>Built for agents that ship growth.</p>
        </div>
      </div>
    </footer>
  );
}
