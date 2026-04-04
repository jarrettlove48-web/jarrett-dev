import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/nav";

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
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased">
        <Nav />
        <main className="mx-auto max-w-3xl px-6 pb-24 pt-8">{children}</main>
        <footer className="border-t border-border py-8 text-center text-sm text-text-dim">
          <p>
            jarrett<span className="text-accent">.</span>love — It&apos;s All
            Love
          </p>
        </footer>
      </body>
    </html>
  );
}
