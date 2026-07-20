import type { Metadata } from "next";
import { ConvertLayerPage } from "@/components/dashboard/convert-layer-page";

export const metadata: Metadata = {
  title: "PostHog Analytics",
};

export default function ConvertAnalyticsRoute() {
  return <ConvertLayerPage defaultTab="analytics" />;
}
