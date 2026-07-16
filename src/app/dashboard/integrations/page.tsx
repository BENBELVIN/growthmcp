import type { Metadata } from "next";
import { DashboardHeader } from "@/components/dashboard/header";
import { connectedIntegrations } from "@/lib/data/dashboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Integrations" };

export default function IntegrationsPage() {
  return (
    <>
      <DashboardHeader title="Integrations" />
      <div className="flex-1 space-y-6 p-4 sm:p-6">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">Connected sources</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Data syncs into MCP tool responses automatically
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {connectedIntegrations.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between rounded-2xl border border-border bg-card p-4"
            >
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Last sync: {item.lastSync}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className={
                    item.status === "Connected"
                      ? "bg-success/15 text-success"
                      : item.status === "Needs reconnect"
                        ? "bg-warning/15 text-warning"
                        : "bg-muted text-muted-foreground"
                  }
                >
                  {item.status}
                </Badge>
                <Button size="sm" variant="outline">
                  {item.status === "Connected" ? "Manage" : "Connect"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
