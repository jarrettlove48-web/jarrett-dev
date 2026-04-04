import { notFound } from "next/navigation";
import { getAllPosts, getPost } from "@/lib/blog";
import Link from "next/link";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <div className="flex flex-col gap-10 py-16">
      <div>
        <Link
          href="/blog"
          className="mb-4 inline-block text-sm text-text-secondary hover:text-text-primary"
        >
          &larr; Back to Blog
        </Link>
        <time className="block text-sm text-text-secondary">{post.date}</time>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">{post.title}</h1>
        <p className="mt-4 text-lg text-text-secondary">{post.summary}</p>
      </div>

      <p className="text-text-secondary">{post.content}</p>

      <div className="flex flex-col gap-6">
        {post.stories.map((story, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-surface p-6"
          >
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-bold">{story.title}</h3>
              <span className="text-xs text-text-secondary">
                {story.source}
              </span>
            </div>
            <p className="text-text-secondary">{story.take}</p>
            <a
              href={story.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm text-accent hover:text-accent-hover"
            >
              Read source &rarr;
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
