import Link from "next/link";
import type { BlogPostMeta } from "@/lib/blog/types";
import { Badge } from "@/components/ui/badge";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function PostCard({ post }: { post: BlogPostMeta }) {
  return (
    <article className="group rounded-3xl border border-border bg-card p-6 shadow-sm transition-colors hover:border-brand/30">
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        <span>·</span>
        <span>{post.readingTimeMinutes} min read</span>
      </div>
      <h2 className="mt-3 text-xl font-semibold tracking-tight">
        <Link
          href={`/blog/${post.slug}`}
          className="transition-colors group-hover:text-brand"
        >
          {post.title}
        </Link>
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {post.description}
      </p>
      {post.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="font-normal">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </article>
  );
}
