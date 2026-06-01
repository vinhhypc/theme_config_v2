import type { DesignConfig } from "@/lib/config/types";
import { generateColorScale, hexToHslChannels, readableTextColor } from "./color";

/**
 * Adapters that map a DesignConfig onto popular component libraries.
 * Pure functions returning ready-to-paste code strings.
 */

/**
 * shadcn/ui `globals.css` — maps our token scales onto shadcn's semantic CSS
 * variables, in the HSL-channel format shadcn uses (`hsl(var(--primary))`).
 */
export function shadcnCssVars(config: DesignConfig): string {
  const c = config.theme.colors;
  const primary = generateColorScale(c.primary);
  const neutral = generateColorScale(c.neutral);
  const error = generateColorScale(c.error);
  const h = hexToHslChannels;

  const light = [
    `  --background: ${h(neutral[50])};`,
    `  --foreground: ${h(neutral[900])};`,
    `  --card: ${h("#ffffff")};`,
    `  --card-foreground: ${h(neutral[900])};`,
    `  --popover: ${h("#ffffff")};`,
    `  --popover-foreground: ${h(neutral[900])};`,
    `  --primary: ${h(primary[600])};`,
    `  --primary-foreground: ${h(readableTextColor(primary[600]))};`,
    `  --secondary: ${h(neutral[100])};`,
    `  --secondary-foreground: ${h(neutral[900])};`,
    `  --muted: ${h(neutral[100])};`,
    `  --muted-foreground: ${h(neutral[600])};`,
    `  --accent: ${h(neutral[100])};`,
    `  --accent-foreground: ${h(neutral[900])};`,
    `  --destructive: ${h(error[600])};`,
    `  --destructive-foreground: ${h("#ffffff")};`,
    `  --border: ${h(neutral[200])};`,
    `  --input: ${h(neutral[200])};`,
    `  --ring: ${h(primary[500])};`,
    `  --radius: ${config.radius.base}px;`,
  ].join("\n");

  let css = `:root {\n${light}\n}`;

  if (config.theme.mode === "both" || config.theme.mode === "dark") {
    const dark = [
      `  --background: ${h(neutral[900])};`,
      `  --foreground: ${h(neutral[50])};`,
      `  --card: ${h(neutral[900])};`,
      `  --card-foreground: ${h(neutral[50])};`,
      `  --popover: ${h(neutral[900])};`,
      `  --popover-foreground: ${h(neutral[50])};`,
      `  --primary: ${h(primary[500])};`,
      `  --primary-foreground: ${h(readableTextColor(primary[500]))};`,
      `  --secondary: ${h(neutral[800])};`,
      `  --secondary-foreground: ${h(neutral[50])};`,
      `  --muted: ${h(neutral[800])};`,
      `  --muted-foreground: ${h(neutral[300])};`,
      `  --accent: ${h(neutral[800])};`,
      `  --accent-foreground: ${h(neutral[50])};`,
      `  --destructive: ${h(error[500])};`,
      `  --destructive-foreground: ${h("#ffffff")};`,
      `  --border: ${h(neutral[700])};`,
      `  --input: ${h(neutral[700])};`,
      `  --ring: ${h(primary[500])};`,
    ].join("\n");
    css += `\n\n.dark {\n${dark}\n}`;
  }

  return css;
}

/**
 * Ant Design v6 theme config for `<ConfigProvider theme={...}>`.
 * antd derives its own palettes from these seed tokens.
 */
export function antdThemeConfig(config: DesignConfig): string {
  const c = config.theme.colors;
  const algoComment =
    config.theme.mode === "both"
      ? " // light + dark: swap to theme.darkAlgorithm when in dark mode"
      : config.theme.mode === "dark"
        ? ""
        : "";
  const algo =
    config.theme.mode === "dark" ? "theme.darkAlgorithm" : "theme.defaultAlgorithm";

  return [
    `import { theme, type ThemeConfig } from "antd";`,
    ``,
    `export const themeConfig: ThemeConfig = {`,
    `  token: {`,
    `    colorPrimary: "${c.primary}",`,
    `    colorSuccess: "${c.success}",`,
    `    colorWarning: "${c.warning}",`,
    `    colorError: "${c.error}",`,
    `    colorInfo: "${c.info}",`,
    `    colorTextBase: "${c.neutral}",`,
    `    borderRadius: ${config.radius.base},`,
    `    fontFamily: ${JSON.stringify(config.typography.fontFamilyBase)},`,
    `    fontSize: ${config.typography.baseSize},`,
    `    lineHeight: ${config.typography.lineHeight},`,
    `    motionDurationMid: "${config.animation.enabled ? config.animation.durationMs : 0}ms",`,
    `    wireframe: false,`,
    `  },`,
    `  algorithm: ${algo},${algoComment}`,
    `};`,
    ``,
    `// Usage:`,
    `// <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>`,
  ].join("\n");
}
