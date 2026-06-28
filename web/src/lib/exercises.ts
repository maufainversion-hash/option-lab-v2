export interface Step {
  text: string;
  tex?: string;
}

export interface Exercise {
  id: string;
  topic: string;
  hull: string;
  title: string;
  statement: string;
  givens?: string[];
  steps: Step[];
  answer: string;
}

export const EXERCISES: Exercise[] = [
  {
    id: "forward-price-1",
    topic: "Forwards y futuros",
    hull: "Hull 5.4",
    title: "Precio forward de una acción sin dividendos",
    statement:
      "Una acción que no paga dividendos cotiza hoy a $40. La tasa libre de riesgo con capitalización continua es 5% anual. ¿Cuál es el precio forward a 3 meses?",
    givens: ["S₀ = 40", "r = 5% (continua)", "T = 0.25 años"],
    steps: [
      {
        text: "Como el activo no paga dividendos, el precio forward es el spot capitalizado al cost of carry (sólo la tasa).",
        tex: "F_0 = S_0 \\, e^{rT}",
      },
      {
        text: "Reemplazamos S₀ = 40, r = 0.05 y T = 0.25.",
        tex: "F_0 = 40 \\, e^{0.05 \\times 0.25}",
      },
      {
        text: "Calculamos el exponente y la exponencial.",
        tex: "e^{0.0125} = 1.012578",
      },
      {
        text: "Multiplicamos por el spot.",
        tex: "F_0 = 40 \\times 1.012578 = 40.503",
      },
    ],
    answer: "F₀ ≈ $40.50",
  },
  {
    id: "forward-value-1",
    topic: "Forwards y futuros",
    hull: "Hull 5.7",
    title: "Valor de un contrato forward ya pactado",
    statement:
      "Hace un tiempo entramos en un forward largo sobre una acción sin dividendos con precio de entrega K = 24. Hoy faltan 6 meses para el vencimiento, la acción vale $25 y la tasa libre de riesgo es 10% continua. ¿Cuál es el valor del forward para la posición larga?",
    givens: ["K = 24", "S₀ = 25", "r = 10% (continua)", "T = 0.5 años"],
    steps: [
      {
        text: "El valor de un forward largo es el valor presente de la diferencia entre el precio forward actual y el precio de entrega pactado.",
        tex: "f = (F_0 - K) e^{-rT}",
      },
      {
        text: "Primero calculamos el precio forward actual del activo.",
        tex: "F_0 = S_0 e^{rT} = 25 \\, e^{0.10 \\times 0.5} = 26.282",
      },
      {
        text: "Una forma equivalente y directa es f = S₀ − K·e^(−rT). Calculamos el factor de descuento.",
        tex: "e^{-0.10 \\times 0.5} = e^{-0.05} = 0.951229",
      },
      {
        text: "Reemplazamos en la fórmula directa.",
        tex: "f = 25 - 24 \\times 0.951229",
      },
      {
        text: "Resolvemos.",
        tex: "f = 25 - 22.829 = 2.171",
      },
    ],
    answer: "f ≈ $2.17 para la posición larga",
  },
  {
    id: "rate-conversion-1",
    topic: "Tasas y FRAs",
    hull: "Hull 4.2",
    title: "Conversión de tasa con capitalización a tasa continua",
    statement:
      "Una tasa de interés se cotiza al 10% anual con capitalización semestral (m = 2). Convertila a su equivalente con capitalización continua.",
    givens: ["Rₘ = 10%", "m = 2 (semestral)"],
    steps: [
      {
        text: "La tasa continua equivalente se obtiene a partir de la tasa con m capitalizaciones por año.",
        tex: "R_c = m \\, \\ln\\!\\left(1 + \\frac{R_m}{m}\\right)",
      },
      {
        text: "Reemplazamos m = 2 y Rₘ = 0.10.",
        tex: "R_c = 2 \\, \\ln\\!\\left(1 + \\frac{0.10}{2}\\right) = 2 \\ln(1.05)",
      },
      {
        text: "Calculamos el logaritmo.",
        tex: "\\ln(1.05) = 0.048790",
      },
      {
        text: "Multiplicamos por 2.",
        tex: "R_c = 2 \\times 0.048790 = 0.097580",
      },
    ],
    answer: "R_c ≈ 9.758% continua",
  },
  {
    id: "forward-rate-1",
    topic: "Tasas y FRAs",
    hull: "Hull 4.6",
    title: "Tasa forward a partir de tasas cero",
    statement:
      "La tasa cero a 1 año es 3% y la tasa cero a 2 años es 4% (ambas continuas). ¿Cuál es la tasa forward para el segundo año (entre el año 1 y el año 2)?",
    givens: ["R₁ = 3% (T₁ = 1)", "R₂ = 4% (T₂ = 2)"],
    steps: [
      {
        text: "La tasa forward entre T₁ y T₂ con capitalización continua surge de igualar invertir hasta T₂ versus invertir hasta T₁ y reinvertir.",
        tex: "R_F = \\frac{R_2 T_2 - R_1 T_1}{T_2 - T_1}",
      },
      {
        text: "Reemplazamos R₁ = 0.03, T₁ = 1, R₂ = 0.04, T₂ = 2.",
        tex: "R_F = \\frac{0.04 \\times 2 - 0.03 \\times 1}{2 - 1}",
      },
      {
        text: "Calculamos numerador y denominador.",
        tex: "R_F = \\frac{0.08 - 0.03}{1} = 0.05",
      },
    ],
    answer: "R_F = 5% para el segundo año",
  },
  {
    id: "fra-valuation-1",
    topic: "Tasas y FRAs",
    hull: "Hull 4.7",
    title: "Valuación de un FRA",
    statement:
      "Una empresa acordó un FRA en el que recibe una tasa fija del 4% (continua, sobre base anual) sobre un nominal de $100 millones para un período de 1 año que comienza dentro de 1 año. La tasa forward actual para ese período es 5% y la tasa cero a 2 años es 4%. ¿Cuál es el valor del FRA hoy?",
    givens: [
      "L = $100,000,000",
      "R_K = 4% (fija que se recibe)",
      "R_F = 5% (forward del período)",
      "Período: entre T₁ = 1 y T₂ = 2",
      "R₂ = 4% (descuento a 2 años)",
    ],
    steps: [
      {
        text: "El valor de un FRA en el que se RECIBE la tasa fija R_K es el valor presente del diferencial (R_K − R_F) sobre el nominal y el plazo del período.",
        tex: "V = L (R_K - R_F)(T_2 - T_1) e^{-R_2 T_2}",
      },
      {
        text: "El diferencial de tasas por el plazo (1 año).",
        tex: "(0.04 - 0.05)(1) = -0.01",
      },
      {
        text: "Aplicado al nominal da el flujo no descontado.",
        tex: "100{,}000{,}000 \\times (-0.01) = -1{,}000{,}000",
      },
      {
        text: "Descontamos a hoy con la tasa cero a 2 años.",
        tex: "e^{-0.04 \\times 2} = e^{-0.08} = 0.923116",
      },
      {
        text: "Multiplicamos.",
        tex: "V = -1{,}000{,}000 \\times 0.923116 = -923{,}116",
      },
    ],
    answer: "V ≈ −$923,116 (pérdida para quien recibe el 4%)",
  },
  {
    id: "irs-valuation-1",
    topic: "Swaps",
    hull: "Hull 7.7",
    title: "Valuación de un IRS por el enfoque de bonos",
    statement:
      "Una institución financiera pagó fija y recibió flotante en un swap a tasa de interés. Faltan flujos en 3, 9 y 15 meses. El swap intercambia, sobre un nominal de $100 millones, una tasa fija del 8% (capitalización semestral, es decir $4 millones por semestre) por LIBOR. Las tasas continuas de descuento son 10%, 10.5% y 11% para 3, 9 y 15 meses. La tasa LIBOR de 6 meses fijada en el último pago fue 10.2% (semestral), lo que implica que el próximo flujo flotante es $5.1 millones. Valuá el swap para la institución (recibe flotante, paga fija).",
    givens: [
      "L = $100M",
      "Pata fija: $4M en 3, 9 y 15 meses (8% s.a.)",
      "Próximo flotante: $5.1M en 3 meses",
      "Tasas: 10% (3m), 10.5% (9m), 11% (15m)",
    ],
    steps: [
      {
        text: "El swap (recibir flotante − pagar fija) vale V = B_flot − B_fija, valuando cada pata como un bono.",
        tex: "V_{swap} = B_{flot} - B_{fija}",
      },
      {
        text: "Bono de la pata fija: descontamos los tres cupones de $4M más el nominal $100M en 15 meses.",
        tex: "B_{fija} = 4e^{-0.10(0.25)} + 4e^{-0.105(0.75)} + 104 e^{-0.11(1.25)}",
      },
      {
        text: "Calculamos cada término (en millones): 4·0.97531 = 3.901; 4·0.92419 = 3.697; 104·0.87155 = 90.641.",
        tex: "B_{fija} = 3.901 + 3.697 + 90.641 = 98.238",
      },
      {
        text: "Bono de la pata flotante: justo después de un pago vale el nominal. Por ende, hoy vale el próximo flujo conocido más el nominal, descontados al primer pago (3 meses): $105.1M descontado a 3 meses.",
        tex: "B_{flot} = (100 + 5.1) e^{-0.10(0.25)} = 105.1 \\times 0.97531",
      },
      {
        text: "Calculamos el bono flotante.",
        tex: "B_{flot} = 102.505",
      },
      {
        text: "El valor del swap para quien recibe flotante y paga fija.",
        tex: "V = 102.505 - 98.238 = 4.267",
      },
    ],
    answer: "V ≈ +$4.27 millones para la institución (recibe flotante)",
  },
  {
    id: "put-call-parity-1",
    topic: "Paridad",
    hull: "Hull 11.4",
    title: "Despejar el precio de un put con paridad put-call",
    statement:
      "Una acción que no paga dividendos vale $31. Hay una call europea y un put europeo, ambos con strike $30 y vencimiento a 3 meses. La call cotiza a $3 y la tasa libre de riesgo es 10% continua. ¿Cuál debería ser el precio del put?",
    givens: ["S₀ = 31", "K = 30", "T = 0.25", "r = 10% (continua)", "c = 3"],
    steps: [
      {
        text: "La paridad put-call relaciona call y put europeos del mismo strike y vencimiento.",
        tex: "c + K e^{-rT} = p + S_0",
      },
      {
        text: "Despejamos el precio del put.",
        tex: "p = c + K e^{-rT} - S_0",
      },
      {
        text: "Calculamos el valor presente del strike.",
        tex: "K e^{-rT} = 30 \\, e^{-0.10 \\times 0.25} = 30 \\times 0.97531 = 29.259",
      },
      {
        text: "Reemplazamos todo.",
        tex: "p = 3 + 29.259 - 31",
      },
      {
        text: "Resolvemos.",
        tex: "p = 1.259",
      },
    ],
    answer: "p ≈ $1.26",
  },
  {
    id: "implied-rate-parity-1",
    topic: "Paridad",
    hull: "Hull 11",
    title: "Tasa implícita desde la paridad put-call",
    statement:
      "Para una acción sin dividendos a S₀ = 100, una call y un put europeos con strike K = 100 y T = 1 año cotizan c = 9 y p = 5. ¿Qué tasa libre de riesgo continua está implícita en estos precios?",
    givens: ["S₀ = 100", "K = 100", "T = 1", "c = 9", "p = 5"],
    steps: [
      {
        text: "Partimos de la paridad put-call y despejamos el valor presente del strike.",
        tex: "K e^{-rT} = c - p + ... \\;\\Rightarrow\\; K e^{-rT} = S_0 - c + p",
      },
      {
        text: "Reemplazamos los datos.",
        tex: "100 \\, e^{-r} = 100 - 9 + 5 = 96",
      },
      {
        text: "Despejamos el factor de descuento.",
        tex: "e^{-r} = 0.96",
      },
      {
        text: "Tomamos logaritmo natural.",
        tex: "r = -\\ln(0.96) = 0.040822",
      },
    ],
    answer: "r ≈ 4.08% continua",
  },
  {
    id: "binomial-1step-1",
    topic: "Binomial",
    hull: "Hull 13.1",
    title: "Valuación risk-neutral en un árbol de 1 paso",
    statement:
      "Una acción vale $20 hoy. En 3 meses subirá a $22 o bajará a $18. La tasa libre de riesgo es 12% continua. Valuá una call europea con strike $21.",
    givens: ["S₀ = 20", "S_u = 22", "S_d = 18", "K = 21", "T = 0.25", "r = 12% (continua)"],
    steps: [
      {
        text: "Definimos los factores de subida y bajada respecto del spot.",
        tex: "u = \\frac{22}{20} = 1.1, \\quad d = \\frac{18}{20} = 0.9",
      },
      {
        text: "Calculamos la probabilidad risk-neutral.",
        tex: "p = \\frac{e^{rT} - d}{u - d}",
      },
      {
        text: "Reemplazamos: e^(0.12·0.25) = 1.030455.",
        tex: "p = \\frac{1.030455 - 0.9}{1.1 - 0.9} = \\frac{0.130455}{0.2} = 0.6523",
      },
      {
        text: "Payoffs de la call al vencimiento: si sube, máx(22−21,0) = 1; si baja, máx(18−21,0) = 0.",
        tex: "f_u = 1, \\quad f_d = 0",
      },
      {
        text: "Valor esperado risk-neutral descontado.",
        tex: "f = e^{-rT}\\,[\\,p f_u + (1-p) f_d\\,]",
      },
      {
        text: "Reemplazamos.",
        tex: "f = e^{-0.12 \\times 0.25}(0.6523 \\times 1) = 0.97045 \\times 0.6523 = 0.633",
      },
    ],
    answer: "c ≈ $0.633",
  },
  {
    id: "binomial-2step-1",
    topic: "Binomial",
    hull: "Hull 13.6",
    title: "Árbol binomial de 2 pasos (call europea)",
    statement:
      "Una acción vale $20. En cada uno de dos pasos de 3 meses puede subir 10% o bajar 10% (u = 1.1, d = 0.9). La tasa libre de riesgo es 12% continua. Valuá una call europea con strike $21 y vencimiento a 6 meses.",
    givens: ["S₀ = 20", "u = 1.1", "d = 0.9", "K = 21", "cada paso = 0.25 años", "r = 12%"],
    steps: [
      {
        text: "Probabilidad risk-neutral por paso (Δt = 0.25).",
        tex: "p = \\frac{e^{0.12 \\times 0.25} - 0.9}{1.1 - 0.9} = 0.6523",
      },
      {
        text: "Nodos finales: uu = 20·1.1² = 24.2; ud = 20·1.1·0.9 = 19.8; dd = 20·0.9² = 16.2.",
        tex: "S_{uu}=24.2,\\; S_{ud}=19.8,\\; S_{dd}=16.2",
      },
      {
        text: "Payoffs de la call (K = 21): sólo el nodo uu queda in-the-money.",
        tex: "f_{uu}=3.2,\\; f_{ud}=0,\\; f_{dd}=0",
      },
      {
        text: "Valor en el nodo superior intermedio descontando un paso.",
        tex: "f_u = e^{-0.03}[\\,0.6523 \\times 3.2 + 0.3477 \\times 0\\,] = 0.97045 \\times 2.0874 = 2.0258",
      },
      {
        text: "El nodo inferior intermedio vale 0 (ambos hijos pagan 0).",
        tex: "f_d = 0",
      },
      {
        text: "Descontamos un paso más desde la raíz.",
        tex: "f = e^{-0.03}[\\,0.6523 \\times 2.0258 + 0.3477 \\times 0\\,] = 0.97045 \\times 1.3214 = 1.2823",
      },
    ],
    answer: "c ≈ $1.28",
  },
  {
    id: "bs-call-put-1",
    topic: "Black-Scholes",
    hull: "Hull 14.6",
    title: "Black-Scholes: call y put europeos (caso canónico)",
    statement:
      "Valuá una call y un put europeos sobre una acción sin dividendos usando Black-Scholes. La acción vale $42, el strike es $40, faltan 6 meses, la tasa libre de riesgo es 10% continua y la volatilidad es 20% anual.",
    givens: ["S₀ = 42", "K = 40", "T = 0.5 años", "r = 10%", "σ = 20%"],
    steps: [
      {
        text: "Calculamos d₁.",
        tex: "d_1 = \\frac{\\ln(S_0/K)+(r+\\sigma^2/2)T}{\\sigma\\sqrt{T}}",
      },
      {
        text: "Reemplazamos: ln(42/40) = 0.04879; (0.10 + 0.02)·0.5 = 0.06; σ√T = 0.2·0.7071 = 0.14142.",
        tex: "d_1 = \\frac{0.04879 + 0.06}{0.14142} = 0.7693",
      },
      {
        text: "Obtenemos d₂.",
        tex: "d_2 = d_1 - \\sigma\\sqrt{T} = 0.7693 - 0.1414 = 0.6278",
      },
      {
        text: "De la tabla normal: N(d₁) = 0.7791 y N(d₂) = 0.7349.",
        tex: "N(d_1)=0.7791,\\quad N(d_2)=0.7349",
      },
      {
        text: "Precio de la call.",
        tex: "c = S_0 N(d_1) - K e^{-rT} N(d_2)",
      },
      {
        text: "Reemplazamos: 42·0.7791 − 40·e^(−0.05)·0.7349 = 32.722 − 27.963 = 4.759.",
        tex: "c = 4.7594",
      },
      {
        text: "Precio del put por paridad o por fórmula directa.",
        tex: "p = K e^{-rT} N(-d_2) - S_0 N(-d_1) = 0.8086",
      },
    ],
    answer: "c = $4.7594, p = $0.8086",
  },
  {
    id: "greeks-delta-gamma-1",
    topic: "Griegas",
    hull: "Hull 19",
    title: "Delta y gamma de la call de Hull 14.6",
    statement:
      "Para la misma call europea del caso 14.6 (S₀ = 42, K = 40, T = 0.5, r = 10%, σ = 20%), calculá el delta y el gamma.",
    givens: ["S₀ = 42", "K = 40", "T = 0.5", "r = 10%", "σ = 20%", "d₁ = 0.7693"],
    steps: [
      {
        text: "El delta de una call sin dividendos es directamente N(d₁).",
        tex: "\\Delta = N(d_1)",
      },
      {
        text: "Con d₁ = 0.7693 de la tabla normal.",
        tex: "\\Delta = N(0.7693) = 0.779",
      },
      {
        text: "El gamma usa la densidad normal estándar N'(d₁).",
        tex: "\\Gamma = \\frac{N'(d_1)}{S_0 \\, \\sigma \\sqrt{T}}",
      },
      {
        text: "Densidad en d₁: N'(0.7693) = (1/√(2π))·e^(−0.7693²/2) = 0.2967.",
        tex: "N'(d_1) = \\frac{1}{\\sqrt{2\\pi}} e^{-d_1^2/2} = 0.2967",
      },
      {
        text: "Denominador: S₀·σ·√T = 42·0.2·0.7071 = 5.940.",
        tex: "S_0 \\sigma \\sqrt{T} = 5.940",
      },
      {
        text: "Dividimos.",
        tex: "\\Gamma = \\frac{0.2967}{5.940} = 0.0500",
      },
    ],
    answer: "Δ ≈ 0.779, Γ ≈ 0.0500",
  },
  {
    id: "bull-call-spread-1",
    topic: "Estrategias",
    hull: "Hull 12.2",
    title: "Bull call spread: payoff y breakeven",
    statement:
      "Un inversor arma un bull call spread comprando una call con strike $30 a $3 y vendiendo una call con strike $35 a $1, ambas sobre la misma acción y vencimiento. Calculá el costo neto, la ganancia máxima, la pérdida máxima y el precio de breakeven.",
    givens: ["Compra call K₁ = 30 a c₁ = 3", "Vende call K₂ = 35 a c₂ = 1"],
    steps: [
      {
        text: "El costo neto (débito) es la prima pagada menos la cobrada.",
        tex: "\\text{Costo} = c_1 - c_2 = 3 - 1 = 2",
      },
      {
        text: "La ganancia máxima ocurre si S_T ≥ 35: el spread paga (K₂ − K₁) y se descuenta el costo.",
        tex: "\\text{Gan. máx} = (K_2 - K_1) - \\text{Costo} = 5 - 2 = 3",
      },
      {
        text: "La pérdida máxima ocurre si S_T ≤ 30: ambas calls expiran sin valor y se pierde el débito.",
        tex: "\\text{Pérd. máx} = \\text{Costo} = 2",
      },
      {
        text: "El breakeven es el strike comprado más el costo neto.",
        tex: "S_{BE} = K_1 + \\text{Costo} = 30 + 2 = 32",
      },
    ],
    answer: "Costo = $2; ganancia máx = $3; pérdida máx = $2; breakeven = $32",
  },
  {
    id: "hedge-contracts-1",
    topic: "Coberturas",
    hull: "Hull 3.5",
    title: "Número de contratos de futuros para cubrir una cartera",
    statement:
      "Un gestor tiene una cartera de acciones valuada en $5,050,000 con beta 1.5. Quiere cubrirla completamente durante 3 meses usando futuros sobre el índice S&P 500. El índice cotiza a 1010 puntos y cada contrato es por 250 veces el índice. ¿Cuántos contratos debe vender?",
    givens: [
      "Valor cartera P = $5,050,000",
      "β = 1.5",
      "Índice = 1010",
      "Multiplicador = $250",
    ],
    steps: [
      {
        text: "El valor de un contrato de futuros es el nivel del índice por el multiplicador.",
        tex: "A = 250 \\times 1010 = 252{,}500",
      },
      {
        text: "El número de contratos para cubrir (beta a 0) escala por el beta de la cartera.",
        tex: "N = \\beta \\, \\frac{P}{A}",
      },
      {
        text: "Reemplazamos.",
        tex: "N = 1.5 \\times \\frac{5{,}050{,}000}{252{,}500}",
      },
      {
        text: "Calculamos.",
        tex: "N = 1.5 \\times 20 = 30",
      },
    ],
    answer: "Vender 30 contratos del S&P 500",
  },
];
