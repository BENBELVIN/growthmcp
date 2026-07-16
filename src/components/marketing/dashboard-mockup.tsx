"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  FileText,
  ListTodo,
  Search,
  TrendingUp,
} from "lucide-react";

const cards = [
  { label: "Growth Score", value: "78", delta: "+6", icon: TrendingUp },
  { label: "Opportunities", value: "12", delta: "Today", icon: ListTodo },
  { label: "Visibility", value: "64%", delta: "+2.1%", icon: Search },
  { label: "Content Health", value: "81", delta: "Healthy", icon: FileText },
];

const tasks = [
  { title: "Refresh /pricing CTR gap", tag: "High" },
  { title: "Ship /ai-growth-mcp page", tag: "High" },
  { title: "LinkedIn video from thread", tag: "Med" },
];

export function DashboardMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      <div className="absolute -inset-8 rounded-[2rem] bg-brand/10 blur-3xl" />
      <div className="gradient-border relative overflow-hidden rounded-2xl bg-card/80 shadow-2xl shadow-black/40 backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-white/15" />
            <span className="size-2.5 rounded-full bg-white/15" />
            <span className="size-2.5 rounded-full bg-white/15" />
          </div>
          <div className="rounded-md bg-muted px-3 py-1 font-mono text-[11px] text-muted-foreground">
            app.growthmcp.dev/overview
          </div>
          <ArrowUpRight className="size-3.5 text-muted-foreground" />
        </div>

        <div className="grid gap-4 p-4 sm:p-5">
          <div className="grid grid-cols-2 gap-3">
            {cards.map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.06 }}
                className="rounded-xl border border-border bg-background/60 p-3"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">
                    {card.label}
                  </span>
                  <card.icon className="size-3.5 text-brand" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-semibold tracking-tight">
                    {card.value}
                  </span>
                  <span className="text-[11px] text-success">{card.delta}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="rounded-xl border border-border bg-background/60 p-3">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-medium">AI Recommendations</p>
              <span className="rounded-full bg-brand/15 px-2 py-0.5 text-[10px] text-brand">
                Live
              </span>
            </div>
            <div className="space-y-2">
              {tasks.map((task, i) => (
                <motion.div
                  key={task.title}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 + i * 0.08 }}
                  className="flex items-center justify-between rounded-lg border border-border/80 bg-card/50 px-3 py-2"
                >
                  <span className="truncate text-xs text-foreground/90">
                    {task.title}
                  </span>
                  <span className="ml-2 shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                    {task.tag}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background/60 p-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
            <p className="text-brand">→ get_growth_tasks()</p>
            <p className="mt-1 opacity-80">
              returned 12 opportunities · 3 high impact
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
