import Link from "next/link";
import { Logo } from "@/components/shared/logo";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/dashboard", label: "Overview" },
      { href: "/dashboard/keyword-opportunities", label: "Keyword Opportunities" },
      { href: "/dashboard/content-rankings", label: "Content & Rankings" },
      { href: "/dashboard/settings", label: "Settings" },
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
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            AI-powered SEO intelligence for indie hackers and SaaS founders.
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
          <p>© {new Date().getFullYear()} GrowthSEO. All rights reserved.</p>
          <p>Find opportunities. Improve rankings. Grow traffic.</p>
        </div>
      </div>
    </footer>
  );
}
