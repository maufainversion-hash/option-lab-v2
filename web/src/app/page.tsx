import Link from "next/link";
import { HeroSurface } from "@/components/HeroSurface";

const LABS = [
  {
    href: "/pricing",
    n: "01",
    title: "Pricing & Griegas",
    blurb: "Black-Scholes en vivo. Las 5 griegas en 2D y la superficie 3D sobre spot × tiempo.",
    hull: "Hull 14 · 19",
  },
  {
    href: "/strategies",
    n: "02",
    title: "Estrategias",
    blurb: "Constructor multi-leg: spreads, straddles, cóndores. Payoff y P&L con breakevens.",
    hull: "Hull 11 · 12",
  },
  {
    href: "/montecarlo",
    n: "03",
    title: "Monte Carlo",
    blurb: "Procesos de Wiener, GBM, paths simulados y convergencia del estimador a Black-Scholes.",
    hull: "Hull 13 · 21",
  },
  {
    href: "/binomial",
    n: "04",
    title: "Árbol Binomial",
    blurb: "Lattice CRR animado, ejercicio temprano americano y convergencia CRR vs Leisen-Reimer.",
    hull: "Hull 13",
  },
  {
    href: "/parity",
    n: "05",
    title: "Paridad & No-Arbitraje",
    blurb: "Put-call parity, cotas, tasa implícita y opciones sintéticas. El corazón del arbitraje.",
    hull: "Hull 10 · 11",
  },
  {
    href: "/learn",
    n: "06",
    title: "Teoría (Hull)",
    blurb: "Apuntes, fórmulas y el machete completo del curso, mapeado capítulo por capítulo.",
    hull: "Hull 1 · 19",
  },
];

const STATS = [
  { k: "modelos", v: "4" },
  { k: "griegas", v: "5" },
  { k: "estrategias", v: "11" },
  { k: "tests", v: "129" },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
      {/* HERO */}
      <section className="grid items-center gap-8 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <div className="animate-rise">
          <div className="eyebrow mb-5 flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-brass" />
            laboratorio de derivados · basado en hull
          </div>
          <h1 className="font-display text-[44px] font-medium leading-[1.04] tracking-tight text-balance sm:text-[60px]">
            Entendé las opciones{" "}
            <span className="text-brass italic">moviéndolas</span>, no
            memorizándolas.
          </h1>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-muted text-pretty">
            Pricing en tiempo real, las griegas en superficies 3D, estrategias
            multi-leg, simulación Monte Carlo y árboles binomiales. Cada slider
            recalcula la teoría de Hull al instante.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/pricing" className="btn-brass px-5 py-2.5 text-[14px]">
              Abrir el laboratorio →
            </Link>
            <Link
              href="/learn"
              className="rounded-[10px] border border-line px-5 py-2.5 text-[14px] font-medium text-muted transition-colors hover:border-line-2 hover:text-text"
            >
              Ver la teoría
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3">
            {STATS.map((s) => (
              <div key={s.k} className="flex items-baseline gap-2">
                <span className="readout text-[22px] font-semibold text-text">
                  {s.v}
                </span>
                <span className="eyebrow text-[10px]">{s.k}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="animate-rise [animation-delay:120ms]">
          <div className="panel blueprint glow-brass relative h-[340px] overflow-hidden sm:h-[420px] lg:h-[460px]">
            <HeroSurface />
            <div className="pointer-events-none absolute left-4 top-4">
              <div className="eyebrow text-[10px]">superficie · vega</div>
              <div className="readout text-[11px] text-muted">∂V/∂σ sobre spot × tiempo</div>
            </div>
            <div className="pointer-events-none absolute bottom-3 right-4 readout text-[10px] text-dim">
              arrastrá para rotar
            </div>
          </div>
        </div>
      </section>

      {/* LABS GRID */}
      <section className="py-8">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-[26px] font-medium">Los laboratorios</h2>
          <span className="eyebrow hidden sm:block">06 módulos interactivos</span>
        </div>
        <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {LABS.map((lab) => (
            <Link
              key={lab.href}
              href={lab.href}
              className="group relative bg-ink-1 p-6 transition-colors hover:bg-ink-2"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="readout text-[12px] text-dim">{lab.n}</span>
                <span className="chip">{lab.hull}</span>
              </div>
              <h3 className="font-display text-[20px] font-medium text-text">
                {lab.title}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">
                {lab.blurb}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-brass opacity-0 transition-opacity group-hover:opacity-100">
                Entrar
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* MANIFIESTO */}
      <section className="grid gap-8 py-16 lg:grid-cols-[1fr_1.2fr]">
        <h2 className="font-display text-[28px] font-medium leading-snug text-balance">
          La intuición se construye{" "}
          <span className="text-brass italic">tocando los parámetros</span>.
        </h2>
        <div className="space-y-4 text-[15px] leading-relaxed text-muted">
          <p>
            Los apuntes de Hull son la base, pero una opción se entiende cuando
            ves cómo su <span className="text-text">gamma</span> explota cerca del
            vencimiento, o cómo la <span className="text-text">theta</span> se come
            el valor temporal día a día.
          </p>
          <p>
            Toda la matemática corre en tu navegador —Black-Scholes, las griegas,
            binomial y Monte Carlo— validada numéricamente contra el Ejemplo 14.6
            del libro. Sin esperas, sin recargar.
          </p>
          <Link
            href="/pricing"
            className="link-underline inline-block font-medium text-text"
          >
            Empezar por pricing & griegas
          </Link>
        </div>
      </section>
    </div>
  );
}
