import type { Metadata } from "next";
import { DashboardHeader } from "@/components/dashboard/header";
import { gscChanges } from "@/lib/data/dashboard";

export const metadata: Metadata = { title: "SEO" };

const queries = [
  { query: "mcp growth server", clicks: 312, impressions: 8400, ctr: "3.7%", pos: "8.2" },
  { query: "cursor search console", clicks: 188, impressions: 4200, ctr: "4.5%", pos: "6.1" },
  { query: "ai growth context", clicks: 96, impressions: 6100, ctr: "1.6%", pos: "14.4" },
  { query: "posthog mcp", clicks: 74, impressions: 2900, ctr: "2.6%", pos: "11.0" },
  { query: "keyword opportunities agent", clicks: 51, impressions: 1800, ctr: "2.8%", pos: "9.7" },
];

export default function SeoPage() {
  return (
    <>
      <DashboardHeader title="SEO" />
      <div className="flex-1 space-y-6 p-4 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            { label: "Clicks (7d)", value: "4,812", delta: "+9%" },
            { label: "Impressions", value: "128k", delta: "+14%" },
            { label: "Avg CTR", value: "3.8%", delta: "-0.2%" },
            { label: "Avg position", value: "18.4", delta: "+0.6" },
          ].map((m) => (
            <div key={m.label} className="rounded-2xl border border-border bg-card p-5">
              <p className="text-sm text-muted-foreground">{m.label}</p>
              <p className="mt-2 text-2xl font-semibold">{m.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{m.delta}</p>
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold">Top queries</h2>
            <p className="text-xs text-muted-foreground">
              From Google Search Console · last 28 days
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-border text-xs text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-medium">Query</th>
                  <th className="px-5 py-3 font-medium">Clicks</th>
                  <th className="px-5 py-3 font-medium">Impressions</th>
                  <th className="px-5 py-3 font-medium">CTR</th>
                  <th className="px-5 py-3 font-medium">Position</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {queries.map((q) => (
                  <tr key={q.query}>
                    <td className="px-5 py-3 font-medium">{q.query}</td>
                    <td className="px-5 py-3 text-muted-foreground">{q.clicks}</td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {q.impressions.toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{q.ctr}</td>
                    <td className="px-5 py-3 text-muted-foreground">{q.pos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold">Page-level movements</h2>
          </div>
          <div className="divide-y divide-border">
            {gscChanges.map((row) => (
              <div
                key={row.page}
                className="flex items-center justify-between px-5 py-3"
              >
                <div>
                  <p className="font-mono text-xs">{row.page}</p>
                  <p className="text-xs text-muted-foreground">{row.metric}</p>
                </div>
                <span
                  className={
                    row.change.startsWith("-") ? "text-destructive" : "text-success"
                  }
                >
                  {row.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
