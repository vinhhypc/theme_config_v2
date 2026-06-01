import type { DesignConfig, RenderStack } from "@/lib/config/types";
import { effectiveStack } from "@/lib/config/types";
import {
  hoverTailwindClasses,
  buttonHoverCss,
  cardHoverCss,
  activeCss,
  focusRingCss,
  HOVER_LABELS_EN,
} from "@/lib/tokens/interactions";
import { header, codeBlock, type GenerateOptions } from "./shared";

/** Language hint for fenced code blocks per stack. */
function langFor(stack: RenderStack): string {
  switch (stack) {
    case "html-css":
      return "html";
    case "vue-tailwind":
      return "vue";
    default:
      return "tsx";
  }
}

function buttonExample(config: DesignConfig): string {
  const stack = effectiveStack(config);
  const size = config.components.button.defaultSize;
  const variants = config.components.button.variants;

  if (stack === "antd") {
    return [
      `import { Button } from "antd";`,
      `// Theme via <ConfigProvider theme={themeConfig}> — never override colors inline.`,
      ``,
      `<Button type="primary">Primary</Button>`,
      `<Button>Default</Button>`,
      `<Button type="dashed">Dashed</Button>`,
      `<Button type="text">Text</Button>`,
      `<Button danger type="primary">Delete</Button>`,
      `<Button type="primary" size="${size}" loading>Loading</Button>`,
    ].join("\n");
  }

  if (stack === "shadcn") {
    return [
      `import { Button } from "@/components/ui/button";`,
      `// shadcn variants: default | secondary | outline | ghost | destructive | link.`,
      `// Colors/radius come from the CSS variables in globals.css (--primary, --ring, --radius).`,
      ``,
      `<div className="flex flex-wrap gap-2">`,
      `  <Button>Primary</Button>`,
      `  <Button variant="secondary">Secondary</Button>`,
      `  <Button variant="ghost">Ghost</Button>`,
      `  <Button variant="destructive">Delete</Button>`,
      `  <Button variant="outline" size="${size}">Outline</Button>`,
      `</div>`,
    ].join("\n");
  }

  if (stack === "html-css") {
    return [
      `<!-- Button. Variants: ${variants.join(", ")}. Colors come from CSS variables. -->`,
      `<button class="btn btn--primary" type="button">Primary</button>`,
      `<button class="btn btn--secondary" type="button">Secondary</button>`,
      `<button class="btn btn--ghost" type="button">Ghost</button>`,
      `<button class="btn btn--destructive" type="button">Delete</button>`,
      ``,
      `<style>`,
      `.btn {`,
      `  font-family: var(--font-base);`,
      `  padding: var(--space-2) var(--space-4);`,
      `  border-radius: var(--radius-md);`,
      `  border: var(--border-width) solid transparent;`,
      `  transition: background var(--duration) var(--easing);`,
      `  cursor: pointer;`,
      `}`,
      `.btn:focus-visible { outline: 2px solid var(--color-primary-500); outline-offset: 2px; }`,
      `.btn--primary { background: var(--color-primary-600); color: #fff; }`,
      `.btn--primary:hover { background: var(--color-primary-700); }`,
      `.btn--secondary { background: var(--color-secondary-600); color: #fff; }`,
      `.btn--ghost { background: transparent; color: var(--color-primary-700); }`,
      `.btn--destructive { background: var(--color-error-600); color: #fff; }`,
      `</style>`,
    ].join("\n");
  }

  if (stack === "vue-tailwind") {
    return [
      `<script setup lang="ts">`,
      `defineProps<{ variant?: '${variants.join("' | '")}'; }>()`,
      `</script>`,
      ``,
      `<template>`,
      `  <button`,
      `    type="button"`,
      `    class="rounded-[var(--radius-md)] px-[var(--space-4)] py-[var(--space-2)] font-medium`,
      `           transition-colors focus-visible:outline focus-visible:outline-2`,
      `           focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary-500)]"`,
      `    :class="{`,
      `      'bg-[var(--color-primary-600)] text-white hover:bg-[var(--color-primary-700)]': variant === 'primary',`,
      `      'bg-[var(--color-secondary-600)] text-white': variant === 'secondary',`,
      `      'bg-transparent text-[var(--color-primary-700)]': variant === 'ghost',`,
      `      'bg-[var(--color-error-600)] text-white': variant === 'destructive',`,
      `    }"`,
      `  >`,
      `    <slot />`,
      `  </button>`,
      `</template>`,
    ].join("\n");
  }

  // react-tailwind / next
  return [
    `import { type ButtonHTMLAttributes } from "react";`,
    `import { clsx } from "clsx";`,
    ``,
    `type Variant = ${variants.map((v) => `"${v}"`).join(" | ")};`,
    `type Size = "sm" | "md" | "lg";`,
    ``,
    `interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {`,
    `  variant?: Variant;`,
    `  size?: Size;`,
    `}`,
    ``,
    `const sizes: Record<Size, string> = {`,
    `  sm: "px-[var(--space-3)] py-[var(--space-1)] text-sm",`,
    `  md: "px-[var(--space-4)] py-[var(--space-2)] text-base",`,
    `  lg: "px-[var(--space-6)] py-[var(--space-3)] text-lg",`,
    `};`,
    ``,
    `const variants: Record<Variant, string> = {`,
    `  primary: "bg-[var(--color-primary-600)] text-white hover:bg-[var(--color-primary-700)]",`,
    `  secondary: "bg-[var(--color-secondary-600)] text-white hover:bg-[var(--color-secondary-700)]",`,
    `  ghost: "bg-transparent text-[var(--color-primary-700)] hover:bg-[var(--color-primary-50)]",`,
    `  destructive: "bg-[var(--color-error-600)] text-white hover:bg-[var(--color-error-700)]",`,
    `};`,
    ``,
    `export function Button({ variant = "primary", size = "${size}", className, ...props }: ButtonProps) {`,
    `  return (`,
    `    <button`,
    `      className={clsx(`,
    `        "rounded-[var(--radius-md)] font-medium transition-colors duration-[var(--duration)]",`,
    `        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary-500)]",`,
    `        "disabled:opacity-50 disabled:pointer-events-none",`,
    `        sizes[size], variants[variant], className,`,
    `      )}`,
    `      {...props}`,
    `    />`,
    `  );`,
    `}`,
  ].join("\n");
}

