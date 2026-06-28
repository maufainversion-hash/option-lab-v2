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
  Example,
} from "@/components/learn/content";

export default function Page() {
  return (
    <UnitShell slug="u2-coberturas">
      <Prose>
        <Lead>
          Cubrir una posición con futuros no es trivial: rara vez existe el contrato
          exacto sobre tu activo. Esta unidad arma el hedge ratio de mínima varianza,
          mide la basis risk que queda al cubrir con un futuro imperfecto, y extiende
          la idea a carteras de acciones vía la beta.
        </Lead>

        <Section id="hedge-ratio" title="1 · Hedge ratio óptimo">
          <p>
            <span className="text-text">Hedge ratio de mínima varianza</span>{" "}
            (Hull 3.4):
          </p>
          <Eq tex={"h^* = \\rho \\cdot \\frac{\\sigma_S}{\\sigma_F}"} />
          <p>
            Donde <K tex={"\\sigma_S"} /> es la desviación del cambio de precio spot,{" "}
            <K tex={"\\sigma_F"} /> la del futuro, y <K tex={"\\rho"} /> la correlación
            entre ambos. Si la correlación es 1 y las vols iguales,{" "}
            <K tex={"h^* = 1"} /> (cobertura perfecta).
          </p>
          <p>
            La <span className="text-text">hedge effectiveness</span> mide qué
            proporción de la varianza fue eliminada por el hedge:
          </p>
          <Eq tex={"\\text{effectiveness} = \\rho^2"} />
          <Note kind="hull" title="Hull pp. 56-62 · derivación">
            <p>
              La derivación parte de minimizar <K tex={"\\text{Var}(\\Delta S - h\\,\\Delta F)"} />{" "}
              respecto de <K tex={"h"} />. Derivando e igualando a cero:
            </p>
            <Eq tex={"h^* = \\frac{\\text{Cov}(\\Delta S, \\Delta F)}{\\text{Var}(\\Delta F)} = \\rho \\cdot \\frac{\\sigma_S}{\\sigma_F}"} />
            <p className="mt-2">
              La <span className="text-text">hedge effectiveness</span>{" "}
              <K tex={"\\rho^2"} /> mide qué proporción de la varianza del cambio de
              precio spot fue eliminada por el hedge. Si <K tex={"\\rho = 1"} />,
              eliminás todo. Si <K tex={"\\rho = 0"} />, no estás hedgeando nada.
            </p>
          </Note>
          <Note kind="info">
            Mové <K tex={"\\sigma_S"} />, <K tex={"\\sigma_F"} /> y <K tex={"\\rho"} />{" "}
            y observá cómo se mueve la varianza del portfolio hedgeado en el{" "}
            <Link href="/pricing" className="text-brass hover:underline">
              laboratorio de pricing
            </Link>
            .
          </Note>
        </Section>

        <Section id="basis-risk" title="2 · Basis risk">
          <p>
            <span className="text-text">Basis = Spot − Futuro</span>. Cuando hedgeás un
            asset con un futuro que no es exactamente sobre ese asset (ej: hedgear jet
            fuel con heating oil futures), te queda{" "}
            <span className="text-text">basis risk</span>: el spread spot-futuro al
            cerrar el hedge no es predecible.
          </p>
          <p>
            Hull 3.1: el resultado de un hedge corto en un punto{" "}
            <K tex={"t_2 \\neq"} /> vencimiento es:
          </p>
          <Eq tex={"S_2 - F_1 = F_2 + (S_2 - F_2) = F_2 + b_2"} />
          <p>
            Donde <K tex={"b_2 = S_2 - F_2"} /> es la basis al cierre. El precio
            efectivo que conseguís queda fijado por <K tex={"F_1"} /> (conocido al
            entrar) más una basis <K tex={"b_2"} /> incierta: ahí vive todo el riesgo
            residual de la cobertura.
          </p>
          <Note kind="key">
            Cuanto mayor la correlación entre tu activo y el subyacente del futuro,
            menor la varianza de la basis y más confiable la cobertura. El basis risk
            es el precio inevitable de cubrir con un futuro imperfecto.
          </Note>
        </Section>

        <Section id="equity-hedge" title="3 · Hedge de equity portfolio">
          <p>
            <span className="text-text">Hedge de un portfolio de acciones con index
            futures</span> (Hull 3.5):
          </p>
          <Eq tex={"N^* = \\beta \\cdot \\frac{V_A}{V_F}"} />
          <p>
            Donde <K tex={"V_A"} /> es el valor del portfolio, <K tex={"V_F"} /> es el
            valor de un contrato futuro (precio × multiplicador), y <K tex={"\\beta"} />{" "}
            es la beta del portfolio respecto al índice.
          </p>
          <Sub>Cambiar la beta del portfolio</Sub>
          <p>
            Si tu <K tex={"\\beta"} /> actual es <K tex={"\\beta"} /> y querés llegar a{" "}
            <K tex={"\\beta^*"} />:
          </p>
          <Eq tex={"N^* = (\\beta^* - \\beta) \\cdot \\frac{V_A}{V_F}"} />
          <p>
            Si <K tex={"\\beta^* < \\beta"} /> → vendés futuros (reducir exposición). Si{" "}
            <K tex={"\\beta^* > \\beta"} /> → comprás futuros. Para una cobertura total
            (<K tex={"\\beta^* = 0"} />) recuperás la fórmula <K tex={"N^* = \\beta V_A / V_F"} />.
          </p>
          <Example title="Sensibilidad S&P 500: hedged vs sin hedge">
            <p>
              Un portfolio cubierto con futuros se comporta{" "}
              <span className="text-text">como risk-free</span>: gana aproximadamente la
              tasa libre independientemente del movimiento del índice.
            </p>
            <p>
              Setup típico: portfolio de $5M, S&amp;P 500 inicial 1.000, multiplicador
              250 → se shortean <K tex={"N^* = V_A / (S_0 \\cdot \\text{mult})"} /> ≈ 20
              contratos (cada contrato cubre $250.000). Al barrer el S&amp;P final de
              900 a 1.100, el portfolio <span className="text-text">sin hedge</span> oscila
              ±10%, mientras que el <span className="text-text">hedged</span> queda
              cuasi-constante cerca del target risk-free <K tex={"V_A\\,e^{rT}"} />.
            </p>
            <p>
              El hedge convierte el riesgo de mercado en rendimiento risk-free: la
              ganancia/pérdida del físico se cancela contra la del short de futuros,
              dejando aproximadamente la tasa libre sobre el período.
            </p>
          </Example>
          <Note kind="info">
            Calculá <K tex={"N^*"} /> y simulá la cobertura de tu cartera contra un
            rango de escenarios del índice en el{" "}
            <Link href="/pricing" className="text-brass hover:underline">
              laboratorio de pricing
            </Link>
            .
          </Note>
        </Section>

        <Section id="cross-hedging" title="4 · Cross hedging descompuesto">
          <p>
            En <span className="text-text">cross hedging</span> cubrís un activo (
            <K tex={"S_2"} />) usando futuros de OTRO activo relacionado (
            <K tex={"F_1"} />). Ejemplo clásico: una aerolínea cubre{" "}
            <span className="text-text">costo de nafta</span> usando futuros de{" "}
            <span className="text-text">crudo WTI</span>.
          </p>
          <p>
            Al vencimiento, tu ingreso total tiene{" "}
            <span className="text-text">tres componentes</span>:
          </p>
          <Eq tex={"\\text{Ingreso} = F_1 + (S_2^* - F_2) + (S_2 - S_2^*)"} />
          <ul className="ml-5 list-disc space-y-1">
            <li><K tex={"F_1"} />: ganancia/pérdida en el futuro que tradeaste.</li>
            <li>
              <K tex={"(S_2^* - F_2)"} />: <span className="text-text">riesgo de base</span>{" "}
              si el futuro fuera sobre tu mismo activo (inevitable).
            </li>
            <li>
              <K tex={"(S_2 - S_2^*)"} />: <span className="text-text">efecto
              correlación imperfecta</span> (costo del cross-hedging).
            </li>
          </ul>
          <Note kind="key">
            Si el efecto de correlación imperfecta (
            <K tex={"S_2 - S_2^*"} />) domina sobre el riesgo de base (
            <K tex={"S_2^* - F_2"} />), el cross-hedging agrega más riesgo del que
            resuelve: conviene buscar un futuro más correlacionado o aceptar quedar sin
            hedge.
          </Note>
          <Example title="Aerolínea cubre nafta con crudo WTI">
            <p>
              <span className="text-text">Situación:</span>
            </p>
            <ul className="ml-4 list-disc space-y-1">
              <li>Aerolínea consume <span className="text-text">2.000.000 galones de nafta</span> por mes.</li>
              <li>No hay futuros líquidos de nafta → usa futuros de <span className="text-text">crudo WTI</span>.</li>
              <li>Correlación nafta-crudo: <K tex={"\\rho = 0.928"} />.</li>
            </ul>
            <p>
              <span className="text-text">Datos históricos:</span>{" "}
              <K tex={"\\sigma_{\\text{nafta}} = 0.0263"} /> (vol cambios de precio
              nafta), <K tex={"\\sigma_{\\text{crudo}} = 0.0313"} /> (vol cambios futuro
              crudo).
            </p>
            <p>Hedge ratio óptimo:</p>
            <Eq tex={"h^* = \\rho \\cdot \\frac{\\sigma_S}{\\sigma_F} = 0.928 \\cdot \\frac{0.0263}{0.0313} = 0.78"} />
            <p>
              <span className="text-text">Conversión de unidades:</span> futuro crudo =
              1.000 barriles por contrato; 1 barril ≈ 42 galones; 2.000.000 galones =
              47.619 barriles.
            </p>
            <p>Número de contratos:</p>
            <Eq tex={"N^* = h^* \\cdot \\frac{Q_A}{Q_F} = 0.78 \\cdot \\frac{47{,}619}{1{,}000} \\approx 37 \\text{ contratos}"} />
            <p>
              La aerolínea shortea <span className="text-text">37 contratos</span> de
              crudo WTI para cubrir 2M galones de nafta.
            </p>
          </Example>
        </Section>

        <Section id="formulas" title="Formulario · Hull Cap 3">
          <p>Hedge ratio de mínima varianza:</p>
          <Eq tex={"h^* = \\rho \\, \\frac{\\sigma_S}{\\sigma_F}"} />
          <p>Hedge effectiveness — varianza eliminada:</p>
          <Eq tex={"\\text{effectiveness} = \\rho^2"} />
          <p>Número óptimo de contratos (ajustado por tamaño):</p>
          <Eq tex={"N^* = h^* \\, \\frac{Q_A}{Q_F}"} />
          <p>Hedge de equity portfolio con index futures:</p>
          <Eq tex={"N^* = \\beta \\, \\frac{V_A}{V_F}"} />
          <p>Cambio de beta de <K tex={"\\beta"} /> a <K tex={"\\beta^*"} />:</p>
          <Eq tex={"N^* = (\\beta^* - \\beta)\\, \\frac{V_A}{V_F}"} />
          <p>Cross hedging — descomposición del ingreso:</p>
          <Eq tex={"\\text{Ingreso} = F_1 + (S_2^* - F_2) + (S_2 - S_2^*)"} />
          <Note kind="info">
            <K tex={"Q_A"} /> = tamaño de la posición a cubrir; <K tex={"Q_F"} /> =
            tamaño de un contrato; <K tex={"V_A"} /> = valor del portfolio;{" "}
            <K tex={"V_F"} /> = valor de un contrato futuro (precio × multiplicador).
          </Note>
        </Section>
      </Prose>
    </UnitShell>
  );
}
