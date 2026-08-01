import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { GscPropertyPicker } from "@/components/dashboard/gsc-property-picker";
import { settingsPaths } from "@/lib/data/dashboard";

export const metadata: Metadata = { title: "GSC Property" };

export default async function SettingsGscPropertyPage({
  searchParams,
}: {
  searchParams: Promise<{ websiteId?: string }>;
}) {
  const params = await searchParams;
  if (!params.websiteId) {
    redirect(settingsPaths.root);
  }

  return <GscPropertyPicker websiteId={params.websiteId} />;
}
