import type { Metadata } from "next";
import { DashboardHeader } from "@/components/dashboard/header";
import { overviewMetrics, trendChanges } from "@/lib/data/dashboard";

export const metadata: Metadata = { title: "Growth" };

export default function GrowthPage() {
  return (
    <>
      <DashboardHeader title="Growth" />
      <div className="flex-1 space-y-6 p-4 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {overviewMetrics.slice(0, 3).map((m) => (
            <div key={m.id} className="rounded-2xl border border-border bg-card p-5">
              <p className="text-sm text-muted-foreground">{m.label}</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight">{m.value}</p>
              <p className="mt-1 text-xs text-success">{m.delta}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">Momentum this week</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Composite of search visibility, content freshness, and social engagement
          </p>
          <div className="mt-6 flex h-40 items-end gap-2">
            {[42, 48, 45, 55, 52, 61, 68, 64, 72, 70, 76, 78].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-md bg-brand/25"
                style={{ height: `${h}%` }}
              >
                <div
                  className="w-full rounded-t-md bg-brand"
                  style={{ height: "40%" }}
                />
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between text-[11px] text-muted-foreground">
            <span>12 weeks ago</span>
            <span>This week</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold">Breakout topics driving score</h2>
          </div>
          <div className="divide-y divide-border">
            {trendChanges.map((t) => (
              <div
                key={t.topic}
                className="flex items-center justify-between px-5 py-3"
              >
                <div>
                  <p className="text-sm font-medium">{t.topic}</p>
                  <p className="text-xs text-muted-foreground">{t.region}</p>
                </div>
                <span className="text-sm text-success">{t.change}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
