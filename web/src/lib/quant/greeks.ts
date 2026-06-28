// Greeks analíticas closed-form para Black-Scholes-Merton. Hull, Cap 18-19.
// Convenciones: vega por unidad de σ; theta por AÑO; rho por unidad de r.
import { normCdf, normPdf } from "./normal";
import { d1d2 } from "./blackScholes";
import type { Greeks, OptionType } from "./types";

export function delta(
  S: number, K: number, T: number, r: number, sigma: number,
  q = 0, optionType: OptionType = "call",
): number {
  if (T <= 0) {
    if (optionType === "call") return S > K ? 1 : S === K ? 0.5 : 0;
    return S < K ? -1 : S === K ? -0.5 : 0;
  }
  const [d1] = d1d2(S, K, T, r, sigma, q);
  return optionType === "call"
    ? Math.exp(-q * T) * normCdf(d1)
    : Math.exp(-q * T) * (normCdf(d1) - 1);
}

export function gamma(
  S: number, K: number, T: number, r: number, sigma: number, q = 0,
): number {
  if (T <= 0 || sigma <= 0) return 0;
  const [d1] = d1d2(S, K, T, r, sigma, q);
  return (Math.exp(-q * T) * normPdf(d1)) / (S * sigma * Math.sqrt(T));
}

export function vega(
  S: number, K: number, T: number, r: number, sigma: number, q = 0,
): number {
  if (T <= 0) return 0;
  const [d1] = d1d2(S, K, T, r, sigma, q);
  return S * Math.exp(-q * T) * normPdf(d1) * Math.sqrt(T);
}

export function theta(
  S: number, K: number, T: number, r: number, sigma: number,
  q = 0, optionType: OptionType = "call",
): number {
  if (T <= 0 || sigma <= 0) return 0;
  const [d1, d2] = d1d2(S, K, T, r, sigma, q);
  const first = (-S * Math.exp(-q * T) * normPdf(d1) * sigma) / (2 * Math.sqrt(T));
  if (optionType === "call") {
    return (
      first -
      r * K * Math.exp(-r * T) * normCdf(d2) +
      q * S * Math.exp(-q * T) * normCdf(d1)
    );
  }
  return (
    first +
    r * K * Math.exp(-r * T) * normCdf(-d2) -
    q * S * Math.exp(-q * T) * normCdf(-d1)
  );
}

export function rho(
  S: number, K: number, T: number, r: number, sigma: number,
  q = 0, optionType: OptionType = "call",
): number {
  if (T <= 0) return 0;
  const [, d2] = d1d2(S, K, T, r, sigma, q);
  return optionType === "call"
    ? K * T * Math.exp(-r * T) * normCdf(d2)
    : -K * T * Math.exp(-r * T) * normCdf(-d2);
}

export function allGreeks(
  S: number, K: number, T: number, r: number, sigma: number,
  q = 0, optionType: OptionType = "call",
): Greeks {
  return {
    delta: delta(S, K, T, r, sigma, q, optionType),
    gamma: gamma(S, K, T, r, sigma, q),
    vega: vega(S, K, T, r, sigma, q),
    theta: theta(S, K, T, r, sigma, q, optionType),
    rho: rho(S, K, T, r, sigma, q, optionType),
  };
}

export type GreekName = "delta" | "gamma" | "vega" | "theta" | "rho";

/** Evalúa una griega por nombre (gamma/vega ignoran optionType). */
export function greekByName(
  name: GreekName,
  S: number, K: number, T: number, r: number, sigma: number,
  q = 0, optionType: OptionType = "call",
): number {
  switch (name) {
    case "delta": return delta(S, K, T, r, sigma, q, optionType);
    case "gamma": return gamma(S, K, T, r, sigma, q);
    case "vega": return vega(S, K, T, r, sigma, q);
    case "theta": return theta(S, K, T, r, sigma, q, optionType);
    case "rho": return rho(S, K, T, r, sigma, q, optionType);
  }
}
