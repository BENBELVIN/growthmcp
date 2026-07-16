import { cn } from "@/lib/utils";

export function BentoCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}
