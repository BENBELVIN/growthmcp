import type { Metadata } from "next";
import { ContentRankingsPage } from "@/components/dashboard/content-rankings-page";

export const metadata: Metadata = { title: "Content & Rankings" };

export default function Page() {
  return <ContentRankingsPage defaultTab="bing" />;
}
