import { EngineSubnav } from "@/components/dashboard/engine-subnav";

export default function EngineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <EngineSubnav />
      {children}
    </div>
  );
}
