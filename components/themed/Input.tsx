// `React` imported explicitly so this also renders under Storybook's Vite
// pipeline (classic JSX runtime); harmless in the Next app.
import React, { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

export type InputVariant = "outline" | "filled" | "underline";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;
  /** Renders the error styling. */
  error?: boolean;
}

/**
 * Token-driven input. Emits semantic classes (`tci`, `tci--filled`, …) styled
 * by the surrounding `<ThemedSurface>`, so it re-themes with the active design
 * config.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant = "outline", error, className, ...props }, ref) => {
    const classes = ["tci"];
    if (variant !== "outline") classes.push(`tci--${variant}`);
    if (error) classes.push("tci--error");
    if (className) classes.push(className);
    return <input ref={ref} className={classes.join(" ")} {...props} />;
  },
);

Input.displayName = "Input";

/** Labelled field wrapper using the themed `tc-field` styles. */
export function Field({
  label,
  children,
}: {
  label: ReactNode;
  children: ReactNode;
}) {
  return (
    <label className="tc-field">
      <span>{label}</span>
      {children}
    </label>
  );
}
