import type { DesignConfig } from "@/lib/config/types";
import { hexToRgb } from "./color";

export interface OpacityToken {
  token: string; // e.g. "opacity-primary-5"
  value: string; // rgba(...)
  role: string;
  alpha: number;
}

/**
 * Alpha ramp for the primary opacity scale (overlays, emphasis layers, scrims).
 * Mirrors a perceptually spaced set so low steps are subtle tints and high
 * steps are near-solid.
 */
const PRIMARY_ALPHAS = [0.03, 0.08, 0.13, 0.18, 0.24, 0.35, 0.44, 0.52, 0.68, 0.8, 0.92];

/** Single mid-strength alpha used for semantic + black/white overlay tokens. */
const MID_ALPHA = 0.35;

function rgba(hex: string, alpha: number): string {
  const c = hexToRgb(hex) ?? { r: 0, g: 0, b: 0 };
  return `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha})`;
}

/**
 * Derive opacity/overlay tokens purely from the configured colors.
 * No extra config needed — these are computed alongside the colour scales.
 */
export function generateOpacity(config: DesignConfig): OpacityToken[] {
  const out: OpacityToken[] = [];

  PRIMARY_ALPHAS.forEach((alpha, i) => {
    out.push({ token: `opacity-primary-${i}`, value: rgba(config.theme.colors.primary, alpha), role: "primary", alpha });
  });

  (["secondary", "accent", "success", "warning", "error", "info"] as const).forEach((role) => {
    out.push({ token: `opacity-${role}-5`, value: rgba(config.theme.colors[role], MID_ALPHA), role, alpha: MID_ALPHA });
  });

  // Black / white overlays for scrims and inverse surfaces.
  out.push({ token: "opacity-black-5", value: "rgba(0, 0, 0, 0.35)", role: "black", alpha: 0.35 });
  out.push({ token: "opacity-black-7", value: "rgba(0, 0, 0, 0.52)", role: "black", alpha: 0.52 });
  out.push({ token: "opacity-white-5", value: "rgba(255, 255, 255, 0.35)", role: "white", alpha: 0.35 });

  return out;
}

/** The recommended modal/scrim overlay token name. */
export const SCRIM_TOKEN = "opacity-black-7";
