"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { enginePaths } from "@/lib/data/dashboard";

const ENGINE_TABS = [
  { href: enginePaths.integrations, label: "Integrations", exact: false },
  { href: enginePaths.mcp, label: "MCP", exact: true },
] as const;

export function EngineSubnav() {
  const pathname = usePathname();

  return (
    <div className="border-b border-border/70 px-6 pt-6 sm:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-6xl">
        <header className="space-y-1 pb-5">
          <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            The engine
          </p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            MCP &amp; Integrations
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            Connected accounts and the Cursor MCP context layer that powers
            Demand, Supply, and Convert.
          </p>
        </header>
        <nav className="flex gap-0">
          {ENGINE_TABS.map((tab) => {
            const active = tab.exact
              ? pathname === tab.href
              : pathname === tab.href || pathname.startsWith(`${tab.href}/`);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
