import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/nav";

export const metadata: Metadata = {
  title: "Jarrett | Builder & Strategist",
  description:
    "Salesforce developer, PropTrack founder, and indie builder. Weekly tech insights and project updates.",
  openGraph: {
    title: "Jarrett | Builder & Strategist",
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
      <body className="min-h-screen antialiased">
        <Nav />
        <main className="mx-auto max-w-4xl px-6 pb-24 pt-8">{children}</main>
        <footer className="border-t border-border py-8 text-center text-sm text-text-secondary">
          <p>&copy; {new Date().getFullYear()} Jarrett. Built with intention.</p>
        </footer>
      </body>
    </html>
  );
}
