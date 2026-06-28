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
    <UnitShell slug="u3-forward-pricing">
      <Prose>
        <Lead>
          Hull 5 y 6. La valuación de un forward o futuro se reduce a un único concepto: el{" "}
          <span className="text-text">cost of carry</span>. Financiar el spot, ahorrar dividendos,
          pagar storage o cobrar convenience yield — todo entra en un solo exponente que separa{" "}
          <span className="text-text">contango</span> de <span className="text-text">backwardation</span>.
        </Lead>

        {/* ============================= PRICING GENÉRICO ============================= */}
        <Section id="pricing-generico" title="Pricing genérico — cost of carry">
          <p>El forward price genérico (Hull 5.17) reúne todos los casos en una sola fórmula:</p>
          <Eq tex={"F_0 = S_0\\,e^{(r - q + u - y)\\,T}"} />
          <ul className="list-disc space-y-1 pl-5">
            <li><K tex={"r"} /> — risk-free rate (cc).</li>
            <li><K tex={"q"} /> — dividend yield (o costo de financiamiento ahorrado si tenés el asset).</li>
            <li><K tex={"u"} /> — storage cost rate.</li>
            <li><K tex={"y"} /> — convenience yield (beneficio de tener el físico, no el papel).</li>
          </ul>
          <p>
            El <span className="text-text">cost of carry</span> es{" "}
            <K tex={"c = r - q + u - y"} />, de modo que <K tex={"F_0 = S_0\\,e^{cT}"} />. Si{" "}
            <K tex={"c > 0"} /> el mercado está en <span className="text-text">contango</span> (
            <K tex={"F > S"} />); si <K tex={"c < 0"} />, en{" "}
            <span className="text-text">backwardation</span>.
          </p>
          <p>
            Probá distintos parámetros en la{" "}
            <Link href="/pricing" className="text-brass hover:underline">
              calculadora de pricing
            </Link>
            .
          </p>
        </Section>

        {/* ============================= CONTANGO VS BACKWARDATION ============================= */}
        <Section id="contango-backwardation" title="Contango vs Backwardation">
          <p>
            Dos regímenes de <span className="text-text">estructura de plazos</span> de futuros. La
            diferencia clave es el signo del cost of carry <K tex={"c = r - q + u - y"} />.
          </p>
          <DataTable
            headers={["Régimen", "Relación", "Cuándo aparece", "Ejemplos reales"]}
            rows={[
              [
                "▲ Contango",
                <K key="c" tex={"F > S"} />,
                "Cost of carry positivo: pagás r para financiar el spot y ahorrás q en dividendos.",
                "Oro casi siempre · S&P 500 cuando r > div yield · commodities almacenables sin shortage (cobre normal, soja en cosecha).",
              ],
              [
                "▼ Backwardation",
                <K key="b" tex={"F < S"} />,
                "Convenience yield alto o dividend yield > r. El mercado paga premium por tener el físico ya.",
                "Oil WTI en crisis (2022, invasión a Ucrania) · gas natural en invierno · equity con dividendos muy altos (REITs, MLPs).",
              ],
            ]}
          />
          <p>
            La curva de forwards es <K tex={"F_0 = S_0\\,e^{cT}"} />: con <K tex={"c > 0"} /> crece con
            el plazo, con <K tex={"c < 0"} /> decae. En todos los regímenes el{" "}
            <span className="text-text">spread</span> <K tex={"F - S"} /> converge a cero al
            vencimiento — la velocidad depende del cost of carry.
          </p>
          <Note kind="info" title="Convergencia">
            Asumiendo que el spot no se mueve, el spread futuro-spot va a cero en el vencimiento porque
            el exponente <K tex={"c\\,(T - t)"} /> tiende a cero a medida que pasa el tiempo. Un panel
            de futuros listados en un exchange (ej. CME) muestra esta estructura: cada contrato cotiza
            según su propio vencimiento.
          </Note>
        </Section>

        {/* ============================= CONVENIENCE YIELD ============================= */}
        <Section id="convenience-yield" title="Convenience yield">
          <p>
            El <span className="text-text">convenience yield</span> <K tex={"y"} /> (Hull 5.17) es el
            beneficio implícito de poseer el activo físico en lugar del forward. Es típico en
            commodities cuando hay riesgo de shortage. Se despeja de las cotizaciones de mercado: dados{" "}
            <K tex={"F_0, S_0, r, u, q"} />,
          </p>
          <Eq tex={"y = r - q + u - \\frac{1}{T}\\ln\\frac{F_0}{S_0}"} />
          <Note kind="info">
            Si el convenience yield implícito es muy alto, el mercado está priorizando tener el físico
            ya — señal de escasez. Es exactamente lo que empuja al mercado hacia backwardation.
          </Note>
        </Section>

        {/* ============================= VALOR DE LA POSICIÓN ============================= */}
        <Section id="valor-posicion" title="Valor de una posición forward existente">
          <p>
            Una vez que entraste en un forward a un delivery price <K tex={"K"} />, su valor cambia a
            medida que el precio forward actual <K tex={"F_0"} /> se mueve. La fórmula (Hull 5.4):
          </p>
          <Eq tex={"f = (F_0 - K)\\,e^{-rT}"} />
          <ul className="list-disc space-y-1 pl-5">
            <li><K tex={"f"} /> — valor de la posición long (positivo si ganaste, negativo si perdiste).</li>
            <li><K tex={"F_0"} /> — precio forward actual para vencimiento <K tex={"T"} /> (calculado desde el spot).</li>
            <li><K tex={"K"} /> — delivery price pactado en tu contrato.</li>
            <li><K tex={"r"} /> — tasa risk-free continua.</li>
            <li><K tex={"T"} /> — tiempo al vencimiento (años).</li>
          </ul>
          <p>
            <span className="text-text">Intuición:</span> la diferencia <K tex={"F_0 - K"} /> es lo que
            ganarías o perderías en el futuro; se trae a presente con <K tex={"e^{-rT}"} />. La posición
            short vale lo opuesto: <K tex={"f_{\\text{short}} = (K - F_0)\\,e^{-rT}"} />.
          </p>
          <Example title="Hull-style 5.3 — forward sobre petróleo">
            <p>
              Entraste <span className="text-text">long forward</span> en petróleo a{" "}
              <K tex={"K = \\$24"} />/barril. Hoy el spot está en <K tex={"S_0 = \\$25"} />, la tasa
              risk-free es <K tex={"r = 5\\%"} /> continua y el vencimiento es en{" "}
              <K tex={"T = 0.5"} /> años.
            </p>
            <p>
              <span className="text-text">1. Forward actual:</span>
            </p>
            <Eq tex={"F_0 = S_0\\,e^{rT} = 25\\,e^{0.05 \\times 0.5} = 25 \\times 1.02532 = \\$25.633"} />
            <p>
              <span className="text-text">2. Valor de tu posición long:</span>
            </p>
            <Eq tex={"f = (F_0 - K)\\,e^{-rT} = (25.633 - 24)\\,e^{-0.025} = 1.633 \\times 0.9753 = \\$1.5926"} />
            <p>
              Tu contrato long a $24 vale hoy <span className="text-text">$1.5926 por barril</span>.
              Ganaste porque <K tex={"F_0 = \\$25.633 > K = \\$24"} />.
            </p>
          </Example>
          <p>
            Reproducí y variá este escenario en la{" "}
            <Link href="/pricing" className="text-brass hover:underline">
              calculadora de pricing
            </Link>
            .
          </p>
        </Section>

        {/* ============================= C&C vs RC&C ============================= */}
        <Section id="cash-and-carry" title="Cash & Carry vs Reverse Cash & Carry">
          <p>
            Estas son las dos estrategias de <span className="text-text">arbitraje</span> que enforcean
            el forward price hacia su nivel justo <K tex={"F^* = S_0\\,e^{rT}"} />.
          </p>
          <Sub>Cash &amp; Carry (C&amp;C) — el forward está caro (<K tex={"F_0 > S_0 e^{rT}"} />)</Sub>
          <ol className="list-decimal space-y-1 pl-5">
            <li>
              <span className="text-text">t = 0:</span> pedís prestado <K tex={"S_0"} />, comprás el
              activo spot y shorteás el forward a <K tex={"F_0"} />. Cash flow neto: $0.
            </li>
            <li>
              <span className="text-text">t = T:</span> entregás el activo, cobrás{" "}
              <K tex={"K = F_0"} /> y devolvés el préstamo <K tex={"S_0 e^{rT}"} />.
            </li>
            <li>
              <span className="text-text">Profit risk-free:</span> <K tex={"F_0 - S_0 e^{rT} > 0"} />.
              Arbitraje puro.
            </li>
          </ol>
          <Sub>Reverse Cash &amp; Carry (RC&amp;C) — el forward está barato (<K tex={"F_0 < S_0 e^{rT}"} />)</Sub>
          <ol className="list-decimal space-y-1 pl-5">
            <li>
              <span className="text-text">t = 0:</span> shorteás el activo (cobrás <K tex={"S_0"} />),
              invertís a la tasa y vas long el forward a <K tex={"F_0"} />. Cash flow neto: $0.
            </li>
            <li>
              <span className="text-text">t = T:</span> cobrás <K tex={"S_0 e^{rT}"} />, comprás el
              activo a <K tex={"F_0"} /> vía forward y cubrís el short.
            </li>
            <li>
              <span className="text-text">Profit risk-free:</span> <K tex={"S_0 e^{rT} - F_0 > 0"} />.
            </li>
          </ol>
          <Note kind="key" title="Equilibrio">
            En equilibrio <K tex={"F_0 = S_0 e^{rT}"} /> exactamente y no hay arbitraje. Cualquier
            desvío (asumiendo costos de transacción cero) es explotado por los arbitrajistas hasta
            cerrar el spread.
          </Note>
        </Section>

        {/* ============================= FORWARD FX ============================= */}
        <Section id="forward-fx" title="Forward de monedas — escenarios AUDUSD">
          <p>
            Un exportador australiano va a cobrar <span className="text-text">AUD 1,000,000</span> en{" "}
            <K tex={"T"} /> años. Para fijar el valor en USD puede entrar a un forward FX. Veamos cómo
            termina el resultado en distintos escenarios de spot al vencimiento.
          </p>
          <p>
            <span className="text-text">Datos:</span> spot AUDUSD = 0.8000, forward 1Y = 0.8100, monto
            AUD 1M, <K tex={"T = 1"} />. El forward implícito (covered interest parity){" "}
            <K tex={"F_0 = S_0\\,e^{(r_d - r_f)T}"} /> dice que el AUD se aprecia hacia 0.8100 a 1 año.
          </p>
          <DataTable
            headers={["Spot AUDUSD en T", "USD sin hedge", "USD con forward (0.8100)", "P&L hedge"]}
            rows={[
              ["0.7500", "$750,000", "$810,000", "+$60,000"],
              ["0.8000", "$800,000", "$810,000", "+$10,000"],
              ["0.8500", "$850,000", "$810,000", "−$40,000"],
              ["0.9000", "$900,000", "$810,000", "−$90,000"],
            ]}
          />
          <Note kind="info" title="Insight">
            El forward fija el USD a recibir en exactamente $810,000, sin importar dónde termine el
            spot. Si el AUD se aprecia más allá de 0.8100, hubieras estado mejor sin hedge — pero ese es
            el precio de la <span className="text-text">certeza</span>.
          </Note>
        </Section>

        {/* ============================= FORMULARIO ============================= */}
        <Section id="formulario" title="Formulario — Capítulo 5">
          <p>Las fórmulas de valuación de forwards y futuros que se usan en esta unidad.</p>
          <Sub>Forward price — sin income</Sub>
          <Eq tex={"F_0 = S_0\\,e^{rT}"} />
          <Sub>Con income conocido <K tex={"I"} /> (valor presente de los ingresos)</Sub>
          <Eq tex={"F_0 = (S_0 - I)\\,e^{rT}"} />
          <Sub>Con dividend yield continuo <K tex={"q"} /></Sub>
          <Eq tex={"F_0 = S_0\\,e^{(r-q)T}"} />
          <Sub>Commodity con storage <K tex={"u"} /> y convenience yield <K tex={"y"} /></Sub>
          <Eq tex={"F_0 = S_0\\,e^{(r+u-y)T}"} />
          <Sub>Cost of carry</Sub>
          <Eq tex={"c = r - q + u - y"} />
          <Sub>Valor de un forward existente con delivery price <K tex={"K"} /></Sub>
          <Eq tex={"f = (F_0 - K)\\,e^{-rT}"} />
          <Sub>Convenience yield despejada de cotizaciones de mercado</Sub>
          <Eq tex={"y = r - q + u - \\tfrac{1}{T}\\ln\\!\\left(\\tfrac{F_0}{S_0}\\right)"} />
          <Sub>Forward FX — covered interest parity</Sub>
          <Eq tex={"F_0 = S_0\\,e^{(r_d - r_f)T}"} />
        </Section>
      </Prose>
    </UnitShell>
  );
}
