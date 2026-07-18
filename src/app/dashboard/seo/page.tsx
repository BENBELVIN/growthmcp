import type { Metadata } from "next";
import { SeoPage } from "@/components/dashboard/seo-page";

export const metadata: Metadata = {
  title: "SEO",
};

export default function SeoRoute() {
  return <SeoPage />;
}
