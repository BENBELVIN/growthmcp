import { redirect } from "next/navigation";
import { enginePaths } from "@/lib/data/dashboard";

/** Engine hub — default to Integrations (connected accounts). */
export default function EngineIndexPage() {
  redirect(enginePaths.integrations);
}
