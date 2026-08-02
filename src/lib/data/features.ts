import type { LucideIcon } from "lucide-react";
import {
  Brain,
  Search,
  KeyRound,
  FileText,
  ListTodo,
  Share2,
  TrendingUp,
  Wrench,
  Code2,
} from "lucide-react";

export type Feature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const features: Feature[] = [
  {
    title: "AI Growth Insights",
    description:
      "Cross-channel signals synthesized into clear, ranked recommendations your agents can act on.",
    icon: Brain,
  },
  {
    title: "Search Console Analysis",
    description:
      "Surface CTR gaps, decaying pages, and query clusters without leaving your coding environment.",
    icon: Search,
  },
  {
    title: "Keyword Opportunities",
    description:
      "Find near-win keywords and map them to content or landing page work your agent can ship.",
    icon: KeyRound,
  },
  {
    title: "Content Suggestions",
    description:
      "Briefs for articles, updates, and rewrites grounded in what already converts for you.",
    icon: FileText,
  },
  {
    title: "Growth Tasks",
    description:
      "A living backlog of highest-impact improvements, ready to hand to Cursor or any MCP client.",
    icon: ListTodo,
  },
  {
    title: "Social Performance",
    description:
      "See which formats and topics move attention so agents can propose the next post or clip.",
    icon: Share2,
  },
  {
    title: "Trend Detection",
    description:
      "Catch rising queries and topics early—before competitors flood the SERPs.",
    icon: TrendingUp,
  },
  {
    title: "MCP Tools",
    description:
      "First-class Model Context Protocol tools designed for agents, not dashboards.",
    icon: Wrench,
  },
  {
    title: "Developer-first API",
    description:
      "Typed tools, predictable schemas, and auth that fits how modern AI infrastructure works.",
    icon: Code2,
  },
];

export const howItWorks = [
  {
    step: 1,
    title: "Connect your data",
    description:
      "Link Search Console, Bing, and Trends in minutes. growseo turns search data into clear SEO actions.",
  },
  {
    step: 2,
    title: "growseo analyses your search data",
    description:
      "We score keyword and ranking opportunities, then show you what to create, update, or target next.",
  },
  {
    step: 3,
    title: "Your AI agent knows exactly what to improve",
    description:
      "Ask Cursor what to ship this week. It gets real growth context and returns concrete pages, posts, and experiments.",
  },
] as const;
