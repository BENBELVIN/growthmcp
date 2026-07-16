"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardMockup } from "@/components/marketing/dashboard-mockup";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 glow-brand" />
      <div className="pointer-events-none absolute inset-0 grid-fade opacity-60" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pb-28 lg:pt-24">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-5 text-sm font-medium tracking-wide text-brand"
          >
            GrowthMCP
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="max-w-xl text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]"
          >
            Give your AI the context to grow your product.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="mt-6 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Connect your growth stack through MCP so AI agents can analyse your
            search, content and marketing signals and recommend the
            highest-impact improvements.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
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
              className="h-11 rounded-xl border-border bg-transparent px-5"
              asChild
            >
              <Link href="/docs">
                <BookOpen className="size-4" />
                View Documentation
              </Link>
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-sm text-muted-foreground"
          >
            Works with Cursor, Claude, and any MCP-compatible agent.
          </motion.p>
        </div>

        <DashboardMockup />
      </div>
    </section>
  );
}
