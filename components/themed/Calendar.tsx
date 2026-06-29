"use client";

// `React` imported explicitly so this also renders under Storybook's Vite
// pipeline (classic JSX runtime); harmless in the Next app.
import React, { useMemo, useState } from "react";

export interface CalendarProps {
  /** Currently selected date (controlled). */
  value?: Date;
  /** Fired when a day is clicked. */
  onChange?: (date: Date) => void;
  /** Month to display initially (defaults to today, or `value`'s month). */
  defaultMonth?: Date;
}

const DOW = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]; // Monday-first
const MONTHS = [
  "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
  "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
];

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

/** Days to render for a month grid, padded to whole weeks (Monday-first). */
function buildGrid(year: number, month: number): Date[] {
  const first = new Date(year, month, 1);
  // JS getDay(): 0=Sun … 6=Sat. Convert to Monday-first offset (0=Mon … 6=Sun).
  const lead = (first.getDay() + 6) % 7;
  const start = new Date(year, month, 1 - lead);
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

/**
 * Token-driven month calendar. Emits semantic classes (`tc-cal`, …) styled by
 * the surrounding `<ThemedSurface>`, so it re-themes with the active design
 * config. Selection/month navigation is managed internally.
 */
export function Calendar({ value, onChange, defaultMonth }: CalendarProps) {
  const today = useMemo(() => new Date(), []);
  const initial = defaultMonth ?? value ?? today;
  const [view, setView] = useState({ y: initial.getFullYear(), m: initial.getMonth() });
  const [internal, setInternal] = useState<Date | undefined>(value);

  const selected = value ?? internal;
  const days = useMemo(() => buildGrid(view.y, view.m), [view]);

  const shift = (delta: number) => {
    const d = new Date(view.y, view.m + delta, 1);
    setView({ y: d.getFullYear(), m: d.getMonth() });
  };

  const pick = (d: Date) => {
    setInternal(d);
    onChange?.(d);
  };

  return (
    <div className="tc-cal">
      <div className="tc-cal__head">
        <button type="button" className="tc-cal__nav" aria-label="Tháng trước" onClick={() => shift(-1)}>
          ‹
        </button>
        <span className="tc-cal__title">
          {MONTHS[view.m]} {view.y}
        </span>
        <button type="button" className="tc-cal__nav" aria-label="Tháng sau" onClick={() => shift(1)}>
          ›
        </button>
      </div>

      <div className="tc-cal__grid">
        {DOW.map((d) => (
          <div key={d} className="tc-cal__dow">
            {d}
          </div>
        ))}
        {days.map((d) => {
          const muted = d.getMonth() !== view.m;
          const classes = ["tc-cal__day"];
          if (muted) classes.push("tc-cal__day--muted");
          if (sameDay(d, today)) classes.push("tc-cal__day--today");
          if (selected && sameDay(d, selected)) classes.push("tc-cal__day--selected");
          return (
            <button
              key={d.toISOString()}
              type="button"
              className={classes.join(" ")}
              aria-pressed={selected ? sameDay(d, selected) : false}
              onClick={() => pick(d)}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

Calendar.displayName = "Calendar";
