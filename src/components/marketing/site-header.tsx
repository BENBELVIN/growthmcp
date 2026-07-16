"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "#product", label: "Product" },
  { href: "#solutions", label: "Solutions", hasChevron: true },
  { href: "#developers", label: "Developers" },
  { href: "#enterprise", label: "Enterprise" },
  { href: "#support", label: "Support" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-transparent">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Logo />

        <nav className="hidden items-center gap-9 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center gap-1 text-[15px] font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              {link.label}
              {link.hasChevron && <ChevronDown className="size-4 opacity-60" />}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button
            variant="outline"
            className="h-10 rounded-full border-border bg-white/70 px-5 text-sm font-medium text-foreground hover:bg-white"
            asChild
          >
            <Link href="/dashboard">Login</Link>
          </Button>
          <Button
            className="h-10 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            asChild
          >
            <Link href="/dashboard">Get Early Access</Link>
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-white/70 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      <div
        className={cn(
          "mx-4 rounded-2xl border border-border bg-white/90 p-4 shadow-lg backdrop-blur-xl md:hidden",
          open ? "block" : "hidden"
        )}
      >
        <div className="flex flex-col gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-muted"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Button
            className="mt-2 h-10 rounded-full bg-primary text-primary-foreground"
            asChild
          >
            <Link href="/dashboard">Get Early Access</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
