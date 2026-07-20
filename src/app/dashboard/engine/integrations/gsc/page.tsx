import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { GscPropertyPicker } from "@/components/dashboard/gsc-property-picker";
import { enginePaths } from "@/lib/data/dashboard";

export const metadata: Metadata = { title: "GSC Property" };

export default async function EngineGscPropertyPage({
  searchParams,
}: {
  searchParams: Promise<{ websiteId?: string }>;
}) {
  const params = await searchParams;
  if (!params.websiteId) {
    redirect(enginePaths.integrations);
  }

  return <GscPropertyPicker websiteId={params.websiteId} />;
}
