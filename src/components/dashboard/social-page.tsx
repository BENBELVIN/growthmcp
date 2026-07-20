"use client";

import Link from "next/link";
import { ArrowUpRight, Lock } from "lucide-react";
import { useWorkspace } from "@/components/dashboard/workspace-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const PLATFORMS = [
  {
    id: "tiktok",
    name: "TikTok",
    status: "soon" as const,
    description: "Views, engagement, and winning hook patterns.",
  },
  {
    id: "instagram",
    name: "Instagram",
    status: "soon" as const,
    description: "Reels and post performance for this project.",
  },
  {
    id: "x",
    name: "X",
    status: "soon" as const,
    description: "Posts, impressions, and engagement signals.",
  },
  {
    id: "youtube-shorts",
    name: "YouTube Shorts",
    status: "future" as const,
    description: "Short-form video performance — coming later.",
  },
] as const;

export function SocialPage() {
  const { currentProject, setAddProjectOpen } = useWorkspace();

  if (!currentProject) {
    return (
      <div className="flex-1 p-6 sm:p-8 lg:p-10">
        <div className="mx-auto w-full max-w-6xl space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Social</h2>
          <p className="text-muted-foreground">
            Select a project to connect social growth channels.
          </p>
          <Button
            type="button"
            onClick={() => setAddProjectOpen(true)}
            className="h-10 rounded-full"
          >
            Add Project
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 sm:p-8 lg:p-10">
      <div className="mx-auto w-full max-w-6xl space-y-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Social
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              Identify what content is working for{" "}
              <span className="text-foreground">{currentProject.name}</span>
            </p>
          </div>
          <Button variant="outline" className="h-9 rounded-full" asChild>
            <Link href="/dashboard/engine/integrations">
              Manage integrations
              <ArrowUpRight className="size-3.5" />
            </Link>
          </Button>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Content performance", value: "—" },
            { label: "Views", value: "—" },
            { label: "Engagement", value: "—" },
            { label: "Best hooks", value: "—" },
          ].map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl border border-border/70 p-5"
            >
              <p className="text-xs text-muted-foreground">{metric.label}</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">
                {metric.value}
              </p>
            </div>
          ))}
        </section>

        <section className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold tracking-tight">Platforms</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Connect a platform to surface views growth, hooks, and content
              patterns.
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {PLATFORMS.map((platform) => (
              <li
                key={platform.id}
                className="flex items-start justify-between gap-4 rounded-2xl border border-border/70 p-5"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-medium tracking-tight">
                      {platform.name}
                    </h4>
                    <Badge variant="outline" className="h-5 font-normal">
                      {platform.status === "future" ? "Future" : "Soon"}
                    </Badge>
                  </div>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {platform.description}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="h-8 shrink-0 rounded-full"
                >
                  <Lock className="size-3.5" />
                  Connect
                </Button>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-dashed border-border/70 px-6 py-10 text-center">
          <p className="text-sm text-muted-foreground">
            Content patterns and winning hooks will appear here once a social
            integration is connected to this project.
          </p>
        </section>
      </div>
    </div>
  );
}
