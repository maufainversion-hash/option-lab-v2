"use client";

import { useMemo, useState } from "react";
import { LabHeader, LabLayout, Panel } from "@/components/LabLayout";
import { Slider } from "@/components/ui/Slider";
import { Segmented } from "@/components/ui/Segmented";
import { Stat } from "@/components/ui/Stat";
import { Formula } from "@/components/ui/Formula";
import { LineChart, type Series } from "@/components/charts/LineChart";
import { GreekSurface } from "@/components/three/GreekSurface";
import {
  bsPriceBoth, allGreeks, greekByName, timeValue, intrinsic, linspace,
  type GreekName, type OptionType,
} from "@/lib/quant";
import { COLORS } from "@/lib/colors";

type Metric = "price" | GreekName;

const METRICS: { value: Metric; label: string }[] = [
  { value: "price", label: "Precio" },
  { value: "delta", label: "Delta" },
  { value: "gamma", label: "Gamma" },
  { value: "vega", label: "Vega" },
  { value: "theta", label: "Theta" },
  { value: "rho", label: "Rho" },
];

const METRIC_NOTE: Record<Metric, string> = {
  price: "Valor presente del payoff esperado bajo medida risk-neutral. Sube con S (call), σ y T.",
  delta: "∂V/∂S. Cuántos dólares se mueve la opción por cada dólar del subyacente. Call ∈ [0,1], put ∈ [−1,0].",
  gamma: "∂²V/∂S². Convexidad: cuánto cambia delta. Explota en ATM cerca del vencimiento.",
  vega: "∂V/∂σ. Sensibilidad a la volatilidad. Máxima en ATM y crece con el tiempo a vencimiento.",
  theta: "∂V/∂t. Decaimiento temporal: lo que pierde la opción por el paso del tiempo (por año).",
  rho: "∂V/∂r. Sensibilidad a la tasa libre de riesgo. Mayor en opciones largas y muy ITM.",
};

