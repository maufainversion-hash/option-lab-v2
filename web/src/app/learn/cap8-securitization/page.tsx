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
    <UnitShell slug="cap8-securitization">
      <Prose>
        <Lead>
          Securitización es empaquetar un pool de activos en un vehículo que emite bonos. El
          tranching convierte un pool de calidad media en un instrumento senior de calidad alta —
          hasta que la correlación de defaults se dispara y el AAA falla. Esto es lo que pasó en
          2007-2008.
        </Lead>

        <Section id="que-es" title="¿Qué es securitización?">
          <p>
            <span className="text-text">Securitización</span> = empaquetar un pool de activos
            (hipotecas, auto loans, credit cards, corporate loans) en un vehículo (SPV) que emite{" "}
            <span className="text-text">bonos</span> respaldados por los cashflows del pool.
          </p>

          <Sub>Cadena clásica de hipotecas (MBS)</Sub>
          <div className="overflow-x-auto rounded-xl border border-line bg-ink-1 px-5 py-4">
            <code className="whitespace-nowrap text-[13px] text-text">
              Borrower → Originator (banco) → Pool (SPV) → Tranches (AAA/AA/.../Equity) → Inversores
            </code>
          </div>

          <Sub>Por qué se hace</Sub>
          <ol className="ml-5 list-decimal space-y-1.5">
            <li>
              El originador <span className="text-text">off-loads</span> el riesgo (vende el pool al
              SPV, sale del balance).
            </li>
            <li>
              El SPV puede emitir bonos AAA porque la{" "}
              <span className="text-text">estructura de tranches</span> convierte un pool de calidad
              media en un instrumento senior de calidad alta.
            </li>
            <li>
              El comprador AAA (fondos de pensión, bancos centrales) consigue yield extra vs
              Treasuries con (aparentemente) el mismo rating.
            </li>
          </ol>

          <Sub>Tranching</Sub>
          <p>
            El corazón del invento. Las pérdidas del pool van impactando los tranches{" "}
            <span className="text-text">de abajo hacia arriba</span>: hasta que el equity no esté
            wiped-out, el AAA no sufre nada.
          </p>

          <DataTable
            headers={["Tranche", "Attach", "Detach", "Thickness", "Rating típico"]}
            rows={[
              ["Equity (first-loss)", "0%", "3%", "3%", "NR"],
              ["Mezzanine BBB", "3%", "7%", "4%", "BBB"],
              ["Mezzanine A", "7%", "12%", "5%", "A"],
              ["Senior AAA", "12%", "100%", "88%", "AAA"],
            ]}
          />

          <Note kind="hull" title="Stack de capital de un CDO típico">
            Visualmente, el equity (0-3%) está al fondo y absorbe las primeras pérdidas; encima
            mezzanine BBB (3-7%) y A (7-12%); y arriba el senior AAA ocupa el 12-100% del pool. El
            tranche más grueso (AAA, 88%) es el que cobra el rating más alto justamente porque está
            más lejos de la primera pérdida.
          </Note>
        </Section>

        <Section id="waterfall" title="Waterfall de pérdidas">
          <p>
            Dado un <span className="text-text">pool loss rate</span> (fracción del pool que
            defaultea), las pérdidas suben de abajo hacia arriba. Cada tranche pierde lo que cae
            dentro de su rango attach/detach: si el pool loss no llega al attach, el tranche no
            pierde nada; si supera el detach, queda wiped por completo.
          </p>

          <Eq tex={"\\text{loss}_{\\text{tranche}} = \\text{clip}\\!\\left(\\frac{L - \\text{attach}}{\\text{detach} - \\text{attach}},\\;0,\\;1\\right)"} />

          <p>
            donde <K tex={"L"} /> es el pool loss rate. Es exactamente la misma mecánica que el
            payoff de un tramo en un CDO: el tranche es como una posición vendida sobre un call
            spread de pérdidas con strikes en attach y detach.
          </p>

          <Sub>Escenarios típicos</Sub>
          <DataTable
            headers={["Escenario", "Pool loss", "Equity", "Mezz BBB", "Mezz A", "Senior AAA"]}
            rows={[
              ["Boom", "0%", "0%", "0%", "0%", "0%"],
              ["Ciclo normal", "3%", "100%", "0%", "0%", "0%"],
              ["Recesión", "8%", "100%", "100%", "20%", "0%"],
              ["Crisis 2008", "20%", "100%", "100%", "100%", "~9%"],
            ]}
          />

          <Note kind="warning" title="El AAA también puede sufrir">
            En el escenario &ldquo;Crisis 2008 (20%)&rdquo; el equity está wiped, el BBB y el A
            también, y hasta el AAA empieza a sufrir (~9% loss). Pre-crisis, los modelos asumían que
            el AAA jamás sufriría — la realidad fue otra.
          </Note>

          <Example title="Lectura del waterfall">
            <p>
              Con un pool loss del 8%: el equity (0-3%) absorbe sus 3 puntos y queda al 100% de
              pérdida; el mezz BBB (3-7%) absorbe sus 4 puntos y también queda al 100%; al mezz A
              (7-12%, thickness 5%) le toca solo el tramo entre 7% y 8%, es decir{" "}
              <K tex={"(8\\% - 7\\%)/5\\% = 20\\%"} /> de pérdida; y el senior AAA (12-100%) no
              recibe nada todavía.
            </p>
          </Example>
        </Section>

        <Section id="crisis-2008" title="¿Qué falló en 2008?">
          <p>
            La crisis subprime fue una cadena de assumption failures encadenados. Las cuatro
            grandes:
          </p>

          <Defs
            items={[
              {
                term: "1. Originación predatoria",
                desc: (
                  <>
                    Los originadores (Countrywide, IndyMac, etc.) emitían{" "}
                    <span className="text-text">NINJA loans</span> (&ldquo;No Income, No Job, no
                    Assets&rdquo;): hipotecas con documentación fraudulenta, teaser rates de 2-3 años
                    y luego reset a tasas mucho más altas.
                  </>
                ),
              },
              {
                term: "2. Modelos de correlación rotos",
                desc: (
                  <>
                    Los CDOs se ratearon asumiendo correlación baja entre defaults de hipotecas en
                    distintas regiones. La cópula gaussiana de Li (2000) fue el modelo estándar.
                    Cuando la correlación se dispara en una crisis sistémica,{" "}
                    <span className="text-text">todas las hipotecas defaultean juntas</span> y el AAA
                    pierde.
                  </>
                ),
              },
              {
                term: "3. CDO² (CDO al cuadrado)",
                desc: (
                  <>
                    Empaquetar tranches mezzanine de varios CDOs en un nuevo CDO. Suena absurdo, lo
                    era. Concentraba todo el riesgo de cola en el tope de la estructura.
                  </>
                ),
              },
              {
                term: "4. Conflict of interest en ratings",
                desc: (
                  <>
                    Las agencias (S&amp;P, Moody&apos;s, Fitch) cobraban al emisor. Si no daban AAA,
                    el emisor iba a la competencia. <span className="text-text">Race to the bottom</span>.
                  </>
                ),
              },
            ]}
          />

          <Sub>El timing canónico</Sub>
          <DataTable
            headers={["Fecha", "Evento"]}
            rows={[
              ["2003-2006", "Boom hipotecario, originación masiva subprime"],
              ["2007 Feb", "HSBC anuncia $10B de losses en US subprime"],
              ["2007 Jun", "Los hedge funds de Bear Stearns colapsan"],
              ["2008 Mar", "Bear Stearns rescatado por JPMorgan"],
              ["2008 Sep 7", "Fannie Mae / Freddie Mac nacionalizados"],
              [<span className="text-text">2008 Sep 15</span>, <span className="text-text">Lehman Brothers quiebra</span>],
              ["2008 Sep 16", "AIG rescatado ($85B inicial)"],
              ["2008 Oct", "TARP ($700B) firmado"],
            ]}
          />

          <Sub>Lecciones que sobreviven en el curriculum</Sub>
          <Defs
            items={[
              {
                term: "Tail correlation matters more than average correlation",
                desc: "El modelo de Li funcionaba 'en promedio' y colapsaba en la cola, que es justo donde importa.",
              },
              {
                term: "Liquidez ≠ valor",
                desc: "El AAA-MBS era 'líquido' hasta que dejó de serlo. Mark-to-market en ese contexto es problemático.",
              },
              {
                term: "Hard-to-value tranches están al final del waterfall",
                desc: "Si tu equity ya está wiped, el mezzanine es una binary bet.",
              },
              {
                term: "Ratings ≠ riesgo",
                desc: "Una calificación AAA significa 'el emisor cumplió los criterios del modelo del rater', no 'este bono va a pagar'.",
              },
            ]}
          />
        </Section>

        <Section id="correlacion" title="Correlación y tail loss">
          <p>
            Si la correlación entre defaults sube, la{" "}
            <span className="text-text">probabilidad de un tail event</span> (pool loss &gt; 10%)
            crece dramáticamente. El modelo estándar es una cópula gaussiana de un factor: cada
            crédito tiene una variable latente <K tex={"X_i"} /> que mezcla un factor sistémico común{" "}
            <K tex={"M"} /> con uno idiosincrático <K tex={"Z_i"} />.
          </p>

          <Eq tex={"X_i = \\sqrt{\\rho}\\,M + \\sqrt{1-\\rho}\\,Z_i"} />

          <p>
            El crédito <K tex={"i"} /> defaultea si su variable latente cae bajo el umbral implícito
            de su probabilidad de default:
          </p>

          <Eq tex={"\\text{default}_i \\iff X_i < N^{-1}(p_{\\text{default}})"} />

          <p>
            Con un pool de 100 hipotecas y probabilidad de default individual del 5%, el parámetro{" "}
            <K tex={"\\rho"} /> manda toda la forma de la distribución de pérdidas:
          </p>

          <DataTable
            headers={["Correlación ρ", "Régimen", "Tail (pool loss > 15%)"]}
            rows={[
              ["0.0", "Independencia (lo que asumían pre-2008)", "Casi imposible"],
              ["0.1", "Correlación leve", "Poco probable"],
              ["0.3", "Correlación moderada", "Plausible"],
              ["0.6", "Crisis sistémica (lo que pasó)", "Losses del 30-50% plausibles"],
            ]}
          />

          <Note kind="hull" title="El parámetro que rompió todo">
            Con <span className="text-text">ρ=0</span> (independencia, lo que asumían los modelos
            pre-2008) la cola es muy delgada: pool losses &gt; 15% son casi imposibles. Con{" "}
            <span className="text-text">ρ=0.6</span> (lo que pasó en realidad) la cola se engorda y
            losses del 30-50% se vuelven escenarios plausibles. Un solo parámetro mal calibrado
            tumbó la estructura entera.
          </Note>
        </Section>

        <Section id="formulas" title="Formulario">
          <Note kind="key" title="Fórmulas de la unidad">
            Las que se usan en securitización.
          </Note>

          <Sub>Pérdida de un tranche dado el pool loss rate L</Sub>
          <Eq tex={"\\text{loss}_{\\text{tranche}} = \\text{clip}\\!\\left(\\frac{L - \\text{attach}}{\\text{detach} - \\text{attach}},\\;0,\\;1\\right)"} />

          <Sub>Cópula gaussiana de un factor</Sub>
          <Eq tex={"X_i = \\sqrt{\\rho}\\,M + \\sqrt{1-\\rho}\\,Z_i"} />
          <p>
            <K tex={"M"} /> = factor sistémico común · <K tex={"Z_i"} /> = factor idiosincrático ·{" "}
            <K tex={"\\rho"} /> = correlación.
          </p>

          <Sub>Default del crédito i</Sub>
          <p>Ocurre si la variable latente cae bajo el umbral:</p>
          <Eq tex={"\\text{default}_i \\iff X_i < N^{-1}(p_{\\text{default}})"} />
        </Section>
      </Prose>
    </UnitShell>
  );
}
