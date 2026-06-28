"use client";

import { useEffect, useMemo, useState } from "react";
import { LabHeader, Panel } from "@/components/LabLayout";
import { Segmented } from "@/components/ui/Segmented";
import { Stat } from "@/components/ui/Stat";
import { LineChart, type Series } from "@/components/charts/LineChart";
import { COLORS } from "@/lib/colors";
import {
  apiConfigured, getQuotes, getExpiries, getChain,
  type Quote, type Chain,
} from "@/lib/api";

const STRIP = ["SPY", "QQQ", "IWM", "^VIX", "^TNX", "GLD"];
const TICKERS = ["SPY", "QQQ", "AAPL", "MSFT", "NVDA", "TSLA", "AMZN", "META", "AMD", "GLD"];

export default function MercadoLab() {
  const [quotes, setQuotes] = useState<Record<string, Quote | null>>({});
  const [symbol, setSymbol] = useState("AAPL");
  const [expiries, setExpiries] = useState<string[]>([]);
  const [expiry, setExpiry] = useState<string>("");
  const [chain, setChain] = useState<Chain | null>(null);
  const [loading, setLoading] = useState(false);
  const [side, setSide] = useState<"call" | "put">("call");

  useEffect(() => {
    if (!apiConfigured) return;
    getQuotes(STRIP).then((r) => r && setQuotes(r.quotes));
  }, []);

  useEffect(() => {
    if (!apiConfigured) return;
    setExpiries([]);
    setExpiry("");
    setChain(null);
    getExpiries(symbol).then((r) => {
      if (r && r.expiries.length) {
        setExpiries(r.expiries.slice(0, 8));
        setExpiry(r.expiries[0]);
      }
    });
  }, [symbol]);

  useEffect(() => {
    if (!apiConfigured || !expiry) return;
    setLoading(true);
    getChain(symbol, expiry).then((r) => {
      setChain(r && !r.error ? r : null);
      setLoading(false);
    });
  }, [symbol, expiry]);

  const smile = useMemo<Series[]>(() => {
    if (!chain) return [];
    const rows = (side === "call" ? chain.calls : chain.puts).filter(
      (r) => r.modelIV && r.modelIV > 0.01 && r.modelIV < 3,
    );
    return [
      {
        x: rows.map((r) => r.strike),
        y: rows.map((r) => (r.modelIV ?? 0) * 100),
        color: side === "call" ? COLORS.gain : COLORS.loss,
        label: `IV ${side} (modelo)`,
        width: 2.5,
      },
    ];
  }, [chain, side]);

  if (!apiConfigured) {
    return (
      <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8">
        <LabHeader
          eyebrow="mercado · datos en vivo"
          hull="yfinance · backend"
          title={<>Chains reales, <span className="text-brass italic">IV recomputada</span></>}
          subtitle="Esta sección consume el backend FastAPI en Railway: quotes en vivo, option chains y volatilidad implícita recalculada por el motor."
        />
        <Panel title="Backend no configurado">
          <p className="text-[14px] leading-relaxed text-muted">
            Seteá la variable de entorno{" "}
            <span className="readout rounded bg-ink-2 px-1.5 py-0.5 text-brass">NEXT_PUBLIC_API_URL</span>{" "}
            en Vercel apuntando a la URL pública de Railway (ej.{" "}
            <span className="readout text-dim">https://option-lab-api.up.railway.app</span>) y redeployá.
            El resto de los laboratorios funciona sin backend.
          </p>
        </Panel>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8">
      <LabHeader
        eyebrow="mercado · datos en vivo"
        hull="yfinance · backend"
        title={<>Chains reales, <span className="text-brass italic">IV recomputada</span></>}
        subtitle="Quotes en vivo, option chains de Yahoo y volatilidad implícita recalculada por nuestro motor (Brent). Servido por el backend FastAPI en Railway."
      />

      {/* Ticker strip */}
      <div className="mb-6 flex flex-wrap gap-2">
        {STRIP.map((s) => {
          const q = quotes[s];
          return (
            <div key={s} className="panel-2 flex items-baseline gap-2 px-3 py-2">
              <span className="eyebrow text-[10px]">{s}</span>
              {q ? (
                <>
                  <span className="readout text-[14px] font-semibold text-text">
                    {q.price.toFixed(2)}
                  </span>
                  <span className={`readout text-[11px] ${q.change >= 0 ? "text-gain" : "text-loss"}`}>
                    {q.change >= 0 ? "▲" : "▼"} {q.change_pct.toFixed(2)}%
                  </span>
                </>
              ) : (
                <span className="readout text-[12px] text-dim">—</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <aside className="h-fit lg:sticky lg:top-20">
          <div className="panel space-y-4 p-5">
            <div>
              <div className="eyebrow mb-2">Subyacente</div>
              <div className="flex flex-wrap gap-1.5">
                {TICKERS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSymbol(t)}
                    className={`readout rounded-md border px-2.5 py-1 text-[12px] transition-colors ${
                      symbol === t ? "border-brass bg-ink-2 text-brass" : "border-line text-muted hover:text-text"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            {expiries.length > 0 && (
              <div>
                <div className="eyebrow mb-2">Vencimiento</div>
                <select
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="readout w-full rounded-md border border-line bg-ink-2 px-2.5 py-2 text-[13px] text-text outline-none"
                >
                  {expiries.map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>
            )}
            {chain && (
              <div className="grid grid-cols-2 gap-2">
                <Stat label="Spot" value={`$${chain.spot.toFixed(2)}`} tone="brass" />
                <Stat label="r (10y)" value={`${(chain.r * 100).toFixed(2)}%`} tone="cyan" />
                <Stat label="T" value={`${chain.T.toFixed(2)}y`} />
                <Stat label="Strikes" value={`${chain.calls.length}`} />
              </div>
            )}
          </div>
        </aside>

        <div className="min-w-0 space-y-6">
          <Panel
            title="Smile de volatilidad implícita"
            right={
              <Segmented
                size="sm"
                options={[{ value: "call", label: "Calls" }, { value: "put", label: "Puts" }]}
                value={side}
                onChange={(v) => setSide(v as "call" | "put")}
              />
            }
          >
            {loading ? (
              <div className="flex h-[340px] items-center justify-center">
                <span className="readout text-[12px] uppercase tracking-[0.2em] text-dim">cargando chain…</span>
              </div>
            ) : smile.length && smile[0].x.length ? (
              <LineChart
                series={smile}
                vLines={chain ? [{ v: chain.spot, color: COLORS.muted, label: "spot" }] : []}
                xLabel="Strike"
                yLabel="IV (%)"
                height={360}
                yFormat={(v) => `${v.toFixed(0)}%`}
                xFormat={(v) => v.toFixed(0)}
              />
            ) : (
              <div className="flex h-[340px] items-center justify-center">
                <span className="readout text-[12px] text-dim">
                  sin datos de IV para este vencimiento (mercado cerrado o quotes ruidosos)
                </span>
              </div>
            )}
            <p className="mt-3 text-[13px] leading-relaxed text-muted">
              El <span className="text-text">smile/skew</span> muestra cómo la IV varía con el strike.
              Acá se recalcula desde el mid de cada quote con Brent — no es la IV que reporta Yahoo.
            </p>
          </Panel>

          {chain && (
            <Panel title={`Cadena · ${side === "call" ? "Calls" : "Puts"}`}>
              <div className="max-h-[420px] overflow-auto">
                <table className="w-full text-[12.5px]">
                  <thead className="sticky top-0 bg-ink-1">
                    <tr className="eyebrow text-left text-[10px] text-dim">
                      <th className="py-2 pr-3">Strike</th>
                      <th className="py-2 pr-3">Bid</th>
                      <th className="py-2 pr-3">Ask</th>
                      <th className="py-2 pr-3">Last</th>
                      <th className="py-2 pr-3">IV modelo</th>
                      <th className="py-2 pr-3">OI</th>
                    </tr>
                  </thead>
                  <tbody className="readout">
                    {(side === "call" ? chain.calls : chain.puts).map((r) => {
                      const itm = side === "call" ? r.strike < chain.spot : r.strike > chain.spot;
                      return (
                        <tr key={r.strike} className="border-t border-line/60">
                          <td className={`py-1.5 pr-3 font-semibold ${itm ? "text-brass" : "text-text"}`}>
                            {r.strike.toFixed(1)}
                          </td>
                          <td className="py-1.5 pr-3 text-muted">{r.bid.toFixed(2)}</td>
                          <td className="py-1.5 pr-3 text-muted">{r.ask.toFixed(2)}</td>
                          <td className="py-1.5 pr-3 text-muted">{r.last.toFixed(2)}</td>
                          <td className="py-1.5 pr-3 text-cyan">
                            {r.modelIV ? `${(r.modelIV * 100).toFixed(1)}%` : "—"}
                          </td>
                          <td className="py-1.5 pr-3 text-dim">{r.openInterest}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}
