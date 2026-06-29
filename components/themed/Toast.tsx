// `React` imported explicitly so this also renders under Storybook's Vite
// pipeline (classic JSX runtime); harmless in the Next app.
import React, { type ReactNode } from "react";

export type ToastVariant = "info" | "success" | "warning" | "error";

export interface ToastProps {
  variant?: ToastVariant;
  title?: ReactNode;
  children?: ReactNode;
  /** When provided, renders a close button. */
  onClose?: () => void;
}

/**
 * Token-driven toast. Emits semantic classes (`tc-toast`, `tc-toast--success`,
 * …) styled by the surrounding `<ThemedSurface>`, so it re-themes with the
 * active design config. Presentational — positioning/lifetime is up to the
 * caller.
 */
export function Toast({ variant = "info", title, children, onClose }: ToastProps) {
  const classes = ["tc-toast", `tc-toast--${variant}`];
  return (
    <div className={classes.join(" ")} role="status">
      <div className="tc-toast__body">
        {title != null && <div className="tc-toast__title">{title}</div>}
        {children != null && <div className="tc-toast__msg">{children}</div>}
      </div>
      {onClose && (
        <button type="button" className="tc-toast__close" aria-label="Đóng" onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );
}

Toast.displayName = "Toast";
