// Cliente del backend FastAPI (Railway). Si NEXT_PUBLIC_API_URL no está seteada,
// las funciones devuelven null y la UI muestra un estado "configurá la API".
const DEFAULT_API = "https://option-lab-api-production.up.railway.app";
export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API).replace(/\/$/, "");

export const apiConfigured = API_URL.length > 0;

async function get<T>(path: string): Promise<T | null> {
  if (!apiConfigured) return null;
  try {
    const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export interface Quote {
  symbol: string;
  price: number;
  change: number;
  change_pct: number;
  prev_close: number;
  volume: number;
  timestamp: string;
}

export interface ChainRow {
  strike: number;
  bid: number;
  ask: number;
  last: number;
  mid: number;
  volume: number;
  openInterest: number;
  yahooIV: number;
  modelIV: number | null;
  type: "call" | "put";
}

export interface Chain {
  symbol: string;
  expiry: string;
  spot: number;
  r: number;
  T: number;
  calls: ChainRow[];
  puts: ChainRow[];
}

export const getQuotes = (symbols: string[]) =>
  get<{ quotes: Record<string, Quote | null> }>(`/api/quotes?symbols=${symbols.join(",")}`);

export const getExpiries = (symbol: string) =>
  get<{ symbol: string; expiries: string[] }>(`/api/expiries?symbol=${symbol}`);

export const getChain = (symbol: string, expiry?: string) =>
  get<Chain & { error?: string }>(
    `/api/chain?symbol=${symbol}${expiry ? `&expiry=${expiry}` : ""}`,
  );
