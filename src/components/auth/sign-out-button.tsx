"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { signOut } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="ghost"
      disabled={pending}
      onClick={() => startTransition(() => signOut())}
      className="h-10 w-full justify-start gap-2.5 rounded-2xl px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
    >
      <LogOut className="size-4 shrink-0 opacity-80" />
      {pending ? "Signing out…" : "Sign out"}
    </Button>
  );
}
