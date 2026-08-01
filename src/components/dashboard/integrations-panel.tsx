"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Lock } from "lucide-react";
import { BentoCard } from "@/components/dashboard/bento-card";
import { useWorkspace } from "@/components/dashboard/workspace-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { disconnectGsc } from "@/lib/gsc/actions";
import { disconnectBing } from "@/lib/bing/actions";
import { settingsPaths } from "@/lib/data/dashboard";
import type {
  BingConnectionPublic,
  GscConnectionPublic,
} from "@/types/database";

type IntegrationId = "gsc" | "bing" | "trends";

type IntegrationDef = {
  id: IntegrationId;
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
      "Organic clicks, impressions, rankings, and page performance.",
    logo: "/logos/gsc.svg",
    badge: null,
  },
  {
    id: "bing",
    name: "Bing Webmaster",
    description:
      "Bing clicks, impressions, and early ranking signals.",
    logo: "/logos/bing.svg",
    badge: null,
  },
  {
    id: "trends",
    name: "Google Trends",
    description:
      "Rising topics and keyword demand for content opportunities.",
    logo: "/logos/trends.png",
    badge: null,
  },
];

export function IntegrationsPanel({
  initialGsc,
  initialBing,
  flash,
}: {
  initialGsc: GscConnectionPublic | null;
  initialBing: BingConnectionPublic | null;
  flash?: { success?: string; error?: string };
}) {
  const { currentProject, setAddProjectOpen } = useWorkspace();
  const locked = !currentProject;
  const router = useRouter();
  const [gsc, setGsc] = useState(initialGsc);
  const [bing, setBing] = useState(initialBing);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setGsc(initialGsc);
  }, [initialGsc]);

  useEffect(() => {
    setBing(initialBing);
  }, [initialBing]);

  const gscConnected = gsc?.status === "connected";
  const gscPending = gsc?.status === "pending_property";
  const bingConnected = bing?.status === "connected";
  const bingPending = bing?.status === "pending_property";

  function renderActions(item: IntegrationDef) {
    if (locked) {
      return (
        <Button
          type="button"
          variant="outline"
          disabled
          className="h-10 shrink-0 rounded-full px-5"
        >
          <Lock className="size-3.5" />
          Locked
        </Button>
      );
    }

    if (item.id === "gsc" && gscConnected) {
      return (
        <div className="flex shrink-0 flex-col gap-2 sm:items-end">
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-full px-5"
            onClick={() =>
              router.push(
                `${settingsPaths.gsc}?websiteId=${currentProject.id}`
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
      );
    }

    if (item.id === "gsc" && gscPending) {
      return (
        <Button
          type="button"
          className="h-10 shrink-0 rounded-full bg-primary px-5 text-primary-foreground shadow-lg shadow-primary/20"
          onClick={() =>
            router.push(
              `${settingsPaths.gsc}?websiteId=${currentProject.id}`
            )
          }
        >
          Choose property
        </Button>
      );
    }

    if (item.id === "gsc") {
      return (
        <Button
          type="button"
          className="h-10 shrink-0 rounded-full bg-primary px-5 text-primary-foreground shadow-lg shadow-primary/20"
          asChild
        >
          <a
            href={`/api/integrations/gsc/connect?websiteId=${currentProject.id}`}
          >
            Connect
          </a>
        </Button>
      );
    }

    if (item.id === "bing" && bingConnected) {
      return (
        <div className="flex shrink-0 flex-col gap-2 sm:items-end">
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-full px-5"
            onClick={() =>
              router.push(
                `${settingsPaths.bing}?websiteId=${currentProject.id}`
              )
            }
          >
            Change site
          </Button>
          <Button
            type="button"
            variant="ghost"
            disabled={pending}
            className="h-9 rounded-full px-4 text-muted-foreground"
            onClick={() =>
              startTransition(async () => {
                await disconnectBing(currentProject.id);
                setBing(null);
                router.refresh();
              })
            }
          >
            Disconnect
          </Button>
        </div>
      );
    }

    if (item.id === "bing" && bingPending) {
      return (
        <Button
          type="button"
          className="h-10 shrink-0 rounded-full bg-primary px-5 text-primary-foreground shadow-lg shadow-primary/20"
          onClick={() =>
            router.push(
              `${settingsPaths.bing}?websiteId=${currentProject.id}`
            )
          }
        >
          Choose site
        </Button>
      );
    }

    if (item.id === "bing") {
      return (
        <Button
          type="button"
          className="h-10 shrink-0 rounded-full bg-primary px-5 text-primary-foreground shadow-lg shadow-primary/20"
          asChild
        >
          <a
            href={`/api/integrations/bing/connect?websiteId=${currentProject.id}`}
          >
            Connect
          </a>
        </Button>
      );
    }

    if (item.id === "trends") {
      return (
        <Button
          type="button"
          variant="outline"
          className="h-10 shrink-0 rounded-full px-5"
          onClick={() => router.push("/dashboard/keyword-opportunities")}
        >
          View opportunities
        </Button>
      );
    }

    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold tracking-tight">Data sources</h3>
        {locked ? (
          <p className="mt-2 text-sm text-muted-foreground">
            Add a project to connect Search Console, Bing, and Trends.
          </p>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            Connected to{" "}
            <span className="text-foreground">{currentProject.name}</span>.
            Integrations are per-project.
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

      <div className="space-y-3">
        {integrations.map((item) => {
          const isGsc = item.id === "gsc";
          const isBing = item.id === "bing";
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
                  <h4 className="text-base font-semibold tracking-tight">
                    {item.name}
                  </h4>
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
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600">
                      <Check className="size-3" />
                      Connected · {gsc.property_uri}
                    </p>
                  )}
                  {isGsc && gscPending && (
                    <p className="mt-2 text-xs text-amber-600">
                      Choose a Search Console property to finish setup
                    </p>
                  )}
                  {isBing && bingConnected && bing?.property_uri && (
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600">
                      <Check className="size-3" />
                      Connected · {bing.property_uri}
                    </p>
                  )}
                  {isBing && bingPending && (
                    <p className="mt-2 text-xs text-amber-600">
                      Choose a Bing Webmaster site to finish setup
                    </p>
                  )}
                </div>
              </div>
              {renderActions(item)}
            </BentoCard>
          );
        })}
      </div>

      {locked && (
        <div className="flex justify-center pt-2">
          <Button
            type="button"
            onClick={() => setAddProjectOpen(true)}
            className="h-10 rounded-full bg-primary px-5 text-primary-foreground shadow-lg shadow-primary/20"
          >
            Add Project
          </Button>
        </div>
      )}
    </div>
  );
}
