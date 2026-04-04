import Link from "next/link";

const socials = [
  { label: "Email", href: "mailto:hello@jarrett.love" },
  { label: "Twitter / X", href: "https://x.com/jarrettlove" },
  { label: "Instagram", href: "https://instagram.com/jarrettlove" },
  { label: "TikTok", href: "https://tiktok.com/@jarrettlovebuilds" },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-16 py-16">
      {/* Hero */}
      <section className="flex flex-col gap-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Builder. Strategist.
          <br />
          <span className="text-accent">Shipping what matters.</span>
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-text-secondary">
          I build things and pay attention. Weekly notes on tech, markets,
          and what&apos;s actually happening.
        </p>
        <div className="flex gap-4">
          <Link
            href="/projects"
            className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            View Projects
          </Link>
          <Link
            href="/blog"
            className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:border-text-secondary hover:text-text-primary"
          >
            Read the Blog
          </Link>
        </div>
      </section>

      {/* What I Do */}
      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold">What I Do</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "Salesforce",
              desc: "Admin & developer building enterprise solutions that scale.",
            },
            {
              title: "Indie Products",
              desc: "Founder of PropTrack. Building tools that solve real problems.",
            },
            {
              title: "Weekly Insights",
              desc: "Curated tech news with my unfiltered POV, every week.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-border bg-surface p-6 transition-colors hover:bg-surface-hover"
            >
              <h3 className="mb-2 font-semibold">{item.title}</h3>
              <p className="text-sm text-text-secondary">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Connect */}
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Connect</h2>
        <div className="flex gap-4">
          {socials.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary transition-colors hover:border-text-secondary hover:text-text-primary"
            >
              {label}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
