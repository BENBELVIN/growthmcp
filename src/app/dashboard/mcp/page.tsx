import type { Metadata } from "next";
import { DashboardHeader } from "@/components/dashboard/header";
import { mcpTools } from "@/lib/data/integrations";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "MCP" };

export default function McpPage() {
  return (
    <>
      <DashboardHeader title="MCP" />
      <div className="flex-1 space-y-6 p-4 sm:p-6">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold">MCP server endpoint</h2>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                https://mcp.growthmcp.dev/sse
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Status: online · 4 tools exposed · last invocation 2m ago
              </p>
            </div>
            <Button size="sm" className="bg-brand text-brand-foreground hover:bg-brand/90">
              Copy config
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-[#0c0d10]">
          <div className="border-b border-white/5 px-5 py-3 font-mono text-xs text-white/50">
            Cursor MCP config
          </div>
          <pre className="overflow-x-auto p-5 font-mono text-xs leading-relaxed text-white/70">
{`{
  "mcpServers": {
    "growthmcp": {
      "url": "https://mcp.growthmcp.dev/sse",
      "headers": {
        "Authorization": "Bearer grm_live_••••••••"
      }
    }
  }
}`}
          </pre>
        </div>

        <div className="rounded-2xl border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold">Available tools</h2>
          </div>
          <div className="divide-y divide-border">
            {mcpTools.map((tool) => (
              <div key={tool.name} className="px-5 py-4">
                <p className="font-mono text-sm text-brand">{tool.name}()</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {tool.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
