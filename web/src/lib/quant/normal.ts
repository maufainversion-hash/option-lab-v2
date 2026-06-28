// Distribución normal estándar — CDF y PDF de alta precisión.
// erfc por aproximación de Chebyshev (Numerical Recipes), error fraccional < 1.2e-7.
// Suficiente para reproducir Hull a 4 decimales (Ej. 14.6: Call 4.7594 / Put 0.8086).

// Coeficientes del polinomio de Chebyshev (orden creciente).
const ERFC_C = [
  -1.26551223, 1.00002368, 0.37409196, 0.09678418, -0.18628806,
  0.27886807, -1.13520398, 1.48851587, -0.82215223, 0.17087277,
];

export function erfc(x: number): number {
  const z = Math.abs(x);
  const t = 1 / (1 + z / 2);
  // Horner sobre ERFC_C: poly = c0 + t*(c1 + t*(c2 + ...))
  let poly = ERFC_C[ERFC_C.length - 1];
  for (let i = ERFC_C.length - 2; i >= 0; i--) {
    poly = ERFC_C[i] + t * poly;
  }
  const r = t * Math.exp(-z * z + poly);
  return x >= 0 ? r : 2 - r;
}

/** Función de distribución acumulada normal estándar Φ(x). */
export function normCdf(x: number): number {
  return 0.5 * erfc(-x / Math.SQRT2);
}

const INV_SQRT_2PI = 0.3989422804014327;

/** Densidad normal estándar φ(x). */
export function normPdf(x: number): number {
  return INV_SQRT_2PI * Math.exp(-0.5 * x * x);
}
