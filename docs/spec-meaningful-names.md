# Spec — Meaning-first names (promoted to core)

*This was going to be a second-tier addition; it's being pulled forward because it's the core of what the generator is for. Names should carry meaning by default, show that meaning next to the pronunciation, and combine their meaning with their gender/class ending. Written against the real code (`engine.ts`). Priority: **before** the contact/adoption work — those scenarios are hollow until names mean something.*

---

## What already exists (this is a promotion, not a rebuild)

- Every culture mints `roots: {form, meaning, origin, weight}` from the concept packs — your examples (strong, bright, wolf, bear, eagle, hawk, star, flame, fair…) are already in `core`.
- `assembleSemantic` composes two roots into a name and returns a gloss ("strong + spear").
- `GeneratedName.gloss?` carries it; the language-page glossary lists every root with a frequency label.

The roots are built and picked; the plumbing for meaning exists. Three things stop it being the experience you wanted.

---

## The three gaps to close

### Gap A — meaning is opt-in; make it the default

**GUIDE.** `generateBatch` defaults to `mode: "sound"` (opaque phonetic assembly). Flip the default so names carry meaning unless a culture/class deliberately opts out.

**SPEC.** Add `Culture.defaultGeneration: "sound" | "meaning" | "mixed"` (default **mixed**). `generateBatch`'s `mode` param becomes optional and falls back to the culture default, which a class's `generation` preference (from the classes spec) can override. **mixed** = most names meaning-bearing, a minority pure-sound, so a culture reads as meaningful without every name being a transparent noun. A culture that wants opaque names sets `defaultGeneration: "sound"`.

### Gap B — only two-root compounds; allow single roots (and cap the max)

**GUIDE.** Real names are often a single evocative root — "Wolf," "Bright," "Dawn" — not always a compound. Names should be one *or* two roots (occasionally more only in grand/ancient registers), weighted so both single and compound names appear.

**SPEC.** Generalise `assembleSemantic` → `assembleMeaning(rng, culture, opts)` that picks a root count: 1 or 2 by default (weights tuned by `register` — ancient leans to 2, modern leans to 1), rarely 3 for `register: "ancient"`. A single-root name is that root shaped to the culture's phonology and given a class ending (Gap C). Gloss reflects the actual roots used: `"wolf"`, or `"bright + wolf"`.

### Gap C — meaning ignores the ending signature; combine them

**GUIDE.** This is the missing link that makes gendered/class meaning work: a meaningful name must still carry its class ending. "victory" + a feminine ending should be possible — that's how you get a name that is *both* martial in meaning and feminine in form. Today `assembleMeaning` glues roots and never touches endings.

**SPEC.** After composing the root(s), `assembleMeaning` appends an ending drawn from the active class's signature (or the culture's base endings if unmarked), repairing the seam per joinery. The ending is a grammatical/gender marker, so it is **not** added to the gloss — or is shown as a marker, e.g. `gloss: "victory"`, `class: "feminine"`. Root selection runs through the class `rootPolicy` (favour/lock, from the classes spec), so a feminine name draws flowers/hearth roots, a feminine-warrior name locks to war/strength roots — each still ending in the feminine signature. Roots + endings + policy finally act as one.

---

## The unifying model: every name is an etymology

**GUIDE.** Treat a generated name as three layers that are always available: its **meaning** (the root(s)), its **surface form** (the assembled, and later drift-able, spelling), and its **pronunciation**. The gloss is the etymology and persists even after the surface form drifts — so a worn-down name still knows it once meant "bright-wolf." This is what lets meaning survive the erosion packs instead of being lost.

**SPEC.** `GeneratedName` keeps `name`, `pronunciation`, `gloss`, adds `roots: {form, meaning}[]` (the etymology) and optional `className`. When drift is applied later, the surface `name` changes but `roots`/`gloss` are preserved as the etymology of record.

---

## Surfacing meaning everywhere (Gap A's other half)

**GUIDE.** A name's meaning should be visible wherever the name is — not buried behind a mode toggle.

**SPEC.** Show meaning alongside pronunciation in every surface: generation batches, "insert into note," and the page's sample list. Format: **Name** — *say it: …* — "bright-wolf" (feminine). In a note, inserted names write as e.g. `Vaelira` *(bright-wolf, feminine)* [say: vye-LEE-ra]. The gloss is already on `GeneratedName`; this is display wiring plus making sure non-meaning names simply omit the gloss.

---

## Coverage — a small concept top-up

**GUIDE.** A few of your examples aren't in the packs yet: **waterfall**, **beauty**, a generic **bird**; **victory** lives in `warrior` not `core`. For evocative default names, the everyday name-worthy concepts should be reachable from `core` or an obvious pack.

**SPEC.** Add a modest set of evocative concepts to `core` (beauty, grace, victory, waterfall, dawn-already-present, bird, blossom, tide, ember, echo…) in the concept-pack data-build. This dovetails with the concept-**tag** build the classes spec already requires (flora/tree/hearth/strength/…): do them in one pass over the concept data.

---

## Reconciliation with earlier specs

- The classes spec assumed `generation` defaulted to sound; it now defaults to **mixed** at the culture level, and a class's `generation` still overrides. Update that one line when both land.
- `rootPolicy` (favour/lock by pack/tag/concept) is what `assembleMeaning` consults for root selection — the two specs meet exactly here.
- `refreshSamples` (page spec) now produces meaning-bearing specimens, so the page shows names *with* meanings by default.

---

## Data & function summary

| Symbol                                | Where                | Purpose                                                                       |
| ------------------------------------- | -------------------- | ----------------------------------------------------------------------------- |
| `Culture.defaultGeneration`           | engine.ts            | "sound" \\| "meaning" \\| "mixed" (default mixed)                             |
| `assembleMeaning(rng, culture, opts)` | engine.ts            | replaces `assembleSemantic`; 1–2 roots, class ending applied, policy-filtered |
| `generateBatch(…, mode?)`             | engine.ts            | mode optional; falls back to culture/class default                            |
| `GeneratedName.roots` / `className`   | engine.ts            | etymology of record + class tag; gloss persists through drift                 |
| concept top-up + tags                 | data (concept packs) | evocative concepts (waterfall, beauty, victory…) + the tag layer, one pass    |
| meaning display                       | main.ts              | show "meaning" beside pronunciation in batches, inserts, and page samples     |

---

## Build order

1. `assembleMeaning`: 1–2 roots + class-ending application + joinery repair (the core change).
2. `Culture.defaultGeneration` = mixed; `generateBatch` mode fallback.
3. Wire `rootPolicy` into `assembleMeaning` (needs the tag build from the classes spec, so do the concept top-up + tags here).
4. Surface meaning in every UI surface; preserve `roots`/`gloss` as etymology.
5. Confirm drift keeps the etymology when it lands.

---

## Two decisions worth settling

- **Single-root vs compound balance.** Default: register-weighted (ancient → more compounds/longer; modern → more single roots). Fine as-is, or do you want a fixed feel?
- **Meaning for all categories, or people only?** Places and houses are often meaningful too (Riverrun, Winterfell), so the default is meaning-bearing for all three, with houses/places leaning on their own root domains. Say if you'd rather keep meaning to personal names for now.
