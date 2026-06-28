"use client";

import { useMemo, useState } from "react";
import { LabHeader, LabLayout, Panel } from "@/components/LabLayout";
import { Slider } from "@/components/ui/Slider";
import { Segmented } from "@/components/ui/Segmented";
import { Stat } from "@/components/ui/Stat";
import { LineChart, type Series } from "@/components/charts/LineChart";
import {
  bsPrice,
  linspace,
  payoffAtExpiry,
  pnlAtTime,
  breakevenPoints,
  maxProfitLoss,
  netPremium,
  longCall,
  longPut,
  coveredCall,
  protectivePut,
  bullCallSpread,
  bearPutSpread,
  longStraddle,
  longStrangle,
  longButterfly,
  ironCondor,
  collar,
  rangeBreakdown,
  type Strategy,
  type Leg,
} from "@/lib/quant";
import { COLORS } from "@/lib/colors";

type StratKey =
  | "longCall"
  | "longPut"
  | "coveredCall"
  | "protectivePut"
  | "bullCall"
  | "bearPut"
  | "straddle"
  | "strangle"
  | "butterfly"
  | "ironCondor"
  | "collar";

const STRATS: { value: StratKey; label: string }[] = [
  { value: "longCall", label: "Long Call" },
  { value: "longPut", label: "Long Put" },
  { value: "coveredCall", label: "Covered Call" },
  { value: "protectivePut", label: "Protective Put" },
  { value: "bullCall", label: "Bull Call Spread" },
  { value: "bearPut", label: "Bear Put Spread" },
  { value: "straddle", label: "Straddle" },
  { value: "strangle", label: "Strangle" },
  { value: "butterfly", label: "Butterfly" },
  { value: "ironCondor", label: "Iron Condor" },
  { value: "collar", label: "Collar" },
];

interface UseInfo {
  view: string; // visión de mercado
  cost: string; // débito / crédito
  text: string; // explicación de para qué usarla
}

const USE_NOTE: Record<StratKey, UseInfo> = {
  longCall: {
    view: "Alcista fuerte",
    cost: "Débito",
    text: "Comprás un call cuando esperás una suba marcada y querés apalancamiento: una opción se mueve mucho más que la acción por dólar invertido. La pérdida está acotada al premium pagado y la ganancia es teóricamente ilimitada. Tu enemigo es el paso del tiempo (theta) si la suba no llega.",
  },
  longPut: {
    view: "Bajista",
    cost: "Débito",
    text: "Comprás un put para apostar a una caída o para asegurar una posición larga (es el 'seguro' del subyacente). La pérdida máxima es el premium; la ganancia crece a medida que el subyacente cae hacia cero. Sube de valor también si se dispara la volatilidad.",
  },
  coveredCall: {
    view: "Lateral / levemente alcista",
    cost: "Crédito (cobrás el call)",
    text: "Tenés la acción y vendés un call OTM para generar income con el premium. Funciona mejor en mercados laterales o de suba suave: cobrás la prima y solo resignás el alza por encima de K. Si el subyacente sube fuerte te 'callean' la acción a K (ganancia tope), y si cae, el premium solo amortigua parte de la baja.",
  },
  protectivePut: {
    view: "Alcista pero querés seguro",
    cost: "Débito (pagás el put)",
    text: "Tenés la acción y comprás un put como seguro contra caídas: fija un piso en K a cambio del premium. Mantenés todo el potencial alcista (menos el costo del put) pero limitás la pérdida por debajo de K. Es la cobertura clásica de un portafolio largo.",
  },
  bullCall: {
    view: "Alcista moderado",
    cost: "Débito (acotado)",
    text: "Long call en Klow + short call en Khigh. Abaratás el premium del call comprado vendiendo otro más OTM, a cambio de resignar la ganancia por encima de Khigh. Riesgo y ganancia quedan capados: ideal cuando ves una suba pero limitada. Ganás si el subyacente sube hacia Khigh.",
  },
  bearPut: {
    view: "Bajista moderado",
    cost: "Débito (acotado)",
    text: "Long put en Khigh + short put en Klow. La versión bajista del bull call spread: apostás a una caída pero con riesgo y costo capados. Ganancia máxima = (Khigh − Klow) − costo neto, si el subyacente termina en Klow o por debajo.",
  },
  straddle: {
    view: "Movimiento grande (cualquier lado)",
    cost: "Débito (caro)",
    text: "Long call + long put en el mismo strike ATM. Apostás a un movimiento grande sin saber la dirección (earnings, datos, eventos). Ganás si el subyacente se mueve más que la suma de ambos premiums. Te pega en contra el time decay y una caída de volatilidad.",
  },
  strangle: {
    view: "Movimiento muy grande (cualquier lado)",
    cost: "Débito (más barato que el straddle)",
    text: "Long put OTM + long call OTM. Es un straddle más barato porque los strikes están fuera del dinero, pero necesitás un movimiento aún mayor para entrar en ganancia. Misma idea: largo de volatilidad, sin apuesta direccional.",
  },
  butterfly: {
    view: "Lateral / baja volatilidad",
    cost: "Débito (chico)",
    text: "Long call Klow + 2× short call Kmid + long call Khigh (strikes equidistantes). Apostás a que el subyacente termina clavado cerca de Kmid. Riesgo y ganancia muy acotados y baratos: ganancia máxima en Kmid, pérdida máxima (el débito) en las alas.",
  },
  ironCondor: {
    view: "Lateral / rango",
    cost: "Crédito",
    text: "Short put spread + short call spread: cobrás prima apostando a que el subyacente queda dentro de un rango. Crédito neto con pérdida limitada en los extremos. Es la estrategia de 'vender volatilidad' por excelencia cuando esperás un mercado quieto.",
  },
  collar: {
    view: "Proteger una posición larga",
    cost: "Crédito o costo ~cero",
    text: "Acción + long put (piso) + short call (techo). El call vendido financia el put comprado, así que el seguro sale barato o gratis. A cambio resignás el alza por encima del call. Bracket clásico para proteger ganancias acumuladas en una acción.",
  },
};

