"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="border-t border-border py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border border-border bg-card px-8 py-16 text-center sm:px-12"
        >
          <div className="pointer-events-none absolute inset-0 glow-brand opacity-70" />
          <div className="relative">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Start building with GrowthMCP
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              Connect your stack, install the MCP server, and give your agents
              the growth context they&apos;ve been missing.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                size="lg"
                className="h-11 rounded-xl bg-brand px-5 text-brand-foreground hover:bg-brand/90"
                asChild
              >
                <Link href="/dashboard">
                  Get Started
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-11 rounded-xl"
                asChild
              >
                <Link href="/docs">Read the docs</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
