"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { UNITS, GROUPS, unitBySlug } from "@/lib/curriculum";

export function UnitShell({ slug, children }: { slug: string; children: ReactNode }) {
  const pathname = usePathname();
  const unit = unitBySlug(slug);
  const idx = UNITS.findIndex((u) => u.slug === slug);
  const prev = idx > 0 ? UNITS[idx - 1] : null;
  const next = idx >= 0 && idx < UNITS.length - 1 ? UNITS[idx + 1] : null;

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8">
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* Índice lateral */}
        <aside className="h-fit lg:sticky lg:top-20">
          <Link href="/learn" className="eyebrow mb-4 inline-flex items-center gap-1.5 hover:text-brass">
            ← Teoría · índice
          </Link>
          <nav className="space-y-5">
            {GROUPS.map((g) => (
              <div key={g}>
                <div className="eyebrow mb-2 text-[9.5px]">{g}</div>
                <ul className="space-y-0.5 border-l border-line">
                  {UNITS.filter((u) => u.group === g).map((u) => {
                    const active = pathname === `/learn/${u.slug}`;
                    return (
                      <li key={u.slug}>
                        <Link
                          href={`/learn/${u.slug}`}
                          className={`-ml-px block border-l-2 py-1 pl-3 text-[12.5px] leading-snug transition-colors ${
                            active
                              ? "border-brass font-medium text-text"
                              : "border-transparent text-muted hover:border-line-2 hover:text-text"
                          }`}
                        >
                          {u.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Contenido */}
        <article className="min-w-0">
          <header className="mb-8 animate-rise border-b border-line pb-6">
            <div className="eyebrow mb-3 flex items-center gap-3">
              <span className="inline-block h-px w-7 bg-brass" />
              {unit?.hull ?? "Hull"}
            </div>
            <h1 className="font-display text-[34px] font-medium leading-tight sm:text-[40px]">
              {unit?.title ?? slug}
            </h1>
            {unit?.blurb && <p className="mt-2 max-w-2xl text-[15px] text-muted">{unit.blurb}</p>}
          </header>

          {children}

          {/* Prev / next */}
          <nav className="mt-14 grid gap-3 border-t border-line pt-6 sm:grid-cols-2">
            {prev ? (
              <Link href={`/learn/${prev.slug}`} className="panel group p-4 transition-colors hover:bg-ink-2">
                <div className="eyebrow text-[9.5px]">← Anterior</div>
                <div className="mt-1 font-display text-[16px] text-text group-hover:text-brass">{prev.title}</div>
              </Link>
            ) : <span />}
            {next ? (
              <Link href={`/learn/${next.slug}`} className="panel group p-4 text-right transition-colors hover:bg-ink-2">
                <div className="eyebrow text-[9.5px]">Siguiente →</div>
                <div className="mt-1 font-display text-[16px] text-text group-hover:text-brass">{next.title}</div>
              </Link>
            ) : <span />}
          </nav>
        </article>
      </div>
    </div>
  );
}
