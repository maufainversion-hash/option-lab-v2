// Registro del cronograma (Hull) — usado por el índice lateral de /learn y los links.
export interface Unit {
  slug: string;
  title: string;
  hull: string;
  blurb: string;
  group: string;
}

export const GROUPS = [
  "Forwards, tasas y swaps",
  "Opciones",
  "Suplementos Hull",
] as const;

export const UNITS: Unit[] = [
  {
    slug: "u1-futuros",
    title: "Futuros y forwards",
    hull: "Hull 1 · 2",
    blurb: "Mecánica de futuros, forwards, mark-to-market, márgenes y los tres actores del mercado.",
    group: "Forwards, tasas y swaps",
  },
  {
    slug: "u2-coberturas",
    title: "Coberturas con futuros",
    hull: "Hull 3",
    blurb: "Hedge ratio, cobertura de mínima varianza, beta y ajuste de carteras con índices.",
    group: "Forwards, tasas y swaps",
  },
  {
    slug: "u3-tasas-fras",
    title: "Tasas de interés y FRAs",
    hull: "Hull 4",
    blurb: "Compounding, tasas cero, forward rates, FRAs, duration y la curva de rendimientos.",
    group: "Forwards, tasas y swaps",
  },
  {
    slug: "u3-forward-pricing",
    title: "Forward pricing — cost of carry",
    hull: "Hull 5",
    blurb: "Valuación de forwards y futuros: cost of carry, income, storage y convenience yield.",
    group: "Forwards, tasas y swaps",
  },
  {
    slug: "u3-ir-futures",
    title: "Futuros de tasa de interés",
    hull: "Hull 6",
    blurb: "Treasury bond futures, cheapest-to-deliver, Eurodollar futures y coberturas de duración.",
    group: "Forwards, tasas y swaps",
  },
  {
    slug: "u4-swaps",
    title: "Swaps",
    hull: "Hull 7",
    blurb: "Interest rate swaps valuados como bonos y como FRAs; currency swaps y ventaja comparativa.",
    group: "Forwards, tasas y swaps",
  },
  {
    slug: "u5-opciones",
    title: "Opciones: intro y propiedades",
    hull: "Hull 10 · 11",
    blurb: "Terminología, los 6 factores, cotas de no-arbitraje, put-call parity y ejercicio temprano.",
    group: "Opciones",
  },
  {
    slug: "u6-binomial",
    title: "Valuación: binomial y BSM",
    hull: "Hull 13 · 14 · 15",
    blurb: "Árboles binomiales, valuación risk-neutral, convergencia y la fórmula de Black-Scholes.",
    group: "Opciones",
  },
  {
    slug: "u7-index-fx",
    title: "Opciones sobre índices, FX y futuros",
    hull: "Hull 17 · 18",
    blurb: "Opciones sobre índices, monedas y futuros; el modelo de Black y dividend yield.",
    group: "Opciones",
  },
  {
    slug: "u8-estrategias",
    title: "Estrategias de trading",
    hull: "Hull 11 · 12",
    blurb: "Spreads, straddles, strangles, butterflies, cóndores y combinaciones con el subyacente.",
    group: "Opciones",
  },
  {
    slug: "griegas",
    title: "Las griegas",
    hull: "Hull 19",
    blurb: "Delta, gamma, vega, theta, rho: definición, intuición, hedging y sus relaciones.",
    group: "Opciones",
  },
  {
    slug: "cap8-securitization",
    title: "Securitización y la crisis 2008",
    hull: "Hull 8",
    blurb: "ABS, CDOs, tranches, el rol de las hipotecas subprime y qué salió mal en 2007-2008.",
    group: "Suplementos Hull",
  },
  {
    slug: "cap9-ois",
    title: "OIS y colateral",
    hull: "Hull 9",
    blurb: "Overnight Indexed Swaps, descuento OIS vs LIBOR y el rol del colateral post-crisis.",
    group: "Suplementos Hull",
  },
];

export const unitBySlug = (slug: string) => UNITS.find((u) => u.slug === slug);
