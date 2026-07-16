import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/header";
import { BentoCard } from "@/components/dashboard/bento-card";
import { Button } from "@/components/ui/button";
import { weekBreakdown } from "@/lib/data/dashboard";

export const metadata: Metadata = {
  title: "Overview",
};

export default function DashboardPage() {
  return (
    <>
      <DashboardHeader title="Overview" />
      <div className="flex-1 p-4 sm:p-8">
        <div className="mx-auto max-w-3xl space-y-6">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Hey,
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Here&apos;s the breakdown this week.
            </p>
          </div>

          <div className="space-y-4">
            {weekBreakdown.map((item) => (
              <BentoCard key={item.title} className="p-6">
                <h3 className="text-base font-semibold tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </BentoCard>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              className="h-10 rounded-full bg-primary px-5 text-primary-foreground"
              asChild
            >
              <Link href="/dashboard/integrations">
                Connect your data
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-10 rounded-full border-border bg-white/70 px-5"
              asChild
            >
              <Link href="/dashboard/mcp">Set up MCP</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
