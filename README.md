# languageForge — Obsidian plugin

Seed naming cultures for your world. Three commands, one card, everything else behind it.

## Install

1. Copy `main.js`, `manifest.json`, and `styles.css` into `<your vault>/.obsidian/plugins/languageforge/`
2. In Obsidian: Settings → Community plugins → enable **languageForge**

## The three commands (Ctrl/Cmd-P) — plus a ribbon shortcut

A ribbon icon (the "languages" glyph) runs **Generate names** directly, so the
most common action doesn't need the command palette — it falls back to
**Create a culture** first if you don't have one yet.

**Create a culture** — four choices (sound, register, familiarity, environment), optional word themes behind a disclosure. You get a *culture card*: a one-breath description of how the names work, six specimens with pronunciation, and a preview of the culture's own words. Reshuffle until it feels right, then accept.

**Create a culture from names you already have** — paste two or more names you've invented (`Kaelith, Veyra`). The engine works out a phonology consistent with them, weights their sounds heavily, and generates kin. Your originals are reserved: nothing colliding with them will ever be generated.

**Generate names** — batches of people, houses, or places, by sound or by meaning (meaning-mode names carry a gloss, e.g. *Tsaraenkae — rune + strong*). Tap the names you like and hit **More like starred**: the culture learns your taste (verified: one star measurably raises that ending's share of the next batch, 20/20 trials). **Insert into note** writes them at your cursor — with say-it-like pronunciation — and reserves them so nothing near-identical appears again.

**Save a culture card as a note** writes a full card into your vault: frontmatter (including the reproducibility seed), the one-breath line, samples, and the culture's whole glossary with frequency labels.

## What's under the hood (touch only if you want to)

- All names pass the framework's Step 6 gates: joinery, echo/stutter filters, the throwaway-U check, connotation blocklist, and a per-culture registry.
- Word forms are **minted once, stably** — "sword" sounds the same in this culture forever, seeded by the culture's own seed.
- Concept weighting is capped multiplicity, shown only as rare/normal/common/dominant.
- Element data is generated from `starter-packs-v2.json`, which is itself validated by `pack_validator.py`. Edit the JSON, re-validate, regenerate `src/data.ts` — never hand-edit the TS.

## Build from source

```
npm install
npx tsc                 # type-check
npx esbuild src/main.ts --bundle --external:obsidian --format=cjs --platform=browser --target=es2019 --outfile=main.js
```
