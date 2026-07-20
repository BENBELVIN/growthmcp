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
import { enginePaths } from "@/lib/data/dashboard";
import type {
  BingConnectionPublic,
  GscConnectionPublic,
} from "@/types/database";

type IntegrationId =
  | "gsc"
  | "bing"
  | "trends"
  | "tiktok"
  | "instagram"
  | "x"
  | "linkedin"
  | "asc"
  | "play"
  | "revenuecat"
  | "posthog";

type IntegrationDef = {
  id: IntegrationId;
  name: string;
  description: string;
  logo: string | null;
  badge: string | null;
  live?: boolean;
};

type Category = {
  id: "demand" | "supply" | "convert";
  title: string;
  items: IntegrationDef[];
};

const categories: Category[] = [
  {
    id: "demand",
    title: "Demand Layer",
    items: [
      {
        id: "trends",
        name: "Google Trends",
        description:
          "Rising topics and demand signals synced into growth opportunities.",
        logo: "/logos/trends.png",
        badge: null,
        live: true,
      },
    ],
  },
  {
    id: "supply",
    title: "Supply Layer",
    items: [
      {
        id: "gsc",
        name: "Google Search Console",
        description:
          "Queries, pages, CTR, and position changes for this project.",
        logo: "/logos/gsc.svg",
        badge: null,
        live: true,
      },
      {
        id: "bing",
        name: "Bing Webmaster",
        description:
          "Bing clicks, impressions, and early ranking signals for this project.",
        logo: "/logos/bing.svg",
        badge: null,
        live: true,
      },
      {
        id: "tiktok",
        name: "TikTok",
        description: "Views, engagement, and winning hook patterns.",
        logo: "/logos/tiktok.svg",
        badge: null,
      },
      {
        id: "instagram",
        name: "Instagram",
        description: "Reels and post performance for this project.",
        logo: "/logos/instagram.svg",
        badge: null,
      },
      {
        id: "x",
        name: "X",
        description: "Posts, impressions, and engagement signals.",
        logo: "/logos/x.svg",
        badge: null,
      },
      {
        id: "linkedin",
        name: "LinkedIn",
        description: "Professional publishing and tracking for this project.",
        logo: null,
        badge: "IN",
      },
    ],
  },
  {
    id: "convert",
    title: "Convert Layer",
    items: [
      {
        id: "asc",
        name: "App Store Connect",
        description: "Downloads, ratings, and listing conversion.",
        logo: "/logos/app-store.svg",
        badge: null,
      },
      {
        id: "play",
        name: "Google Play Console",
        description: "Installs, ratings, and store listing performance.",
        logo: null,
        badge: "GP",
      },
      {
        id: "revenuecat",
        name: "RevenueCat",
        description: "Subscriptions and revenue for this project.",
        logo: "/logos/revenuecat.svg",
        badge: null,
      },
      {
        id: "posthog",
        name: "PostHog",
        description: "Product analytics and conversion funnels.",
        logo: "/logos/posthog.svg",
        badge: null,
      },
    ],
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
                `${enginePaths.gsc}?websiteId=${currentProject.id}`
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
          className="h-10 shrink-0 rounded-full bg-primary px-5 text-primary-foreground"
          onClick={() =>
            router.push(
              `${enginePaths.gsc}?websiteId=${currentProject.id}`
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
          className="h-10 shrink-0 rounded-full bg-primary px-5 text-primary-foreground"
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
                `${enginePaths.bing}?websiteId=${currentProject.id}`
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
          className="h-10 shrink-0 rounded-full bg-primary px-5 text-primary-foreground"
          onClick={() =>
            router.push(
              `${enginePaths.bing}?websiteId=${currentProject.id}`
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
          className="h-10 shrink-0 rounded-full bg-primary px-5 text-primary-foreground"
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
          onClick={() => router.push("/dashboard/demand")}
        >
          Open in Demand
        </Button>
      );
    }

    return (
      <Button
        type="button"
        variant="outline"
        disabled
        className="h-10 shrink-0 rounded-full px-5"
      >
        Soon
      </Button>
    );
  }

  return (
    <div className="flex-1 p-6 sm:p-8 lg:p-10">
      <div className="mx-auto w-full max-w-6xl space-y-8">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">
            Connected accounts
          </h3>
          {locked ? (
            <p className="mt-2 text-sm text-muted-foreground">
              No project selected. Add a project to connect data sources.
              Integrations belong to projects, not users.
            </p>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              Connected to project{" "}
              <span className="text-foreground">{currentProject.name}</span> —
              grouped by Demand, Supply, and Convert.
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

        {categories.map((category) => (
          <section key={category.id} className="space-y-4">
            <h3 className="text-sm font-semibold tracking-tight">
              {category.title}
            </h3>
            <div className="space-y-3">
              {category.items.map((item) => {
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
                        {isBing && bingConnected && bing?.property_uri && (
                          <p className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400">
                            <Check className="size-3" />
                            Connected · {bing.property_uri}
                          </p>
                        )}
                        {isBing && bingPending && (
                          <p className="mt-2 text-xs text-amber-400">
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
          </section>
        ))}

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
