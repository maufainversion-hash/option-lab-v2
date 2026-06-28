// Estrategias multi-leg y payoff/P&L. Hull Cap 11-12.
import { bsPrice } from "./blackScholes";
import type { LegType } from "./types";

export interface Leg {
  optionType: LegType; // "call" | "put" | "stock"
  quantity: number; // +long / −short
  strike: number; // ignorado si stock
  expiry: number; // años — ignorado si stock
  premium: number; // pagado (long) o recibido (short)
}

export interface Strategy {
  name: string;
  legs: Leg[];
  description: string;
}

export function netPremium(s: Strategy): number {
  return s.legs.reduce((acc, l) => acc + l.quantity * l.premium, 0);
}

function legIntrinsic(leg: Leg, ST: number): number {
  if (leg.optionType === "stock") return leg.quantity * ST;
  if (leg.optionType === "call") return leg.quantity * Math.max(ST - leg.strike, 0);
  return leg.quantity * Math.max(leg.strike - ST, 0);
}

/** Payoff (neto de premiums) al vencimiento para cada spot. */
export function payoffAtExpiry(s: Strategy, sRange: number[]): number[] {
  return sRange.map((ST) =>
    s.legs.reduce((acc, leg) => acc + legIntrinsic(leg, ST) - leg.quantity * leg.premium, 0),
  );
}

/** P&L de mercado en tiempo t (años desde apertura) vía BS para las patas con valor temporal. */
export function pnlAtTime(
  s: Strategy, sRange: number[], t: number, r: number, sigma: number, q = 0,
): number[] {
  return sRange.map((S) =>
    s.legs.reduce((acc, leg) => {
      let value: number;
      if (leg.optionType === "stock") {
        value = leg.quantity * S;
      } else {
        const tau = leg.expiry - t;
        value =
          tau <= 0
            ? legIntrinsic(leg, S)
            : leg.quantity * bsPrice(S, leg.strike, tau, r, sigma, q, leg.optionType);
      }
      return acc + value - leg.quantity * leg.premium;
    }, 0),
  );
}

export function breakevenPoints(s: Strategy, sRange: number[]): number[] {
  const payoff = payoffAtExpiry(s, sRange);
  const crossings: number[] = [];
  for (let i = 0; i < sRange.length - 1; i++) {
    if (payoff[i] * payoff[i + 1] < 0) {
      const s0 = sRange[i];
      const s1 = sRange[i + 1];
      const p0 = payoff[i];
      const p1 = payoff[i + 1];
      crossings.push(s0 - (p0 * (s1 - s0)) / (p1 - p0));
    }
  }
  return crossings;
}

export function maxProfitLoss(s: Strategy, sRange: number[]): { maxProfit: number; maxLoss: number } {
  const payoff = payoffAtExpiry(s, sRange);
  return { maxProfit: Math.max(...payoff), maxLoss: Math.min(...payoff) };
}

// ── Desglose del payoff por rango (estilo machete de Hull) ─────────────────
function fmtNum(n: number): string {
  const r = Math.round(n * 100) / 100;
  return Number.isInteger(r) ? String(r) : r.toFixed(2);
}

/** Encabezado descriptivo de una pata: "Long put 105", "Short call 110", "2× short call 100", "Acción". */
export function legHeader(leg: Leg): string {
  if (leg.optionType === "stock") return leg.quantity === 1 ? "Acción" : `${fmtNum(leg.quantity)}× acción`;
  const dir = leg.quantity > 0 ? "Long" : "Short";
  const mag = Math.abs(leg.quantity) === 1 ? "" : `${Math.abs(leg.quantity)}× `;
  return `${mag}${dir} ${leg.optionType} ${fmtNum(leg.strike)}`;
}

/** Expresión del payoff BRUTO de una pata en el rango que contiene a repS (con "S" = S_T). */
function legCell(leg: Leg, repS: number): string {
  const q = leg.quantity;
  if (leg.optionType === "stock") return q === 1 ? "S" : `${fmtNum(q)}·S`;
  const K = fmtNum(leg.strike);
  const itm = leg.optionType === "call" ? repS > leg.strike : repS < leg.strike;
  if (!itm) return "0";
  const base = leg.optionType === "call" ? `S − ${K}` : `${K} − S`;
  if (q === 1) return base;
  if (q === -1) return `−(${base})`;
  if (q > 1) return `${q}(${base})`;
  return `−${Math.abs(q)}(${base})`;
}

