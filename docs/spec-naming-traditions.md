# Spec — Two front doors + the living language page

*Covers QoL points 1 and 3, which are one surface: a **Languages** door that lists and opens languages, and a **Generate** door for producing names. Each language opens a durable, renameable page that shows its roots, description, and family — and holds your own notes without the plugin ever clobbering them. Written against the real code (`main.ts`, `engine.ts`).*

---

## Goal

Today there is one ribbon icon (Generate, falling back to Create) and the lifecycle actions are scattered across the palette; the per-language note (`cultureNote`) is a one-shot dump with no rename and no safe place for your own notes. This spec splits the entry points in two and turns the note into a living page.

---

## Part 1 — The two doors

**GUIDE.** Two ribbon icons, a clean split between shaping languages and producing names.

- **Languages** (icon: `languages`). Opens a hub listing every culture. From the hub: create new, create-from-names/text, derive a descendant, view the family tree, and open any language's page. This is the umbrella for the whole lifecycle — creation, reverse-seed, derivation, merge, family.
- **Generate names** (icon: `sparkles` or `dice`). Opens the generation modal: pick a language, then a batch (later: class and category). If no cultures exist yet, it falls back to the create wizard, exactly as the current ribbon does.

The existing palette commands stay — the icons are the primary front doors, not a replacement.

**SPEC.**
- Replace the single `addRibbonIcon` in `main.ts` with two: `languages` → `new LanguagesHubModal(...)`, and a generate glyph → the existing generate flow.
- `LanguagesHubModal`: renders a list of `this.plugin.data.cultures` (name · one-breath · generation), a row action **Open page** and **Generate from this**, and top buttons **New**, **From names/text**, **Derive**, **Family tree** wired to the existing modals (`SeedWizardModal`, `PasteNamesModal`, `DeriveCultureModal`, the family-tree view).
- Keep `create-culture`, `generate-names`, `derive-culture`, `view-family-tree`, `save-culture-card` as palette commands.

---

## Part 2 — The language page

### What already exists (don't rebuild)

`cultureNote(culture, allCultures)` already renders: frontmatter (seed, mood, register, packs), the one-breath summary, a **Family** section (parents / descendants / drift), **Sound elements**, **Sample names**, a **Glossary** table of roots with frequency labels, and **Accepted names**. The content is good. What's missing is durability: rename, a user-owned notes area, and merge-on-regenerate instead of overwrite.

### 2a — Managed vs user-owned content

**GUIDE.** The page mixes plugin-generated content (roots, description, family) with content only you should own (your notes). Regenerating must refresh the former and never touch the latter.

**SPEC.** Wrap all plugin-generated sections in delimiters:

	<!-- lf:managed:start -->
	… frontmatter-mirror, description, family, sound elements, samples, glossary, accepted names …
	<!-- lf:managed:end -->

Everything outside the delimiters is user-owned. On regeneration the plugin parses the existing file, replaces only the managed block, and leaves the rest byte-for-byte. A `## Notes` section is created once, below the managed block, if absent — and never rewritten thereafter.

Replace the single-shot `cultureNote` with `renderLanguagePage(culture, allCultures, existingBody?)`:
1. If `existingBody` is absent → emit managed block + an empty `## Notes` stub.
2. If present → splice: keep everything before `lf:managed:start` and after `lf:managed:end` (including `## Notes`), regenerate the managed block in place.

### 2b — Rename (safe by construction)

**GUIDE.** You seed first, read the roots, then choose a name. Renaming must not break the family tree.

It doesn't: a culture's identity is `id` (the seed); the family tree links by `parentIds` (ids); `name` is display-only. So renaming touches only display surfaces.

**SPEC.** `renameCulture(culture, newName)` sets `culture.name`. The plugin then:
1. updates the H1 title and the `name` in frontmatter within the managed block;
2. renames the note file via `app.fileManager.renameFile`.

That's all. Because other pages reference this language as bare `[[wikilinks]]`, Obsidian's built-in rename propagation updates both the link and its visible label everywhere it appears — the plugin does not walk other pages. The stable key is `id`, mirrored into frontmatter as `lf-id` so a page can always be re-associated with its culture even if the file is moved or the title edited by hand.

### 2c — Placeholder-name-first flow

**GUIDE.** Seed with a throwaway name, look at the glossary, then rename once it has a feel.

**SPEC.** `SeedTraits.name` becomes optional. When omitted, `seedCulture` calls `placeholderName(culture)` — mint a name from the culture's *own* elements (a start + end from its freshly sampled sets), so even the placeholder sounds native (e.g. a soft culture auto-names itself "Aeriel" rather than "Untitled 3"). The page opens straight after seeding with a **Rename** button up top.

