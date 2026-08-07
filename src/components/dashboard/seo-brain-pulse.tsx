import type { SeoBrainPulseContent } from "@/lib/seo-brain/pulse";
import { cn } from "@/lib/utils";

function deltaClass(tone?: "positive" | "negative" | "neutral") {
  if (tone === "positive") return "text-emerald-600";
  if (tone === "negative") return "text-rose-600";
  return "text-muted-foreground";
}

export function SeoBrainPulse({
  content,
  muted = false,
}: {
  content: SeoBrainPulseContent;
  muted?: boolean;
}) {
  if (content.type === "message") {
    return (
      <p
        className={cn(
          "min-w-0 text-sm leading-relaxed",
          muted ? "text-muted-foreground" : "text-foreground"
        )}
      >
        {content.text}
      </p>
    );
  }

  return (
    <p
      className={cn(
        "min-w-0 flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 text-sm leading-relaxed",
        muted ? "text-muted-foreground" : "text-foreground"
      )}
    >
      <span className={muted ? "text-muted-foreground" : "text-muted-foreground"}>
        {content.period}:
      </span>
      {content.segments.map((segment, index) => (
        <span key={`${segment.label}-${index}`} className="inline-flex items-baseline gap-1">
          {index > 0 && (
            <span className="text-muted-foreground/60" aria-hidden>
              ·
            </span>
          )}
          <span className="text-lg font-semibold tracking-tight tabular-nums text-foreground sm:text-xl">
            {segment.value}
          </span>
          <span className={muted ? "text-muted-foreground" : "text-foreground/80"}>
            {segment.label}
          </span>
          {segment.delta && (
            <span
              className={cn(
                "text-xs font-medium tabular-nums sm:text-sm",
                deltaClass(segment.deltaTone)
              )}
            >
              ({segment.delta})
            </span>
          )}
        </span>
      ))}
    </p>
  );
}
