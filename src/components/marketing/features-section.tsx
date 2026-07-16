"use client";

import { motion } from "framer-motion";
import { features } from "@/lib/data/features";

export function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-24 border-t border-border py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-brand">Features</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            The operating system for AI-led growth
          </h2>
          <p className="mt-4 text-muted-foreground">
            Everything an agent needs to diagnose, prioritize, and improve your
            product&apos;s growth—without another bloated analytics suite.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: (i % 3) * 0.05, duration: 0.4 }}
              className="rounded-2xl border border-border bg-card/50 p-6 transition-colors hover:border-brand/25 hover:bg-card"
            >
              <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <feature.icon className="size-5" />
              </div>
              <h3 className="text-base font-semibold tracking-tight">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
