export const siteConfig = {
  name: "growseo",
  title: "growseo",
  description:
    "growseo shows you exactly what people are searching for, which pages to create, and what to improve, so you can get more visitors without wasting months guessing.",
  /** Shorter line for waitlist email + compact UI. */
  waitlistBlurb:
    "See what people search for, which pages to create, and what to improve — without months of guessing.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://growseo.app",
  ogImage: "/icons/icon-512x512.png",
} as const;
