import Link from "next/link";
import { UnitShell } from "@/components/learn/UnitShell";
import { PayoffByRange } from "@/components/learn/PayoffByRange";
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
    <UnitShell slug="u8-estrategias">
      <Prose>
        <Lead>
          Combinando varias opciones (y a veces el subyacente) podés construir payoffs
          arbitrarios. Hull cubre las combinaciones principales: spreads, straddles, strangles,
          butterflies, cóndores y las posiciones que mezclan stock con opciones. La idea central
          es siempre la misma: el payoff de un combo es la suma de los payoffs de cada pata.
        </Lead>

        <p>
          Cada estrategia responde a una <span className="text-text">tesis de mercado</span>{" "}
          distinta —dirección, magnitud del movimiento y vista sobre la volatilidad— y cada una
          tiene su propio perfil de profit máximo, pérdida máxima y breakeven. Acá las recorremos
          una por una con la lógica de cuándo se usan, quién las usa y cuál es su riesgo
          principal. Podés armarlas y ver el diagrama de payoff en el{" "}
          <Link href="/strategies" className="text-brass hover:underline">
            laboratorio de estrategias
          </Link>
          .
        </p>

        <Section id="machete" title="Payoff por tramo — el machete">
          <p>
            La pregunta clásica del parcial: dado dónde termine el subyacente{" "}
            <K tex={"S_T"} />, ¿cuánto paga cada pata y cuál es el total? Los{" "}
            <span className="text-text">strikes parten la recta de S</span> en tramos, y en cada
            tramo el payoff es lineal. Estas son las tablas de <span className="text-brass">payoff
            bruto</span> (sin restar la prima) de las estrategias del programa —el neto se obtiene
            restando el débito o sumando el crédito de la prima neta.
          </p>
          <Note kind="key">
            En el examen conviene armar esta tabla pata por pata: para cada rango, escribís el
            valor intrínseco de cada opción (0 si está OTM) y sumás. El total constante marca dónde
            el payoff está <span className="text-text">capado</span>; donde depende de{" "}
            <K tex={"S_T"} />, la posición tiene dirección.
          </Note>
          <PayoffByRange />
        </Section>

        <Section id="fundamentos" title="La aritmética de un combo">
          <p>
            Una estrategia multi-leg es una colección de patas{" "}
            <K tex={"j"} />, cada una con una cantidad <K tex={"q_j"} /> (positiva si la comprás,
            negativa si la vendés). El payoff total al vencimiento es la suma ponderada de los
            payoffs individuales:
          </p>
          <Eq tex={"\\text{Payoff}_{\\text{combo}}(S_T) = \\sum_j q_j \\cdot \\text{payoff}_j(S_T)"} />
          <p>
            El <span className="text-text">premium neto</span> es la suma de los premiums
            cobrados y pagados. Un signo positivo significa <span className="text-text">debit</span>{" "}
            (pagás para entrar); negativo significa <span className="text-text">credit</span>{" "}
            (cobrás al entrar):
          </p>
          <Eq tex={"\\text{premium neto} = \\sum_j q_j \\cdot \\text{premium}_j"} />
          <p>
            El <span className="text-text">breakeven</span> es el spot al vencimiento donde el
            P&amp;L total —payoff menos premium neto— cruza cero:
          </p>
          <Eq tex={"\\text{Payoff}_{\\text{combo}}(S_T^{BE}) - \\text{premium neto} = 0"} />
          <Note kind="key" title="Cómo leer cada estrategia">
            Para el parcial conviene tener internalizado, por estrategia: (1) la composición de
            patas, (2) la forma del payoff, (3) el profit máximo y la pérdida máxima, y (4) el o
            los breakevens. Casi todas las preguntas de Hull Cap 11–12 se contestan con esos
            cuatro datos.
          </Note>
        </Section>

        <Section id="direccionales-simples" title="Posiciones direccionales simples">
          <Sub>Long call</Sub>
          <p>
            <span className="text-text">Composición:</span> 1 long call. Esperás que el subyacente{" "}
            <span className="text-text">suba fuerte</span> dentro del horizonte <K tex={"T"} />.
            Querés exposición direccional bullish con riesgo limitado al premium pagado. Es la
            apuesta del <span className="text-text">especulador bullish</span> con tesis concreta
            (earnings positivos, M&amp;A, noticias sectoriales) y de quien busca leverage sin
            financiar la compra del activo entero.
          </p>
          <Example title="Long call — ejemplo">
            Comprás call de YPF strike $5.000 a 60 días, premium $200. Tu tesis es que Vaca
            Muerta empuja la acción a $6.500. Si llega, ganás 1.500 − 200 ={" "}
            <span className="text-text">$1.300 por acción</span> (650% sobre el premium). Si no se
            mueve o baja, perdés solo los $200.
          </Example>
          <Note kind="warning" title="Riesgo del long call">
            El time decay (theta) come el premium todos los días. Si el subyacente queda lateral
            hasta el vencimiento, perdés el 100% del premium. La probabilidad de terminar ITM
            (<K tex={"N(d_2)"} />) suele ser 30–50% para calls OTM cortos.
          </Note>

          <Sub>Long put</Sub>
          <p>
            <span className="text-text">Composición:</span> 1 long put. La versión bearish del
            long call: esperás que el subyacente <span className="text-text">caiga fuerte</span>.
            La usa el especulador bearish (crisis sectorial, earnings malos, factor macro adverso)
            o el <span className="text-text">hedger</span> que protege una posición long sin
            venderla.
          </p>
          <Example title="Long put — ejemplo">
            Antes de elecciones inciertas comprás puts de Galicia (GGAL) strike $1.500 a 30 días,
            premium $80. Si gana un candidato market-unfriendly y la acción cae a $1.000, ganás
            500 − 80 = <span className="text-text">$420 por acción</span>. En versión hedge: tenés
            10.000 acciones de Galicia y comprás los puts para no tener que venderlas.
          </Example>
          <Note kind="hull" title="Por qué los puts son estructuralmente más caros">
            Igual que el long call, theta come premium. Además, las acciones tienen drift positivo
            esperado <K tex={"(r - q)"} />, así que estructuralmente los puts cuestan más que los
            calls; el volatility skew amplifica aún más ese efecto.
          </Note>
        </Section>

        <Section id="stock-mas-opciones" title="Stock + opciones">
          <p>
            Estas tres estrategias combinan una posición long en el subyacente con una opción.
            Sirven para generar income, comprar seguro o ambas cosas a la vez.
          </p>

          <Sub>Covered call</Sub>
          <p>
            <span className="text-text">Composición:</span> 1 long stock + 1 short call (
            <K tex={"K > \\text{spot}"} />). Tenés stock long y esperás que se mueva{" "}
            <span className="text-text">lateral o suba poco</span>. Es la estrategia de income
            generation sobre posiciones existentes, muy popular en wealth management para clientes
            que buscan renta sobre su portfolio.
          </p>
          <Example title="Covered call — ejemplo">
            Tenés 1.000 acciones de Pampa Energía a $1.800. Vendés 10 calls strike $2.000 (OTM
            11%) mensuales, cobrando $50 cada uno = $500. Si Pampa termina abajo de $2.000 te
            quedás con los $500 (~2,8% mensual extra). Si la supera, te asignan: recibís 2.000 + 50
            = $2.050 por acción (ganaste, pero perdiste el upside por arriba).
          </Example>
          <Note kind="warning" title="Riesgo del covered call">
            Cap al upside: si la acción se va a la luna, tu ganancia queda limitada en{" "}
            <K tex={"K + \\text{premium}"} />. Es el opuesto al seguro: vos vendés el seguro y
            cobrás premium a cambio de aceptar la asignación.
          </Note>

          <Sub>Protective put</Sub>
          <p>
            <span className="text-text">Composición:</span> 1 long stock + 1 long put (
            <K tex={"K < \\text{spot}"} />). Tenés stock long y querés un{" "}
            <span className="text-text">seguro contra una caída fuerte</span> sin vender la
            posición. La usa el inversor que teme un evento de cola (crisis, earnings malos,
            decisión regulatoria) pero no quiere salir del trade, y los fondos que deben limitar
            drawdown por mandato.
          </p>
          <Example title="Protective put — ejemplo">
            Tenés CEDEARs de Tesla comprados a USD 200, ahora valen USD 350. Querés proteger las
            ganancias antes del próximo earnings sin vender. Comprás puts strike $320 a 45 días,
            premium $8. Si Tesla baja a $250, el put compensa (320 − 250 = 70). Si sube o queda
            lateral, perdés solo los $8 (costo del seguro).
          </Example>
          <Note kind="warning" title="Riesgo del protective put">
            El premium es un costo permanente (como pagar el seguro del auto cada mes). En
            mercados calmos pagás premium repetidamente sin que nunca se use. Para una posición
            rolleada todo el año, el costo acumulado puede ser 5–10% del valor de la posición.
          </Note>

          <Sub>Collar</Sub>
          <p>
            <span className="text-text">Composición:</span> 1 long stock + 1 long put{" "}
            <K tex={"K_p"} /> + 1 short call <K tex={"K_c"} /> (con{" "}
            <K tex={"K_p < \\text{spot} < K_c"} />). Tenés stock long con{" "}
            <span className="text-text">ganancia acumulada</span> y querés protegerla{" "}
            <span className="text-text">sin pagar premium</span>: el collar financia el protective
            put vendiendo un covered call. La usan holders con ganancia significativa (empleados
            con stock options ya ITM, inversores que aseguran gains antes del cierre fiscal).
          </p>
          <Example title="Collar — ejemplo (zero-cost)">
            Compraste CEDEARs de Google a USD 100, ahora valen USD 180. Vendés call strike $200
            (cobrás $5) y con esos $5 comprás put strike $160 (cuesta $5). Costo neto: $0. Tu
            posición queda con piso en $160 y techo en $200 sin gastar nada de premium.
          </Example>
          <Note kind="warning" title="Riesgo del collar">
            Limitás tu upside: si Google vuela a $300, tu ganancia queda capeada en $200. Y si baja
            a $150, el put protege pero quedaste forzado por la estructura cuando quizás todavía no
            querías vender.
          </Note>
        </Section>

        <Section id="spreads-verticales" title="Spreads verticales">
          <p>
            Un spread vertical combina dos opciones del mismo tipo con strikes distintos: una
            comprada y una vendida. Bajás el costo (o cobrás credit) a cambio de capear el profit.
          </p>

          <Sub>Bull call spread</Sub>
          <p>
            <span className="text-text">Composición:</span> 1 long call <K tex={"K_1"} /> + 1 short
            call <K tex={"K_2"} /> (con <K tex={"K_1 < K_2"} />). Esperás que el subyacente{" "}
            <span className="text-text">suba moderado</span> (no x10) y querés bajar el costo del
            long call aceptando un techo al profit. La usa el especulador moderadamente bullish con
            price target concreto. El profit máximo está acotado:
          </p>
          <Eq tex={"\\text{máx profit} = (K_2 - K_1) - \\text{premium neto}"} />
          <Example title="Bull call spread — ejemplo">
            Tesla cotiza a $300 y pensás que en 60 días estará en $340. Comprás call $310 (premium
            $15) y vendés call $340 (premium $5). Costo neto: $10. Si termina en $340 o más, ganás
            30 − 10 = <span className="text-text">$20 por contrato</span> (200% sobre el costo). Si
            termina debajo de $310, perdés los $10.
          </Example>
          <Note kind="warning" title="Riesgo del bull call spread">
            Si el subyacente sube mucho más que el strike alto, tu ganancia se cappea: hubieras
            estado mejor con un long call simple. Trade-off clásico: menos costo a cambio de menos
            upside.
          </Note>

          <Sub>Bear put spread</Sub>
          <p>
            <span className="text-text">Composición:</span> 1 long put <K tex={"K_2"} /> + 1 short
            put <K tex={"K_1"} /> (con <K tex={"K_1 < K_2"} />). La versión bearish del bull call
            spread: esperás que el subyacente <span className="text-text">baje moderado</span> y
            tenés un price target.
          </p>
          <Example title="Bear put spread — ejemplo">
            Pensás que Mercado Libre corrige de $1.500 a $1.300 tras un earnings. Comprás put
            $1.450 (premium $30) y vendés put $1.300 (premium $10). Costo neto $20. Si termina en
            $1.300 o menos, ganás 150 − 20 = <span className="text-text">$130 por contrato</span>.
            Si termina por arriba de $1.450, perdés los $20.
          </Example>
          <Note kind="warning" title="Riesgo del bear put spread">
            Como el bull call invertido: cap al downside profit. Si la acción colapsa fuerte
            (fraude contable, crash sectorial), hubieras ganado más con un long put simple.
          </Note>
        </Section>

        <Section id="volatilidad" title="Estrategias de volatilidad">
          <p>
            Straddle y strangle apuestan a la <span className="text-text">magnitud</span> del
            movimiento, no a su dirección. Son posiciones long vega para eventos binarios.
          </p>

          <Sub>Long straddle</Sub>
          <p>
            <span className="text-text">Composición:</span> 1 long call + 1 long put, mismo strike{" "}
            <K tex={"K = \\text{spot}"} /> y mismo vencimiento. Esperás un{" "}
            <span className="text-text">movimiento grande pero no sabés en qué dirección</span>:
            apuesta de volatilidad pura. La usan los especuladores de volatilidad y traders
            pre-evento (earnings, FOMC, anuncios del BCRA, resultados electorales). Los breakevens
            son simétricos alrededor del strike:
          </p>
          <Eq tex={"S_T^{BE} = K \\pm (\\text{premium}_{\\text{call}} + \\text{premium}_{\\text{put}})"} />
          <Example title="Long straddle — ejemplo">
            Una semana antes del earnings de NVIDIA la IV explota, pero no sabés si será beat o
            miss. Comprás call ATM y put ATM strike $500, premium combinado $40. Si termina en $560
            ganás 60 − 40 = $20; si termina en $440, lo mismo. Si queda en $500, perdés los $40
            (caso peor).
          </Example>
          <Note kind="warning" title="Riesgo del straddle: vol crush">
            Es caro: pagás dos premiums y necesitás un movimiento grande para superar el breakeven.
            El peligro clásico es el vol crush post-evento: si la IV cae fuerte tras el anuncio,
            perdés vega aunque el direccional haya estado bien.
          </Note>

          <Sub>Long strangle</Sub>
          <p>
            <span className="text-text">Composición:</span> 1 long call <K tex={"K_2"} /> + 1 long
            put <K tex={"K_1"} />, ambos OTM (<K tex={"K_1 < \\text{spot} < K_2"} />). Mismo setup
            que el straddle pero querés <span className="text-text">gastar menos premium</span>; a
            cambio necesitás un movimiento aún mayor para ganar.
          </p>
          <Example title="Long strangle — ejemplo">
            Spot $500. Comprás call $530 (premium $8) y put $470 (premium $7), total $15 (vs $40
            del straddle ATM). Si termina entre $470 y $530 perdés todo. Pero si termina en $560 o
            $440, ganás 30 − 15 = $15 (100% del premium).
          </Example>
          <Note kind="warning" title="Riesgo del strangle">
            Zona de pérdida más amplia que el straddle: si el subyacente queda entre los dos
            strikes, perdés ambos premiums. Y necesitás un movimiento todavía mayor para
            compensar.
          </Note>
        </Section>

        <Section id="rango" title="Estrategias de rango: butterfly e iron condor">
          <p>
            Estas estrategias ganan cuando el subyacente <span className="text-text">no se mueve
            mucho</span>. Son apuestas de baja volatilidad realizada con risk-reward asimétrico.
          </p>

          <Sub>Butterfly (con calls)</Sub>
          <p>
            <span className="text-text">Composición:</span> 1 long call <K tex={"K_1"} /> + 2 short
            calls <K tex={"K_2"} /> + 1 long call <K tex={"K_3"} />, con strikes equidistantes (
            <K tex={"K_1 < K_2 < K_3"} />). Tenés una tesis{" "}
            <span className="text-text">muy precisa</span> sobre dónde termina el spot: es a la vez
            una apuesta direccional y una apuesta de baja vol. La usan traders sofisticados con
            vista pinpoint sobre el target y para gestionar pin risk alrededor de strikes con alto
            open interest.
          </p>
          <Example title="Butterfly — ejemplo">
            Pensás que el dólar Rofex cierra exactamente en $1.200 a fin de mes (mucho open
            interest ahí). Comprás 1 call $1.150, vendés 2 calls $1.200, comprás 1 call $1.250.
            Premium neto chico (~$10). Si cierra en $1.200 ganás 50 − 10 = $40. Fuera del rango,
            perdés los $10.
          </Example>
          <Note kind="warning" title="Riesgo del butterfly">
            La probabilidad de profit es baja: necesitás precisión y el profit máximo solo ocurre
            en un punto exacto. Sirve más como estructura de risk-reward asimétrico que como
            apuesta principal del portfolio.
          </Note>

          <Sub>Iron condor</Sub>
          <p>
            <span className="text-text">Composición:</span> 1 long put <K tex={"K_1"} /> + 1 short
            put <K tex={"K_2"} /> + 1 short call <K tex={"K_3"} /> + 1 long call <K tex={"K_4"} />{" "}
            (con <K tex={"K_1 < K_2 < \\text{spot} < K_3 < K_4"} />). Esperás que el subyacente se
            mantenga <span className="text-text">lateral</span> en un rango definido: apuesta de
            baja volatilidad realizada contra una IV implícita cara. La usan los theta sellers que
            venden volatilidad sistemáticamente (income strategies), típicamente en meses
            post-evento cuando la IV está cara pero el realised es bajo.
          </p>
          <Example title="Iron condor — ejemplo">
            SPY a $500, IV alta post-FOMC. Vendés put $490 ($5), comprás put $485 ($2), vendés call
            $510 ($4), comprás call $515 ($1). Premium neto cobrado: 5 + 4 − 2 − 1 = $6. Si SPY
            queda entre $490 y $510 al vencimiento, te quedás con los $6 (100% profit). Si se sale,
            la pérdida máxima es la diferencia de strikes menos el premium: 5 − 6 = $1.
          </Example>
          <Note kind="warning" title="Riesgo del iron condor">
            Risk-reward asimétrico al revés: ganás poco frecuentemente y perdés ocasionalmente más
            grande. Si el subyacente hace un movimiento brusco fuera del rango (gap, crash, rally),
            la pérdida puede ser 5–10x el premium cobrado. El stop loss disciplinado es crítico.
          </Note>
        </Section>

        <Section id="resumen" title="Resumen: qué tesis va con cada estrategia">
          <DataTable
            headers={["Estrategia", "Tesis de mercado", "Profit / pérdida"]}
            rows={[
              ["Long call", "Sube fuerte (bullish direccional)", "Profit ilimitado · pérdida = premium"],
              ["Long put", "Cae fuerte (bearish direccional)", "Profit alto · pérdida = premium"],
              ["Covered call", "Lateral o sube poco; income", "Profit capeado · downside del stock"],
              ["Protective put", "Long stock con seguro de caída", "Upside del stock · pérdida acotada por el put"],
              ["Collar", "Proteger ganancia sin pagar premium", "Profit capeado · pérdida acotada"],
              ["Bull call spread", "Sube moderado", "Profit acotado · pérdida = costo neto"],
              ["Bear put spread", "Baja moderado", "Profit acotado · pérdida = costo neto"],
              ["Long straddle", "Movimiento grande, dirección incierta", "Profit alto · pérdida = dos premiums"],
              ["Long strangle", "Movimiento muy grande, más barato", "Profit alto · pérdida = dos premiums"],
              ["Butterfly", "Termina en un punto preciso", "Profit en un punto · pérdida = costo chico"],
              ["Iron condor", "Lateral en un rango (vende vol)", "Profit chico (credit) · pérdida acotada mayor"],
            ]}
          />
          <Note kind="info" title="Probá el payoff">
            Armá cualquiera de estas estructuras y visualizá su diagrama de payoff al vencimiento
            (y cómo se ve hoy vía Black-Scholes) en el{" "}
            <Link href="/strategies" className="text-brass hover:underline">
              laboratorio de estrategias
            </Link>
            .
          </Note>
        </Section>

        <Section id="formulario" title="Formulario — Hull Cap 11 · 12">
          <Defs
            items={[
              {
                term: "Payoff de un combo",
                desc: (
                  <>
                    Suma de los payoffs de cada pata:{" "}
                    <K tex={"\\text{Payoff}_{\\text{combo}}(S_T) = \\sum_j q_j \\cdot \\text{payoff}_j(S_T)"} />.
                  </>
                ),
              },
              {
                term: "Premium neto",
                desc: (
                  <>
                    <K tex={"\\sum_j q_j \\cdot \\text{premium}_j"} /> — positivo = debit (pagás),
                    negativo = credit (cobrás).
                  </>
                ),
              },
              {
                term: "Breakeven",
                desc: (
                  <>
                    Spot donde el P&amp;L total cruza cero:{" "}
                    <K tex={"\\text{Payoff}_{\\text{combo}}(S_T^{BE}) - \\text{premium neto} = 0"} />.
                  </>
                ),
              },
              {
                term: "Bull call spread — máx profit",
                desc: <K tex={"(K_2 - K_1) - \\text{premium neto}"} />,
              },
              {
                term: "Straddle — breakevens simétricos",
                desc: (
                  <K tex={"S_T^{BE} = K \\pm (\\text{premium}_{\\text{call}} + \\text{premium}_{\\text{put}})"} />
                ),
              },
            ]}
          />
        </Section>
      </Prose>
    </UnitShell>
  );
}
