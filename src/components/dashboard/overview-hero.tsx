"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { ImpressionsGoalCard } from "@/components/dashboard/impressions-goal-card";
import { SeoBrainPanel } from "@/components/dashboard/seo-brain-panel";
import { Button } from "@/components/ui/button";
import type { CommandCenterData } from "@/lib/gsc/command-center";
import { settingsPaths } from "@/lib/data/dashboard";

const ease = [0.22, 1, 0.36, 1] as const;

type OverviewHeroProps = {
  firstName: string;
  projectName: string;
  loading: boolean;
  connected: boolean;
  error: string | null;
  command: CommandCenterData | null;
};

export function OverviewHero({
  firstName,
  projectName,
  loading,
  connected,
  error,
  command,
}: OverviewHeroProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-1 flex-col">
      <motion.div
        layout
        transition={{ duration: 0.4, ease }}
        className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-6"
        animate={{
          opacity: expanded ? 0.72 : 1,
        }}
      >
        <motion.header
          layout
          className="min-w-0 space-y-1"
          animate={{
            scale: expanded ? 0.94 : 1,
          }}
          transition={{ duration: 0.4, ease }}
          style={{ originX: 0, originY: 0 }}
        >
          <motion.p
            className="text-muted-foreground"
            animate={{
              fontSize: expanded ? "0.75rem" : "0.875rem",
            }}
            transition={{ duration: 0.35, ease }}
          >
            Hey, {firstName}
          </motion.p>
          <motion.h2
            className="font-semibold tracking-tight"
            animate={{
              fontSize: expanded ? "1.25rem" : "clamp(1.875rem, 4vw, 2.25rem)",
              lineHeight: expanded ? "1.75rem" : "2.5rem",
            }}
            transition={{ duration: 0.35, ease }}
          >
            What should you do next to grow traffic?
          </motion.h2>
        </motion.header>

        {loading ? (
          <div className="h-[152px] w-full animate-pulse rounded-3xl bg-muted/30 lg:w-80 lg:shrink-0" />
        ) : (
          <motion.div
            layout
            className="w-full lg:w-80 lg:shrink-0"
            animate={{
              scale: expanded ? 0.88 : 1,
            }}
            transition={{ duration: 0.4, ease }}
            style={{ originX: 1, originY: 0 }}
          >
            <ImpressionsGoalCard
              compact={expanded}
              impressions={command?.totalImpressions ?? null}
              deltaPct={command?.impressionsDeltaPct}
            />
          </motion.div>
        )}
      </motion.div>

      <div className="mt-auto flex flex-col gap-3 pt-8">
        {!loading && !connected && (
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span>Connect Search Console to unlock your SEO brain.</span>
            <Button
              variant="outline"
              size="sm"
              className="h-8 rounded-full border-border"
              asChild
            >
              <Link href={settingsPaths.root}>
                Connect
                <ArrowUpRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        )}

        {!loading && connected && error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <motion.div layout transition={{ duration: 0.45, ease }}>
          <SeoBrainPanel
            projectName={projectName}
            loading={loading}
            connected={connected}
            command={command}
            expanded={expanded}
            onExpandedChange={setExpanded}
          />
        </motion.div>
      </div>
    </div>
  );
}