function inputExample(config: DesignConfig): string {
  const variant = config.components.input.variant;
  const stack = effectiveStack(config);

  if (stack === "antd") {
    return [
      `import { Form, Input } from "antd";`,
      ``,
      `<Form layout="vertical">`,
      `  <Form.Item label="Email" validateStatus={hasError ? "error" : ""} help={hasError ? "Required" : undefined}>`,
      `    <Input type="email" placeholder="you@example.com" />`,
      `  </Form.Item>`,
      `</Form>`,
      `// States via props: status="error", disabled, readOnly. Theme through tokens, not inline styles.`,
    ].join("\n");
  }

  if (stack === "shadcn") {
    return [
      `import { Input } from "@/components/ui/input";`,
      `import { Label } from "@/components/ui/label";`,
      ``,
      `<div className="grid gap-1.5">`,
      `  <Label htmlFor="email">Email</Label>`,
      `  <Input id="email" type="email" aria-invalid={hasError} aria-describedby="email-err" />`,
      `  {hasError && <p id="email-err" className="text-sm text-destructive">Required</p>}`,
      `</div>`,
    ].join("\n");
  }

  if (stack === "html-css") {
    return [
      `<label class="field">`,
      `  <span class="field__label">Email</span>`,
      `  <input class="field__input" type="email" aria-describedby="email-err" />`,
      `  <span id="email-err" class="field__error">Please enter a valid email.</span>`,
      `</label>`,
      ``,
      `<style>`,
      `.field { display: grid; gap: var(--space-1); font-family: var(--font-base); }`,
      `.field__input {`,
      variant === "filled"
        ? `  background: var(--color-neutral-100); border: var(--border-width) solid transparent;`
        : variant === "underline"
          ? `  background: transparent; border: 0; border-bottom: var(--border-width) solid var(--color-neutral-300); border-radius: 0;`
          : `  background: #fff; border: var(--border-width) solid var(--color-neutral-300);`,
      `  border-radius: var(--radius-md);`,
      `  padding: var(--space-2) var(--space-3);`,
      `}`,
      `.field__input:focus-visible { outline: 2px solid var(--color-primary-500); outline-offset: 1px; }`,
      `.field__error { color: var(--color-error-600); font-size: 0.875em; }`,
      `</style>`,
    ].join("\n");
  }
  const base =
    variant === "filled"
      ? "bg-[var(--color-neutral-100)] border border-transparent"
      : variant === "underline"
        ? "bg-transparent border-0 border-b border-[var(--color-neutral-300)] rounded-none"
        : "bg-white border border-[var(--color-neutral-300)]";
  return [
    `// Input — variant: ${variant}. Always pair with a <label> and aria-describedby for errors.`,
    `<label className="grid gap-[var(--space-1)]">`,
    `  <span className="text-sm text-[var(--color-neutral-700)]">Email</span>`,
    `  <input`,
    `    type="email"`,
    `    aria-invalid={hasError}`,
    `    aria-describedby="email-err"`,
    `    className={clsx(`,
    `      "${base} rounded-[var(--radius-md)] px-[var(--space-3)] py-[var(--space-2)]",`,
    `      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-primary-500)]",`,
    `      hasError && "border-[var(--color-error-500)]",`,
    `    )}`,
    `  />`,
    `  {hasError && <span id="email-err" className="text-sm text-[var(--color-error-600)]">Required</span>}`,
    `</label>`,
  ].join("\n");
}

