import type { Metadata } from "next";
import type { BlogPostMeta } from "./types";

import { siteConfig } from "@/lib/site";

const siteUrl = siteConfig.url;

export function blogIndexMetadata(): Metadata {
  return {
    title: "Blog",
    description:
      "SEO guides for indie hackers and SaaS founders. Keywords, rankings, and organic growth.",
    alternates: {
      canonical: `${siteUrl}/blog`,
    },
    openGraph: {
      title: "Blog · growseo",
      description:
        "SEO guides for indie hackers and SaaS founders.",
      url: `${siteUrl}/blog`,
      type: "website",
    },
  };
}

export function blogPostMetadata(post: BlogPostMeta): Metadata {
  const url = `${siteUrl}/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}
