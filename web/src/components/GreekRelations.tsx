"use client";

import { useMemo, useState } from "react";
import { Segmented } from "@/components/ui/Segmented";
import { LineChart, type Series } from "@/components/charts/LineChart";
import {
  delta as fDelta, gamma as fGamma, vega as fVega, theta as fTheta, rho as fRho,
  linspace, type OptionType,
} from "@/lib/quant";
import { COLORS } from "@/lib/colors";

function normalize(ys: number[]): number[] {
  const m = Math.max(...ys.map((y) => Math.abs(y)), 1e-12);
  return ys.map((y) => y / m);
}

interface Props {
  K: number; T: number; r: number; sigma: number; q: number; optionType: OptionType; spot: number;
}

type VsGreek = "gamma" | "vega" | "theta" | "rho";

export function GreekRelations({ K, T, r, sigma, q, optionType, spot }: Props) {
  const [mode, setMode] = useState<"overlay" | "vsDelta">("overlay");
  const [vs, setVs] = useState<VsGreek>("theta");

  const xs = useMemo(() => linspace(K * 0.4, K * 1.6, 180), [K]);

  // Overlay normalizado vs spot
  const overlay = useMemo<Series[]>(() => {
    const d = xs.map((s) => fDelta(s, K, T, r, sigma, q, optionType));
    const g = xs.map((s) => fGamma(s, K, T, r, sigma, q));
    const v = xs.map((s) => fVega(s, K, T, r, sigma, q));
    const t = xs.map((s) => fTheta(s, K, T, r, sigma, q, optionType));
    const rh = xs.map((s) => fRho(s, K, T, r, sigma, q, optionType));
    return [
      { x: xs, y: normalize(d), color: COLORS.brass, label: "delta", width: 2.5 },
      { x: xs, y: normalize(g), color: COLORS.cyan, label: "gamma", width: 2 },
      { x: xs, y: normalize(v), color: COLORS.iris, label: "vega", width: 2 },
      { x: xs, y: normalize(t), color: COLORS.loss, label: "theta", width: 2 },
      { x: xs, y: normalize(rh), color: COLORS.gain, label: "rho", width: 2 },
    ];
  }, [xs, K, T, r, sigma, q, optionType]);

  // Una griega como función de delta
  const vsDelta = useMemo<Series[]>(() => {
    const pts = xs
      .map((s) => {
        const d = fDelta(s, K, T, r, sigma, q, optionType);
        const y =
          vs === "gamma" ? fGamma(s, K, T, r, sigma, q)
          : vs === "vega" ? fVega(s, K, T, r, sigma, q)
          : vs === "theta" ? fTheta(s, K, T, r, sigma, q, optionType) / 365
          : fRho(s, K, T, r, sigma, q, optionType);
        return { d, y };
      })
      .sort((a, b) => a.d - b.d);
    const color =
      vs === "gamma" ? COLORS.cyan : vs === "vega" ? COLORS.iris : vs === "theta" ? COLORS.loss : COLORS.gain;
    return [{ x: pts.map((p) => p.d), y: pts.map((p) => p.y), color, label: `${vs}${vs === "theta" ? "/día" : ""} vs delta`, width: 2.5, fillToZero: true, fillColor: color }];
  }, [xs, K, T, r, sigma, q, optionType, vs]);

  const spotDelta = fDelta(spot, K, T, r, sigma, q, optionType);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Segmented
          options={[{ value: "overlay", label: "Todas vs spot" }, { value: "vsDelta", label: "Una vs delta" }]}
          value={mode}
          onChange={(v) => setMode(v as "overlay" | "vsDelta")}
        />
        {mode === "vsDelta" && (
          <Segmented
            size="sm"
            options={[
              { value: "gamma", label: "Gamma" },
              { value: "vega", label: "Vega" },
              { value: "theta", label: "Theta" },
              { value: "rho", label: "Rho" },
            ]}
            value={vs}
            onChange={(v) => setVs(v as VsGreek)}
          />
        )}
      </div>

      {mode === "overlay" ? (
        <>
          <LineChart
            series={overlay}
            vLines={[
              { v: K, color: COLORS.muted, label: `K=${K}` },
              { v: spot, color: "#eef2f5", label: "spot", dash: "2 2" },
            ]}
            hLines={[{ v: 0, color: COLORS.dim }]}
            xLabel="Spot del subyacente"
            yLabel="cada griega ÷ su máximo"
            height={380}
            yFormat={(v) => v.toFixed(1)}
            domainY={[-1.1, 1.1]}
          />
          <p className="mt-3 text-[13px] leading-relaxed text-muted">
            Cada griega está <span className="text-text">normalizada por su propio máximo</span> para verlas juntas.
            Mirá cómo, en ATM (cerca de <span className="text-cyan">K</span>), <span className="text-cyan">gamma</span> y
            <span className="text-iris"> vega</span> hacen pico, y ahí mismo <span className="text-loss">theta</span> toca
            su mínimo (la más negativa): es el <span className="text-text">trade-off gamma-theta</span>.
          </p>
        </>
      ) : (
        <>
          <LineChart
            series={vsDelta}
            vLines={[{ v: spotDelta, color: "#eef2f5", label: "delta actual", dash: "2 2" }]}
            hLines={vs === "theta" || vs === "rho" ? [{ v: 0, color: COLORS.dim }] : []}
            xLabel="Delta"
            yLabel={vs === "theta" ? "Theta / día" : vs}
            height={380}
            xFormat={(v) => v.toFixed(2)}
            yFormat={(v) => (Math.abs(v) >= 10 ? v.toFixed(0) : v.toFixed(3))}
          />
          <p className="mt-3 text-[13px] leading-relaxed text-muted">
            Eje X = <span className="text-brass">delta</span> (a medida que el spot se mueve, delta va de
            {optionType === "call" ? " 0 a 1" : " −1 a 0"}). Así ves directamente qué le pasa a{" "}
            <span className="text-text">{vs}</span> cuando cambia delta.{" "}
            {vs === "theta" && "Theta es más negativa con delta ≈ 0.5 (ATM), donde más valor temporal hay para perder."}
            {vs === "gamma" && "Gamma es máxima con delta ≈ 0.5 y cae hacia los extremos (delta saturada en 0 o 1)."}
            {vs === "rho" && "Rho crece monótonamente con delta: cuanto más ITM, más sensible a la tasa."}
            {vs === "vega" && "Vega acompaña a gamma: máxima en ATM (delta ≈ 0.5) y decae en las alas."}
          </p>
        </>
      )}
    </div>
  );
}
