export type BlogPostMeta = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  tags: string[];
  published: boolean;
  readingTimeMinutes: number;
};

export type BlogPost = BlogPostMeta & {
  content: string;
};

export type BlogPostFrontmatter = {
  title: string;
  description: string;
  slug?: string;
  publishedAt: string;
  updatedAt?: string;
  author?: string;
  tags?: string[];
  published?: boolean;
};
