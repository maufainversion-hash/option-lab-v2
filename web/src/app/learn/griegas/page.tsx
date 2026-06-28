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
    <UnitShell slug="griegas">
      <Prose>
        <Lead>
          Las griegas miden cómo cambia el precio de una opción ante cambios en las variables de
          entrada. Son las primeras —y segundas— derivadas del modelo Black-Scholes-Merton, y son
          la herramienta con la que un trader entiende y neutraliza el riesgo de un libro de
          opciones.
        </Lead>

        <p>
          Cada letra griega aísla una fuente de riesgo: el spot (delta y gamma), la volatilidad
          (vega), el paso del tiempo (theta) y la tasa de interés (rho). Conocer su signo, su
          forma en función del spot y su comportamiento cerca del vencimiento es lo que permite
          armar coberturas. En esta unidad asumimos una opción europea sobre un activo con
          dividend yield <K tex={"q"} />, y <K tex={"N'(x)"} /> denota la densidad normal
          estándar.
        </p>

        <Section id="resumen" title="Las cinco griegas de un vistazo">
          <DataTable
            headers={["Griega", "Qué mide", "Signo (long call)"]}
            rows={[
              [<K key="d" tex={"\\Delta"} />, <span key="dd">{"∂V/∂S — sensibilidad al spot"}</span>, "(0, 1)"],
              [<K key="g" tex={"\\Gamma"} />, <span key="gg">{"∂²V/∂S² — convexidad"}</span>, "≥ 0 si long"],
              [<K key="v" tex={"\\nu"} />, <span key="vv">{"∂V/∂σ — sensibilidad a la vol"}</span>, "≥ 0 si long"],
              [<K key="t" tex={"\\Theta"} />, <span key="tt">{"∂V/∂t — time decay (por año)"}</span>, "< 0 si long"],
              [<K key="r" tex={"\\rho"} />, <span key="rr">{"∂V/∂r — sensibilidad a la tasa"}</span>, "> 0 call · < 0 put"],
            ]}
          />
          <Note kind="key" title="Vega y gamma son siempre positivas si estás long">
            Sin importar si es call o put: medir la segunda derivada en <K tex={"S"} /> (gamma) o la
            primera en <K tex={"\\sigma"} /> (vega) no distingue dirección. Comprar opcionalidad
            —call o put— siempre te deja long gamma y long vega; venderla te deja short en ambas.
          </Note>
        </Section>

        <Section id="delta" title="Delta — sensibilidad al spot">
          <p>
            <span className="text-text">Delta</span> es la tasa de cambio del precio de la opción
            respecto del precio del subyacente: cuánto se mueve la prima por cada $1 que se mueve el
            spot. En BSM:
          </p>
          <Eq tex={"\\Delta_{\\text{call}} = e^{-qT} N(d_1) \\qquad \\Delta_{\\text{put}} = e^{-qT}\\,[N(d_1) - 1]"} />
          <p>
            <span className="text-text">Signo e intuición.</span> El delta de un call está en{" "}
            <K tex={"(0, 1)"} /> y el de un put en <K tex={"(-1, 0)"} />. Sube de ~0 cuando la
            opción está muy OTM hasta ~1 (call) o −1 (put) cuando está muy ITM, pasando por
            aproximadamente ±0,5 en ATM. Se interpreta también como una probabilidad aproximada de
            terminar ITM, y como el número de unidades del subyacente equivalentes a la opción.
          </p>
          <Sub>Delta-hedging</Sub>
          <p>
            Una posición es <span className="text-text">delta-neutral</span> cuando su delta total
            es cero: pequeños movimientos del spot no cambian su valor a primer orden. Para cubrir
            una opción vendida, el trader compra <K tex={"\\Delta"} /> unidades del subyacente. Como
            el delta cambia con el spot y con el tiempo, la cobertura debe{" "}
            <span className="text-text">rebalancearse</span> continuamente: es un esquema dinámico,
            no se arma una vez y se olvida.
          </p>
          <Note kind="hull" title="Delta de una futures option">
            Para una opción sobre futuros, el delta del call es{" "}
            <K tex={"\\Delta_{\\text{call}} = e^{-rT} N(d_1)"} /> (modelo de Black). El factor de
            descuento aparece porque el futuro, a diferencia del spot, no requiere desembolso
            inicial.
          </Note>
        </Section>

        <Section id="gamma" title="Gamma — convexidad">
          <p>
            <span className="text-text">Gamma</span> es la segunda derivada del precio respecto del
            spot, o equivalentemente la tasa de cambio del delta. Mide la{" "}
            <span className="text-text">convexidad</span> de la posición: cuán rápido tenés que
            rebalancear el delta-hedge. Es idéntica para call y put:
          </p>
          <Eq tex={"\\Gamma = \\frac{e^{-qT} N'(d_1)}{S_0\\,\\sigma\\,\\sqrt{T}}"} />
          <p>
            <span className="text-text">Signo e intuición.</span> Gamma es positiva si estás long
            opciones. Tiene un pico pronunciado <span className="text-text">en ATM</span> y decae
            hacia los extremos. Cerca del vencimiento (T chico) el denominador se achica y el pico
            se vuelve mucho más alto y angosto: por eso se dice que{" "}
            <span className="text-text">la gamma explota</span> cerca del expiry. Estar long gamma
            es deseable —tu delta se mueve a tu favor— pero se paga con theta.
          </p>
          <Note kind="info" title="Por qué importa">
            Una gamma alta significa que un delta-hedge se desactualiza rápido: entre rebalanceos,
            un movimiento brusco del spot deja a la posición expuesta. El que está short gamma
            (vendió opciones) sufre justamente cuando el mercado se mueve fuerte.
          </Note>
        </Section>

        <Section id="vega" title="Vega — sensibilidad a la volatilidad">
          <p>
            <span className="text-text">Vega</span> mide la sensibilidad del precio a la volatilidad
            del subyacente: cuánto cambia la prima por cada punto de cambio en{" "}
            <K tex={"\\sigma"} />. Es idéntica para call y put:
          </p>
          <Eq tex={"\\nu = S_0\\,e^{-qT} N'(d_1)\\,\\sqrt{T}"} />
          <p>
            <span className="text-text">Signo e intuición.</span> Vega es positiva si estás long
            opciones: más volatilidad aumenta el valor de la opcionalidad. También pico en ATM, pero
            más ancho que gamma, y <span className="text-text">crece con T</span> —más tiempo hasta
            el vencimiento da más oportunidad de que la vol se materialice—. Por eso las opciones
            largas son las más sensibles a la vol.
          </p>
          <Note kind="hull" title="Vega y un modelo de vol constante">
            Black-Scholes asume volatilidad constante, así que estrictamente vega es la sensibilidad
            a un parámetro que el modelo supone fijo. En la práctica se usa igual para cubrir el
            riesgo de cambios en la volatilidad implícita: para neutralizar vega hay que tomar
            posición en otra opción (el subyacente tiene vega cero).
          </Note>
        </Section>

        <Section id="theta" title="Theta — el paso del tiempo">
          <p>
            <span className="text-text">Theta</span> mide cuánto pierde de valor la opción a medida
            que pasa el tiempo, manteniendo todo lo demás constante: el{" "}
            <span className="text-text">time decay</span>. Para un call:
          </p>
          <Eq tex={"\\Theta_{\\text{call}} = -\\frac{S_0\\,e^{-qT} N'(d_1)\\,\\sigma}{2\\sqrt{T}} - rKe^{-rT}N(d_2) + qS_0\\,e^{-qT}N(d_1)"} />
          <p>
            <span className="text-text">Signo e intuición.</span> Para una opción comprada theta es
            típicamente negativa: la opción se evapora cada día que pasa. Es más negativa{" "}
            <span className="text-text">en ATM</span>, donde la incertidumbre —y por lo tanto el
            valor temporal— es máxima. Quien está long opciones paga theta todos los días; quien las
            vende la cobra.
          </p>
          <Note kind="key" title="El trade-off gamma–theta">
            Gamma y theta tienen signos opuestos: estar long gamma (bueno cuando el mercado se
            mueve) implica estar long theta negativa (perdés cada día de calma). Vender opciones te
            deja <span className="text-text">long theta, short gamma</span>: cobrás decay todos los
            días pero te lastima un movimiento brusco. Esa es la tensión central de cualquier libro
            de opciones.
          </Note>
        </Section>

        <Section id="rho" title="Rho — sensibilidad a la tasa">
          <p>
            <span className="text-text">Rho</span> mide la sensibilidad del precio a la tasa de
            interés libre de riesgo:
          </p>
          <Eq tex={"\\rho_{\\text{call}} = K T e^{-rT} N(d_2) \\qquad \\rho_{\\text{put}} = -K T e^{-rT} N(-d_2)"} />
          <p>
            <span className="text-text">Signo e intuición.</span> Rho es positiva para calls y
            negativa para puts. Una tasa más alta baja el valor presente del strike, lo que beneficia
            al comprador del call y perjudica al del put. Para calls, rho crece con el strike{" "}
            <K tex={"K"} /> y con el tiempo a vencimiento, así que las opciones largas y de strike
            alto son las más sensibles a la tasa. Es la griega de menor impacto en horizontes cortos.
          </p>
        </Section>

        <Section id="comportamiento" title="Cómo se comportan en función del spot">
          <p>Las observaciones clave al mirar las griegas como función del precio del subyacente:</p>
          <Defs
            items={[
              {
                term: "Delta",
                desc: "Del call sube de 0 (OTM) a 1 (ITM), pasando por ~0,5 en ATM. Para puts va de 0 a −1.",
              },
              {
                term: "Gamma",
                desc: "Pico en ATM. Cerca del vencimiento el pico se vuelve mucho más alto y angosto: la gamma explota cerca del expiry.",
              },
              {
                term: "Vega",
                desc: "También pico en ATM, pero más ancho. Aumenta con T: más tiempo significa más oportunidad de que la vol importe.",
              },
              {
                term: "Theta",
                desc: "Más negativa en ATM: la opción pierde valor más rápido donde la incertidumbre vale más.",
              },
              {
                term: "Rho",
                desc: "Sube linealmente con K para calls: cuanto más alto el strike, más sensible a la tasa.",
              },
            ]}
          />
          <Note kind="info" title="Visualizá las superficies">
            Explorá cada griega en función del spot y del tiempo, y comparalas entre calls y puts,
            en el{" "}
            <Link href="/pricing" className="text-brass hover:underline">
              laboratorio de pricing
            </Link>
            .
          </Note>
        </Section>

        <Section id="practica-ar" title="Interpretación práctica">
          <Defs
            items={[
              {
                term: "Comprar ATM cerca del vencimiento → exposición a gamma",
                desc: "Un movimiento del subyacente cambia tu delta dramáticamente. Excelente si acertás la dirección, doloroso si no.",
              },
              {
                term: "Comprar opciones largas con vol baja → long vega",
                desc: "Te juega a favor si la volatilidad sube, justo lo que pasa antes de resultados o eventos macro.",
              },
              {
                term: "Vender opciones (covered call, iron condor) → long theta, short gamma",
                desc: "Theta te juega a favor (cobrás decay) pero gamma en contra: un movimiento brusco te lastima.",
              },
            ]}
          />
        </Section>

        <Section id="relacion-bsm" title="La relación entre las griegas y la PDE de Black-Scholes">
          <p>
            Las griegas no son independientes: están ligadas por la ecuación diferencial de
            Black-Scholes. Para un portfolio delta-neutral <K tex={"\\Pi"} /> vale la relación entre
            theta, gamma y la tasa:
          </p>
          <Eq tex={"\\Theta + \\tfrac{1}{2}\\sigma^2 S^2\\,\\Gamma = r\\Pi"} />
          <p>
            Esto formaliza el trade-off gamma–theta: en una posición delta-neutral, una gamma
            positiva grande obliga a una theta negativa grande, y viceversa. No podés tener
            convexidad gratis. Esta identidad es, de hecho, la propia PDE de Black-Scholes escrita en
            el lenguaje de las griegas.
          </p>
          <Note kind="hull" title="Convergencia binomial → Black-Scholes">
            El árbol binomial CRR converge al precio BSM cuando <K tex={"n \\to \\infty"} />, pero{" "}
            <span className="text-text">oscila</span> alrededor del valor límite. El esquema de
            Leisen-Reimer converge mucho más rápido y de forma monótona. Podés ver esta convergencia
            paso a paso en el{" "}
            <Link href="/binomial" className="text-brass hover:underline">
              laboratorio binomial
            </Link>
            .
          </Note>
        </Section>

        <Section id="formulario" title="Formulario — Hull Cap 19">
          <Note kind="info" title="Notación">
            <K tex={"N'(x)"} /> es la densidad normal estándar. Opción europea con dividend yield{" "}
            <K tex={"q"} />.
          </Note>
          <Defs
            items={[
              {
                term: "Delta",
                desc: (
                  <K tex={"\\Delta_{\\text{call}} = e^{-qT} N(d_1) \\qquad \\Delta_{\\text{put}} = e^{-qT}[N(d_1)-1]"} />
                ),
              },
              {
                term: "Gamma (igual call y put)",
                desc: <K tex={"\\Gamma = \\frac{e^{-qT} N'(d_1)}{S_0\\,\\sigma\\,\\sqrt{T}}"} />,
              },
              {
                term: "Vega (igual call y put)",
                desc: <K tex={"\\nu = S_0\\,e^{-qT} N'(d_1)\\,\\sqrt{T}"} />,
              },
              {
                term: "Theta (call)",
                desc: (
                  <K tex={"\\Theta_{\\text{call}} = -\\frac{S_0 e^{-qT} N'(d_1)\\sigma}{2\\sqrt{T}} - rKe^{-rT}N(d_2) + qS_0 e^{-qT}N(d_1)"} />
                ),
              },
              {
                term: "Rho",
                desc: (
                  <K tex={"\\rho_{\\text{call}} = KTe^{-rT}N(d_2) \\qquad \\rho_{\\text{put}} = -KTe^{-rT}N(-d_2)"} />
                ),
              },
              {
                term: "Relación delta-gamma-theta (portfolio delta-neutral)",
                desc: <K tex={"\\Theta + \\tfrac{1}{2}\\sigma^2 S^2 \\Gamma = r\\Pi"} />,
              },
            ]}
          />
        </Section>

        <Example title="Repaso para el parcial">
          <p>
            Si te dan una posición y te piden cubrirla: empezá por el delta (comprá/vendé subyacente
            para neutralizarlo), después mirá gamma y vega (que solo se cubren con otras opciones), y
            recordá que theta es el precio que pagás por estar long gamma. La relación{" "}
            <K tex={"\\Theta + \\tfrac{1}{2}\\sigma^2 S^2 \\Gamma = r\\Pi"} /> es la que conecta todo.
          </p>
        </Example>
      </Prose>
    </UnitShell>
  );
}
