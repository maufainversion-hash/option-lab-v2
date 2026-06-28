"use client";

import { useMemo, useState } from "react";
import { LabHeader, LabLayout, Panel } from "@/components/LabLayout";
import { Slider } from "@/components/ui/Slider";
import { Segmented } from "@/components/ui/Segmented";
import { Stat } from "@/components/ui/Stat";
import { Formula } from "@/components/ui/Formula";
import { LineChart, type Series } from "@/components/charts/LineChart";
import {
  simulateGbmPaths, lognormalQuantiles, mcConvergence, bsPrice, linspace,
  type OptionType,
} from "@/lib/quant";
import { COLORS } from "@/lib/colors";

type View = "paths" | "dist" | "conv";

const VIEWS: { value: View; label: string }[] = [
  { value: "paths", label: "Paths" },
  { value: "dist", label: "Distribución" },
  { value: "conv", label: "Convergencia" },
];

const PATH_COLOR = "rgba(120,150,200,0.18)";

const VIEW_NOTE: Record<View, string> = {
  paths:
    "Cada trayectoria es un movimiento browniano geométrico simulado: dlnS = (μ−σ²/2)dt + σ√dt·z. Las bandas marcan los cuantiles 5/50/95% analíticos log-normales.",
  dist:
    "El terminal S_T es log-normal. El histograma de 20.000 simulaciones converge a la densidad teórica; la media simulada se acerca a E[S_T]=S₀e^{μT} a medida que crece la muestra.",
  conv:
    "El estimador MC es insesgado y su error estándar cae como 1/√N. Cuadruplicar N halva el intervalo de confianza — por eso la curva de SE es paralela a la referencia ∝1/√N.",
};

