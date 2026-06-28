import Link from "next/link";
import type { ReactNode } from "react";
import { LabHeader, Panel } from "@/components/LabLayout";
import { Formula } from "@/components/ui/Formula";
import { UNITS, GROUPS } from "@/lib/curriculum";

export const metadata = {
  title: "Teoría & Formulario · Option Lab",
  description:
    "El machete completo del curso de derivados: mapa Hull → módulo y todas las fórmulas (forwards, tasas, swaps, opciones, Black-Scholes, griegas, binomial y Monte Carlo).",
};

// ── Mapa Hull → módulo ────────────────────────────────────────────
type MapRow = {
  cap: string;
  tema: string;
  tags: string[];
  href?: string;
  lab?: string;
};

const HULL_MAP: MapRow[] = [
  { cap: "1 · 2", tema: "Futuros y forwards — mecánica, MtM, margins", tags: ["U1"] },
  { cap: "3", tema: "Coberturas con futuros — hedge ratio, beta", tags: ["U1"] },
  { cap: "4", tema: "Tasas de interés, FRAs y duration", tags: ["U3"] },
  { cap: "5", tema: "Forward pricing — cost of carry", tags: ["U3"] },
  { cap: "7", tema: "Swaps — IRS y currency swaps", tags: ["U4"] },
  {
    cap: "10 · 11",
    tema: "Opciones — propiedades, cotas y put-call parity",
    tags: ["U5"],
    href: "/parity",
    lab: "Parity Lab",
  },
  {
    cap: "13",
    tema: "Árbol binomial — risk-neutral",
    tags: ["U6"],
    href: "/binomial",
    lab: "Binomial Lab",
  },
  {
    cap: "14",
    tema: "Black-Scholes-Merton — N(d₁), N(d₂)",
    tags: ["U6"],
    href: "/pricing",
    lab: "Pricing Lab",
  },
  {
    cap: "19",
    tema: "Las griegas — delta, gamma, vega, theta, rho",
    tags: ["U6"],
    href: "/pricing",
    lab: "Pricing Lab",
  },
  {
    cap: "12",
    tema: "Estrategias multi-leg — spreads, straddles",
    tags: ["U5"],
    href: "/strategies",
    lab: "Strategies Lab",
  },
  {
    cap: "13 · 21",
    tema: "Monte Carlo — simulación GBM, payoffs path-dependent",
    tags: ["U6"],
    href: "/montecarlo",
    lab: "Monte Carlo Lab",
  },
];

// ── Tarjeta de fórmula reutilizable ───────────────────────────────
function Item({ tex, children }: { tex: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-line bg-ink-2 px-4 py-3.5">
      <div className="readout overflow-x-auto text-[15px] text-text">
        <Formula display tex={tex} />
      </div>
      <p className="mt-2 text-[13px] leading-relaxed text-muted">{children}</p>
    </div>
  );
}

