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
    <UnitShell slug="u4-swaps">
      <Prose>
        <Lead>
          Un swap es un acuerdo para intercambiar flujos de caja futuros según una
          fórmula prefijada. El más común es el <span className="text-text">interest rate swap</span>{" "}
          plain vanilla; lo valuamos de dos maneras equivalentes: como diferencia de
          dos bonos, y como un portfolio de FRAs. Después extendemos la idea a los{" "}
          <span className="text-text">currency swaps</span> y vemos por qué la ventaja
          comparativa hace que dos partes ganen al hacer swap.
        </Lead>

        <Section id="mecanica" title="Mecánica y cashflows">
          <p>
            <span className="text-text">Plain vanilla IR swap</span>: dos contrapartes
            intercambian flujos basados en un notional <K tex={"L"} />.
          </p>
          <ul className="ml-5 list-disc space-y-1">
            <li>Una paga <span className="text-text">fija</span> (<K tex={"R_{fix}"} />).</li>
            <li>
              La otra paga <span className="text-text">flotante</span> (típicamente
              LIBOR/SOFR + spread).
            </li>
          </ul>
          <p>
            En cada fecha de pago se netea el diferencial. <span className="text-text">No se
            intercambia el notional</span> — es solo un nocional de referencia para
            calcular los intereses.
          </p>
          <p>Net cashflow de quien <span className="text-text">recibe fijo</span> en <K tex={"t"} />:</p>
          <Eq tex={"L \\cdot (R_{fix} - R_{float,\\,t-1}) \\cdot \\tau"} />
          <Note kind="key">
            El flotante de cada período se fija al inicio del período (en{" "}
            <K tex={"t-1"} />) y se paga al final (en <K tex={"t"} />). Por eso el primer
            cupón flotante de un swap en curso ya está conocido.
          </Note>
          <p className="text-[13.5px] text-dim">
            Probá la mecánica con flujos netos en el{" "}
            <Link href="/parity" className="text-brass underline-offset-2 hover:underline">
              lab
            </Link>
            .
          </p>
        </Section>

        <Section id="valuacion" title="Valuación — bond approach">
          <p>
            La forma más directa de valuar un IR swap (Hull 7.7) es verlo como la{" "}
            <span className="text-text">diferencia de dos bonos</span>: quien recibe fijo
            es largo un bono de tasa fija y corto un bono flotante.
          </p>
          <Eq tex={"V_{swap}^{\\text{recibe fijo}} = B_{fix} - B_{flt}"} />
          <p>
            <K tex={"B_{fix}"} /> es el PV del bono fijo (cupones más el notional al
            final); <K tex={"B_{flt}"} /> es el PV del bono flotante, que vale notional
            más el próximo cupón conocido, descontado a la primera fecha:
          </p>
          <Eq tex={"B_{fix} = \\sum_i k\\, e^{-r_i t_i} + L\\, e^{-r_n t_n}, \\quad k = L\\, R_{fix}\\, \\tau"} />
          <Eq tex={"B_{flt} = (L + k^{*})\\, e^{-r_1 t_1}"} />

          <Sub>Par swap rate</Sub>
          <p>
            La <span className="text-text">par swap rate</span> es la tasa fija que hace
            que el swap valga cero al iniciar (<K tex={"V_{swap} = 0"} />):
          </p>
          <Eq tex={"r_{par} = \\frac{1 - e^{-r_n t_n}}{\\tau \\sum_i e^{-r_i t_i}}"} />
          <p className="text-[13.5px] text-dim">
            Calculá <K tex={"B_{fix}"} />, <K tex={"B_{flt}"} /> y la par rate sobre una
            zero curve en el{" "}
            <Link href="/parity" className="text-brass underline-offset-2 hover:underline">
              lab
            </Link>
            .
          </p>

          <Sub>Ventaja comparativa — el &ldquo;teorema de la felicidad compartida&rdquo;</Sub>
          <p>
            Los swaps permiten <span className="text-text">arbitrar ventajas
            comparativas</span> entre contrapartes con distintas calidades crediticias.
            Si dos empresas tienen acceso diferenciado a los mercados de tasa fija y
            flotante, pueden hacer swap y <span className="text-text">ambas ahorrar</span>.
          </p>
          <Example title="AAACorp vs BBBCorp">
            <p>
              Dos empresas necesitan financiar <K tex={"\\$100M"} /> a 5 años. AAACorp
              (rating AAA) quiere tasa <span className="text-text">flotante</span>;
              BBBCorp (rating BBB) quiere tasa <span className="text-text">fija</span>.
            </p>
            <DataTable
              headers={["Empresa", "Fija", "Flotante"]}
              rows={[
                ["AAACorp", "4.0%", "LIBOR − 0.1%"],
                ["BBBCorp", "5.2%", "LIBOR + 0.6%"],
                ["Diferencial", "1.2% (120 bps)", "0.7% (70 bps)"],
              ]}
            />
            <p className="mt-2">Análisis:</p>
            <ol className="ml-5 list-decimal space-y-1">
              <li>Diferencial en fija: 5.2% − 4.0% = <span className="text-text">120 bps</span>.</li>
              <li>Diferencial en flotante: (LIBOR+0.6%) − (LIBOR−0.1%) = <span className="text-text">70 bps</span>.</li>
              <li>Ganancia total disponible = 120 − 70 = <span className="text-text">50 bps</span>.</li>
            </ol>
            <p>
              AAACorp tiene ventaja comparativa en <span className="text-text">fija</span>{" "}
              (el diferencial es mayor ahí); BBBCorp tiene ventaja comparativa en{" "}
              <span className="text-text">flotante</span>.
            </p>
            <p>
              <span className="text-text">Estructura con intermediario (cobra 4 bps):</span>{" "}
              total disponible 50 bps, intermediario 4 bps, quedan 46 bps para repartir →{" "}
              <span className="text-text">23 bps a cada empresa</span>.
            </p>
            <Sub>AAACorp (quería LIBOR)</Sub>
            <p>
              Paga 4.0% fija al mercado externo, recibe 4.33% del intermediario vía swap,
              paga LIBOR al intermediario. Costo neto:
            </p>
            <Eq tex={"4.0\\% - 4.33\\% + \\text{LIBOR} = \\text{LIBOR} - 0.33\\%"} />
            <Note kind="success" title="Ahorro AAACorp">
              23 bps vs LIBOR − 0.1% directo.
            </Note>
            <Sub>BBBCorp (quería fija)</Sub>
            <p>
              Paga LIBOR + 0.6% al mercado externo, recibe LIBOR del intermediario, paga
              4.37% al intermediario. Costo neto:
            </p>
            <Eq tex={"\\text{LIBOR} + 0.6\\% - \\text{LIBOR} + 4.37\\% = 4.97\\%"} />
            <Note kind="success" title="Ahorro BBBCorp">
              23 bps vs 5.2% directo.
            </Note>
            <Note kind="info" title="Teorema de la felicidad compartida">
              Cuando dos partes tienen ventajas comparativas opuestas en dos mercados,
              pueden hacer swap y <span className="text-text">ambas mejorar</span>. Total
              repartido: 23 + 23 + 4 = <span className="text-text">50 bps</span>.
            </Note>
          </Example>

          <Example title="Hull 7.2 — WhiteRock (V ≈ $0.5117M)">
            <p>Parámetros:</p>
            <ul className="ml-5 list-disc space-y-1">
              <li>WhiteRock <span className="text-text">recibe</span> LIBOR 6m, <span className="text-text">paga</span> 3% fijo (semestral).</li>
              <li>Notional: $100 millones. Vida restante: 15 meses.</li>
              <li>LIBOR zeros: 3m = 2.8%, 9m = 3.2%, 15m = 3.4%.</li>
              <li>Próxima LIBOR fijada: 2.9%.</li>
            </ul>
            <Sub>Pierna fija (paga 3% anual = 1.5% semestral)</Sub>
            <DataTable
              headers={["Time (años)", "Cash Flow ($M)", "Zero rate", "DF", "PV ($M)"]}
              rows={[
                ["0.25", "$1.50", "2.8%", "0.9930", "$1.4895"],
                ["0.75", "$1.50", "3.2%", "0.9763", "$1.4644"],
                ["1.25", "$101.50", "3.4%", "0.9584", "$97.2766"],
              ]}
            />
            <p>
              <K tex={"B_{fix}"} /> = suma de PVs ≈ <span className="text-text">$100.2306M</span>.
            </p>
            <Sub>Pierna flotante (recibe LIBOR)</Sub>
            <p>
              El próximo pago ya está fijado por la LIBOR observada (2.9%): cupón conocido
              = $100M × 2.9% × 0.5 = <span className="text-text">$1.45M</span>. El bono
              flotante vale (notional + próximo cupón) descontado a la primera fecha:
            </p>
            <Eq tex={"B_{flt} = (L + k^{*})\\, e^{-r_1 t_1}"} />
            <Eq tex={"B_{flt} = (100 + 1.45)\\, e^{-0.028 \\times 0.25} = 100.7423"} />
            <DataTable
              headers={["Componente", "Valor"]}
              rows={[
                [<K key="bf" tex={"B_{flt}"} />, "$100.7423M"],
                [<K key="bx" tex={"B_{fix}"} />, "$100.2306M"],
                [<span key="v" className="text-text">V_swap (recibe float)</span>, "+$0.5117M"],
              ]}
            />
            <Note kind="success" title="Resultado">
              <K tex={"V_{swap} = B_{flt} - B_{fix} = 100.7423 - 100.2306 = \\$0.5117M"} />.
              WhiteRock, como fixed-rate payer, tiene un swap con valor positivo de unos
              $511.700. Si cerraran la posición hoy, ganarían exactamente ese monto.
            </Note>
          </Example>
        </Section>

        <Section id="currency-swaps" title="Swaps de monedas">
          <p>En un <span className="text-text">currency swap</span>, dos partes intercambian:</p>
          <ol className="ml-5 list-decimal space-y-1">
            <li>Notionales al inicio (en monedas distintas).</li>
            <li>Pagos periódicos de interés (en cada moneda).</li>
            <li>Notionales al vencimiento (devuelven lo recibido).</li>
          </ol>
          <Note kind="key" title="Diferencia clave vs IR swap">
            Acá <span className="text-text">sí</span> se intercambia el notional, al
            inicio y al final.
          </Note>

          <Sub>Mecánica — IBM / British Petroleum</Sub>
          <p>Setup:</p>
          <ul className="ml-5 list-disc space-y-1">
            <li>IBM paga <span className="text-text">5% GBP</span>, recibe <span className="text-text">6% USD</span>.</li>
            <li>BP paga 6% USD, recibe 5% GBP.</li>
            <li>Notionales: USD 15M y GBP 10M. Pagos anuales por 5 años.</li>
          </ul>
          <DataTable
            headers={["Año", "USD recibido", "GBP pagado", "Nota"]}
            rows={[
              ["2020", "$15.000.000", "£10.000.000", "Intercambio inicial de notionales"],
              ["2021", "$900.000", "£500.000", "Pago de intereses"],
              ["2022", "$900.000", "£500.000", "Pago de intereses"],
              ["2023", "$900.000", "£500.000", "Pago de intereses"],
              ["2024", "$900.000", "£500.000", "Pago de intereses"],
              ["2025", "$15.900.000", "£10.500.000", "Último pago + devolución notionales"],
            ]}
          />
          <Note kind="info" title="Puntos clave">
            (1) Los notionales se intercambian al inicio en sentido opuesto a los flujos
            posteriores. (2) Los intereses se pagan periódicamente en cada moneda. (3) Al
            final se devuelven los notionales — distinto de un IR swap, donde el notional
            nunca se mueve.
          </Note>

          <Sub>Valuación USD/JPY</Sub>
          <p>Parámetros:</p>
          <ul className="ml-5 list-disc space-y-1">
            <li>Tasas continuas: <K tex={"r_{USD}"} /> = 9%, <K tex={"r_{JPY}"} /> = 4%.</li>
            <li>Swap fixed-for-fixed: recibe <span className="text-text">5% anual JPY</span>, paga <span className="text-text">8% anual USD</span>.</li>
            <li>Notionales: JPY 1.200M y USD 10M. Vida restante: 3 años. Spot: 110 JPY/USD.</li>
          </ul>
          <p>
            <span className="text-text">Método 1 — portfolio de bonos.</span> El valor del
            swap es el bono extranjero (convertido a moneda local al spot) menos el bono
            doméstico:
          </p>
          <Eq tex={"V_{swap} = \\frac{B_{JPY}}{S_0} - B_{USD}"} />
          <DataTable
            headers={["Métrica", "Valor"]}
            rows={[
              [<K key="busd" tex={"B_{USD}"} />, "$9.6439M"],
              [<K key="bjpy" tex={"B_{JPY}"} />, "¥1.230.55M"],
              [<span key="conv" className="text-text">B_JPY → USD</span>, "$11.1868M (¥1.230,55M ÷ 110)"],
              [<span key="v" className="text-text">V_swap (recibe JPY, paga USD)</span>, "≈ $1.543M"],
            ]}
          />
          <Note kind="success" title="Método 1 — resultado">
            <K tex={"V_{swap} = B_{JPY}/S_0 - B_{USD} \\approx \\$1.543M"} />.
          </Note>
          <p>
            <span className="text-text">Método 2 — portfolio de forwards.</span> Cada flujo
            en moneda extranjera se convierte a moneda local usando la forward rate de su
            fecha, se netea contra el flujo doméstico y se descuenta:
          </p>
          <Eq tex={"V_{swap} = \\sum_i \\left(\\text{CF}_i^{\\,f}\\, F_i - \\text{CF}_i^{\\,d}\\right) e^{-r_i t_i}"} />
          <Note kind="success" title="Método 2 — resultado">
            <K tex={"V_{swap} = \\sum \\text{PV netos} \\approx \\$1.543M"} /> — mismo
            resultado que el método de bonos.
          </Note>

          <Sub>Ventaja comparativa — GE / Qantas</Sub>
          <p>Situación:</p>
          <ul className="ml-5 list-disc space-y-1">
            <li><span className="text-text">GE</span> (USA) necesita AUD 20M para un proyecto en Australia.</li>
            <li><span className="text-text">Qantas</span> (Australia) necesita USD 18M para comprar aviones.</li>
          </ul>
          <DataTable
            headers={["Empresa", "USD", "AUD"]}
            rows={[
              ["GE", "5.0%", "7.6%"],
              ["Qantas", "7.0%", "8.0%"],
              ["Diferencial", "2.0%", "0.4%"],
            ]}
          />
          <ul className="ml-5 list-disc space-y-1">
            <li>GE tiene ventaja comparativa en <span className="text-text">USD</span> (diferencial 2.0% vs 0.4%).</li>
            <li>Qantas tiene ventaja comparativa en <span className="text-text">AUD</span>.</li>
            <li>Ganancia disponible: 2.0% − 0.4% = <span className="text-text">1.6%</span>.</li>
          </ul>
          <p>
            Con intermediario cobrando 0.2% en cada moneda → reparto 0.7% GE / 0.5% Qantas.
          </p>
          <Example title="General Electric">
            <p>
              Toma USD 18M al 5.0% (su ventaja); swap: paga AUD 6.9%, recibe USD 5.0%.
              Costo neto AUD: <span className="text-text">6.9%</span> → ahorro 0.7% vs
              7.6% directo.
            </p>
          </Example>
          <Example title="Qantas Airways">
            <p>
              Toma AUD 20M al 8.0% (su ventaja); swap: paga USD 6.5%, recibe AUD 8.0%.
              Costo neto USD: <span className="text-text">6.5%</span> → ahorro 0.5% vs
              7.0% directo.
            </p>
          </Example>
          <Note kind="warning" title="Nota práctica">
            Qantas termina descalzado en FX (recibe AUD 8% que cancela su deuda, pero solo
            tiene ingresos AUD operativos). En la práctica esa exposición la administra el
            intermediario con otros derivados.
          </Note>
        </Section>

        <Section id="formulas" title="Formulario — Hull Cap 7">
          <p>Valuación de IR swap por bond approach (receive fixed):</p>
          <Eq tex={"V_{swap} = B_{fix} - B_{flt}"} />
          <Eq tex={"B_{fix} = \\sum_i k\\, e^{-r_i t_i} + L\\, e^{-r_n t_n}, \\quad k = L\\, r_{fix}\\, \\tau"} />
          <Eq tex={"B_{flt} = (L + k^{*})\\, e^{-r_1 t_1}"} />
          <p>Par swap rate — la fija que hace <K tex={"V_{swap} = 0"} />:</p>
          <Eq tex={"r_{par} = \\frac{1 - e^{-r_n t_n}}{\\tau \\sum_i e^{-r_i t_i}}"} />
          <p>Currency swap — bond approach:</p>
          <Eq tex={"V_{swap} = \\frac{B_{\\text{foreign}}}{S_0} - B_{\\text{domestic}}"} />
          <p>Currency swap — forward approach:</p>
          <Eq tex={"V_{swap} = \\sum_i \\left(\\text{CF}_i^{\\,f}\\, F_i - \\text{CF}_i^{\\,d}\\right) e^{-r_i t_i}"} />
        </Section>
      </Prose>
    </UnitShell>
  );
}
