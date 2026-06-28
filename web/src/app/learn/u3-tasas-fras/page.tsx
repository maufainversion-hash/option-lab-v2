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
    <UnitShell slug="u3-tasas-fras">
      <Prose>
        <Lead>
          Hull 4. La materia prima de todo el resto del curso: cómo se convierte una tasa entre
          frecuencias de capitalización, cómo el mercado implica <span className="text-text">forward rates</span>{" "}
          desde la zero curve, cómo se valúa un <span className="text-text">FRA</span> y cómo la{" "}
          <span className="text-text">duration</span> mide el riesgo de tasa de un bono.
        </Lead>

        {/* ============================= COMPOUNDING ============================= */}
        <Section id="compounding" title="Compounding — conversión entre frecuencias">
          <p>
            Una misma tasa nominal significa cosas distintas según cuántas veces por año capitalice.
            La conversión entre una tasa con <K tex={"m"} /> capitalizaciones anuales{" "}
            <K tex={"R_m"} /> y su equivalente <span className="text-text">continuous compounding</span>{" "}
            <K tex={"R_c"} /> es (Hull 4.2):
          </p>
          <Eq tex={"R_c = m\\,\\ln\\!\\left(1 + \\frac{R_m}{m}\\right) \\quad \\Longleftrightarrow \\quad R_m = m\\left(e^{R_c/m} - 1\\right)"} />
          <p>
            La tasa continua <K tex={"R_c"} /> es la que se usa en BSM, en árboles binomiales, en FRAs
            y en prácticamente toda valuación de derivados. Convertir siempre a continuo antes de
            descontar.
          </p>
          <Note kind="hull" title="Hull 4.2">
            Cuanto mayor es la frecuencia de capitalización, menor es la tasa nominal necesaria para
            llegar al mismo crecimiento efectivo. En el límite <K tex={"m \\to \\infty"} /> aparece el
            compounding continuo, que es la convención natural en finanzas cuantitativas.
          </Note>
          <p>
            Probá la conversión en vivo en la{" "}
            <Link href="/parity" className="text-brass hover:underline">
              calculadora de paridad
            </Link>{" "}
            o en cualquiera de los labs de pricing, donde toda tasa se ingresa en continuo.
          </p>
        </Section>

        {/* ============================= FORWARD RATES ============================= */}
        <Section id="forward-rates" title="Forward rates desde la zero curve">
          <p>
            Dada la zero curve (las tasas spot <K tex={"R_1"} /> hasta <K tex={"T_1"} /> y{" "}
            <K tex={"R_2"} /> hasta <K tex={"T_2"} />, ambas continuas), la{" "}
            <span className="text-text">forward rate</span> que el mercado implica para el período
            futuro <K tex={"[T_1, T_2]"} /> es (Hull 4.7):
          </p>
          <Eq tex={"f_{T_1, T_2} = \\frac{R_2 T_2 - R_1 T_1}{T_2 - T_1}"} />
          <p>
            Es la tasa que el mercado <span className="text-text">implícitamente</span> pricea para ese
            tramo futuro. Si la curva es <span className="text-text">upward sloping</span> (creciente),
            las forward rates quedan por encima de las spot; si es descendente, por debajo.
          </p>

          <Sub>Bootstrap — construir la zero curve desde precios de bonos</Sub>
          <p>
            La zero curve no se observa directamente: se <span className="text-text">bootstrapea</span>{" "}
            a partir de precios de mercado mediante un procedimiento iterativo.
          </p>
          <ol className="list-decimal space-y-1 pl-5">
            <li>
              <span className="text-text">Bono más corto (zero-coupon)</span> → da la primera tasa zero
              directamente.
            </li>
            <li>
              <span className="text-text">Bonos siguientes (con cupón)</span> → se descuentan los
              cupones con las tasas zero ya conocidas y se despeja la nueva tasa zero del último
              cashflow.
            </li>
          </ol>

          <Example title="Bootstrap paso a paso — 3 bonos al par (face = 100)">
            <DataTable
              headers={["Maturity", "Cupón anual", "Precio"]}
              rows={[
                ["6 meses", "0% (zero)", "97.50"],
                ["1 año", "8%", "100.00"],
                ["1.5 años", "12%", "100.00"],
              ]}
            />
            <p>
              <span className="text-text">Paso 1 — Bono 6m (zero coupon).</span> Es un descuento puro:
            </p>
            <Eq tex={"100 = 97.50\\,e^{R_1 \\times 0.5} \\;\\Longrightarrow\\; R_1 = -\\frac{1}{0.5}\\ln\\!\\left(\\frac{97.50}{100}\\right) = 5.063\\%"} />
            <p>
              <span className="text-text">Paso 2 — Bono 1 año</span> (cupón 8% pagado semestral: $4 a
              los 6m y $104 a 1 año). Usamos <K tex={"R_1"} /> para descontar el cupón de 6m y
              despejamos <K tex={"R_2"} />:
            </p>
            <Eq tex={"100 = 4\\,e^{-R_1 \\times 0.5} + 104\\,e^{-R_2 \\times 1.0} \\;\\Longrightarrow\\; R_2 = 5.882\\%"} />
            <p>
              <span className="text-text">Paso 3 — Bono 1.5 años</span> (cupón 12% anual pagado
              semestral: $6 a los 6m, $6 al año y $106 a 1.5 años). Despejamos <K tex={"R_3"} />:
            </p>
            <Eq tex={"100 = 6\\,e^{-R_1 \\times 0.5} + 6\\,e^{-R_2 \\times 1.0} + 106\\,e^{-R_3 \\times 1.5} \\;\\Longrightarrow\\; R_3 = 6.380\\%"} />
            <p>
              <span className="text-text">Resultado final:</span> <K tex={"R(0.5) = 5.06\\%"} />,{" "}
              <K tex={"R(1.0) = 5.88\\%"} />, <K tex={"R(1.5) = 6.38\\%"} />. Estos son los spot rates
              que el mercado implica para descontar cualquier cashflow en esos plazos — una curva{" "}
              <span className="text-text">upward sloping</span>.
            </p>
          </Example>
          <Note kind="info" title="Engine disponible">
            El proceso anterior se generaliza programáticamente: un bootstrap soporta bonos zero más
            bonos con cupones semestrales y permite construir curvas largas (5y, 10y, 30y) sin hacer la
            cuenta a mano.
          </Note>
        </Section>

        {/* ============================= FRAs ============================= */}
        <Section id="fras" title="FRAs — Forward Rate Agreements">
          <p>
            Un <span className="text-text">FRA</span> es un contrato que fija una tasa de interés{" "}
            <K tex={"R_K"} /> para un período futuro <K tex={"[T_1, T_2]"} /> (Hull 4.8). Quien hace{" "}
            <span className="text-text">receive fixed</span> cobra la tasa pactada <K tex={"R_K"} /> y
            paga la flotante <K tex={"R_F"} /> que se observe en <K tex={"T_1"} />.
          </p>
          <p>Payoff en <K tex={"T_2"} /> (receive fixed) y valor hoy:</p>
          <Eq tex={"\\text{Payoff}_{T_2} = L\\,(R_K - R_F)\\,(T_2 - T_1)"} />
          <Eq tex={"V_{FRA} = L\\,(R_K - R_F)\\,(T_2 - T_1)\\,e^{-R_2 T_2}"} />
          <p>
            donde <K tex={"R_F"} /> es la <span className="text-text">forward rate</span> implícita en
            la zero curve — exactamente la del bloque anterior.
          </p>

          <Note kind="hull" title="Setup tipo Hull 4.3">
            Notional $100M, <K tex={"R_K = 4\\%"} />, <K tex={"T_1 = 3"} />, <K tex={"T_2 = 3.25"} />,
            zero a 3 años = 3% cc, zero a 3.25 años = 3.2% cc. Aplicando{" "}
            <K tex={"f = (R_2 T_2 - R_1 T_1)/(T_2 - T_1)"} /> → forward <K tex={"\\approx 5.6\\%"} /> cc
            → payoff en <K tex={"T_2 \\approx -\\$405\\text{k}"} /> → PV{" "}
            <K tex={"\\approx -\\$365\\text{k}"} />.
          </Note>
          <p>
            Podés reproducir este cálculo y variar los inputs en la{" "}
            <Link href="/pricing" className="text-brass hover:underline">
              calculadora de pricing
            </Link>
            .
          </p>

          <Sub>FRA settlement — al final vs al inicio (descontado)</Sub>
          <p>
            Un FRA produce <span className="text-text">un solo flujo</span>, pero hay dos convenciones
            sobre cuándo se paga.
          </p>
          <p>
            <span className="text-text">Método 1 — Settlement al final del período</span> (timing
            natural):
          </p>
          <Eq tex={"\\text{Pago}_{T_2} = L\\,(R_F - R_K)\\,\\tau"} />
          <p>
            donde <K tex={"\\tau = T_2 - T_1"} /> es la duración del período (day-count simple del FRA,
            típicamente ACT/360).
          </p>
          <p>
            <span className="text-text">Método 2 — Settlement al inicio del período</span> (práctica de
            mercado, en <K tex={"T_1"} />):
          </p>
          <Eq tex={"\\text{Pago}_{T_1} = \\frac{L\\,(R_F - R_K)\\,\\tau}{1 + R_F\\,\\tau}"} />
          <p>
            Es el Método 1 descontado a <K tex={"T_1"} /> con la tasa{" "}
            <span className="text-text">flotante observada</span> (no la zero curve), usando convención
            simple.
          </p>
          <Sub>¿Por qué importa?</Sub>
          <p>Operativamente es mucho más conveniente pagar al inicio:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Se elimina el riesgo de contraparte durante el período de devengo.</li>
            <li>Ambas partes saben exactamente cuánto se debe el mismo día del reset.</li>
            <li>No hay que esperar 3-6 meses hasta el settlement &quot;natural&quot;.</li>
          </ul>
          <p>
            Por eso la mayoría de los FRAs interbancarios se liquidan así (Hull 4.8).
          </p>
          <Example title="FRA 3×9 — comparación de settlement">
            <p>
              FRA 3×9 (empieza en 3 meses, dura 6 meses) sobre LIBOR 6m. Notional $1M, tasa pactada
              <K tex={"R_K = 5\\%"} />, LIBOR observada <K tex={"R_F = 5.5\\%"} />, day-count ACT/360 →
              <K tex={"\\tau = 180/360 = 0.5"} />.
            </p>
            <Eq tex={"\\text{Pago}_{T_2} = 1{,}000{,}000\\,(0.055 - 0.05)\\,(0.5) = \\$2{,}500"} />
            <Eq tex={"\\text{Pago}_{T_1} = \\frac{2{,}500}{1 + 0.055 \\times 0.5} = \\$2{,}432"} />
            <p>
              El método &quot;al inicio&quot; paga menos porque se cobra antes. Si invirtieras{" "}
              <K tex={"\\text{Pago}_{T_1}"} /> a la tasa <K tex={"R_F"} /> entre <K tex={"T_1"} /> y{" "}
              <K tex={"T_2"} />, recibirías exactamente <K tex={"\\text{Pago}_{T_2}"} />. Sin
              arbitraje, ambos métodos son equivalentes en valor presente.
            </p>
          </Example>
        </Section>

        {/* ============================= DURATION ============================= */}
        <Section id="duration" title="Duration — sensibilidad del bono al yield">
          <p>
            La <span className="text-text">duration de Macaulay</span> (Hull 4.10) es el plazo
            promedio ponderado por el PV de cada cashflow:
          </p>
          <Eq tex={"D = \\frac{\\sum_i t_i\\,\\text{CF}_i\\,e^{-y t_i}}{\\sum_i \\text{CF}_i\\,e^{-y t_i}} = \\frac{\\sum_i t_i\\,\\text{CF}_i\\,e^{-y t_i}}{B}"} />
          <p>
            La <span className="text-text">duration modificada</span> ajusta por la frecuencia de
            compounding y aproxima el cambio porcentual del precio del bono ante un movimiento del
            yield:
          </p>
          <Eq tex={"D^* = \\frac{D}{1 + y/m} \\qquad \\frac{\\Delta B}{B} \\approx -D^*\\,\\Delta y"} />
          <Note kind="key" title="Clave para el parcial">
            La aproximación <K tex={"\\Delta B / B \\approx -D^*\\,\\Delta y"} /> es{" "}
            <span className="text-text">lineal</span>: subestima el precio ante caídas grandes de yield
            y lo sobreestima ante subas grandes. El error es la convexidad — la curvatura real{" "}
            <K tex={"\\Delta B / B"} /> queda siempre por encima de la recta tangente.
          </Note>
        </Section>

        {/* ============================= FORMULARIO ============================= */}
        <Section id="formulario" title="Formulario — Capítulo 4">
          <p>Las fórmulas que se usan en esta unidad, listas para el parcial (cc = continuous compounding).</p>
          <Sub>Conversión de compounding</Sub>
          <Eq tex={"R_c = m\\,\\ln\\!\\left(1 + \\tfrac{R_m}{m}\\right) \\qquad R_m = m\\left(e^{R_c/m} - 1\\right)"} />
          <Sub>Discount factor</Sub>
          <Eq tex={"DF(T) = e^{-rT}"} />
          <Sub>Forward rate entre <K tex={"T_1"} /> y <K tex={"T_2"} /></Sub>
          <Eq tex={"f_{T_1,T_2} = \\frac{R_2 T_2 - R_1 T_1}{T_2 - T_1}"} />
          <Sub>Precio de un bono</Sub>
          <Eq tex={"B = \\sum_i \\text{CF}_i\\,e^{-R_i t_i}"} />
          <Sub>Valor de un FRA (receive fixed)</Sub>
          <Eq tex={"V_{FRA} = L\\,(R_K - R_F)\\,(T_2 - T_1)\\,e^{-R_2 T_2}"} />
          <Sub>Duration de Macaulay y modificada</Sub>
          <Eq tex={"D = \\frac{\\sum_i t_i\\,\\text{CF}_i\\,e^{-y t_i}}{B} \\qquad D^* = \\frac{D}{1 + y/m}"} />
          <Sub>Aproximación de primer orden del precio del bono</Sub>
          <Eq tex={"\\frac{\\Delta B}{B} \\approx -D^*\\,\\Delta y"} />
        </Section>
      </Prose>
    </UnitShell>
  );
}
