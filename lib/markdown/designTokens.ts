import { COLOR_ROLES, type DesignConfig } from "@/lib/config/types";
import { resolveTokens, cssVarsToBlock } from "@/lib/tokens";
import { header, table, codeBlock, type GenerateOptions } from "./shared";

const COLOR_USAGE: Record<string, string> = {
  primary: "Main actions, links, brand emphasis",
  secondary: "Supporting actions, secondary surfaces",
  accent: "Highlights, callouts, badges",
  neutral: "Text, borders, backgrounds (gray scale)",
  success: "Positive states, confirmations",
  warning: "Cautions, pending states",
  error: "Errors, destructive actions",
  info: "Informational messages",
};

/**
 * `design-tokens.md` — the complete list of token values in three forms:
 * human-readable tables, JSON, and CSS variables.
 */
export function generateDesignTokens(config: DesignConfig, opts?: GenerateOptions): string {
  const t = resolveTokens(config);
  const parts: string[] = [];

  parts.push(header(config, opts));
  parts.push(`# Design Tokens — ${config.meta.name}`);
  parts.push(
    `> Single source of truth for all design values. Reference these tokens; never hard-code raw hex/px values.`,
  );

  // Colors
  parts.push(`## Colors`);
  for (const role of COLOR_ROLES) {
    const rows: (string | number)[][] = [[`${role}`, config.theme.colors[role], COLOR_USAGE[role] ?? ""]];
    for (const step of [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]) {
      rows.push([`${role}-${step}`, t.colorScales[role][step], step === 500 ? "base" : ""]);
    }
    parts.push(`### ${role}`);
    parts.push(table(["Token", "Hex", "Used for"], rows));
  }

  // Typography
  parts.push(`## Typography`);
  parts.push(
    table(
      ["Property", "Value"],
      [
        ["Base font", config.typography.fontFamilyBase],
        ["Heading font", config.typography.fontFamilyHeading],
        ["Mono font", config.typography.fontFamilyMono],
        ["Base size", `${config.typography.baseSize}px`],
        ["Scale ratio", config.typography.scaleRatio],
        ["Line height", config.typography.lineHeight],
        ["Weights", config.typography.weights.join(", ")],
      ],
    ),
  );
  parts.push(
    table(
      ["Token", "Role", "Size (px)", "Size (rem)"],
      t.type.map((s) => [s.token, s.role, s.px, `${s.rem}rem`]),
    ),
  );

  // Spacing
  parts.push(`## Spacing`);
  parts.push(`Base unit: \`${config.spacing.baseUnit}px\`. Always compose spacing from these tokens.`);
  parts.push(table(["Token", "Multiplier", "px"], t.spacing.map((s) => [s.token, s.step, s.px])));

  // Radius
  parts.push(`## Radius`);
  parts.push(
    table(
      ["Token", "Value"],
      t.radius.map((r) => [r.token, r.px === "9999px" ? "9999px" : `${r.px}px`]),
    ),
  );

  // Borders
  parts.push(`## Borders`);
  parts.push(
    table(
      ["Property", "Value"],
      [
        ["Width", `${config.borders.width}px`],
        ["Style", config.borders.style],
        ["Default color token", config.borders.defaultColorToken],
      ],
    ),
  );

  // Elevation
  parts.push(`## Elevation`);
  parts.push(`Style: \`${config.elevation.style}\`.`);
  parts.push(table(["Token", "box-shadow"], t.elevation.map((e) => [e.token, e.value])));

  // Opacity / overlays
  parts.push(`## Opacity`);
  parts.push(`Translucent tokens for overlays, scrims, inverse surfaces and emphasis layers. Use these instead of ad-hoc \`rgba()\`.`);
  parts.push(table(["Token", "Value", "Use for"], t.opacity.map((o) => [
    o.token,
    o.value,
    o.role === "black" || o.role === "white" ? "scrims / overlays" : o.role === "primary" ? "brand emphasis layers" : "status tint",
  ])));

  // Animation
  parts.push(`## Animation`);
  parts.push(
    table(
      ["Property", "Value"],
      [
        ["Enabled", String(config.animation.enabled)],
        ["Style", config.animation.style],
        ["Duration", `${config.animation.durationMs}ms`],
        ["Easing", config.animation.easing],
      ],
    ),
  );

  // JSON export
  parts.push(`## JSON export`);
  const json = {
    meta: config.meta,
    colors: t.colorScales,
    typography: { ...config.typography, scale: t.type },
    spacing: t.spacing,
    radius: t.radius,
    borders: config.borders,
    elevation: t.elevation,
    opacity: t.opacity,
    animation: config.animation,
  };
  parts.push(codeBlock("json", JSON.stringify(json, null, 2)));

  // CSS Variables
  parts.push(`## CSS Variables`);
  let css = cssVarsToBlock(config, ":root");
  if (config.theme.mode === "both") {
    css +=
      "\n\n" +
      `[data-theme="dark"] {\n  /* Override neutrals/backgrounds for dark mode. Adjust to taste. */\n` +
      `  --color-neutral-50: ${t.colorScales.neutral[900]};\n` +
      `  --color-neutral-900: ${t.colorScales.neutral[50]};\n}`;
  }
  parts.push(codeBlock("css", css));

  return parts.join("\n\n") + "\n";
}
