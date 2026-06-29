// `React` imported explicitly so this also renders under Storybook's Vite
// pipeline (classic JSX runtime); harmless in the Next app.
import React, { forwardRef, type HTMLAttributes } from "react";

export type BadgeVariant =
  | "solid"
  | "neutral"
  | "success"
  | "warning"
  | "error"
  | "info";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

/**
 * Token-driven badge. Emits semantic classes (`tc-badge`, `tc-badge--success`,
 * …) styled by the surrounding `<ThemedSurface>`, so it re-themes with the
 * active design config.
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "solid", className, ...props }, ref) => {
    const classes = ["tc-badge", `tc-badge--${variant}`];
    if (className) classes.push(className);
    return <span ref={ref} className={classes.join(" ")} {...props} />;
  },
);

Badge.displayName = "Badge";
