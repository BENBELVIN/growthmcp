import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { GscPropertyPicker } from "@/components/dashboard/gsc-property-picker";

export const metadata: Metadata = { title: "GSC Property" };

export default async function GscPropertyPage({
  searchParams,
}: {
  searchParams: Promise<{ websiteId?: string }>;
}) {
  const params = await searchParams;
  if (!params.websiteId) {
    redirect("/dashboard/integrations");
  }

  return <GscPropertyPicker websiteId={params.websiteId} />;
}
