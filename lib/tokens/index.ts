import {
  COLOR_ROLES,
  COLOR_SCALE_STEPS,
  type DesignConfig,
} from "@/lib/config/types";
import { generateColorScale } from "./color";
import { generateTypeScale, type TypeStep } from "./typography";
import { generateSpacing, generateRadius, type SpacingToken, type RadiusToken } from "./spacing";
import { generateElevation, type ShadowToken } from "./elevation";
import { generateOpacity, type OpacityToken } from "./opacity";

export * from "./color";
export * from "./typography";
export * from "./spacing";
export * from "./elevation";
export * from "./interactions";
export * from "./opacity";
export * from "./adapters";

export interface ColorTokenEntry {
  role: string; // "primary"
  step: number | null; // 600, or null for the base alias
  token: string; // "primary-600" or "primary"
  hex: string;
}

export interface ResolvedTokens {
  colors: ColorTokenEntry[];
  colorScales: Record<string, Record<number, string>>;
  type: TypeStep[];
  spacing: SpacingToken[];
  radius: RadiusToken[];
  elevation: ShadowToken[];
  opacity: OpacityToken[];
}

/**
 * Resolve a DesignConfig into the full set of concrete token values.
 * Pure function — the single source of truth for both markdown export and preview.
 */
export function resolveTokens(config: DesignConfig): ResolvedTokens {
  const colorScales: Record<string, Record<number, string>> = {};
  const colors: ColorTokenEntry[] = [];

  for (const role of COLOR_ROLES) {
    const baseHex = config.theme.colors[role];
    const scale = generateColorScale(baseHex);
    colorScales[role] = scale;
    // base alias points at the 500 step value
    colors.push({ role, step: null, token: role, hex: baseHex });
    for (const step of COLOR_SCALE_STEPS) {
      colors.push({ role, step, token: `${role}-${step}`, hex: scale[step] });
    }
  }

  return {
    colors,
    colorScales,
    type: generateTypeScale(config.typography),
    spacing: generateSpacing(config.spacing),
    radius: generateRadius(config.radius),
    elevation: generateElevation(config.elevation),
    opacity: generateOpacity(config),
  };
}

/** What goes inside a `--var: value;` declaration. */
export interface CssVar {
  name: string; // "--color-primary-600"
  value: string;
}

/** Build the CSS custom properties for `:root`. */
export function buildCssVars(config: DesignConfig): CssVar[] {
  const tokens = resolveTokens(config);
  const vars: CssVar[] = [];

  for (const c of tokens.colors) {
    const suffix = c.step === null ? c.role : `${c.role}-${c.step}`;
    vars.push({ name: `--color-${suffix}`, value: c.hex });
  }
  for (const s of tokens.spacing) {
    vars.push({ name: `--${s.token}`, value: `${s.px}px` });
  }
  for (const r of tokens.radius) {
    vars.push({ name: `--${r.token}`, value: r.px === "9999px" ? "9999px" : `${r.px}px` });
  }
  for (const e of tokens.elevation) {
    vars.push({ name: `--${e.token}`, value: e.value });
  }
  for (const o of tokens.opacity) {
    vars.push({ name: `--${o.token}`, value: o.value });
  }
  vars.push({ name: "--font-base", value: config.typography.fontFamilyBase });
  vars.push({ name: "--font-heading", value: config.typography.fontFamilyHeading });
  vars.push({ name: "--font-mono", value: config.typography.fontFamilyMono });
  vars.push({ name: "--text-base", value: `${config.typography.baseSize}px` });
  vars.push({ name: "--line-height", value: String(config.typography.lineHeight) });
  vars.push({ name: "--border-width", value: `${config.borders.width}px` });
  vars.push({ name: "--border-style", value: config.borders.style });
  vars.push({
    name: "--duration",
    value: config.animation.enabled ? `${config.animation.durationMs}ms` : "0ms",
  });
  vars.push({ name: "--easing", value: config.animation.easing });

  return vars;
}

/** Serialise CSS vars into a `:root { ... }` block string. */
export function cssVarsToBlock(config: DesignConfig, selector = ":root"): string {
  const vars = buildCssVars(config);
  const lines = vars.map((v) => `  ${v.name}: ${v.value};`).join("\n");
  return `${selector} {\n${lines}\n}`;
}

/** A flat record form, convenient for React inline `style` on the preview root. */
export function cssVarsToStyleObject(config: DesignConfig): Record<string, string> {
  const obj: Record<string, string> = {};
  for (const v of buildCssVars(config)) obj[v.name] = v.value;
  return obj;
}
