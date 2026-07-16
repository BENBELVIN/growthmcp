# GrowthMCP

Give your AI the context to grow your product.

GrowthMCP is a Next.js app with a marketing site and authenticated-style dashboard for an AI Growth MCP server—connecting Search Console, Trends, analytics, and social data to coding agents via Model Context Protocol.

## Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Framer Motion
- Lucide Icons

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the landing page, or [http://localhost:3000/dashboard](http://localhost:3000/dashboard) for the growth OS dashboard.

## Project structure

- `src/app/` — Marketing pages, docs, and dashboard routes
- `src/components/marketing/` — Landing sections
- `src/components/dashboard/` — Dashboard shell and panels
- `src/components/ui/` — shadcn primitives
- `src/lib/data/` — Placeholder datasets ready to swap for real MCP/API responses
