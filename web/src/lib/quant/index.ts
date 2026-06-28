// Motor cuantitativo en TypeScript — validado contra Hull (Ej. 14.6).
export * from "./types";
export * from "./normal";
export * from "./blackScholes";
export * from "./greeks";
export * from "./binomial";
export * from "./monteCarlo";
export * from "./impliedVol";
export * from "./parity";
export * from "./strategies";

/** Grilla lineal de n puntos en [a, b]. */
export function linspace(a: number, b: number, n: number): number[] {
  if (n <= 1) return [a];
  const out = new Array(n);
  const step = (b - a) / (n - 1);
  for (let i = 0; i < n; i++) out[i] = a + step * i;
  return out;
}
