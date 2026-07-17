"use client";

import { Logo } from "@/components/shared/logo";
import { ProjectSelector } from "@/components/dashboard/project-selector";
import { UserMenu } from "@/components/dashboard/user-menu";
import { MobileNav } from "@/components/dashboard/mobile-nav";

export function DashboardTopNav() {
  return (
    <header className="sticky top-0 z-30 grid h-14 grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-border/60 bg-background/70 px-4 backdrop-blur-xl sm:px-6">
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
