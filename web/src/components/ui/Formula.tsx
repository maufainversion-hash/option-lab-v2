"use client";

import { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface FormulaProps {
  tex: string;
  display?: boolean;
  className?: string;
}

export function Formula({ tex, display = false, className = "" }: FormulaProps) {
  const html = useMemo(
    () =>
      katex.renderToString(tex, {
        displayMode: display,
        throwOnError: false,
        output: "html",
      }),
    [tex, display],
  );
  return (
    <span
      className={className}
      style={display ? { display: "block", overflowX: "auto", overflowY: "hidden" } : undefined}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
