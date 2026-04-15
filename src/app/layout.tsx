import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Particles } from "@/components/particles";
import { CustomCursor } from "@/components/custom-cursor";

export const metadata: Metadata = {
  title: "Jarrett Love | Builder & Strategist",
  description:
    "Salesforce developer, PropTrack founder, and indie builder. Weekly tech insights and project updates.",
  openGraph: {
    title: "Jarrett Love | Builder & Strategist",
    description:
      "Salesforce developer, PropTrack founder, and indie builder.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased">
        {/* Turrell light scene */}
        <div className="turrell-scene">
          <div className="turrell-portal" />
          <div className="turrell-core" />
          <div className="light-wash wash-blue" />
          <div className="light-wash wash-violet" />
          <div className="light-wash wash-warm" />
          <div className="light-wash wash-cyan" />
          <div className="horizon-glow" />
        </div>
        <Particles />
        <div className="grain" />

        <Nav />
        <main className="relative z-[2] mx-auto max-w-3xl px-6 pb-24 pt-8">
          {children}
        </main>
        <footer className="relative z-[2] border-t border-[rgba(255,255,255,0.07)] bg-[rgba(3,6,15,0.3)] py-8 text-center text-sm text-text-dim backdrop-blur-lg">
          <p>
            jarrett<span className="text-accent">.</span>love — It&apos;s All
            Love
          </p>
        </footer>
        <CustomCursor />
      </body>
    </html>
  );
}
