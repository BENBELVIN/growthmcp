import { redirect } from "next/navigation";
import { enginePaths } from "@/lib/data/dashboard";

/** Legacy Bing property picker — moved under engine/integrations. */
export default async function BingPropertyRedirect({
  searchParams,
}: {
  searchParams: Promise<{ websiteId?: string }>;
}) {
  const params = await searchParams;
  if (!params.websiteId) {
    redirect(enginePaths.integrations);
  }
  redirect(`${enginePaths.bing}?websiteId=${params.websiteId}`);
}
