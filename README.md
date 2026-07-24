# languageForge — Obsidian plugin

Seed naming cultures for your world. Build a language family tree, generate names with pronunciation and meaning, and evolve languages across generations.

## Install

### From a release

1. Download `main.js`, `manifest.json`, and `styles.css` from the [latest GitHub release](https://github.com/KennyRN/languageForge/releases)
2. Copy them into `<your vault>/.obsidian/plugins/languageforge/`
3. In Obsidian: Settings → Community plugins → enable **languageForge**

### From source

```
npm install
npx tsc --noEmit
npx esbuild src/main.ts --bundle --external:obsidian --format=cjs --platform=browser --target=es2019 --outfile=main.js
```

Then copy `main.js`, `manifest.json`, and `styles.css` into the plugin folder as above.

## Ribbon

- **Generate** — open the name generator (falls back to Languages if you have no cultures yet)
- **Languages** (tree icon) — family tree of your cultures; click a language to generate names for it, or use **+** to create / evolve languages

## Commands (Ctrl/Cmd-P)

**Create a culture** — sound, register, familiarity, environment, optional word themes. Accept a culture card when it feels right.

**Create a culture from names you already have** — paste two or more names (`Kaelith, Veyra`). The engine reverse-seeds a phonology consistent with them and reserves your originals.

**Generate names** — pick a generation and culture–pack, choose quantity, generate. Results show pronunciation and meaning. Multi-select, then Insert / Checklist / List into the active note.

**Languages** — family tree view (same as the ribbon).

Child languages support **Language aging** (branch from one parent) and **Language intermixing** (directional contact between two languages of the same generation).

## What's under the hood

- All names pass Step 6 readability gates (joinery, echo, throwaway-U, connotation, per-culture registry).
- Word forms are minted once and stay stable for that culture.
- Drift packs, place strata, naming traditions, titles, and etymological vs phonetic spelling are all wired into generation.
- Data lives in `/data` JSON (validated by `/tools`). Edit JSON, validate, regenerate `src/data.ts` — never hand-edit the TS port.
