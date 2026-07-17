"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

const sourceLogos = [
  {
    name: "Google Search Console",
    src: "/logos/gsc.svg",
  },
  {
    name: "Cursor",
    src: "/logos/cursor.svg",
  },
  {
    name: "Google Trends",
    src: "/logos/trends.png",
  },
  {
    name: "Claude",
    src: "/logos/claude.svg",
  },
];

function BentoCard({
  className,
  children,
  delay = 0,
}: {
  className?: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease }}
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[720px] bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(20,160,140,0.14),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 grid-fade-light" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl pt-10 text-center sm:pt-16">
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.05]"
          >
            Give Your AI the Context to Grow Your Product
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease }}
            className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            GrowthMCP connects your search, content and marketing signals through
            MCP so AI agents can analyse your growth stack and recommend the
            highest-impact improvements—right inside your editor.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16, ease }}
            className="mt-9 flex justify-center"
          >
            <Button
              className="h-12 rounded-full bg-primary px-7 text-[15px] font-medium text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
              asChild
            >
              <Link href="/login">
                Get Early Access
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </motion.div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 pb-24 md:grid-cols-12">
          {/* Platform agnostic */}
          <BentoCard delay={0.2} className="p-6 md:col-span-3">
            <div className="flex flex-wrap gap-2">
              {sourceLogos.map((logo) => (
                <span
                  key={logo.name}
                  title={logo.name}
                  className="flex size-10 items-center justify-center rounded-xl bg-white p-1.5 shadow-sm ring-1 ring-border"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo.src}
                    alt={logo.name}
                    width={28}
                    height={28}
                    className="size-7 object-contain"
                  />
                </span>
              ))}
            </div>
            <h3 className="mt-6 text-xl font-semibold tracking-tight">
              Platform
              <br />
              Agnostic
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Give any MCP-compatible agent native access to your growth data.
            </p>
          </BentoCard>

          {/* Feature image */}
          <BentoCard delay={0.26} className="min-h-[220px] md:col-span-6">
            <Image
              src="/iridescent-growth.png"
              alt="Iridescent growth signals"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </BentoCard>

          {/* Stat 1 */}
          <BentoCard delay={0.32} className="p-6 md:col-span-3">
            <p className="text-6xl font-semibold tracking-tighter text-foreground">
              40%
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Average lift in organic click-through after acting on GrowthMCP
              recommendations.
            </p>
          </BentoCard>

          {/* Stat 2 */}
          <BentoCard delay={0.36} className="p-6 md:col-span-3">
            <p className="text-6xl font-semibold tracking-tighter text-foreground">
              5×
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              More growth experiments shipped per sprint with AI agents in the
              loop.
            </p>
          </BentoCard>

          {/* Search Console analysis */}
          <BentoCard delay={0.4} className="flex flex-col p-6 md:col-span-3">
            <h3 className="text-xl font-semibold tracking-tight">
              Search Console
              <br />
              Analysis
            </h3>
            <div className="mt-5 overflow-hidden rounded-xl bg-[#0c0d10] p-3 font-mono text-[11px] leading-relaxed text-white/70 shadow-inner">
              <p className="text-emerald-400">→ get_search_console()</p>
              <p className="mt-1 text-white/50">page /pricing</p>
              <p className="flex items-center gap-1.5 text-amber-400">
                <TriangleAlert className="size-3" />
                CTR -18% at pos 4.2
              </p>
            </div>
          </BentoCard>

          {/* AI recommendations illustration */}
          <BentoCard delay={0.44} className="p-6 md:col-span-6">
            <h3 className="text-xl font-semibold tracking-tight">
              AI-Powered Recommendations
            </h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              Turn raw growth signals into ranked, ready-to-ship tasks your agent
              can pick up and execute.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Sparkles className="size-4" />
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
              <div className="hidden gap-2 sm:flex">
                {["Refresh /pricing", "Ship /ai-growth", "New brief"].map(
                  (task, i) => (
                    <span
                      key={task}
                      className={cn(
                        "rounded-full border border-border px-3 py-1.5 text-xs font-medium",
                        i === 0
                          ? "bg-brand/10 text-brand"
                          : "bg-white text-muted-foreground"
                      )}
                    >
                      {task}
                    </span>
                  )
                )}
              </div>
            </div>
          </BentoCard>
        </div>
      </div>
    </section>
  );
}