function cardExample(config: DesignConfig): string {
  const variant = config.components.card.variant;
  const stack = effectiveStack(config);

  if (stack === "antd") {
    return [
      `import { Card, Button } from "antd";`,
      ``,
      `<Card title="Tiêu đề" variant="${variant === "outlined" ? "outlined" : "borderless"}"`,
      `      extra={<Button type="link">Thêm</Button>}>`,
      `  Nội dung thẻ — màu/nền/bo góc lấy từ theme token.`,
      `</Card>`,
    ].join("\n");
  }

  if (stack === "shadcn") {
    return [
      `import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";`,
      `import { Button } from "@/components/ui/button";`,
      ``,
      `<Card>`,
      `  <CardHeader><CardTitle>Tiêu đề</CardTitle></CardHeader>`,
      `  <CardContent className="text-muted-foreground">Nội dung dùng token semantic.</CardContent>`,
      `  <CardFooter><Button size="sm">Hành động</Button></CardFooter>`,
      `</Card>`,
    ].join("\n");
  }

  const surface =
    variant === "elevated"
      ? "shadow-[var(--shadow-2)] bg-[var(--color-neutral-50)]"
      : variant === "outlined"
        ? "border border-[var(--color-neutral-200)]"
        : "bg-[var(--color-neutral-100)]";
  if (stack === "html-css") {
    return [
      `<article class="card">`,
      `  <h3 class="card__title">Title</h3>`,
      `  <p class="card__body">Body text using neutral tokens.</p>`,
      `</article>`,
      ``,
      `<style>`,
      `.card {`,
      `  padding: var(--space-6);`,
      `  border-radius: var(--radius-lg);`,
      variant === "elevated"
        ? `  box-shadow: var(--shadow-2); background: var(--color-neutral-50);`
        : variant === "outlined"
          ? `  border: var(--border-width) solid var(--color-neutral-200);`
          : `  background: var(--color-neutral-100);`,
      `}`,
      `</style>`,
    ].join("\n");
  }
  return [
    `// Card — variant: ${variant}.`,
    `<article className="${surface} rounded-[var(--radius-lg)] p-[var(--space-6)]">`,
    `  <h3 className="text-xl text-[var(--color-neutral-900)]">Title</h3>`,
    `  <p className="text-[var(--color-neutral-700)]">Body text using neutral tokens.</p>`,
    `</article>`,
  ].join("\n");
}

