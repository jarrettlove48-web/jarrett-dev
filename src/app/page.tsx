import Link from "next/link";
import NeuralDish from "@/components/NeuralDish";

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
        <a
          href="mailto:hello@jarrett.love"
          className="btn-primary btn-lg"
        >
          Get in touch &rarr;
        </a>
      </section>
    </div>
  );
}
