import { redirect } from "next/navigation";
import { settingsPaths } from "@/lib/data/dashboard";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ websiteId?: string }>;
}) {
  const params = await searchParams;
  const qs = params.websiteId ? `?websiteId=${params.websiteId}` : "";
  redirect(`${settingsPaths.bing}${qs}`);
}
