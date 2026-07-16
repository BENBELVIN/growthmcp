"use client";

import { motion } from "framer-motion";
import { mcpTools } from "@/lib/data/integrations";

export function DeveloperSection() {
  return (
    <section id="developers" className="scroll-mt-24 border-t border-border py-24">
      <div className="mx-auto grid max-w-6xl items-start gap-12 px-6 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="text-sm font-medium text-brand">Developers</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            MCP is how agents get real context
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Model Context Protocol lets AI coding tools call external systems
            safely. GrowthMCP exposes growth data as typed tools—so Cursor
            doesn&apos;t invent opportunities; it retrieves them.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Point your MCP client at GrowthMCP, authenticate your workspace, and
            tools like{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
              get_growth_tasks()
            </code>{" "}
            become part of the agent&apos;s toolkit.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-hidden rounded-2xl border border-border bg-[#0c0d10] shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
            <span className="font-mono text-xs text-white/50">mcp.json</span>
            <span className="rounded-md bg-brand/20 px-2 py-0.5 font-mono text-[10px] text-brand">
              tools
            </span>
          </div>
          <div className="space-y-4 p-4 font-mono text-[13px] leading-relaxed sm:p-5">
            {mcpTools.map((tool, i) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, x: 8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <p className="text-brand">
                  {tool.name}
                  <span className="text-white/40">()</span>
                </p>
                <p className="mt-1 text-white/45">{tool.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
