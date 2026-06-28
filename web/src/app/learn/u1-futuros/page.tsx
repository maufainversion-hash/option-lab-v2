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
    <UnitShell slug="u1-futuros">
      <Prose>
        <Lead>
          Un derivado es un contrato cuyo valor deriva del precio de otro activo.
          Esta unidad arma la mecánica del contrato a futuro —estandarización,
          clearing house, mark-to-market y márgenes— y ubica a los tres actores que
          mueven el mercado: hedgers, especuladores y arbitrajistas.
        </Lead>

        <Section id="derivados" title="1 · ¿Qué es un derivado?">
          <p>
            Un <span className="text-text">derivado</span> es un instrumento
            financiero cuyo <span className="text-text">valor deriva</span> del
            precio de otro activo, llamado <span className="text-text">subyacente</span>.
            No es el activo en sí: es un contrato cuyo P&amp;L depende de lo que le
            pase a ese activo.
          </p>
          <p>
            El subyacente puede ser cualquier cosa cuyo precio se pueda medir:
            acciones, índices bursátiles, commodities (oil, oro, soja), divisas,
            tasas de interés, bonos, electricidad, eventos climáticos, créditos,
            hasta volatilidad misma.
          </p>
          <p>
            <span className="text-text">Las 4 grandes familias de derivados</span>{" "}
            (Hull Cap 1):
          </p>
          <DataTable
            headers={["Familia", "Qué es", "Ejemplo típico"]}
            rows={[
              [<b key="a">Forwards</b>, "Acuerdo bilateral para comprar/vender en T a precio K", "Importador fija USD/ARS a 90 días"],
              [<b key="b">Futuros</b>, "Forward estandarizado y listado en exchange", "Dólar futuro en MATBA Rofex"],
              [<b key="c">Opciones</b>, "Derecho (no obligación) de comprar/vender a K", "Call sobre GGAL en BYMA"],
              [<b key="d">Swaps</b>, "Intercambio periódico de flujos entre 2 partes", "IR swap fijo vs LIBOR"],
            ]}
          />
        </Section>

        <Section id="que-es-futuro" title="2 · ¿Qué es un futuro específicamente?">
          <p>
            Un <span className="text-text">contrato futuro</span> es un acuerdo{" "}
            <span className="text-text">estandarizado</span> para comprar (long) o
            vender (short) una cantidad fija de un activo subyacente, a un{" "}
            <span className="text-text">precio acordado hoy</span>, con entrega en
            una <span className="text-text">fecha futura específica</span>.
          </p>
          <p>
            <span className="text-text">Las 5 propiedades que definen un futuro:</span>
          </p>
          <ol className="ml-5 list-decimal space-y-2">
            <li>
              <span className="text-text">Estandarización total</span>: el exchange
              define todo —tamaño del contrato (ej. 100 oz de oro), vencimiento (ej.
              3er viernes del mes), calidad del subyacente, lugar de entrega. Vos solo
              elegís precio y cantidad de contratos.
            </li>
            <li>
              <span className="text-text">Negociación en exchange</span>: cotiza en
              mercado centralizado (CME, ICE, MATBA Rofex). Liquidez transparente,
              precios públicos.
            </li>
            <li>
              <span className="text-text">Clearing house como contraparte</span>: la
              cámara compensadora se interpone entre comprador y vendedor. Vos no le
              debés al otro lado del trade, le debés a la cámara. Esto elimina
              counterparty risk individual.
            </li>
            <li>
              <span className="text-text">Mark-to-market diario</span>: tu posición se
              revalúa cada día, las ganancias/pérdidas se acreditan/debitan en tu
              cuenta de margen. Si tu balance cae bajo el <em>maintenance level</em>,
              recibís un <span className="text-text">margin call</span>.
            </li>
            <li>
              <span className="text-text">Liquidación</span>: la mayoría se cierra
              antes del vencimiento por <span className="text-text">offset</span>{" "}
              (tomás la posición opuesta). Las que llegan a vencimiento se liquidan
              por <span className="text-text">physical delivery</span> (commodities) o{" "}
              <span className="text-text">cash settlement</span> (índices, tasas).
            </li>
          </ol>
          <Note kind="key" title="Forward vs Futuro en una frase">
            El forward es un acuerdo bilateral hecho a medida; el futuro es un forward
            estandarizado que cotiza en bolsa, con margen diario y clearing house en
            el medio.
          </Note>
        </Section>

        <Section id="para-que-sirven" title="3 · ¿Para qué sirven los derivados?">
          <p>Cuatro funciones económicas centrales (Hull Cap 1):</p>
          <Sub>(a) Gestión de riesgo (hedging)</Sub>
          <p>
            Transferir riesgo de quien no lo quiere a quien sí. Un exportador agro
            tiene exposición natural al precio de la soja: si baja, pierde. Si vende
            futuros de soja, transfiere ese riesgo al mercado a cambio de{" "}
            <span className="text-text">certeza</span>. Cuando la soja baje, la pérdida
            del físico se compensa con la ganancia del futuro short.
          </p>
          <Sub>(b) Especulación</Sub>
          <p>
            Tomar posiciones direccionales con{" "}
            <span className="text-text">eficiencia de capital</span>. Un hedge fund que
            cree que el oro va a subir compra futuros: con un margen del ~10% del
            notional, controla la exposición completa. Si acierta, el ROI sobre el
            margen es enorme; si se equivoca, también.
          </p>
          <Sub>(c) Arbitraje</Sub>
          <p>
            Explotar ineficiencias de precio entre mercados. Si el futuro de oro está
            demasiado caro respecto al spot (<K tex={"F_0 > S_0 e^{rT}"} /> más costos),
            un arbitrajista compra spot, vende futuro, y se queda con la diferencia{" "}
            <em>risk-free</em>. La acción de los arbitrajistas presiona los precios
            hasta que la oportunidad desaparece.
          </p>
          <Sub>(d) Descubrimiento de precios</Sub>
          <p>
            Los precios de futuros agregan las expectativas de miles de participantes.
            El futuro de dólar a 90 días en MATBA Rofex no es solo un precio: es la
            mejor estimación pública de qué va a pasar con el FX. Bancos centrales,
            empresas y traders los miran para tomar decisiones.
          </p>
        </Section>

        <Section id="actores" title="4 · Los 3 tipos de inversores">
          <p>Hull divide a los participantes en tres categorías por motivación:</p>
          <DataTable
            headers={["Tipo", "Motivación", "Ejemplo argentino típico", "Trade-off"]}
            rows={[
              [<b key="a">Hedger</b>, "Reducir un riesgo que YA tiene", "Exportador agro short futuro de soja para fijar el precio de venta", "Renuncia al upside a cambio de certeza"],
              [<b key="b">Especulador</b>, "Tomar riesgo NUEVO apostando a una dirección", "Trader compra dólar futuro porque cree que el peso se va a devaluar", "Alto leverage = alto retorno o alta pérdida"],
              [<b key="c">Arbitrajista</b>, "Capturar mispricing risk-free", "Arbitra CCL vs MEP cuando se abre el spread", "Requiere capital, velocidad y bajos costos"],
            ]}
          />
          <p>
            <span className="text-text">Ejemplos concretos por tipo:</span>
          </p>
          <Example title="Hedger · Aerolínea cubriendo combustible">
            <ul className="ml-4 list-disc space-y-1">
              <li>Tiene gastos de jet fuel garantizados.</li>
              <li>Compra futuros de crudo (cross-hedge porque no hay futuro líquido de jet fuel).</li>
              <li>Si el petróleo sube → su combustible sube, pero la ganancia del futuro lo compensa.</li>
              <li>
                Si el petróleo baja → su combustible baja, pero pierde en el futuro.
                Resultado: <span className="text-text">costo fijado</span>.
              </li>
            </ul>
          </Example>
          <Example title="Especulador · Hedge fund con tesis macro sobre el peso">
            <ul className="ml-4 list-disc space-y-1">
              <li>Cree que en 6 meses ARS va a estar más débil vs USD.</li>
              <li>Compra dólar futuro Rofex con margen ~10%.</li>
              <li>Si acierta: la ganancia del futuro sobre el margen es 5x-10x el movimiento %.</li>
              <li>Si erra: pierde 5x-10x. Margin calls posibles si la posición se mueve en contra.</li>
            </ul>
          </Example>
          <Example title="Arbitrajista · Trading desk de banco haciendo cash & carry">
            <ul className="ml-4 list-disc space-y-1">
              <li>Detecta que el futuro de oro a 6 meses cotiza por encima del fair value (<K tex={"S_0 e^{rT}"} />).</li>
              <li>Compra oro spot, vende futuro, financia la posición.</li>
              <li>Al vencimiento entrega el oro, cobra el strike, devuelve el préstamo.</li>
              <li>Profit risk-free = <K tex={"F_0 - S_0 e^{rT}"} /> (asumiendo costos pequeños).</li>
            </ul>
          </Example>
        </Section>

        <Section id="mercados" title="5 · Mercados principales">
          <Sub>Global</Sub>
          <ul className="ml-5 list-disc space-y-1">
            <li>
              <span className="text-text">CME Group</span> (Chicago Mercantile
              Exchange): el más grande del mundo. Agrupa CME (índices, FX, tasas), CBOT
              (granos, treasuries), NYMEX (energía), COMEX (metales).
            </li>
            <li>
              <span className="text-text">ICE</span> (Intercontinental Exchange):
              energía (Brent), commodities, equity índices.
            </li>
            <li><span className="text-text">Eurex</span>: derivados europeos, bonos, equity.</li>
            <li><span className="text-text">HKEX, JPX</span>: Asia.</li>
          </ul>
          <Sub>Argentina</Sub>
          <ul className="ml-5 list-disc space-y-1">
            <li>
              <span className="text-text">MATBA Rofex</span> (Mercado a Término de
              Buenos Aires + Rofex, fusión 2018): futuros de{" "}
              <span className="text-text">dólar Rofex</span>, commodities agro (soja,
              maíz, trigo), tasas Badlar.
            </li>
            <li>
              <span className="text-text">MAE</span> (Mercado Abierto Electrónico):
              bonos, FX, repo.
            </li>
            <li>
              <span className="text-text">BYMA</span> (Bolsas y Mercados Argentinos):
              equity, opciones sobre acciones líderes.
            </li>
          </ul>
          <Note kind="info" title="Regulación">
            En USA la <span className="text-text">CFTC</span> (futuros) +{" "}
            <span className="text-text">SEC</span> (securities). En Argentina la{" "}
            <span className="text-text">CNV</span> (Comisión Nacional de Valores)
            supervisa todos los mercados y el <span className="text-text">BCRA</span>{" "}
            regula el mercado FX.
          </Note>
        </Section>

        <Section id="tamano-riesgos" title="6 · Tamaño y riesgos del mercado">
          <p>
            El mercado <span className="text-text">global de derivados</span> tiene un{" "}
            <span className="text-text">notional outstanding</span> de ~$700 trillones
            (BIS 2024), aproximadamente <span className="text-text">7 veces el PIB
            mundial</span>. Pero ojo: el notional sobreestima la exposición real. El{" "}
            <span className="text-text">gross market value</span> (lo que realmente
            vale el portfolio si se cerrara hoy) es mucho menor, ~$20T.
          </p>
          <DataTable
            headers={["Riesgo", "Qué es", "Mitigación"]}
            rows={[
              [<b key="a">Market risk</b>, "Pérdida por movimiento del subyacente", "Diversificación, stop-loss"],
              [<b key="b">Counterparty risk</b>, "Que la otra parte no pague", "Clearing house, colateral diario"],
              [<b key="c">Liquidity risk</b>, "No poder cerrar a precio razonable", "Operar mercados profundos"],
              [<b key="d">Model risk</b>, "Tu modelo de valuación está mal", "Validación independiente, stress tests"],
              [<b key="e">Operational risk</b>, "Errores humanos / sistemas", "Controles, reconciliaciones"],
              [<b key="f">Systemic risk</b>, "Crisis afecta a todos a la vez", "Regulación, requisitos de capital"],
            ]}
          />
          <Note kind="hull" title="Historia breve de los derivados">
            <ul className="space-y-2">
              <li>
                <span className="text-text">Siglo XVII Japón</span> — mercados de arroz
                en Dojima son los primeros futuros modernos. Los samurai recibían su
                salario en arroz y vendían contratos a término para fijar el valor
                monetario.
              </li>
              <li>
                <span className="text-text">1848 — CBOT (Chicago Board of Trade)</span> —
                el primer exchange de futuros moderno. Inicialmente centrado en granos
                del Midwest. Estandariza contratos y crea la cámara compensadora.
              </li>
              <li>
                <span className="text-text">1972 — Futuros de divisas</span> — el
                colapso de Bretton Woods (oro/dólar fijo) genera la necesidad de
                hedgear FX. CME crea el International Monetary Market.
              </li>
              <li>
                <span className="text-text">1973 — Opciones listadas + Black-Scholes</span>{" "}
                — CBOE abre como primer mercado de opciones listadas. Mismo año, Fischer
                Black, Myron Scholes y Robert Merton publican el modelo BSM.
              </li>
              <li>
                <span className="text-text">1980s-90s — Explosión de derivados OTC</span>{" "}
                — swaps de tasas, currency swaps, exotic options. Crecimiento
                exponencial.
              </li>
              <li>
                <span className="text-text">2008 — Crisis subprime</span> — los CDOs y
                credit derivatives detonan la crisis financiera global. Bear Stearns,
                Lehman, AIG. La opacidad del mercado OTC queda al descubierto.
              </li>
              <li>
                <span className="text-text">Post-2010 — Reformas</span> — Dodd-Frank
                (USA), EMIR (Europa). Centralización del clearing OTC, reporting
                obligatorio, márgenes para non-cleared trades.
              </li>
              <li>
                <span className="text-text">Hoy</span> — el mercado es ~$700T notional.
                La mayor parte sigue siendo OTC (swaps de tasas IBOR/OIS) pero el
                ecosistema regulatorio post-2010 lo hizo sustancialmente más robusto
                que en 2008.
              </li>
            </ul>
          </Note>
        </Section>

        <Section id="forward-vs-futuro" title="7 · Forward vs Futuro">
          <p>
            <span className="text-text">Forward</span> — contrato bilateral, sin
            clearing, sin colateral diario, liquidación una sola vez al vencimiento.
            P&amp;L = <K tex={"(S_T - K)"} /> × notional.
          </p>
          <p>
            <span className="text-text">Futuro</span> — estandarizado, listado en
            exchange (CME, ICE, MATBA Rofex), con clearing house, margins iniciales y
            diarios (mark-to-market). Permite cerrar posición offsetting.
          </p>
          <Sub>Comparación completa: Exchange (Futuros) vs OTC (Forwards)</Sub>
          <DataTable
            headers={["Característica", "Exchange (Futuros)", "OTC (Forwards)"]}
            rows={[
              ["Negociación", "Exchange centralizado (CME, MATBA Rofex)", "Bilateral entre dos partes"],
              ["Contratos", "Estandarizados (tamaño y vencimiento fijo)", "Customizados a medida del cliente"],
              ["Liquidez", "Alta — mercado secundario activo", "Baja — difícil salir antes del vencimiento"],
              ["Riesgo de contraparte", "Mínimo — cámara compensadora interviene", "Alto — depende de la contraparte"],
              ["Margen", "Requerido (inicial + mantenimiento)", "No requerido (o negociado bilateralmente)"],
              ["Settlement", "Daily marking-to-market", "Una sola vez al vencimiento"],
              ["Regulación", "Fuerte supervisión regulatoria", "Menos regulados"],
              ["Flexibilidad", "Baja — términos fijos", "Alta — términos negociables"],
            ]}
          />
          <Note kind="info" title="Cuándo usar cada uno">
            Futuros si necesitás liquidez y querés minimizar riesgo de contraparte.
            Forwards si necesitás términos exactos (fecha/monto específicos) y tenés
            confianza en la contraparte.
          </Note>
          <Note kind="hull" title="Hull pp. 6-10 + Cap 2">
            <p>
              Cap 1: el derivado es un instrumento cuyo valor deriva del precio de otro
              asset. Las cuatro categorías: forwards, futuros, opciones, swaps.
            </p>
            <p className="mt-2">
              Cap 2: el rol de la <span className="text-text">clearing house</span> es
              interponerse entre comprador y vendedor —cada participante tiene la CH
              como contraparte, no al otro lado del trade. Por eso el counterparty risk
              se mitiga: si vos defaulteás, los demás no sufren porque la CH absorbe vía
              el sistema de margins.
            </p>
            <p className="mt-2">
              <span className="text-text">Margin calls</span>: si tu balance cae por
              debajo del <em>maintenance margin level</em>, el broker te llama para
              reponer al <em>initial margin level</em>. Si no respondés, te liquidan la
              posición.
            </p>
          </Note>
        </Section>

        <Section id="mark-to-market" title="8 · Mark-to-market y márgenes">
          <p>
            <span className="text-text">Mark-to-market diario</span> — la posición se
            revalúa cada día y la diferencia se cobra o se paga vía la cuenta de margin.
            Si la margin baja del <em>maintenance level</em>, hay{" "}
            <span className="text-text">margin call</span> y hay que reponer al{" "}
            <em>initial level</em>.
          </p>
          <p>P&amp;L diario de una posición long de <K tex={"n"} /> contratos:</p>
          <Eq tex={"\\text{P\\&L}_t = (F_t - F_{t-1}) \\times \\text{multiplicador} \\times n"} />
          <p>La regla del margin call:</p>
          <Eq tex={"\\text{balance} < \\text{maintenance} \\;\\Rightarrow\\; \\text{reponer hasta initial margin}"} />
          <Example title="Hull · Oro (200 contratos)">
            <p>
              <span className="text-text">Escenario clásico de Hull:</span>
            </p>
            <ul className="ml-4 list-disc space-y-1">
              <li>200 contratos de oro (100 oz cada uno)</li>
              <li>Precio inicial: $1,250/oz</li>
              <li>Margen inicial: $6,000/contrato → <span className="text-text">$1,200,000 total</span></li>
              <li>Mantenimiento: $4,500/contrato → <span className="text-text">$900,000 total</span></li>
              <li>Día 1: precio cae a $1,239</li>
            </ul>
            <p>
              <span className="text-text">Análisis paso a paso:</span>
            </p>
            <ol className="ml-4 list-decimal space-y-1">
              <li>Pérdida diaria: caída de $11/oz × 100 oz × 200 contratos = <span className="text-text">−$220,000</span></li>
              <li>Saldo cuenta: $1,200,000 − $220,000 = <span className="text-text">$980,000</span></li>
              <li>¿Margin call? $980,000 &gt; $900,000 (mantenimiento) → <span className="text-text">NO hay margin call aún</span></li>
              <li>Si el precio sigue cayendo y el saldo cruza &lt; $900,000, el broker te llama para reponer hasta $1,200,000 (initial level).</li>
            </ol>
          </Example>
          <Note kind="info">
            Practicá la evolución del balance de margin paso a paso en el{" "}
            <Link href="/pricing" className="text-brass hover:underline">
              laboratorio de pricing
            </Link>
            .
          </Note>
        </Section>

        <Section id="convergencia" title="9 · Convergencia spot-futuro">
          <p>
            Al vencimiento de un futuro: <K tex={"F_T \\to S_T"} /> (convergencia). Si
            no convergiera, hay arbitraje:
          </p>
          <ul className="ml-5 list-disc space-y-1">
            <li>Si <K tex={"F_T > S_T"} /> justo antes de vencer: short el futuro, long spot, deliver.</li>
            <li>Si <K tex={"F_T < S_T"} />: long futuro, recibir entrega, short spot.</li>
          </ul>
          <p>
            La velocidad de convergencia depende del cost of carry y la liquidez
            residual del contrato.
          </p>
          <Eq tex={"F_T \\;\\longrightarrow\\; S_T"} />
        </Section>

        <Section id="apalancamiento" title="10 · Especulación y apalancamiento">
          <p>
            Los futuros permiten <span className="text-text">apalancamiento</span>:
            controlás una posición grande con un capital chico (solo el margen).
            Comparemos dos estrategias que toman la misma exposición —spot vs futuros—
            sobre £250.000 con el GBP pasando de 1,6000 a 1,6500 USD/GBP.
          </p>
          <DataTable
            headers={["Estrategia", "Capital invertido", "Ganancia", "ROI"]}
            rows={[
              [<b key="a">Compra spot</b>, "$400.000 (£250k × 1,60)", "$12.500", "3,13%"],
              [<b key="b">Futuros GBP</b>, "$20.000 (4 contratos × $5.000 margen)", "$12.500", "62,50%"],
            ]}
          />
          <p>
            Contrato GBP futuro: £62.500 por contrato → para controlar £250.000 hacen
            falta 4 contratos. Ambas estrategias tienen la{" "}
            <span className="text-text">misma ganancia absoluta</span> ($12.500) porque
            controlan la misma exposición, pero futuros requieren ~20x menos capital,
            así que el ROI dispara de 3,1% a 62,5%.
          </p>
          <Note kind="warning">
            El apalancamiento corta en los dos sentidos: amplifica las pérdidas en la
            misma proporción. Si el spot se mueve en contra y tu balance cae bajo el
            maintenance level, recibís margin calls; sin reservas para reponer, el
            broker te liquida y perdés todo el margen depositado.
          </Note>
          <Note kind="hull" title="Por qué el ROI es tan distinto">
            <p>
              La ganancia absoluta depende de la{" "}
              <span className="text-text">exposición</span> (cantidad de subyacente
              controlado), no del capital invertido. Como ambas estrategias controlan
              la misma cantidad de GBP, la ganancia absoluta es idéntica.
            </p>
            <p className="mt-2">
              El <K tex={"\\text{ROI} = \\frac{\\text{ganancia}}{\\text{margen invertido}}"} />.
              Como en futuros el capital invertido es solo el margen (típicamente 5-15%
              del notional), el denominador es chico y el ROI explota.
            </p>
          </Note>
          <Note kind="info">
            Jugá con exposición, margen y movimiento del subyacente en el{" "}
            <Link href="/pricing" className="text-brass hover:underline">
              laboratorio de pricing
            </Link>
            .
          </Note>
        </Section>

        <Section id="formulas" title="Formulario · Hull Cap 1-2">
          <p>Payoff de un forward/futuro al vencimiento:</p>
          <Eq tex={"\\text{Long} = S_T - K \\qquad \\text{Short} = K - S_T"} />
          <p>P&amp;L diario de mark-to-market (posición long de <K tex={"n"} /> contratos):</p>
          <Eq tex={"\\text{P\\&L}_t = (F_t - F_{t-1}) \\times \\text{multiplicador} \\times n"} />
          <p>Margin call — se dispara cuando el balance cae bajo el maintenance level:</p>
          <Eq tex={"\\text{balance} < \\text{maintenance} \\;\\Rightarrow\\; \\text{reponer hasta initial margin}"} />
          <p>ROI con apalancamiento — la ganancia es sobre el margen, no el notional:</p>
          <Eq tex={"\\text{ROI} = \\frac{\\text{ganancia}}{\\text{margen invertido}}"} />
          <p>Convergencia — al vencimiento el futuro converge al spot:</p>
          <Eq tex={"F_T \\;\\longrightarrow\\; S_T"} />
          <Note kind="key">
            En Cap 1-2 las fórmulas son operativas (MtM, margen). El{" "}
            <span className="text-text">pricing</span> de forwards (
            <K tex={"F_0 = S_0 e^{rT}"} />) se ve en Cap 5.
          </Note>
        </Section>
      </Prose>
    </UnitShell>
  );
}
