"use client";

import { useActionState, useEffect } from "react";
import {
  createProject,
  type ProjectActionState,
} from "@/lib/websites/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWorkspace } from "@/components/dashboard/workspace-provider";

const initialState: ProjectActionState = {};

export function AddProjectForm({
  onSuccess,
  submitLabel = "Add Project",
}: {
  onSuccess?: () => void;
  submitLabel?: string;
}) {
  const { currentWorkspaceId } = useWorkspace();
  const [state, formAction, pending] = useActionState(
    createProject,
    initialState
  );

  useEffect(() => {
    if (state.projectId) onSuccess?.();
  }, [state.projectId, onSuccess]);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="workspace_id" value={currentWorkspaceId} />

      <div className="space-y-2">
        <Label htmlFor="project-name">Project Name</Label>
        <Input
          id="project-name"
          name="name"
          required
          placeholder="GLPPal"
          autoComplete="organization"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="project-url">URL</Label>
        <Input
          id="project-url"
          name="url"
          type="text"
          required
          placeholder="https://glppal.app"
          autoComplete="url"
          inputMode="url"
        />
      </div>

      {state.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}

      <Button
        type="submit"
        disabled={pending}
        className="h-11 w-full rounded-full bg-primary text-primary-foreground"
      >
        {pending ? "Adding…" : submitLabel}
      </Button>
    </form>
  );
}
