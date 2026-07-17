"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureCurrentWorkspace } from "@/lib/workspace/ensure-workspace";
import { normalizeWebsiteUrl } from "@/lib/websites/queries";

export type WebsiteActionState = {
  error?: string;
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

export async function createWebsite(
  _prev: WebsiteActionState,
  formData: FormData
): Promise<WebsiteActionState> {
  const { supabase, user } = await requireUser();
  const workspace = await ensureCurrentWorkspace(
    user.id,
    user.user_metadata?.full_name ?? user.user_metadata?.name
  );

  const name = String(formData.get("name") ?? "").trim();
  const rawUrl = String(formData.get("url") ?? "").trim();
  const url = normalizeWebsiteUrl(rawUrl);

  if (!name) {
    return { error: "Website name is required." };
  }

  if (!url) {
    return { error: "Enter a valid URL (e.g. https://glppal.app)." };
  }

  const { error } = await supabase.from("websites").insert({
    workspace_id: workspace.id,
    name,
    url,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/websites");
  revalidatePath("/dashboard");
  redirect("/dashboard/websites");
}

export async function updateWebsite(
  websiteId: string,
  _prev: WebsiteActionState,
  formData: FormData
): Promise<WebsiteActionState> {
  const { supabase, user } = await requireUser();
  const workspace = await ensureCurrentWorkspace(
    user.id,
    user.user_metadata?.full_name ?? user.user_metadata?.name
  );

  const name = String(formData.get("name") ?? "").trim();
  const rawUrl = String(formData.get("url") ?? "").trim();
  const url = normalizeWebsiteUrl(rawUrl);

  if (!name) {
    return { error: "Website name is required." };
  }

  if (!url) {
    return { error: "Enter a valid URL (e.g. https://glppal.app)." };
  }

  const { error } = await supabase
    .from("websites")
    .update({ name, url })
    .eq("id", websiteId)
    .eq("workspace_id", workspace.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/websites");
  revalidatePath(`/dashboard/websites/${websiteId}`);
  redirect(`/dashboard/websites/${websiteId}`);
}

export async function deleteWebsite(websiteId: string) {
  const { supabase, user } = await requireUser();
  const workspace = await ensureCurrentWorkspace(
    user.id,
    user.user_metadata?.full_name ?? user.user_metadata?.name
  );

  const { error } = await supabase
    .from("websites")
    .delete()
    .eq("id", websiteId)
    .eq("workspace_id", workspace.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/websites");
  revalidatePath("/dashboard");
  redirect("/dashboard/websites");
}
