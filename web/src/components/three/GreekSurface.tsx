"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { greekByName, bsPrice, linspace, type GreekName } from "@/lib/quant";
import type { OptionType } from "@/lib/quant";

const Surface3D = dynamic(() => import("@/components/three/Surface3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <span className="readout text-[11px] uppercase tracking-[0.2em] text-dim">
        renderizando…
      </span>
    </div>
  ),
});

interface GreekSurfaceProps {
  metric: GreekName | "price";
  K: number;
  r: number;
  sigma: number;
  q?: number;
  optionType: OptionType;
}

export function GreekSurface({ metric, K, r, sigma, q = 0, optionType }: GreekSurfaceProps) {
  const z = useMemo(() => {
    const S = linspace(K * 0.55, K * 1.45, 44);
    const T = linspace(0.03, 1.3, 44);
    return T.map((t) =>
      S.map((s) =>
        metric === "price"
          ? bsPrice(s, K, t, r, sigma, q, optionType)
          : greekByName(metric, s, K, t, r, sigma, q, optionType),
      ),
    );
  }, [metric, K, r, sigma, q, optionType]);

  return <Surface3D z={z} autoRotate height={4} className="h-full w-full" />;
}
