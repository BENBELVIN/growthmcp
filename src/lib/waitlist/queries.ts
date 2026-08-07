import { createAdminClient } from "@/lib/supabase/admin";

export async function getWaitlistCount() {
  try {
    const admin = createAdminClient();
    const { count, error } = await admin
      .from("waitlist_signups")
      .select("*", { count: "exact", head: true })
      .in("status", ["pending", "invited"]);

    if (error) {
      console.error("[waitlist] count error:", error);
      return 0;
    }

    return count ?? 0;
  } catch {
    return 0;
  }
}
