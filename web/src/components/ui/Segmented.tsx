"use client";

interface SegmentedProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  size?: "sm" | "md";
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  size = "md",
}: SegmentedProps<T>) {
  return (
    <div className="inline-flex rounded-lg border border-line bg-ink-2 p-0.5">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`rounded-[7px] font-medium transition-all ${
              size === "sm" ? "px-2.5 py-1 text-[12px]" : "px-3.5 py-1.5 text-[13px]"
            } ${
              active
                ? "bg-ink-3 text-text shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]"
                : "text-muted hover:text-text"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
