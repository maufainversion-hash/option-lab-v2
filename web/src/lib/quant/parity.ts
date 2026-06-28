// Put-call parity y relaciones de no-arbitraje. Hull Cap 10-11.
// Europeas con dividend yield continuo q:  C + K·e^(−rT) = P + S·e^(−qT)

export function parityDifference(
  C: number, P: number, S: number, K: number, T: number, r: number, q = 0,
): number {
  return C - P - (S * Math.exp(-q * T) - K * Math.exp(-r * T));
}

export function syntheticCall(P: number, S: number, K: number, T: number, r: number, q = 0): number {
  return P + S * Math.exp(-q * T) - K * Math.exp(-r * T);
}

export function syntheticPut(C: number, S: number, K: number, T: number, r: number, q = 0): number {
  return C - S * Math.exp(-q * T) + K * Math.exp(-r * T);
}

/** Tasa libre de riesgo implícita en el par call/put. Devuelve null si los quotes violan no-arb. */
export function impliedRateFromParity(
  C: number, P: number, S: number, K: number, T: number, q = 0,
): number | null {
  const inner = (S * Math.exp(-q * T) - (C - P)) / K;
  if (inner <= 0) return null;
  return -Math.log(inner) / T;
}

export interface ParityCheck {
  lhs: number;
  rhs: number;
  difference: number;
  violated: boolean;
  interpretation: string;
}

export function parityCheck(
  C: number, P: number, S: number, K: number, T: number, r: number,
  q = 0, tolerance = 0.05,
): ParityCheck {
  const diff = parityDifference(C, P, S, K, T, r, q);
  return {
    lhs: C - P,
    rhs: S * Math.exp(-q * T) - K * Math.exp(-r * T),
    difference: diff,
    violated: Math.abs(diff) > tolerance,
    interpretation:
      diff > tolerance
        ? "Call sobreprecio respecto al put"
        : diff < -tolerance
          ? "Put sobreprecio respecto al call"
          : "Parity se cumple dentro de tolerancia",
  };
}
