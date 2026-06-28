import { BrandMark } from "./Brand";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line/70">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-center gap-2.5">
          <BrandMark size={22} />
          <span className="text-[13px] text-muted">
            Option Lab — laboratorio de derivados
          </span>
        </div>
        <p className="readout max-w-md text-[11px] leading-relaxed text-dim">
          Basado en Hull, <span className="italic">Options, Futures and Other Derivatives</span>.
          Herramienta educativa — no es asesoramiento de inversión.
        </p>
      </div>
    </footer>
  );
}
