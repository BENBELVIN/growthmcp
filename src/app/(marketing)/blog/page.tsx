import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PostCard } from "@/components/blog/post-card";
import { getAllPosts } from "@/lib/blog/posts";
import { blogIndexMetadata } from "@/lib/blog/metadata";

export const metadata = blogIndexMetadata();

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(20,160,140,0.1),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 grid-fade-light" />

      <div className="relative mx-auto max-w-3xl px-6 py-16 sm:py-20">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Home
        </Link>

        <header className="mt-8 space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Blog
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            Practical SEO for indie hackers and SaaS founders. Keywords,
            rankings, and how to grow organic traffic without guessing.
          </p>
        </header>

        {posts.length === 0 ? (
          <p className="mt-12 rounded-3xl border border-border bg-card px-6 py-10 text-center text-sm text-muted-foreground shadow-sm">
            New posts coming soon.
          </p>
        ) : (
          <div className="mt-12 grid gap-4">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
