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

const USE_NOTE: Record<StratKey, string> = {
  longCall:
    "Cuando esperás una suba marcada del subyacente y querés apalancamiento con pérdida acotada al premium pagado.",
  longPut:
    "Cuando esperás una caída o querés cubrir una posición larga. La pérdida máxima es el premium.",
  coveredCall:
    "Tenés la acción y querés generar income vendiendo el alza por encima de K. Ideal en mercados laterales o levemente alcistas.",
  protectivePut:
    "Tenés la acción y querés un seguro contra caídas. El put fija un piso a costa del premium.",
  bullCall:
    "Visión alcista moderada: querés exposición al alza pero abaratando el premium resignando la ganancia por encima de Khigh.",
  bearPut:
    "Visión bajista moderada con riesgo y costo capados. Ganás si el subyacente cae hacia el strike inferior.",
  straddle:
    "Esperás un movimiento grande pero no sabés la dirección (earnings, eventos). Ganás con la volatilidad realizada.",
  strangle:
    "Igual que el straddle pero más barato: necesitás un movimiento aún mayor para compensar el menor costo.",
  butterfly:
    "Apostás a que el subyacente termina cerca de Kmid con baja volatilidad. Riesgo y ganancia muy acotados.",
  ironCondor:
    "Cobrás prima apostando a que el subyacente queda dentro de un rango. Crédito neto con pérdida limitada en los extremos.",
  collar:
    "Tenés la acción y armás un bracket de bajo costo: el call short financia el put que pone el piso.",
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

        <Panel title="Cuándo usarla">
          <p className="text-[14px] leading-relaxed text-muted">{USE_NOTE[strat]}</p>
        </Panel>
      </LabLayout>
    </div>
  );
}
