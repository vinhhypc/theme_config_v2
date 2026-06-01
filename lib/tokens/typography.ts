import type { DesignConfig } from "@/lib/config/types";

export interface TypeStep {
  /** Token name, e.g. "text-lg" / "text-base". */
  token: string;
  /** Human label, e.g. "H1", "Body". */
  role: string;
  /** Computed size in px (rounded to 0.1). */
  px: number;
  /** Computed size in rem relative to baseSize. */
  rem: number;
}

/**
 * Build a modular type scale from baseSize × scaleRatio^n.
 * Negative steps (sm/xs) are baseSize ÷ ratio.
 */
export function generateTypeScale(typography: DesignConfig["typography"]): TypeStep[] {
  const { baseSize, scaleRatio } = typography;
  const steps: { token: string; role: string; exp: number }[] = [
    { token: "text-xs", role: "Caption / fine print", exp: -2 },
    { token: "text-sm", role: "Small / secondary", exp: -1 },
    { token: "text-base", role: "Body", exp: 0 },
    { token: "text-lg", role: "Lead paragraph", exp: 1 },
    { token: "text-xl", role: "H4", exp: 2 },
    { token: "text-2xl", role: "H3", exp: 3 },
    { token: "text-3xl", role: "H2", exp: 4 },
    { token: "text-4xl", role: "H1", exp: 5 },
  ];

  return steps.map(({ token, role, exp }) => {
    const px = Math.round(baseSize * Math.pow(scaleRatio, exp) * 10) / 10;
    const rem = Math.round((px / baseSize) * 1000) / 1000;
    return { token, role, px, rem };
  });
}
