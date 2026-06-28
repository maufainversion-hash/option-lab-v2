// Mazo de flashcards para repaso activo. front = pregunta/concepto, back = respuesta,
// tex = fórmula clave (KaTeX). Agrupadas por tema.
export interface Flashcard {
  topic: string;
  front: string;
  back: string;
  tex?: string;
}

export const TOPICS = [
  "Forwards y futuros",
  "Tasas y FRAs",
  "Swaps",
  "Paridad y cotas",
  "Black-Scholes",
  "Griegas",
  "Binomial",
  "Monte Carlo",
  "Estrategias",
] as const;

export const FLASHCARDS: Flashcard[] = [
  // ── Forwards y futuros ──
  { topic: "Forwards y futuros", front: "Precio forward de un activo sin income", back: "Capitalizás el spot a la tasa libre de riesgo hasta T.", tex: "F_0 = S_0 e^{rT}" },
  { topic: "Forwards y futuros", front: "Precio forward con income conocido I (VP de los flujos)", back: "Le restás el valor presente del income antes de capitalizar.", tex: "F_0 = (S_0 - I)\\,e^{rT}" },
  { topic: "Forwards y futuros", front: "Precio forward con dividend/convenience yield continuo q", back: "Capitalizás a la tasa neta r − q.", tex: "F_0 = S_0 e^{(r-q)T}" },
  { topic: "Forwards y futuros", front: "Valor de un forward ya pactado a precio K", back: "Diferencia entre el forward actual y el pactado, descontada.", tex: "f = (F_0 - K)\\,e^{-rT}" },
  { topic: "Forwards y futuros", front: "Forward de una moneda (tasa doméstica r, foránea r_f)", back: "Interest rate parity (cubierta).", tex: "F_0 = S_0 e^{(r - r_f)T}" },
  { topic: "Forwards y futuros", front: "Contango vs backwardation", back: "Contango: F₀ > S₀ (futuro por encima del spot). Backwardation: F₀ < S₀.", tex: "F_0 \\gtrless S_0" },
  { topic: "Forwards y futuros", front: "¿Por qué F₀ = E[S_T] no se cumple en general?", back: "El forward se valúa por no-arbitraje (cost of carry), no por la expectativa física; coinciden solo bajo riesgo-neutralidad y r=μ." },

  // ── Tasas y FRAs ──
  { topic: "Tasas y FRAs", front: "Convertir tasa compuesta m veces a continua", back: "Tasa continua equivalente.", tex: "R_c = m\\ln\\!\\left(1 + \\tfrac{R_m}{m}\\right)" },
  { topic: "Tasas y FRAs", front: "Convertir continua a compuesta m veces", back: "Inversa de la anterior.", tex: "R_m = m\\left(e^{R_c/m} - 1\\right)" },
  { topic: "Tasas y FRAs", front: "Forward rate entre T₁ y T₂ (tasas cero continuas)", back: "De la tasa cero R₁ hasta T₁ y R₂ hasta T₂.", tex: "R_f = \\frac{R_2 T_2 - R_1 T_1}{T_2 - T_1}" },
  { topic: "Tasas y FRAs", front: "Valor de un FRA (recibís fija R_K, T₁→T₂)", back: "Compara la fija pactada contra la forward, descontada a hoy.", tex: "V = L\\,(R_K - R_f)(T_2 - T_1)\\,e^{-R_2 T_2}" },
  { topic: "Tasas y FRAs", front: "Duración modificada — sensibilidad del bono", back: "Cambio porcentual del precio ante un Δy en la tasa.", tex: "\\frac{\\Delta B}{B} \\approx -D^*\\,\\Delta y" },

  // ── Swaps ──
  { topic: "Swaps", front: "Valor de un IRS por el enfoque de bonos (recibís fija)", back: "Bono de tasa fija menos bono flotante.", tex: "V_{swap} = B_{fix} - B_{fl}" },
  { topic: "Swaps", front: "Valor del bono flotante justo en una fecha de reset", back: "Vale a la par (nominal L), porque el cupón se reajusta al mercado.", tex: "B_{fl} = L" },
  { topic: "Swaps", front: "IRS como cartera de FRAs", back: "El valor del swap es la suma de los valores de los FRAs de cada período de intercambio." },

  // ── Paridad y cotas ──
  { topic: "Paridad y cotas", front: "Put-call parity (europeas, dividend yield q)", back: "Call + bono = Put + acción (descontada).", tex: "c + K e^{-rT} = p + S_0 e^{-qT}" },
  { topic: "Paridad y cotas", front: "Despejar el put desde la parity", back: "Call sintético/put sintético por no-arbitraje.", tex: "p = c + K e^{-rT} - S_0 e^{-qT}" },
  { topic: "Paridad y cotas", front: "Cota inferior de un call europeo (con q)", back: "Nunca menor al forward intrínseco descontado, ni negativo.", tex: "c \\ge \\max\\!\\left(S_0 e^{-qT} - K e^{-rT},\\,0\\right)" },
  { topic: "Paridad y cotas", front: "Cota inferior de un put europeo", back: "Simétrica a la del call.", tex: "p \\ge \\max\\!\\left(K e^{-rT} - S_0 e^{-qT},\\,0\\right)" },
  { topic: "Paridad y cotas", front: "¿Conviene ejercer temprano un call americano sin dividendos?", back: "No, nunca: el valor temporal y el ahorro de pagar K más tarde lo hacen valer más vivo que ejercido. Con dividendos grandes puede convenir justo antes del ex-date." },
  { topic: "Paridad y cotas", front: "¿Y un put americano?", back: "Sí puede convenir si está muy ITM: ejercés, cobrás K y lo reinvertís a la tasa (perderías ese interés esperando)." },

  // ── Black-Scholes ──
  { topic: "Black-Scholes", front: "Precio de un call (BSM con dividend yield q)", back: "Acción descontada × N(d₁) menos strike descontado × N(d₂).", tex: "c = S_0 e^{-qT} N(d_1) - K e^{-rT} N(d_2)" },
  { topic: "Black-Scholes", front: "Precio de un put (BSM)", back: "Simétrico, con −d.", tex: "p = K e^{-rT} N(-d_2) - S_0 e^{-qT} N(-d_1)" },
  { topic: "Black-Scholes", front: "d₁ y d₂", back: "d₂ está a un √T·σ de d₁.", tex: "d_1 = \\frac{\\ln(S_0/K)+(r-q+\\sigma^2/2)T}{\\sigma\\sqrt{T}},\\quad d_2 = d_1 - \\sigma\\sqrt{T}" },
  { topic: "Black-Scholes", front: "Interpretación de N(d₂)", back: "Probabilidad (bajo la medida risk-neutral Q) de que el call termine ITM, es decir P(S_T > K)." },
  { topic: "Black-Scholes", front: "¿Por qué el drift real μ no aparece en el precio?", back: "Porque se valúa bajo la medida risk-neutral, donde el drift es r − q. El hedging perfecto elimina la dependencia de μ (Cap 14)." },
  { topic: "Black-Scholes", front: "Modelo de Black (opciones sobre futuros)", back: "Igual a BSM pero el subyacente es el futuro F₀ y se descuenta todo a r.", tex: "c = e^{-rT}\\big[F_0 N(d_1) - K N(d_2)\\big]" },

  // ── Griegas ──
  { topic: "Griegas", front: "Delta de un call (con q)", back: "Sensibilidad al spot; ∈ (0,1) para el call.", tex: "\\Delta_{call} = e^{-qT} N(d_1)" },
  { topic: "Griegas", front: "Delta de un put", back: "∈ (−1,0).", tex: "\\Delta_{put} = e^{-qT}\\big(N(d_1) - 1\\big)" },
  { topic: "Griegas", front: "Gamma (igual para call y put)", back: "Convexidad: cuánto cambia delta. Máxima en ATM cerca del vencimiento.", tex: "\\Gamma = \\frac{e^{-qT} N'(d_1)}{S_0\\,\\sigma\\sqrt{T}}" },
  { topic: "Griegas", front: "Vega (igual para call y put)", back: "Sensibilidad a la volatilidad. Siempre positiva para opciones largas.", tex: "\\nu = S_0 e^{-qT} N'(d_1)\\sqrt{T}" },
  { topic: "Griegas", front: "Signo de theta para una opción larga", back: "Negativa (perdés valor temporal con el paso del tiempo), salvo casos raros de puts muy ITM." },
  { topic: "Griegas", front: "Relación gamma–theta (cartera delta-neutral)", back: "Si sos largo gamma, sos corto theta y viceversa: la convexidad se 'paga' con decay.", tex: "\\Theta + \\tfrac{1}{2}\\sigma^2 S^2 \\Gamma = r\\Pi" },
  { topic: "Griegas", front: "¿Qué es delta-hedging?", back: "Neutralizar la exposición al spot tomando −Δ unidades del subyacente por opción; hay que rebalancear porque delta cambia (gamma)." },

  // ── Binomial ──
  { topic: "Binomial", front: "Factores up/down en CRR", back: "Calibrados a la volatilidad.", tex: "u = e^{\\sigma\\sqrt{\\Delta t}},\\quad d = 1/u" },
  { topic: "Binomial", front: "Probabilidad risk-neutral p", back: "La que hace que el subyacente rinda la tasa libre bajo Q.", tex: "p = \\frac{e^{(r-q)\\Delta t} - d}{u - d}" },
  { topic: "Binomial", front: "Valuación risk-neutral (un paso)", back: "Esperanza risk-neutral del payoff, descontada.", tex: "f = e^{-r\\Delta t}\\big[p f_u + (1-p) f_d\\big]" },
  { topic: "Binomial", front: "¿Cómo se valúan americanas en el árbol?", back: "En cada nodo tomás el máximo entre el valor de continuación y el valor intrínseco de ejercer ahí." },
  { topic: "Binomial", front: "CRR vs Leisen-Reimer", back: "CRR oscila alrededor de BS y converge lento (~1/n); LR converge rápido y casi monótono con pocos pasos." },

  // ── Monte Carlo ──
  { topic: "Monte Carlo", front: "Solución de GBM para S_T", back: "Log-normal: drift menos ½σ² más el shock.", tex: "S_T = S_0\\,e^{(\\mu - \\sigma^2/2)T + \\sigma\\sqrt{T}\\,Z}" },
  { topic: "Monte Carlo", front: "Estimador Monte Carlo de una opción europea", back: "Promedio descontado de los payoffs simulados bajo Q (μ = r − q).", tex: "\\hat{f} = e^{-rT}\\,\\frac{1}{N}\\sum_{i=1}^{N}\\text{payoff}(S_T^{(i)})" },
  { topic: "Monte Carlo", front: "¿Cómo converge el error de Monte Carlo?", back: "Como 1/√N: para reducir el error a la mitad necesitás 4× los paths. Antithetic variates ayudan a bajar la varianza.", tex: "\\text{SE} = \\frac{\\sigma_{payoff}}{\\sqrt{N}}" },

  // ── Estrategias ──
  { topic: "Estrategias", front: "Bull call spread — máx ganancia y pérdida", back: "Ganancia = (Khigh − Klow) − costo neto; pérdida = costo neto.", tex: "\\text{máx} = (K_{high}-K_{low}) - c_{net}" },
  { topic: "Estrategias", front: "Long straddle — breakevens", back: "El spot tiene que moverse más que la suma de premios.", tex: "K \\pm (c + p)" },
  { topic: "Estrategias", front: "¿Cuándo un straddle?", back: "Esperás un movimiento grande sin saber la dirección (earnings, eventos). Sos largo de volatilidad." },
  { topic: "Estrategias", front: "Covered call — ¿para qué?", back: "Tenés la acción y vendés un call OTM para generar income; ideal en mercado lateral o levemente alcista. Techo en K." },
  { topic: "Estrategias", front: "Iron condor — ¿para qué?", back: "Cobrás prima (crédito) apostando a que el subyacente queda dentro de un rango. Vender volatilidad con pérdida limitada." },
  { topic: "Estrategias", front: "Protective put — ¿para qué?", back: "Acción + put como seguro: fija un piso en K a costa del premium, manteniendo el potencial alcista." },
];