const SUMMARY: Record<StratKey, string> = {
  longCall: "apostar a una suba fuerte con riesgo limitado al premium",
  longPut: "apostar a una caída, o asegurar una posición larga",
  coveredCall: "generar income sobre una acción que ya tenés, en mercado lateral",
  protectivePut: "ponerle un piso a una acción que tenés, sin resignar el alza",
  bullCall: "una suba moderada, con costo y riesgo capados",
  bearPut: "una caída moderada, con costo y riesgo capados",
  straddle: "un movimiento grande sin saber la dirección (vol)",
  strangle: "un movimiento muy grande, más barato que el straddle",
  butterfly: "que el subyacente quede clavado cerca de un precio (vol baja)",
  ironCondor: "cobrar prima si el subyacente queda dentro de un rango",
  collar: "proteger ganancias de una acción casi sin costo",
};

const LEG_LABEL: Record<Leg["optionType"], string> = {
  call: "Call",
  put: "Put",
  stock: "Acción",
};

export default function StrategiesLab() {
  const [S, setS] = useState(100);
  const [sigma, setSigma] = useState(0.25);
  const [T, setT] = useState(0.5);
  const [r, setR] = useState(0.05);
  const [strat, setStrat] = useState<StratKey>("bullCall");

  const strategy = useMemo<Strategy>(() => {
    const p = (K: number, type: "call" | "put") => bsPrice(S, K, T, r, sigma, 0, type);
    const atm = Math.round(S);
    const lo10 = Math.round(S * 0.9);
    const hi10 = Math.round(S * 1.1);
    const lo5 = Math.round(S * 0.95);
    const hi5 = Math.round(S * 1.05);
    const lo12 = Math.round(S * 0.88);
    const hi12 = Math.round(S * 1.12);

    switch (strat) {
      case "longCall":
        return longCall(atm, T, p(atm, "call"));
      case "longPut":
        return longPut(atm, T, p(atm, "put"));
      case "coveredCall":
        return coveredCall(S, hi10, T, p(hi10, "call"));
      case "protectivePut":
        return protectivePut(S, lo10, T, p(lo10, "put"));
      case "bullCall":
        return bullCallSpread(lo10, hi10, T, p(lo10, "call"), p(hi10, "call"));
      case "bearPut":
        return bearPutSpread(lo10, hi10, T, p(lo10, "put"), p(hi10, "put"));
      case "straddle":
        return longStraddle(atm, T, p(atm, "call"), p(atm, "put"));
      case "strangle":
        return longStrangle(lo10, hi10, T, p(lo10, "put"), p(hi10, "call"));
      case "butterfly":
        return longButterfly(
          lo5,
          atm,
          hi5,
          T,
          p(lo5, "call"),
          p(atm, "call"),
          p(hi5, "call"),
        );
      case "ironCondor":
        return ironCondor(
          lo12,
          lo5,
          hi5,
          hi12,
          T,
          p(lo12, "put"),
          p(lo5, "put"),
          p(hi5, "call"),
          p(hi12, "call"),
        );
      case "collar":
        return collar(S, lo10, hi10, T, p(lo10, "put"), p(hi10, "call"));
    }
  }, [strat, S, T, r, sigma]);

  const sRange = useMemo(() => linspace(S * 0.5, S * 1.5, 200), [S]);

  const series = useMemo<Series[]>(() => {
    const expiry = payoffAtExpiry(strategy, sRange);
    const today = pnlAtTime(strategy, sRange, 0, r, sigma);
    return [
      {
        x: sRange,
        y: expiry,
        color: COLORS.brass,
        label: "P&L al vencimiento",
        fillToZero: true,
        fillColor: COLORS.brass,
      },
      {
        x: sRange,
        y: today,
        color: COLORS.cyan,
        dash: "5 4",
        label: "P&L hoy (BS)",
      },
    ];
  }, [strategy, sRange, r, sigma]);

  const bes = useMemo(() => breakevenPoints(strategy, sRange), [strategy, sRange]);
  const { maxProfit, maxLoss } = useMemo(
    () => maxProfitLoss(strategy, sRange),
    [strategy, sRange],
  );
  const net = useMemo(() => netPremium(strategy), [strategy]);
  const breakdown = useMemo(() => rangeBreakdown(strategy), [strategy]);

  const vLines = useMemo(
    () => [
      { v: S, color: "#eef2f5", label: "spot", dash: "2 2" },
      ...bes.map((b) => ({ v: b, color: COLORS.muted, label: "BE" })),
    ],
    [S, bes],
  );

  const money = (v: number) => `$${v.toFixed(2)}`;
  const signedMoney = (v: number) => `${v >= 0 ? "+" : "−"}$${Math.abs(v).toFixed(2)}`;
  const finite = (v: number) => Number.isFinite(v);

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8">
      <LabHeader
        eyebrow="estrategias"
        hull="Hull 11 · 12"
        title={
          <>
            Posiciones <span className="text-brass italic">multi-pata</span>
          </>
        }
        subtitle="Elegí una estrategia, mové spot, vol, tiempo y tasa, y mirá el diagrama de payoff recalcularse. Cada pata se valúa con Black-Scholes para que el premium sea realista."
      />

      <LabLayout
        controls={
          <>
            <div className="flex items-center justify-between">
              <span className="eyebrow">estrategia</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {STRATS.map((o) => {
                const active = o.value === strat;
                return (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => setStrat(o.value)}
                    className={`rounded-md border px-2.5 py-1 text-[12px] font-medium transition-all ${
                      active
                        ? "border-brass/40 bg-ink-3 text-brass"
                        : "border-line bg-ink-2 text-muted hover:text-text"
                    }`}
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>

            <div className="border-t border-line pt-4">
              <span className="eyebrow">parámetros</span>
            </div>
            <Slider label="Spot · S" value={S} onChange={setS} min={20} max={300} step={1} format={(v) => `$${v.toFixed(0)}`} />
            <Slider label="Volatilidad · σ" value={sigma} onChange={setSigma} min={0.05} max={1} step={0.01} format={(v) => `${(v * 100).toFixed(0)}%`} accent={COLORS.cyan} />
            <Slider label="Tiempo · T (años)" value={T} onChange={setT} min={0.05} max={2} step={0.05} format={(v) => `${v.toFixed(2)}y`} />
            <Slider label="Tasa · r" value={r} onChange={setR} min={0} max={0.2} step={0.005} format={(v) => `${(v * 100).toFixed(1)}%`} />

            <div className="rounded-lg border border-line bg-ink-2 px-3 py-2.5">
              <div className="eyebrow mb-1 text-[10px]">prima neta</div>
              <div className={`readout text-[26px] font-semibold ${net <= 0 ? "text-gain" : "text-brass"}`}>
                {signedMoney(-net)}
              </div>
              <div className="readout mt-1 text-[11px] text-dim">
                {net > 0 ? "débito · pagás al abrir" : "crédito · cobrás al abrir"}
              </div>
            </div>
          </>
        }
      >
        <div className="panel glow-brass flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="eyebrow mb-1 text-brass">Sirve para</div>
            <p className="font-display text-[19px] font-medium leading-snug text-text">
              {SUMMARY[strat]}.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <span className="chip">
              <span className="text-dim">visión</span>&nbsp;<span className="text-text">{USE_NOTE[strat].view}</span>
            </span>
            <span className="chip">
              <span className="text-dim">flujo</span>&nbsp;
              <span className={USE_NOTE[strat].cost.toLowerCase().includes("crédito") ? "text-gain" : "text-text"}>
                {USE_NOTE[strat].cost}
              </span>
            </span>
          </div>
        </div>

        <Panel title="Diagrama de payoff">
          <LineChart
            series={series}
            vLines={vLines}
            hLines={[{ v: 0, color: COLORS.dim }]}
            xLabel="Spot al vencimiento"
            yLabel="P&L"
            height={400}
            yFormat={(v) => (Math.abs(v) >= 100 ? v.toFixed(0) : v.toFixed(1))}
            xFormat={(v) => v.toFixed(0)}
          />
        </Panel>

        <Panel title="Resultado">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <Stat
              label="Prima neta"
              value={signedMoney(-net)}
              tone="brass"
              hint={net > 0 ? "débito" : "crédito"}
            />
            <Stat
              label="Máx ganancia"
              value={finite(maxProfit) ? money(maxProfit) : "∞"}
              tone="gain"
            />
            <Stat label="Máx pérdida" value={money(maxLoss)} tone="loss" />
            <Stat label="Patas" value={String(strategy.legs.length)} tone="cyan" />
          </div>
          <p className="mt-3 text-[13px] leading-relaxed text-muted">{strategy.description}</p>
        </Panel>

        <Panel title="Patas de la posición">
          <div className="overflow-hidden rounded-lg border border-line">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-line bg-ink-2 text-dim">
                  <th className="px-3 py-2 font-medium">Tipo</th>
                  <th className="px-3 py-2 text-right font-medium">Cantidad</th>
                  <th className="px-3 py-2 text-right font-medium">Strike</th>
                  <th className="px-3 py-2 text-right font-medium">Premium</th>
                </tr>
              </thead>
              <tbody>
                {strategy.legs.map((leg, i) => {
                  const long = leg.quantity > 0;
                  return (
                    <tr key={i} className="border-b border-line last:border-0">
                      <td className="px-3 py-2 text-text">{LEG_LABEL[leg.optionType]}</td>
                      <td className={`readout px-3 py-2 text-right ${long ? "text-gain" : "text-loss"}`}>
                        {long ? "+" : "−"}
                        {Math.abs(leg.quantity)}
                      </td>
                      <td className="readout px-3 py-2 text-right text-muted">
                        {leg.optionType === "stock" ? "—" : leg.strike.toFixed(0)}
                      </td>
                      <td className="readout px-3 py-2 text-right text-muted">
                        {money(leg.premium)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Desglose del payoff por rango">
          <p className="mb-4 max-w-2xl text-[13px] leading-relaxed text-muted">
            Cómo paga cada pata según dónde termine el subyacente <span className="readout text-text">S</span> al
            vencimiento. Los <span className="text-text">strikes parten la recta</span> en tramos; en cada uno el
            payoff es lineal. Es el <span className="text-brass">payoff bruto</span> (sin restar la prima): el neto =
            bruto {net >= 0 ? "−" : "+"} <span className="readout">{money(Math.abs(net))}</span> de prima.
          </p>
          <div className="overflow-x-auto rounded-lg border border-line">
            <table className="w-full min-w-[520px] text-left text-[13px]">
              <thead>
                <tr className="border-b border-line bg-ink-2 text-dim">
                  <th className="whitespace-nowrap px-3 py-2.5 font-medium">
                    <span className="eyebrow text-[10px]">Rango de S</span>
                  </th>
                  {breakdown.headers.map((h, i) => (
                    <th key={i} className="whitespace-nowrap px-3 py-2.5 text-right font-medium">
                      <span className="readout text-[11px] text-muted">{h}</span>
                    </th>
                  ))}
                  <th className="whitespace-nowrap px-3 py-2.5 text-right font-medium">
                    <span className="eyebrow text-[10px] text-brass">Payoff total</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {breakdown.rows.map((row, i) => (
                  <tr key={i} className="border-b border-line/60 last:border-0">
                    <td className="readout whitespace-nowrap px-3 py-2.5 text-text">{row.range}</td>
                    {row.cells.map((c, j) => (
                      <td key={j} className="readout px-3 py-2.5 text-right text-muted">{c}</td>
                    ))}
                    <td className="readout px-3 py-2.5 text-right font-semibold text-brass">{row.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[12px] leading-relaxed text-dim">
            Leé cada celda como el valor de esa pata en ese tramo (con <span className="readout">S</span> = S al
            vencimiento). Donde el total es constante, el payoff está <span className="text-text">capado</span>; donde
            depende de <span className="readout">S</span>, la posición tiene dirección.
          </p>
        </Panel>

        <Panel title="¿Para qué usarla?">
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="chip">
              <span className="text-dim">visión</span>&nbsp;<span className="text-text">{USE_NOTE[strat].view}</span>
            </span>
            <span className="chip">
              <span className="text-dim">flujo</span>&nbsp;
              <span className={USE_NOTE[strat].cost.toLowerCase().includes("crédito") ? "text-gain" : "text-text"}>
                {USE_NOTE[strat].cost}
              </span>
            </span>
          </div>
          <p className="text-[14px] leading-relaxed text-muted">{USE_NOTE[strat].text}</p>
        </Panel>
      </LabLayout>
    </div>
  );
}
