import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { Workspace } from "@/types/database";

/**
 * Returns the user's primary workspace.
 * Uses a SECURITY DEFINER RPC to create profile + workspace + membership
 * when missing (avoids client-side GRANT/RLS chicken-and-egg issues).
 */
export async function ensureCurrentWorkspace(_user: User): Promise<Workspace> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("bootstrap_user_account");

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Failed to load workspace");
  }

  // rpc may return a single object or array depending on PostgREST typing
  const workspace = (Array.isArray(data) ? data[0] : data) as Workspace;

  if (!workspace?.id) {
    throw new Error("Failed to load workspace");
  }

  return workspace;
}
