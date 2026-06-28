import { DataTable } from "@/components/learn/content";

// El "machete": payoff BRUTO al vencimiento por tramo de S (S = S_T), notación simbólica.
// El neto = bruto − prima neta (débito) o + prima neta (crédito).

interface StratTable {
  name: string;
  legs: string;
  flow: string;
  headers: string[];
  rows: string[][];
}

const TABLES: StratTable[] = [
  {
    name: "Long Call",
    legs: "Long call K",
    flow: "Débito",
    headers: ["Rango", "Long call K", "Payoff total"],
    rows: [
      ["S ≤ K", "0", "0"],
      ["S ≥ K", "S − K", "S − K"],
    ],
  },
  {
    name: "Long Put",
    legs: "Long put K",
    flow: "Débito",
    headers: ["Rango", "Long put K", "Payoff total"],
    rows: [
      ["S ≤ K", "K − S", "K − S"],
      ["S ≥ K", "0", "0"],
    ],
  },
  {
    name: "Bull Call Spread",
    legs: "Long call K₁ + Short call K₂  (K₁ < K₂)",
    flow: "Débito",
    headers: ["Rango", "Long call K₁", "Short call K₂", "Payoff total"],
    rows: [
      ["S ≤ K₁", "0", "0", "0"],
      ["K₁ ≤ S ≤ K₂", "S − K₁", "0", "S − K₁"],
      ["S ≥ K₂", "S − K₁", "−(S − K₂)", "K₂ − K₁"],
    ],
  },
  {
    name: "Bear Put Spread",
    legs: "Long put K₂ + Short put K₁  (K₁ < K₂)",
    flow: "Débito",
    headers: ["Rango", "Long put K₂", "Short put K₁", "Payoff total"],
    rows: [
      ["S ≤ K₁", "K₂ − S", "−(K₁ − S)", "K₂ − K₁"],
      ["K₁ ≤ S ≤ K₂", "K₂ − S", "0", "K₂ − S"],
      ["S ≥ K₂", "0", "0", "0"],
    ],
  },
  {
    name: "Long Straddle",
    legs: "Long call K + Long put K (mismo strike)",
    flow: "Débito",
    headers: ["Rango", "Long call K", "Long put K", "Payoff total"],
    rows: [
      ["S ≤ K", "0", "K − S", "K − S"],
      ["S ≥ K", "S − K", "0", "S − K"],
    ],
  },
  {
    name: "Long Strangle",
    legs: "Long put K₁ + Long call K₂  (K₁ < K₂)",
    flow: "Débito",
    headers: ["Rango", "Long put K₁", "Long call K₂", "Payoff total"],
    rows: [
      ["S ≤ K₁", "K₁ − S", "0", "K₁ − S"],
      ["K₁ ≤ S ≤ K₂", "0", "0", "0"],
      ["S ≥ K₂", "0", "S − K₂", "S − K₂"],
    ],
  },
  {
    name: "Butterfly (calls)",
    legs: "Long call K₁ + 2× Short call K₂ + Long call K₃  (equidistantes)",
    flow: "Débito",
    headers: ["Rango", "Long K₁", "−2× K₂", "Long K₃", "Payoff total"],
    rows: [
      ["S ≤ K₁", "0", "0", "0", "0"],
      ["K₁ ≤ S ≤ K₂", "S − K₁", "0", "0", "S − K₁"],
      ["K₂ ≤ S ≤ K₃", "S − K₁", "−2(S − K₂)", "0", "K₃ − S"],
      ["S ≥ K₃", "S − K₁", "−2(S − K₂)", "S − K₃", "0"],
    ],
  },
  {
    name: "Iron Condor",
    legs: "Long put K₁ + Short put K₂ + Short call K₃ + Long call K₄  (K₁<K₂<K₃<K₄)",
    flow: "Crédito",
    headers: ["Rango", "Long put K₁", "Short put K₂", "Short call K₃", "Long call K₄", "Total"],
    rows: [
      ["S ≤ K₁", "K₁ − S", "−(K₂ − S)", "0", "0", "K₁ − K₂"],
      ["K₁ ≤ S ≤ K₂", "0", "−(K₂ − S)", "0", "0", "S − K₂"],
      ["K₂ ≤ S ≤ K₃", "0", "0", "0", "0", "0"],
      ["K₃ ≤ S ≤ K₄", "0", "0", "−(S − K₃)", "0", "K₃ − S"],
      ["S ≥ K₄", "0", "0", "−(S − K₃)", "S − K₄", "K₃ − K₄"],
    ],
  },
  {
    name: "Covered Call",
    legs: "Long acción + Short call K",
    flow: "Crédito",
    headers: ["Rango", "Acción", "Short call K", "Payoff total"],
    rows: [
      ["S ≤ K", "S", "0", "S"],
      ["S ≥ K", "S", "−(S − K)", "K"],
    ],
  },
  {
    name: "Protective Put",
    legs: "Long acción + Long put K",
    flow: "Débito",
    headers: ["Rango", "Acción", "Long put K", "Payoff total"],
    rows: [
      ["S ≤ K", "S", "K − S", "K"],
      ["S ≥ K", "S", "0", "S"],
    ],
  },
  {
    name: "Collar",
    legs: "Long acción + Long put K₁ + Short call K₂  (K₁ < K₂)",
    flow: "Crédito/~cero",
    headers: ["Rango", "Acción", "Long put K₁", "Short call K₂", "Total"],
    rows: [
      ["S ≤ K₁", "S", "K₁ − S", "0", "K₁"],
      ["K₁ ≤ S ≤ K₂", "S", "0", "0", "S"],
      ["S ≥ K₂", "S", "0", "−(S − K₂)", "K₂"],
    ],
  },
];

export function PayoffByRange() {
  return (
    <div className="space-y-7">
      {TABLES.map((t) => (
        <div key={t.name}>
          <div className="mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="font-display text-[17px] font-medium text-text">{t.name}</h3>
            <span className="readout text-[12px] text-muted">{t.legs}</span>
            <span
              className={`chip text-[10px] ${
                t.flow.includes("Crédito") ? "text-gain" : "text-muted"
              }`}
            >
              {t.flow}
            </span>
          </div>
          <DataTable headers={t.headers} rows={t.rows} />
        </div>
      ))}
    </div>
  );
}
