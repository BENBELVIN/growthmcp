import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";
import type { Workspace } from "@/types/database";

/**
 * Returns the user's primary workspace (oldest membership).
 * Creates a default workspace + owner membership if none exists.
 *
 * Insert order matters for RLS: create workspace → add membership → select.
 * Selecting in the same insert().select() fails because membership does not
 * exist yet, so websites/workspace member policies cannot see the row.
 */
export async function ensureCurrentWorkspace(
  userId: string,
  displayName?: string | null
): Promise<Workspace> {
  const supabase = await createClient();

  const { data: membership, error: membershipError } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (membershipError) {
    throw new Error(membershipError.message);
  }

  if (membership?.workspace_id) {
    const { data: workspace, error: workspaceError } = await supabase
      .from("workspaces")
      .select("*")
      .eq("id", membership.workspace_id)
      .single();

    if (workspaceError || !workspace) {
      throw new Error(workspaceError?.message ?? "Workspace not found");
    }

    return workspace;
  }

  const workspaceId = randomUUID();
  const name = `${displayName?.trim() || "My"}'s Workspace`;

  const { error: createError } = await supabase.from("workspaces").insert({
    id: workspaceId,
    owner_id: userId,
    name,
  });

  if (createError) {
    throw new Error(createError.message);
  }

  const { error: memberError } = await supabase.from("workspace_members").insert({
    workspace_id: workspaceId,
    user_id: userId,
    role: "owner",
  });

  if (memberError) {
    throw new Error(memberError.message);
  }

  const { data: workspace, error: fetchError } = await supabase
    .from("workspaces")
    .select("*")
    .eq("id", workspaceId)
    .single();

  if (fetchError || !workspace) {
    throw new Error(fetchError?.message ?? "Workspace created but could not be loaded");
  }

  return workspace;
}
