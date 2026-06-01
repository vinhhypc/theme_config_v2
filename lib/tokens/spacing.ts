import type { DesignConfig } from "@/lib/config/types";

export interface SpacingToken {
  token: string; // e.g. "space-4"
  step: number; // multiplier
  px: number; // baseUnit * step
}

/** Map the spacing scale into `space-N` tokens. */
export function generateSpacing(spacing: DesignConfig["spacing"]): SpacingToken[] {
  return spacing.scale.map((step) => ({
    token: `space-${step}`,
    step,
    px: Math.round(spacing.baseUnit * step * 100) / 100,
  }));
}

export interface RadiusToken {
  token: string;
  px: number | "9999px";
}

/**
 * Radius tokens derived from base radius and style.
 * "pill" forces a large radius for the `radius-pill` token.
 */
export function generateRadius(radius: DesignConfig["radius"]): RadiusToken[] {
  if (radius.style === "sharp") {
    return [
      { token: "radius-none", px: 0 },
      { token: "radius-sm", px: 0 },
      { token: "radius-md", px: 0 },
      { token: "radius-lg", px: 0 },
      { token: "radius-pill", px: "9999px" },
    ];
  }
  const base = radius.base;
  return [
    { token: "radius-none", px: 0 },
    { token: "radius-sm", px: Math.round(base * 0.5 * 100) / 100 },
    { token: "radius-md", px: base },
    { token: "radius-lg", px: Math.round(base * 1.5 * 100) / 100 },
    { token: "radius-pill", px: radius.style === "pill" ? "9999px" : Math.round(base * 2 * 100) / 100 },
  ];
}
