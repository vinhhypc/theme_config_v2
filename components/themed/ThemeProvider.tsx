"use client";

// `React` imported explicitly so this also renders under non-automatic JSX
// runtimes (Storybook's Vite pipeline); harmless in the Next app.
import React, {
  createContext,
  useContext,
  useId,
  useMemo,
  type CSSProperties,
  type ReactNode,
} from "react";
import type { DesignConfig } from "@/lib/config/types";
import { themeVars, type Mode } from "./themeCss";
import { componentStyles } from "./styles";

interface ThemeContextValue {
  config: DesignConfig;
  mode: Mode;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Access the active design config / mode from inside a `<ThemeProvider>`.
 * The themed components don't need this (they are class-driven), but consumer
 * code can read it to make config-aware decisions.
 */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>");
  return ctx;
}

export interface ThemeProviderProps {
  /** The chosen design tokens. Drives every CSS variable + the component sheet. */
  config: DesignConfig;
  /** Light or dark surface vars. Default: "light". */
  mode?: Mode;
  /** Paint the configured surface background + padding around children. */
  surface?: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

/**
 * The config provider for the themed component library.
 *
 * Wrap your app (or any subtree) in `<ThemeProvider config={...}>`. It:
 *  1. sets every design token as a CSS custom property on a scoped wrapper, and
 *  2. injects the component stylesheet (`.tcb`, `.tc-card`, …) scoped to that
 *     same wrapper.
 *
 * Because the scope is generated per instance, multiple providers with
 * different configs can coexist on one page. Components emit only semantic
 * classes, so they re-theme automatically whenever `config`/`mode` change.
 */
export function ThemeProvider({
  config,
  mode = "light",
  surface = false,
  className,
  style,
  children,
}: ThemeProviderProps) {
  const rawId = useId();
  const scope = "tc" + rawId.replace(/[^a-zA-Z0-9]/g, "");

  const vars = useMemo(() => themeVars(config, mode), [config, mode]);
  const css = useMemo(() => componentStyles(`.${scope} `, config), [scope, config]);

  const rootStyle: CSSProperties = {
    ...vars,
    fontFamily: "var(--font-base)",
    color: "var(--text)",
    ...(surface
      ? {
          background: "var(--surface)",
          padding: "var(--space-6)",
          borderRadius: "var(--radius-lg)",
        }
      : {}),
    ...style,
  };

  return (
    <ThemeContext.Provider value={{ config, mode }}>
      <div className={[scope, className].filter(Boolean).join(" ")} style={rootStyle}>
        {/* eslint-disable-next-line react/no-danger */}
        <style dangerouslySetInnerHTML={{ __html: css }} />
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

ThemeProvider.displayName = "ThemeProvider";
