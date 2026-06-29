import { z } from "zod";

/** Hex colour like #fff or #ffffff. */
const hexColor = z
  .string()
  .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Must be a hex color, e.g. #2563eb");

const colorsSchema = z.object({
  primary: hexColor,
  secondary: hexColor,
  accent: hexColor,
  neutral: hexColor,
  success: hexColor,
  warning: hexColor,
  error: hexColor,
  info: hexColor,
});

export const designConfigSchema = z.object({
  // Migrate legacy configs where the component library lived inside `targetStack`
  // (e.g. targetStack: "shadcn") onto the split targetStack + componentLib model.
  meta: z
    .preprocess(
      (raw) => {
        if (raw && typeof raw === "object") {
          const m = raw as Record<string, unknown>;
          if (m.targetStack === "shadcn" || m.targetStack === "antd") {
            return { ...m, targetStack: "react-tailwind", componentLib: m.componentLib ?? m.targetStack };
          }
        }
        return raw;
      },
      z.object({
        name: z.string().min(1, "Name is required"),
        version: z
          .string()
          .regex(/^\d+\.\d+\.\d+$/, "Use semver, e.g. 1.0.0"),
        description: z.string().optional(),
        targetStack: z.enum(["react-tailwind", "html-css", "vue-tailwind", "next"]),
        componentLib: z.enum(["none", "shadcn", "antd"]).default("none"),
        // Optional with a default so older saved configs migrate cleanly.
        componentPackage: z
          .object({
            install: z.boolean().default(false),
            name: z.string().min(1).default("@vinhhypc/config-theme"),
          })
          .default({ install: false, name: "@vinhhypc/config-theme" }),
      }),
    ),

  theme: z.object({
    mode: z.enum(["light", "dark", "both"]),
    style: z.enum(["modern", "classic", "minimal", "playful", "brutalist"]),
    colors: colorsSchema,
  }),

  typography: z.object({
    fontFamilyBase: z.string().min(1),
    fontFamilyHeading: z.string().min(1),
    fontFamilyMono: z.string().min(1),
    baseSize: z.number().min(8).max(32),
    scaleRatio: z.number().min(1).max(2),
    weights: z.array(z.number().int().min(100).max(900)).min(1),
    lineHeight: z.number().min(1).max(2.5),
  }),

  spacing: z.object({
    baseUnit: z.number().min(1).max(16),
    scale: z.array(z.number().min(0)).min(1),
  }),

  radius: z.object({
    style: z.enum(["sharp", "rounded", "pill"]),
    base: z.number().min(0).max(64),
  }),

  borders: z.object({
    width: z.number().min(0).max(8),
    style: z.enum(["solid", "dashed"]),
    defaultColorToken: z.string().min(1),
  }),

  elevation: z.object({
    style: z.enum(["flat", "soft", "hard"]),
    levels: z.number().int().min(1).max(6),
  }),

  animation: z.object({
    enabled: z.boolean(),
    style: z.enum(["none", "subtle", "smooth", "bouncy"]),
    durationMs: z.number().min(0).max(2000),
    easing: z.string().min(1),
  }),

  // Optional with defaults so older saved configs migrate cleanly.
  interactions: z
    .object({
      hover: z.enum(["none", "darken", "lift", "scale", "glow"]).default("darken"),
      pressFeedback: z.boolean().default(true),
      focusRing: z.boolean().default(true),
      underlineLinks: z.boolean().default(true),
    })
    .default({ hover: "darken", pressFeedback: true, focusRing: true, underlineLinks: true }),

  components: z.object({
    button: z.object({
      variants: z.array(z.string()).min(1),
      defaultSize: z.enum(["sm", "md", "lg"]),
    }),
    input: z.object({ variant: z.enum(["outline", "filled", "underline"]) }),
    card: z.object({ variant: z.enum(["elevated", "outlined", "flat"]) }),
    badge: z.object({ enabled: z.boolean() }),
    modal: z.object({ enabled: z.boolean() }),
    table: z.object({ enabled: z.boolean() }),
  }),

  aiRules: z.object({
    enforceTokensOnly: z.boolean(),
    namingConvention: z.enum(["tailwind", "css-vars", "bem"]),
    accessibility: z.enum(["AA", "AAA"]),
    cleanCode: z.boolean(),
    customRules: z.array(z.string()),
  }),
});

/** Runtime-validated DesignConfig. Inferred type matches `DesignConfig` in types.ts. */
export type DesignConfigParsed = z.infer<typeof designConfigSchema>;

/**
 * Safe-parse helper. Returns the config on success or a list of human-readable
 * error strings on failure. Used when loading from LocalStorage or imported JSON.
 */
export function parseDesignConfig(
  value: unknown,
): { ok: true; config: DesignConfigParsed } | { ok: false; errors: string[] } {
  const result = designConfigSchema.safeParse(value);
  if (result.success) return { ok: true, config: result.data };
  const errors = result.error.issues.map(
    (i) => `${i.path.join(".") || "(root)"}: ${i.message}`,
  );
  return { ok: false, errors };
}
