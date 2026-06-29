// `React` imported explicitly so this also renders under Storybook's Vite
// pipeline (classic JSX runtime); harmless in the Next app.
import React, { forwardRef, type SelectHTMLAttributes } from "react";
import type { InputVariant } from "./Input";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  variant?: InputVariant;
  error?: boolean;
}

/**
 * Token-driven select. Reuses the input classes (`tci`, …) styled by the
 * surrounding `<ThemedSurface>`, so it re-themes with the active design config.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, variant = "outline", error, className, ...props }, ref) => {
    const classes = ["tci"];
    if (variant !== "outline") classes.push(`tci--${variant}`);
    if (error) classes.push("tci--error");
    if (className) classes.push(className);
    return (
      <select ref={ref} className={classes.join(" ")} {...props}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    );
  },
);

Select.displayName = "Select";
