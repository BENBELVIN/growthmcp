import { createClient } from "@/lib/supabase/server";
import type { Workspace } from "@/types/database";

export async function listUserWorkspaces(userId: string): Promise<Workspace[]> {
  const supabase = await createClient();

  const { data: memberships, error } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const ids = (memberships ?? []).map((m) => m.workspace_id);
  if (ids.length === 0) return [];

  const { data: workspaces, error: wsError } = await supabase
    .from("workspaces")
    .select("*")
    .in("id", ids);

  if (wsError) {
    throw new Error(wsError.message);
  }

  // Preserve membership order
  const byId = new Map((workspaces ?? []).map((w) => [w.id, w]));
  return ids.map((id) => byId.get(id)).filter(Boolean) as Workspace[];
}
