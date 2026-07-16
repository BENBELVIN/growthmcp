"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

export function DashboardHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/60 bg-background/70 px-4 backdrop-blur-xl sm:px-8">
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-border bg-white/70 lg:hidden"
            >
              <Menu className="size-4" />
              <span className="sr-only">Open navigation</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <DashboardSidebar className="w-full border-0" />
          </SheetContent>
        </Sheet>
        <div>
          <h1 className="text-base font-semibold tracking-tight sm:text-lg">
            {title}
          </h1>
          {description && (
            <p className="hidden text-xs text-muted-foreground sm:block">
              {description}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
