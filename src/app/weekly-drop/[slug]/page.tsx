import { notFound } from "next/navigation";
import { getAllPosts, getPost } from "@/lib/blog";
import Link from "next/link";
import { ReadingProgress } from "@/components/reading-progress";
import { Subscribe } from "@/components/subscribe";

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

  const issueNum = String(post.issue).padStart(3, "0");

  return (
    <>
      <ReadingProgress />
      <div className="flex flex-col py-16">
        {/* Header */}
        <header className="border-b border-border pb-12">
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <span className="rounded bg-tag-bg px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-widest text-accent border border-accent/20">
              Issue #{issueNum}
            </span>
            <span className="font-mono text-[13px] text-text-dim">
              {post.date}
            </span>
          </div>
          <h1 className="mb-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl whitespace-pre-line">
            {post.title}
          </h1>
          <p className="max-w-xl text-lg text-text-secondary leading-relaxed">
            {post.summary}
          </p>

          {/* Author */}
          <div className="mt-8 flex items-center gap-3 border-t border-border-subtle pt-8">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-blue-800 font-mono text-xs font-medium text-white">
              JL
            </div>
            <div>
              <div className="text-sm font-medium">Jarrett Love</div>
              <div className="font-mono text-xs text-text-dim">
                @jarrettlove · It&apos;s All Love
              </div>
            </div>
          </div>
        </header>

        {/* Intro */}
        <section className="border-b border-border-subtle py-10">
          <p className="text-[1.05rem] leading-relaxed text-text-secondary">
            {post.intro}
          </p>
        </section>

        {/* Stories */}
        <section className="py-10">
          <div className="mb-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-text-dim">
            This week&apos;s stories
            <span className="h-px flex-1 bg-border" />
          </div>

          <div className="flex flex-col gap-10">
            {post.stories.map((story, i) => (
              <article
                key={i}
                className="grid grid-cols-[40px_1fr] gap-x-5 border-b border-border-subtle pb-10 last:border-0 last:pb-0"
              >
                <div className="pt-1 text-right font-mono text-[11px] font-medium text-accent/60">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <span className="mb-2 inline-block rounded bg-tag-bg px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-tag-text">
                    {story.tag}
                  </span>
                  <h2 className="mb-3 text-lg font-semibold leading-snug tracking-tight">
                    {story.title}
                  </h2>
                  <div className="space-y-2 text-[0.9rem] leading-relaxed text-text-secondary">
                    {story.body.map((p, j) => (
                      <p key={j}>{p}</p>
                    ))}
                  </div>
                  <div className="mt-4 rounded-r-md border-l-2 border-accent bg-accent/5 px-4 py-3.5">
                    <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-accent/70">
                      Jarrett&apos;s take
                    </div>
                    <p className="text-sm italic leading-relaxed text-text-secondary">
                      {story.take}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <Subscribe />

        {/* Footer */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-12">
          <div className="font-mono text-[13px] text-text-dim">
            jarrett<span className="text-accent">.</span>love — It&apos;s All
            Love
          </div>
          <Link
            href="/weekly-drop"
            className="rounded-md border border-accent/30 px-4 py-2 text-[13px] font-medium text-accent transition-all hover:border-accent hover:bg-accent/10"
          >
            all issues &rarr;
          </Link>
        </div>
      </div>
    </>
  );
}