/**
 * `component-patterns.md` — code samples per component for the target stack.
 * All samples reference tokens only.
 */
export function generateComponentPatterns(config: DesignConfig, opts?: GenerateOptions): string {
  const stack = effectiveStack(config);
  const lang = langFor(stack);
  const parts: string[] = [];

  parts.push(header(config, opts));
  parts.push(`# Component Patterns — ${config.meta.name}`);
  parts.push(
    `> Reference implementations for the **${stack}** stack. Every sample uses design tokens only — no hard-coded hex/px.`,
  );

  parts.push(`## Interactive states`);
  parts.push(
    `Hover effect for this system: **${HOVER_LABELS_EN[config.interactions.hover]}**. Apply the same hover / active / focus pattern to every interactive element.`,
  );
  if (stack === "html-css") {
    parts.push(
      codeBlock(
        "css",
        [
          `.interactive { transition: all var(--duration) var(--easing); }`,
          `.interactive:hover { ${buttonHoverCss(config.interactions.hover, "--color-primary") || "/* no change */"} }`,
          `.surface:hover { ${cardHoverCss(config.interactions.hover) || "/* no change */"} }`,
          `.interactive:active { ${activeCss(config.interactions.pressFeedback) || "/* no change */"} }`,
          `.interactive:focus-visible { ${focusRingCss(config.interactions.focusRing)} }`,
          `.interactive:disabled { opacity: .5; pointer-events: none; }`,
          `@media (prefers-reduced-motion: reduce) { .interactive { transition: none; } }`,
        ].join("\n"),
      ),
    );
  } else if (stack === "antd") {
    parts.push(
      `Ant Design ships hover/active/focus/disabled states built in — tune them through theme tokens instead of CSS: \`motionDurationMid\` for timing, \`controlOutline\`/\`colorPrimaryHover\` for focus & hover. Do not add custom hover classes to antd components.`,
    );
  } else {
    parts.push(`Reusable class string for interactive elements:`);
    parts.push(codeBlock("tsx", `const interactive = "${hoverTailwindClasses(config)}";`));
  }

  parts.push(`## Button`);
  parts.push(`Variants: ${config.components.button.variants.join(", ")} · default size: ${config.components.button.defaultSize}.`);
  parts.push(`States: default · hover · active · disabled · **loading** (show a spinner, keep width stable, set \`aria-busy\`).`);
  parts.push(`Padding maps to spacing tokens — sm: \`space-1 space-3\`, md: \`space-2 space-4\`, lg: \`space-3 space-6\`. Radius: \`radius-md\`/\`radius-lg\`. Disabled uses neutral tokens + reduced contrast.`);
  parts.push(`Accessibility: always provide a discernible label; visible focus ring; use \`type="button"\` unless submitting.`);
  parts.push(codeBlock(lang, buttonExample(config)));

  parts.push(`## Input`);
  parts.push(`Variant: ${config.components.input.variant}. States: default · focus · error · **success** · disabled · **read-only**.`);
  parts.push(`Border uses the neutral scale; focus ring SHOULD use a brand/info opacity token (\`opacity-primary-*\`/\`opacity-info-5\`); error uses \`error-500\`; helper text uses small/base body styles. Horizontal padding \`space-3\`–\`space-4\`, vertical \`space-2\`–\`space-3\`.`);
  parts.push(`Accessibility: associate a \`<label>\`; link errors via \`aria-describedby\`; set \`aria-invalid\` on error.`);
  parts.push(codeBlock(lang, inputExample(config)));

  parts.push(`## Card`);
  parts.push(`Variants: default · elevated · outlined · **status** (current: ${config.components.card.variant}). States: default · hover · **selected** · disabled.`);
  parts.push(`Surface uses white/\`neutral-50\`; border uses neutral scale; shadow \`shadow-1\`–\`shadow-2\`; radius \`radius-lg\`. Padding tiers — compact \`space-4\`, default \`space-6\`, spacious \`space-8\`.`);
  parts.push(`Accessibility: use a landmark/heading structure; ensure interactive cards have a focusable control.`);
  parts.push(codeBlock(lang, cardExample(config)));

  if (config.components.badge.enabled) {
    parts.push(`## Badge`);
    parts.push(`Variants: brand · success · warning · error · info · **neutral**. Semantic family fill + readable foreground; compact spacing only; radius \`radius-pill\` or \`radius-sm\`. Include text, never color alone.`);
    parts.push(
      codeBlock(
        lang,
        stack === "html-css"
          ? `<span class="badge" style="background:var(--color-success-100);color:var(--color-success-700)">Active</span>`
          : `<span className="inline-flex items-center rounded-[var(--radius-pill)] px-[var(--space-2)] py-[var(--space-1)] text-sm bg-[var(--color-success-100)] text-[var(--color-success-700)]">Active</span>`,
      ),
    );
  }

  if (config.components.modal.enabled) {
    parts.push(`## Modal`);
    parts.push(`Parts: overlay · container · header · body · footer. Overlay MUST use an opacity-black token (\`opacity-black-7\`); container uses \`radius-lg\`/\`radius-xl\`; internal spacing \`space-6\`–\`space-8\`; title uses a heading token, body a body token.`);
    parts.push(`Accessibility: \`role="dialog"\`, \`aria-modal="true"\`, focus trap, restore focus on close, Esc to dismiss.`);
    parts.push(
      codeBlock(
        lang,
        stack === "html-css"
          ? `<div role="dialog" aria-modal="true" aria-labelledby="m-title" class="modal">\n  <h2 id="m-title">Title</h2>\n  <!-- content -->\n</div>`
          : `<div role="dialog" aria-modal="true" aria-labelledby="m-title"\n     className="bg-white rounded-[var(--radius-lg)] shadow-[var(--shadow-3)] p-[var(--space-6)]">\n  <h2 id="m-title" className="text-2xl">Title</h2>\n  {/* content */}\n</div>`,
      ),
    );
  }

  if (config.components.table.enabled) {
    parts.push(`## Table`);
    parts.push(`Parts: header · row · cell · **status cell** · **board cell**. Row padding maps to the spacing scale; alignment & spacing MUST stay consistent row-to-row. Status cells use semantic tokens; any categorical "board" colors are reserved for board/visualization cells only.`);
    parts.push(`Accessibility: use \`<th scope="col">\`, caption, and zebra striping with neutral tokens.`);
    parts.push(
      codeBlock(
        lang,
        stack === "html-css"
          ? `<table>\n  <caption>Users</caption>\n  <thead><tr><th scope="col">Name</th><th scope="col">Role</th></tr></thead>\n  <tbody><tr><td>Ada</td><td>Admin</td></tr></tbody>\n</table>`
          : `<table className="w-full text-left">\n  <caption className="sr-only">Users</caption>\n  <thead className="bg-[var(--color-neutral-100)]">\n    <tr><th scope="col" className="p-[var(--space-3)]">Name</th><th scope="col" className="p-[var(--space-3)]">Role</th></tr>\n  </thead>\n  <tbody>\n    <tr className="border-t border-[var(--color-neutral-200)]"><td className="p-[var(--space-3)]">Ada</td><td className="p-[var(--space-3)]">Admin</td></tr>\n  </tbody>\n</table>`,
      ),
    );
  }

  return parts.join("\n\n") + "\n";
}
