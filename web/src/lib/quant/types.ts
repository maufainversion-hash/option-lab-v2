// Tipos compartidos del motor cuantitativo.
export type OptionType = "call" | "put";
export type Exercise = "european" | "american";
export type LegType = "call" | "put" | "stock";

export interface Greeks {
  delta: number;
  gamma: number;
  vega: number;
  theta: number;
  rho: number;
}

export interface OptionInputs {
  S: number; // spot
  K: number; // strike
  T: number; // años a vencimiento
  r: number; // tasa libre de riesgo continua
  sigma: number; // volatilidad anualizada
  q?: number; // dividend yield continuo
  optionType?: OptionType;
}
