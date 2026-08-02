import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Get started with growseo and connect your search data sources.",
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-sm font-medium text-brand">Documentation</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Get started with growseo
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Connect your search data, find keyword opportunities, and improve
          rankings from one SEO dashboard.
        </p>

        <section className="mt-12 space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">Quick start</h2>
          <ol className="list-decimal space-y-3 pl-5 text-sm leading-relaxed text-muted-foreground">
            <li>Sign in and add your website as a project.</li>
            <li>
              Connect Google Search Console and Bing Webmaster in Settings.
            </li>
            <li>
              Sync Google Trends from Keyword Opportunities to surface content
              ideas.
            </li>
            <li>
              Check Overview for ranked actions: what to create, update, or
              target next.
            </li>
          </ol>
        </section>

        <section className="mt-12 space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">Data sources</h2>
          <ul className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            <li>
              <strong className="text-foreground">Google Search Console</strong>
              : clicks, impressions, queries, and page performance.
            </li>
            <li>
              <strong className="text-foreground">Bing Webmaster</strong>: Bing
              visibility and early ranking signals.
            </li>
            <li>
              <strong className="text-foreground">Google Trends</strong>: rising
              topics and keyword demand for content planning.
            </li>
          </ul>
        </section>

        <div className="mt-12 flex flex-wrap gap-3">
          <Button className="bg-brand text-brand-foreground hover:bg-brand/90" asChild>
            <Link href="/login">Open dashboard</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/blog">Read the blog</Link>
          </Button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
