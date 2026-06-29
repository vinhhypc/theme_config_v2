"use client";

// `React` imported explicitly so this also renders under Storybook's Vite
// pipeline (classic JSX runtime); harmless in the Next app.
import React, { useState, type ReactNode } from "react";

export interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** Allow multiple panels open at once. Default: single (closes others). */
  multiple?: boolean;
  /** Ids of panels open initially. */
  defaultOpen?: string[];
  className?: string;
}

/** Caret icon, rotated via CSS when its item is open. */
function Caret() {
  return (
    <svg className="tc-accordion__icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Token-driven accordion. Emits semantic classes (`tc-accordion`, …) styled by
 * the surrounding `<ThemedSurface>`, so it re-themes with the active design
 * config. Open state is managed internally.
 */
export function Accordion({
  items,
  multiple = false,
  defaultOpen = [],
  className,
}: AccordionProps) {
  const [open, setOpen] = useState<string[]>(defaultOpen);

  const toggle = (id: string) => {
    setOpen((prev) => {
      const isOpen = prev.includes(id);
      if (multiple) {
        return isOpen ? prev.filter((x) => x !== id) : [...prev, id];
      }
      return isOpen ? [] : [id];
    });
  };

  const classes = ["tc-accordion"];
  if (className) classes.push(className);

  return (
    <div className={classes.join(" ")}>
      {items.map((item) => {
        const isOpen = open.includes(item.id);
        const panelId = `tc-acc-panel-${item.id}`;
        const headerId = `tc-acc-header-${item.id}`;
        return (
          <div key={item.id} className="tc-accordion__item" data-open={isOpen}>
            <button
              type="button"
              id={headerId}
              className="tc-accordion__header"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(item.id)}
            >
              <span>{item.title}</span>
              <Caret />
            </button>
            {isOpen && (
              <div id={panelId} role="region" aria-labelledby={headerId} className="tc-accordion__panel">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

Accordion.displayName = "Accordion";
