// `React` imported explicitly so this also renders under Storybook's Vite
// pipeline (classic JSX runtime); harmless in the Next app.
import React, { forwardRef, type HTMLAttributes, type ReactNode } from "react";

export type AlertVariant = "success" | "warning" | "error" | "info";

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: AlertVariant;
  /** Optional bold title rendered above the body. */
  title?: ReactNode;
}

/**
 * Token-driven alert. Emits semantic classes (`tc-alert`, `tc-alert--info`, …)
 * styled by the surrounding `<ThemedSurface>`, so it re-themes with the active
 * design config.
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = "info", title, className, children, ...props }, ref) => {
    const classes = ["tc-alert", `tc-alert--${variant}`];
    if (className) classes.push(className);
    return (
      <div ref={ref} role="alert" className={classes.join(" ")} {...props}>
        {title != null && <div className="tc-alert__title">{title}</div>}
        {children != null && <div className="tc-alert__body">{children}</div>}
      </div>
    );
  },
);

Alert.displayName = "Alert";
