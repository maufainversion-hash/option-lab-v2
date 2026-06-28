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
} from "@/components/learn/content";

export default function Page() {
  return (
    <UnitShell slug="u7-index-fx">
      <Prose>
        <Lead>
          La fórmula de Black-Scholes-Merton se extiende a tres familias de
          subyacentes que pagan un "rendimiento por tenencia": índices (dividend
          yield q), monedas (tasa extranjera r_f, vía Garman-Kohlhagen) y futuros
          (donde el modelo de Black hace desaparecer el growth term). Cap 17
          (índices + FX) y 18 (opciones sobre futuros).
        </Lead>

        {/* ============================================================ */}
        <Section id="indices" title="Opciones sobre índices (Hull 17.1)">
          <p>
            Una opción europea sobre un índice (S&amp;P 500, Nasdaq, Russell) se
            valúa con BSM extendido por <span className="text-text">Merton (1973)</span>{" "}
            para incorporar un dividend yield continuo q:
          </p>
          <Eq tex={"c = S_0\\,e^{-qT}\\,N(d_1) \\;-\\; K\\,e^{-rT}\\,N(d_2)"} />
          <Eq tex={"d_1 = \\frac{\\ln(S_0/K) + (r - q + \\tfrac{1}{2}\\sigma^2)\\,T}{\\sigma\\sqrt{T}}, \\qquad d_2 = d_1 - \\sigma\\sqrt{T}"} />
          <p>
            Para el S&amp;P 500, q típicamente está entre 1.5% y 2.5% anual
            (continuous compounded). Como q es positivo, el call vale{" "}
            <span className="text-text">menos</span> que sobre un asset sin
            dividendos.
          </p>
          <Note kind="info" title="Efecto de q">
            <p>
              Los dividendos esperados reducen el spot ex-date, lo que{" "}
              <span className="text-text">baja</span> el precio del call y{" "}
              <span className="text-text">sube</span> el del put respecto al caso
              sin dividendos.
            </p>
          </Note>
          <p className="text-[13.5px]">
            Compará call/put con y sin dividend yield en el{" "}
            <Link href="/pricing" className="text-brass hover:underline">laboratorio de pricing</Link>.
          </p>
        </Section>

        {/* ============================================================ */}
        <Section id="fx" title="Opciones sobre monedas — Garman-Kohlhagen (Hull 17.2)">
          <p>
            Para opciones sobre tipo de cambio, la tasa extranjera{" "}
            <K tex={"r_f"} /> juega el rol del dividend yield: tener la moneda
            extranjera te paga <K tex={"r_f"} />, igual que un activo paga q.
          </p>
          <Eq tex={"c = S_0\\,e^{-r_f T}\\,N(d_1) \\;-\\; K\\,e^{-r_d T}\\,N(d_2)"} />
          <Eq tex={"d_1 = \\frac{\\ln(S_0/K) + (r_d - r_f + \\tfrac{1}{2}\\sigma^2)\\,T}{\\sigma\\sqrt{T}}, \\qquad d_2 = d_1 - \\sigma\\sqrt{T}"} />
          <p>El <span className="text-text">forward FX</span> sale de la covered interest parity:</p>
          <Eq tex={"F = S\\cdot e^{(r_d - r_f)\\,T}"} />
          <p>
            Si la tasa doméstica es más alta que la extranjera (típico USD vs JPY
            hace años), el forward <span className="text-text">descuenta</span> la
            moneda doméstica (<K tex={"F > S"} />).
          </p>
          <Note kind="hull" title="Hull Ejemplo 17.2">
            <p>
              USD/GBP. S = 1.6, K = 1.6, T = 4/12, σ = 14.1%, r_d = 8%, r_f = 11%.
              Hull cita la prima del call en{" "}
              <span className="text-text">4.3 cents = 0.0430</span>.
            </p>
          </Note>
        </Section>

        {/* ============================================================ */}
        <Section id="futuros" title="Opciones sobre futuros — modelo de Black (Hull 18.6)">
          <p>
            Las opciones sobre futuros se valúan con el{" "}
            <span className="text-text">modelo de Black (1976)</span>. La diferencia
            con BSM: el subyacente es el FUTURO, no el spot. El futuro ya incorpora
            el cost of carry, así que el growth term en d₁ desaparece (queda solo{" "}
            <K tex={"\\sigma^2/2"} />):
          </p>
          <Eq tex={"c = e^{-rT}\\left[F_0\\,N(d_1) - K\\,N(d_2)\\right]"} />
          <Eq tex={"p = e^{-rT}\\left[K\\,N(-d_2) - F_0\\,N(-d_1)\\right]"} />
          <Eq tex={"d_1 = \\frac{\\ln(F_0/K) + \\tfrac{1}{2}\\sigma^2 T}{\\sigma\\sqrt{T}}, \\qquad d_2 = d_1 - \\sigma\\sqrt{T}"} />
          <Note kind="key" title="Equivalencia Black ↔ BSM">
            <p>
              <K tex={"\\text{Black}(F, K, T, r, \\sigma) = \\text{BSM}(F, K, T, r, \\sigma, q=r)"} />.
              El parámetro <span className="text-text">q = r</span> cancela el drift
              en d₁ porque <K tex={"(r - q) = 0"} />.
            </p>
          </Note>
          <p>
            <span className="text-text">Para qué se usa:</span> opciones sobre
            commodity futures (WTI crude, gold, corn), Treasury bond futures,
            Eurodollar futures. Mucha más liquidez en CME que sobre spot.
          </p>
          <p>La delta de una futures option lleva su propio factor de descuento:</p>
          <Eq tex={"\\Delta_{\\text{call}} = e^{-rT}\\,N(d_1), \\qquad \\Delta_{\\text{put}} = -e^{-rT}\\,N(-d_1)"} />
          <Note kind="hull" title="Hull Ejemplo 18.1">
            <p>
              Futures option sobre crude oil. F = 20, K = 20, T = 4/12, σ = 25%, r =
              10%. Call esperado ≈ <span className="text-text">1.116</span>.
            </p>
          </Note>
          <Note kind="warning" title="Black vs BSM mal usado">
            <p>
              Si tomás el F del futuro y lo metés directo en BSM tratándolo como
              spot (q = 0), obtenés un precio{" "}
              <span className="text-text">diferente</span>. Black es el modelo
              correcto cuando el subyacente es el futuro.
            </p>
          </Note>
          <p className="text-[13.5px]">
            Valuá futures options con el modelo de Black en el{" "}
            <Link href="/pricing" className="text-brass hover:underline">laboratorio de pricing</Link>.
          </p>
        </Section>

        {/* ============================================================ */}
        <Section id="range-forward" title="Range forward — collar FX zero-cost (Hull 17.4)">
          <p>
            Estrategia común en empresas que hedgean exposición FX. Para un{" "}
            <span className="text-text">importador</span> que en T necesita comprar
            moneda extranjera, se arma con dos patas:
          </p>
          <DataTable
            headers={["Pata", "Strike", "Rol"]}
            rows={[
              ["Long call FX", <K key="kc" tex={"K_{\\text{call}}"} />, "Techo a lo que va a pagar."],
              ["Short put FX", <K key="kp" tex={"K_{\\text{put}}"} />, "Piso (renunciás a apreciaciones del FX)."],
            ]}
          />
          <p>
            Si elegís los strikes simétricos al forward de manera tal que el premium
            recibido por el put financie el premium pagado por el call, el costo neto
            es <span className="text-text">cero</span> (zero-cost collar).
          </p>
          <p>
            El precio efectivo que vas a pagar termina entre{" "}
            <K tex={"K_{\\text{put}}"} /> y <K tex={"K_{\\text{call}}"} />: te
            "auto-impusiste" un bracket. Muy popular en commodities (range forward de
            oil para refinerías).
          </p>
          <Eq tex={"\\text{costo efectivo}(S_T) = \\operatorname{clip}\\big(S_T,\\ K_{\\text{put}},\\ K_{\\text{call}}\\big)"} />
          <p className="text-[13.5px]">
            Armá el collar zero-cost y mirá el costo efectivo al vencimiento con las{" "}
            <Link href="/strategies" className="text-brass hover:underline">estrategias de trading</Link>.
          </p>
        </Section>

        {/* ============================================================ */}
        <Section id="formulario" title="Formulario (Cap 17-18)">
          <Sub>Opción sobre índice — BSM con dividend yield</Sub>
          <Eq tex={"c = S_0\\,e^{-qT}\\,N(d_1) - K\\,e^{-rT}\\,N(d_2)"} />
          <Sub>Garman-Kohlhagen — opción sobre divisas (r_f = tasa extranjera)</Sub>
          <Eq tex={"c = S_0\\,e^{-r_f T}\\,N(d_1) - K\\,e^{-r_d T}\\,N(d_2)"} />
          <Sub>Forward FX — covered interest parity</Sub>
          <Eq tex={"F_0 = S_0\\,e^{(r_d - r_f)T}"} />
          <Sub>Modelo de Black — opción sobre futuros</Sub>
          <Eq tex={"c = e^{-rT}\\left[F_0\\,N(d_1) - K\\,N(d_2)\\right]"} />
          <Eq tex={"d_1 = \\frac{\\ln(F_0/K) + \\tfrac{1}{2}\\sigma^2 T}{\\sigma\\sqrt{T}}, \\quad d_2 = d_1 - \\sigma\\sqrt{T}"} />
          <Sub>Delta de futures option</Sub>
          <Eq tex={"\\Delta_{\\text{call}} = e^{-rT}\\,N(d_1)"} />
        </Section>
      </Prose>
    </UnitShell>
  );
}
