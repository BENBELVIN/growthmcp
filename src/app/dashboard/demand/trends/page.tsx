import type { Metadata } from "next";
import { DemandLayerPage } from "@/components/dashboard/demand-layer-page";

export const metadata: Metadata = {
  title: "Google Trends & Keywords",
};

export default function DemandTrendsRoute() {
  return <DemandLayerPage defaultTab="google-trends" />;
}
