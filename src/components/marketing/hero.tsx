"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Search, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

const sourceLogos = [
  {
    name: "Google Search Console",
    src: "/logos/gsc.svg",
  },
  {
    name: "Google Trends",
    src: "/logos/trends.png",
  },
  {
    name: "Bing Webmaster",
    src: "/logos/bing.svg",
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
            Grow your product with organic traffic.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            growseo shows you exactly what people are searching for, which pages
            to create, and what to improve, so you can get more visitors
            without wasting months guessing.
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

        <div id="product" className="mt-16 scroll-mt-24 pb-24">
          <div className="mb-8 text-center">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Product
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              See what growseo helps you do
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:grid-rows-[auto_auto]">
          <BentoCard
            delay={0.2}
            className="relative min-h-[320px] md:col-span-4 md:row-span-2 md:min-h-0"
          >
            <Image
              src="/hero-feature.png"
              alt="growseo glass logo floating over a field of daisies"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover object-center"
            />
          </BentoCard>

          <BentoCard delay={0.24} className="p-6 md:col-span-4">
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
              Connect your
              <br />
              search data
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Search Console, Bing, and Trends in one SEO command centre.
            </p>
          </BentoCard>

          <BentoCard delay={0.28} className="p-6 md:col-span-4">
            <p className="text-6xl font-semibold tracking-tighter text-foreground">
              3×
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Faster from insight to action when you know which keywords and
              pages to prioritise.
            </p>
          </BentoCard>

          <BentoCard delay={0.32} className="p-6 md:col-span-4">
            <p className="text-6xl font-semibold tracking-tighter text-foreground">
              40%
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Less guesswork. Recommendations based on real search demand and
              ranking data.
            </p>
          </BentoCard>

          <BentoCard delay={0.36} className="flex flex-col p-6 md:col-span-4">
            <h3 className="text-xl font-semibold tracking-tight">
              Live SEO
              <br />
              signals
            </h3>
            <div className="mt-5 overflow-hidden rounded-xl bg-[#0c0d10] p-3 font-mono text-[11px] leading-relaxed text-white/70 shadow-inner">
              <p className="text-emerald-400">→ /pricing ranking at pos 4.2</p>
              <p className="mt-1 text-white/50">1,240 impressions · 2.1% CTR</p>
              <p className="flex items-center gap-1.5 text-amber-400">
                <TriangleAlert className="size-3" />
                Opportunity: improve title & meta
              </p>
            </div>
          </BentoCard>

          <BentoCard delay={0.4} className="p-6 md:col-span-12">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-xl font-semibold tracking-tight">
                  Find opportunities. Improve rankings.
                </h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                  growseo ranks your next best SEO actions: create new pages,
                  update existing content, and target high-intent keywords.
                </p>
              </div>

              <div className="flex items-center gap-3 md:shrink-0">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Search className="size-4" />
                </span>
                <div className="h-px w-8 bg-border md:hidden" />
                <div className="hidden h-px w-12 bg-gradient-to-r from-border to-transparent md:block" />
                <div className="flex flex-wrap gap-2">
                  {["Create /ai-growth", "Refresh /pricing", "Target keyword"].map(
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
            </div>
          </BentoCard>
          </div>
        </div>
      </div>
    </section>
  );
}
