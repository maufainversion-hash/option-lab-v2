import Link from "next/link";

/** Marca Option Lab: payoff de un call (hockey-stick) trazado dentro de un anillo. */
export function BrandMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
      <circle cx="16" cy="16" r="15" stroke="var(--color-line-2)" strokeWidth="1" />
      <circle cx="16" cy="16" r="15" stroke="var(--color-brass)" strokeWidth="1" strokeDasharray="2 4" opacity="0.5" />
      {/* eje */}
      <line x1="7" y1="22" x2="25" y2="22" stroke="var(--color-dim)" strokeWidth="0.75" />
      {/* payoff long call */}
      <path d="M7 22 L16 22 L25 9" stroke="var(--color-brass)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="16" cy="22" r="1.6" fill="var(--color-brass)" />
    </svg>
  );
}

export function Brand({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2.5">
      <BrandMark />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[17px] font-semibold tracking-tight text-text">
          Option<span className="text-brass">Lab</span>
        </span>
        <span className="readout text-[9px] uppercase tracking-[0.22em] text-dim">
          hull · interactive
        </span>
      </span>
    </Link>
  );
}
