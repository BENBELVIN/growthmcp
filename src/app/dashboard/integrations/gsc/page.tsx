import { redirect } from "next/navigation";
import { enginePaths } from "@/lib/data/dashboard";

/** Legacy GSC property picker — moved under engine/integrations. */
export default async function GscPropertyRedirect({
  searchParams,
}: {
  searchParams: Promise<{ websiteId?: string }>;
}) {
  const params = await searchParams;
  if (!params.websiteId) {
    redirect(enginePaths.integrations);
  }
  redirect(`${enginePaths.gsc}?websiteId=${params.websiteId}`);
}
