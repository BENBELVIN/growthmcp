"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  LayoutDashboard,
  ListTodo,
  Plug,
  Search,
  Settings,
  Share2,
  Terminal,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";
import { navItems } from "@/lib/data/dashboard";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  TrendingUp,
  Search,
  FileText,
  Share2,
  ListTodo,
  Plug,
  Terminal,
  Settings,
};

export function DashboardSidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-full w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar",
        className
      )}
    >
      <div className="flex h-14 items-center border-b border-sidebar-border px-4">
        <Logo href="/dashboard" />
      </div>
      <nav className="flex-1 space-y-0.5 p-3">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon];
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-sidebar-accent text-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
              )}
            >
              {Icon && <Icon className="size-4 shrink-0" />}
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <div className="rounded-xl border border-border bg-card/50 p-3">
          <p className="text-xs font-medium text-foreground">MCP status</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            4 tools · last call 2m ago
          </p>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-success" />
            <span className="text-[11px] text-success">Online</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
