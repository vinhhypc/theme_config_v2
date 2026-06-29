// `React` imported explicitly so this also renders under Storybook's Vite
// pipeline (classic JSX runtime); harmless in the Next app.
import React, { type ReactNode } from "react";

export interface TableColumn<T> {
  key: keyof T & string;
  header: ReactNode;
  /** Custom cell renderer; defaults to the raw value. */
  render?: (row: T) => ReactNode;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  /** Optional key extractor; defaults to the row index. */
  rowKey?: (row: T, index: number) => string;
}

/**
 * Token-driven table. Emits the semantic `tc-table` class styled by the
 * surrounding `<ThemedSurface>`, so it re-themes with the active design config.
 */
export function Table<T>({ columns, data, rowKey }: TableProps<T>) {
  return (
    <table className="tc-table">
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c.key}>{c.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={rowKey ? rowKey(row, i) : i}>
            {columns.map((c) => (
              <td key={c.key}>{c.render ? c.render(row) : (row[c.key] as ReactNode)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

Table.displayName = "Table";
