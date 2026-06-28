"use client";

import { useMemo, useState } from "react";
import { Formula } from "@/components/ui/Formula";
import { FLASHCARDS, TOPICS, type Flashcard } from "@/lib/flashcards";

const keyOf = (c: Flashcard) => `${c.topic}::${c.front}`;

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function Flashcards() {
  const [topic, setTopic] = useState<string>("all");
  const [order, setOrder] = useState(0); // bump to reshuffle
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<string>>(new Set());

  const deck = useMemo(() => {
    const base = topic === "all" ? FLASHCARDS : FLASHCARDS.filter((c) => c.topic === topic);
    return order > 0 ? shuffled(base) : base;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic, order]);

  const card = deck[Math.min(pos, deck.length - 1)];
  const knownInDeck = deck.filter((c) => known.has(keyOf(c))).length;

  const go = (delta: number) => {
    setFlipped(false);
    setPos((p) => (p + delta + deck.length) % deck.length);
  };
  const mark = (isKnown: boolean) => {
    setKnown((prev) => {
      const next = new Set(prev);
      if (isKnown) next.add(keyOf(card));
      else next.delete(keyOf(card));
      return next;
    });
    go(1);
  };
  const reset = (t: string) => {
    setTopic(t);
    setPos(0);
    setFlipped(false);
  };

  return (
    <div>
      {/* Filtros */}
      <div className="mb-5 flex flex-wrap gap-1.5">
        <button
          onClick={() => reset("all")}
          className={`rounded-md border px-2.5 py-1 text-[12px] font-medium transition-colors ${
            topic === "all" ? "border-brass/40 bg-ink-3 text-brass" : "border-line bg-ink-2 text-muted hover:text-text"
          }`}
        >
          Todas
        </button>
        {TOPICS.map((t) => (
          <button
            key={t}
            onClick={() => reset(t)}
            className={`rounded-md border px-2.5 py-1 text-[12px] font-medium transition-colors ${
              topic === t ? "border-brass/40 bg-ink-3 text-brass" : "border-line bg-ink-2 text-muted hover:text-text"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Barra de progreso */}
      <div className="mb-3 flex items-center justify-between">
        <span className="readout text-[12px] text-dim">
          {pos + 1} / {deck.length} · <span className="text-gain">sabidas {knownInDeck}</span>
        </span>
        <button
          onClick={() => { setOrder((o) => o + 1); setPos(0); setFlipped(false); }}
          className="readout rounded-md border border-line px-2.5 py-1 text-[11px] text-muted transition-colors hover:text-text"
        >
          ⤮ Mezclar
        </button>
      </div>

      {/* Carta */}
      <div className="[perspective:1400px]">
        <button
          onClick={() => setFlipped((f) => !f)}
          className="relative block w-full text-left"
          style={{ minHeight: 300 }}
        >
          <div
            className="relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d]"
            style={{ minHeight: 300, transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
          >
            {/* Frente */}
            <div
              className="panel blueprint absolute inset-0 flex flex-col justify-between p-7 [backface-visibility:hidden]"
              style={{ minHeight: 300 }}
            >
              <span className="chip self-start">{card.topic}</span>
              <p className="font-display text-[24px] font-medium leading-snug text-text">{card.front}</p>
              <span className="readout text-[11px] text-dim">tocá para ver la respuesta →</span>
            </div>
            {/* Dorso */}
            <div
              className="panel absolute inset-0 flex flex-col justify-center gap-4 p-7 [backface-visibility:hidden] [transform:rotateY(180deg)]"
              style={{ minHeight: 300 }}
            >
              {card.tex && (
                <div className="overflow-x-auto rounded-lg border border-line bg-ink-0 px-4 py-3 text-text">
                  <Formula display tex={card.tex} />
                </div>
              )}
              <p className="text-[15px] leading-relaxed text-muted">{card.back}</p>
            </div>
          </div>
        </button>
      </div>

      {/* Controles */}
      <div className="mt-5 flex items-center justify-between gap-3">
        <button
          onClick={() => go(-1)}
          className="rounded-lg border border-line px-4 py-2 text-[13px] text-muted transition-colors hover:text-text"
        >
          ← Anterior
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => mark(false)}
            className="rounded-lg border border-loss/40 bg-loss/10 px-4 py-2 text-[13px] font-medium text-loss transition-colors hover:bg-loss/20"
          >
            Repasar
          </button>
          <button
            onClick={() => mark(true)}
            className="rounded-lg border border-gain/40 bg-gain/10 px-4 py-2 text-[13px] font-medium text-gain transition-colors hover:bg-gain/20"
          >
            La sé ✓
          </button>
        </div>
        <button
          onClick={() => go(1)}
          className="rounded-lg border border-line px-4 py-2 text-[13px] text-muted transition-colors hover:text-text"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}
