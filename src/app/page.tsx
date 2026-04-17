import Link from "next/link";
import NeuralDish from "@/components/NeuralDish";

const socials = [
  { label: "Email", href: "mailto:hello@jarrett.love" },
  { label: "Twitter / X", href: "https://x.com/jarrettlove" },
  { label: "Instagram", href: "https://instagram.com/jarrettlove" },
  { label: "TikTok", href: "https://tiktok.com/@jarrettlovebuilds" },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="hero">
        <div className="glass hero-card hero-card-with-dish">
          <NeuralDish />
          <div className="hero-content">
            <h1>
              Builder. Strategist.
              <br />
              <span className="accent">Shipping what matters.</span>
            </h1>
            <p>
              I build things and pay attention. Weekly notes on tech, markets,
              and what&apos;s actually happening.
            </p>
            <div className="hero-buttons">
              <Link href="/projects" className="btn-primary">
                View Projects &rarr;
              </Link>
              <Link href="/weekly-drop" className="btn-glass">
                Read the Blog
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What I Do */}
      <section className="section">
        <h2>What I Do</h2>
        <div className="cards-grid">
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
            <div key={item.title} className="glass card">
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Connect */}
      <section className="section">
        <h2>Connect</h2>
        <div className="connect-row">
          {socials.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="pill"
            >
              {label}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
