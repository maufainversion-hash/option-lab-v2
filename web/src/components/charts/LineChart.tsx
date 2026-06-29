"use client";

import { useRef, useState, useMemo } from "react";

export interface Series {
  x: number[];
  y: number[];
  color: string;
  width?: number;
  dash?: string;
  label?: string;
  fillToZero?: boolean;
  fillColor?: string;
  fillOpacity?: number;
  fillOnly?: boolean; // renderiza solo el área (sin la línea ni leyenda ni hover)
}

interface RefLine {
  v: number;
  color?: string;
  label?: string;
  dash?: string;
}

interface LineChartProps {
  series: Series[];
  vLines?: RefLine[];
  hLines?: RefLine[];
  xLabel?: string;
  yLabel?: string;
  height?: number;
  logX?: boolean;
  yFormat?: (v: number) => string;
  xFormat?: (v: number) => string;
  domainX?: [number, number];
  domainY?: [number, number];
}

const W = 720;
const M = { t: 16, r: 18, b: 38, l: 52 };

export function LineChart({
  series,
  vLines = [],
  hLines = [],
  xLabel,
  yLabel,
  height = 360,
  logX = false,
  yFormat = (v) => v.toFixed(2),
  xFormat = (v) => (Math.abs(v) >= 1000 ? (v / 1000).toFixed(0) + "k" : v.toFixed(0)),
  domainX,
  domainY,
}: LineChartProps) {
  const H = height;
  const svgRef = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<{ px: number; xVal: number } | null>(null);

  const tx = (v: number) => (logX ? Math.log10(Math.max(v, 1e-9)) : v);

  const { xMin, xMax, yMin, yMax } = useMemo(() => {
    let xmin = Infinity, xmax = -Infinity, ymin = Infinity, ymax = -Infinity;
    for (const s of series) {
      for (let i = 0; i < s.x.length; i++) {
        const xv = tx(s.x[i]);
        const yv = s.y[i];
        if (Number.isFinite(xv)) { if (xv < xmin) xmin = xv; if (xv > xmax) xmax = xv; }
        if (Number.isFinite(yv)) { if (yv < ymin) ymin = yv; if (yv > ymax) ymax = yv; }
      }
    }
    for (const h of hLines) { if (h.v < ymin) ymin = h.v; if (h.v > ymax) ymax = h.v; }
    if (domainX) { xmin = tx(domainX[0]); xmax = tx(domainX[1]); }
    if (domainY) { ymin = domainY[0]; ymax = domainY[1]; }
    const pad = (ymax - ymin) * 0.08 || 1;
    return { xMin: xmin, xMax: xmax, yMin: ymin - pad, yMax: ymax + pad };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [series, hLines, domainX, domainY, logX]);

  const sx = (v: number) => M.l + ((tx(v) - xMin) / (xMax - xMin || 1)) * (W - M.l - M.r);
  const sy = (v: number) => M.t + (1 - (v - yMin) / (yMax - yMin || 1)) * (H - M.t - M.b);

  const path = (s: Series) => {
    let d = "";
    for (let i = 0; i < s.x.length; i++) {
      if (!Number.isFinite(s.y[i])) continue;
      d += `${d ? "L" : "M"}${sx(s.x[i]).toFixed(2)} ${sy(s.y[i]).toFixed(2)}`;
    }
    return d;
  };
  const area = (s: Series) => {
    const y0 = sy(Math.max(yMin, Math.min(yMax, 0)));
    let d = "";
    for (let i = 0; i < s.x.length; i++) {
      if (!Number.isFinite(s.y[i])) continue;
      d += `${d ? "L" : "M"}${sx(s.x[i]).toFixed(2)} ${sy(s.y[i]).toFixed(2)}`;
    }
    if (!d) return "";
    const lastX = sx(s.x[s.x.length - 1]);
    const firstX = sx(s.x[0]);
    return `${d}L${lastX.toFixed(2)} ${y0.toFixed(2)}L${firstX.toFixed(2)} ${y0.toFixed(2)}Z`;
  };

  const yTicks = niceTicks(yMin, yMax, 5);
  const xTicks = niceTicks(xMin, xMax, 6);

  const onMove = (e: React.MouseEvent) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = ((e.clientX - rect.left) / rect.width) * W;
    if (px < M.l || px > W - M.r) { setHover(null); return; }
    const xVal = xMin + ((px - M.l) / (W - M.l - M.r)) * (xMax - xMin);
    setHover({ px, xVal });
  };

  const hoverPoints = hover
    ? series.filter((s) => !s.fillOnly).map((s) => {
        let best = 0;
        let bestD = Infinity;
        for (let i = 0; i < s.x.length; i++) {
          const d = Math.abs(tx(s.x[i]) - hover.xVal);
          if (d < bestD) { bestD = d; best = i; }
        }
        return { s, i: best };
      })
    : [];

  return (
    <div className="w-full">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ height }}
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
      >
        {/* grid */}
        {yTicks.map((t, i) => (
          <g key={`yt${i}`}>
            <line x1={M.l} x2={W - M.r} y1={sy(t)} y2={sy(t)} stroke="#232c37" strokeWidth={1} opacity={0.6} />
            <text x={M.l - 8} y={sy(t)} dy="0.32em" textAnchor="end" className="readout" fontSize={10} fill="#5d6875">
              {yFormat(t)}
            </text>
          </g>
        ))}
        {xTicks.map((t, i) => (
          <text key={`xt${i}`} x={sx(logX ? Math.pow(10, t) : t)} y={H - M.b + 16} textAnchor="middle" className="readout" fontSize={10} fill="#5d6875">
            {xFormat(logX ? Math.pow(10, t) : t)}
          </text>
        ))}

        {/* ref lines */}
        {hLines.map((h, i) => (
          <g key={`h${i}`}>
            <line x1={M.l} x2={W - M.r} y1={sy(h.v)} y2={sy(h.v)} stroke={h.color ?? "#5d6875"} strokeWidth={1} strokeDasharray={h.dash ?? "4 4"} />
            {h.label && (
              <text x={W - M.r - 4} y={sy(h.v) - 4} textAnchor="end" className="readout" fontSize={10} fill={h.color ?? "#97a3b2"}>
                {h.label}
              </text>
            )}
          </g>
        ))}
        {vLines.map((v, i) => (
          <g key={`v${i}`}>
            <line x1={sx(v.v)} x2={sx(v.v)} y1={M.t} y2={H - M.b} stroke={v.color ?? "#97a3b2"} strokeWidth={1} strokeDasharray={v.dash ?? "3 3"} opacity={0.8} />
            {v.label && (
              <text x={sx(v.v)} y={M.t + 2} dy="0.7em" textAnchor="middle" className="readout" fontSize={9.5} fill={v.color ?? "#97a3b2"}>
                {v.label}
              </text>
            )}
          </g>
        ))}

        {/* areas + lines */}
        {series.map((s, i) =>
          s.fillToZero ? (
            <path key={`a${i}`} d={area(s)} fill={s.fillColor ?? s.color} opacity={s.fillOpacity ?? 0.12} />
          ) : null,
        )}
        {series.map((s, i) =>
          s.fillOnly ? null : (
            <path key={`l${i}`} d={path(s)} fill="none" stroke={s.color} strokeWidth={s.width ?? 2.25} strokeDasharray={s.dash} strokeLinejoin="round" strokeLinecap="round" />
          ),
        )}

        {/* crosshair */}
        {hover && (
          <line x1={hover.px} x2={hover.px} y1={M.t} y2={H - M.b} stroke="#eef2f5" strokeWidth={1} opacity={0.25} />
        )}
        {hoverPoints.map((hp, i) => (
          <circle key={`hp${i}`} cx={sx(hp.s.x[hp.i])} cy={sy(hp.s.y[hp.i])} r={3.5} fill={hp.s.color} stroke="#07090c" strokeWidth={1.5} />
        ))}

        {/* axis labels */}
        {xLabel && (
          <text x={(M.l + W - M.r) / 2} y={H - 4} textAnchor="middle" fontSize={11} fill="#97a3b2">
            {xLabel}
          </text>
        )}
        {yLabel && (
          <text transform={`translate(13 ${(M.t + H - M.b) / 2}) rotate(-90)`} textAnchor="middle" fontSize={11} fill="#97a3b2">
            {yLabel}
          </text>
        )}
      </svg>

      {/* legend + hover readout */}
      <div className="mt-1 flex flex-wrap items-center justify-between gap-2 px-2">
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {series.filter((s) => s.label && !s.fillOnly).map((s, i) => (
            <span key={i} className="flex items-center gap-1.5 text-[11px] text-muted">
              <span className="inline-block h-[3px] w-4 rounded" style={{ background: s.color }} />
              {s.label}
            </span>
          ))}
        </div>
        {hover && (
          <div className="readout flex gap-3 text-[11px] text-dim">
            <span>x={xFormat(hover.xVal)}</span>
            {hoverPoints.filter((hp) => hp.s.label).map((hp, i) => (
              <span key={i} style={{ color: hp.s.color }}>
                {yFormat(hp.s.y[hp.i])}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function niceTicks(min: number, max: number, count: number): number[] {
  if (!Number.isFinite(min) || !Number.isFinite(max) || min === max) return [min];
  const range = max - min;
  const step0 = range / count;
  const mag = Math.pow(10, Math.floor(Math.log10(step0)));
  const norm = step0 / mag;
  const step = (norm >= 5 ? 5 : norm >= 2 ? 2 : 1) * mag;
  const start = Math.ceil(min / step) * step;
  const out: number[] = [];
  for (let v = start; v <= max + step * 0.5; v += step) out.push(Number(v.toFixed(8)));
  return out;
}
