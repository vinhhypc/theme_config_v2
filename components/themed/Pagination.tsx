// `React` imported explicitly so this also renders under Storybook's Vite
// pipeline (classic JSX runtime); harmless in the Next app.
import React from "react";

export interface PaginationProps {
  page: number;
  total: number;
  onChange: (page: number) => void;
  /** Max number of page buttons to show (excluding prev/next). */
  siblings?: number;
}

/** Build the visible page list with ellipses for large ranges. */
function pageList(page: number, total: number, siblings: number): (number | "…")[] {
  if (total <= siblings + 2) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages = new Set<number>([1, total, page]);
  for (let i = 1; i <= Math.floor(siblings / 2); i++) {
    pages.add(Math.max(1, page - i));
    pages.add(Math.min(total, page + i));
  }
  const sorted = [...pages].sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) out.push("…");
    out.push(p);
    prev = p;
  }
  return out;
}

/**
 * Token-driven pagination. Emits semantic classes (`tc-pagination`, `tc-page`,
 * …) styled by the surrounding `<ThemedSurface>`, so it re-themes with the
 * active design config.
 */
export function Pagination({ page, total, onChange, siblings = 5 }: PaginationProps) {
  const go = (p: number) => onChange(Math.min(total, Math.max(1, p)));
  return (
    <nav className="tc-pagination" aria-label="Phân trang">
      <button type="button" className="tc-page" disabled={page <= 1} onClick={() => go(page - 1)} aria-label="Trang trước">
        ‹
      </button>
      {pageList(page, total, siblings).map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className="tc-page" aria-hidden="true" style={{ border: 0, background: "transparent", cursor: "default" }}>
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            className={p === page ? "tc-page tc-page--active" : "tc-page"}
            aria-current={p === page ? "page" : undefined}
            onClick={() => go(p)}
          >
            {p}
          </button>
        ),
      )}
      <button type="button" className="tc-page" disabled={page >= total} onClick={() => go(page + 1)} aria-label="Trang sau">
        ›
      </button>
    </nav>
  );
}

Pagination.displayName = "Pagination";
