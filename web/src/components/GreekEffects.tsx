"use client";

import { useState } from "react";
import { bsPrice, type Greeks, type OptionType } from "@/lib/quant";

interface Props {
  S: number; K: number; T: number; r: number; sigma: number; q: number;
  optionType: OptionType; price: number; g: Greeks;
}

function NumInput({ value, onChange, step = 1, suffix }: { value: number; onChange: (v: number) => void; step?: number; suffix?: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <input
        type="number"
        value={value}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="readout w-16 rounded-md border border-line bg-ink-2 px-2 py-1 text-[13px] text-text outline-none focus:border-brass/50"
      />
      {suffix && <span className="readout text-[12px] text-dim">{suffix}</span>}
    </span>
  );
}

const money = (v: number) => `${v >= 0 ? "+" : "−"}$${Math.abs(v).toFixed(3)}`;
const tone = (v: number) => (Math.abs(v) < 1e-9 ? "text-muted" : v > 0 ? "text-gain" : "text-loss");

export function GreekEffects({ S, K, T, r, sigma, q, optionType, price, g }: Props) {
  const [dS, setDS] = useState(1);
  const [dVol, setDVol] = useState(1); // puntos de vol (1 = 1%)
  const [dDays, setDDays] = useState(1);
  const [dR, setDR] = useState(1); // puntos de tasa (1 = 1%)

  const thetaDay = g.theta / 365;

  // Spot: 1er orden (delta) + 2do orden (gamma)
  const estS = g.delta * dS + 0.5 * g.gamma * dS * dS;
  const exactS = bsPrice(S + dS, K, T, r, sigma, q, optionType) - price;
  const newDelta = g.delta + g.gamma * dS;

  // Volatilidad
  const dSig = dVol / 100;
  const estV = g.vega * dSig;
  const exactV = bsPrice(S, K, T, r, sigma + dSig, q, optionType) - price;

  // Tiempo (pasan dDays)
  const dT = dDays / 365;
  const estT = thetaDay * dDays;
  const exactT = bsPrice(S, K, Math.max(T - dT, 1e-6), r, sigma, q, optionType) - price;

  // Tasa
  const dRate = dR / 100;
  const estR = g.rho * dRate;
  const exactR = bsPrice(S, K, T, r + dRate, sigma, q, optionType) - price;

  const rows = [
    {
      change: <>Spot sube <NumInput value={dS} onChange={setDS} step={0.5} suffix="$" /></>,
      driver: "Delta + Gamma",
      read: <>Por cada $1 que sube el spot, la opción se mueve ~<span className="readout text-text">${g.delta.toFixed(3)}</span> (delta). Gamma hace que delta pase a ~<span className="readout text-text">{newDelta.toFixed(3)}</span>.</>,
      est: estS, exact: exactS,
    },
    {
      change: <>Volatilidad sube <NumInput value={dVol} onChange={setDVol} suffix="pts" /></>,
      driver: "Vega",
      read: <>Cada punto de vol (+1%) cambia el precio ~<span className="readout text-text">${(g.vega / 100).toFixed(3)}</span> (vega por 1%).</>,
      est: estV, exact: exactV,
    },
    {
      change: <>Pasan <NumInput value={dDays} onChange={setDDays} suffix="días" /></>,
      driver: "Theta",
      read: <>Cada día que pasa (sin moverse nada) {thetaDay >= 0 ? "ganás" : "perdés"} ~<span className="readout text-text">${Math.abs(thetaDay).toFixed(3)}</span> de valor temporal (theta/día).</>,
      est: estT, exact: exactT,
    },
    {
      change: <>Tasa sube <NumInput value={dR} onChange={setDR} suffix="pts" /></>,
      driver: "Rho",
      read: <>Cada punto de tasa (+1%) cambia el precio ~<span className="readout text-text">${(g.rho / 100).toFixed(3)}</span> (rho por 1%).</>,
      est: estR, exact: exactR,
    },
  ];

  return (
    <div>
      <p className="mb-4 max-w-2xl text-[13.5px] leading-relaxed text-muted">
        Cada griega es una regla de <span className="text-text">causa → efecto</span>: te dice cuánto se mueve el precio
        ante un cambio chico de un parámetro. Cambiá el tamaño del shock y comparalo con el valor{" "}
        <span className="text-text">exacto</span> (repreciando con Black-Scholes).
      </p>
      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[640px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-line bg-ink-2 text-dim">
              <th className="px-3 py-2.5"><span className="eyebrow text-[10px]">Si…</span></th>
              <th className="px-3 py-2.5"><span className="eyebrow text-[10px]">Griega</span></th>
              <th className="px-3 py-2.5 text-right"><span className="eyebrow text-[10px]">Δ estimado</span></th>
              <th className="px-3 py-2.5 text-right"><span className="eyebrow text-[10px]">Δ exacto</span></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-line/60 align-top last:border-0">
                <td className="px-3 py-3">
                  <div className="mb-1 text-text">{row.change}</div>
                  <div className="max-w-md text-[12px] leading-relaxed text-muted">{row.read}</div>
                </td>
                <td className="px-3 py-3"><span className="chip text-[10px]">{row.driver}</span></td>
                <td className={`readout px-3 py-3 text-right font-semibold ${tone(row.est)}`}>{money(row.est)}</td>
                <td className={`readout px-3 py-3 text-right ${tone(row.exact)}`}>{money(row.exact)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[12px] leading-relaxed text-dim">
        La <span className="text-text">estimación</span> usa las griegas (1er orden, + gamma para el spot); el{" "}
        <span className="text-text">exacto</span> reprecia con Black-Scholes. Para cambios chicos casi coinciden; en
        cambios grandes la diferencia es la convexidad (gamma) que la aproximación lineal no captura.
      </p>
    </div>
  );
}
