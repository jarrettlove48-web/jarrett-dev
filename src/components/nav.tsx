"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "home" },
  { href: "/blog", label: "weekly" },
  { href: "/projects", label: "projects" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-background/85 px-6 backdrop-blur-xl">
      <Link href="/" className="font-mono text-[15px] font-medium tracking-tight">
        jarrett<span className="text-accent">.</span>love
      </Link>
      <div className="flex gap-8">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`text-[13px] font-medium tracking-wide transition-colors hover:text-text-primary ${
              pathname === href || (href !== "/" && pathname.startsWith(href))
                ? "text-text-primary"
                : "text-text-secondary"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
