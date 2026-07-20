"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { BentoCard } from "@/components/dashboard/bento-card";
import { Button } from "@/components/ui/button";
import {
  listSelectableGscProperties,
  selectGscProperty,
} from "@/lib/gsc/actions";
import { cn } from "@/lib/utils";

export function GscPropertyPicker({ websiteId }: { websiteId: string }) {
  const router = useRouter();
  const [sites, setSites] = useState<string[]>([]);
  const [preferred, setPreferred] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    void listSelectableGscProperties(websiteId).then((res) => {
      setLoading(false);
      if (res.error) {
        setError(res.error);
        return;
      }
      setSites(res.sites);
      setPreferred(res.preferred ?? null);
      setSelected(res.preferred ?? res.sites[0] ?? null);
    });
  }, [websiteId]);

  return (
    <div className="flex-1 p-4 sm:p-8">
      <div className="mx-auto max-w-xl space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Choose Search Console property
          </h2>
          <p className="mt-3 text-muted-foreground">
            We prefer the{" "}
            <span className="text-foreground">www</span> URL-prefix property
            when it exists for your site.
          </p>
        </div>

        {loading && (
          <p className="text-sm text-muted-foreground">Loading properties…</p>
        )}

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && sites.length === 0 && (
          <BentoCard className="space-y-3 p-6">
            <p className="text-sm text-muted-foreground">
              No Search Console properties found on this Google account. Verify
              your site in Search Console first, then reconnect.
            </p>
            <Button
              variant="outline"
              className="h-10 rounded-full"
              onClick={() => router.push("/dashboard/engine/integrations")}
            >
              Back
            </Button>
          </BentoCard>
        )}

        <div className="space-y-2">
          {sites.map((site) => {
            const isPreferred = site === preferred;
            const active = site === selected;
            return (
              <button
                key={site}
                type="button"
                onClick={() => setSelected(site)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition-colors",
                  active
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:bg-muted/40"
                )}
              >
                <Check
                  className={cn(
                    "size-4 shrink-0",
                    active ? "opacity-100" : "opacity-0"
                  )}
                />
                <span className="min-w-0 flex-1 truncate font-medium">
                  {site}
                </span>
                {isPreferred && (
                  <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    Preferred
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            disabled={!selected || pending}
            className="h-10 rounded-full bg-primary px-5 text-primary-foreground"
            onClick={() => {
              if (!selected) return;
              startTransition(async () => {
                const res = await selectGscProperty(websiteId, selected);
                if (res?.error) setError(res.error);
              });
            }}
          >
            {pending ? "Saving…" : "Use this property"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-full"
            onClick={() => router.push("/dashboard/engine/integrations")}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
