"use client";

import { useMemo, useState } from "react";
import { LabHeader, LabLayout, Panel } from "@/components/LabLayout";
import { Slider } from "@/components/ui/Slider";
import { Segmented } from "@/components/ui/Segmented";
import { Stat } from "@/components/ui/Stat";
import { Formula } from "@/components/ui/Formula";
import { LineChart, type Series } from "@/components/charts/LineChart";
import {
  crrPrice, leisenReimerPrice, binomialConvergence, crrTree, bsPrice,
  type OptionType, type Exercise,
} from "@/lib/quant";
import { COLORS, rampCss } from "@/lib/colors";

function CrrLattice({
  tree,
  n,
  american,
}: {
  tree: ReturnType<typeof crrTree>;
  n: number;
  american: boolean;
}) {
  const W = 760;
  const H = 460;
  const marginL = 54;
  const marginR = 54;
  const midY = H / 2;
  const dx = (W - marginL - marginR) / Math.max(1, n);
  const dy = Math.min(54, (H - 90) / Math.max(1, n));
  const showLabels = n <= 6;

  // normalización de V para colorear los nodos
  let vMin = Infinity;
  let vMax = -Infinity;
  for (const nd of tree.nodes) {
    if (nd.V < vMin) vMin = nd.V;
    if (nd.V > vMax) vMax = nd.V;
  }
  const span = vMax - vMin || 1;
  const norm = (v: number) => (v - vMin) / span;

  const pos = (i: number, j: number) => ({
    x: marginL + i * dx,
    y: midY + (j - i / 2) * dy,
  });

  const r = showLabels ? 18 : Math.max(7, 16 - n);

  const edges: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      const a = pos(i, j);
      const up = pos(i + 1, j);
      const down = pos(i + 1, j + 1);
      edges.push({ x1: a.x, y1: a.y, x2: up.x, y2: up.y });
      edges.push({ x1: a.x, y1: a.y, x2: down.x, y2: down.y });
    }
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>
      {/* columnas: etiqueta de paso temporal */}
      {Array.from({ length: n + 1 }, (_, i) => (
        <text
          key={`step${i}`}
          x={marginL + i * dx}
          y={H - 12}
          textAnchor="middle"
          className="readout"
          fontSize={9.5}
          fill={COLORS.dim}
        >
          i={i}
        </text>
      ))}

      {/* aristas */}
      {edges.map((e, idx) => (
        <line
          key={`e${idx}`}
          x1={e.x1}
          y1={e.y1}
          x2={e.x2}
          y2={e.y2}
          stroke="#36424f"
          strokeWidth={1}
          opacity={0.5}
        />
      ))}

      {/* nodos */}
      {tree.nodes.map((nd) => {
        const p = pos(nd.i, nd.j);
        return (
          <g key={`${nd.i}-${nd.j}`}>
            <circle
              cx={p.x}
              cy={p.y}
              r={r}
              fill={rampCss(norm(nd.V), 0.92)}
              stroke={nd.exercise ? COLORS.brass : "#232c37"}
              strokeWidth={nd.exercise ? 2 : 1}
            />
            {showLabels && (
              <>
                <text
                  x={p.x}
                  y={p.y - 2}
                  textAnchor="middle"
                  className="readout"
                  fontSize={9}
                  fill={COLORS.text}
                >
                  {nd.S.toFixed(1)}
                </text>
                <text
                  x={p.x}
                  y={p.y + 9}
                  textAnchor="middle"
                  className="readout"
                  fontSize={9}
                  fontWeight={600}
                  fill={COLORS.brass}
                >
                  {nd.V.toFixed(2)}
                </text>
              </>
            )}
          </g>
        );
      })}

      {/* leyenda */}
      <g transform={`translate(${marginL}, 18)`}>
        <rect x={0} y={-9} width={12} height={12} rx={3} fill={rampCss(0.85, 0.92)} />
        <text x={18} y={1} fontSize={10.5} fill={COLORS.muted}>
          color = valor de la opción
        </text>
        {american && (
          <>
            <circle cx={224} cy={-3} r={6} fill="none" stroke={COLORS.brass} strokeWidth={2} />
            <text x={236} y={1} fontSize={10.5} fill={COLORS.muted}>
              borde dorado = ejercicio temprano óptimo
            </text>
          </>
        )}
      </g>
    </svg>
  );
}

