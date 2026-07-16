import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  href = "/",
  showWordmark = true,
}: {
  className?: string;
  href?: string;
  showWordmark?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2.5 text-foreground transition-opacity hover:opacity-90",
        className
      )}
    >
      <span className="relative flex size-8 items-center justify-center rounded-lg bg-brand/15 ring-1 ring-brand/30">
        <span className="absolute inset-0 rounded-lg bg-brand/20 blur-md" />
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="relative size-4 text-brand"
          aria-hidden
        >
          <path
            d="M4 16.5L9.2 7.8c.4-.7 1.4-.7 1.8 0L14 13l1.3-2.2c.4-.7 1.4-.7 1.8 0L20 16.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="18.5" cy="6.5" r="1.6" fill="currentColor" />
        </svg>
      </span>
      {showWordmark && (
        <span className="text-[15px] font-semibold tracking-tight">
          GrowthMCP
        </span>
      )}
    </Link>
  );
}
