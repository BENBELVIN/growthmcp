import { DashboardSidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark flex min-h-screen bg-background text-foreground">
      <DashboardSidebar className="hidden lg:flex" />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
