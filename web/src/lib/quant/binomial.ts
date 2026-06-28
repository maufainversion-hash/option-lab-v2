// Árboles binomiales: Cox-Ross-Rubinstein (clásico Hull Cap 13) y Leisen-Reimer
// (Peizer-Pratt, convergencia rápida y monótona). Soportan europeo y americano.
import type { OptionType, Exercise } from "./types";

export function crrPrice(
  S: number, K: number, T: number, r: number, sigma: number,
  q = 0, n = 500, optionType: OptionType = "call", exercise: Exercise = "european",
): number {
  if (T <= 0) return optionType === "call" ? Math.max(S - K, 0) : Math.max(K - S, 0);
  const dt = T / n;
  const u = Math.exp(sigma * Math.sqrt(dt));
  const d = 1 / u;
  const p = (Math.exp((r - q) * dt) - d) / (u - d);
  const disc = Math.exp(-r * dt);

  const V = new Float64Array(n + 1);
  for (let j = 0; j <= n; j++) {
    const ST = S * Math.pow(u, n - j) * Math.pow(d, j);
    V[j] = optionType === "call" ? Math.max(ST - K, 0) : Math.max(K - ST, 0);
  }
  for (let i = n - 1; i >= 0; i--) {
    for (let j = 0; j <= i; j++) {
      V[j] = disc * (p * V[j] + (1 - p) * V[j + 1]);
      if (exercise === "american") {
        const St = S * Math.pow(u, i - j) * Math.pow(d, j);
        const intr = optionType === "call" ? Math.max(St - K, 0) : Math.max(K - St, 0);
        if (intr > V[j]) V[j] = intr;
      }
    }
  }
  return V[0];
}

function peizerPratt(z: number, n: number): number {
  const sign = z >= 0 ? 1 : -1;
  return (
    0.5 +
    sign *
      0.5 *
      Math.sqrt(
        1 -
          Math.exp(
            -Math.pow(z / (n + 1 / 3 + 0.1 / (n + 1)), 2) * (n + 1 / 6),
          ),
      )
  );
}

export function leisenReimerPrice(
  S: number, K: number, T: number, r: number, sigma: number,
  q = 0, n = 51, optionType: OptionType = "call", exercise: Exercise = "european",
): number {
  if (n % 2 === 0) n += 1; // n impar centra el árbol en el strike
  if (T <= 0) return optionType === "call" ? Math.max(S - K, 0) : Math.max(K - S, 0);
  const dt = T / n;
  const d1 =
    (Math.log(S / K) + (r - q + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);
  const p = peizerPratt(d2, n);
  const pStar = peizerPratt(d1, n);
  const u = (Math.exp((r - q) * dt) * pStar) / p;
  const d = (Math.exp((r - q) * dt) - p * u) / (1 - p);
  const disc = Math.exp(-r * dt);

  const V = new Float64Array(n + 1);
  for (let j = 0; j <= n; j++) {
    const ST = S * Math.pow(u, n - j) * Math.pow(d, j);
    V[j] = optionType === "call" ? Math.max(ST - K, 0) : Math.max(K - ST, 0);
  }
  for (let i = n - 1; i >= 0; i--) {
    for (let j = 0; j <= i; j++) {
      V[j] = disc * (p * V[j] + (1 - p) * V[j + 1]);
      if (exercise === "american") {
        const St = S * Math.pow(u, i - j) * Math.pow(d, j);
        const intr = optionType === "call" ? Math.max(St - K, 0) : Math.max(K - St, 0);
        if (intr > V[j]) V[j] = intr;
      }
    }
  }
  return V[0];
}

export interface TreeNode {
  i: number; // paso temporal
  j: number; // índice de bajadas (0 = todo subidas)
  S: number; // precio del subyacente
  V: number; // valor de la opción
  exercise: boolean; // ejercicio temprano óptimo (americano)
}

/** Lattice completo CRR para visualización (precios y valores en cada nodo). */
export function crrTree(
  S: number, K: number, T: number, r: number, sigma: number,
  q = 0, n = 6, optionType: OptionType = "call", exercise: Exercise = "european",
): { nodes: TreeNode[]; u: number; d: number; p: number; price: number } {
  const dt = T / n;
  const u = Math.exp(sigma * Math.sqrt(dt));
  const d = 1 / u;
  const p = (Math.exp((r - q) * dt) - d) / (u - d);
  const disc = Math.exp(-r * dt);

  // matriz de precios del subyacente
  const Sgrid: number[][] = [];
  for (let i = 0; i <= n; i++) {
    Sgrid[i] = [];
    for (let j = 0; j <= i; j++) {
      Sgrid[i][j] = S * Math.pow(u, i - j) * Math.pow(d, j);
    }
  }
  // valores por inducción hacia atrás
  const Vgrid: number[][] = [];
  const exFlag: boolean[][] = [];
  for (let i = 0; i <= n; i++) {
    Vgrid[i] = new Array(i + 1).fill(0);
    exFlag[i] = new Array(i + 1).fill(false);
  }
  for (let j = 0; j <= n; j++) {
    Vgrid[n][j] =
      optionType === "call" ? Math.max(Sgrid[n][j] - K, 0) : Math.max(K - Sgrid[n][j], 0);
  }
  for (let i = n - 1; i >= 0; i--) {
    for (let j = 0; j <= i; j++) {
      const cont = disc * (p * Vgrid[i + 1][j] + (1 - p) * Vgrid[i + 1][j + 1]);
      const intr =
        optionType === "call" ? Math.max(Sgrid[i][j] - K, 0) : Math.max(K - Sgrid[i][j], 0);
      if (exercise === "american" && intr > cont) {
        Vgrid[i][j] = intr;
        exFlag[i][j] = true;
      } else {
        Vgrid[i][j] = cont;
      }
    }
  }
  const nodes: TreeNode[] = [];
  for (let i = 0; i <= n; i++) {
    for (let j = 0; j <= i; j++) {
      nodes.push({ i, j, S: Sgrid[i][j], V: Vgrid[i][j], exercise: exFlag[i][j] });
    }
  }
  return { nodes, u, d, p, price: Vgrid[0][0] };
}

export function binomialConvergence(
  S: number, K: number, T: number, r: number, sigma: number,
  q = 0, optionType: OptionType = "call",
  nValues: number[] = [2, 4, 6, 10, 15, 25, 50, 100, 200, 350, 500],
): { n: number[]; crr: number[]; lr: number[] } {
  return {
    n: nValues,
    crr: nValues.map((n) => crrPrice(S, K, T, r, sigma, q, n, optionType, "european")),
    lr: nValues.map((n) =>
      leisenReimerPrice(S, K, T, r, sigma, q, Math.max(3, n), optionType, "european"),
    ),
  };
}
