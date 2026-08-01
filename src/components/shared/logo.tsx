import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  href = "/",
  showWordmark = true,
}: {
  className?: string;
  href?: string;
  /** When false, shows only the icon portion of the wordmark. */
  showWordmark?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center text-foreground transition-opacity hover:opacity-90",
        className
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logos/growseo.png"
        alt="growseo"
        width={showWordmark ? 152 : 32}
        height={32}
        className={cn(
          "h-8 shrink-0 object-contain",
          showWordmark ? "w-auto" : "w-8 object-left object-cover"
        )}
      />
    </Link>
  );
}
