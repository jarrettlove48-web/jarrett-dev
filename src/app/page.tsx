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
      <section className="hero-full">
        <NeuralDish />
        <h1 className="hero-name">JARRETT LOVE</h1>
      </section>

      {/* It's All Love Weekly */}
      <section className="section">
        <h2>It&apos;s All Love Weekly</h2>
        <p className="text-text-secondary">
          Tech, markets, AI. My take, every week.
        </p>
        <Link href="/weekly-drop" className="btn-primary" style={{ marginTop: "8px" }}>
          Read the latest &rarr;
        </Link>
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
