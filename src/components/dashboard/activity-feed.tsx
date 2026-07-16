import { activityFeed } from "@/lib/data/dashboard";
import { cn } from "@/lib/utils";

const typeStyles = {
  gsc: "bg-chart-1/20 text-chart-1",
  trend: "bg-chart-2/20 text-chart-2",
  task: "bg-chart-3/20 text-chart-3",
  social: "bg-chart-5/20 text-chart-5",
};

const typeLabel = {
  gsc: "GSC",
  trend: "Trend",
  task: "Task",
  social: "Social",
};

export function ActivityFeed() {
  return (
    <div className="rounded-2xl border border-border bg-card">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-sm font-semibold">Activity Feed</h2>
        <p className="text-xs text-muted-foreground">
          Search, trends, and agent activity
        </p>
      </div>
      <div className="divide-y divide-border">
        {activityFeed.map((item) => (
          <div key={item.id} className="flex gap-3 px-5 py-4">
            <span
              className={cn(
                "mt-0.5 h-fit rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                typeStyles[item.type]
              )}
            >
              {typeLabel[item.type]}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium">{item.title}</p>
                <span className="shrink-0 text-[11px] text-muted-foreground">
                  {item.time}
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
