// Monte Carlo y GBM. Hull Cap 13/21. RNG sembrado (mulberry32) + Box-Muller
// para reproducibilidad. Bajo medida risk-neutral el drift es μ = r − q.

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Normal estándar por Box-Muller a partir de un RNG uniforme. */
function gaussian(rand: () => number): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = rand();
  while (v === 0) v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/** Simula nPaths trayectorias GBM con `steps` pasos hasta T. shape (nPaths, steps+1). */
export function simulateGbmPaths(
  S0: number, mu: number, sigma: number, T: number,
  steps: number, nPaths: number, seed = 42,
): number[][] {
  const rand = mulberry32(seed);
  const dt = T / steps;
  const drift = (mu - 0.5 * sigma * sigma) * dt;
  const diffusion = sigma * Math.sqrt(dt);
  const paths: number[][] = [];
  for (let p = 0; p < nPaths; p++) {
    const path = new Array(steps + 1);
    path[0] = S0;
    let logS = Math.log(S0);
    for (let s = 1; s <= steps; s++) {
      logS += drift + diffusion * gaussian(rand);
      path[s] = Math.exp(logS);
    }
    paths[p] = path;
  }
  return paths;
}

export interface McResult {
  price: number;
  stderr: number;
  ci95Lo: number;
  ci95Hi: number;
  nPaths: number;
}

/** Precio MC de europea (un paso terminal, antithetic opcional). */
export function mcPriceEuropean(
  S: number, K: number, T: number, r: number, sigma: number,
  q = 0, optionType: "call" | "put" = "call",
  nPaths = 100_000, antithetic = true, seed = 2024,
): McResult {
  if (T <= 0) {
    const intr = optionType === "call" ? Math.max(S - K, 0) : Math.max(K - S, 0);
    return { price: intr, stderr: 0, ci95Lo: intr, ci95Hi: intr, nPaths: 0 };
  }
  const rand = mulberry32(seed);
  const disc = Math.exp(-r * T);
  const driftTerm = (r - q - 0.5 * sigma * sigma) * T;
  const diffTerm = sigma * Math.sqrt(T);
  const payoff = (ST: number) =>
    optionType === "call" ? Math.max(ST - K, 0) : Math.max(K - ST, 0);

  let sum = 0;
  let sumSq = 0;
  let nSamples: number;

  if (antithetic) {
    const half = Math.floor(nPaths / 2);
    nSamples = half;
    for (let i = 0; i < half; i++) {
      const z = gaussian(rand);
      const stPos = S * Math.exp(driftTerm + diffTerm * z);
      const stNeg = S * Math.exp(driftTerm - diffTerm * z);
      const m = disc * 0.5 * (payoff(stPos) + payoff(stNeg));
      sum += m;
      sumSq += m * m;
    }
  } else {
    nSamples = nPaths;
    for (let i = 0; i < nPaths; i++) {
      const z = gaussian(rand);
      const st = S * Math.exp(driftTerm + diffTerm * z);
      const m = disc * payoff(st);
      sum += m;
      sumSq += m * m;
    }
  }
  const mean = sum / nSamples;
  const variance = Math.max(0, (sumSq - nSamples * mean * mean) / (nSamples - 1));
  const stderr = Math.sqrt(variance / nSamples);
  return {
    price: mean,
    stderr,
    ci95Lo: mean - 1.96 * stderr,
    ci95Hi: mean + 1.96 * stderr,
    nPaths: antithetic ? nSamples * 2 : nSamples,
  };
}

export function mcConvergence(
  S: number, K: number, T: number, r: number, sigma: number,
  q = 0, optionType: "call" | "put" = "call",
  nValues: number[] = [500, 1000, 2500, 5000, 10000, 25000, 50000, 100000, 250000],
  antithetic = true, seed = 42,
): { n: number[]; price: number[]; stderr: number[]; ci95Lo: number[]; ci95Hi: number[] } {
  const out = { n: [] as number[], price: [] as number[], stderr: [] as number[], ci95Lo: [] as number[], ci95Hi: [] as number[] };
  nValues.forEach((n, i) => {
    const res = mcPriceEuropean(S, K, T, r, sigma, q, optionType, n, antithetic, seed + i);
    out.n.push(n);
    out.price.push(res.price);
    out.stderr.push(res.stderr);
    out.ci95Lo.push(res.ci95Lo);
    out.ci95Hi.push(res.ci95Hi);
  });
  return out;
}

/** Cuantiles analíticos log-normales de S_t (banda teórica para los paths). */
export function lognormalQuantiles(
  S0: number, mu: number, sigma: number, tGrid: number[], z = 1.645,
): { median: number[]; lo: number[]; hi: number[] } {
  const median: number[] = [];
  const lo: number[] = [];
  const hi: number[] = [];
  for (const t of tGrid) {
    const mLog = Math.log(S0) + (mu - 0.5 * sigma * sigma) * t;
    const sLog = sigma * Math.sqrt(t);
    median.push(Math.exp(mLog));
    lo.push(Math.exp(mLog - z * sLog));
    hi.push(Math.exp(mLog + z * sLog));
  }
  return { median, lo, hi };
}
