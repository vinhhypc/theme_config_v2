# DesignSync Studio (`config-theme-v2`)

Define a design system once, export a set of `.md` rule files, and keep every AI code
generation in sync with the same tokens, guidelines and constraints.

> Built from the project brief in `ai-input-design-system-studio.md`. The five generated
> markdown files are the product: they are meant to be attached to every code-gen request.

## What it does

1. **Config Builder** — pick colors, typography, spacing, radius, borders, elevation,
   animation, components and AI rules. Live preview updates instantly.
2. **Export** — generate **5 markdown files + 1 combined entrypoint**, all stamped with the
   same version & timestamp. Preview each (rendered or source), copy, or download a `.zip`.
3. **Preview** *(needs OpenAI key)* — generate a screen from the design system and run it in a
   sandboxed Sandpack iframe; optionally **deploy** to Vercel.
4. **Analyze & Refactor** *(needs OpenAI key)* — upload HTML/CSS/JS, get issues + proposed
   rules to merge into your rule set, and refactor code toward your tokens with a before/after diff.

The app **degrades gracefully**: everything in Builder/Export works fully offline. AI/deploy
features show a friendly message when keys are missing instead of crashing.

## Tech stack

Next.js 14 (App Router) · TypeScript · TailwindCSS · Zustand · zod · OpenAI API ·
Sandpack · Vercel REST API · JSZip + file-saver · react-markdown.

## Getting started

```bash
npm install
cp .env.example .env   # fill in keys when you want AI/deploy features
npm run dev            # http://localhost:3000
```

The app runs with the placeholder `.env` — AI/deploy buttons simply report that keys are missing.

### Environment

| Var | Purpose |
|---|---|
| `OPENAI_API_KEY` | Server default key for generate/analyze/refactor. |
| `OPENAI_MODEL` | Model (default `gpt-4o`). |
| `VERCEL_API_TOKEN` | Token for creating deployments. |
| `VERCEL_TEAM_ID` | Optional Vercel team scope. |
| `NEXT_PUBLIC_APP_NAME` | App name shown in the UI. |

Keys live **only on the server** (Route Handlers). Users may also paste a personal OpenAI key
in the UI; it is stored in the browser and sent via the `x-openai-key` header (never logged).

## Scripts

```bash
npm run dev         # dev server
npm run build       # production build
npm run test        # vitest unit tests (markdown generators + token math)
npm run typecheck   # tsc --noEmit
```

## Project layout

```
app/                 # pages (/, /preview, /analyze) + API route handlers
components/          # builder panels, live preview, export, sandpack, ui primitives
lib/
  config/            # DesignConfig type, zod schema, defaults, presets
  tokens/            # pure color/type/spacing/elevation math + CSS variables
  markdown/          # 5 pure generators (DesignConfig → string) + combined
store/               # zustand stores (config + client key)
```

`lib/markdown/*` and `lib/tokens/*` are **pure functions** with unit tests
(`npm run test`) — the single source of truth shared by export and live preview.

## API contract

All endpoints take/return JSON; errors are `{ error: { code, message } }`.

- `POST /api/generate` → `{ config, prompt?, stack? }` → `{ files: [{ path, content }] }`
- `POST /api/analyze` → `{ files, config }` → `{ issues, proposedRules }`
- `POST /api/refactor` → `{ files, config, appliedRules? }` → `{ files: [{ path, before, after }] }`
- `POST /api/deploy` → `{ projectName, files }` → `{ deploymentId, url, status }`
  (`GET /api/deploy?id=…` polls status)

## Security notes

- API keys are never exposed to the client and never logged.
- Uploaded code is treated as **data, not instructions** — embedded "directives" are ignored.
- Deploy requires explicit user confirmation (it creates a real resource).

## Notes for further work

- `TODO`: swap LocalStorage persistence for Postgres/Supabase to share systems server-side (Phase 4).
- `TODO`: replace the heuristic color scale with a perceptual (OKLCH) scale if needed.
