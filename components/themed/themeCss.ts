/**
 * Shared theming layer for the component showcase (Storybook) and any other
 * surface that needs to render real components using a `DesignConfig`.
 *
 * It reuses the exact same token resolution + interaction helpers as the Live
 * Preview, so a component shown in Storybook looks identical to how it appears
 * in the in-app preview for the same config.
 */
import type { CSSProperties } from "react";
import type { DesignConfig } from "@/lib/config/types";
import {
  cssVarsToStyleObject,
  buttonHoverCss,
  activeCss,
  focusRingCss,
} from "@/lib/tokens";

export type Mode = "light" | "dark";

/**
 * Semantic surface vars per mode (`--surface`, `--text`, …) layered on top of
 * the raw colour scale. Single source of truth for the Live Preview, the
 * showcase surface, and the baked `theme-tokens.css`.
 */
export const SEMANTIC_VARS: Record<Mode, Record<string, string>> = {
  light: {
    "--surface": "var(--color-neutral-50)",
    "--surface-2": "#ffffff",
    "--text": "var(--color-neutral-900)",
    "--text-muted": "var(--color-neutral-600)",
    "--border-c": "var(--color-neutral-200)",
  },
  dark: {
    "--surface": "var(--color-neutral-900)",
    "--surface-2": "var(--color-neutral-800)",
    "--text": "var(--color-neutral-50)",
    "--text-muted": "var(--color-neutral-300)",
    "--border-c": "var(--color-neutral-700)",
  },
};

/**
 * The full set of CSS custom properties for a config, plus the semantic
 * surface vars resolved for the given light/dark mode. Mirrors `LivePreview`.
 */
export function themeVars(config: DesignConfig, mode: Mode): CSSProperties {
  const vars = cssVarsToStyleObject(config) as Record<string, string>;
  Object.assign(vars, SEMANTIC_VARS[mode]);
  return vars as CSSProperties;
}

/**
 * Button stylesheet (`.tcb`), with every selector prefixed by `prefix`.
 * Pass `".${scope} "` for a scoped instance (multiple themed surfaces on one
 * page), or `""` for a global stylesheet (e.g. the baked `theme-tokens.css`
 * shipped when a component is installed into another project). Hover / focus /
 * active states are derived from `config.interactions`.
 */
export function buttonRules(prefix: string, config: DesignConfig): string {
  const i = config.interactions;
  const transition = "transition: all var(--duration) var(--easing);";
  const focus = focusRingCss(i.focusRing);
  const active = activeCss(i.pressFeedback);
  const btnHover = (colorVar: string) => buttonHoverCss(i.hover, colorVar);
  const ghostHover =
    i.hover === "darken"
      ? "background: var(--color-primary-50);"
      : buttonHoverCss(i.hover, "--color-primary");
  const base = config.typography.baseSize;

  return `
${prefix}.tcb { font-family: var(--font-base); font-weight: 600; font-size: ${base - 1}px; padding: var(--space-2) var(--space-4); border-radius: var(--radius-md); border: var(--border-width) var(--border-style) transparent; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: var(--space-2); line-height: 1.2; ${transition} }
${prefix}.tcb:focus-visible { ${focus} }
${prefix}.tcb:active { ${active} }
${prefix}.tcb[disabled] { opacity: .5; pointer-events: none; }
${prefix}.tcb--sm { padding: var(--space-1) var(--space-3); font-size: ${base - 3}px; }
${prefix}.tcb--lg { padding: var(--space-3) var(--space-6); font-size: ${base + 1}px; }
${prefix}.tcb--primary { background: var(--color-primary-600); color: #fff; }
${prefix}.tcb--primary:hover { ${btnHover("--color-primary")} }
${prefix}.tcb--secondary { background: var(--color-secondary-600); color: #fff; }
${prefix}.tcb--secondary:hover { ${btnHover("--color-secondary")} }
${prefix}.tcb--destructive { background: var(--color-error-600); color: #fff; }
${prefix}.tcb--destructive:hover { ${btnHover("--color-error")} }
${prefix}.tcb--ghost { background: transparent; color: var(--color-primary-700); }
${prefix}.tcb--ghost:hover { ${ghostHover} }
${prefix}.tcb--outline { background: transparent; color: var(--text); border-color: var(--border-c); }
${prefix}.tcb--outline:hover { ${ghostHover} border-color: var(--color-primary-400); }
@media (prefers-reduced-motion: reduce) { ${prefix}.tcb { transition: none !important; } }
`;
}

/**
 * Scoped Button stylesheet — every selector prefixed by `.${scope}` so multiple
 * themed surfaces can coexist on one page. Used by `<ThemedSurface>`.
 */
export function buttonCss(scope: string, config: DesignConfig): string {
  return buttonRules(`.${scope} `, config);
}
