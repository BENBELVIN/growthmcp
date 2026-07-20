import type { Metadata } from "next";
import { SupplyLayerPage } from "@/components/dashboard/supply-layer-page";

export const metadata: Metadata = {
  title: "Supply Layer",
};

export default function SupplyRoute() {
  return <SupplyLayerPage />;
}
