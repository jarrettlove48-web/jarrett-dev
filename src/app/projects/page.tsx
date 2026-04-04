import Link from "next/link";

const features = [
  "Tenant & lease tracking across unlimited properties",
  "Maintenance request management with status workflows",
  "Financial dashboards — rent collection, expenses, P&L per unit",
  "Document storage for leases, inspections, and compliance",
  "Automated reminders for rent, renewals, and maintenance",
];

export default function ProjectsPage() {
  return (
    <div className="flex flex-col gap-16 py-16">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Projects</h1>
        <p className="mt-4 text-lg text-text-secondary">
          I build tools that solve real problems. PropTrack is the one I&apos;m
          going all in on.
        </p>
      </div>

      {/* PropTrack — Hero Feature */}
      <section className="rounded-2xl border border-border bg-surface p-8 sm:p-10">
        <div className="mb-6 flex items-center gap-3">
          <h2 className="text-3xl font-bold tracking-tight">PropTrack</h2>
          <span className="rounded-full bg-tag-bg px-3 py-1 text-xs font-medium text-accent border border-accent/20">
            Live
          </span>
        </div>

        <p className="mb-6 max-w-2xl text-lg leading-relaxed text-text-secondary">
          The property management platform I&apos;m building for landlords,
          property managers, and real estate investors who are tired of
          spreadsheets and overpriced enterprise software. PropTrack gives you
          everything you need to manage your portfolio — tenants, leases,
          maintenance, finances — in one clean interface.
        </p>

        <p className="mb-8 text-text-secondary leading-relaxed">
          This is my Tesla. I came up through Salesforce the way Elon came
          through PayPal — it taught me how enterprise software works, how
          businesses scale, and what tools people actually need. PropTrack is
          where all of that experience gets applied. Every feature is built from
          real pain points I&apos;ve seen managing properties and talking to
          landlords. No bloat, no feature creep. Just what works.
        </p>

        {/* Features */}
        <div className="mb-8">
          <h3 className="mb-4 font-mono text-[11px] uppercase tracking-widest text-text-dim">
            What it does
          </h3>
          <ul className="space-y-3">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm text-text-secondary">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <a
          href="https://app.proptrack.app"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          Open PropTrack &rarr;
        </a>
      </section>

      {/* Origin Story */}
      <section className="border-t border-border pt-12">
        <h3 className="mb-4 font-mono text-[11px] uppercase tracking-widest text-text-dim">
          The origin story
        </h3>
        <div className="rounded-xl border border-border-subtle bg-surface p-6">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-lg font-bold">Salesforce</h4>
            <span className="text-xs text-text-dim">Where it started</span>
          </div>
          <p className="text-text-secondary leading-relaxed">
            My foundation. Years of building enterprise solutions on Salesforce
            — custom objects, Apex, automations, integrations — taught me how
            real businesses operate at scale. It&apos;s the skill set that funds
            the vision and the lens I use to build PropTrack the right way.
            Every great founder has their &ldquo;PayPal&rdquo; — Salesforce is
            mine.
          </p>
        </div>
      </section>

      {/* What's Next */}
      <section className="border-t border-border pt-12">
        <h3 className="mb-4 font-mono text-[11px] uppercase tracking-widest text-text-dim">
          What&apos;s next
        </h3>
        <p className="text-text-secondary leading-relaxed">
          More ventures are coming. Follow the{" "}
          <Link href="/weekly-drop" className="text-accent hover:text-accent-hover">
            weekly blog
          </Link>{" "}
          to stay in the loop.
        </p>
      </section>
    </div>
  );
}
