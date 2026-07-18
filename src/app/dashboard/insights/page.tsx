import { redirect } from "next/navigation";

/** Legacy Insights route — SEO is now a first-class channel. */
export default function InsightsRedirect() {
  redirect("/dashboard/seo");
}
