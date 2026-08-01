import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BingPropertyPicker } from "@/components/dashboard/bing-property-picker";
import { settingsPaths } from "@/lib/data/dashboard";

export const metadata: Metadata = { title: "Bing Site" };

export default async function SettingsBingPropertyPage({
  searchParams,
}: {
  searchParams: Promise<{ websiteId?: string }>;
}) {
  const params = await searchParams;
  if (!params.websiteId) {
    redirect(settingsPaths.root);
  }

  return <BingPropertyPicker websiteId={params.websiteId} />;
}
