import type { Metadata } from "next";
import { SupplyLayerPage } from "@/components/dashboard/supply-layer-page";

export const metadata: Metadata = {
  title: "Social Publishing",
};

export default function SupplyPublishingRoute() {
  return <SupplyLayerPage defaultTab="social-publishing" />;
}