### 2d — Forward hooks (stubs now, filled by later specs)

**GUIDE.** Two sections get placeholder headings now so the page's shape is stable when we build points 2 and 4.

- `## Import` — where pasted names/text will bend the language's sounds (QoL point 2). Note the constraint captured this session: **input must be romanised** (Latin letters); a list of Nordic names or romaji works, raw non-Latin script does not.
- `## Name classes` — where feminine / masculine / neutral (and user-added classes) will live (QoL point 4).

**SPEC.** Emit both headings inside the managed block with a one-line "coming soon" note, so their position is fixed and later specs slot content in without reflowing the page.

### 2e — Sample names on the page

**GUIDE.** The page shows a handful of specimen names. They stay put so the page is stable to look at, but they must not lie about what the language currently sounds like after you've imported into it or drifted it.

**SPEC.** Store the specimens on the culture as `sampleNames` (say, six, with pronunciation). The renderer reads them verbatim — it never generates on render, so opening the page is deterministic. A single helper `refreshSamples(culture)` regenerates and restores them, and is called only on **material change**: at creation, and at the end of any function that mutates `elements` or `roots` — import (point 2), `deriveCulture` (new cultures get fresh samples for free), and `reinforce`. Non-mutating actions (rename, adding a note, generating a batch elsewhere) leave the samples alone.

---

## Part 3 — Data & function summary

**Minimal `Culture` change:** add `sampleNames` (stored specimens, refreshed on material change). Identity fields (`id`, `name`, `seed`, `parentIds`, `generation`, `driftLevel`) already exist and `name` is freely mutable. New/changed functions:

| Symbol                                            | Where       | Purpose                                                                                                      |
| ------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------ |
| `renderLanguagePage(culture, all, existingBody?)` | engine.ts   | replaces `cultureNote`; merge-aware (managed block + preserved user notes); Family uses bare `[[wikilinks]]` |
| `renameCulture(culture, newName)`                 | engine.ts   | sets display name + renames file; Obsidian propagates links, so no other pages are touched                   |
| `placeholderName(culture)`                        | engine.ts   | mints a native-sounding throwaway name from the culture's own elements                                       |
| `refreshSamples(culture)`                         | engine.ts   | regenerates stored `sampleNames`; called only on material change (create/import/derive/reinforce)            |
| `noteFolder` setting                              | main.ts     | configurable base folder, default `LanguageForge/`                                                           |
| `LanguagesHubModal`                               | main.ts     | the Languages door: list + lifecycle actions                                                                 |
| second `addRibbonIcon`                            | main.ts     | splits the two doors                                                                                         |
| `lf-id` in frontmatter                            | note format | durable key surviving rename/hand-edits                                                                      |

---

## Part 4 — Build order

1. `renderLanguagePage` with the managed/unmanaged split (the core; everything else depends on the page being safe to regenerate). Family section uses bare `[[wikilinks]]`.
2. `renameCulture` + file-rename wiring + `lf-id` frontmatter.
3. `placeholderName` and optional-name seeding; `sampleNames` storage + `refreshSamples` called at creation.
4. `noteFolder` setting + `LanguagesHubModal` + the second ribbon icon.
5. Emit the `## Import` and `## Name classes` stub headings.

Later specs wire `refreshSamples` into their mutating functions (import, reinforce); `deriveCulture` already produces fresh cultures.

Migration: on first open of a language that has an old `save-culture-card` note, wrap the existing body as user content, insert managed delimiters around a freshly rendered managed block, and add the `## Notes` stub — no data loss.

---

## Resolved decisions

- **Note location — configurable folder, default `LanguageForge/`.** Add a plugin setting `noteFolder` (default `LanguageForge/`). Page paths resolve as `${noteFolder}/${sanitise(name)}.md`. Creating a language ensures the folder exists.
- **Family labels on rename — bare wikilinks, Obsidian auto-updates.** The managed **Family** section references other languages as bare `[[Name]]` wikilinks (never aliased `[[Name|label]]`, never plain text). When a page file is renamed, Obsidian's own link-update rewrites both the link target and the shown text everywhere — so the plugin does *nothing* extra on rename beyond renaming its own file. This deletes a step from `renameCulture` (see amended 2b).
- **Samples — frozen, auto-refreshed on material change.** Sample names are stored on the culture and read as-is by the renderer, so the page is stable. They regenerate only when the language's `elements` or `roots` actually change: at creation, and after import (point 2), drift/derive, and reinforce. No manual reroll button needed.
