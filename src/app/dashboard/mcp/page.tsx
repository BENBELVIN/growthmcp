import { redirect } from "next/navigation";
import { enginePaths } from "@/lib/data/dashboard";

/** Legacy MCP route — now nested under MCP & Integrations. */
export default function McpRedirect() {
  redirect(enginePaths.mcp);
}
