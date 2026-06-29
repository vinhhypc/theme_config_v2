# @vinhhypc/config-theme

Token-driven React components. Every component is styled by a `<ThemeProvider>`
that receives a `DesignConfig` (your chosen design tokens) and injects the CSS
variables + stylesheet — so the whole tree re-themes from one config.

📖 **Live docs / playground:** https://storybook-config-theme.vercel.app

## Install

```bash
npm i @vinhhypc/config-theme react react-dom
```

## Usage

Wrap your app (or any subtree) in `<ThemeProvider>` and use any component.
You import only what you need — unused components are tree-shaken out.

```tsx
import { ThemeProvider, Button, Card, applyPreset } from "@vinhhypc/config-theme";

// Tokens: a built-in preset, or your own DesignConfig (e.g. saved JSON).
const config = applyPreset("modern");

export default function App() {
  return (
    <ThemeProvider config={config} mode="light">
      <Card title="Hello" footer={<Button>OK</Button>}>
        This card themes itself from the config.
      </Card>
    </ThemeProvider>
  );
}
```

`<ThemeProvider>` is required — without it components render unstyled.

## Components

`Accordion`, `Alert`, `Avatar`, `Badge`, `Button`, `Calendar`, `Card`,
`Checkbox`, `DropdownMenu`, `Input` / `Field`, `Pagination`, `Select`,
`Sheet`, `Sidebar`, `Table`, `Toast`, `Tooltip`.

Also exported: `useTheme()`, the token layer (`presets`, `applyPreset`,
`defaultConfig`, `resolveTokens`) and the `DesignConfig` type.

## Notes

- **Fonts**: the tokens only declare `font-family`. Load the matching web fonts
  yourself (e.g. Google Fonts / `next/font`).
- **Next.js App Router**: components are client components (the published bundle
  carries the `"use client"` directive).

## License

MIT
