import type { Config } from "tailwindcss";

/**
 * Tailwind config for the Theme Config *app itself*.
 * Note: this is intentionally separate from the design system the user
 * is configuring inside the app (that one lives in CSS variables injected
 * by the live preview). The app uses CSS-variable-backed semantic tokens
 * so it can support its own dark/light mode.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--app-background) / <alpha-value>)",
        foreground: "hsl(var(--app-foreground) / <alpha-value>)",
        muted: "hsl(var(--app-muted) / <alpha-value>)",
        "muted-foreground": "hsl(var(--app-muted-foreground) / <alpha-value>)",
        border: "hsl(var(--app-border) / <alpha-value>)",
        card: "hsl(var(--app-card) / <alpha-value>)",
        primary: "hsl(var(--app-primary) / <alpha-value>)",
        "primary-foreground": "hsl(var(--app-primary-foreground) / <alpha-value>)",
        accent: "hsl(var(--app-accent) / <alpha-value>)",
        destructive: "hsl(var(--app-destructive) / <alpha-value>)",
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem",
      },
      fontFamily: {
        sans: ["var(--font-app-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
