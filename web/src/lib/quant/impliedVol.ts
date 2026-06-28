// Volatilidad implícita por bisección (robusto, sin derivada — no diverge con vega≈0).
import { bsPrice } from "./blackScholes";
import type { OptionType } from "./types";

export function impliedVol(
  marketPrice: number,
  S: number, K: number, T: number, r: number,
  q = 0, optionType: OptionType = "call",
  tol = 1e-6, maxIter = 100, sigmaLow = 1e-4, sigmaHigh = 5,
): number | null {
  if (marketPrice <= 0 || T <= 0) return null;

  const lowerBound =
    optionType === "call"
      ? Math.max(S * Math.exp(-q * T) - K * Math.exp(-r * T), 0)
      : Math.max(K * Math.exp(-r * T) - S * Math.exp(-q * T), 0);
  if (marketPrice < lowerBound - 1e-6) return null;

  const upperBound =
    optionType === "call" ? S * Math.exp(-q * T) : K * Math.exp(-r * T);
  if (marketPrice > upperBound + 1e-6) return null;

  const f = (sig: number) => bsPrice(S, K, T, r, sig, q, optionType) - marketPrice;
  let lo = sigmaLow;
  let hi = sigmaHigh;
  let flo = f(lo);
  let fhi = f(hi);
  if (flo * fhi > 0) return null; // sin cambio de signo en el intervalo

  for (let i = 0; i < maxIter; i++) {
    const mid = 0.5 * (lo + hi);
    const fmid = f(mid);
    if (Math.abs(fmid) < tol || (hi - lo) / 2 < tol) return mid;
    if (flo * fmid < 0) {
      hi = mid;
      fhi = fmid;
    } else {
      lo = mid;
      flo = fmid;
    }
  }
  return 0.5 * (lo + hi);
}
