import Link from "next/link";
import { UnitShell } from "@/components/learn/UnitShell";
import {
  Prose,
  Lead,
  Section,
  Sub,
  Eq,
  K,
  Note,
  DataTable,
  Example,
} from "@/components/learn/content";

export default function Page() {
  return (
    <UnitShell slug="u6-binomial">
      <Prose>
        <Lead>
          El binomial es el capítulo más difícil de Hull, pero también el más
          conceptual: muestra de dónde sale el pricing de opciones sin necesidad
          de cálculo estocástico. La idea central —valuación{" "}
          <span className="text-text">risk-neutral</span>— es la misma que
          después reaparece en Black-Scholes. Cap 13 (binomial), 14 (procesos de
          Wiener y GBM) y 15 (BSM y la interpretación de N(d₁)/N(d₂)).
        </Lead>

        {/* ============================================================ */}
        <Section id="un-paso" title="Árbol de un paso (la intuición)">
          <p>
            Partimos del caso más simple (Hull 13.1). El subyacente{" "}
            <span className="text-text">S</span> puede subir a <K tex={"S\\cdot u"} />{" "}
            o bajar a <K tex={"S\\cdot d"} /> en un único período. Un call paga{" "}
            <K tex={"f_u = \\max(Su - K, 0)"} /> si sube ó{" "}
            <K tex={"f_d = \\max(Sd - K, 0)"} /> si baja.
          </p>
          <p>
            Construimos un portfolio <span className="text-text">risk-free</span>:
            long Δ acciones, short 1 call. Para que el valor del portfolio sea el
            mismo suba o baje el subyacente (sin incertidumbre), elegimos:
          </p>
          <Eq tex={"\\Delta = \\frac{f_u - f_d}{Su - Sd}"} />
          <p>
            Como el portfolio no tiene riesgo, debe rendir la tasa libre. Su valor
            hoy descontado iguala su valor futuro garantizado:
          </p>
          <Eq tex={"\\Delta S - f = (\\Delta Su - f_u)\\,e^{-rT}"} />
          <p>De ahí, despejando, sale la <span className="text-text">fórmula risk-neutral</span>:</p>
          <Eq tex={"f = e^{-rT}\\left[p\\,f_u + (1-p)\\,f_d\\right], \\qquad p = \\frac{e^{rT} - d}{u - d}"} />
          <Note kind="key" title="El punto clave del capítulo">
            <p>
              <span className="text-text">p no es la probabilidad real</span> de
              que el subyacente suba. Es la <span className="text-text">probabilidad
              risk-neutral</span>: la que hace que valuar la opción descontando a la
              tasa libre dé el mismo precio que el argumento de no-arbitraje
              (replicating portfolio). La drift real del activo nunca entra en el
              pricing.
            </p>
          </Note>
          <Note kind="hull" title="Hull Ejemplo 13.1">
            <p>
              S = $20, u = 1.1, d = 0.9, K = $21, r = 12%, T = 3 meses ⟶ C ≈{" "}
              <span className="text-text">$0.633</span>.
            </p>
          </Note>
          <p className="text-[13.5px]">
            Probá distintos u, d, S, K y mirá cómo se mueve el árbol y el precio en
            el <Link href="/binomial" className="text-brass hover:underline">laboratorio binomial</Link>.
          </p>

          <Sub>Ejemplo del docente: S=41, K=40 (los dos métodos lado a lado)</Sub>
          <p>
            El mismo problema resuelto con <span className="text-text">dos
            métodos</span> para mostrar que arbitraje (replicating portfolio) y
            valuación risk-neutral dan idéntico precio. Parámetros: S₀ = $41, K =
            $40 (call europeo), T = 1 año, r = 8% continua, con Su = $60 y Sd = $30.
          </p>

          <Example title="Método 1 · Replicating portfolio">
            <p>
              <span className="text-text">Idea:</span> replicar el payoff del call
              con Δ acciones + B en un bono libre de riesgo.
            </p>
            <p>
              Payoffs: si sube <K tex={"C_u = \\max(60-40,0) = 20"} />; si baja{" "}
              <K tex={"C_d = \\max(30-40,0) = 0"} />.
            </p>
            <p>Sistema de ecuaciones:</p>
            <Eq tex={"\\begin{cases}\\Delta\\cdot 60 + B\\,e^{0.08} = 20 \\\\ \\Delta\\cdot 30 + B\\,e^{0.08} = 0\\end{cases}"} />
            <Eq tex={"\\Delta = \\frac{C_u - C_d}{S_u - S_d} = \\frac{20 - 0}{60 - 30} = \\frac{2}{3}"} />
            <Eq tex={"B = -\\frac{S_d\\,\\Delta}{e^{rT}} = -\\frac{30\\times(2/3)}{e^{0.08}} = -18.4616"} />
            <p>
              Precio del call:{" "}
              <K tex={"C_0 = \\Delta\\,S_0 + B = (2/3)\\times 41 - 18.4616 = 8.8718"} />.
            </p>
          </Example>

          <Example title="Método 2 · Risk-neutral valuation">
            <p>
              <span className="text-text">Idea:</span> calcular el valor esperado del
              payoff bajo la probabilidad neutral al riesgo.
            </p>
            <p>
              Factores: <K tex={"u = S_u/S_0 = 60/41 = 1.4634"} /> y{" "}
              <K tex={"d = S_d/S_0 = 30/41 = 0.7317"} />.
            </p>
            <p>Probabilidad risk-neutral:</p>
            <Eq tex={"p = \\frac{e^{rT} - d}{u - d} = \\frac{e^{0.08} - 0.7317}{1.4634 - 0.7317} = 0.4805"} />
            <p>Valor esperado descontado:</p>
            <Eq tex={"C_0 = e^{-rT}\\left[p\\,C_u + (1-p)\\,C_d\\right] = e^{-0.08}\\left[0.4805\\times 20 + 0.5195\\times 0\\right] = 8.8718"} />
          </Example>

          <Note kind="success" title="Ambos métodos dan el mismo precio">
            <p>
              C₀ = $8.8718 por las dos vías. Esto demuestra la equivalencia
              conceptual entre arbitraje y valuación risk-neutral.{" "}
              <span className="text-text">Para el examen:</span> el docente puede
              pedir cualquiera de los dos métodos, o ambos. Dominá los dos.
            </p>
          </Note>
        </Section>

        {/* ============================================================ */}
        <Section id="n-pasos" title="Árbol de n pasos">
          <p>
            Para que el árbol matchee una volatilidad <K tex={"\\sigma"} /> dada,
            Hull (13.10) usa la calibración de Cox-Ross-Rubinstein (CRR):
          </p>
          <Eq tex={"u = e^{\\sigma\\sqrt{\\Delta t}}, \\qquad d = \\frac{1}{u}, \\qquad p = \\frac{e^{r\\Delta t} - d}{u - d}"} />
          <p>
            <span className="text-text">Inducción backward:</span> se valúa de
            atrás hacia adelante. En cada nodo no terminal,
          </p>
          <Eq tex={"f = e^{-r\\Delta t}\\left[p\\,f_u + (1-p)\\,f_d\\right]"} />
          <p>
            Para opciones <span className="text-text">americanas</span>, en cada
            nodo se compara el valor de continuación con el valor intrínseco de
            ejercer ahora y se toma el máximo:{" "}
            <K tex={"f = \\max\\big(\\text{continuación},\\ \\text{intrínseco}\\big)"} />.
          </p>
          <Note kind="info" title="CRR vs Leisen-Reimer">
            <p>
              El árbol CRR converge al precio Black-Scholes oscilando a medida que
              crece n. El método <span className="text-text">Leisen-Reimer</span>{" "}
              (con n impar) converge mucho más rápido y suave, por eso se usa en la
              práctica para pocas pasos.
            </p>
          </Note>
          <Sub>Convergencia</Sub>
          <p>
            A medida que <K tex={"n \\to \\infty"} />, el árbol binomial converge al
            precio de Black-Scholes-Merton (para europeas). CRR oscila alrededor del
            valor BSM; Leisen-Reimer lo aproxima casi exactamente con pocos pasos.
            Para americanas no hay fórmula cerrada de referencia: el binomial{" "}
            <span className="text-text">es</span> el método.
          </p>
          <p className="text-[13.5px]">
            Construí árboles de n pasos, alterná europea/americana y mirá la curva de
            convergencia CRR vs Leisen-Reimer vs BSM en el{" "}
            <Link href="/binomial" className="text-brass hover:underline">laboratorio binomial</Link>.
          </p>
        </Section>

        {/* ============================================================ */}
        <Section id="gbm" title="GBM y los procesos de Wiener (Cap 14)">
          <p>
            El <span className="text-text">Geometric Brownian Motion</span> (Hull
            14.3) es el modelo del subyacente bajo la medida risk-neutral:
          </p>
          <Eq tex={"dS = (r - q)\\,S\\,dt + \\sigma S\\,dW"} />
          <p>
            donde <K tex={"dW"} /> es un proceso de Wiener (movimiento browniano).
            Tiene solución cerrada:
          </p>
          <Eq tex={"S_T = S_0 \\cdot \\exp\\!\\left[\\left(r - q - \\tfrac{1}{2}\\sigma^2\\right)T + \\sigma\\sqrt{T}\\,Z\\right], \\qquad Z \\sim N(0,1)"} />
          <Note kind="key" title="Por qué μ no aparece">
            <p>
              La <span className="text-text">drift real</span> de la acción (μ){" "}
              <span className="text-text">no aparece</span> en el pricing: bajo la
              medida risk-neutral todo activo rinde la tasa libre r. Este es el
              corazón del no-arbitrage pricing y la razón de que el precio de la
              opción no dependa de la expectativa de retorno del subyacente.
            </p>
          </Note>
          <p>
            La distribución terminal de <K tex={"S_T"} /> es{" "}
            <span className="text-text">lognormal</span>, con valor esperado{" "}
            <K tex={"\\mathbb{E}[S_T] = S_0\\,e^{(r-q)T}"} />.
          </p>
          <p className="text-[13.5px]">
            Simulá paths de GBM y la distribución terminal lognormal en el{" "}
            <Link href="/montecarlo" className="text-brass hover:underline">laboratorio Monte Carlo</Link>.
          </p>
        </Section>

        {/* ============================================================ */}
        <Section id="bsm" title="Black-Scholes-Merton: N(d₁) y N(d₂) (Cap 15)">
          <p>
            El modelo BSM supone que el subyacente sigue un GBM bajo la medida
            risk-neutral <K tex={"\\mathbb{Q}"} />, y deriva el precio de una opción
            europea como el <span className="text-text">valor esperado descontado</span>{" "}
            del payoff bajo esa medida. Las dos fórmulas:
          </p>
          <Eq tex={"c = S_0\\,e^{-qT}\\,N(d_1) \\;-\\; K\\,e^{-rT}\\,N(d_2)"} />
          <Eq tex={"p = K\\,e^{-rT}\\,N(-d_2) \\;-\\; S_0\\,e^{-qT}\\,N(-d_1)"} />
          <p>con</p>
          <Eq tex={"d_1 = \\frac{\\ln(S_0/K) + (r - q + \\tfrac{1}{2}\\sigma^2)\\,T}{\\sigma\\sqrt{T}}, \\qquad d_2 = d_1 - \\sigma\\sqrt{T}"} />

          <Sub>Descomposición del call en sus 4 piezas</Sub>
          <p>
            La fórmula del call es producto de cuatro componentes con significado
            propio:
          </p>
          <DataTable
            headers={["Pieza", "Significado"]}
            rows={[
              [<K key="a" tex={"S_0\\,e^{-qT}"} />, "Spot ajustado por dividendos."],
              [<K key="b" tex={"N(d_1)"} />, "Delta del call: fracción del subyacente a mantener para replicar."],
              [<K key="c" tex={"K\\,e^{-rT}"} />, "Strike descontado a hoy."],
              [<K key="d" tex={"N(d_2)"} />, "Probabilidad risk-neutral de ejercer (terminar ITM)."],
            ]}
          />

          <Note kind="hull" title="Hull Ejemplo 14.6">
            <p>
              S₀ = 42, K = 40, T = 0.5, r = 10%, σ = 20%, q = 0. Valores esperados:{" "}
              <span className="text-text">d₁ = 0.7693</span>,{" "}
              <span className="text-text">d₂ = 0.6278</span>,{" "}
              <span className="text-text">Call = 4.7594</span>,{" "}
              <span className="text-text">Put = 0.8086</span>.
            </p>
          </Note>

          <Sub>Interpretación de cada pieza (Nielsen 1992)</Sub>
          <Note kind="success" title="N(d₁) — la delta">
            <p>
              Es la <span className="text-text">fracción del subyacente</span> que
              necesitás mantener para replicar el call (hedge ratio). También es la
              probabilidad de ejercicio bajo la medida en la que el numerario es el
              stock (no el cash). Va de 0 (deep OTM) a 1 (deep ITM).
            </p>
          </Note>
          <Note kind="info" title="N(d₂) — la probabilidad">
            <p>
              Es la <span className="text-text">probabilidad risk-neutral</span> de
              que el call termine ITM: <K tex={"N(d_2) = \\mathbb{P}^{\\mathbb{Q}}(S_T > K)"} />.
              Es la probabilidad bajo la medida <K tex={"\\mathbb{Q}"} /> donde todos
              los activos rinden la tasa libre r, NO bajo la medida del mundo real.
              Siempre <K tex={"N(d_1) \\ge N(d_2)"} /> porque <K tex={"d_1 \\ge d_2"} />.
            </p>
          </Note>

          <Sub>Derivación step-by-step del PDE de BSM (Hull 15.6)</Sub>
          <p><span className="text-text">Paso 1.</span> Modelo del subyacente bajo la medida real <K tex={"\\mathbb{P}"} />:</p>
          <Eq tex={"dS = \\mu S\\,dt + \\sigma S\\,dz"} />
          <p><span className="text-text">Paso 2.</span> Construir un portfolio sin riesgo: long Δ acciones, short 1 call.</p>
          <Eq tex={"\\Pi = -c + \\Delta\\cdot S"} />
          <p>Aplicando Itô a <K tex={"c(S,t)"} />:</p>
          <Eq tex={"dc = \\left(\\frac{\\partial c}{\\partial t} + \\mu S\\frac{\\partial c}{\\partial S} + \\tfrac{1}{2}\\sigma^2 S^2\\frac{\\partial^2 c}{\\partial S^2}\\right)dt + \\sigma S\\frac{\\partial c}{\\partial S}\\,dz"} />
          <p><span className="text-text">Paso 3.</span> Elegir <K tex={"\\Delta = \\partial c/\\partial S"} /> para cancelar el término estocástico (dz):</p>
          <Eq tex={"d\\Pi = \\left(-\\frac{\\partial c}{\\partial t} - \\tfrac{1}{2}\\sigma^2 S^2\\frac{\\partial^2 c}{\\partial S^2}\\right)dt"} />
          <p><span className="text-text">Paso 4.</span> Como Π es libre de riesgo, debe rendir r:</p>
          <Eq tex={"d\\Pi = r\\Pi\\,dt = r\\left(-c + S\\frac{\\partial c}{\\partial S}\\right)dt"} />
          <p><span className="text-text">Paso 5.</span> Igualando y reordenando, sale el PDE de BSM:</p>
          <Eq tex={"\\frac{\\partial c}{\\partial t} + rS\\frac{\\partial c}{\\partial S} + \\tfrac{1}{2}\\sigma^2 S^2\\frac{\\partial^2 c}{\\partial S^2} = rc"} />
          <p>
            <span className="text-text">Paso 6.</span> Condiciones de frontera (call
            europeo): <K tex={"c(S, T) = \\max(S - K, 0)"} />.
          </p>
          <p>
            <span className="text-text">Paso 7.</span> Solución del PDE vía cambio de
            variable a la ecuación del calor, o equivalentemente vía valuación
            risk-neutral:
          </p>
          <Eq tex={"c = e^{-rT}\\,\\mathbb{E}^{\\mathbb{Q}}\\!\\left[\\max(S_T - K, 0)\\right]"} />
          <p>
            Bajo <K tex={"\\mathbb{Q}"} />, <K tex={"S_T"} /> es lognormal con drift
            r (en lugar de μ). La integral cerrada de <K tex={"(S_T - K)^+"} /> contra
            la densidad lognormal da exactamente la fórmula de arriba: los dos
            términos vienen de partir la integral en{" "}
            <span className="text-text">"valor esperado de S_T dado ITM"</span> (que
            da <K tex={"S_0\\cdot N(d_1)"} />) y{" "}
            <span className="text-text">"K veces la probabilidad de ITM"</span> (que
            da <K tex={"K\\cdot e^{-rT}\\cdot N(d_2)"} />).
          </p>
          <p className="text-[13.5px]">
            Descomponé el precio en sus piezas y reproducí el Ejemplo 14.6 en el{" "}
            <Link href="/pricing" className="text-brass hover:underline">laboratorio de pricing</Link>.
          </p>
        </Section>

        {/* ============================================================ */}
        <Section id="formulario" title="Formulario (Cap 13-15)">
          <Sub>Binomial — probabilidad risk-neutral</Sub>
          <Eq tex={"p = \\frac{e^{(r-q)\\Delta t} - d}{u - d}"} />
          <Sub>Inducción backward</Sub>
          <Eq tex={"f = e^{-r\\Delta t}\\left[p\\,f_u + (1-p)\\,f_d\\right]"} />
          <Sub>Calibración CRR</Sub>
          <Eq tex={"u = e^{\\sigma\\sqrt{\\Delta t}} \\qquad d = \\tfrac{1}{u}"} />
          <Sub>Delta replicante (1 paso)</Sub>
          <Eq tex={"\\Delta = \\frac{f_u - f_d}{Su - Sd}"} />
          <Sub>GBM bajo medida risk-neutral</Sub>
          <Eq tex={"dS = (r-q)S\\,dt + \\sigma S\\,dW"} />
          <Sub>Black-Scholes-Merton</Sub>
          <Eq tex={"c = S_0\\,e^{-qT}\\,N(d_1) - K\\,e^{-rT}\\,N(d_2)"} />
          <Eq tex={"p = K\\,e^{-rT}\\,N(-d_2) - S_0\\,e^{-qT}\\,N(-d_1)"} />
          <Eq tex={"d_1 = \\frac{\\ln(S_0/K) + (r-q+\\tfrac{1}{2}\\sigma^2)T}{\\sigma\\sqrt{T}}, \\quad d_2 = d_1 - \\sigma\\sqrt{T}"} />
        </Section>
      </Prose>
    </UnitShell>
  );
}
