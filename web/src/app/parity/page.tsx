"use client";

import { useMemo, useState } from "react";
import { LabHeader, LabLayout, Panel } from "@/components/LabLayout";
import { Slider } from "@/components/ui/Slider";
import { Stat } from "@/components/ui/Stat";
import { Formula } from "@/components/ui/Formula";
import {
  parityCheck, syntheticCall, syntheticPut, impliedRateFromParity,
  bsPriceBoth,
} from "@/lib/quant";

export default function ParityLab() {
  const [S, setS] = useState(100);
  const [K, setK] = useState(100);
  const [T, setT] = useState(0.5);
  const [r, setR] = useState(0.05);
  const [q, setQ] = useState(0);
  const [sigma, setSigma] = useState(0.25);
  const [C, setC] = useState(8.5);
  const [P, setP] = useState(6);

  const bs = useMemo(() => bsPriceBoth(S, K, T, r, sigma, q), [S, K, T, r, sigma, q]);
  const useBS = () => {
    setC(Number(bs.call.toFixed(4)));
    setP(Number(bs.put.toFixed(4)));
  };

  const pc = useMemo(() => parityCheck(C, P, S, K, T, r, q, 0.1), [C, P, S, K, T, r, q]);
  const synthC = useMemo(() => syntheticCall(P, S, K, T, r, q), [P, S, K, T, r, q]);
  const synthP = useMemo(() => syntheticPut(C, S, K, T, r, q), [C, S, K, T, r, q]);
  const rImp = useMemo(() => impliedRateFromParity(C, P, S, K, T, q), [C, P, S, K, T, q]);

  const pct = (v: number) => `${(v * 100).toFixed(1)}%`;
  const bond = K * Math.exp(-r * T);

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8">
      <LabHeader
        eyebrow="paridad & no-arbitraje"
        hull="Hull 10 · 11"
        title={<>Put-call parity, <span className="text-brass italic">verificada</span></>}
        subtitle="Cargá el precio de mercado del call y del put y mirá si se cumple la paridad. Cuando se rompe, hay arbitraje sobre la mesa: la tasa implícita en el par te dice cuánto."
      />

      <LabLayout
        controls={
          <>
            <div className="flex items-center justify-between">
              <span className="eyebrow">parámetros</span>
              <button
                type="button"
                onClick={useBS}
                className="btn-brass px-3 py-1.5 text-[12px]"
              >
                usar BS
              </button>
            </div>
            <Slider label="Spot · S" value={S} onChange={setS} min={1} max={2 * K} step={0.5} format={(v) => `$${v.toFixed(1)}`} />
            <Slider label="Strike · K" value={K} onChange={setK} min={1} max={200} step={1} format={(v) => `$${v.toFixed(0)}`} />
            <Slider label="Tiempo · T (años)" value={T} onChange={setT} min={0.02} max={3} step={0.02} format={(v) => `${v.toFixed(2)}y`} />
            <Slider label="Tasa · r" value={r} onChange={setR} min={0} max={0.3} step={0.005} format={pct} />
            <Slider label="Dividend yield · q" value={q} onChange={setQ} min={0} max={0.2} step={0.005} format={pct} />
            <Slider label="Volatilidad · σ (para BS)" value={sigma} onChange={setSigma} min={0.01} max={1.5} step={0.01} format={pct} accent="var(--color-cyan)" />

            <div className="h-px bg-line" />

            <Slider label="Call de mercado · C" value={C} onChange={setC} min={0} max={2 * K} step={0.01} format={(v) => `$${v.toFixed(2)}`} accent="var(--color-gain)" />
            <Slider label="Put de mercado · P" value={P} onChange={setP} min={0} max={2 * K} step={0.01} format={(v) => `$${v.toFixed(2)}`} accent="var(--color-loss)" />

            <div className="rounded-lg border border-line bg-ink-2 px-3 py-2.5">
              <div className="eyebrow mb-1 text-[10px]">teóricos black-scholes</div>
              <div className="readout text-[13px] text-muted">
                call <span className="text-gain">${bs.call.toFixed(4)}</span> · put <span className="text-loss">${bs.put.toFixed(4)}</span>
              </div>
              <div className="mt-1 text-[11px] text-dim">tocá «usar BS» para copiarlos a C y P</div>
            </div>
          </>
        }
      >
        <Panel title="Verificación de paridad">
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            <Stat label="C − P" value={`$${pc.lhs.toFixed(4)}`} tone="default" hint="lado opciones" />
            <Stat label="S·e^(−qT) − K·e^(−rT)" value={`$${pc.rhs.toFixed(4)}`} tone="default" hint="lado spot/bono" />
            <Stat label="Diferencia" value={`$${pc.difference.toFixed(4)}`} tone={pc.violated ? "loss" : "gain"} hint="tolerancia ±0.10" />
          </div>

          <div
            className="mt-4 rounded-lg border-l-2 px-4 py-3"
            style={{
              borderLeftColor: pc.violated ? "var(--color-loss)" : "var(--color-gain)",
              background: pc.violated ? "rgba(240,97,109,0.07)" : "rgba(63,207,142,0.07)",
            }}
          >
            <div className={`text-[12px] font-semibold ${pc.violated ? "text-loss" : "text-gain"}`}>
              {pc.violated ? "Paridad rota" : "Paridad OK"}
            </div>
            <p className="mt-0.5 text-[13px] leading-relaxed text-muted">
              {pc.violated ? `Posible arbitraje: ${pc.interpretation}` : pc.interpretation}
            </p>
          </div>
        </Panel>

        <Panel title="Réplicas sintéticas">
          <p className="mb-4 text-[13px] leading-relaxed text-muted">
            Cada pata se reconstruye desde la otra más spot y bono. Si los sintéticos no coinciden con el precio de mercado, la diferencia es el arbitraje.
          </p>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <Stat label="Call sintético (de P)" value={`$${synthC.toFixed(4)}`} tone="gain" />
            <Stat label="Call de mercado" value={`$${C.toFixed(4)}`} tone="default" hint={`Δ ${(C - synthC).toFixed(4)}`} />
            <Stat label="Put sintético (de C)" value={`$${synthP.toFixed(4)}`} tone="loss" />
            <Stat label="Put de mercado" value={`$${P.toFixed(4)}`} tone="default" hint={`Δ ${(P - synthP).toFixed(4)}`} />
          </div>
        </Panel>

        <Panel title="Tasa implícita en el par">
          {rImp === null ? (
            <div
              className="rounded-lg border-l-2 px-4 py-3"
              style={{ borderLeftColor: "var(--color-loss)", background: "rgba(240,97,109,0.07)" }}
            >
              <div className="text-[12px] font-semibold text-loss">No-arbitraje violado</div>
              <p className="mt-0.5 text-[13px] leading-relaxed text-muted">
                Con estos quotes el argumento del logaritmo es ≤ 0: no existe tasa real que cierre la paridad. Revisá C, P o S.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2.5">
                <Stat label="Tasa implícita" value={`${(rImp * 100).toFixed(2)}%`} tone="brass" />
                <Stat label="Tasa input · r" value={`${(r * 100).toFixed(2)}%`} tone="default" hint={`Δ ${((rImp - r) * 100).toFixed(2)} pp`} />
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-muted">
                En AR la tasa implícita en el par call/put suele diferir de la tasa oficial: el spread refleja costo de fondeo, dividendos esperados y fricciones del mercado.
              </p>
            </>
          )}
        </Panel>

        <Panel title="Los dos portfolios">
          <p className="mb-4 text-[13px] leading-relaxed text-muted">
            La prueba sin álgebra: dos carteras que cuestan distinto hoy pero pagan exactamente lo mismo en T. Por eso sus precios deben empatar.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="panel-2 p-4">
              <div className="eyebrow mb-2 text-[10px]">portfolio A · fiduciary call</div>
              <div className="readout text-[13px] text-muted">call + bono K·e^(−rT)</div>
              <div className="readout mt-1 text-[15px] font-semibold text-text">${(C + bond).toFixed(4)}</div>
              <div className="mt-3 space-y-1.5 border-t border-line pt-3 text-[12px]">
                <div className="flex items-center justify-between">
                  <span className="text-dim">payoff si S_T &gt; K</span>
                  <span className="readout text-text">S_T</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-dim">payoff si S_T &lt; K</span>
                  <span className="readout text-text">K</span>
                </div>
              </div>
            </div>

            <div className="panel-2 p-4">
              <div className="eyebrow mb-2 text-[10px]">portfolio C · protective put</div>
              <div className="readout text-[13px] text-muted">put + acción S·e^(−qT)</div>
              <div className="readout mt-1 text-[15px] font-semibold text-text">${(P + S * Math.exp(-q * T)).toFixed(4)}</div>
              <div className="mt-3 space-y-1.5 border-t border-line pt-3 text-[12px]">
                <div className="flex items-center justify-between">
                  <span className="text-dim">payoff si S_T &gt; K</span>
                  <span className="readout text-text">S_T</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-dim">payoff si S_T &lt; K</span>
                  <span className="readout text-text">K</span>
                </div>
              </div>
            </div>
          </div>
          <p className="mt-3 text-center text-[13px] text-dim">
            En ambos escenarios el payoff es <span className="readout text-brass">max(S_T, K)</span> — idénticos en T, luego idénticos hoy.
          </p>
        </Panel>

        <Panel title="La fórmula">
          <div className="space-y-3 text-[14px] text-muted">
            <Formula display tex={"c + K e^{-rT} = p + S_0 e^{-qT}"} />
            <Formula display tex={"r = -\\frac{1}{T}\\ln\\!\\frac{S e^{-qT} - (C - P)}{K}"} />
            <p className="text-[13px] text-dim">
              Paridad europea con dividend yield continuo q (Hull, Cap. 10-11). La tasa implícita despeja r del lado izquierdo del par.
            </p>
          </div>
        </Panel>
      </LabLayout>
    </div>
  );
}
