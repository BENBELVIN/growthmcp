import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { overviewMetrics } from "@/lib/data/dashboard";
import { cn } from "@/lib/utils";

export function OverviewCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {overviewMetrics.map((metric) => {
        const TrendIcon =
          metric.trend === "up"
            ? ArrowUpRight
            : metric.trend === "neutral"
              ? Minus
              : ArrowDownRight;

        return (
          <div
            key={metric.id}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <p className="text-sm text-muted-foreground">{metric.label}</p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-semibold tracking-tight">
                {metric.value}
              </span>
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 text-xs",
                  metric.trend === "up"
                    ? "text-success"
                    : metric.trend === "neutral"
                      ? "text-muted-foreground"
                      : "text-destructive"
                )}
              >
                <TrendIcon className="size-3.5" />
                {metric.delta}
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {metric.detail}
            </p>
          </div>
        );
      })}
    </div>
  );
}
