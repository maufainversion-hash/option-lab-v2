"""
Capa de datos de mercado para la API (sin Streamlit).

yfinance + curl_cffi (impersonate Chrome para evitar el throttling de Yahoo) y un
cache TTL en memoria simple. Todo falla graceful: si Yahoo no responde, los
endpoints devuelven listas/None en vez de romper.
"""
from __future__ import annotations

import time
import logging
from dataclasses import dataclass, asdict
from datetime import datetime, timezone
from threading import Lock
from typing import Any, Callable

import yfinance as yf

log = logging.getLogger("market")

# ── cache TTL en memoria ────────────────────────────────────────────────────
_CACHE: dict[str, tuple[float, Any]] = {}
_LOCK = Lock()


def _cached(key: str, ttl: float, producer: Callable[[], Any]) -> Any:
    now = time.time()
    with _LOCK:
        hit = _CACHE.get(key)
        if hit and now - hit[0] < ttl:
            return hit[1]
    value = producer()
    with _LOCK:
        _CACHE[key] = (now, value)
    return value


_session = None


def _get_session():
    global _session
    if _session is None:
        try:
            from curl_cffi import requests as curl_requests
            _session = curl_requests.Session(impersonate="chrome")
        except Exception:  # pragma: no cover
            _session = False  # marca "intentado, no disponible"
    return _session or None


def _ticker(symbol: str) -> "yf.Ticker":
    sess = _get_session()
    return yf.Ticker(symbol, session=sess) if sess is not None else yf.Ticker(symbol)


@dataclass
class Quote:
    symbol: str
    price: float
    change: float
    change_pct: float
    prev_close: float
    volume: int
    timestamp: str

    def dict(self) -> dict:
        return asdict(self)


def _quote_from_hist(hist, symbol: str) -> Quote | None:
    if hist is None or hist.empty or len(hist) < 2:
        return None
    try:
        price = float(hist["Close"].iloc[-1])
        prev = float(hist["Close"].iloc[-2])
        vol = int(hist["Volume"].iloc[-1]) if "Volume" in hist.columns else 0
        if price <= 0 or prev <= 0:
            return None
        change = price - prev
        return Quote(
            symbol, price, change,
            (change / prev) * 100.0 if prev else 0.0,
            prev, vol, datetime.now(timezone.utc).isoformat(),
        )
    except (KeyError, ValueError, IndexError):
        return None


def get_quote(symbol: str) -> Quote | None:
    def produce():
        try:
            hist = _ticker(symbol).history(period="5d", auto_adjust=False)
            q = _quote_from_hist(hist, symbol)
            if q:
                return q
        except Exception as e:
            log.info("history fail %s: %s", symbol, e)
        try:
            import pandas as pd
            sess = _get_session()
            kw = {"progress": False, "auto_adjust": False, "threads": False}
            if sess is not None:
                kw["session"] = sess
            df = yf.download(symbol, period="5d", **kw)
            if df is not None and not df.empty:
                if isinstance(df.columns, pd.MultiIndex):
                    df.columns = df.columns.get_level_values(0)
                return _quote_from_hist(df, symbol)
        except Exception as e:
            log.warning("download fail %s: %s", symbol, e)
        return None

    return _cached(f"q:{symbol}", 60, produce)


def get_quotes_batch(symbols: list[str]) -> dict[str, dict | None]:
    out: dict[str, dict | None] = {}
    for s in symbols:
        q = get_quote(s)
        out[s] = q.dict() if q else None
    return out


def get_expiries(symbol: str) -> list[str]:
    def produce():
        try:
            return list(_ticker(symbol).options or [])
        except Exception as e:
            log.warning("expiries fail %s: %s", symbol, e)
            return []

    return _cached(f"exp:{symbol}", 300, produce)


def time_to_expiry_years(expiry: str) -> float:
    exp = datetime.strptime(expiry, "%Y-%m-%d").replace(tzinfo=timezone.utc)
    days = (exp - datetime.now(timezone.utc)).total_seconds() / 86400.0
    return max(days / 365.0, 0.0)


def risk_free_rate() -> float:
    def produce():
        q = get_quote("^TNX")
        return float(q.price) / 100.0 if q else 0.04

    return _cached("rate", 3600, produce)


def get_chain(symbol: str, expiry: str) -> dict | None:
    """
    Devuelve {spot, expiry, T, r, calls:[...], puts:[...]} con IV de Yahoo y la
    IV recomputada por nuestro motor (Brent) sobre el mid, ventana ±40% del spot.
    """
    def produce():
        from pricing.implied_vol import implied_vol
        try:
            t = _ticker(symbol)
            oc = t.option_chain(expiry)
        except Exception as e:
            log.warning("chain fail %s @ %s: %s", symbol, expiry, e)
            return None

        q = get_quote(symbol)
        spot = float(q.price) if q else None
        if spot is None:
            return None
        r = risk_free_rate()
        T = time_to_expiry_years(expiry)
        lo, hi = spot * 0.6, spot * 1.4

        def rows(df, otype):
            res = []
            for _, row in df.iterrows():
                try:
                    strike = float(row["strike"])
                except Exception:
                    continue
                if strike < lo or strike > hi:
                    continue
                bid = float(row.get("bid", 0) or 0)
                ask = float(row.get("ask", 0) or 0)
                last = float(row.get("lastPrice", 0) or 0)
                yiv = float(row.get("impliedVolatility", 0) or 0)
                mid = (bid + ask) / 2.0 if (bid > 0 and ask > 0) else last
                model_iv = None
                if mid > 0 and T > 0:
                    model_iv = implied_vol(mid, spot, strike, T, r, 0.0, otype)
                res.append({
                    "strike": strike,
                    "bid": bid, "ask": ask, "last": last, "mid": mid,
                    "volume": int(row.get("volume", 0) or 0),
                    "openInterest": int(row.get("openInterest", 0) or 0),
                    "yahooIV": yiv,
                    "modelIV": model_iv,
                    "type": otype,
                })
            return sorted(res, key=lambda x: x["strike"])

        return {
            "symbol": symbol, "expiry": expiry, "spot": spot, "r": r, "T": T,
            "calls": rows(oc.calls, "call"),
            "puts": rows(oc.puts, "put"),
        }

    return _cached(f"chain:{symbol}:{expiry}", 300, produce)
