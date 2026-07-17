"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import type { Website, Workspace } from "@/types/database";
import { setActiveProject as setActiveProjectAction } from "@/lib/workspace/actions";

type WorkspaceContextValue = {
  user: User;
  workspaces: Workspace[];
  projects: Website[];
  currentWorkspace: Workspace;
  currentProject: Website | null;
  currentWorkspaceId: string;
  currentProjectId: string | null;
  setActiveProject: (projectId: string) => void;
  isSwitching: boolean;
  addProjectOpen: boolean;
  setAddProjectOpen: (open: boolean) => void;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({
  user,
  workspaces,
  projects,
  currentWorkspace,
  currentProject,
  children,
}: {
  user: User;
  workspaces: Workspace[];
  projects: Website[];
  currentWorkspace: Workspace;
  currentProject: Website | null;
  children: ReactNode;
}) {
  const [addProjectOpen, setAddProjectOpen] = useState(false);
  const [isSwitching, startTransition] = useTransition();

  const setActiveProject = useCallback((projectId: string) => {
    startTransition(() => {
      void setActiveProjectAction(projectId);
    });
  }, []);

  const value = useMemo<WorkspaceContextValue>(
    () => ({
      user,
      workspaces,
      projects,
      currentWorkspace,
      currentProject,
      currentWorkspaceId: currentWorkspace.id,
      currentProjectId: currentProject?.id ?? null,
      setActiveProject,
      isSwitching,
      addProjectOpen,
      setAddProjectOpen,
    }),
    [
      user,
      workspaces,
      projects,
      currentWorkspace,
      currentProject,
      setActiveProject,
      isSwitching,
      addProjectOpen,
    ]
  );

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) {
    throw new Error("useWorkspace must be used within WorkspaceProvider");
  }
  return ctx;
}
