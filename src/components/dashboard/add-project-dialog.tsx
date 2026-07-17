"use client";

import { Dialog, DialogBody, DialogHeader } from "@/components/dashboard/dialog";
import { AddProjectForm } from "@/components/dashboard/add-project-form";
import { useWorkspace } from "@/components/dashboard/workspace-provider";

export function AddProjectDialog() {
  const { addProjectOpen, setAddProjectOpen } = useWorkspace();

  return (
    <Dialog open={addProjectOpen} onOpenChange={setAddProjectOpen}>
      <DialogHeader
        title="Add Project"
        description="Projects are the sites GrowthMCP analyzes. Integrations and growth data attach to the project you select."
        onClose={() => setAddProjectOpen(false)}
      />
      <DialogBody>
        <AddProjectForm onSuccess={() => setAddProjectOpen(false)} />
      </DialogBody>
    </Dialog>
  );
}
