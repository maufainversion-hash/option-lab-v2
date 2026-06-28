interface StatProps {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "gain" | "loss" | "brass" | "cyan";
}

const TONE: Record<NonNullable<StatProps["tone"]>, string> = {
  default: "text-text",
  gain: "text-gain",
  loss: "text-loss",
  brass: "text-brass",
  cyan: "text-cyan",
};

export function Stat({ label, value, hint, tone = "default" }: StatProps) {
  return (
    <div className="panel-2 px-3.5 py-3">
      <div className="eyebrow mb-1 text-[10px]">{label}</div>
      <div className={`readout text-[20px] font-semibold leading-none ${TONE[tone]}`}>
        {value}
      </div>
      {hint && <div className="mt-1 text-[11px] text-dim">{hint}</div>}
    </div>
  );
}
