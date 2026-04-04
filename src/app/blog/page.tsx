import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="flex flex-col gap-12 py-16">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
        <p className="mt-4 text-lg text-text-secondary">
          Weekly tech roundups with my POV. No fluff, just signal.
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-text-secondary">No posts yet. Check back soon.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-xl border border-border bg-surface p-6 transition-colors hover:bg-surface-hover"
            >
              <div className="mb-2 flex items-center gap-3">
                <time className="text-xs text-text-secondary">{post.date}</time>
                <span className="text-xs text-text-secondary">
                  {post.stories.length} stories
                </span>
              </div>
              <h2 className="text-xl font-bold group-hover:text-accent">
                {post.title}
              </h2>
              <p className="mt-2 text-text-secondary">{post.summary}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
