"use client";

import { Globe, Plus } from "lucide-react";
import { BentoCard } from "@/components/dashboard/bento-card";
import { useWorkspace } from "@/components/dashboard/workspace-provider";
import { Button } from "@/components/ui/button";

export function ConnectProjectOnboarding() {
  const { setAddProjectOpen } = useWorkspace();

  return (
    <div className="flex flex-1 items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-muted ring-1 ring-border">
            <Globe className="size-6 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Connect your first project
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Add a site to analyze. Integrations and growth data attach to this
            project.
          </p>
        </div>

        <BentoCard className="flex flex-col items-center gap-4 p-6 sm:p-8">
          <p className="text-center text-sm text-muted-foreground">
            A project is your site context — like a Vercel project or Google
            Cloud project.
          </p>
          <Button
            type="button"
            onClick={() => setAddProjectOpen(true)}
            className="h-11 w-full rounded-full bg-primary text-primary-foreground sm:w-auto sm:px-8"
          >
            <Plus className="size-4" />
            Add Project
          </Button>
        </BentoCard>
      </div>
    </div>
  );
}
