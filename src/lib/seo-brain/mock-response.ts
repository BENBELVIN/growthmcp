import type { CommandCenterData } from "@/lib/gsc/command-center";

/** Placeholder until the AI API is wired — keeps the response UI realistic. */
export function buildMockSeoBrainResponse(
  query: string,
  command: CommandCenterData | null
): string {
  const q = query.toLowerCase();

  if (!command || command.priorities.length === 0) {
    return "I don't have enough search data yet. Connect Search Console and check back once impressions start coming in.";
  }

  const top = command.priorities.slice(0, 3);

  if (q.includes("content") || q.includes("create")) {
    if (command.recommendedContent.length > 0) {
      const ideas = command.recommendedContent.slice(0, 3).map((i) => i.title);
      return `Create pages for: ${ideas.join(", ")}. These topics have demand but weak coverage today.`;
    }
    const keyword = top.find((p) => p.kind === "keyword") ?? top[0];
    return `Start with "${keyword.label}" — ${keyword.opportunity}`;
  }

  if (q.includes("quick") || q.includes("week")) {
    const high = command.priorities.filter((p) => p.impact === "High").slice(0, 2);
    const picks = (high.length > 0 ? high : top.slice(0, 2))
      .map((p) => p.label)
      .join(" and ");
    return `This week's fastest wins: ${picks}.`;
  }

  if (q.includes("page") || q.includes("fix")) {
    const page = top.find((p) => p.kind === "page") ?? top[0];
    return `${page.label} — ${page.why}`;
  }

  const lead = top[0];
  const rest = top.slice(1, 3);
  const tail =
    rest.length > 0
      ? ` Then look at ${rest.map((p) => p.label).join(" and ")}.`
      : "";
  return `${lead.label} first — ${lead.opportunity}.${tail}`;
}
