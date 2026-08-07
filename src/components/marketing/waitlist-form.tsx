"use client";

import { useState, useTransition } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { joinWaitlist } from "@/lib/waitlist/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type WaitlistFormProps = {
  waitlistCount?: number;
  referralCode?: string;
  className?: string;
};

export function WaitlistForm({
  waitlistCount = 0,
  referralCode,
  className,
}: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ isNew: boolean } | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await joinWaitlist({
        email,
        source: "hero",
        referralCode,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setSuccess({
        isNew: result.isNew,
      });
    });
  }

  if (success) {
    return (
      <div className={cn("mx-auto max-w-md text-center", className)}>
        <div className="inline-flex size-12 items-center justify-center rounded-full bg-brand/10 text-brand">
          <Check className="size-5" strokeWidth={2.5} />
        </div>
        <p className="mt-4 text-lg font-semibold tracking-tight text-foreground">
          {success.isNew ? "You're on the list" : "You're already on the list"}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Check your inbox — we sent a confirmation with next steps.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("mx-auto w-full max-w-lg", className)}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <Input
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@company.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={pending}
          required
          aria-label="Email address"
          className="h-12 flex-1 rounded-full px-5"
        />
        <Button
          type="submit"
          disabled={pending || !email.trim()}
          className="h-12 shrink-0 rounded-full bg-primary px-7 text-[15px] font-medium text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
        >
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Joining…
            </>
          ) : (
            <>
              Get early access
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </form>

      {error && (
        <p className="mt-3 text-center text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">
        No spam. Just your invite when early access opens.
        {waitlistCount > 0 && (
          <>
            {" "}
            <span className="text-foreground/70">
              {waitlistCount.toLocaleString()} teams already waiting.
            </span>
          </>
        )}
      </p>
    </div>
  );
}
