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
  Gives a precise, dependency-ordered gap list (Gap 1: drift-pack library, Gap 2: structure/
  intensity split, Gap 3: contact graph, Gap 4: place strata, Gap 5: titles, Gap 6: spelling
  toggle). Gap 1 must be fixed before Gaps 2–4 are buildable — follow its sequence.
- /docs/naming-system-framework.md — the master design.
- /docs/spec-*.md — feature specs (language page, name classes, meaningful names, traditions).
- /docs/gate-refinements.md — accepted amendments to the Step 6 gates.
- /data + /tools — validated data and its validators: starter-packs-v2.json (phonetic
  elements), concept-packs.json (tagged semantic concepts), drift-packs.json (sound-change
  rule packs), naming-traditions.json (content+structure presets), each paired with its
  /tools validator. Run `npm run validate` to check all four.

## Current status (read before assuming a spec is implemented)
- `engine.ts` has a working drift/family-tree feature (`DRIFT_PRESETS`, `driftWord`,
  `deriveCulture`, `mergeCultures`) using a simple intensity model — **not** the richer
  pack-based model in `drift-packs.json`. Migrating the engine onto `drift-packs.json`
  is planned but not done.
- `SEMANTIC_PACKS` in `data.ts` still stores concepts as plain strings, not the tagged
  `{concept, tags}` shape `concept-packs.json` uses. `contentPolicy`/root-policy resolution
  is not wired into generation yet.
- `naming-traditions.json`'s patterns are not wired into name generation yet.
- All three new data files validate clean (0 failures) as of the commit that added them —
  the data layer is ready; the engine wiring is the next pass.

## Build
- npm install
- npx tsc  (type-check)
- esbuild bundle to main.js (see README)
