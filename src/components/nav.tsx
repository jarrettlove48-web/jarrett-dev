"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "home" },
  { href: "/weekly-drop", label: "weekly" },
  { href: "/projects", label: "projects" },
  { href: "/lifestyle", label: "lifestyle" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-[rgba(255,255,255,0.07)] bg-[rgba(3,6,15,0.4)] backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-6">
        <Link href="/" className="font-mono text-[15px] font-medium tracking-tight">
          jarrett<span className="text-accent">.</span>love
        </Link>

        {/* Desktop */}
        <div className="hidden gap-8 sm:flex">
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

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="flex h-8 w-8 items-center justify-center sm:hidden"
          aria-label="Toggle menu"
        >
          <div className="flex flex-col gap-1.5">
            <span className={`block h-px w-5 bg-text-primary transition-all ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
            <span className={`block h-px w-5 bg-text-primary transition-all ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="flex flex-col gap-1 border-t border-[rgba(255,255,255,0.07)] px-6 py-4 sm:hidden">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                pathname === href || (href !== "/" && pathname.startsWith(href))
                  ? "text-text-primary bg-[rgba(255,255,255,0.05)]"
                  : "text-text-secondary"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
