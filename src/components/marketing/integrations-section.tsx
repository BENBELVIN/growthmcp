"use client";

import { motion } from "framer-motion";
import { integrations } from "@/lib/data/integrations";

export function IntegrationsSection() {
  return (
    <section id="integrations" className="scroll-mt-24 border-t border-border py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-brand">Integrations</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Your growth stack, agent-ready
          </h2>
          <p className="mt-4 text-muted-foreground">
            Connect the channels that matter. GrowthMCP turns them into structured
            context your coding agents can query.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3">
          {integrations.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
              className="group flex items-center gap-3 rounded-2xl border border-border bg-card/50 px-4 py-4 transition-colors hover:border-brand/30 hover:bg-card"
            >
              <span
                className="flex size-10 items-center justify-center rounded-xl text-xs font-semibold tracking-tight"
                style={{
                  background: `color-mix(in srgb, ${item.color} 18%, transparent)`,
                  color: item.color,
                  boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${item.color} 35%, transparent)`,
                }}
              >
                {item.short.slice(0, 2)}
              </span>
              <span className="text-sm font-medium text-foreground/90">
                {item.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
