import { redirect } from "next/navigation";

/** Legacy Insights route — Demand/Supply layers replaced the old Insights/SEO path. */
export default function InsightsRedirect() {
  redirect("/dashboard/supply");
}
