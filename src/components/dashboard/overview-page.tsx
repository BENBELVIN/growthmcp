"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { OverviewHero } from "@/components/dashboard/overview-hero";
import { useWorkspace } from "@/components/dashboard/workspace-provider";
import { Button } from "@/components/ui/button";
import { getOverviewCommandCenter } from "@/lib/growth/actions";
import type { CommandCenterData } from "@/lib/gsc/command-center";

export function OverviewPage() {
  const { user, currentProject, setAddProjectOpen } = useWorkspace();
  const firstName =
    (user.user_metadata?.full_name as string | undefined)?.split(" ")[0] ??
    (user.user_metadata?.name as string | undefined)?.split(" ")[0] ??
    "there";

  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [command, setCommand] = useState<CommandCenterData | null>(null);

  useEffect(() => {
    if (!currentProject) {
      setLoading(false);
      setConnected(false);
      setCommand(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    void getOverviewCommandCenter(currentProject.id).then((res) => {
      if (cancelled) return;
      setLoading(false);
      setConnected(res.connected || Boolean(res.command));
      setError(res.error ?? null);
      setCommand(res.command);
    });

    return () => {
      cancelled = true;
    };
  }, [currentProject]);

  if (!currentProject) {
    return (
      <div className="flex-1 p-6 sm:p-8 lg:p-10">
        <div className="mx-auto w-full max-w-6xl space-y-5">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Hey, {firstName}
          </h2>
          <p className="text-lg text-muted-foreground">
            Add a project to start growing organic traffic.
          </p>
          <Button
            type="button"
            onClick={() => setAddProjectOpen(true)}
            className="h-10 rounded-full bg-primary px-5 text-primary-foreground shadow-lg shadow-primary/20"
          >
            <Plus className="size-4" />
            Add Project
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] flex-1 flex-col p-6 sm:p-8 lg:p-10">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col">
        <OverviewHero
          firstName={firstName}
          projectName={currentProject.name}
          loading={loading}
          connected={connected}
          error={error}
          command={command}
        />
      </div>
    </div>
  );
}
