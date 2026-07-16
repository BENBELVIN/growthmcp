"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { howItWorks } from "@/lib/data/features";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 border-t border-border py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-brand">How it works</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            From data to decisions in three steps
          </h2>
          <p className="mt-4 text-muted-foreground">
            GrowthMCP sits between your growth sources and your AI agents—so
            recommendations are grounded, not guessed.
          </p>
        </div>

        <div className="mx-auto mt-16 flex max-w-3xl flex-col items-center gap-4">
          {howItWorks.map((step, i) => (
            <div key={step.step} className="flex w-full flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
                className="w-full rounded-2xl border border-border bg-card/60 p-6 sm:p-8"
              >
                <div className="flex items-start gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand/15 font-mono text-sm font-semibold text-brand">
                    {String(step.step).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
              {i < howItWorks.length - 1 && (
                <ArrowDown className="my-2 size-5 text-muted-foreground/50" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
