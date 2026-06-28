"use client";

import { useMemo, useState } from "react";
import { Formula } from "@/components/ui/Formula";
import { EXERCISES, type Exercise } from "@/lib/exercises";

function ExerciseCard({ ex }: { ex: Exercise }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="panel p-5">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="chip">{ex.topic}</span>
        <span className="chip text-dim">{ex.hull}</span>
      </div>
      <h3 className="font-display text-[18px] font-medium text-text">{ex.title}</h3>
      <p className="mt-2 text-[14px] leading-relaxed text-muted">{ex.statement}</p>

      {ex.givens && ex.givens.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {ex.givens.map((g, i) => (
            <span key={i} className="readout rounded-md border border-line bg-ink-2 px-2 py-0.5 text-[12px] text-muted">
              {g}
            </span>
          ))}
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-brass transition-colors hover:text-brass-2"
      >
        {open ? "Ocultar solución" : "Ver solución paso a paso"}
        <span className={`transition-transform ${open ? "rotate-90" : ""}`}>→</span>
      </button>

      {open && (
        <div className="mt-4 space-y-3 border-t border-line pt-4">
          <ol className="space-y-3">
            {ex.steps.map((s, i) => (
              <li key={i} className="flex gap-3">
                <span className="readout mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-line text-[11px] text-dim">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] leading-relaxed text-muted">{s.text}</p>
                  {s.tex && (
                    <div className="mt-1.5 overflow-x-auto rounded-lg border border-line bg-ink-0 px-3 py-2 text-text">
                      <Formula display tex={s.tex} />
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
          <div className="rounded-lg border-l-2 px-4 py-3" style={{ borderColor: "#3fcf8e", background: "rgba(63,207,142,0.07)" }}>
            <span className="eyebrow text-gain">Respuesta</span>
            <p className="readout mt-1 text-[15px] font-semibold text-text">{ex.answer}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function Exercises() {
  const topics = useMemo(() => ["all", ...Array.from(new Set(EXERCISES.map((e) => e.topic)))], []);
  const [topic, setTopic] = useState("all");
  const list = topic === "all" ? EXERCISES : EXERCISES.filter((e) => e.topic === topic);

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-1.5">
        {topics.map((t) => (
          <button
            key={t}
            onClick={() => setTopic(t)}
            className={`rounded-md border px-2.5 py-1 text-[12px] font-medium transition-colors ${
              topic === t ? "border-brass/40 bg-ink-3 text-brass" : "border-line bg-ink-2 text-muted hover:text-text"
            }`}
          >
            {t === "all" ? "Todos" : t}
          </button>
        ))}
      </div>
      <div className="grid gap-4">
        {list.map((ex) => (
          <ExerciseCard key={ex.id} ex={ex} />
        ))}
      </div>
    </div>
  );
}
