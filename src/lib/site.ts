export const siteConfig = {
  name: "growseo",
  title: "growseo",
  description:
    "growseo shows you exactly what people are searching for, which pages to create, and what to improve, so you can get more visitors without wasting months guessing.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://growseo.app",
  ogImage: "/icons/icon-512x512.png",
} as const;
