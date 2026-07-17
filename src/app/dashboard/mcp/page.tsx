import type { Metadata } from "next";
import { BentoCard } from "@/components/dashboard/bento-card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "MCP" };

export default function McpPage() {
  return (
    <div className="flex-1 p-4 sm:p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Connect to Cursor
          </h2>
          <p className="mt-3 text-muted-foreground">
            Add GrowthMCP as an MCP server so Cursor can pull growth context and
            recommend what to improve.
          </p>
        </div>

        <BentoCard className="p-6">
          <ol className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">1.</span> Open Cursor
              Settings → MCP
            </li>
            <li>
              <span className="font-medium text-foreground">2.</span> Add a new
              server and paste the config below
            </li>
            <li>
              <span className="font-medium text-foreground">3.</span> Restart
              Cursor, then ask:{" "}
              <span className="text-foreground">
                &quot;How do I grow my product this week?&quot;
              </span>
            </li>
          </ol>
        </BentoCard>

        <BentoCard className="overflow-hidden bg-[#0c0d10]">
          <div className="flex items-center justify-between border-b border-white/5 px-5 py-3">
            <span className="font-mono text-xs text-white/50">mcp.json</span>
            <Button
              size="sm"
              variant="outline"
              className="h-7 rounded-full border-white/10 bg-white/5 text-xs text-white hover:bg-white/10"
            >
              Copy
            </Button>
          </div>
          <pre className="overflow-x-auto p-5 font-mono text-xs leading-relaxed text-white/75">
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
        </BentoCard>

        <BentoCard className="p-6">
          <h3 className="text-sm font-semibold tracking-tight">
            Tools Cursor can call
          </h3>
          <ul className="mt-4 space-y-3 font-mono text-sm">
            <li className="text-primary">get_growth_tasks()</li>
            <li className="text-primary">get_search_console()</li>
            <li className="text-primary">get_keyword_opportunities()</li>
            <li className="text-primary">get_trending_topics()</li>
          </ul>
        </BentoCard>
      </div>
    </div>
  );
}
