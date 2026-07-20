import type { Metadata } from "next";
import { SupplyLayerPage } from "@/components/dashboard/supply-layer-page";

export const metadata: Metadata = {
  title: "Search Console & Bing",
};

export default function SupplySearchRoute() {
  return <SupplyLayerPage defaultTab="search-console" />;
}
