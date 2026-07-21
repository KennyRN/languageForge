# languageForge — project context for Claude Code

An Obsidian plugin (TypeScript, esbuild) that generates fantasy names and languages.

## Golden rules
- JSON data files in /data are the source of truth. Never hand-edit /src/data.ts —
  regenerate it from JSON and re-run the matching validator in /tools.
- Every validator must pass before a change is done. A FAIL blocks the build.
- Names are written in the 26 Latin letters only. No diacritics, no gratuitous apostrophes.
- A language's identity is its `id` (seed). `name` is display-only. The family tree
  links by `parentIds`. Do not key data or logic off `name`.
- All generated names pass the Step 6 readability gates (joinery, echo, throwaway-U,
  connotation, per-culture registry).

## Where things live
- /docs/reconciliation.md — how the current build diverged from the design; start here.
- /docs/naming-system-framework.md — the master design.
- /docs/spec-*.md — feature specs (language page, name classes, meaningful names, traditions).
- /docs/gate-refinements.md — accepted amendments to the Step 6 gates.
- /data + /tools — validated data and its validators.

## Build
- npm install
- npx tsc  (type-check)
- esbuild bundle to main.js (see README)