/** Pendiente e intercepto del payoff bruto de una pata en el rango. */
function legSlope(leg: Leg, repS: number): [number, number] {
  const q = leg.quantity;
  if (leg.optionType === "stock") return [q, 0];
  if (leg.optionType === "call") return repS > leg.strike ? [q, -q * leg.strike] : [0, 0];
  return repS < leg.strike ? [-q, q * leg.strike] : [0, 0];
}

function linExpr(m: number, b: number): string {
  const mm = Math.round(m * 100) / 100;
  const bb = Math.round(b * 100) / 100;
  if (mm === 0) return fmtNum(bb);
  if (mm === 1) return bb === 0 ? "S" : bb > 0 ? `S + ${fmtNum(bb)}` : `S − ${fmtNum(-bb)}`;
  if (mm === -1) return bb === 0 ? "−S" : bb > 0 ? `${fmtNum(bb)} − S` : `−S − ${fmtNum(-bb)}`;
  let s = `${fmtNum(mm)}·S`;
  if (Math.abs(bb) > 1e-9) s += bb > 0 ? ` + ${fmtNum(bb)}` : ` − ${fmtNum(-bb)}`;
  return s;
}

export interface RangeBreakdown {
  headers: string[]; // una por pata
  rows: { range: string; cells: string[]; total: string }[];
}

/**
 * Desglosa el payoff BRUTO al vencimiento por tramos de S_T (los strikes parten la recta).
 * Para cada rango, da la expresión de cada pata y el total simplificado. Estilo Hull.
 */
export function rangeBreakdown(s: Strategy): RangeBreakdown {
  const headers = s.legs.map(legHeader);
  const strikes = [...new Set(s.legs.filter((l) => l.optionType !== "stock").map((l) => l.strike))].sort(
    (a, b) => a - b,
  );

  const reps: { range: string; repS: number }[] = [];
  if (strikes.length === 0) {
    reps.push({ range: "todo S", repS: 1 });
  } else {
    reps.push({ range: `S ≤ ${fmtNum(strikes[0])}`, repS: strikes[0] - 1 });
    for (let i = 0; i < strikes.length - 1; i++) {
      reps.push({
        range: `${fmtNum(strikes[i])} ≤ S ≤ ${fmtNum(strikes[i + 1])}`,
        repS: (strikes[i] + strikes[i + 1]) / 2,
      });
    }
    reps.push({ range: `S ≥ ${fmtNum(strikes[strikes.length - 1])}`, repS: strikes[strikes.length - 1] + 1 });
  }

  const rows = reps.map(({ range, repS }) => {
    const cells = s.legs.map((leg) => legCell(leg, repS));
    let m = 0;
    let b = 0;
    for (const leg of s.legs) {
      const [lm, lb] = legSlope(leg, repS);
      m += lm;
      b += lb;
    }
    return { range, cells, total: linExpr(m, b) };
  });

  return { headers, rows };
}