function FormulaCard({
  title,
  hull,
  children,
}: {
  title: string;
  hull: string;
  children: ReactNode;
}) {
  return (
    <Panel className="h-full">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h2 className="font-display text-[19px] font-medium">{title}</h2>
        <span className="chip shrink-0">{hull}</span>
      </div>
      <div className="space-y-3">{children}</div>
    </Panel>
  );
}

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8">
      <LabHeader
        eyebrow="teoría · formulario"
        hull="Hull 1 · 19"
        title={
          <>
            El machete <span className="text-brass italic">completo</span>
          </>
        }
        subtitle="Cada fórmula del cronograma, faithful a Hull y lista para el parcial. Mapeá el capítulo a su módulo, repasá la teoría y después abrí el lab para verla viva."
      />

      {/* ── Unidades de teoría ─────────────────────────────────── */}
      <section className="mb-12 animate-rise">
        <div className="mb-4 flex items-center gap-3">
          <span className="eyebrow">unidades · apuntes completos</span>
          <span className="inline-block h-px flex-1 bg-line" />
        </div>
        {GROUPS.map((g) => (
          <div key={g} className="mb-6">
            <div className="eyebrow mb-2.5 text-[10px] text-dim">{g}</div>
            <div className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
              {UNITS.filter((u) => u.group === g).map((u) => (
                <Link
                  key={u.slug}
                  href={`/learn/${u.slug}`}
                  className="group bg-ink-1 p-4 transition-colors hover:bg-ink-2"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="chip text-[10px]">{u.hull}</span>
                    <span className="text-brass opacity-0 transition-opacity group-hover:opacity-100">→</span>
                  </div>
                  <div className="font-display text-[16px] font-medium text-text">{u.title}</div>
                  <p className="mt-1 text-[12.5px] leading-snug text-muted">{u.blurb}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* ── Mapa Hull → módulo ─────────────────────────────────── */}
      <section className="mb-12 animate-rise">
        <div className="mb-4 flex items-center gap-3">
          <span className="eyebrow">mapa Hull → módulo</span>
          <span className="inline-block h-px flex-1 bg-line" />
        </div>
        <div className="panel overflow-hidden">
          <table className="w-full border-collapse text-left text-[14px]">
            <thead>
              <tr className="border-b border-line text-dim">
                <th className="px-4 py-3 font-medium sm:px-5">
                  <span className="eyebrow text-[10px]">cap</span>
                </th>
                <th className="px-4 py-3 font-medium sm:px-5">
                  <span className="eyebrow text-[10px]">tema</span>
                </th>
                <th className="hidden px-4 py-3 text-right font-medium sm:table-cell sm:px-5">
                  <span className="eyebrow text-[10px]">lab</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {HULL_MAP.map((row, i) => (
                <tr
                  key={`${row.cap}-${i}`}
                  className="border-b border-line/60 transition-colors last:border-0 hover:bg-ink-2"
                >
                  <td className="whitespace-nowrap px-4 py-3.5 align-top sm:px-5">
                    <span className="readout text-brass">{row.cap}</span>
                  </td>
                  <td className="px-4 py-3.5 align-top sm:px-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-text">{row.tema}</span>
                      {row.tags.map((t) => (
                        <span key={t} className="chip text-[10px]">
                          {t}
                        </span>
                      ))}
                    </div>
                    {row.href && (
                      <Link
                        href={row.href}
                        className="link-underline mt-1.5 inline-block text-[12.5px] text-brass sm:hidden"
                      >
                        {row.lab} →
                      </Link>
                    )}
                  </td>
                  <td className="hidden px-4 py-3.5 text-right align-top sm:table-cell sm:px-5">
                    {row.href ? (
                      <Link
                        href={row.href}
                        className="link-underline text-[13px] text-brass"
                      >
                        {row.lab} →
                      </Link>
                    ) : (
                      <span className="text-[13px] text-dim">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── El formulario ──────────────────────────────────────── */}
      <section className="animate-rise">
        <div className="mb-5 flex items-center gap-3">
          <span className="eyebrow">el formulario</span>
          <span className="inline-block h-px flex-1 bg-line" />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Forwards & Futuros */}
          <FormulaCard title="Forwards & Futuros" hull="Cap 5">
            <Item tex={"F_0 = S_0\\, e^{rT}"}>
              Forward price de un activo sin income: capitalizás el spot a la tasa
              libre de riesgo.
            </Item>
            <Item tex={"F_0 = (S_0 - I)\\, e^{rT}"}>
              Con income conocido <em>I</em> (valor presente de los ingresos, ej.
              dividendos discretos): se lo restás al spot.
            </Item>
            <Item tex={"F_0 = S_0\\, e^{(r-q)T}"}>
              Con dividend yield continuo <em>q</em>: el carry neto es{" "}
              <em>r − q</em>.
            </Item>
            <Item tex={"f = (F_0 - K)\\, e^{-rT} = S_0 e^{-qT} - K e^{-rT}"}>
              Valor de un forward ya pactado con delivery price <em>K</em>: nace en
              cero y deriva con el spot.
            </Item>
            <Item tex={"c = r - q + u - y"}>
              Cost of carry general — generaliza todos los casos como{" "}
              <Formula tex={"F_0 = S_0 e^{cT}"} /> (storage <em>u</em>, convenience
              yield <em>y</em>).
            </Item>
          </FormulaCard>

          {/* Tasas & FRAs */}
          <FormulaCard title="Tasas & FRAs" hull="Cap 4">
            <Item tex={"R_c = m\\, \\ln\\!\\left(1 + \\frac{R_m}{m}\\right)"}>
              Conversión de compounding discreto (<em>m</em> veces/año) a continuo;
              al revés{" "}
              <Formula tex={"R_m = m\\left(e^{R_c/m}-1\\right)"} />.
            </Item>
            <Item tex={"f_{T_1,T_2} = \\frac{R_2 T_2 - R_1 T_1}{T_2 - T_1}"}>
              Forward rate entre <em>T₁</em> y <em>T₂</em> implícita en la zero curve.
            </Item>
            <Item tex={"V_{FRA} = L\\,(R_K - R_F)\\,(T_2 - T_1)\\, e^{-R_2 T_2}"}>
              Valor de un FRA (receive fixed <em>R_K</em>): la diferencia contra la
              forward rate <em>R_F</em>, descontada.
            </Item>
            <Item tex={"B = \\sum_i \\mathrm{CF}_i\\, e^{-R_i\\, t_i}"}>
              Precio de un bono: suma de cashflows descontados con la curva cero.
            </Item>
          </FormulaCard>

          {/* Swaps */}
          <FormulaCard title="Swaps" hull="Cap 7">
            <Item tex={"V_{swap} = B_{\\text{fix}} - B_{\\text{flt}}"}>
              IRS valuado como dos bonos (receive fixed): bono de tasa fija menos bono
              flotante.
            </Item>
            <Item
              tex={
                "B_{\\text{fix}} = \\sum_i k\\, e^{-r_i t_i} + L\\, e^{-r_n t_n},\\quad k = L\\, r_{\\text{fix}}\\,\\tau"
              }
            >
              Pata fija: cupones <em>k</em> más el notional <em>L</em> al final,
              descontados.
            </Item>
            <Item tex={"B_{\\text{flt}} = (L + k^{*})\\, e^{-r_1 t_1}"}>
              Pata flotante: vale par justo después del reset; <em>k*</em> es el
              próximo cupón ya fijado.
            </Item>
            <Item tex={"V_{swap} = \\frac{B_{\\text{foreign}}}{S_0} - B_{\\text{domestic}}"}>
              Currency swap (bond approach): bono extranjero convertido a moneda
              local menos bono doméstico.
            </Item>
          </FormulaCard>

          {/* Opciones — propiedades */}
          <FormulaCard title="Opciones — propiedades" hull="Cap 10 · 11">
            <Item tex={"c + K e^{-rT} = p + S_0 e^{-qT}"}>
              Put-call parity europea: el corazón de la replicación. Conociendo tres
              precios, el cuarto sale solo.
            </Item>
            <Item
              tex={
                "\\max\\!\\left(S_0 e^{-qT} - K e^{-rT},\\, 0\\right) \\le c \\le S_0 e^{-qT}"
              }
            >
              Cotas de un call europeo: nunca menos que su valor intrínseco
              descontado, nunca más que el spot ajustado.
            </Item>
            <Item
              tex={
                "\\max\\!\\left(K e^{-rT} - S_0 e^{-qT},\\, 0\\right) \\le p \\le K e^{-rT}"
              }
            >
              Cotas de un put europeo: simétricas a las del call.
            </Item>
            <Item tex={"S_0 - K \\le C - P \\le S_0 - K e^{-rT}"}>
              Desigualdad de paridad americana: para americanas la parity es una banda,
              no una igualdad.
            </Item>
          </FormulaCard>

          {/* Black-Scholes */}
          <FormulaCard title="Black-Scholes" hull="Cap 14">
            <Item tex={"c = S_0 e^{-qT} N(d_1) - K e^{-rT} N(d_2)"}>
              Call europeo BSM con dividend yield <em>q</em>.
            </Item>
            <Item tex={"p = K e^{-rT} N(-d_2) - S_0 e^{-qT} N(-d_1)"}>
              Put europeo BSM — sale también de la put-call parity.
            </Item>
            <Item
              tex={
                "d_1 = \\frac{\\ln(S_0/K) + (r - q + \\tfrac{1}{2}\\sigma^2)T}{\\sigma\\sqrt{T}}"
              }
            >
              <em>d₁</em> mide cuán in-the-money está la opción en desvíos.
            </Item>
            <Item tex={"d_2 = d_1 - \\sigma\\sqrt{T}"}>
              <em>N(d₂)</em> es la probabilidad risk-neutral de ejercer.
            </Item>
          </FormulaCard>

          {/* Griegas */}
          <FormulaCard title="Griegas" hull="Cap 19">
            <Item
              tex={
                "\\Delta_{\\text{call}} = e^{-qT} N(d_1),\\quad \\Delta_{\\text{put}} = e^{-qT}\\!\\left[N(d_1)-1\\right]"
              }
            >
              Delta — <Formula tex={"\\partial V/\\partial S"} />. Call ∈ [0,1], put ∈
              [−1,0].
            </Item>
            <Item tex={"\\Gamma = \\frac{e^{-qT} N'(d_1)}{S_0\\, \\sigma \\sqrt{T}}"}>
              Gamma (igual call y put) — convexidad de la delta; máxima ATM y cerca del
              vencimiento.
            </Item>
            <Item tex={"\\nu = S_0\\, e^{-qT} N'(d_1)\\sqrt{T}"}>
              Vega (igual call y put) — sensibilidad a σ; siempre positiva para opciones
              largas.
            </Item>
            <Item
              tex={
                "\\Theta_{\\text{call}} = -\\frac{S_0 e^{-qT} N'(d_1)\\sigma}{2\\sqrt{T}} - rK e^{-rT} N(d_2) + qS_0 e^{-qT} N(d_1)"
              }
            >
              Theta — decaimiento temporal; típicamente negativo para el comprador.
            </Item>
            <Item
              tex={
                "\\rho_{\\text{call}} = KT e^{-rT} N(d_2),\\quad \\rho_{\\text{put}} = -KT e^{-rT} N(-d_2)"
              }
            >
              Rho — sensibilidad a la tasa; mayor en opciones largas y muy ITM.
            </Item>
          </FormulaCard>

          {/* Binomial */}
          <FormulaCard title="Binomial (CRR)" hull="Cap 13">
            <Item tex={"u = e^{\\sigma\\sqrt{\\Delta t}},\\quad d = \\frac{1}{u}"}>
              Calibración Cox-Ross-Rubinstein: el tamaño de los saltos sale de la
              volatilidad.
            </Item>
            <Item tex={"p = \\frac{e^{(r-q)\\Delta t} - d}{u - d}"}>
              Probabilidad risk-neutral de subir — no es la real, es la que evita
              arbitraje.
            </Item>
            <Item tex={"f = e^{-r\\Delta t}\\!\\left[p\\, f_u + (1-p)\\, f_d\\right]"}>
              Inducción backward: valor esperado risk-neutral descontado, paso a paso.
            </Item>
            <Item tex={"\\Delta = \\frac{f_u - f_d}{S u - S d}"}>
              Delta del portfolio replicante en un paso del árbol.
            </Item>
          </FormulaCard>

          {/* Monte Carlo / GBM */}
          <FormulaCard title="Monte Carlo / GBM" hull="Cap 13 · 21">
            <Item tex={"dS = (r-q)\\, S\\, dt + \\sigma S\\, dW"}>
              Movimiento browniano geométrico del subyacente bajo medida risk-neutral.
            </Item>
            <Item
              tex={
                "S_T = S_0\\, \\exp\\!\\left[\\left(r - q - \\tfrac{1}{2}\\sigma^2\\right)T + \\sigma\\sqrt{T}\\, Z\\right]"
              }
            >
              Solución cerrada del GBM con <Formula tex={"Z \\sim N(0,1)"} />: cada draw
              de <em>Z</em> es un escenario.
            </Item>
            <Item
              tex={
                "\\hat{f} = e^{-rT}\\, \\frac{1}{M}\\sum_{j=1}^{M} \\mathrm{payoff}\\!\\left(S_T^{(j)}\\right)"
              }
            >
              Estimador Monte Carlo: promedio de payoffs descontados sobre <em>M</em>{" "}
              simulaciones.
            </Item>
          </FormulaCard>
        </div>
      </section>

      {/* ── Cómo estudiar ──────────────────────────────────────── */}
      <section className="mt-12 animate-rise">
        <div className="mb-5 flex items-center gap-3">
          <span className="eyebrow">cómo estudiar para el parcial</span>
          <span className="inline-block h-px flex-1 bg-line" />
        </div>
        <Panel>
          <ol className="space-y-3 text-[14px] leading-relaxed text-muted">
            <li className="flex gap-3">
              <span className="readout shrink-0 text-brass">U1</span>
              <span>
                <span className="text-text">Futuros y coberturas.</span> Mecánica,
                mark-to-market y hedge ratio. Es la base operativa; el pricing recién
                aparece en U3.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="readout shrink-0 text-brass">U3</span>
              <span>
                <span className="text-text">Tasas, FRAs y forward pricing.</span>{" "}
                Dominá el continuous compounding y el cost of carry — todo lo demás se
                apoya acá.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="readout shrink-0 text-brass">U4</span>
              <span>
                <span className="text-text">Swaps.</span> Pensá el IRS como dos bonos o
                como un portfolio de FRAs; los currency swaps agregan la pata FX.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="readout shrink-0 text-brass">U5</span>
              <span>
                <span className="text-text">Opciones — propiedades.</span> Cotas y
                put-call parity. Practicá la{" "}
                <Link href="/parity" className="link-underline text-brass">
                  Parity Lab
                </Link>{" "}
                hasta que la igualdad te salga de memoria.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="readout shrink-0 text-brass">U6</span>
              <span>
                <span className="text-text">Valuación.</span> Binomial → Black-Scholes →
                griegas → Monte Carlo. Abrí el{" "}
                <Link href="/pricing" className="link-underline text-brass">
                  Pricing Lab
                </Link>{" "}
                y mové los parámetros para ver d₁, d₂ y las griegas recalcularse.
              </span>
            </li>
          </ol>
          <p className="mt-5 border-t border-line pt-4 text-[13px] leading-relaxed text-dim">
            Tip: no memorices las fórmulas en frío. Por cada bloque de este formulario
            abrí el lab correspondiente, cambiá un parámetro y mirá qué se mueve. La
            intuición de signo (qué sube, qué baja) es lo que te salva en el parcial.
          </p>
        </Panel>
      </section>
    </div>
  );
}
