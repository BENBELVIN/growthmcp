# Blog posts

Add a new `.md` file to publish a post.

## Frontmatter

```yaml
---
title: "Post title"
description: "Short summary for SEO and cards"
slug: optional-custom-slug  # defaults to filename
publishedAt: "2026-08-01"
updatedAt: "2026-08-02"     # optional
author: growseo
tags:
  - seo
  - saas
published: true              # set false to hide from /blog
---
```

## Workflow

1. Create `content/blog/your-post-slug.md`
2. Set `published: true`
3. Deploy — Next.js static-generates `/blog/[slug]` and adds it to `/sitemap.xml`

Drafts (`published: false`) stay out of the index and sitemap.