// ── Constructores clásicos ────────────────────────────────────────────────
export function longCall(K: number, T: number, premium: number, qty = 1): Strategy {
  return {
    name: `Long Call K=${K.toFixed(0)}`,
    legs: [{ optionType: "call", quantity: qty, strike: K, expiry: T, premium }],
    description: "Direccional alcista. Pérdida limitada al premium, ganancia ilimitada.",
  };
}
export function longPut(K: number, T: number, premium: number, qty = 1): Strategy {
  return {
    name: `Long Put K=${K.toFixed(0)}`,
    legs: [{ optionType: "put", quantity: qty, strike: K, expiry: T, premium }],
    description: "Direccional bajista o seguro. Pérdida limitada al premium.",
  };
}
export function coveredCall(S: number, K: number, T: number, callPrem: number): Strategy {
  return {
    name: `Covered Call K=${K.toFixed(0)}`,
    legs: [
      { optionType: "stock", quantity: 1, strike: 0, expiry: 0, premium: S },
      { optionType: "call", quantity: -1, strike: K, expiry: T, premium: callPrem },
    ],
    description: "Acción + venta de call. Income. Techo en K + premium recibido.",
  };
}
export function protectivePut(S: number, K: number, T: number, putPrem: number): Strategy {
  return {
    name: `Protective Put K=${K.toFixed(0)}`,
    legs: [
      { optionType: "stock", quantity: 1, strike: 0, expiry: 0, premium: S },
      { optionType: "put", quantity: 1, strike: K, expiry: T, premium: putPrem },
    ],
    description: "Seguro sobre la acción. Piso en K − premium pagado.",
  };
}
export function bullCallSpread(Klow: number, Khigh: number, T: number, pLow: number, pHigh: number): Strategy {
  return {
    name: `Bull Call Spread ${Klow.toFixed(0)}/${Khigh.toFixed(0)}`,
    legs: [
      { optionType: "call", quantity: 1, strike: Klow, expiry: T, premium: pLow },
      { optionType: "call", quantity: -1, strike: Khigh, expiry: T, premium: pHigh },
    ],
    description: "Alcista con costo y riesgo capados. Máx profit = (Khigh − Klow) − costo neto.",
  };
}
export function bearPutSpread(Klow: number, Khigh: number, T: number, pLow: number, pHigh: number): Strategy {
  return {
    name: `Bear Put Spread ${Khigh.toFixed(0)}/${Klow.toFixed(0)}`,
    legs: [
      { optionType: "put", quantity: 1, strike: Khigh, expiry: T, premium: pHigh },
      { optionType: "put", quantity: -1, strike: Klow, expiry: T, premium: pLow },
    ],
    description: "Bajista con costo y riesgo capados.",
  };
}
export function longStraddle(K: number, T: number, callPrem: number, putPrem: number): Strategy {
  return {
    name: `Long Straddle K=${K.toFixed(0)}`,
    legs: [
      { optionType: "call", quantity: 1, strike: K, expiry: T, premium: callPrem },
      { optionType: "put", quantity: 1, strike: K, expiry: T, premium: putPrem },
    ],
    description: "Apuesta a movimiento grande en cualquier dirección. Costo = ambos premiums.",
  };
}
export function longStrangle(Kput: number, Kcall: number, T: number, putPrem: number, callPrem: number): Strategy {
  return {
    name: `Long Strangle ${Kput.toFixed(0)}/${Kcall.toFixed(0)}`,
    legs: [
      { optionType: "put", quantity: 1, strike: Kput, expiry: T, premium: putPrem },
      { optionType: "call", quantity: 1, strike: Kcall, expiry: T, premium: callPrem },
    ],
    description: "Versión más barata del straddle. Requiere movimiento más grande.",
  };
}
export function longButterfly(Klow: number, Kmid: number, Khigh: number, T: number, pLow: number, pMid: number, pHigh: number): Strategy {
  return {
    name: `Butterfly ${Klow.toFixed(0)}/${Kmid.toFixed(0)}/${Khigh.toFixed(0)}`,
    legs: [
      { optionType: "call", quantity: 1, strike: Klow, expiry: T, premium: pLow },
      { optionType: "call", quantity: -2, strike: Kmid, expiry: T, premium: pMid },
      { optionType: "call", quantity: 1, strike: Khigh, expiry: T, premium: pHigh },
    ],
    description: "Apuesta a vol baja, S terminando cerca de Kmid. Riesgo y profit limitados.",
  };
}
export function ironCondor(Kpl: number, Kps: number, Kcs: number, Kcl: number, T: number, ppl: number, pps: number, pcs: number, pcl: number): Strategy {
  return {
    name: "Iron Condor",
    legs: [
      { optionType: "put", quantity: 1, strike: Kpl, expiry: T, premium: ppl },
      { optionType: "put", quantity: -1, strike: Kps, expiry: T, premium: pps },
      { optionType: "call", quantity: -1, strike: Kcs, expiry: T, premium: pcs },
      { optionType: "call", quantity: 1, strike: Kcl, expiry: T, premium: pcl },
    ],
    description: "Apuesta a que S queda entre los strikes shorts. Crédito neto.",
  };
}
export function collar(S: number, Kput: number, Kcall: number, T: number, putPrem: number, callPrem: number): Strategy {
  return {
    name: `Collar ${Kput.toFixed(0)}/${Kcall.toFixed(0)}`,
    legs: [
      { optionType: "stock", quantity: 1, strike: 0, expiry: 0, premium: S },
      { optionType: "put", quantity: 1, strike: Kput, expiry: T, premium: putPrem },
      { optionType: "call", quantity: -1, strike: Kcall, expiry: T, premium: callPrem },
    ],
    description: "Acción + put (piso) + call short (techo). Bracket de bajo costo.",
  };
}
