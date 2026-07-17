import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isEmailAllowed } from "@/lib/auth/allowlist";
import { ensureCurrentWorkspace } from "@/lib/workspace/ensure-workspace";
import { listUserWorkspaces } from "@/lib/workspace/list-workspaces";
import { listWebsites } from "@/lib/websites/queries";
import { getActiveContextCookies } from "@/lib/workspace/context-cookies";
import { WorkspaceProvider } from "@/components/dashboard/workspace-provider";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardTopNav } from "@/components/dashboard/top-nav";
import { AddProjectDialog } from "@/components/dashboard/add-project-dialog";
import { ConnectProjectOnboarding } from "@/components/dashboard/connect-project-onboarding";
import type { Website, Workspace } from "@/types/database";

async function resolveActiveContext(
  workspaces: Workspace[],
  projects: Website[],
  cookieWorkspaceId: string | null,
  cookieProjectId: string | null
) {
  const currentWorkspace =
    workspaces.find((w) => w.id === cookieWorkspaceId) ?? workspaces[0];

  if (cookieProjectId) {
    const project = projects.find((p) => p.id === cookieProjectId);
    if (project) {
      const ws = workspaces.find((w) => w.id === project.workspace_id);
      if (ws) {
        return { currentWorkspace: ws, currentProject: project };
      }
    }
  }

  const workspaceProjects = projects.filter(
    (project) => project.workspace_id === currentWorkspace.id
  );

  const currentProject =
    workspaceProjects.find((project) => project.id === cookieProjectId) ??
    workspaceProjects[0] ??
    null;

  return { currentWorkspace, currentProject };
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (!isEmailAllowed(user.email)) {
    await supabase.auth.signOut();
    redirect("/login?error=unauthorized");
  }

  const primaryWorkspace = await ensureCurrentWorkspace(user);
  const workspaces = await listUserWorkspaces(user.id);
  const ensuredWorkspaces =
    workspaces.length > 0 ? workspaces : [primaryWorkspace];

  // One workspace for now — projects belong to the primary workspace
  const currentWorkspace = ensuredWorkspaces[0] ?? primaryWorkspace;

  const projects = await listWebsites(currentWorkspace.id);

  const cookies = await getActiveContextCookies();
  const { currentProject } = await resolveActiveContext(
    [currentWorkspace],
    projects,
    currentWorkspace.id,
    cookies.websiteId
  );

  const needsOnboarding = projects.length === 0;

  return (
    <div className="dark relative flex min-h-screen flex-col bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 grid-fade opacity-60" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(ellipse_55%_45%_at_40%_-10%,rgba(100,180,255,0.12),transparent_70%)]" />

      <WorkspaceProvider
        user={user}
        workspaces={[currentWorkspace]}
        projects={projects}
        currentWorkspace={currentWorkspace}
        currentProject={currentProject}
      >
        <div className="relative z-10 flex min-h-screen flex-col">
          <DashboardTopNav />
          <div className="flex min-h-0 flex-1">
            <DashboardSidebar className="sticky top-14 hidden h-[calc(100vh-3.5rem)] lg:flex" />
            <div className="flex min-w-0 flex-1 flex-col">
              {needsOnboarding ? (
                <ConnectProjectOnboarding />
              ) : (
                children
              )}
            </div>
          </div>
        </div>
        <AddProjectDialog />
      </WorkspaceProvider>
    </div>
  );
}
