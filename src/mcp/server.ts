/**
 * GrowthMCP stdio server for Cursor.
 *
 * Run: npm run mcp
 * Cursor config: see /dashboard/engine/mcp
 *
 * Loads .env.local via @next/env. Requires SUPABASE_SERVICE_ROLE_KEY.
 */

import { loadEnvConfig } from "@next/env";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  errorResult,
  jsonResult,
  mcpGetAppMetrics,
  mcpGetGrowthPriorities,
  mcpGetProjectOverview,
  mcpGetSeoInsights,
  mcpGetSocialInsights,
  mcpListProjects,
} from "../lib/mcp/tools";

loadEnvConfig(process.cwd());

const websiteIdField = z
  .string()
  .uuid()
  .optional()
  .describe(
    "GrowthMCP project (website) id. Defaults to GROWTHMCP_WEBSITE_ID env."
  );

const server = new McpServer({
  name: "growthmcp",
  version: "0.1.0",
});

server.registerTool(
  "list_projects",
  {
    description:
      "List GrowthMCP projects (websites) available to this workspace connection.",
  },
  async () => {
    try {
      return jsonResult(await mcpListProjects());
    } catch (e) {
      return errorResult(e);
    }
  }
);

server.registerTool(
  "get_project_overview",
  {
    description:
      "Cross-channel project overview: opportunity score, channel cards, connected integrations, top priorities, and recent wins.",
    inputSchema: {
      websiteId: websiteIdField,
    },
  },
  async ({ websiteId }) => {
    try {
      return jsonResult(await mcpGetProjectOverview(websiteId));
    } catch (e) {
      return errorResult(e);
    }
  }
);

server.registerTool(
  "get_growth_priorities",
  {
    description:
      "SOURCE OF TRUTH for what to implement next. Unified Top growth opportunities queue ranked for Cursor.",
    inputSchema: {
      websiteId: websiteIdField,
      limit: z
        .number()
        .int()
        .min(1)
        .max(25)
        .optional()
        .describe("Max priorities to return (default 15)."),
    },
  },
  async ({ websiteId, limit }) => {
    try {
      return jsonResult(await mcpGetGrowthPriorities(websiteId, limit ?? 15));
    } catch (e) {
      return errorResult(e);
    }
  }
);

server.registerTool(
  "get_seo_insights",
  {
    description:
      "SEO channel insights: Google Search Console + Bing Webmaster totals/queries/pages plus Trends opportunities.",
    inputSchema: {
      websiteId: websiteIdField,
    },
  },
  async ({ websiteId }) => {
    try {
      return jsonResult(await mcpGetSeoInsights(websiteId));
    } catch (e) {
      return errorResult(e);
    }
  }
);

server.registerTool(
  "get_social_insights",
  {
    description:
      "Social channel insights (TikTok, Instagram, X). Returns connection status until integrations are live.",
    inputSchema: {
      websiteId: websiteIdField,
    },
  },
  async ({ websiteId }) => {
    try {
      return jsonResult(await mcpGetSocialInsights(websiteId));
    } catch (e) {
      return errorResult(e);
    }
  }
);

server.registerTool(
  "get_app_metrics",
  {
    description:
      "App growth metrics (App Store Connect, RevenueCat, PostHog). Returns connection status until integrations are live.",
    inputSchema: {
      websiteId: websiteIdField,
    },
  },
  async ({ websiteId }) => {
    try {
      return jsonResult(await mcpGetAppMetrics(websiteId));
    } catch (e) {
      return errorResult(e);
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("GrowthMCP MCP server running on stdio");
}

main().catch((error) => {
  console.error("GrowthMCP MCP server failed:", error);
  process.exit(1);
});