export default function MonteCarloLab() {
  const [view, setView] = useState<View>("paths");

  // --- Paths / Distribución ---
  const [S0, setS0] = useState(100);
  const [mu, setMu] = useState(0.08);
  const [sigma, setSigma] = useState(0.25);
  const [T, setT] = useState(1);
  const [steps, setSteps] = useState(60);
  const [nPaths, setNPaths] = useState(80);
  const [seed, setSeed] = useState(7);

  // --- Convergencia ---
  const [cS, setCS] = useState(42);
  const [cK, setCK] = useState(40);
  const [cT, setCT] = useState(0.5);
  const [cSigma, setCSigma] = useState(0.2);
  const [cR, setCR] = useState(0.1);
  const [cType, setCType] = useState<OptionType>("call");
  const [anti, setAnti] = useState(true);

  const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

  // ---------- A) PATHS ----------
  const pathsData = useMemo(() => {
    const tGrid = linspace(0, T, steps + 1);
    const draw = Math.min(nPaths, 300);
    const paths = simulateGbmPaths(S0, mu, sigma, T, steps, draw, seed);

    const pathSeries: Series[] = paths.map((p) => ({
      x: tGrid,
      y: p,
      color: PATH_COLOR,
      width: 1,
    }));

    const tq = tGrid.slice(1);
    const q = lognormalQuantiles(S0, mu, sigma, tq);
    const bands: Series[] = [
      { x: tq, y: q.lo, color: COLORS.brass, width: 2, dash: "5 4", label: "cuantil 5%" },
      { x: tq, y: q.median, color: COLORS.gain, width: 2.25, label: "mediana" },
      { x: tq, y: q.hi, color: COLORS.brass, width: 2, dash: "5 4", label: "cuantil 95%" },
    ];

    const terminal = paths.map((p) => p[p.length - 1]);
    const n = terminal.length;
    let minST = Infinity, maxST = -Infinity, below = 0, above = 0;
    for (const v of terminal) {
      if (v < minST) minST = v;
      if (v > maxST) maxST = v;
      if (v < S0) below++;
      if (v > 1.5 * S0) above++;
    }

    return {
      series: [...pathSeries, ...bands],
      minST, maxST,
      pBelow: below / n,
      pAbove: above / n,
    };
  }, [S0, mu, sigma, T, steps, nPaths, seed]);

  // ---------- B) DISTRIBUCIÓN ----------
  const distData = useMemo(() => {
    const N = 20000;
    const sim = simulateGbmPaths(S0, mu, sigma, T, 1, N, seed);
    const term = sim.map((p) => p[1]);

    let lo = Infinity, hi = -Infinity, sum = 0, sumSq = 0;
    for (const v of term) {
      if (v < lo) lo = v;
      if (v > hi) hi = v;
      sum += v;
      sumSq += v * v;
    }
    const meanSim = sum / N;
    const varSim = Math.max(0, sumSq / N - meanSim * meanSim);
    const stdSim = Math.sqrt(varSim);

    const nBins = 60;
    const binW = (hi - lo) / nBins || 1;
    const counts = new Array(nBins).fill(0);
    for (const v of term) {
      let idx = Math.floor((v - lo) / binW);
      if (idx < 0) idx = 0;
      if (idx >= nBins) idx = nBins - 1;
      counts[idx]++;
    }
    const histX = counts.map((_, i) => lo + (i + 0.5) * binW);
    const histY = counts.map((c) => c / (N * binW));

    const mLog = Math.log(S0) + (mu - 0.5 * sigma * sigma) * T;
    const sLog = sigma * Math.sqrt(T);
    const SQRT2PI = Math.sqrt(2 * Math.PI);
    const pdfX = linspace(Math.max(lo, 1e-6), hi, 240);
    const pdfY = pdfX.map((x) =>
      x > 0
        ? (1 / (x * sLog * SQRT2PI)) * Math.exp(-((Math.log(x) - mLog) ** 2) / (2 * sLog * sLog))
        : 0,
    );

    // analíticos log-normales
    const meanAn = S0 * Math.exp(mu * T);
    const varAn = meanAn * meanAn * (Math.exp(sLog * sLog) - 1);
    const stdAn = Math.sqrt(varAn);

    const series: Series[] = [
      { x: histX, y: histY, color: COLORS.cyan, width: 1.25, fillToZero: true, fillColor: COLORS.cyan, label: "simulado" },
      { x: pdfX, y: pdfY, color: COLORS.brass, width: 2.25, label: "log-normal teórica" },
    ];

    return { series, meanAn, meanSim, stdAn, stdSim };
  }, [S0, mu, sigma, T, seed]);

  // ---------- C) CONVERGENCIA ----------
  const convData = useMemo(() => {
    const nValues = [500, 1000, 2500, 5000, 10000, 25000, 50000, 100000, 250000];
    const bsRef = bsPrice(cS, cK, cT, cR, cSigma, 0, cType);
    const conv = mcConvergence(cS, cK, cT, cR, cSigma, 0, cType, nValues, anti, 42);

    const priceSeries: Series[] = [
      { x: conv.n, y: conv.price, color: COLORS.gain, width: 2.25, label: "precio MC" },
      { x: conv.n, y: conv.ci95Lo, color: COLORS.gain, width: 1, dash: "2 3", label: "CI 95%" },
      { x: conv.n, y: conv.ci95Hi, color: COLORS.gain, width: 1, dash: "2 3" },
    ];

    const ref = conv.n.map((_, i) => conv.stderr[0] * Math.sqrt(conv.n[0] / conv.n[i]));
    const errSeries: Series[] = [
      { x: conv.n, y: conv.stderr, color: COLORS.cyan, width: 2.25, label: "std error" },
      { x: conv.n, y: ref, color: COLORS.brass, width: 1.75, dash: "5 4", label: "∝ 1/√N" },
    ];

    const last = conv.price.length - 1;
    return {
      bsRef,
      priceSeries,
      errSeries,
      mcPrice: conv.price[last],
      mcStderr: conv.stderr[last],
      diff: conv.price[last] - bsRef,
    };
  }, [cS, cK, cT, cSigma, cR, cType, anti]);

  const controls =
    view === "conv" ? (
      <>
        <div className="flex items-center justify-between">
          <span className="eyebrow">pricing</span>
          <Segmented
            size="sm"
            options={[{ value: "call", label: "Call" }, { value: "put", label: "Put" }]}
            value={cType}
            onChange={(v) => setCType(v as OptionType)}
          />
        </div>
        <Slider label="Spot · S" value={cS} onChange={setCS} min={1} max={120} step={0.5} format={(v) => `$${v.toFixed(1)}`} />
        <Slider label="Strike · K" value={cK} onChange={setCK} min={1} max={120} step={1} format={(v) => `$${v.toFixed(0)}`} />
        <Slider label="Tiempo · T (años)" value={cT} onChange={setCT} min={0.02} max={3} step={0.02} format={(v) => `${v.toFixed(2)}y`} />
        <Slider label="Volatilidad · σ" value={cSigma} onChange={setCSigma} min={0.01} max={1} step={0.01} format={pct} accent={COLORS.cyan} />
        <Slider label="Tasa · r" value={cR} onChange={setCR} min={0} max={0.3} step={0.005} format={pct} />
        <div className="flex items-center justify-between rounded-lg border border-line bg-ink-2 px-3 py-2.5">
          <span className="text-[12px] font-medium text-muted">Variates antitéticas</span>
          <Segmented
            size="sm"
            options={[{ value: "on", label: "On" }, { value: "off", label: "Off" }]}
            value={anti ? "on" : "off"}
            onChange={(v) => setAnti(v === "on")}
          />
        </div>
        <div className="rounded-lg border border-line bg-ink-2 px-3 py-2.5">
          <div className="eyebrow mb-1 text-[10px]">precio MC · 250k</div>
          <div className="readout text-[26px] font-semibold text-gain">${convData.mcPrice.toFixed(4)}</div>
          <div className="readout mt-1 text-[11px] text-dim">
            BS ${convData.bsRef.toFixed(4)} · ±{convData.mcStderr.toFixed(4)}
          </div>
        </div>
      </>
    ) : (
      <>
        <span className="eyebrow">parámetros gbm</span>
        <Slider label="S inicial · S₀" value={S0} onChange={setS0} min={1} max={300} step={1} format={(v) => `$${v.toFixed(0)}`} />
        <Slider label="Drift · μ" value={mu} onChange={setMu} min={-0.3} max={0.4} step={0.005} format={pct} />
        <Slider label="Volatilidad · σ" value={sigma} onChange={setSigma} min={0.01} max={1} step={0.01} format={pct} accent={COLORS.cyan} />
        <Slider label="Horizonte · T (años)" value={T} onChange={setT} min={0.1} max={5} step={0.1} format={(v) => `${v.toFixed(1)}y`} />
        <Slider label="Pasos · steps" value={steps} onChange={(v) => setSteps(Math.round(v))} min={20} max={200} step={1} format={(v) => `${v.toFixed(0)}`} />
        <Slider label="Trayectorias · nPaths" value={nPaths} onChange={(v) => setNPaths(Math.round(v))} min={10} max={300} step={1} format={(v) => `${v.toFixed(0)}`} />
        <Slider label="Semilla · seed" value={seed} onChange={(v) => setSeed(Math.round(v))} min={1} max={999} step={1} format={(v) => `${v.toFixed(0)}`} />
        <div className="rounded-lg border border-line bg-ink-2 px-3 py-2.5">
          <div className="eyebrow mb-1 text-[10px]">E[S_T] = S₀·e^{"{μT}"}</div>
          <div className="readout text-[26px] font-semibold text-brass">${(S0 * Math.exp(mu * T)).toFixed(2)}</div>
          <div className="readout mt-1 text-[11px] text-dim">drift risk-neutral si μ = r − q</div>
        </div>
      </>
    );

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8">
      <LabHeader
        eyebrow="monte carlo"
        hull="Hull 13 · 21"
        title={<>Simulación <span className="text-brass italic">estocástica</span></>}
        subtitle="Generá miles de trayectorias GBM, mirá el terminal converger a la log-normal teórica y observá cómo el error del estimador Monte Carlo cae como 1/√N hacia el precio Black-Scholes."
      />

      <LabLayout controls={controls}>
        <Panel
          title="Laboratorio Monte Carlo"
          right={<Segmented options={VIEWS} value={view} onChange={(v) => setView(v as View)} />}
        >
          {view === "paths" && (
            <>
              <LineChart
                series={pathsData.series}
                xLabel="t (años)"
                yLabel="S_t"
                height={400}
                xFormat={(v) => v.toFixed(2)}
                yFormat={(v) => (Math.abs(v) >= 1000 ? (v / 1000).toFixed(1) + "k" : v.toFixed(0))}
              />
              <div className="mt-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
                <Stat label="min S_T" value={`$${pathsData.minST.toFixed(2)}`} tone="loss" />
                <Stat label="P(S_T < S₀)" value={pct(pathsData.pBelow)} hint="cae bajo el inicio" />
                <Stat label="P(S_T > 1.5·S₀)" value={pct(pathsData.pAbove)} tone="gain" hint="sube +50%" />
                <Stat label="max S_T" value={`$${pathsData.maxST.toFixed(2)}`} tone="brass" />
              </div>
            </>
          )}

          {view === "dist" && (
            <>
              <LineChart
                series={distData.series}
                vLines={[
                  { v: S0, color: "#eef2f5", label: "S₀", dash: "2 2" },
                  { v: distData.meanAn, color: COLORS.loss, label: "E[S_T]", dash: "4 4" },
                ]}
                xLabel="S_T"
                yLabel="densidad"
                height={400}
                xFormat={(v) => v.toFixed(0)}
                yFormat={(v) => v.toFixed(4)}
              />
              <div className="mt-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
                <Stat label="E[S_T] analítico" value={`$${distData.meanAn.toFixed(3)}`} tone="brass" />
                <Stat label="E[S_T] simulado" value={`$${distData.meanSim.toFixed(3)}`} tone="cyan" hint="20.000 draws" />
                <Stat label="σ[S_T] analítico" value={`$${distData.stdAn.toFixed(3)}`} tone="brass" />
                <Stat label="σ[S_T] simulado" value={`$${distData.stdSim.toFixed(3)}`} tone="cyan" />
              </div>
            </>
          )}

          {view === "conv" && (
            <>
              <div className="eyebrow mb-2 text-[10px]">precio MC vs N — converge a Black-Scholes</div>
              <LineChart
                series={convData.priceSeries}
                hLines={[{ v: convData.bsRef, color: COLORS.brass, label: "BS", dash: "5 4" }]}
                xLabel="N (paths, escala log)"
                yLabel="precio"
                height={300}
                logX
                yFormat={(v) => v.toFixed(3)}
              />
              <div className="mt-6 eyebrow mb-2 text-[10px]">error estándar vs N — pendiente ∝ 1/√N</div>
              <LineChart
                series={convData.errSeries}
                xLabel="N (paths, escala log)"
                yLabel="std error"
                height={260}
                logX
                yFormat={(v) => v.toFixed(4)}
              />
              <div className="mt-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
                <Stat label="Precio MC" value={`$${convData.mcPrice.toFixed(4)}`} tone="gain" hint="N = 250k" />
                <Stat label="Black-Scholes" value={`$${convData.bsRef.toFixed(4)}`} tone="brass" />
                <Stat label="Diferencia" value={`${convData.diff >= 0 ? "+" : ""}${convData.diff.toFixed(4)}`} tone={Math.abs(convData.diff) < 0.01 ? "gain" : "loss"} />
                <Stat label="Std error" value={convData.mcStderr.toFixed(5)} tone="cyan" />
              </div>
            </>
          )}

          <p className="mt-4 text-[13px] leading-relaxed text-muted">{VIEW_NOTE[view]}</p>
        </Panel>

        <Panel title="El estimador">
          <div className="space-y-3 text-[14px] text-muted">
            <Formula display tex={"S_T = S_0 \\exp\\!\\left[(\\mu - \\tfrac{1}{2}\\sigma^2)T + \\sigma\\sqrt{T}\\,Z\\right], \\quad Z \\sim N(0,1)"} />
            <Formula display tex={"\\hat{C}_0 = e^{-rT}\\,\\frac{1}{N}\\sum_{i=1}^{N} \\max\\!\\left(S_T^{(i)} - K,\\ 0\\right)"} />
            <Formula display tex={"\\mathrm{SE}(\\hat{C}_0) = \\frac{s}{\\sqrt{N}} \\;\\propto\\; \\frac{1}{\\sqrt{N}}"} />
            <p className="text-[13px] text-dim">
              Bajo medida risk-neutral el drift es μ = r − q. El error estándar cae como 1/√N: hay que
              cuadruplicar N para halvar el error. Las variates antitéticas reducen la varianza
              promediando pares (+Z, −Z). Validado contra Hull, Cap. 13 y 21.
            </p>
          </div>
        </Panel>
      </LabLayout>
    </div>
  );
}
