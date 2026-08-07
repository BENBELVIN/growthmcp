"use client";

import { useState } from "react";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { fallbackProjectLogo } from "@/lib/websites/logo-fallback";

/** iOS-style squircle — keep in static strings so Tailwind picks it up. */
const squircle = "rounded-[22%]";

const sizeStyles = {
  sm: {
    tile: "size-5",
    icon: "size-3",
    px: 20,
  },
  md: {
    tile: "size-8",
    icon: "size-4",
    px: 32,
  },
  lg: {
    tile: "size-16 sm:size-20",
    icon: "size-8",
    px: 80,
  },
  xl: {
    tile: "size-24 sm:size-28",
    icon: "size-10",
    px: 112,
  },
} as const;

export function ProjectLogo({
  name,
  url,
  logoUrl,
  className,
  size = "sm",
}: {
  name: string;
  url: string;
  logoUrl?: string | null;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const [failed, setFailed] = useState(false);
  const src = logoUrl || fallbackProjectLogo(url);
  const s = sizeStyles[size];

  return (
    <span
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden bg-muted/30 shadow-sm ring-1 ring-border",
        squircle,
        s.tile,
        className
      )}
      aria-hidden
      title={name}
    >
      {failed ? (
        <Globe className={cn("text-muted-foreground", s.icon)} />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          width={s.px}
          height={s.px}
          referrerPolicy="no-referrer"
          className={cn("size-full object-cover", squircle)}
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}
