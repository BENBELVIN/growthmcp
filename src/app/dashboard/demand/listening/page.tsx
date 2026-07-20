import type { Metadata } from "next";
import { DemandLayerPage } from "@/components/dashboard/demand-layer-page";

export const metadata: Metadata = {
  title: "Social Listening",
};

export default function DemandListeningRoute() {
  return <DemandLayerPage defaultTab="social-listening" />;
}
