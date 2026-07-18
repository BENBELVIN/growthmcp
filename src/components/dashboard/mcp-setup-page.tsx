"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";
import { useWorkspace } from "@/components/dashboard/workspace-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const CONTEXTS = [
  {
    id: "seo",
    label: "SEO",
    detail: "Search Console + Trends — live",
  },
  {
    id: "social",
    label: "Social",
    detail: "TikTok, Instagram, X — soon",
  },
  {
    id: "app",
    label: "App",
    detail: "App Store, RevenueCat, PostHog — soon",
  },
] as const;

const TOOLS = [
  {
    name: "get_project_overview",
    description:
      "Cross-channel overview: health, channels, integrations, priorities.",
    primary: false,
  },
  {
    name: "get_growth_priorities",
    description:
      "Source of truth — unified Top growth opportunities for Cursor.",
    primary: true,
  },
  {
    name: "get_seo_insights",
    description: "Search Console + Trends evidence for the SEO channel.",
    primary: false,
  },
  {
    name: "get_social_insights",
    description: "Social performance and hooks (placeholder until connected).",
    primary: false,
  },
  {
    name: "get_app_metrics",
    description: "Downloads, revenue, reviews (placeholder until connected).",
    primary: false,
  },
  {
    name: "list_projects",
    description: "List GrowthMCP projects available to this MCP connection.",
    primary: false,
  },
] as const;

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      className="h-7 rounded-full border-border bg-background/40 text-xs"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
      }}
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}

export function McpSetupPage({ repoPath }: { repoPath: string }) {
  const { currentProject } = useWorkspace();

  const config = useMemo(() => {
    const envBlock = currentProject
      ? `,
      "env": {
        "GROWTHMCP_WEBSITE_ID": "${currentProject.id}"
      }`
      : "";

    return `{
  "mcpServers": {
    "growthmcp": {
      "command": "npx",
      "args": ["tsx", "src/mcp/server.ts"],
      "cwd": ${JSON.stringify(repoPath)}${envBlock}
    }
  }
}`;
  }, [repoPath, currentProject]);

  return (
    <div className="flex-1 p-6 sm:p-8 lg:p-10">
      <div className="mx-auto w-full max-w-6xl space-y-8">
        <header className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-muted/50 ring-1 ring-border/60">
              <Terminal className="size-5 text-muted-foreground" />
            </span>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Connect to Cursor
              </h2>
              <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                MCP is the AI context layer — Cursor pulls SEO, Social, and App
                signals for the active project.
              </p>
            </div>
          </div>
        </header>

        <section className="rounded-2xl border border-border/70 p-6 sm:p-7">
          <h3 className="text-sm font-semibold tracking-tight">
            Available growth context
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Context is scoped to the project — not the user.
          </p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-3">
            {CONTEXTS.map((ctx) => (
              <li
                key={ctx.id}
                className="rounded-xl border border-border/60 px-4 py-3"
              >
                <p className="font-medium tracking-tight">{ctx.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{ctx.detail}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-border/70 p-6 sm:p-7">
            <h3 className="text-sm font-semibold tracking-tight">Setup</h3>
            <ol className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
              <li>
                <span className="font-medium text-foreground">1.</span> Add{" "}
                <code className="rounded bg-muted/50 px-1.5 py-0.5 font-mono text-[11px] text-foreground">
                  SUPABASE_SERVICE_ROLE_KEY
                </code>{" "}
                to{" "}
                <code className="rounded bg-muted/50 px-1.5 py-0.5 font-mono text-[11px] text-foreground">
                  .env.local
                </code>{" "}
                (Supabase → Settings → API → service_role). The MCP server loads
                it automatically from this repo.
              </li>
              <li>
                <span className="font-medium text-foreground">2.</span> Open
                Cursor Settings → MCP → Add new global MCP server.
              </li>
              <li>
                <span className="font-medium text-foreground">3.</span> Paste the
                config below. Set{" "}
                <code className="rounded bg-muted/50 px-1.5 py-0.5 font-mono text-[11px] text-foreground">
                  cwd
                </code>{" "}
                to this repo&apos;s absolute path
                {currentProject ? (
                  <>
                    {" "}
                    (project id for{" "}
                    <span className="text-foreground">
                      {currentProject.name}
                    </span>{" "}
                    is filled in)
                  </>
                ) : null}
                .
              </li>
              <li>
                <span className="font-medium text-foreground">4.</span> In Cursor
                Agent, ask:{" "}
                <span className="text-foreground">
                  &quot;Call get_growth_priorities and implement the top
                  item.&quot;
                </span>
              </li>
            </ol>
          </div>

          <div className="rounded-2xl border border-border/70 p-6 sm:p-7">
            <h3 className="text-sm font-semibold tracking-tight">
              What Cursor should use
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Start with{" "}
              <span className="font-mono text-xs text-foreground">
                get_project_overview
              </span>{" "}
              for context, then{" "}
              <span className="font-mono text-xs text-foreground">
                get_growth_priorities
              </span>{" "}
              for what to ship — same queue as Overview.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Badge>SEO</Badge>
              <Badge variant="secondary">Social</Badge>
              <Badge variant="outline">App</Badge>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-border/70 bg-muted/20">
          <div className="flex items-center justify-between border-b border-border/70 px-5 py-3">
            <span className="font-mono text-xs text-muted-foreground">
              ~/.cursor/mcp.json
            </span>
            <CopyButton text={config} />
          </div>
          <pre className="overflow-x-auto p-5 font-mono text-xs leading-relaxed text-muted-foreground">
            {config}
          </pre>
        </section>

        <section className="rounded-2xl border border-border/70 p-6 sm:p-7">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold tracking-tight">
                Available tools
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Channel-oriented tools Cursor can call for this project.
              </p>
            </div>
            <Badge variant="outline" className="font-normal">
              {TOOLS.length} tools
            </Badge>
          </div>
          <ul className="mt-5 divide-y divide-border/50 rounded-xl border border-border/60">
            {TOOLS.map((tool) => (
              <li
                key={tool.name}
                className="flex flex-col gap-1 px-4 py-3.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
              >
                <code
                  className={cn(
                    "font-mono text-sm",
                    tool.primary ? "text-primary" : "text-foreground"
                  )}
                >
                  {tool.name}()
                </code>
                <span className="text-sm text-muted-foreground sm:text-right">
                  {tool.description}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <p className="text-xs text-muted-foreground">
          Local stdio server:{" "}
          <code className="font-mono text-[11px]">npm run mcp</code>. Secrets
          stay in{" "}
          <code className="font-mono text-[11px]">.env.local</code> (loaded via{" "}
          <code className="font-mono text-[11px]">cwd</code>) — only the
          optional project id goes in the MCP config.
        </p>
      </div>
    </div>
  );
}
