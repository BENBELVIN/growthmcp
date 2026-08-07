import Link from "next/link";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/#product", label: "How it works" },
      { href: "/dashboard", label: "Dashboard" },
      { href: "/#waitlist", label: "Get Early Access" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/blog", label: "Blog" },
      { href: "/blog/find-keywords-for-your-saas", label: "Keyword research" },
      { href: "/blog/pages-stuck-on-page-two", label: "Page 2 rankings" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4">
          <Link href="/" className="inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logos/growseo.png"
              alt="growseo"
              width={152}
              height={32}
              className="h-8 w-auto object-contain"
            />
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            Grow your product with organic traffic.
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
          <p>© {new Date().getFullYear()} growseo. All rights reserved.</p>
          <p>Find opportunities. Improve rankings. Grow traffic.</p>
        </div>
      </div>
    </footer>
  );
}
