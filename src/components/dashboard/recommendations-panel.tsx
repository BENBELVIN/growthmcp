import { aiRecommendations } from "@/lib/data/dashboard";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function RecommendationsPanel() {
  return (
    <div className="rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold">AI Recommendations</h2>
          <p className="text-xs text-muted-foreground">
            Ranked by expected impact this week
          </p>
        </div>
        <Badge variant="secondary" className="bg-brand/15 text-brand">
          4 ready
        </Badge>
      </div>
      <div className="divide-y divide-border">
        {aiRecommendations.map((rec) => (
          <div key={rec.id} className="px-5 py-4">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                  rec.priority === "High"
                    ? "bg-brand/15 text-brand"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {rec.priority}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {rec.source}
              </span>
            </div>
            <p className="mt-2 text-sm font-medium leading-snug">{rec.title}</p>
            <p className="mt-1 text-xs text-success">{rec.impact}</p>
            <p className="mt-1.5 text-xs text-muted-foreground">{rec.action}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
