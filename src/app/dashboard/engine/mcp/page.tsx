import type { Metadata } from "next";
import { McpSetupPage } from "@/components/dashboard/mcp-setup-page";

export const metadata: Metadata = { title: "MCP" };

export default function EngineMcpPage() {
  return <McpSetupPage repoPath={process.cwd()} />;
}
