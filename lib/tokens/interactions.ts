import type { DesignConfig, HoverEffect } from "@/lib/config/types";

/** Human-readable summary of a hover effect (used in markdown + UI hints). */
export const HOVER_LABELS: Record<HoverEffect, string> = {
  none: "Không đổi",
  darken: "Đậm màu hơn (nền/màu sẫm đi 1 bậc)",
  lift: "Nâng lên (dịch lên + tăng đổ bóng)",
  scale: "Phóng to nhẹ (scale up)",
  glow: "Phát sáng (viền sáng theo màu primary)",
};

export const HOVER_LABELS_EN: Record<HoverEffect, string> = {
  none: "No change",
  darken: "Darken by one step",
  lift: "Lift (translateY up + larger shadow)",
  scale: "Slight scale-up",
  glow: "Glow ring in the primary color",
};

/** CSS declarations applied on `:hover` for a button-like surface. */
export function buttonHoverCss(effect: HoverEffect, baseColorVar = "--color-primary"): string {
  switch (effect) {
    case "darken":
      return `background: var(${baseColorVar}-700);`;
    case "lift":
      return "transform: translateY(-2px); box-shadow: var(--shadow-2);";
    case "scale":
      return "transform: scale(1.03);";
    case "glow":
      return `box-shadow: 0 0 0 3px color-mix(in srgb, var(${baseColorVar}-500) 40%, transparent);`;
    case "none":
    default:
      return "";
  }
}

/** CSS declarations applied on `:hover` for a card/surface. */
export function cardHoverCss(effect: HoverEffect): string {
  switch (effect) {
    case "darken":
      return "filter: brightness(0.98);";
    case "lift":
      return "transform: translateY(-3px); box-shadow: var(--shadow-3);";
    case "scale":
      return "transform: scale(1.01);";
    case "glow":
      return "box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary-500) 30%, transparent);";
    case "none":
    default:
      return "";
  }
}

export function activeCss(pressFeedback: boolean): string {
  return pressFeedback ? "transform: scale(0.97);" : "";
}

export function focusRingCss(focusRing: boolean): string {
  return focusRing
    ? "outline: 2px solid var(--color-primary-500); outline-offset: 2px;"
    : "outline: none;";
}

/** Tailwind-class equivalents for the chosen hover effect (for component-patterns.md). */
export function hoverTailwindClasses(config: DesignConfig): string {
  const e = config.interactions.hover;
  const map: Record<HoverEffect, string> = {
    none: "",
    darken: "hover:bg-[var(--color-primary-700)]",
    lift: "hover:-translate-y-0.5 hover:shadow-[var(--shadow-2)]",
    scale: "hover:scale-[1.03]",
    glow: "hover:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-primary-500)_40%,transparent)]",
  };
  const press = config.interactions.pressFeedback ? "active:scale-[0.97]" : "";
  const focus = config.interactions.focusRing
    ? "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary-500)]"
    : "focus-visible:outline-none";
  return [map[e], press, focus, "transition-all duration-[var(--duration)]"].filter(Boolean).join(" ");
}
