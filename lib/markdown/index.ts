import type { DesignConfig } from "@/lib/config/types";
import { slugify } from "@/lib/utils";
import type { GenerateOptions } from "./shared";
import { generateDesignTokens } from "./designTokens";
import { generateDesignGuidelines } from "./designGuidelines";
import { generateComponentPatterns } from "./componentPatterns";
import { generateAiRules } from "./aiRules";
import { generateAiEntrypoint } from "./aiEntrypoint";

export { generateDesignTokens } from "./designTokens";
export { generateDesignGuidelines } from "./designGuidelines";
export { generateComponentPatterns } from "./componentPatterns";
export { generateAiRules } from "./aiRules";
export { generateAiEntrypoint } from "./aiEntrypoint";
export type { GenerateOptions } from "./shared";

export interface MarkdownFile {
  filename: string;
  title: string;
  content: string;
}

/**
 * Generate all five markdown files plus the combined entrypoint.
 * Returns them in a stable order. All share the same version + timestamp.
 */
export function generateAllMarkdown(config: DesignConfig, opts?: GenerateOptions): MarkdownFile[] {
  // Lock a single timestamp so every file reports the same one (acceptance criterion #2).
  const date = opts?.date ?? new Date().toISOString();
  const o: GenerateOptions = { date };

  // Prefix each file with the project slug so the names track the project, e.g.
  // "Acme Design System" → "acme-design-system-design-tokens.md".
  const slug = slugify(config.meta.name);

  return [
    { filename: `${slug}-design-tokens.md`, title: "Design Tokens", content: generateDesignTokens(config, o) },
    { filename: `${slug}-design-guidelines.md`, title: "Design Guidelines", content: generateDesignGuidelines(config, o) },
    { filename: `${slug}-component-patterns.md`, title: "Component Patterns", content: generateComponentPatterns(config, o) },
    { filename: `${slug}-ai-rules.md`, title: "AI Rules", content: generateAiRules(config, o) },
    { filename: `${slug}-ai-entrypoint.md`, title: "AI Entrypoint", content: generateAiEntrypoint(config, o) },
  ];
}
