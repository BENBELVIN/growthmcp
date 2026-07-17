"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureCurrentWorkspace } from "@/lib/workspace/ensure-workspace";
import {
  getActiveContextCookies,
  setActiveContextCookies,
} from "@/lib/workspace/context-cookies";
import { normalizeWebsiteUrl } from "@/lib/websites/queries";
import { resolveProjectLogo } from "@/lib/websites/resolve-logo";

export type ProjectActionState = {
  error?: string;
  projectId?: string;
};

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return { supabase, user };
}

async function assertWorkspaceMembership(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  workspaceId: string
) {
  const { data, error } = await supabase
    .from("workspace_members")
    .select("id")
    .eq("workspace_id", workspaceId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) {
    return false;
  }

  return true;
}

export async function createProject(
  _prev: ProjectActionState,
  formData: FormData
): Promise<ProjectActionState> {
  const { supabase, user } = await requireUser();
  const fallbackWorkspace = await ensureCurrentWorkspace(user);
  const cookies = await getActiveContextCookies();

  const name = String(formData.get("name") ?? "").trim();
  const rawUrl = String(formData.get("url") ?? "").trim();
  const url = normalizeWebsiteUrl(rawUrl);

  if (!name) {
    return { error: "Project name is required." };
  }

  if (!url) {
    return { error: "Enter a valid URL (e.g. https://glppal.app)." };
  }

  const requestedWorkspaceId =
    String(formData.get("workspace_id") ?? "").trim() ||
    cookies.workspaceId ||
    fallbackWorkspace.id;

  const isMember = await assertWorkspaceMembership(
    supabase,
    user.id,
    requestedWorkspaceId
  );

  if (!isMember) {
    return { error: "You do not have access to this workspace." };
  }

  const logoUrl = await resolveProjectLogo(url);

  let { data, error } = await supabase
    .from("websites")
    .insert({
      workspace_id: requestedWorkspaceId,
      name,
      url,
      logo_url: logoUrl,
    })
    .select("id")
    .single();

  // Graceful if logo_url migration not applied yet
  if (error?.message?.includes("logo_url")) {
    ({ data, error } = await supabase
      .from("websites")
      .insert({
        workspace_id: requestedWorkspaceId,
        name,
        url,
      })
      .select("id")
      .single());
  }

  if (error || !data) {
    return { error: error?.message ?? "Failed to create project" };
  }

  await setActiveContextCookies(requestedWorkspaceId, data.id);
  revalidatePath("/dashboard", "layout");
  redirect("/dashboard");
}

export async function updateProject(
  projectId: string,
  _prev: ProjectActionState,
  formData: FormData
): Promise<ProjectActionState> {
  const { supabase, user } = await requireUser();

  const name = String(formData.get("name") ?? "").trim();
  const rawUrl = String(formData.get("url") ?? "").trim();
  const url = normalizeWebsiteUrl(rawUrl);

  if (!name) {
    return { error: "Project name is required." };
  }

  if (!url) {
    return { error: "Enter a valid URL (e.g. https://glppal.app)." };
  }

  const { data: existing, error: lookupError } = await supabase
    .from("websites")
    .select("id, workspace_id")
    .eq("id", projectId)
    .maybeSingle();

  if (lookupError || !existing) {
    return { error: lookupError?.message ?? "Project not found." };
  }

  const isMember = await assertWorkspaceMembership(
    supabase,
    user.id,
    existing.workspace_id
  );

  if (!isMember) {
    return { error: "You do not have access to this project." };
  }

  const logoUrl = await resolveProjectLogo(url);

  const { error } = await supabase
    .from("websites")
    .update({ name, url, logo_url: logoUrl })
    .eq("id", projectId)
    .eq("workspace_id", existing.workspace_id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard", "layout");
  redirect("/dashboard");
}

export async function deleteProject(projectId: string) {
  const { supabase, user } = await requireUser();
  const cookies = await getActiveContextCookies();

  const { data: existing, error: lookupError } = await supabase
    .from("websites")
    .select("id, workspace_id")
    .eq("id", projectId)
    .maybeSingle();

  if (lookupError || !existing) {
    throw new Error(lookupError?.message ?? "Project not found");
  }

  const isMember = await assertWorkspaceMembership(
    supabase,
    user.id,
    existing.workspace_id
  );

  if (!isMember) {
    throw new Error("You do not have access to this project.");
  }

  const { error } = await supabase
    .from("websites")
    .delete()
    .eq("id", projectId)
    .eq("workspace_id", existing.workspace_id);

  if (error) {
    throw new Error(error.message);
  }

  if (cookies.websiteId === projectId) {
    await setActiveContextCookies(existing.workspace_id, null);
  }

  revalidatePath("/dashboard", "layout");
  redirect("/dashboard");
}
