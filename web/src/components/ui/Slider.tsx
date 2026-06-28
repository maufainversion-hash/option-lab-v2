"use client";

import { useEffect, useRef } from "react";

interface SliderProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  format?: (v: number) => string;
  accent?: string;
}

export function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step = 0.01,
  format,
  accent = "var(--color-brass)",
}: SliderProps) {
  const ref = useRef<HTMLInputElement>(null);
  const pct = ((value - min) / (max - min)) * 100;

  // Evitar que el scroll de la página cambie el valor al pasar sobre el slider.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const block = (e: WheelEvent) => e.preventDefault();
    el.addEventListener("wheel", block, { passive: false });
    return () => el.removeEventListener("wheel", block);
  }, []);

  return (
    <label className="block select-none">
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-[12px] font-medium text-muted">{label}</span>
        <span className="readout text-[13px] font-semibold text-text">
          {format ? format(value) : value.toFixed(2)}
        </span>
      </div>
      <input
        ref={ref}
        type="range"
        className="range-brass"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{
          background: `linear-gradient(90deg, ${accent} ${pct}%, var(--color-ink-3) ${pct}%)`,
        }}
      />
    </label>
  );
}
