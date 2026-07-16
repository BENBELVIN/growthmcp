"use client";

import Link from "next/link";
import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

export function DashboardHeader({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="size-4" />
              <span className="sr-only">Open navigation</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-60 p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <DashboardSidebar className="w-full border-0" />
          </SheetContent>
        </Sheet>
        <div>
          <h1 className="text-sm font-semibold tracking-tight sm:text-base">
            {title}
          </h1>
          <p className="hidden text-xs text-muted-foreground sm:block">
            Growth operating system
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/settings">
            <Bell className="size-4" />
            <span className="sr-only">Notifications</span>
          </Link>
        </Button>
        <Avatar className="size-8">
          <AvatarFallback className="bg-brand/20 text-xs text-brand">
            BJ
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
