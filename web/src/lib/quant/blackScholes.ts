// Black-Scholes-Merton para opciones europeas con dividend yield continuo q.
// Hull, Cap 14. Anclado a Ej. 14.6 (S=42,K=40,T=0.5,r=.10,σ=.20) → Call 4.7594 / Put 0.8086.
import { normCdf } from "./normal";
import type { OptionType } from "./types";

export function d1d2(
  S: number,
  K: number,
  T: number,
  r: number,
  sigma: number,
  q = 0,
): [number, number] {
  const d1 =
    (Math.log(S / K) + (r - q + 0.5 * sigma * sigma) * T) /
    (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);
  return [d1, d2];
}

export function bsPrice(
  S: number,
  K: number,
  T: number,
  r: number,
  sigma: number,
  q = 0,
  optionType: OptionType = "call",
): number {
  if (T <= 0) {
    return optionType === "call" ? Math.max(S - K, 0) : Math.max(K - S, 0);
  }
  if (sigma <= 0) {
    // límite determinístico: descuento del forward intrínseco
    const fwd = S * Math.exp(-q * T) - K * Math.exp(-r * T);
    return optionType === "call" ? Math.max(fwd, 0) : Math.max(-fwd, 0);
  }
  const [d1, d2] = d1d2(S, K, T, r, sigma, q);
  if (optionType === "call") {
    return S * Math.exp(-q * T) * normCdf(d1) - K * Math.exp(-r * T) * normCdf(d2);
  }
  return K * Math.exp(-r * T) * normCdf(-d2) - S * Math.exp(-q * T) * normCdf(-d1);
}

export function bsPriceBoth(
  S: number,
  K: number,
  T: number,
  r: number,
  sigma: number,
  q = 0,
): { call: number; put: number } {
  return {
    call: bsPrice(S, K, T, r, sigma, q, "call"),
    put: bsPrice(S, K, T, r, sigma, q, "put"),
  };
}

/** Valor intrínseco (sin valor temporal). */
export function intrinsic(S: number, K: number, optionType: OptionType): number {
  return optionType === "call" ? Math.max(S - K, 0) : Math.max(K - S, 0);
}

/** Valor temporal = precio − intrínseco. */
export function timeValue(
  S: number,
  K: number,
  T: number,
  r: number,
  sigma: number,
  q = 0,
  optionType: OptionType = "call",
): number {
  return bsPrice(S, K, T, r, sigma, q, optionType) - intrinsic(S, K, optionType);
}
