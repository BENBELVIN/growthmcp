import { redirect } from "next/navigation";

/** Legacy SEO route — Search Console / Bing live under Supply; Trends under Demand. */
export default function SeoRedirect() {
  redirect("/dashboard/supply");
}
