import type { DesignConfig, ThemeStyle } from "./types";
import { cloneConfig, defaultConfig } from "./defaults";

/**
 * Style presets fill the config quickly; the user can then fine-tune.
 * Each preset is a deep-merge patch applied on top of `defaultConfig`.
 */
export interface StylePreset {
  id: ThemeStyle;
  label: string;
  description: string;
  apply: (base: DesignConfig) => DesignConfig;
}

function patch(base: DesignConfig, fn: (c: DesignConfig) => void): DesignConfig {
  const next = cloneConfig(base);
  fn(next);
  return next;
}

export const presets: StylePreset[] = [
  {
    id: "modern",
    label: "Hiện đại",
    description: "Xanh dương/tím tươi, bóng mềm, chuyển động mượt, bo góc vừa.",
    apply: (base) =>
      patch(base, (c) => {
        c.theme.style = "modern";
        c.theme.colors.primary = "#2563eb";
        c.theme.colors.secondary = "#7c3aed";
        c.theme.colors.accent = "#f59e0b";
        c.typography.fontFamilyBase = "Inter, sans-serif";
        c.typography.fontFamilyHeading = "Inter, sans-serif";
        c.radius = { style: "rounded", base: 8 };
        c.elevation = { style: "soft", levels: 4 };
        c.animation = { enabled: true, style: "smooth", durationMs: 200, easing: "cubic-bezier(0.4, 0, 0.2, 1)" };
        c.interactions = { hover: "lift", pressFeedback: true, focusRing: true, underlineLinks: true };
      }),
  },
  {
    id: "classic",
    label: "Cổ điển",
    description: "Tiêu đề serif, xanh navy + vàng đồng, bo góc nhẹ, cạnh cứng.",
    apply: (base) =>
      patch(base, (c) => {
        c.theme.style = "classic";
        c.theme.colors.primary = "#1e3a8a";
        c.theme.colors.secondary = "#334155";
        c.theme.colors.accent = "#b45309";
        c.typography.fontFamilyHeading = "Georgia, 'Times New Roman', serif";
        c.typography.fontFamilyBase = "Georgia, serif";
        c.typography.scaleRatio = 1.2;
        c.radius = { style: "rounded", base: 4 };
        c.elevation = { style: "hard", levels: 3 };
        c.animation = { enabled: true, style: "subtle", durationMs: 150, easing: "ease-in-out" };
        c.interactions = { hover: "darken", pressFeedback: false, focusRing: true, underlineLinks: true };
      }),
  },
  {
    id: "minimal",
    label: "Tối giản",
    description: "Trung tính đơn sắc, bề mặt phẳng, góc vuông, gần như không chuyển động.",
    apply: (base) =>
      patch(base, (c) => {
        c.theme.style = "minimal";
        c.theme.colors.primary = "#111827";
        c.theme.colors.secondary = "#374151";
        c.theme.colors.accent = "#6b7280";
        c.typography.fontFamilyBase = "Inter, sans-serif";
        c.typography.scaleRatio = 1.2;
        c.radius = { style: "sharp", base: 2 };
        c.elevation = { style: "flat", levels: 2 };
        c.borders = { width: 1, style: "solid", defaultColorToken: "neutral-200" };
        c.animation = { enabled: true, style: "subtle", durationMs: 120, easing: "ease-out" };
        c.interactions = { hover: "darken", pressFeedback: false, focusRing: true, underlineLinks: false };
      }),
  },
  {
    id: "playful",
    label: "Vui nhộn",
    description: "Hồng/xanh ngọc tươi sáng, bo viên thuốc, chuyển động nảy, bo tròn mọi thứ.",
    apply: (base) =>
      patch(base, (c) => {
        c.theme.style = "playful";
        c.theme.colors.primary = "#ec4899";
        c.theme.colors.secondary = "#14b8a6";
        c.theme.colors.accent = "#facc15";
        c.typography.fontFamilyHeading = "'Poppins', sans-serif";
        c.typography.fontFamilyBase = "'Poppins', sans-serif";
        c.typography.scaleRatio = 1.333;
        c.radius = { style: "pill", base: 16 };
        c.elevation = { style: "soft", levels: 5 };
        c.animation = { enabled: true, style: "bouncy", durationMs: 300, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" };
        c.interactions = { hover: "scale", pressFeedback: true, focusRing: true, underlineLinks: true };
      }),
  },
  {
    id: "brutalist",
    label: "Brutalist",
    description: "Đen/trắng tương phản cao, viền dày, không bo góc, bóng cứng.",
    apply: (base) =>
      patch(base, (c) => {
        c.theme.style = "brutalist";
        c.theme.colors.primary = "#000000";
        c.theme.colors.secondary = "#ffffff";
        c.theme.colors.accent = "#ff3b3b";
        c.theme.colors.neutral = "#1a1a1a";
        c.typography.fontFamilyBase = "'Space Mono', monospace";
        c.typography.fontFamilyHeading = "'Space Mono', monospace";
        c.typography.scaleRatio = 1.414;
        c.radius = { style: "sharp", base: 0 };
        c.elevation = { style: "hard", levels: 3 };
        c.borders = { width: 3, style: "solid", defaultColorToken: "neutral-900" };
        c.animation = { enabled: false, style: "none", durationMs: 0, easing: "linear" };
        c.interactions = { hover: "none", pressFeedback: false, focusRing: true, underlineLinks: true };
      }),
  },
];

export function applyPreset(id: ThemeStyle, base: DesignConfig = defaultConfig): DesignConfig {
  const preset = presets.find((p) => p.id === id);
  return preset ? preset.apply(base) : cloneConfig(base);
}
