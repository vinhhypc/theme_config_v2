// `React` imported explicitly so this also renders under Storybook's Vite
// pipeline (classic JSX runtime); harmless in the Next app.
import React, { forwardRef, type ButtonHTMLAttributes } from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "outline"
  | "destructive";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

/**
 * Token-driven button. Carries no colours/spacing of its own — it only emits
 * semantic classes (`tcb`, `tcb--primary`, …) whose visual style comes from the
 * surrounding `<ThemedSurface>` for the active design config. The same button
 * therefore re-themes automatically when the config changes.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, type = "button", ...props }, ref) => {
    const classes = ["tcb", `tcb--${variant}`];
    if (size !== "md") classes.push(`tcb--${size}`);
    if (className) classes.push(className);
    return <button ref={ref} type={type} className={classes.join(" ")} {...props} />;
  },
);

Button.displayName = "Button";
