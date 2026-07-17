"use client";

import { useTransition } from "react";
import Link from "next/link";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import { deleteWebsite } from "@/lib/websites/actions";
import { Button } from "@/components/ui/button";
import { BentoCard } from "@/components/dashboard/bento-card";
import type { Website } from "@/types/database";

export function WebsiteCard({ website }: { website: Website }) {
  const [pending, startTransition] = useTransition();

  return (
    <BentoCard className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h3 className="text-base font-semibold tracking-tight">{website.name}</h3>
        <a
          href={website.url}
          target="_blank"
          rel="noreferrer"
          className="mt-1 block truncate text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {website.url}
        </a>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-9 rounded-full border-border bg-muted/40 px-3"
          asChild
        >
          <Link href={`/dashboard/websites/${website.id}`}>
            <ExternalLink className="size-3.5" />
            View
          </Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-9 rounded-full border-border bg-muted/40 px-3"
          asChild
        >
          <Link href={`/dashboard/websites/${website.id}/edit`}>
            <Pencil className="size-3.5" />
            Edit
          </Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={pending}
          className="h-9 rounded-full border-border bg-muted/40 px-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => {
            if (
              !confirm(
                `Delete “${website.name}”? This cannot be undone.`
              )
            ) {
              return;
            }
            startTransition(() => deleteWebsite(website.id));
          }}
        >
          <Trash2 className="size-3.5" />
          {pending ? "Deleting…" : "Delete"}
        </Button>
      </div>
    </BentoCard>
  );
}
