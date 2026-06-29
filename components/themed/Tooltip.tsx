// `React` imported explicitly so this also renders under Storybook's Vite
// pipeline (classic JSX runtime); harmless in the Next app.
import React, { type ReactNode } from "react";

export interface TooltipProps {
  /** Text shown in the popover on hover / focus. */
  text: ReactNode;
  children: ReactNode;
}

/**
 * Token-driven tooltip. Emits semantic classes (`tc-tooltip`, …) styled by the
 * surrounding `<ThemedSurface>`, so it re-themes with the active design config.
 * Pure CSS hover/focus — no JS state.
 */
export function Tooltip({ text, children }: TooltipProps) {
  return (
    <span className="tc-tooltip" tabIndex={0}>
      {children}
      <span role="tooltip" className="tc-tooltip__pop">
        {text}
      </span>
    </span>
  );
}

Tooltip.displayName = "Tooltip";
