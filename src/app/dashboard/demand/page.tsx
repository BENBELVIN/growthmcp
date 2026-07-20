import type { Metadata } from "next";
import { DemandLayerPage } from "@/components/dashboard/demand-layer-page";

export const metadata: Metadata = {
  title: "Demand Layer",
};

export default function DemandRoute() {
  return <DemandLayerPage />;
}
