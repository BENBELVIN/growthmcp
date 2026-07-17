"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { setActiveContextCookies } from "@/lib/workspace/context-cookies";

export async function setActiveProject(projectId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: project, error } = await supabase
    .from("websites")
    .select("id, workspace_id")
    .eq("id", projectId)
    .single();

  if (error || !project) {
    throw new Error(error?.message ?? "Project not found");
  }

  await setActiveContextCookies(project.workspace_id, project.id);
  revalidatePath("/dashboard", "layout");
}
