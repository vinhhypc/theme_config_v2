import { COLOR_SCALE_STEPS, type ColorScaleStep } from "@/lib/config/types";

export interface RGB {
  r: number;
  g: number;
  b: number;
}

/** Parse #rgb or #rrggbb into RGB. Returns null for invalid input. */
export function hexToRgb(hex: string): RGB | null {
  const m = hex.trim().match(/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) {
    h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  }
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));

export function rgbToHex({ r, g, b }: RGB): string {
  const toHex = (n: number) => clamp(n).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/** Mix a colour toward white (amount 0..1). */
function tint(rgb: RGB, amount: number): RGB {
  return {
    r: rgb.r + (255 - rgb.r) * amount,
    g: rgb.g + (255 - rgb.g) * amount,
    b: rgb.b + (255 - rgb.b) * amount,
  };
}

/** Mix a colour toward black (amount 0..1). */
function shade(rgb: RGB, amount: number): RGB {
  return {
    r: rgb.r * (1 - amount),
    g: rgb.g * (1 - amount),
    b: rgb.b * (1 - amount),
  };
}

/**
 * How far each step is tinted (toward white, steps < 500) or
 * shaded (toward black, steps > 500). Step 500 is the base colour.
 */
const TINT_BY_STEP: Record<ColorScaleStep, number> = {
  50: 0.95,
  100: 0.88,
  200: 0.74,
  300: 0.56,
  400: 0.3,
  500: 0,
  600: 0.12,
  700: 0.26,
  800: 0.42,
  900: 0.58,
};

/**
 * Generate a 50..900 scale from a single base hex.
 * 500 is the base colour; lighter steps are tints, darker steps are shades.
 */
export function generateColorScale(baseHex: string): Record<ColorScaleStep, string> {
  const base = hexToRgb(baseHex) ?? { r: 0, g: 0, b: 0 };
  const out = {} as Record<ColorScaleStep, string>;
  for (const step of COLOR_SCALE_STEPS) {
    const amount = TINT_BY_STEP[step];
    if (step < 500) out[step] = rgbToHex(tint(base, amount));
    else if (step > 500) out[step] = rgbToHex(shade(base, amount));
    else out[step] = rgbToHex(base);
  }
  return out;
}

/**
 * Convert a hex color to an HSL *channel* string like `"221 83% 53%"`,
 * the format shadcn/ui expects for its CSS variables (`hsl(var(--primary))`).
 */
export function hexToHslChannels(hex: string): string {
  const rgb = hexToRgb(hex) ?? { r: 0, g: 0, b: 0 };
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h /= 6;
  }
  const H = Math.round(h * 360);
  const S = Math.round(s * 100);
  const L = Math.round(l * 100);
  return `${H} ${S}% ${L}%`;
}

/** Relative luminance per WCAG. */
function relativeLuminance({ r, g, b }: RGB): number {
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** WCAG contrast ratio between two hex colours (1..21). */
export function contrastRatio(hexA: string, hexB: string): number {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  if (!a || !b) return 1;
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Choose black or white text for best contrast against a background hex. */
export function readableTextColor(bgHex: string): "#000000" | "#ffffff" {
  return contrastRatio(bgHex, "#ffffff") >= contrastRatio(bgHex, "#000000")
    ? "#ffffff"
    : "#000000";
}
