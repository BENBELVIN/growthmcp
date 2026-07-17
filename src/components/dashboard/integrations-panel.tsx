"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Lock } from "lucide-react";
import { BentoCard } from "@/components/dashboard/bento-card";
import { useWorkspace } from "@/components/dashboard/workspace-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { disconnectGsc } from "@/lib/gsc/actions";
import type { GscConnectionPublic } from "@/types/database";

type IntegrationDef = {
  id: "gsc" | "ga" | "crawler";
  name: string;
  description: string;
  logo: string | null;
  badge: string | null;
};

const integrations: IntegrationDef[] = [
  {
    id: "gsc",
    name: "Google Search Console",
    description:
      "Pull queries, pages, CTR, and position changes for the active project.",
    logo: "/logos/gsc.svg",
    badge: null,
  },
  {
    id: "ga",
    name: "Google Analytics",
    description:
      "Traffic, conversions, and engagement metrics scoped to this project.",
    logo: null,
    badge: "GA4",
  },
  {
    id: "crawler",
    name: "Website Crawler",
    description:
      "Index pages, discover issues, and feed technical SEO signals to GrowthMCP.",
    logo: null,
    badge: "Crawl",
  },
];

export function IntegrationsPanel({
  initialGsc,
  flash,
}: {
  initialGsc: GscConnectionPublic | null;
  flash?: { success?: string; error?: string };
}) {
  const { currentProject, setAddProjectOpen } = useWorkspace();
  const locked = !currentProject;
  const router = useRouter();
  const [gsc, setGsc] = useState(initialGsc);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setGsc(initialGsc);
  }, [initialGsc]);

  const gscConnected = gsc?.status === "connected";
  const gscPending = gsc?.status === "pending_property";

  return (
    <div className="flex-1 p-4 sm:p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Integrations
          </h2>
          {locked ? (
            <p className="mt-3 text-muted-foreground">
              No project selected. Add a project to connect data sources.
            </p>
          ) : (
            <p className="mt-3 text-muted-foreground">
              Current Project:{" "}
              <span className="text-foreground">{currentProject.name}</span>
            </p>
          )}
        </div>

        {flash?.success && (
          <p className="rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm text-foreground">
            {flash.success}
          </p>
        )}
        {flash?.error && (
          <p
            className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            role="alert"
          >
            {flash.error}
          </p>
        )}

        {!locked && (
          <p className="text-sm font-medium text-muted-foreground">
            Available integrations
          </p>
        )}

        <div className="space-y-4">
          {integrations.map((item) => {
            const isGsc = item.id === "gsc";
            return (
              <BentoCard
                key={item.id}
                className={cn(
                  "flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between",
                  locked && "opacity-70"
                )}
              >
                <div className="flex items-start gap-4">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-muted shadow-sm ring-1 ring-border">
                    {item.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.logo}
                        alt=""
                        width={28}
                        height={28}
                        className="size-7 object-contain"
                      />
                    ) : (
                      <span className="text-[10px] font-semibold tracking-wide text-muted-foreground">
                        {item.badge}
                      </span>
                    )}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold tracking-tight">
                      {item.name}
                    </h3>
                    <p className="mt-1 max-w-md text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                    {locked && (
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Lock className="size-3" />
                        Add a project first
                      </p>
                    )}
                    {isGsc && gscConnected && gsc?.property_uri && (
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400">
                        <Check className="size-3" />
                        Connected · {gsc.property_uri}
                      </p>
                    )}
                    {isGsc && gscPending && (
                      <p className="mt-2 text-xs text-amber-400">
                        Choose a Search Console property to finish setup
                      </p>
                    )}
                  </div>
                </div>

                {locked ? (
                  <Button
                    type="button"
                    variant="outline"
                    disabled
                    className="h-10 shrink-0 rounded-full px-5"
                  >
                    <Lock className="size-3.5" />
                    Locked
                  </Button>
                ) : isGsc && gscConnected ? (
                  <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-10 rounded-full px-5"
                      onClick={() =>
                        router.push(
                          `/dashboard/integrations/gsc?websiteId=${currentProject.id}`
                        )
                      }
                    >
                      Change property
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={pending}
                      className="h-9 rounded-full px-4 text-muted-foreground"
                      onClick={() =>
                        startTransition(async () => {
                          await disconnectGsc(currentProject.id);
                          setGsc(null);
                          router.refresh();
                        })
                      }
                    >
                      Disconnect
                    </Button>
                  </div>
                ) : isGsc && gscPending ? (
                  <Button
                    type="button"
                    className="h-10 shrink-0 rounded-full bg-primary px-5 text-primary-foreground"
                    onClick={() =>
                      router.push(
                        `/dashboard/integrations/gsc?websiteId=${currentProject.id}`
                      )
                    }
                  >
                    Choose property
                  </Button>
                ) : isGsc ? (
                  <Button
                    type="button"
                    className="h-10 shrink-0 rounded-full bg-primary px-5 text-primary-foreground"
                    asChild
                  >
                    <a
                      href={`/api/integrations/gsc/connect?websiteId=${currentProject.id}`}
                    >
                      Connect
                    </a>
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    disabled
                    className="h-10 shrink-0 rounded-full px-5"
                  >
                    Soon
                  </Button>
                )}
              </BentoCard>
            );
          })}
        </div>

        {locked && (
          <div className="flex justify-center pt-2">
            <Button
              type="button"
              onClick={() => setAddProjectOpen(true)}
              className="h-10 rounded-full bg-primary px-5 text-primary-foreground"
            >
              Add Project
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
