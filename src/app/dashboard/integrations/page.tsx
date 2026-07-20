import { redirect } from "next/navigation";
import { enginePaths } from "@/lib/data/dashboard";

/** Legacy Integrations route — now nested under MCP & Integrations. */
export default async function IntegrationsRedirect({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") qs.set(key, value);
  }
  const query = qs.toString();
  redirect(
    query ? `${enginePaths.integrations}?${query}` : enginePaths.integrations
  );
}
