import { formatCompact } from "@/lib/format/numbers";
import { cn } from "@/lib/utils";

const GOAL = 100_000;

const MILESTONES = [
  { value: 1_000, label: "1K" },
  { value: 10_000, label: "10K" },
  { value: 25_000, label: "25K" },
  { value: 50_000, label: "50K" },
  { value: GOAL, label: "100K" },
] as const;

function progressPct(impressions: number) {
  return Math.min(100, (impressions / GOAL) * 100);
}

type ImpressionsGoalCardProps = {
  impressions: number | null;
  deltaPct?: number | null;
  compact?: boolean;
  className?: string;
};

export function ImpressionsGoalCard({
  impressions,
  deltaPct,
  compact = false,
  className,
}: ImpressionsGoalCardProps) {
  const hasData = impressions !== null && impressions >= 0;
  const current = impressions ?? 0;
  const progress = progressPct(current);

  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-3xl border border-border bg-card shadow-sm transition-[padding] duration-300",
        compact ? "p-4" : "p-5 sm:p-6",
        className
      )}
    >
      <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
        Overall impressions
      </p>
      {!compact && (
        <p className="mt-0.5 text-xs text-muted-foreground">Last 3 months</p>
      )}

      {hasData ? (
        <div
          className={cn(
            "flex flex-nowrap items-baseline gap-2.5",
            compact ? "mt-2" : "mt-3"
          )}
        >
          <p
            className={cn(
              "shrink-0 font-semibold tracking-tighter text-foreground tabular-nums",
              compact
                ? "text-3xl sm:text-4xl"
                : "text-5xl sm:text-6xl"
            )}
          >
            {formatCompact(current)}
          </p>
          {deltaPct !== null && deltaPct !== undefined && (
            <span
              className={cn(
                "shrink-0 font-semibold tracking-tight tabular-nums",
                compact ? "text-base sm:text-lg" : "text-lg sm:text-xl",
                deltaPct > 2
                  ? "text-emerald-600"
                  : deltaPct < -2
                    ? "text-rose-600"
                    : "text-muted-foreground"
              )}
            >
              {deltaPct > 0 ? "+" : ""}
              {deltaPct.toFixed(0)}%
            </span>
          )}
        </div>
      ) : (
        <p
          className={cn(
            "font-semibold tracking-tighter text-muted-foreground/40",
            compact ? "mt-2 text-3xl sm:text-4xl" : "mt-3 text-5xl sm:text-6xl"
          )}
        >
          —
        </p>
      )}

      <div className={cn("mt-auto", compact ? "pt-3" : "pt-6")}>
        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-brand transition-[width] duration-700 ease-out"
            style={{ width: `${hasData ? progress : 0}%` }}
          />
        </div>
        {!compact && (
          <div className="relative mt-2.5 h-3.5">
            {MILESTONES.map((m) => {
              const reached = hasData && current >= m.value;
              const pos = (m.value / GOAL) * 100;

              return (
                <span
                  key={m.label}
                  className={cn(
                    "absolute -translate-x-1/2 text-[9px] tabular-nums sm:text-[10px]",
                    reached ? "font-medium text-brand" : "text-muted-foreground"
                  )}
                  style={{ left: `${pos}%` }}
                >
                  {m.label}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
