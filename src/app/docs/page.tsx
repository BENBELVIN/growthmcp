import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { mcpTools } from "@/lib/data/integrations";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Set up GrowthMCP and connect your AI coding agents.",
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-sm font-medium text-brand">Documentation</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Get GrowthMCP running in minutes
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          GrowthMCP is an MCP server that exposes growth data as tools for AI
          coding agents like Cursor.
        </p>

        <section className="mt-12 space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">Quick start</h2>
          <ol className="list-decimal space-y-3 pl-5 text-sm leading-relaxed text-muted-foreground">
            <li>Create a workspace and connect Search Console, Trends, and analytics.</li>
            <li>
              Add GrowthMCP to your MCP client config (Cursor Settings → MCP).
            </li>
            <li>
              Ask your agent:{" "}
              <span className="text-foreground">
                &quot;What should I improve this week?&quot;
              </span>
            </li>
          </ol>
          <pre className="overflow-x-auto rounded-2xl border border-border bg-card p-4 font-mono text-xs leading-relaxed text-muted-foreground">
{`{
  "mcpServers": {
    "growthmcp": {
      "url": "https://mcp.growthmcp.dev/sse",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}`}
          </pre>
        </section>

        <section id="tools" className="mt-12 scroll-mt-24 space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">MCP tools</h2>
          <div className="space-y-3">
            {mcpTools.map((tool) => (
              <div
                key={tool.name}
                className="rounded-xl border border-border bg-card/50 p-4"
              >
                <p className="font-mono text-sm text-brand">{tool.name}()</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {tool.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-12">
          <Button className="bg-brand text-brand-foreground hover:bg-brand/90" asChild>
            <Link href="/dashboard">Open dashboard</Link>
          </Button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
