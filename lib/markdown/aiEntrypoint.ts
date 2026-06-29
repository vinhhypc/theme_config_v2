import type { DesignConfig } from "@/lib/config/types";
import { effectiveStack, usesComponentPackage } from "@/lib/config/types";
import { slugify } from "@/lib/utils";
import { cssVarsToBlock, resolveTokens, shadcnCssVars, antdThemeConfig } from "@/lib/tokens";
import { header, codeBlock, type GenerateOptions } from "./shared";

function tailwindConfigSnippet(config: DesignConfig): string {
  return [
    `// tailwind.config.ts — map tokens to Tailwind. CSS variables are the source of truth.`,
    `import type { Config } from "tailwindcss";`,
    ``,
    `export default {`,
    `  content: ["./src/**/*.{ts,tsx,html,vue}"],`,
    `  theme: {`,
    `    extend: {`,
    `      colors: {`,
    `        primary: { 50: "var(--color-primary-50)", 600: "var(--color-primary-600)", 900: "var(--color-primary-900)" /* …50–900 */ },`,
    `        neutral: { 50: "var(--color-neutral-50)", 700: "var(--color-neutral-700)", 900: "var(--color-neutral-900)" },`,
    `        // …secondary, accent, success, warning, error, info`,
    `      },`,
    `      borderRadius: { sm: "var(--radius-sm)", md: "var(--radius-md)", lg: "var(--radius-lg)" },`,
    `      transitionDuration: { DEFAULT: "var(--duration)" },`,
    `      fontFamily: { sans: ["var(--font-base)"], heading: ["var(--font-heading)"], mono: ["var(--font-mono)"] },`,
    `    },`,
    `  },`,
    `} satisfies Config;`,
  ].join("\n");
}

/**
 * `ai-entrypoint.md` — the single file to paste at the top of every generation.
 * Summarises the system, embeds the token CSS variables, links the other files,
 * and provides a ready-to-use starter prompt.
 */
