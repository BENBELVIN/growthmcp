import type { Metadata } from "next";
import { DashboardHeader } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <>
      <DashboardHeader title="Settings" />
      <div className="flex-1 space-y-6 p-4 sm:p-6">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">Workspace</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs text-muted-foreground">Name</label>
              <p className="mt-1 rounded-lg border border-border bg-background px-3 py-2 text-sm">
                GLPpal Marketing
              </p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Primary domain</label>
              <p className="mt-1 rounded-lg border border-border bg-background px-3 py-2 text-sm">
                glppal.app
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">API keys</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Used by MCP clients to authenticate tool calls
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-3">
            <code className="font-mono text-xs text-muted-foreground">
              grm_live_••••••••••••4f2a
            </code>
            <Button size="sm" variant="outline">
              Rotate
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">Notifications</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {[
              "High-impact opportunities",
              "CTR drops on ranking pages",
              "Breakout Trends topics",
              "MCP tool errors",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
              >
                <span>{item}</span>
                <span className="text-xs text-success">On</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
