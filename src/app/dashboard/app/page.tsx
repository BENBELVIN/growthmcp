import type { Metadata } from "next";
import { AppGrowthPage } from "@/components/dashboard/app-growth-page";

export const metadata: Metadata = {
  title: "App",
};

export default function AppRoute() {
  return <AppGrowthPage />;
}
