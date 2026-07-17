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
      <span className="relative flex size-8 shrink-0 items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logos/growthmcp.png"
          alt=""
          width={32}
          height={32}
          className="size-8 object-contain"
          aria-hidden
        />
      </span>
      {showWordmark && (
        <span className="text-[15px] font-semibold tracking-tight">
          GrowthMCP
        </span>
      )}
    </Link>
  );
}
