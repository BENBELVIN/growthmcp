import type { Metadata } from "next";
import { DashboardHeader } from "@/components/dashboard/header";

export const metadata: Metadata = { title: "Content" };

const briefs = [
  {
    title: "Give your AI growth context with MCP",
    type: "Article",
    reason: "Rising branded + category query cluster",
    status: "Ready to draft",
  },
  {
    title: "How Cursor uses Search Console via MCP",
    type: "Article",
    reason: "High social saves on related thread",
    status: "Outline ready",
  },
  {
    title: "Refresh: Search Console MCP walkthrough",
    type: "Update",
    reason: "CTR slipped 1.7pts at stable position",
    status: "Needs refresh",
  },
  {
    title: "PostHog + GrowthMCP integration guide",
    type: "Landing + docs",
    reason: "Intent match for analytics + agents",
    status: "Queued",
  },
];

export default function ContentPage() {
  return (
    <>
      <DashboardHeader title="Content" />
      <div className="flex-1 space-y-6 p-4 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Content Health", value: "81", detail: "2 pages need refresh" },
            { label: "Suggested briefs", value: "4", detail: "Based on GSC + Trends" },
            { label: "Published (30d)", value: "6", detail: "Avg time-to-index 2.1d" },
          ].map((m) => (
            <div key={m.label} className="rounded-2xl border border-border bg-card p-5">
              <p className="text-sm text-muted-foreground">{m.label}</p>
              <p className="mt-2 text-3xl font-semibold">{m.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{m.detail}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold">Content suggestions</h2>
            <p className="text-xs text-muted-foreground">
              Hand these to your agent with get_growth_tasks()
            </p>
          </div>
          <div className="divide-y divide-border">
            {briefs.map((b) => (
              <div key={b.title} className="px-5 py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                    {b.type}
                  </span>
                  <span className="rounded-md bg-brand/15 px-1.5 py-0.5 text-[10px] text-brand">
                    {b.status}
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium">{b.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{b.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
