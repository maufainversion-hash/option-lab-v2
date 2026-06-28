"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brand } from "./Brand";

const LINKS = [
  { href: "/pricing", label: "Pricing & Griegas" },
  { href: "/strategies", label: "Estrategias" },
  { href: "/montecarlo", label: "Monte Carlo" },
  { href: "/binomial", label: "Binomial" },
  { href: "/learn", label: "Teoría" },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-ink-0/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-5 sm:px-8">
        <Brand />
        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => {
            const active = pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
                  active ? "text-text" : "text-muted hover:text-text"
                }`}
              >
                {l.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-[1px] h-px bg-brass" />
                )}
              </Link>
            );
          })}
        </nav>
        <Link
          href="/pricing"
          className="btn-brass hidden px-4 py-2 text-[13px] sm:inline-flex"
        >
          Abrir laboratorio
        </Link>
      </div>
    </header>
  );
}
