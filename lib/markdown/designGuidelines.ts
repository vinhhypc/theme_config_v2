import type { DesignConfig } from "@/lib/config/types";
import { HOVER_LABELS_EN } from "@/lib/tokens/interactions";
import { header, type GenerateOptions } from "./shared";

/**
 * `design-guidelines.md` — *how* to use the tokens (rules), not the values.
 */
export function generateDesignGuidelines(config: DesignConfig, opts?: GenerateOptions): string {
  const minContrast = config.aiRules.accessibility === "AAA" ? "7:1" : "4.5:1";
  const minLargeContrast = config.aiRules.accessibility === "AAA" ? "4.5:1" : "3:1";
  const parts: string[] = [];

  parts.push(header(config, opts));
  parts.push(`# Design Guidelines — ${config.meta.name}`);
  parts.push(`> Rules for applying the design tokens consistently. Read alongside \`design-tokens.md\`.`);

  parts.push(`## Color usage`);
  parts.push(
    [
      `- **Primary** — the single most important action on a screen (submit, primary CTA). Avoid more than one primary action per view.`,
      `- **Secondary** — supporting actions next to a primary action.`,
      `- **Accent** — small highlights only (badges, active indicators). Never use accent for large surfaces.`,
      `- **Neutral** — text, dividers, borders, page/card backgrounds. The neutral scale carries most of the UI.`,
      `- **Semantic** (success/warning/error/info) — reserved for state feedback. Do not reuse them for decoration.`,
      `- **Hover/active deepen within the same scale:** e.g. \`primary-600\` → \`primary-700\` → \`primary-800\`. Never jump to a different hue on interaction.`,
      `- **Keep semantic families intact:** an error state uses only the \`error-*\` scale; do not mix unrelated families (e.g. warning fill with error text) for one status.`,
      `- **Overlays & scrims:** use the opacity tokens (\`opacity-black-7\`, \`opacity-primary-*\`), not ad-hoc \`rgba()\`. Use white/black opacity for inverse surfaces and dimming.`,
      `- **Categorical / decorative colors** (if any) stay out of core actions; only use them for data-viz or explicit category coding.`,
    ].join("\n"),
  );

  parts.push(`## Contrast & accessibility (${config.aiRules.accessibility})`);
  parts.push(
    [
      `- Body text must meet a contrast ratio of at least **${minContrast}** against its background.`,
      `- Large text (≥ 24px or 18.66px bold) must meet at least **${minLargeContrast}**.`,
      `- Pair light backgrounds (\`*-50\` … \`*-200\`) with dark text (\`*-700\` … \`*-900\`) and vice-versa.`,
      `- Never communicate state with color alone — pair with icon or text.`,
      `- All interactive elements must have a visible focus ring using \`primary-500\`/\`primary-600\`.`,
    ].join("\n"),
  );

  parts.push(`## Typography hierarchy`);
  parts.push(
    [
      `- Use the modular scale from \`design-tokens.md\`: \`text-4xl\` (H1) → \`text-base\` (body) → \`text-sm\`/\`text-xs\` (meta).`,
      `- One H1 per page. Do not skip heading levels.`,
      `- Headings use \`${config.typography.fontFamilyHeading}\`; body uses \`${config.typography.fontFamilyBase}\`.`,
      `- **Line height:** headings ~\`1.2\` (tight); body \`${config.typography.lineHeight}\`. Keep these fixed across the product.`,
      `- **Emphasis in body copy via weight** (\`medium\`/\`bold\`), not by bumping the font size.`,
      `- Long-form copy MUST use body sizes only — never heading tokens for paragraphs.`,
      `- Limit body line length to ~60–75 characters for readability.`,
      `- Allowed font weights: ${config.typography.weights.join(", ")}. Do not introduce others.`,
    ].join("\n"),
  );

  parts.push(`## Spacing`);
  parts.push(
    [
      `- Compose all margins/paddings from the spacing scale (\`space-1\` = ${config.spacing.baseUnit}px, etc.). Increments are ${config.spacing.baseUnit}px-based.`,
      `- Never use arbitrary values like \`13px\` or \`m-[7px]\`. Snap to the nearest token.`,
      `- **Compact component padding:** smaller steps (around \`space-4\`/\`space-6\`).`,
      `- **Section / layout spacing:** larger steps (\`space-8\`, \`space-12\`, \`space-16\`).`,
      `- Use larger steps to separate unrelated groups; smaller steps within a group (proximity).`,
    ].join("\n"),
  );

  parts.push(`## Radius, elevation & motion`);
  parts.push(
    [
      `- Radius style is **${config.radius.style}** (base ${config.radius.base}px). Apply the same radius family across all components.`,
      `- Elevation style is **${config.elevation.style}** with ${config.elevation.levels} levels. Use higher elevation only for overlays (modals, popovers).`,
      config.animation.enabled
        ? `- Motion: **${config.animation.style}**, ${config.animation.durationMs}ms, easing \`${config.animation.easing}\`. Keep transitions consistent and respect \`prefers-reduced-motion\`.`
        : `- Motion is disabled in this system. Do not add transitions or animations.`,
    ].join("\n"),
  );

  parts.push(`## Interactive states`);
  parts.push(
    [
      `Every interactive element MUST express the four states consistently:`,
      `- **Hover:** ${HOVER_LABELS_EN[config.interactions.hover]}.`,
      config.interactions.pressFeedback
        ? `- **Active/pressed:** slight scale-down (\`scale(0.97)\`) for tactile feedback.`
        : `- **Active/pressed:** no transform (press feedback disabled).`,
      config.interactions.focusRing
        ? `- **Focus (keyboard):** a visible ring — \`outline: 2px solid var(--color-primary-500); outline-offset: 2px\`. Never remove it without an equivalent replacement.`
        : `- **Focus:** focus ring disabled in this system — ensure another clear focus indicator exists.`,
      `- **Disabled:** \`opacity: 0.5\` and \`pointer-events: none\`.`,
      `- **Links:** ${config.interactions.underlineLinks ? "underline on hover" : "do not underline on hover (rely on color)"}; darken to \`primary-700\` on hover.`,
      config.animation.enabled
        ? `All transitions use \`var(--duration)\` / \`var(--easing)\` and respect \`prefers-reduced-motion\`.`
        : `Motion is disabled — state changes are instant.`,
    ].join("\n"),
  );

  parts.push(`## Layout`);
  parts.push(
    [
      `- Keep all content on a single spacing rhythm — reuse the same step sizes across a screen.`,
      `- Use generous section spacing for dashboards and marketing surfaces; tighter spacing inside dense data UIs.`,
      `- Cards, panels, modals and inputs SHOULD share consistent radius tiers (\`radius-sm/md/lg\`) — don't mix radii arbitrarily.`,
      `- Maintain strong contrast between content and its surface; avoid low-contrast neutral-on-neutral text.`,
      `- Communicate status with semantic color, never decorative substitution.`,
    ].join("\n"),
  );

  parts.push(`## Do & Don't`);
  parts.push(
    [
      `✅ **Do**`,
      `- Reference tokens: \`bg-primary-600\`, \`text-neutral-700\`, \`rounded-[var(--radius-md)]\`.`,
      `- Keep one primary action per view.`,
      `- Use semantic colors only for their meaning.`,
      ``,
      `❌ **Don't**`,
      `- Hard-code colors: \`style="color:#2563eb"\` or \`bg-[#2563eb]\`.`,
      `- Use off-scale spacing: \`p-[13px]\`.`,
      `- Mix multiple radius/shadow styles on one screen.`,
    ].join("\n"),
  );

  return parts.join("\n\n") + "\n";
}
