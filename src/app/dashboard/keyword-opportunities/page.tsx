import type { Metadata } from "next";
import { KeywordOpportunitiesPage } from "@/components/dashboard/keyword-opportunities-page";

export const metadata: Metadata = { title: "Keyword Opportunities" };

export default function Page() {
  return <KeywordOpportunitiesPage />;
}
