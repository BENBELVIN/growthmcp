"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LineChart,
  Plug,
  Settings,
  Terminal,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems } from "@/lib/data/dashboard";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  LineChart,
  Plug,
  Terminal,
  Settings,
};

export function DashboardSidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex w-64 shrink-0 flex-col border-r border-border/80 bg-sidebar/50 backdrop-blur-xl",
        className
      )}
    >
      <nav className="flex-1 space-y-1 px-3 py-4">
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
                "flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {Icon && <Icon className="size-4 shrink-0 opacity-80" />}
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
