"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { vega, linspace } from "@/lib/quant";

const Surface3D = dynamic(() => import("@/components/three/Surface3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <span className="readout text-[11px] uppercase tracking-[0.2em] text-dim">
        renderizando superficie…
      </span>
    </div>
  ),
});

export function HeroSurface() {
  const z = useMemo(() => {
    const K = 100;
    const r = 0.05;
    const sigma = 0.25;
    const S = linspace(62, 138, 46);
    const T = linspace(0.05, 1.4, 46);
    return T.map((t) => S.map((s) => vega(s, K, t, r, sigma, 0)));
  }, []);

  return <Surface3D z={z} autoRotate height={4.2} className="h-full w-full" />;
}
