import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { BlogPost, BlogPostFrontmatter, BlogPostMeta } from "./types";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

function estimateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

function slugFromFilename(filename: string): string {
  return filename.replace(/\.md$/, "");
}

function parsePostFile(filename: string): BlogPost | null {
  const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf8");
  const { data, content } = matter(raw);
  const fm = data as BlogPostFrontmatter;

  if (!fm.title || !fm.description || !fm.publishedAt) {
    return null;
  }

  const slug = fm.slug ?? slugFromFilename(filename);
  const published = fm.published !== false;

  const meta: BlogPostMeta = {
    slug,
    title: fm.title,
    description: fm.description,
    publishedAt: fm.publishedAt,
    updatedAt: fm.updatedAt,
    author: fm.author ?? "growseo",
    tags: fm.tags ?? [],
    published,
    readingTimeMinutes: estimateReadingTime(content),
  };

  return { ...meta, content: content.trim() };
}

function listPostFilenames(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith(".md"));
}

export function getAllPosts(includeDrafts = false): BlogPostMeta[] {
  return listPostFilenames()
    .map((filename) => parsePostFile(filename))
    .filter((post): post is BlogPost => post !== null)
    .filter((post) => includeDrafts || post.published)
    .map(({ content, ...meta }) => {
      void content;
      return meta;
    })
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}

export function getPostBySlug(
  slug: string,
  includeDrafts = false
): BlogPost | null {
  const filename = `${slug}.md`;
  if (!listPostFilenames().includes(filename)) {
    const match = listPostFilenames().find((file) => {
      const post = parsePostFile(file);
      return post?.slug === slug;
    });
    if (!match) return null;
    const post = parsePostFile(match);
    if (!post || (!includeDrafts && !post.published)) return null;
    return post;
  }

  const post = parsePostFile(filename);
  if (!post || (!includeDrafts && !post.published)) return null;
  return post;
}

export function getAllPostSlugs(includeDrafts = false): string[] {
  return getAllPosts(includeDrafts).map((post) => post.slug);
}
