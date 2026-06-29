"use client";

// `React` is imported explicitly so this shared component also renders under
// Storybook's Vite pipeline (classic JSX runtime); harmless in the Next app.
import React, { type ReactNode } from "react";
import type { DesignConfig } from "@/lib/config/types";
import { ThemeProvider } from "./ThemeProvider";
import type { Mode } from "./themeCss";

/**
 * Showcase wrapper used by the in-app gallery and the Storybook decorator.
 * Thin alias over the public `<ThemeProvider>` with `surface` painting on by
 * default, so stories render on the configured surface background.
 */
export function ThemedSurface({
  config,
  mode = "light",
  padded = true,
  children,
}: {
  config: DesignConfig;
  mode?: Mode;
  /** When true, paints the configured surface background + padding around the story. */
  padded?: boolean;
  children: ReactNode;
}) {
  return (
    <ThemeProvider config={config} mode={mode} surface={padded}>
      {children}
    </ThemeProvider>
  );
}
