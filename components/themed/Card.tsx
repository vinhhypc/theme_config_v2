// `React` imported explicitly so this also renders under Storybook's Vite
// pipeline (classic JSX runtime); harmless in the Next app.
import React, { type HTMLAttributes, type ReactNode } from "react";

export type CardVariant = "elevated" | "outlined" | "flat";

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: CardVariant;
  title?: ReactNode;
  /** Footer content (e.g. action buttons). */
  footer?: ReactNode;
}

/**
 * Token-driven card. Emits semantic classes (`tc-card`, `tc-card--outlined`,
 * …) styled by the surrounding `<ThemedSurface>`, so it re-themes with the
 * active design config.
 */
export function Card({ variant = "elevated", title, footer, className, children, ...props }: CardProps) {
  const classes = ["tc-card", `tc-card--${variant}`];
  if (className) classes.push(className);
  return (
    <div className={classes.join(" ")} {...props}>
      {title != null && <h3 className="tc-card__title">{title}</h3>}
      {children != null && <div className="tc-card__body">{children}</div>}
      {footer != null && <div className="tc-card__foot">{footer}</div>}
    </div>
  );
}

Card.displayName = "Card";
