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
  Defs,
  Example,
} from "@/components/learn/content";

export default function Page() {
  return (
    <UnitShell slug="u5-opciones">
      <Prose>
        <Lead>
          Antes de cualquier modelo de pricing, el simple no-arbitraje ya nos dice
          mucho: cómo cada uno de los seis factores mueve el precio, entre qué cotas
          tiene que estar una opción, y la relación exacta entre call y put — la{" "}
          <span className="text-text">put-call parity</span>. También vemos cuándo
          conviene (y cuándo no) ejercer una opción americana temprano.
        </Lead>

        <Section id="conceptos" title="Conceptos básicos">
          <p>
            Una <span className="text-text">opción</span> es un contrato que da al
            comprador el derecho (no la obligación) de comprar (<span className="text-text">call</span>)
            o vender (<span className="text-text">put</span>) un activo subyacente a un
            precio fijo (strike <K tex={"K"} />) en o hasta una fecha (expiry <K tex={"T"} />).
            El <span className="text-text">vendedor</span> (writer) recibe un premium y
            queda obligado a cumplir si el comprador ejerce.
          </p>
          <p>Terminología clave (Hull Cap 9):</p>
          <Defs
            items={[
              {
                term: "In-the-Money (ITM)",
                desc: (
                  <>
                    El ejercicio ya tiene valor intrínseco. Call: <K tex={"S > K"} />. Put:{" "}
                    <K tex={"S < K"} />.
                  </>
                ),
              },
              { term: "At-the-Money (ATM)", desc: <K tex={"S \\approx K"} /> },
              {
                term: "Out-of-the-Money (OTM)",
                desc: (
                  <>
                    El ejercicio no tiene valor. Call: <K tex={"S < K"} />. Put:{" "}
                    <K tex={"S > K"} />.
                  </>
                ),
              },
              {
                term: "Europea vs Americana",
                desc: "Europea: solo ejercitable al vencimiento. Americana: en cualquier momento hasta T.",
              },
              {
                term: "Payoff al vencimiento",
                desc: (
                  <>
                    Lo que vale la opción al llegar <K tex={"T"} />. Call:{" "}
                    <K tex={"\\max(S_T - K, 0)"} />. Put: <K tex={"\\max(K - S_T, 0)"} />.
                  </>
                ),
              },
            ]}
          />
          <Note kind="info" title="Mercado argentino">
            BYMA lista mayormente opciones de tipo europeo sobre acciones líderes (GGAL,
            YPF, BMA, PAMP, etc.), con vencimientos cuatrimestrales (Feb, Abr, Jun, Ago,
            Oct, Dic).
          </Note>
          <p className="text-[13.5px] text-dim">
            Visualizá el payoff, breakeven y máx profit/loss de un long call/put en el{" "}
            <Link href="/strategies" className="text-brass underline-offset-2 hover:underline">
              lab de estrategias
            </Link>
            .
          </p>

          <Sub>Los 3 actores del mercado (Hull Cap 1)</Sub>
          <Defs
            items={[
              {
                term: "Hedger",
                desc: "Usa derivados para reducir el riesgo de una posición existente. Ej: importador argentino que tiene que pagar USD en 90 días compra futuro de dólar para fijar el costo.",
              },
              {
                term: "Especulador",
                desc: "Apuesta a una dirección. Compra opciones porque cree que el activo va a subir/bajar más de lo que el mercado pricea.",
              },
              {
                term: "Arbitrajista",
                desc: "Busca diferencias de precio que violen no-arbitraje y las captura. En AR: arbitraje CCL vs MEP, CEDEARs vs subyacente US, parity violations.",
              },
            ]}
          />
          <p>
            El <span className="text-text">forward</span> (Cap 5) es el primo simple del
            futuro: contrato bilateral, sin clearing, sin mark-to-market diario. El{" "}
            <span className="text-text">futuro</span> estandariza y agrega margen. Las{" "}
            <span className="text-text">opciones</span> son el siguiente nivel: introducen
            convexidad (gamma) y por eso necesitan modelos más sofisticados (Cap 12
            binomial, Cap 14 Black-Scholes).
          </p>
        </Section>

        <Section id="factores" title="Los 6 factores">
          <p>
            Seis variables determinan el precio de una opción europea sobre una acción.
            Para americanas se suma la cuestión del early exercise, pero las direcciones
            son las mismas. Esta es <span className="text-text">la tabla</span> que entra
            en el parcial:
          </p>
          <DataTable
            headers={["Factor", "Eur. Call", "Eur. Put", "Am. Call", "Am. Put"]}
            rows={[
              ["Spot (S₀)", "+", "−", "+", "−"],
              ["Strike (K)", "−", "+", "−", "+"],
              ["Tiempo (T)", "?", "?", "+", "+"],
              ["Volatilidad (σ)", "+", "+", "+", "+"],
              ["Tasa libre (r)", "+", "−", "+", "−"],
              ["Dividendos (D)", "−", "+", "−", "+"],
            ]}
          />
          <Note kind="key" title="Por qué el ?">
            Para opciones <span className="text-text">europeas</span>, más tiempo NO
            siempre es mejor: si hay dividendos grandes antes del expiry, podés perderte
            más drawdowns del spot (call) o más uplifts (put). Para americanas, más tiempo
            nunca puede ser peor — siempre podés ejercer hoy mismo si querés, así que{" "}
            <K tex={"T+1"} /> domina a <K tex={"T"} />.
          </Note>
          <p className="text-[13.5px] text-dim">
            Variá un factor a la vez y mirá el precio recalcularse en el{" "}
            <Link href="/pricing" className="text-brass underline-offset-2 hover:underline">
              pricing lab
            </Link>{" "}
            (base case: S=100, K=100, T=0.5, σ=25%, r=5%, q=0%).
          </p>

          <Sub>Por qué cada factor mueve el precio</Sub>
          <ul className="ml-5 list-disc space-y-2">
            <li>
              <span className="text-text">S₀</span>: el subyacente sube → el call gana
              valor intrínseco (<K tex={"S-K"} />), el put pierde. Directo.
            </li>
            <li>
              <span className="text-text">K</span>: a más strike, el call tiene menos
              chance de terminar ITM (<K tex={"S>K"} /> más difícil), y el put más (
              <K tex={"K>S"} /> más fácil).
            </li>
            <li>
              <span className="text-text">T</span>: para americanas, más tiempo = más
              optionality. Para europeas es ambiguo porque los dividendos pueden comerse
              esa ventaja de tiempo.
            </li>
            <li>
              <span className="text-text">σ</span>: vol más alta significa mayor varianza
              del payoff. Como las opciones tienen payoff <span className="text-text">truncado</span>{" "}
              (<K tex={"\\max(S-K,0)"} /> o <K tex={"\\max(K-S,0)"} />), más dispersión =
              más valor esperado. Aplica a calls y puts por igual.
            </li>
            <li>
              <span className="text-text">r</span>: más tasa → más caro tener cash, más
              barato diferir el pago de <K tex={"K"} /> (call). Para el put, más tasa = más
              caro tener short cash, así que el precio cae.
            </li>
            <li>
              <span className="text-text">D (dividendos)</span>: los pagos de dividendos
              reducen el spot ex-date. Calls pierden valor (S esperado más bajo), puts
              ganan.
            </li>
          </ul>
        </Section>

        <Section id="propiedades" title="Propiedades y put-call parity">
          <p>
            Sin asumir ningún modelo de pricing, el simple no-arbitraje nos da relaciones
            fuertes.
          </p>
          <Sub>Cotas para opciones europeas (Hull 10.1–10.5)</Sub>
          <Eq tex={"\\max\\!\\left(S_0 e^{-qT} - K e^{-rT},\\, 0\\right) \\leq c \\leq S_0 e^{-qT}"} />
          <Eq tex={"\\max\\!\\left(K e^{-rT} - S_0 e^{-qT},\\, 0\\right) \\leq p \\leq K e^{-rT}"} />

          <Sub>Put-Call Parity (Hull 10.6)</Sub>
          <Eq tex={"c + K e^{-rT} = p + S_0 e^{-qT}"} />
          <p>
            Si esta igualdad no se cumple, hay arbitraje: armás un portafolio sintético en
            el lado barato y vendés el lado caro.
          </p>
          <Note kind="info" title="Tasa implícita en el par call/put">
            En AR la tasa libre de riesgo oficial (BADLAR/TAMAR) no siempre refleja el
            funding real. Despejando <K tex={"r"} /> de la parity se obtiene la tasa que el
            mercado de opciones está priceando:
            <span className="mt-2 block">
              <Eq tex={"r = -\\frac{1}{T} \\ln\\!\\left(\\frac{S e^{-qT} - (C - P)}{K}\\right)"} />
            </span>
          </Note>
          <p className="text-[13.5px] text-dim">
            Verificá parity, cotas y tasa implícita con quotes reales en el{" "}
            <Link href="/parity" className="text-brass underline-offset-2 hover:underline">
              parity lab
            </Link>
            .
          </p>

          <Example title="Put-Call Parity — derivación formal (portfolios A y C)">
            <p>
              <span className="text-text">Demostración por arbitraje.</span> Probamos que
              para opciones europeas (sin dividendos):
            </p>
            <Eq tex={"c + K\\, e^{-rT} = p + S_0"} />
            <p>
              Construimos dos portfolios con <span className="text-text">mismo payoff</span>{" "}
              en <K tex={"t=T"} />. Si tienen el mismo payoff → deben tener el mismo precio
              hoy (ley de precio único).
            </p>
            <p>
              <span className="text-text">Portfolio A:</span> comprás un call europeo
              strike <K tex={"K"} /> + un zero-coupon bond que paga <K tex={"K"} /> en{" "}
              <K tex={"T"} />. Costo hoy: <K tex={"c + K\\, e^{-rT}"} />.
            </p>
            <p>
              <span className="text-text">Portfolio C:</span> comprás un put europeo strike{" "}
              <K tex={"K"} /> + una acción del subyacente. Costo hoy: <K tex={"p + S_0"} />.
            </p>
            <p>Payoffs en <K tex={"t=T"} /> — dos escenarios:</p>
            <DataTable
              headers={["Componente", "Si S_T > K", "Si S_T < K"]}
              rows={[
                ["Call", "S_T − K", "0"],
                ["Bond", "K", "K"],
                ["= Portfolio A", "S_T", "K"],
                ["Put", "0", "K − S_T"],
                ["Share", "S_T", "S_T"],
                ["= Portfolio C", "S_T", "K"],
              ]}
            />
            <Note kind="success" title="Conclusión">
              Ambos portfolios valen lo mismo en TODOS los escenarios (<K tex={"S_T"} /> si
              sube ITM, <K tex={"K"} /> si baja OTM). Por ley de precio único:{" "}
              <K tex={"c + K e^{-rT} = p + S_0"} />.
            </Note>
            <Note kind="info" title="Uso práctico">
              Si conocés <K tex={"c, S_0, K, r, T"} /> → despejás{" "}
              <K tex={"p = c + K e^{-rT} - S_0"} />. O creás un call sintético:{" "}
              <K tex={"c = p + S_0 - K e^{-rT}"} />. Si la relación no se cumple en el
              mercado, hay oportunidad de arbitraje.
            </Note>
          </Example>

          <Example title="American options — desigualdad de paridad">
            <p>
              Para americanas no hay igualdad exacta (por early exercise), pero sí
              desigualdades:
            </p>
            <Eq tex={"S_0 - K \\;\\leq\\; C - P \\;\\leq\\; S_0 - K\\, e^{-rT}"} />
            <ul className="ml-5 list-disc space-y-1">
              <li>Cota inferior: <K tex={"S_0 - K"} /> (intrinsic).</li>
              <li>Cota superior: <K tex={"S_0 - K e^{-rT}"} /> (paridad europea).</li>
            </ul>
            <Sub>Ejemplo numérico</Sub>
            <p>
              Parámetros: <K tex={"c = \\$1.50"} /> (call europea conocida),{" "}
              <K tex={"K = \\$20"} />, <K tex={"T = 5/12"} /> años, <K tex={"S_0 = \\$19"} />,{" "}
              <K tex={"r = 10\\%"} />. Objetivo: acotar el put americano <K tex={"P"} />.
            </p>
            <Eq tex={"S_0 - K = 19 - 20 = -1"} />
            <Eq tex={"S_0 - K\\, e^{-rT} = 19 - 20\\, e^{-0.10 \\times 5/12} = 19 - 19.1838 = -0.1838"} />
            <p>
              Entonces <K tex={"-1 \\leq C - P \\leq -0.1838"} />. Como{" "}
              <K tex={"C \\geq c = 1.5"} /> (americana ≥ europea), reordenando para{" "}
              <K tex={"P"} />:
            </p>
            <Eq tex={"P \\geq c - (S_0 - K\\, e^{-rT}) = 1.50 - (-0.1838) = 1.6838"} />
            <Eq tex={"P \\leq c + (K - S_0) = 1.50 + 1.00 = 2.50"} />
            <p>
              También <K tex={"P \\geq \\max(K - S_0, 0) = \\$1.00"} /> (intrinsic).
              Tomando el máximo de cotas inferiores: <span className="text-text">$1.6838</span>.
            </p>
            <Note kind="success" title="Resultado">
              <K tex={"\\$1.68 < P < \\$2.50"} />. El put americano debe estar entre ~$1.68
              y $2.50.
            </Note>
          </Example>

          <Example title="Early exercise — americano vs europeo">
            <ul className="ml-5 list-disc space-y-1">
              <li><span className="text-text">Calls americanos</span> sobre activos sin dividendos: nunca conviene ejercer temprano.</li>
              <li><span className="text-text">Puts americanos</span>: puede convenir ejercerlos si están muy ITM.</li>
            </ul>
            <Note kind="info" title="Call americano sin dividendos">
              El call europeo siempre vale más que el intrinsic (<K tex={"S - K"} />). Ese
              exceso es el &ldquo;valor del seguro&rdquo; — lo que perdés si ejercés temprano. Por
              eso nunca conviene ejercer un call americano sin dividendos. Con dividendos
              sí puede convenir, justo antes del ex-date para capturarlo.
            </Note>
            <Note kind="warning" title="Put americano">
              El put americano puede tocar la línea intrinsic (<K tex={"K - S"} />) cuando{" "}
              <K tex={"S"} /> es muy bajo. Si <K tex={"S \\to 0"} />, ejercer ya te da{" "}
              <K tex={"K"} />; esperar te da solo <K tex={"K e^{-rT} < K"} /> (perdés la
              tasa). Por eso puede convenir ejercer un put americano temprano si está muy
              ITM.
            </Note>
          </Example>
        </Section>

        <Section id="formulas" title="Formulario — Hull Cap 10 · 11">
          <p>Payoff al vencimiento:</p>
          <Eq tex={"\\text{Call} = \\max(S_T - K,\\, 0) \\qquad \\text{Put} = \\max(K - S_T,\\, 0)"} />
          <p>Put-call parity — opciones europeas:</p>
          <Eq tex={"c + K e^{-rT} = p + S_0 e^{-qT}"} />
          <p>Cotas del call europeo:</p>
          <Eq tex={"\\max\\!\\left(S_0 e^{-qT} - K e^{-rT},\\, 0\\right) \\leq c \\leq S_0 e^{-qT}"} />
          <p>Cotas del put europeo:</p>
          <Eq tex={"\\max\\!\\left(K e^{-rT} - S_0 e^{-qT},\\, 0\\right) \\leq p \\leq K e^{-rT}"} />
          <p>Desigualdad de paridad — opciones americanas:</p>
          <Eq tex={"S_0 - K \\leq C - P \\leq S_0 - K e^{-rT}"} />
        </Section>
      </Prose>
    </UnitShell>
  );
}
