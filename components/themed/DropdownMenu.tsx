"use client";

// `React` imported explicitly so this also renders under Storybook's Vite
// pipeline (classic JSX runtime); harmless in the Next app.
import React, { useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "./Button";

export interface DropdownMenuItem {
  id: string;
  label: ReactNode;
  onSelect?: () => void;
}

export interface DropdownMenuProps {
  /** Trigger button label. */
  trigger: ReactNode;
  items: DropdownMenuItem[];
}

/**
 * Token-driven dropdown menu. Emits semantic classes (`tc-dropdown`, …) styled
 * by the surrounding `<ThemedSurface>`, so it re-themes with the active design
 * config. Closes on outside-click / Escape.
 */
export function DropdownMenu({ trigger, items }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="tc-dropdown" ref={ref}>
      <Button variant="outline" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {trigger}
      </Button>
      {open && (
        <div className="tc-dropdown__menu" role="menu">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              className="tc-dropdown__item"
              onClick={() => {
                item.onSelect?.();
                setOpen(false);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

DropdownMenu.displayName = "DropdownMenu";
