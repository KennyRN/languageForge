# languageForge — Obsidian plugin
a (pre-release) name generator by volcanicMole

I've created another name generator, but as this one is based off conlang rather than Markov Magic I've decided to call it languageForge!

Well, that's the base of this plugin, creating a basic conlang and then create names from it. What's more, each name comes with pronuciation guides and meanings.

This being a plugin, and one which I can play with, I decided to go just *a bit* further. So you can create a family tree of languages! So you can evolve languages across generations, inter-mix languages, make some languages dialects and some languages whole new languages.

## Ribbon
There's two icons for this plugin (but it's still in pre-release so it might drop down to one).

- **Generate:** open the name generator
- **Languages:** (tree icon) visual family tree of your languages; click a language to generate names for it, or use the + icon to create or evolve languages

## What's under the hood (kept from the ai coder as it knows what it's talking about)

- All names pass Step 6 readability gates (joinery, echo, throwaway-U, connotation, per-culture registry).
- Word forms are minted once and stay stable for that culture.
- Drift packs, place strata, naming traditions, titles, and etymological vs phonetic spelling are all wired into generation.
- Data lives in `/data` JSON (validated by `/tools`). Edit JSON, validate, regenerate `src/data.ts` — never hand-edit the TS port.
