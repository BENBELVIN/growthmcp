import type { Metadata } from "next";
import { ConvertLayerPage } from "@/components/dashboard/convert-layer-page";

export const metadata: Metadata = {
  title: "App Store Connect",
};

export default function ConvertAppStoresRoute() {
  return <ConvertLayerPage defaultTab="app-stores" />;
}