export function generateAiEntrypoint(config: DesignConfig, opts?: GenerateOptions): string {
  const t = resolveTokens(config);
  const stack = effectiveStack(config);
  // Human-readable label: base framework, plus the component library when set.
  const stackLabel =
    config.meta.componentLib !== "none" && (config.meta.targetStack === "react-tailwind" || config.meta.targetStack === "next")
      ? `${config.meta.targetStack} + ${config.meta.componentLib}`
      : config.meta.targetStack;
  const isTailwind =
    stack === "react-tailwind" ||
    stack === "vue-tailwind" ||
    stack === "next" ||
    stack === "shadcn";
  const parts: string[] = [];

  parts.push(header(config, opts));
  parts.push(`# AI Entrypoint — ${config.meta.name}`);
  parts.push(
    `> Paste this file at the start of every code-generation request. It is the one-stop contract that binds generated code to this design system.`,
  );

  parts.push(`## Summary`);
  parts.push(
    [
      `- **System:** ${config.meta.name} v${config.meta.version}${config.meta.description ? ` — ${config.meta.description}` : ""}`,
      `- **Target stack:** ${stackLabel}`,
      `- **Theme:** ${config.theme.style}, mode ${config.theme.mode}`,
      `- **Primary / Accent:** ${config.theme.colors.primary} / ${config.theme.colors.accent}`,
      `- **Type:** ${config.typography.fontFamilyBase}, base ${config.typography.baseSize}px, ratio ${config.typography.scaleRatio}`,
      `- **Radius:** ${config.radius.style} (${config.radius.base}px) · **Elevation:** ${config.elevation.style} · **Motion:** ${config.animation.enabled ? config.animation.style : "off"}`,
      `- **Hover:** ${config.interactions.hover} · **Press feedback:** ${config.interactions.pressFeedback ? "on" : "off"} · **Focus ring:** ${config.interactions.focusRing ? "on" : "off"}`,
      `- **Accessibility target:** WCAG ${config.aiRules.accessibility}`,
    ].join("\n"),
  );

  const slug = slugify(config.meta.name);
  parts.push(`## Companion files`);
  parts.push(
    [
      `This entrypoint embeds the essentials. For full detail, also load:`,
      `- \`${slug}-design-tokens.md\` — every token value (tables + JSON + CSS variables).`,
      `- \`${slug}-design-guidelines.md\` — how to apply tokens (color/contrast/spacing/typography rules).`,
      `- \`${slug}-component-patterns.md\` — reference component code for ${stackLabel}.`,
      `- \`${slug}-ai-rules.md\` — mandatory constraints + pre-flight checklist.`,
    ].join("\n"),
  );

  parts.push(`## Core tokens (CSS variables)`);
  parts.push(`Import these once at the app root (e.g. \`globals.css\`) so every component can reference them.`);
  let css = cssVarsToBlock(config, ":root");
  if (config.theme.mode === "both") {
    css +=
      `\n\n[data-theme="dark"] {\n  --color-neutral-50: ${t.colorScales.neutral[900]};\n  --color-neutral-900: ${t.colorScales.neutral[50]};\n}`;
  }
  parts.push(codeBlock("css", css));

  parts.push(`## Stack setup`);
  if (usesComponentPackage(config)) {
    parts.push(
      `This system ships a prebuilt component package. Install it and wrap your app in \`<ThemeProvider>\` — see the **Use the component package (npm)** section in \`${slug}-component-patterns.md\`:`,
    );
    parts.push(codeBlock("bash", `npm i ${config.meta.componentPackage.name} react react-dom`));
    parts.push(`You can still apply the token setup below if you also build custom components.`);
  }
  if (stack === "shadcn") {
    parts.push(`This system targets **shadcn/ui** (Radix + Tailwind + CSS variables). Paste these into \`globals.css\` — they map our scales onto shadcn's semantic tokens (HSL-channel format for \`hsl(var(--token))\`):`);
    parts.push(codeBlock("css", shadcnCssVars(config)));
    parts.push(`Then keep shadcn's default \`tailwind.config\` mapping (it reads the variables above). Use the components via \`npx shadcn@latest add button input card …\` and prefer their \`variant\`/\`size\` props over custom classes.`);
    parts.push(`Tip: newer shadcn (Tailwind v4) accepts raw color values too; if so you can paste the hex tokens from \`design-tokens.md\` directly instead of HSL channels.`);
  } else if (stack === "antd") {
    parts.push(`This system targets **Ant Design v6**. Feed the seed tokens to \`ConfigProvider\` — antd derives its full palettes from them (so antd's generated shades may differ slightly from \`design-tokens.md\`):`);
    parts.push(codeBlock("ts", antdThemeConfig(config)));
    parts.push(`Build screens with antd components + props (\`<Button type="primary">\`, \`<Input status="error">\`). Do **not** hand-roll Tailwind classes for antd components; theme them through tokens. Use \`theme.darkAlgorithm\` for dark mode.`);
  } else if (isTailwind) {
    parts.push(`1. Add the CSS variables above to your global stylesheet.`);
    parts.push(`2. Map tokens in Tailwind config so utilities resolve to variables:`);
    parts.push(codeBlock("ts", tailwindConfigSnippet(config)));
    parts.push(`3. Suggested structure: \`src/components/ui/*\` for primitives, \`src/app\` (or \`pages\`) for screens, \`src/styles/tokens.css\` for variables.`);
  } else {
    parts.push(`1. Put the CSS variables above in a \`tokens.css\` and \`@import\` it first in your main stylesheet.`);
    parts.push(`2. Author component CSS that consumes \`var(--…)\` only — never literal values.`);
    parts.push(`3. Suggested structure: \`/styles/tokens.css\`, \`/styles/components.css\`, \`/index.html\`.`);
  }

  parts.push(`## Mandatory rules (summary)`);
  parts.push(
    [
      config.aiRules.enforceTokensOnly
        ? `- Reference tokens for **all** colors/spacing/radius/typography. No hard-coded hex/px; never invent tokens.`
        : `- Prefer tokens; comment any unavoidable raw value.`,
      `- Overlays/scrims use \`opacity-*\` tokens; keep semantic color families intact.`,
      `- Reuse documented component patterns (no near-duplicate variants); embed brand assets (no external/CDN image URLs).`,
      `- Naming convention: **${config.aiRules.namingConvention}**.`,
      `- Semantic HTML, mobile-first, WCAG ${config.aiRules.accessibility}, visible focus states.`,
      config.animation.enabled
        ? `- Motion: ${config.animation.style} @ ${config.animation.durationMs}ms; respect \`prefers-reduced-motion\`.`
        : `- No animations.`,
      ...config.aiRules.customRules.map((r) => `- ${r}`),
    ].join("\n"),
  );

  parts.push(`## Starter prompt`);
  parts.push(
    codeBlock(
      "text",
      [
        `You are a senior frontend agent. Generate code for the "${config.meta.name}" design system on the ${stackLabel} stack.`,
        `Strictly follow design-tokens, design-guidelines, component-patterns and ai-rules provided above.`,
        `Hard requirements: reference tokens only (no hard-coded hex/px), ${config.aiRules.namingConvention} naming, semantic HTML, WCAG ${config.aiRules.accessibility}, visible focus states, mobile-first.`,
        `Before returning, run the checklist in ai-rules.md and fix any violation.`,
        ``,
        `Task: <describe the screen or component to build>`,
      ].join("\n"),
    ),
  );

  return parts.join("\n\n") + "\n";
}
