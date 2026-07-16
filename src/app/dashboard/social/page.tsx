import type { Metadata } from "next";
import { DashboardHeader } from "@/components/dashboard/header";

export const metadata: Metadata = { title: "Social" };

const posts = [
  {
    platform: "LinkedIn",
    title: "Keyword opportunities → shipped PR workflow",
    metric: "9.4% engagement · 128 saves",
    action: "Turn into 90s video",
  },
  {
    platform: "X",
    title: "Thread: MCP tools for growth agents",
    metric: "4.2k impressions · 9.1% engagement",
    action: "Expand into newsletter issue",
  },
  {
    platform: "LinkedIn",
    title: "Why analytics dashboards fail agents",
    metric: "6.1% engagement · strong comments",
    action: "Reply with demo clip + CTA",
  },
];

export default function SocialPage() {
  return (
    <>
      <DashboardHeader title="Social" />
      <div className="flex-1 space-y-6 p-4 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Reach (7d)", value: "28.4k", detail: "+22% vs prior week" },
            { label: "Engagement rate", value: "7.8%", detail: "Above 30d baseline" },
            { label: "Content to ship", value: "3", detail: "High-signal formats" },
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
            <h2 className="text-sm font-semibold">Social performance</h2>
            <p className="text-xs text-muted-foreground">
              What to double down on this week
            </p>
          </div>
          <div className="divide-y divide-border">
            {posts.map((p) => (
              <div key={p.title} className="px-5 py-4">
                <p className="text-[11px] font-medium text-brand">{p.platform}</p>
                <p className="mt-1 text-sm font-medium">{p.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{p.metric}</p>
                <p className="mt-2 text-xs text-foreground/80">Next: {p.action}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
