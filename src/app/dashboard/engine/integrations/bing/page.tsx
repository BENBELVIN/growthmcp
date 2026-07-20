import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BingPropertyPicker } from "@/components/dashboard/bing-property-picker";
import { enginePaths } from "@/lib/data/dashboard";

export const metadata: Metadata = { title: "Bing Property" };

export default async function EngineBingPropertyPage({
  searchParams,
}: {
  searchParams: Promise<{ websiteId?: string }>;
}) {
  const params = await searchParams;
  if (!params.websiteId) {
    redirect(enginePaths.integrations);
  }

  return <BingPropertyPicker websiteId={params.websiteId} />;
}
