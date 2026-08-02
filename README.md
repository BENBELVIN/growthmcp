# growseo

Grow your product with organic traffic.

growseo is a Next.js app with a marketing site, SEO blog, and dashboard for analysing search demand, website visibility, and ranking opportunities.

## Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (auth + data)
- Markdown blog (`content/blog/`)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the landing page, [http://localhost:3000/blog](http://localhost:3000/blog) for the blog, or [http://localhost:3000/dashboard](http://localhost:3000/dashboard) for the app.

## Project structure

- `src/app/(marketing)/` — Landing page and blog
- `src/app/dashboard/` — Authenticated SEO dashboard
- `content/blog/` — Markdown blog posts
- `src/lib/blog/` — Blog content layer
- `src/lib/site.ts` — Site name, URL, and SEO defaults
- `public/icons/` — Favicon and PWA icon sizes

## Environment

Set `NEXT_PUBLIC_SITE_URL=https://growseo.app` in production for canonical URLs, sitemap, and Open Graph.
