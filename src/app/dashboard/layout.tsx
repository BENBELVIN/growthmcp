import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isEmailAllowed } from "@/lib/auth/allowlist";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { MobileNav } from "@/components/dashboard/mobile-nav";

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

  return (
    <div className="dark relative flex min-h-screen bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 grid-fade opacity-60" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(ellipse_55%_45%_at_40%_-10%,rgba(100,180,255,0.12),transparent_70%)]" />
      <DashboardSidebar className="fixed inset-y-0 left-0 z-20 hidden lg:flex" />
      <div className="relative z-10 flex min-h-screen min-w-0 flex-1 flex-col lg:pl-64">
        <MobileNav />
        {children}
      </div>
    </div>
  );
}
