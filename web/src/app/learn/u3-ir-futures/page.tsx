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
    <UnitShell slug="u3-ir-futures">
      <Prose>
        <Lead>
          Hull 6. Los futuros de tasa de interés tienen su propia mecánica: day-count conventions,
          la opción de entrega del short y el <span className="text-text">cheapest-to-deliver</span>{" "}
          en Treasury futures, el <span className="text-text">convexity adjustment</span> de los
          Eurodollar futures y la cobertura de duración de un portfolio de bonos.
        </Lead>

        {/* ============================= DAY COUNT ============================= */}
        <Section id="day-count" title="Day count conventions">
          <p>
            Distintas convenciones para calcular el year fraction entre dos fechas (Hull 6.1). La misma
            fecha da resultados distintos según la convención, y eso define cuánto interés acruee un
            instrumento entre dos fechas.
          </p>
          <DataTable
            headers={["Convención", "Uso típico", "Fórmula"]}
            rows={[
              ["ACT/360", "T-bills, LIBOR, money market USA", "actual_days / 360"],
              ["ACT/ACT", "T-bonds US", "actual_days / actual_days_in_year"],
              ["30/360", "US corp & muni bonds", "(360·Δy + 30·Δm + Δd) / 360"],
            ]}
          />
          <Note kind="hull" title="Hull says">
            La convención ACT/360 hace que un instrumento money-market siempre acruee un poco más del
            &quot;año verdadero&quot; — una herencia de cuando los cálculos se hacían a mano.
          </Note>
        </Section>

        {/* ============================= TREASURY FUTURES / CTD ============================= */}
        <Section id="treasury-futures" title="Treasury bond futures y cheapest-to-deliver">
          <p>
            Un <span className="text-text">Treasury bond futures</span> (CBOT) es un contrato sobre
            Treasury bonds de US. El short tiene la opción de entregar{" "}
            <span className="text-text">cualquiera</span> de varios bonos elegibles. Para hacerlo
            equitativo, cada bono tiene un <span className="text-text">conversion factor (CF)</span>: su
            precio teórico al yield estándar de 6% semianual de convención CBOT.
          </p>
          <Eq tex={"\\text{CF} = \\frac{1}{100}\\left[\\sum_i \\frac{c}{(1+r)^i} + \\frac{100}{(1+r)^n}\\right]"} />
          <p>El cash que recibe el short al entregar, y el costo de entrega de cada bono:</p>
          <Eq tex={"\\text{Cash recibido} = \\text{settlement} \\times \\text{CF} + \\text{accrued interest}"} />
          <Eq tex={"\\text{Cost of delivery} = \\text{quoted price} - \\text{settlement} \\times \\text{CF}"} />
          <p>
            El bono con menor cost of delivery es el{" "}
            <span className="text-text">cheapest-to-deliver (CTD)</span>.
          </p>
          <Note kind="info" title="Sanity check">
            Un bono con cupón = 6% (igual al ytm de referencia CBOT) da{" "}
            <K tex={"\\text{CF} = 1.0"} /> exacto. El ejemplo de Hull 6.2 (cupón 12%, plazo 20 años) da{" "}
            <K tex={"\\text{CF} \\approx 1.6997"} />.
          </Note>
          <Example title="Cheapest-to-deliver entre 3 bonos (settlement = 93.25)">
            <p>
              Con <K tex={"\\text{cost} = \\text{quoted} - \\text{settlement} \\times \\text{CF}"} />{" "}
              para cada bono candidato:
            </p>
            <DataTable
              headers={["Bono", "Quoted", "CF", "Cost of delivery", "CTD?"]}
              rows={[
                ["Bond A (6% 18y)", "$99.50", "1.0382", "$2.69", ""],
                ["Bond B (12% 20y)", "$143.50", "1.6929", "$15.64", ""],
                ["Bond C (8% 25y)", "$119.75", "1.2230", "$5.71", ""],
              ]}
            />
            <p>
              El menor cost of delivery es el de <span className="text-text">Bond A</span> ($2.69) → es
              el cheapest-to-deliver. El short elige siempre el bono que le minimiza el costo de
              entregar.
            </p>
          </Example>
        </Section>

        {/* ============================= EURODOLLAR + CONVEXITY ============================= */}
        <Section id="eurodollar" title="Eurodollar futures y convexity adjustment">
          <p>
            Los <span className="text-text">Eurodollar futures</span> son futuros sobre la tasa LIBOR
            de 3 meses, cotizados como <K tex={"100 - \\text{rate}"} />. Una posición long en el futuro
            gana si la tasa <span className="text-text">baja</span>.
          </p>
          <p>
            El <span className="text-text">convexity adjustment</span> (Hull 6.3): la forward rate
            implícita en el futures rate no es idéntica a la forward rate verdadera, porque el daily
            mark-to-market introduce convexidad:
          </p>
          <Eq tex={"\\text{forward rate} \\approx \\text{futures rate} - \\tfrac{1}{2}\\sigma^2 T_1 T_2"} />
          <p>
            El ajuste crece <span className="text-text">cuadráticamente</span> con el plazo: para
            maturities cortas es despreciable, pero para 5-10 años se vuelve significativo.
          </p>
          <Note kind="hull" title="Hull says">
            El ajuste viene de que el largo del futuro recibe cash diariamente cuando los rates bajan (y
            lo reinvierte a tasas más bajas), un efecto malo. Por eso el futures rate cotiza más alto
            que el forward rate teórico — y hay que restarle el ajuste para recuperar la forward.
          </Note>
        </Section>

        {/* ============================= DURATION HEDGE ============================= */}
        <Section id="duration-hedge" title="Duration-based hedge">
          <p>
            Un <span className="text-text">duration-based hedge</span> (Hull 6.4) cubre un portfolio de
            duration <K tex={"D_P"} /> con futuros de IR de duration <K tex={"D_F"} />. El número óptimo
            de contratos a vender:
          </p>
          <Eq tex={"N^* = \\frac{P \\cdot D_P}{V_F \\cdot D_F}"} />
          <p>
            donde <K tex={"P"} /> es el valor del portfolio y <K tex={"V_F"} /> = precio del futuro ×
            multiplicador del contrato. Se asume un shift{" "}
            <span className="text-text">paralelo</span> de la curva.
          </p>
          <Example title="Cobertura de un portfolio de bonos">
            <p>
              Portfolio de <K tex={"P = \\$10\\text{M}"} /> con <K tex={"D_P = 6.80"} /> años. Futuro de
              T-bond cotizado a 93.25, CTD con <K tex={"D_F = 9.20"} /> años, multiplicador $1,000 →{" "}
              <K tex={"V_F = 93.25 \\times 1000 = \\$93{,}250"} />.
            </p>
            <Eq tex={"N^* = \\frac{10{,}000{,}000 \\times 6.80}{93{,}250 \\times 9.20} \\approx 79.3 \\text{ contratos}"} />
            <p>
              Ante un shift paralelo de +100 bps, el portfolio sin cobertura cae{" "}
              <K tex={"\\Delta P = -P\\,D_P\\,\\Delta y \\approx -\\$68\\text{k}"} />, mientras que la
              ganancia de los 79 futuros vendidos lo compensa casi exactamente, dejando el portfolio
              cubierto cerca de cero.
            </p>
          </Example>
          <Note kind="warning" title="Limitación">
            La duration hedge solo neutraliza el riesgo de un shift{" "}
            <span className="text-text">paralelo</span>. Si la curva cambia de pendiente (steepening /
            flattening) queda exposición residual. Por eso los bancos usan key-rate duration o full
            revaluation.
          </Note>
          <p>
            Explorá coberturas y sensibilidades de tasa en los{" "}
            <Link href="/strategies" className="text-brass hover:underline">
              labs de estrategias
            </Link>
            .
          </p>
        </Section>

        {/* ============================= FORMULARIO ============================= */}
        <Section id="formulario" title="Formulario — Capítulo 6">
          <p>Las fórmulas de IR futures que se usan en esta unidad.</p>
          <Sub>Day count — fracción de año</Sub>
          <Eq tex={"\\tau_{30/360} = \\frac{360(y_2-y_1) + 30(m_2-m_1) + (d_2-d_1)}{360} \\qquad \\tau_{\\text{ACT}/360} = \\frac{\\text{días reales}}{360}"} />
          <Sub>Conversion factor (Treasury bond futures) — al 6% semianual CBOT</Sub>
          <Eq tex={"\\text{CF} = \\frac{1}{100}\\left[\\sum_i \\frac{c}{(1+r)^i} + \\frac{100}{(1+r)^n}\\right]"} />
          <Sub>Cheapest-to-deliver</Sub>
          <Eq tex={"\\text{cost} = \\text{quoted price} - \\text{settlement} \\times \\text{CF}"} />
          <Sub>Convexity adjustment (Eurodollar futures)</Sub>
          <Eq tex={"\\text{forward rate} \\approx \\text{futures rate} - \\tfrac{1}{2}\\sigma^2 T_1 T_2"} />
          <Sub>Duration-based hedge con IR futures</Sub>
          <Eq tex={"N^* = \\frac{P \\cdot D_P}{V_F \\cdot D_F}"} />
        </Section>
      </Prose>
    </UnitShell>
  );
}
