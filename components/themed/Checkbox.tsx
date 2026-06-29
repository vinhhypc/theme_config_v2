// `React` imported explicitly so this also renders under Storybook's Vite
// pipeline (classic JSX runtime); harmless in the Next app.
import React, { type ReactNode } from "react";

export interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  children?: ReactNode;
}

/** Tick icon shown when checked (revealed via CSS). */
function Tick() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3.5 8.5l3 3 6-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Token-driven checkbox. Emits semantic classes (`tc-checkbox`, …) styled by
 * the surrounding `<ThemedSurface>`, so it re-themes with the active design
 * config. The native input is visually hidden but keeps keyboard/a11y support.
 */
export function Checkbox({ checked, onCheckedChange, disabled, children }: CheckboxProps) {
  return (
    <label className="tc-checkbox" data-checked={checked} data-disabled={disabled}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onCheckedChange(e.target.checked)}
      />
      <span className="tc-checkbox__box">
        <Tick />
      </span>
      {children}
    </label>
  );
}

Checkbox.displayName = "Checkbox";
