import { formatCompact } from "@/lib/format/numbers";
import type { CommandCenterData, SeoMetric } from "@/lib/gsc/command-center";

export type PulseSegment = {
  value: string;
  label: string;
  delta?: string;
  deltaTone?: SeoMetric["tone"];
};

export type SeoBrainPulseContent =
  | { type: "message"; text: string }
  | { type: "stats"; period: string; segments: PulseSegment[] };

export function buildSeoBrainPulseContent(
  _projectName: string,
  command: CommandCenterData | null,
  connected: boolean
): SeoBrainPulseContent {
  if (!connected || !command) {
    return {
      type: "message",
      text: "Connect Search Console so your SEO brain can read what's happening on your site.",
    };
  }

  const clicks = command.seoMetrics.find((m) => m.id === "clicks");
  const position = command.seoMetrics.find((m) => m.id === "position");
  const segments: PulseSegment[] = [];

  if (command.totalImpressions !== null) {
    const segment: PulseSegment = {
      value: formatCompact(command.totalImpressions),
      label: "impressions",
    };
    if (
      command.impressionsDeltaPct !== null &&
      command.impressionsDeltaPct !== undefined &&
      Math.abs(command.impressionsDeltaPct) >= 1
    ) {
      const sign = command.impressionsDeltaPct > 0 ? "+" : "";
      segment.delta = `${sign}${Math.round(command.impressionsDeltaPct)}%`;
      segment.deltaTone =
        command.impressionsDeltaPct > 2
          ? "positive"
          : command.impressionsDeltaPct < -2
            ? "negative"
            : "neutral";
    }
    segments.push(segment);
  }

  if (clicks && clicks.value !== "—") {
    segments.push({
      value: clicks.value,
      label: "clicks",
      delta: clicks.delta !== "—" ? clicks.delta : undefined,
      deltaTone: clicks.tone,
    });
  }

  if (position && position.value !== "—") {
    segments.push({
      value: position.value,
      label: "avg position",
      delta: position.delta,
      deltaTone: position.tone,
    });
  }

  if (segments.length === 0) {
    return {
      type: "message",
      text: "Your search data is connected — ask me what to create or fix next.",
    };
  }

  return { type: "stats", period: "Last 3 months", segments };
}

export function buildFollowUpSuggestions(
  command: CommandCenterData | null
): string[] {
  if (!command) {
    return [
      "What should I do next?",
      "Quick wins this week",
      "What content should I create?",
    ];
  }

  const suggestions = ["What should I do next?"];

  if (command.priorities.some((p) => p.kind === "page")) {
    suggestions.push("Which pages need fixing?");
  } else {
    suggestions.push("Quick wins this week");
  }

  if (command.recommendedContent.length > 0) {
    suggestions.push("What content should I create?");
  } else if (command.priorities.some((p) => p.source === "trends")) {
    suggestions.push("Any keyword gaps to target?");
  } else {
    suggestions.push("Why am I not getting clicks?");
  }

  return suggestions.slice(0, 3);
}