export default function PricingLab() {
  const [S, setS] = useState(42);
  const [K, setK] = useState(40);
  const [T, setT] = useState(0.5);
  const [sigma, setSigma] = useState(0.2);
  const [r, setR] = useState(0.1);
  const [q, setQ] = useState(0);
  const [type, setType] = useState<OptionType>("call");
  const [metric, setMetric] = useState<Metric>("price");
  const [dim, setDim] = useState<"2d" | "3d">("2d");

  const { call, put } = useMemo(() => bsPriceBoth(S, K, T, r, sigma, q), [S, K, T, r, sigma, q]);
  const g = useMemo(() => allGreeks(S, K, T, r, sigma, q, type), [S, K, T, r, sigma, q, type]);
  const tv = useMemo(() => timeValue(S, K, T, r, sigma, q, type), [S, K, T, r, sigma, q, type]);

  const series = useMemo<Series[]>(() => {
    const xs = linspace(K * 0.5, K * 1.5, 160);
    const f = (ot: OptionType) =>
      xs.map((s) =>
        metric === "price"
          ? bsPriceBoth(s, K, T, r, sigma, q)[ot]
          : greekByName(metric, s, K, T, r, sigma, q, ot),
      );
    if (metric === "gamma" || metric === "vega") {
      return [{ x: xs, y: f("call"), color: COLORS.cyan, label: metric, fillToZero: true, fillColor: COLORS.cyan }];
    }
    return [
      { x: xs, y: f("call"), color: COLORS.gain, label: "call" },
      { x: xs, y: f("put"), color: COLORS.loss, label: "put" },
    ];
  }, [metric, K, T, r, sigma, q]);

  const price = type === "call" ? call : put;
  const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8">
      <LabHeader
        eyebrow="pricing & griegas"
        hull="Hull 14 · 19"
        title={<>Black-Scholes, <span className="text-brass italic">vivo</span></>}
        subtitle="Mové los parámetros y mirá el precio y las cinco griegas recalcularse al instante. Cambiá a la superficie 3D para ver cómo cada griega vive sobre spot × tiempo."
      />

      <LabLayout
        controls={
          <>
            <div className="flex items-center justify-between">
              <span className="eyebrow">parámetros</span>
              <Segmented
                size="sm"
                options={[{ value: "call", label: "Call" }, { value: "put", label: "Put" }]}
                value={type}
                onChange={(v) => setType(v as OptionType)}
              />
            </div>
            <Slider label="Spot · S" value={S} onChange={setS} min={1} max={2 * K} step={0.5} format={(v) => `$${v.toFixed(1)}`} />
            <Slider label="Strike · K" value={K} onChange={setK} min={1} max={200} step={1} format={(v) => `$${v.toFixed(0)}`} />
            <Slider label="Tiempo · T (años)" value={T} onChange={setT} min={0.02} max={3} step={0.02} format={(v) => `${v.toFixed(2)}y`} />
            <Slider label="Volatilidad · σ" value={sigma} onChange={setSigma} min={0.01} max={1.5} step={0.01} format={pct} accent={COLORS.cyan} />
            <Slider label="Tasa · r" value={r} onChange={setR} min={0} max={0.3} step={0.005} format={pct} />
            <Slider label="Dividend yield · q" value={q} onChange={setQ} min={0} max={0.2} step={0.005} format={pct} />
            <div className="rounded-lg border border-line bg-ink-2 px-3 py-2.5">
              <div className="eyebrow mb-1 text-[10px]">precio {type}</div>
              <div className="readout text-[26px] font-semibold text-brass">${price.toFixed(4)}</div>
              <div className="readout mt-1 text-[11px] text-dim">
                intrínseco ${intrinsic(S, K, type).toFixed(2)} · temporal ${tv.toFixed(2)}
              </div>
            </div>
          </>
        }
      >
        <Panel title="Valuación">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
            <Stat label="Precio" value={`$${price.toFixed(3)}`} tone="brass" />
            <Stat label="Delta" value={g.delta.toFixed(4)} tone={g.delta >= 0 ? "gain" : "loss"} />
            <Stat label="Gamma" value={g.gamma.toFixed(4)} tone="cyan" />
            <Stat label="Vega" value={g.vega.toFixed(3)} hint="por 1.00 de σ" />
            <Stat label="Theta/día" value={(g.theta / 365).toFixed(4)} tone="loss" hint="por día" />
            <Stat label="Rho" value={g.rho.toFixed(3)} hint="por 1.00 de r" />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            <Stat label="Call (BS)" value={`$${call.toFixed(4)}`} tone="gain" />
            <Stat label="Put (BS)" value={`$${put.toFixed(4)}`} tone="loss" />
          </div>
        </Panel>

        <Panel
          title="Visualización"
          right={
            <Segmented
              size="sm"
              options={[{ value: "2d", label: "2D" }, { value: "3d", label: "3D" }]}
              value={dim}
              onChange={(v) => setDim(v as "2d" | "3d")}
            />
          }
        >
          <div className="mb-4">
            <Segmented options={METRICS} value={metric} onChange={(v) => setMetric(v as Metric)} />
          </div>
          {dim === "2d" ? (
            <LineChart
              series={series}
              vLines={[{ v: K, color: COLORS.muted, label: `K=${K}` }, { v: S, color: "#eef2f5", label: "spot", dash: "2 2" }]}
              hLines={metric === "price" || metric === "gamma" || metric === "vega" ? [] : [{ v: 0, color: COLORS.dim }]}
              xLabel="Spot del subyacente"
              yLabel={metric === "price" ? "Precio" : metric}
              height={380}
              yFormat={(v) => (Math.abs(v) >= 100 ? v.toFixed(0) : v.toFixed(2))}
            />
          ) : (
            <div className="blueprint relative h-[420px] overflow-hidden rounded-xl border border-line">
              <GreekSurface metric={metric} K={K} r={r} sigma={sigma} q={q} optionType={type} />
              <div className="pointer-events-none absolute left-3 top-3">
                <div className="eyebrow text-[10px]">{metric} · superficie</div>
                <div className="readout text-[11px] text-muted">sobre spot × tiempo</div>
              </div>
            </div>
          )}
          <p className="mt-3 text-[13px] leading-relaxed text-muted">{METRIC_NOTE[metric]}</p>
        </Panel>

        <Panel title="La fórmula">
          <div className="space-y-3 text-[14px] text-muted">
            <Formula display tex={"c = S_0 e^{-qT} N(d_1) - K e^{-rT} N(d_2)"} />
            <Formula display tex={"p = K e^{-rT} N(-d_2) - S_0 e^{-qT} N(-d_1)"} />
            <Formula display tex={"d_1 = \\frac{\\ln(S_0/K) + (r - q + \\sigma^2/2)T}{\\sigma\\sqrt{T}}, \\quad d_2 = d_1 - \\sigma\\sqrt{T}"} />
            <p className="text-[13px] text-dim">
              Validado contra Hull, Ejemplo 14.6 (S=42, K=40, T=0.5, r=10%, σ=20% → call 4.7594, put 0.8086).
            </p>
          </div>
        </Panel>
      </LabLayout>
    </div>
  );
}
