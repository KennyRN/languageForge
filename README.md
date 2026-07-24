# languageForge — Obsidian plugin
a (pre-release) name generator by volcanicMole

I've created another name generator, but as this one is based off conlang rather than Markov Magic I've decided to call it languageForge!

Well, that's the base of this plugin, creating a basic conlang and then create names from it. What's more, each name comes with pronuciation guides and meanings.

This being a plugin, and one which I can play with, I decided to go just *a bit* further. So you can create a family tree of languages! So you can evolve languages across generations, inter-mix languages, make some languages dialects and some languages whole new languages.

## Installation

Requires **Obsidian 1.13.0 or newer**.

languageForge is still in pre-release, so it isn't in the Community Plugins browser yet. There are two ways to install it in the meantime:

**Via BRAT (recommended for pre-release)**
1. Install the **BRAT** plugin from Obsidian's Community Plugins browser and enable it.
2. In BRAT's settings, choose **Add beta plugin**.
3. Enter `KennyRN/languageForge` and confirm. BRAT will install it and keep it updated as new pre-release builds land.
4. Enable **languageForge** under Settings → Community plugins.

**Manual install**
1. Download `main.js`, `manifest.json`, and `styles.css` from the [latest release](https://github.com/KennyRN/languageForge/releases).
2. Create the folder `<your vault>/.obsidian/plugins/languageforge/` and drop the three files into it.
3. Reload Obsidian (or toggle Community plugins off and on), then enable **languageForge** under Settings → Community plugins.

Once it's accepted into the Community Plugins directory you'll be able to search for it there directly.

## Usage

**Quick start**
1. Run **Create a language** from the command palette (Ctrl/Cmd-P), or click the **Languages** ribbon icon and use the **+**. languageForge builds you a small conlang from a mood and register you choose.
2. Run **Generate names** (or click the **Generate** / sparkles ribbon icon), pick your language and a category — people, houses, places, titles — and you get a batch of names, each with a pronunciation guide and meaning.
3. Insert the names into your current note, or run **Save a culture card as a note** to write a full language page (with glossary) into your vault.

**Ribbon icons**

There's two icons for this plugin (but it's still in pre-release so it might drop down to one).

- **Generate:** open the name generator.
- **Languages:** (tree icon) visual family tree of your languages; click a language to generate names for it, or use the + icon to create or evolve languages.

**Commands** (open the command palette and search "languageForge")

- **Create a language** / **Create a culture** — start a new conlang.
- **Create a culture from names you already have** — reverse-seed a language from example names.
- **Generate names** — open the generator for an existing language.
- **Import names into a language** — add your own names into a language.
- **Derive a descendant language** — evolve a child language from an existing one.
- **Age a language in place** — preview archaic vs worn-modern forms of a language.
- **Connect two languages via contact** — model loanwords between languages.
- **View language family tree** — open the visual tree.
- **Edit languages** — rename, adjust, or remove languages.
- **Save a culture card as a note** — write a language page (and glossary) to your vault.

**Evolving languages**

From the family tree you can grow a language into descendants, age one in place, mix dialects, and connect languages so they trade loanwords — building up a whole related family over time.

**Settings** (Settings → languageForge)

- **Folder for language pages** — where saved language notes live (default `LanguageForge`).
- **Names per batch** — how many names each generation produces.
- **Show pronunciation hints** — toggle the say-it-like respellings under each name.
- **Insert format** — whether names are written as a bulleted list with details or a plain comma-separated line.

## What's under the hood (kept from the ai coder as it knows what it's talking about)

- All names pass Step 6 readability gates (joinery, echo, throwaway-U, connotation, per-culture registry).
- Word forms are minted once and stay stable for that culture.
- Drift packs, place strata, naming traditions, titles, and etymological vs phonetic spelling are all wired into generation.
- Data lives in `/data` JSON (validated by `/tools`). Edit JSON, validate, regenerate `src/data.ts` — never hand-edit the TS port.
