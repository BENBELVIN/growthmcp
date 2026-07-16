import type { Metadata } from "next";
import { DashboardHeader } from "@/components/dashboard/header";
import { OverviewCards } from "@/components/dashboard/overview-cards";
import { RecommendationsPanel } from "@/components/dashboard/recommendations-panel";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { RecentChanges } from "@/components/dashboard/recent-changes";

export const metadata: Metadata = {
  title: "Overview",
};

export default function DashboardPage() {
  return (
    <>
      <DashboardHeader title="Overview" />
      <div className="flex-1 space-y-6 p-4 sm:p-6">
        <OverviewCards />
        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <RecommendationsPanel />
          <ActivityFeed />
        </div>
        <RecentChanges />
      </div>
    </>
  );
}
