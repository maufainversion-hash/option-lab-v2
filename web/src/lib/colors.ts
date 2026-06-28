// Rampa de color de marca para superficies 3D y mapas de calor.
// Diverge: azul profundo → cian → bronce → coral.
type RGB = [number, number, number];

const STOPS: { t: number; c: RGB }[] = [
  { t: 0.0, c: [18, 32, 54] },
  { t: 0.28, c: [38, 104, 138] },
  { t: 0.5, c: [98, 210, 224] },
  { t: 0.72, c: [232, 176, 75] },
  { t: 1.0, c: [240, 97, 109] },
];

export function ramp(t: number): RGB {
  const x = Math.max(0, Math.min(1, t));
  for (let i = 0; i < STOPS.length - 1; i++) {
    const a = STOPS[i];
    const b = STOPS[i + 1];
    if (x >= a.t && x <= b.t) {
      const f = (x - a.t) / (b.t - a.t);
      return [
        a.c[0] + (b.c[0] - a.c[0]) * f,
        a.c[1] + (b.c[1] - a.c[1]) * f,
        a.c[2] + (b.c[2] - a.c[2]) * f,
      ];
    }
  }
  return STOPS[STOPS.length - 1].c;
}

export function rampCss(t: number, alpha = 1): string {
  const [r, g, b] = ramp(t);
  return `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${alpha})`;
}

export const COLORS = {
  ink0: "#07090c",
  ink1: "#0b0f14",
  ink2: "#11161d",
  line: "#232c37",
  line2: "#36424f",
  text: "#eef2f5",
  muted: "#97a3b2",
  dim: "#5d6875",
  brass: "#e8b04b",
  gain: "#3fcf8e",
  loss: "#f0616d",
  cyan: "#62d2e0",
  iris: "#7aa2ff",
};
