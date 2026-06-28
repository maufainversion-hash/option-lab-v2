import type { ReactNode } from "react";
import { Formula } from "@/components/ui/Formula";

/** Contenedor de lectura con tipografía cuidada. */
export function Prose({ children }: { children: ReactNode }) {
  return <div className="max-w-3xl space-y-5 text-[15px] leading-relaxed text-muted">{children}</div>;
}

export function Lead({ children }: { children: ReactNode }) {
  return <p className="text-[17px] leading-relaxed text-text/90 text-pretty">{children}</p>;
}

export function Section({ id, title, children }: { id?: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 space-y-4 pt-4">
      <h2 className="font-display text-[24px] font-medium text-text">{title}</h2>
      {children}
    </section>
  );
}

export function Sub({ children }: { children: ReactNode }) {
  return <h3 className="font-display text-[18px] font-medium text-text">{children}</h3>;
}

/** Fórmula en bloque, centrada en una tarjeta. */
export function Eq({ tex }: { tex: string }) {
  return (
    <div className="my-2 overflow-x-auto rounded-xl border border-line bg-ink-1 px-5 py-4 text-text">
      <Formula display tex={tex} />
    </div>
  );
}

/** Fórmula inline. */
export function K({ tex }: { tex: string }) {
  return <Formula tex={tex} className="text-text" />;
}

type NoteKind = "info" | "hull" | "key" | "warning" | "success";
const NOTE: Record<NoteKind, { border: string; bg: string; icon: string; label: string }> = {
  info: { border: "#58a6ff", bg: "rgba(88,166,255,0.07)", icon: "ℹ", label: "Nota" },
  hull: { border: "#e8b04b", bg: "rgba(232,176,75,0.08)", icon: "📘", label: "Hull" },
  key: { border: "#3fcf8e", bg: "rgba(63,207,142,0.07)", icon: "★", label: "Clave para el parcial" },
  warning: { border: "#f0b429", bg: "rgba(240,180,41,0.07)", icon: "⚠", label: "Cuidado" },
  success: { border: "#3fcf8e", bg: "rgba(63,207,142,0.07)", icon: "✓", label: "" },
};

export function Note({ kind = "info", title, children }: { kind?: NoteKind; title?: string; children: ReactNode }) {
  const n = NOTE[kind];
  return (
    <div
      className="rounded-lg border-l-2 px-4 py-3 text-[14px] leading-relaxed text-muted"
      style={{ borderColor: n.border, background: n.bg }}
    >
      <div className="mb-1 flex items-center gap-2 text-[12px] font-semibold" style={{ color: n.border }}>
        <span>{n.icon}</span>
        <span>{title ?? n.label}</span>
      </div>
      {children}
    </div>
  );
}

/** Tabla de datos simple y prolija. */
export function DataTable({ headers, rows }: { headers: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="w-full text-[13.5px]">
        <thead>
          <tr className="border-b border-line bg-ink-2 text-left">
            {headers.map((h, i) => (
              <th key={i} className="eyebrow px-3 py-2.5 text-[10px]">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-line/50 last:border-0">
              {row.map((cell, j) => (
                <td key={j} className={`px-3 py-2 ${j === 0 ? "font-medium text-text" : "text-muted"}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Lista de definiciones término → descripción. */
export function Defs({ items }: { items: { term: ReactNode; desc: ReactNode }[] }) {
  return (
    <dl className="space-y-2.5">
      {items.map((it, i) => (
        <div key={i} className="rounded-lg border border-line bg-ink-1 px-4 py-3">
          <dt className="text-[14px] font-semibold text-text">{it.term}</dt>
          <dd className="mt-1 text-[14px] leading-relaxed text-muted">{it.desc}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Ejemplo numérico destacado (estilo Hull). */
export function Example({ title = "Ejemplo", children }: { title?: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-line bg-ink-1 p-4">
      <div className="eyebrow mb-2 text-brass">{title}</div>
      <div className="space-y-3 text-[14px] leading-relaxed text-muted">{children}</div>
    </div>
  );
}
