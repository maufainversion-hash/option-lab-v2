"""
Option Lab API — FastAPI sobre el motor Python validado contra Hull.

Sirve: datos de mercado en vivo (yfinance), option chains con IV recomputada por
nuestro motor, y pricing/greeks autoritativo (BS, binomial, Monte Carlo).
El frontend (Next.js en Vercel) corre la matemática del hot-path en TypeScript;
este servidor agrega lo que el browser no puede: datos reales y cómputo pesado.
"""
from __future__ import annotations

import os
from typing import Literal

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from pricing.black_scholes import bs_price, bs_price_both
from pricing.binomial import crr_price, leisen_reimer_price
from pricing.monte_carlo import mc_price_european
from pricing.implied_vol import implied_vol
from greeks.analytical import all_greeks
import market
from data.tickers import UNIVERSE, HEADER_STRIP_TICKERS

app = FastAPI(title="Option Lab API", version="1.0.0")

# CORS: permití el frontend de Vercel + localhost. FRONTEND_ORIGIN puede fijar uno.
_origins = os.environ.get("FRONTEND_ORIGIN", "*")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if _origins == "*" else [o.strip() for o in _origins.split(",")],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

OptionType = Literal["call", "put"]
Exercise = Literal["european", "american"]


@app.get("/")
def root():
    return {"service": "Option Lab API", "version": "1.0.0", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/api/universe")
def universe():
    return {
        "tickers": [{"symbol": t.symbol, "name": t.name, "category": t.category} for t in UNIVERSE],
        "strip": HEADER_STRIP_TICKERS,
    }


@app.get("/api/quotes")
def quotes(symbols: str = Query(..., description="CSV de símbolos, ej SPY,QQQ,^VIX")):
    syms = [s.strip().upper() for s in symbols.split(",") if s.strip()]
    return {"quotes": market.get_quotes_batch(syms)}


@app.get("/api/rate")
def rate():
    return {"riskFreeRate": market.risk_free_rate()}


@app.get("/api/expiries")
def expiries(symbol: str):
    return {"symbol": symbol.upper(), "expiries": market.get_expiries(symbol.upper())}


@app.get("/api/chain")
def chain(symbol: str, expiry: str | None = None):
    sym = symbol.upper()
    exp = expiry
    if not exp:
        exps = market.get_expiries(sym)
        if not exps:
            return {"error": "sin expiraciones disponibles", "symbol": sym}
        exp = exps[0]
    data = market.get_chain(sym, exp)
    if data is None:
        return {"error": "sin datos de chain", "symbol": sym, "expiry": exp}
    return data


class PriceRequest(BaseModel):
    S: float = Field(gt=0)
    K: float = Field(gt=0)
    T: float = Field(gt=0)
    r: float = 0.05
    sigma: float = Field(gt=0)
    q: float = 0.0
    optionType: OptionType = "call"
    model: Literal["bs", "crr", "lr", "mc"] = "bs"
    n: int = 500
    nPaths: int = 100_000
    exercise: Exercise = "european"


@app.post("/api/price")
def price(req: PriceRequest):
    if req.model == "bs":
        p = bs_price(req.S, req.K, req.T, req.r, req.sigma, req.q, req.optionType)
    elif req.model == "crr":
        p = crr_price(req.S, req.K, req.T, req.r, req.sigma, req.q, req.n, req.optionType, req.exercise)
    elif req.model == "lr":
        p = leisen_reimer_price(req.S, req.K, req.T, req.r, req.sigma, req.q, req.n, req.optionType, req.exercise)
    else:  # mc
        res = mc_price_european(req.S, req.K, req.T, req.r, req.sigma, req.q, req.optionType, req.nPaths)
        return {"model": "mc", **res, "greeks": None}

    greeks = all_greeks(req.S, req.K, req.T, req.r, req.sigma, req.q, req.optionType)
    both = bs_price_both(req.S, req.K, req.T, req.r, req.sigma, req.q)
    return {"model": req.model, "price": p, "greeks": greeks, "bs": {"call": both[0], "put": both[1]}}


class IVRequest(BaseModel):
    marketPrice: float = Field(gt=0)
    S: float = Field(gt=0)
    K: float = Field(gt=0)
    T: float = Field(gt=0)
    r: float = 0.05
    q: float = 0.0
    optionType: OptionType = "call"


@app.post("/api/implied-vol")
def iv(req: IVRequest):
    v = implied_vol(req.marketPrice, req.S, req.K, req.T, req.r, req.q, req.optionType)
    return {"impliedVol": v}
