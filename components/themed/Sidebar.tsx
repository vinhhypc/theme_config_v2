// `React` imported explicitly so this also renders under Storybook's Vite
// pipeline (classic JSX runtime); harmless in the Next app.
import React, { type ReactNode } from "react";

export interface SidebarItem {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
}

export interface SidebarProps {
  items: SidebarItem[];
  activeId?: string;
  onSelect?: (id: string) => void;
  title?: ReactNode;
}

/**
 * Token-driven sidebar nav. Emits semantic classes (`tc-sidebar`, …) styled by
 * the surrounding `<ThemedSurface>`, so it re-themes with the active design
 * config.
 */
export function Sidebar({ items, activeId, onSelect, title }: SidebarProps) {
  return (
    <nav className="tc-sidebar" aria-label="Điều hướng">
      {title != null && <p className="tc-sidebar__title">{title}</p>}
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={item.id === activeId ? "tc-sidebar__item tc-sidebar__item--active" : "tc-sidebar__item"}
          aria-current={item.id === activeId ? "page" : undefined}
          onClick={() => onSelect?.(item.id)}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </nav>
  );
}

Sidebar.displayName = "Sidebar";
