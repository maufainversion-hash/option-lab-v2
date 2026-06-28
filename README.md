# Option Lab

Laboratorio interactivo de opciones y derivados, basado en Hull (*Options, Futures and Other Derivatives*). Pricing en tiempo real, las griegas en superficies 3D, estrategias multi-leg, simulación Monte Carlo y árboles binomiales — todo recalculándose al instante mientras movés los parámetros.

Hecho para estudiar: cada concepto del cronograma (Hull Cap 1–19) tiene su módulo interactivo y su formulario.

## Arquitectura (monorepo)

| Carpeta | Qué es | Deploy |
|---|---|---|
| **`web/`** | Frontend Next.js 16 + React 19 + TypeScript + Tailwind v4. Motor matemático en TS (Black-Scholes, griegas, binomial, Monte Carlo) que corre en el navegador. 3D con Three.js. | **Vercel** |
| **`api/`** | Backend FastAPI sobre el motor Python validado contra Hull. Datos de mercado en vivo (yfinance), option chains con IV recomputada, pricing/greeks autoritativo. | **Railway** |
| **`legacy/`** | La app Streamlit original (referencia histórica). | — |

La matemática del hot-path corre en TypeScript para que los sliders muevan los gráficos sin ir y volver al server; el backend agrega lo que el browser no puede (datos reales y cómputo pesado).

## Módulos

- **Pricing & Griegas** — Black-Scholes vivo, las 5 griegas en 2D y superficie 3D sobre spot × tiempo.
- **Estrategias** — constructor multi-leg (spreads, straddles, cóndores) con payoff y P&L.
- **Monte Carlo** — procesos de Wiener, GBM, paths simulados y convergencia a Black-Scholes.
- **Árbol Binomial** — lattice CRR visual, ejercicio temprano americano, convergencia CRR vs Leisen-Reimer.
- **Paridad** — put-call parity, sintéticos y tasa implícita.
- **Teoría** — el formulario completo del curso, mapeado capítulo por capítulo.

Validado contra Hull, Ejemplo 14.6 (S=42, K=40, T=0.5, r=10%, σ=20% → call 4.7594, put 0.8086).

## Desarrollo

```bash
# Frontend
cd web && npm install && npm run dev          # http://localhost:3000

# Backend
cd api && pip install -r requirements.txt
uvicorn main:app --reload                      # http://localhost:8000/docs
```

El frontend usa `NEXT_PUBLIC_API_URL` para apuntar al backend (opcional — todo lo educativo funciona client-side sin backend).

---

Herramienta educativa — no es asesoramiento de inversión.
