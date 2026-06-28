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
    <UnitShell slug="cap9-ois">
      <Prose>
        <Lead>
          Después de 2008 quedó claro que LIBOR no es risk-free. Los derivados colateralizados se
          descuentan con la curva OIS, el spread LIBOR-OIS se volvió el termómetro del stress
          interbancario, y el mundo pasó a un framework multi-curve: una curva para descontar, otra
          para forecastear cashflows flotantes.
        </Lead>

        <Section id="por-que-ois" title="OIS vs LIBOR — el cambio post-crisis">
          <p>
            <span className="text-text">Pre-2008</span>, todo el mundo descontaba derivados con la{" "}
            <span className="text-text">curva LIBOR</span>. Después de la crisis quedó claro que
            LIBOR tiene <span className="text-text">credit risk</span> del panel bancario: si un
            banco está en problemas, su LIBOR submission no es &ldquo;risk-free&rdquo;. Las
            contrapartes con colateral diario (CSA) miran otra cosa.
          </p>

          <Defs
            items={[
              {
                term: "OIS (Overnight Index Swap)",
                desc: (
                  <>
                    Swap donde una pata paga <span className="text-text">floating overnight rate
                    compoundeada</span> (Fed Funds en USD, EONIA → €STR en EUR). Como es overnight,
                    prácticamente no hay credit risk: el rate refleja la política monetaria, no la
                    salud bancaria.
                  </>
                ),
              },
              {
                term: "LIBOR",
                desc: "Tasa de unsecured lending entre bancos del panel. Incorpora credit risk y liquidity premium de la banca, por eso se aparta del rate 'casi risk-free' en stress.",
              },
            ]}
          />

          <Sub>Por qué OIS para colateral</Sub>
          <p>
            Cuando un derivado está <span className="text-text">colateralizado</span> (la mayoría
            del mercado interbancario):
          </p>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>El colateral genera <span className="text-text">OIS</span> (es cash diario en una cuenta).</li>
            <li>El &ldquo;costo de financiar&rdquo; la posición = OIS.</li>
            <li>Por no-arbitraje: el derivado se descuenta con la curva que paga el colateral.</li>
          </ul>

          <Note kind="key" title="Conclusión post-crisis (~2010 en adelante)">
            Derivados colateralizados → descontar con <span className="text-text">OIS</span>.
            Derivados sin colateral (corporates) → descontar con la tasa de funding propia del banco.
          </Note>

          <Sub>NPV de un cashflow bajo OIS vs LIBOR</Sub>
          <p>
            El descuento de un cashflow colateralizado usa la tasa OIS continua:
          </p>
          <Eq tex={"PV = \\text{CF} \\cdot e^{-r_{\\text{OIS}}\\, T}"} />

          <Example title="Swap de 5 años, notional 1MM, spread 25 bps">
            <p>
              Con OIS = 3% (cc) y LIBOR = OIS + 25 bps = 3.25%, descontar un cashflow nominal de
              $1.000.000 a 5 años da:
            </p>
            <ul className="ml-5 list-disc space-y-1">
              <li>PV bajo OIS (correcto): <K tex={"10^6 \\cdot e^{-0.030 \\times 5} \\approx \\$860.708"} /></li>
              <li>PV bajo LIBOR (pre-2008): <K tex={"10^6 \\cdot e^{-0.0325 \\times 5} \\approx \\$849.024"} /></li>
              <li>Δ por descontar mal: ≈ +$11.684 (~1.4%)</li>
            </ul>
          </Example>

          <Note kind="hull" title="El costo de elegir mal la curva">
            Para un swap de 5 años con notional 1MM y spread LIBOR-OIS de 25 bps, elegir mal la curva
            de descuento te puede valuar el derivado mal por ~$12K. En portafolios grandes (bancos,
            hedge funds) eso se vuelve millones de USD en P&amp;L mal calculado.
          </Note>
        </Section>

        <Section id="libor-ois-spread" title="LIBOR-OIS spread como termómetro de stress">
          <p>
            El <span className="text-text">spread LIBOR-OIS</span> es un indicador clásico de stress
            en el sistema bancario interbancario. En tiempos normales: 5-15 bps. En crisis: explota.
          </p>

          <Eq tex={"\\text{spread} = R_{\\text{LIBOR}} - R_{\\text{OIS}}"} />

          <DataTable
            headers={["Período", "LIBOR-OIS típico", "Comentario"]}
            rows={[
              ["2003-2007", "5-10 bps", "Mercado tranquilo, banks se prestan entre sí sin friction"],
              ["2007 Aug", "50-90 bps", "BNP Paribas suspende 3 funds — inicio de la crisis"],
              ["2008 Oct", "350+ bps", "Post-Lehman, banks no se prestan entre sí, pánico"],
              ["2009-2019", "10-20 bps", "Steady state post-crisis con QE"],
              ["2020 Mar", "130 bps", "COVID liquidity squeeze (breve)"],
              ["2021+", "—", "LIBOR phasing out → SOFR / €STR / SONIA"],
            ]}
          />

          <Sub>Por qué el spread se mueve</Sub>
          <Defs
            items={[
              {
                term: "Credit risk de los panel banks",
                desc: "Si la probabilidad de default de un banco promedio sube, el LIBOR (que es unsecured lending entre banks) sube.",
              },
              {
                term: "Liquidity premium",
                desc: "Si los banks acumulan cash defensivamente y no se prestan, el LIBOR repunta aún sin cambio en credit fundamentals.",
              },
              {
                term: "OIS sigue la política monetaria",
                desc: "Se mueve con el Fed funds target y las expectativas. Es mucho más estable que el LIBOR.",
              },
            ]}
          />

          <Note kind="info" title="LIBOR está siendo retirado">
            La cessation va de 2023 a 2024 según la moneda. Lo reemplazan rates &ldquo;casi
            risk-free&rdquo;: <span className="text-text">SOFR</span> (USD),{" "}
            <span className="text-text">€STR</span> (EUR), <span className="text-text">SONIA</span>{" "}
            (GBP), <span className="text-text">TONA</span> (JPY). Todos son overnight, alineados al
            spirit de OIS.
          </Note>
        </Section>

        <Section id="multi-curve" title="Multi-curve framework — descuento ≠ forecast">
          <p>
            La gran insight post-2010:{" "}
            <span className="text-text">
              la curva que usás para descontar NO tiene que ser la misma que usás para forecastear
              cashflows flotantes.
            </span>
          </p>

          <Sub>El framework moderno (simplificado)</Sub>
          <p>Para valuar un swap LIBOR/fixed con colateral:</p>
          <ol className="ml-5 list-decimal space-y-1.5">
            <li>
              <span className="text-text">Descontás</span> todos los cashflows con la curva{" "}
              <span className="text-text">OIS</span> (porque el colateral paga OIS).
            </li>
            <li>
              <span className="text-text">Forecaseás</span> los cashflows flotantes (LIBOR a
              recibir/pagar en cada reset) con la <span className="text-text">curva LIBOR-forward</span>{" "}
              (independiente).
            </li>
          </ol>

          <Eq tex={"V = \\sum_i \\text{CF}_i(\\text{curva LIBOR}) \\cdot e^{-r_i^{\\text{OIS}}\\, t_i}"} />

          <p>
            Forecast de cashflows flotantes con la curva LIBOR-forward; descuento con la curva OIS.
          </p>

          <DataTable
            headers={["", "Pre-2008 (single-curve)", "Post-2008 (multi-curve)"]}
            rows={[
              ["Descuento", "Curva LIBOR", "Una curva por moneda × tipo de colateral (USD/OIS, EUR/€STR…)"],
              ["Forecast flotante", "Curva LIBOR (la misma)", "Una curva por benchmark (3M LIBOR, 6M LIBOR…)"],
              ["Por qué funcionaba", "LIBOR-OIS chico → daba lo mismo", "El spread ya no es despreciable"],
            ]}
          />

          <Note kind="info" title="Por qué single-curve funcionaba antes">
            Pre-2008 ambas curvas eran la misma curva LIBOR. Funcionaba porque el spread LIBOR-OIS
            era tan chico que daba lo mismo. Post-2008 hay que mantener una curva de descuento por
            moneda × tipo de colateral y una curva de forecast por benchmark.
          </Note>

          <Sub>Ejemplo numérico — swap simple</Sub>
          <Example title="Notional 10MM, 5 años, fixed 3.4%, pagos semestrales">
            <p>
              Con OIS flat = 3% (cc) y LIBOR-forward flat = 3.5% (cc), bajo multi-curve descontamos
              ambas patas con OIS y forecasteamos la flotante con LIBOR:
            </p>
            <ul className="ml-5 list-disc space-y-1">
              <li>
                Pata fija: <K tex={"B_{\\text{fix}} = \\sum_i L\\, r_{\\text{fix}}\\, \\tau\\, e^{-r^{\\text{OIS}} t_i} + L\\, e^{-r^{\\text{OIS}} t_n}"} />
              </li>
              <li>
                Pata flotante: cada pago es <K tex={"L \\cdot r_{\\text{LIBOR}} \\cdot \\tau"} />,
                descontado también con OIS, más el notional al final.
              </li>
              <li>
                <K tex={"V_{\\text{multi}} = B_{\\text{fix}} - B_{\\text{flt}}"} />
              </li>
            </ul>
            <p>
              Bajo single-curve LIBOR (pre-2008) se descuenta todo con LIBOR y la pata flotante vale
              exactamente el notional al inicio. La diferencia entre ambas valuaciones es el error
              que cometés si descontás con la curva equivocada.
            </p>
          </Example>

          <Note kind="hull" title="El error escala con el plazo y el spread">
            La diferencia entre las dos valuaciones crece con el plazo y con el LIBOR-OIS spread. En
            portfolios de billones de notional como los de un dealer mayor, descontar con la curva
            equivocada se traduce en P&amp;L incorrecto del orden de cientos de millones.
          </Note>
        </Section>

        <Section id="formulas" title="Formulario">
          <Note kind="key" title="Fórmulas de la unidad">
            Las que se usan en OIS y colateral.
          </Note>

          <Sub>Descuento con OIS — derivados colateralizados</Sub>
          <Eq tex={"PV = \\text{CF} \\cdot e^{-r_{\\text{OIS}}\\, T}"} />

          <Sub>LIBOR-OIS spread — termómetro de stress interbancario</Sub>
          <Eq tex={"\\text{spread} = R_{\\text{LIBOR}} - R_{\\text{OIS}}"} />

          <Sub>Multi-curve framework — descuento y forecast con curvas distintas</Sub>
          <Eq tex={"V = \\sum_i \\text{CF}_i(\\text{curva LIBOR}) \\cdot e^{-r_i^{\\text{OIS}}\\, t_i}"} />
          <p>
            Forecast de cashflows flotantes con la curva LIBOR-forward; descuento con la curva OIS.
          </p>
        </Section>
      </Prose>
    </UnitShell>
  );
}
