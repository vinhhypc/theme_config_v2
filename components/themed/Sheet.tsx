"use client";

// `React` imported explicitly so this also renders under Storybook's Vite
// pipeline (classic JSX runtime); harmless in the Next app.
import React, { useEffect, type ReactNode } from "react";

export type SheetSide = "right" | "left";

export interface SheetProps {
  open: boolean;
  onClose: () => void;
  side?: SheetSide;
  title?: ReactNode;
  children?: ReactNode;
}

/**
 * Token-driven slide-over sheet (drawer). Emits semantic classes
 * (`tc-drawer`, `tc-drawer--right`, …) styled by the surrounding
 * `<ThemedSurface>`, so it re-themes with the active design config. Closes on
 * overlay click / Escape.
 */
export function Sheet({ open, onClose, side = "right", title, children }: SheetProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div className="tc-drawer-overlay" onClick={onClose} aria-hidden="true" />
      <aside className={`tc-drawer tc-drawer--${side}`} role="dialog" aria-modal="true" aria-label={typeof title === "string" ? title : "Sheet"}>
        {title != null && <h3 className="tc-dialog__title">{title}</h3>}
        {children}
      </aside>
    </>
  );
}

Sheet.displayName = "Sheet";
