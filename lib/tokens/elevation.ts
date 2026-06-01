import type { DesignConfig } from "@/lib/config/types";

/**
 * Box-shadow presets per elevation style. Index 0 = no shadow.
 * We return up to `levels` shadows (level 0 is always "none").
 */
const PRESETS: Record<DesignConfig["elevation"]["style"], string[]> = {
  flat: [
    "none",
    "0 1px 1px rgba(0,0,0,0.04)",
    "0 1px 2px rgba(0,0,0,0.06)",
    "0 2px 3px rgba(0,0,0,0.06)",
    "0 2px 4px rgba(0,0,0,0.08)",
    "0 3px 6px rgba(0,0,0,0.08)",
  ],
  soft: [
    "none",
    "0 1px 2px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.10)",
    "0 2px 4px rgba(0,0,0,0.06), 0 4px 8px rgba(0,0,0,0.10)",
    "0 4px 8px rgba(0,0,0,0.08), 0 8px 16px rgba(0,0,0,0.12)",
    "0 8px 16px rgba(0,0,0,0.10), 0 16px 32px rgba(0,0,0,0.14)",
    "0 16px 32px rgba(0,0,0,0.12), 0 24px 48px rgba(0,0,0,0.16)",
  ],
  hard: [
    "none",
    "2px 2px 0 rgba(0,0,0,0.90)",
    "3px 3px 0 rgba(0,0,0,0.90)",
    "4px 4px 0 rgba(0,0,0,0.90)",
    "6px 6px 0 rgba(0,0,0,0.90)",
    "8px 8px 0 rgba(0,0,0,0.90)",
  ],
};

export interface ShadowToken {
  token: string; // e.g. "shadow-1"
  value: string; // CSS box-shadow value
}

export function generateElevation(elevation: DesignConfig["elevation"]): ShadowToken[] {
  const preset = PRESETS[elevation.style];
  const count = Math.min(elevation.levels, preset.length - 1);
  const out: ShadowToken[] = [{ token: "shadow-0", value: "none" }];
  for (let i = 1; i <= count; i++) {
    out.push({ token: `shadow-${i}`, value: preset[i] });
  }
  return out;
}
