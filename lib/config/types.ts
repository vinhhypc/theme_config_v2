/**
 * The central data model for Theme Config.
 * Every exported markdown file is derived purely from a `DesignConfig`.
 */

/** Base framework / authoring approach. */
export type TargetStack =
  | "react-tailwind"
  | "html-css"
  | "vue-tailwind"
  | "next";

/** Optional component library layered on top of a React base. */
export type ComponentLib = "none" | "shadcn" | "antd";

/**
 * The stack the generators actually render for: the base framework, unless a
 * component library is selected (shadcn/antd imply their own component code).
 */
export type RenderStack = TargetStack | "shadcn" | "antd";
export type ThemeMode = "light" | "dark" | "both";
export type ThemeStyle = "modern" | "classic" | "minimal" | "playful" | "brutalist";
export type RadiusStyle = "sharp" | "rounded" | "pill";
export type BorderStyle = "solid" | "dashed";
export type ElevationStyle = "flat" | "soft" | "hard";
export type AnimationStyle = "none" | "subtle" | "smooth" | "bouncy";
export type HoverEffect = "none" | "darken" | "lift" | "scale" | "glow";
export type ComponentSize = "sm" | "md" | "lg";
export type InputVariant = "outline" | "filled" | "underline";
export type CardVariant = "elevated" | "outlined" | "flat";
export type NamingConvention = "tailwind" | "css-vars" | "bem";
export type AccessibilityLevel = "AA" | "AAA";

export interface DesignColors {
  primary: string;
  secondary: string;
  accent: string;
  neutral: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface DesignConfig {
  meta: {
    name: string;
    version: string;
    description?: string;
    targetStack: TargetStack;
    /** Optional component library; only meaningful for React-based stacks. */
    componentLib: ComponentLib;
  };

  theme: {
    mode: ThemeMode;
    style: ThemeStyle;
    colors: DesignColors;
  };

  typography: {
    fontFamilyBase: string;
    fontFamilyHeading: string;
    fontFamilyMono: string;
    baseSize: number;
    scaleRatio: number;
    weights: number[];
    lineHeight: number;
  };

  spacing: {
    baseUnit: number;
    scale: number[];
  };

  radius: {
    style: RadiusStyle;
    base: number;
  };

  borders: {
    width: number;
    style: BorderStyle;
    defaultColorToken: string;
  };

  elevation: {
    style: ElevationStyle;
    levels: number;
  };

  animation: {
    enabled: boolean;
    style: AnimationStyle;
    durationMs: number;
    easing: string;
  };

  /** How interactive elements respond to hover / focus / press. */
  interactions: {
    hover: HoverEffect;       // visual change on hover
    pressFeedback: boolean;   // slight scale-down on :active
    focusRing: boolean;       // visible focus ring on keyboard focus
    underlineLinks: boolean;  // underline links on hover
  };

  components: {
    button: { variants: string[]; defaultSize: ComponentSize };
    input: { variant: InputVariant };
    card: { variant: CardVariant };
    badge: { enabled: boolean };
    modal: { enabled: boolean };
    table: { enabled: boolean };
  };

  aiRules: {
    enforceTokensOnly: boolean;
    namingConvention: NamingConvention;
    accessibility: AccessibilityLevel;
    cleanCode: boolean;
    customRules: string[];
  };
}

/** React-based stacks can layer on a component library (shadcn/antd). */
export function stackSupportsComponentLib(stack: TargetStack): boolean {
  return stack === "react-tailwind" || stack === "next";
}

/**
 * The stack the generators render for. A selected component library takes
 * precedence over the base framework (shadcn/antd ship their own components).
 */
export function effectiveStack(config: DesignConfig): RenderStack {
  const { targetStack, componentLib } = config.meta;
  if (stackSupportsComponentLib(targetStack)) {
    if (componentLib === "shadcn") return "shadcn";
    if (componentLib === "antd") return "antd";
  }
  return targetStack;
}

/** Names of the colour roles, used when iterating in token generators. */
export const COLOR_ROLES: (keyof DesignColors)[] = [
  "primary",
  "secondary",
  "accent",
  "neutral",
  "success",
  "warning",
  "error",
  "info",
];

/** Steps used for the auto-generated colour scale (primary-50 … primary-900). */
export const COLOR_SCALE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
export type ColorScaleStep = (typeof COLOR_SCALE_STEPS)[number];
