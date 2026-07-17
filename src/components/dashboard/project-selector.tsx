"use client";

import { Check, ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWorkspace } from "@/components/dashboard/workspace-provider";
import { ProjectLogo } from "@/components/dashboard/project-logo";
import { cn } from "@/lib/utils";

export function ProjectSelector() {
  const {
    currentWorkspace,
    currentProject,
    projects,
    setActiveProject,
    isSwitching,
    setAddProjectOpen,
  } = useWorkspace();

  const workspaceProjects = projects.filter(
    (p) => p.workspace_id === currentWorkspace.id
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          disabled={isSwitching}
          className="h-9 max-w-[240px] gap-2 rounded-full border-border/80 bg-muted/30 px-3.5 font-medium shadow-sm"
        >
          {currentProject ? (
            <ProjectLogo
              name={currentProject.name}
              url={currentProject.url}
              logoUrl={currentProject.logo_url}
            />
          ) : null}
          <span className="truncate">
            {currentProject?.name ?? "Select project"}
          </span>
          <ChevronDown className="size-3.5 shrink-0 opacity-60" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="center" className="w-72 p-1.5">
        <DropdownMenuLabel className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
          Projects
        </DropdownMenuLabel>

        {workspaceProjects.length === 0 ? (
          <p className="px-2.5 py-2 text-sm text-muted-foreground">
            No projects yet
          </p>
        ) : (
          workspaceProjects.map((project) => {
            const active = project.id === currentProject?.id;
            return (
              <DropdownMenuItem
                key={project.id}
                className="cursor-pointer gap-2 rounded-lg"
                onSelect={() => setActiveProject(project.id)}
              >
                <Check
                  className={cn(
                    "size-3.5 shrink-0",
                    active ? "opacity-100" : "opacity-0"
                  )}
                />
                <ProjectLogo
                  name={project.name}
                  url={project.url}
                  logoUrl={project.logo_url}
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate">{project.name}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {project.url.replace(/^https?:\/\//, "")}
                  </div>
                </div>
              </DropdownMenuItem>
            );
          })
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer gap-2 rounded-lg"
          onSelect={() => setAddProjectOpen(true)}
        >
          <Plus className="size-3.5" />
          Add Project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
