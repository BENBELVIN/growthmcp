import type { Metadata } from "next";
import { ConvertLayerPage } from "@/components/dashboard/convert-layer-page";

export const metadata: Metadata = {
  title: "Convert Layer",
};

export default function ConvertRoute() {
  return <ConvertLayerPage />;
}
