import {
  gscChanges,
  recentTasks,
  trendChanges,
} from "@/lib/data/dashboard";
import { Badge } from "@/components/ui/badge";

export function RecentChanges() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="rounded-2xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold">Recent Search Console changes</h2>
        </div>
        <div className="divide-y divide-border">
          {gscChanges.map((row) => (
            <div key={row.page + row.metric} className="px-5 py-3">
              <p className="truncate font-mono text-xs text-foreground">
                {row.page}
              </p>
              <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {row.metric}: {row.before} → {row.after}
                </span>
                <span
                  className={
                    row.change.startsWith("-") ? "text-destructive" : "text-success"
                  }
                >
                  {row.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold">Recent Trend changes</h2>
        </div>
        <div className="divide-y divide-border">
          {trendChanges.map((row) => (
            <div key={row.topic} className="px-5 py-3">
              <p className="text-xs font-medium">{row.topic}</p>
              <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {row.region} · interest {row.interest}
                </span>
                <span className="text-success">{row.change}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold">Recent AI Tasks</h2>
        </div>
        <div className="divide-y divide-border">
          {recentTasks.map((task) => (
            <div key={task.id} className="px-5 py-3">
              <p className="text-xs font-medium leading-snug">{task.title}</p>
              <div className="mt-2 flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className={
                    task.status === "Done"
                      ? "bg-success/15 text-success"
                      : task.status === "In progress"
                        ? "bg-brand/15 text-brand"
                        : "bg-muted text-muted-foreground"
                  }
                >
                  {task.status}
                </Badge>
                <span className="text-[11px] text-muted-foreground">
                  {task.assignee} · {task.due}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
