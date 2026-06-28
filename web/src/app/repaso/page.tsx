"use client";

import { useState } from "react";
import { LabHeader } from "@/components/LabLayout";
import { Segmented } from "@/components/ui/Segmented";
import { Flashcards } from "@/components/repaso/Flashcards";
import { Exercises } from "@/components/repaso/Exercises";

export default function RepasoPage() {
  const [mode, setMode] = useState<"flashcards" | "ejercicios">("flashcards");

  return (
    <div className="mx-auto max-w-[900px] px-5 py-8 sm:px-8">
      <LabHeader
        eyebrow="repaso · parcial"
        hull="Hull 1 · 19"
        title={<>Munición para el <span className="text-brass italic">parcial</span></>}
        subtitle="Recall activo con flashcards de fórmulas y ejercicios resueltos paso a paso, al estilo Hull. Filtrá por tema y machacá lo que más te cuesta."
      />

      <div className="mb-7">
        <Segmented
          options={[
            { value: "flashcards", label: "Flashcards" },
            { value: "ejercicios", label: "Ejercicios resueltos" },
          ]}
          value={mode}
          onChange={(v) => setMode(v as "flashcards" | "ejercicios")}
        />
      </div>

      {mode === "flashcards" ? <Flashcards /> : <Exercises />}
    </div>
  );
}
