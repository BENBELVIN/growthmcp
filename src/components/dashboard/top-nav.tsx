"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/shared/logo";
import { ProjectSelector } from "@/components/dashboard/project-selector";
import { UserMenu } from "@/components/dashboard/user-menu";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { cn } from "@/lib/utils";

export function DashboardTopNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 grid h-14 grid-cols-[1fr_auto_1fr] items-center gap-3 border-b px-4 transition-[background-color,box-shadow] duration-200 sm:px-6",
        scrolled
          ? "border-border bg-background shadow-sm"
          : "border-border/60 bg-background/70 backdrop-blur-xl"
      )}
    >
      <div className="flex items-center gap-3 justify-self-start">
        <div className="lg:hidden">
          <MobileNav />
        </div>
        <Logo href="/dashboard" />
      </div>

      <div className="justify-self-center">
        <ProjectSelector />
      </div>

      <div className="justify-self-end">
        <UserMenu />
      </div>
    </header>
  );
}