export default function BinomialLab() {
  const [S, setS] = useState(100);
  const [K, setK] = useState(100);
  const [T, setT] = useState(1);
  const [sigma, setSigma] = useState(0.25);
  const [r, setR] = useState(0.05);
  const [q, setQ] = useState(0);
  const [type, setType] = useState<OptionType>("call");
  const [exercise, setExercise] = useState<Exercise>("european");
  const [n, setN] = useState(4);

  const american = exercise === "american";

  const tree = useMemo(
    () => crrTree(S, K, T, r, sigma, q, n, type, exercise),
    [S, K, T, r, sigma, q, n, type, exercise],
  );

  const crrHi = useMemo(
    () => crrPrice(S, K, T, r, sigma, q, 500, type, exercise),
    [S, K, T, r, sigma, q, type, exercise],
  );
  const lr = useMemo(
    () => leisenReimerPrice(S, K, T, r, sigma, q, 51, type, exercise),
    [S, K, T, r, sigma, q, type, exercise],
  );
  const bs = useMemo(
    () => bsPrice(S, K, T, r, sigma, q, type),
    [S, K, T, r, sigma, q, type],
  );

  const conv = useMemo(
    () =>
      binomialConvergence(S, K, T, r, sigma, q, type, [
        2, 4, 6, 10, 15, 25, 50, 100, 200, 350, 500,
      ]),
    [S, K, T, r, sigma, q, type],
  );

  const convSeries = useMemo<Series[]>(
    () => [
      { x: conv.n, y: conv.crr, color: COLORS.cyan, label: "CRR" },
      { x: conv.n, y: conv.lr, color: COLORS.brass, label: "Leisen-Reimer" },
    ],
    [conv],
  );

  const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8">
      <LabHeader
        eyebrow="árbol binomial"
        hull="Hull 13"
        title={<>El árbol que <span className="text-brass italic">converge</span></>}
        subtitle="Construí la lattice CRR paso a paso, coloreá cada nodo por el valor de la opción y mirá cómo Cox-Ross-Rubinstein oscila mientras Leisen-Reimer converge rápido hacia Black-Scholes."
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

            <div className="flex items-center justify-between">
              <span className="text-[12px] font-medium text-muted">Ejercicio</span>
              <Segmented
                size="sm"
                options={[{ value: "european", label: "Europeo" }, { value: "american", label: "Americano" }]}
                value={exercise}
                onChange={(v) => setExercise(v as Exercise)}
              />
            </div>
            <Slider label="Pasos del árbol · n" value={n} onChange={(v) => setN(Math.round(v))} min={1} max={8} step={1} format={(v) => `${v.toFixed(0)}`} />

            <div className="rounded-lg border border-line bg-ink-2 px-3 py-2.5">
              <div className="eyebrow mb-1 text-[10px]">precio del árbol · n={n}</div>
              <div className="readout text-[26px] font-semibold text-brass">${tree.price.toFixed(4)}</div>
              <div className="readout mt-1 text-[11px] text-dim">
                u {tree.u.toFixed(4)} · d {tree.d.toFixed(4)} · p {tree.p.toFixed(4)}
              </div>
            </div>
          </>
        }
      >
        <Panel title="Precios">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <Stat label={`Árbol · n=${n}`} value={`$${tree.price.toFixed(4)}`} tone="brass" hint="lattice visible" />
            <Stat label="CRR · n=500" value={`$${crrHi.toFixed(4)}`} tone="cyan" hint="referencia fina" />
            <Stat label="Leisen-Reimer · n=51" value={`$${lr.toFixed(4)}`} hint="convergencia rápida" />
            <Stat
              label="Black-Scholes"
              value={american ? "—" : `$${bs.toFixed(4)}`}
              tone={american ? "default" : "gain"}
              hint={american ? "sin forma cerrada" : "europeo cerrado"}
            />
          </div>
          <div className="readout mt-3 text-[12px] text-dim">
            Parámetros del árbol visible · Δt = {(T / n).toFixed(4)} · u = {tree.u.toFixed(4)} · d = {tree.d.toFixed(4)} · p = {tree.p.toFixed(4)}
          </div>
        </Panel>

        <Panel title="La lattice CRR">
          <div className="blueprint rounded-xl border border-line p-2">
            <CrrLattice tree={tree} n={n} american={american} />
          </div>
          <p className="mt-3 text-[13px] leading-relaxed text-muted">
            Cada nodo (i, j) muestra el precio del subyacente arriba y el valor de la opción abajo. El color codifica
            el valor —de azul (bajo) a coral (alto)—. En modo americano, el borde dorado marca los nodos donde conviene
            ejercer antes del vencimiento. Subí o bajá los pasos n para ver el árbol crecer.
          </p>
        </Panel>

        <Panel title="Convergencia">
          <LineChart
            series={convSeries}
            hLines={american ? [] : [{ v: bs, color: COLORS.gain, dash: "5 4", label: "BS" }]}
            xLabel="pasos n"
            yLabel="precio"
            height={360}
            yFormat={(v) => v.toFixed(3)}
            xFormat={(v) => v.toFixed(0)}
          />
          <p className="mt-3 text-[13px] leading-relaxed text-muted">
            {american ? (
              <>
                Para opciones americanas no existe fórmula cerrada de Black-Scholes, así que comparamos directamente
                CRR contra Leisen-Reimer. CRR <span className="text-cyan">oscila</span> en forma de sierra a medida que n
                crece, mientras que Leisen-Reimer (<span className="text-brass">bronce</span>) converge de manera mucho
                más suave y monótona.
              </>
            ) : (
              <>
                CRR (<span className="text-cyan">cian</span>) <span className="text-cyan">oscila</span> alrededor del
                precio Black-Scholes (línea <span className="text-gain">verde</span>) con error que decae lento ~O(1/n).
                Leisen-Reimer (<span className="text-brass">bronce</span>) converge rápido y casi monótono, alcanzando el
                valor cerrado con pocos pasos.
              </>
            )}
          </p>
        </Panel>

        <Panel title="Los parámetros del árbol">
          <div className="space-y-3 text-[14px] text-muted">
            <Formula display tex={"u = e^{\\sigma\\sqrt{\\Delta t}}, \\quad d = \\frac{1}{u}, \\quad \\Delta t = \\frac{T}{n}"} />
            <Formula display tex={"p = \\frac{e^{(r-q)\\Delta t} - d}{u - d}"} />
            <Formula display tex={"V_{i,j} = e^{-r\\Delta t}\\,\\big[\\,p\\,V_{i+1,j} + (1-p)\\,V_{i+1,j+1}\\,\\big]"} />
            <p className="text-[13px] leading-relaxed text-dim">
              La valuación es risk-neutral: bajo la probabilidad p el subyacente crece a la tasa libre de riesgo, así que
              el precio justo es el valor esperado del payoff descontado. En cada nodo americano se compara el valor de
              continuación con el intrínseco y se ejerce si conviene. Los puts americanos pueden convenir ejercerse
              temprano (recuperar el strike y reinvertir); los calls americanos sin dividendos nunca se ejercen antes del
              vencimiento.
            </p>
          </div>
        </Panel>
      </LabLayout>
    </div>
  );
}
