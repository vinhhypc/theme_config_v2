import { describe, it, expect } from "vitest";
import {
  hexToRgb,
  rgbToHex,
  generateColorScale,
  contrastRatio,
  readableTextColor,
  hexToHslChannels,
} from "./color";
import { shadcnCssVars, antdThemeConfig } from "./adapters";
import { generateTypeScale } from "./typography";
import { generateSpacing, generateRadius } from "./spacing";
import { generateElevation } from "./elevation";
import { resolveTokens, buildCssVars, cssVarsToBlock } from "./index";
import { defaultConfig, cloneConfig } from "@/lib/config/defaults";

describe("color utils", () => {
  it("parses 3- and 6-digit hex", () => {
    expect(hexToRgb("#fff")).toEqual({ r: 255, g: 255, b: 255 });
    expect(hexToRgb("#2563eb")).toEqual({ r: 0x25, g: 0x63, b: 0xeb });
    expect(hexToRgb("not-a-color")).toBeNull();
  });

  it("round-trips rgb <-> hex", () => {
    expect(rgbToHex({ r: 37, g: 99, b: 235 })).toBe("#2563eb");
  });

  it("builds a 50..900 scale with base at 500", () => {
    const scale = generateColorScale("#2563eb");
    expect(scale[500]).toBe("#2563eb");
    // lighter at the top, darker at the bottom
    expect(hexToRgb(scale[50])!.r).toBeGreaterThan(hexToRgb(scale[500])!.r);
    expect(hexToRgb(scale[900])!.r).toBeLessThan(hexToRgb(scale[500])!.r);
  });

  it("computes contrast and picks readable text", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 0);
    expect(readableTextColor("#ffffff")).toBe("#000000");
    expect(readableTextColor("#000000")).toBe("#ffffff");
  });
});

describe("type scale", () => {
  it("computes sizes from base x ratio^n with body at base", () => {
    const scale = generateTypeScale(defaultConfig.typography);
    const body = scale.find((s) => s.token === "text-base")!;
    expect(body.px).toBe(defaultConfig.typography.baseSize);
    const h1 = scale.find((s) => s.token === "text-4xl")!;
    expect(h1.px).toBeGreaterThan(body.px);
  });
});

describe("spacing & radius", () => {
  it("maps spacing scale to px tokens", () => {
    const spacing = generateSpacing(defaultConfig.spacing);
    const four = spacing.find((s) => s.token === "space-4")!;
    expect(four.px).toBe(defaultConfig.spacing.baseUnit * 4);
  });

  it("forces zero radius when sharp and pill when pill", () => {
    const sharp = generateRadius({ style: "sharp", base: 8 });
    expect(sharp.find((r) => r.token === "radius-md")!.px).toBe(0);
    const pill = generateRadius({ style: "pill", base: 16 });
    expect(pill.find((r) => r.token === "radius-pill")!.px).toBe("9999px");
  });
});

describe("elevation", () => {
  it("returns levels+1 shadows (incl. shadow-0)", () => {
    const e = generateElevation({ style: "soft", levels: 3 });
    expect(e[0]).toEqual({ token: "shadow-0", value: "none" });
    expect(e.length).toBe(4);
  });
});

describe("library adapters", () => {
  it("hexToHslChannels returns 'H S% L%'", () => {
    expect(hexToHslChannels("#ffffff")).toBe("0 0% 100%");
    expect(hexToHslChannels("#000000")).toBe("0 0% 0%");
    expect(hexToHslChannels("#2563eb")).toMatch(/^\d+ \d+% \d+%$/);
  });

  it("shadcn adapter maps semantic vars and adds .dark when mode=both", () => {
    const c = cloneConfig(defaultConfig);
    c.theme.mode = "both";
    const css = shadcnCssVars(c);
    expect(css).toContain("--primary:");
    expect(css).toContain("--ring:");
    expect(css).toContain("--radius:");
    expect(css).toContain(".dark {");
  });

  it("shadcn adapter has no .dark when mode=light", () => {
    const c = cloneConfig(defaultConfig);
    c.theme.mode = "light";
    expect(shadcnCssVars(c)).not.toContain(".dark {");
  });

  it("antd adapter emits seed tokens + ConfigProvider usage", () => {
    const css = antdThemeConfig(defaultConfig);
    expect(css).toContain("colorPrimary");
    expect(css).toContain(defaultConfig.theme.colors.primary);
    expect(css).toContain("ConfigProvider");
  });
});

describe("opacity tokens", () => {
  it("derives a primary opacity ramp + semantic + black/white overlays", () => {
    const t = resolveTokens(defaultConfig);
    expect(t.opacity.find((o) => o.token === "opacity-primary-5")).toBeTruthy();
    expect(t.opacity.find((o) => o.token === "opacity-error-5")).toBeTruthy();
    expect(t.opacity.find((o) => o.token === "opacity-black-7")).toBeTruthy();
    // primary ramp uses the configured primary color channels
    const p5 = t.opacity.find((o) => o.token === "opacity-primary-5")!;
    expect(p5.value.startsWith("rgba(")).toBe(true);
  });

  it("emits opacity CSS variables", () => {
    const block = cssVarsToBlock(defaultConfig);
    expect(block).toContain("--opacity-primary-5:");
    expect(block).toContain("--opacity-black-7:");
  });
});

describe("resolveTokens & css vars", () => {
  it("includes base alias + all scale steps per color role", () => {
    const t = resolveTokens(defaultConfig);
    // 8 roles * (1 base + 10 steps) = 88
    expect(t.colors.length).toBe(8 * 11);
  });

  it("emits a :root block with color/spacing/radius variables", () => {
    const block = cssVarsToBlock(defaultConfig);
    expect(block.startsWith(":root {")).toBe(true);
    expect(block).toContain("--color-primary-600:");
    expect(block).toContain("--space-4:");
    expect(block).toContain("--radius-md:");
    expect(block).toContain("--font-base:");
  });

  it("disables duration when animation is off", () => {
    const c = cloneConfig(defaultConfig);
    c.animation.enabled = false;
    const vars = buildCssVars(c);
    expect(vars.find((v) => v.name === "--duration")!.value).toBe("0ms");
  });
});
