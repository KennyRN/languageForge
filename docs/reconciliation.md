# languageForge — Reconciliation: design vs build

*A precise gap list with fixes, checked against the uploaded code (`engine.ts`, `main.ts`, `starter-packs-v2.json`, `pack_validator.py`). Ordered by dependency: fixing Gap 1 is what makes Gaps 2–4 buildable, so the sequence matters. Each entry states what was **designed** (per `naming-system-framework.md`), what was **built**, the **impact**, and a concrete **fix** tied to real symbols.*

---

## Verdict in one line

The name-generation half is faithful and in places improved; the linguistic-depth half (drift, family, contact, place strata) was quietly compressed into generic stand-ins because one foundational data-build — the drift-pack library — was replaced by a placeholder. Restore that, and the dependent gaps become straightforward.

---

## A. Faithful — keep, do not regress

These are correct (some better than specced). The rebuild must not disturb them.

- **The Step 6 gates and the validator** (`gateName` in `engine.ts`, `pack_validator.py`, `gate-refinements.md`). This deepened the design correctly: sonorant finals, the named-waiver mechanism, element-level vs name-level collision split, the echo/stutter filter, throwaway-U. Treat `gate-refinements.md` as an accepted amendment to the framework's Step 6, not a deviation.
- **Stable minting** — a concept's form is fixed per culture, seeded (`mintForm`, `roots[]`). Matches the "export a real, reusable language" intent.
- **Familiar vs alien paths** (`samplePackElements` vs `buildProceduralElements`). This is exactly the seed design: enumerated pack path for familiar, procedural open-syllable path for alien.
- **Additive concept packs + capped weighting** shown as rare/normal/common/dominant (`applySemanticPacks`, `weightLabel`, `Root.weight`). Faithful to Step 4 and the additive-pack mechanic.
- **Reverse-seeding** (`reverseSeedCulture`, `detectMood`, `segmentPastedName`). Not in the original spec but a good-faith fit with rassaku's "work backwards from names you're attached to." Keep.
- **Learning loop** (`reinforce`, "More like starred"), **pronunciation hints** (`pronounce`, `syllabify`), **semantic mode with gloss** (`assembleSemantic`). All consistent with ending-primacy and dual-readability. Keep.

---

## B. Gap 1 — the drift-pack library (ROOT CAUSE, fix first)

**Designed.** A library of named drift packs grouped by effect family (softening/lenition, hardening/fortition, vowel-movement, compression, and contact packs), each an ordered sound-change ruleset selectable per derivation. The user explicitly wanted these as pickable presets with real choice, with the app supplying the linguistics. Governing law: erosion trends toward *easier* articulation.

**Built.** A single hard-coded array, `SOUND_CHANGE_RULES` in `engine.ts` (p→f, t→th, k→h, e→i, o→u, s→z, intervocalic b→v/g→gh, long-vowel simplification), applied as a random subset scaled by a single intensity (`driftWord`). One direction, no choice, no effect families.

**Impact.** Every language family in the app drifts the same way. There is no softening-vs-hardening selection, so a "Romance-soft" culture and a "Germanic-hard" culture are impossible to distinguish by drift. This is the stub that everything below fell over on.

**Fix.**
1. Introduce a `DriftPack` type: `{ id, effectFamily, direction, plainDescription, why, rules: SoundChange[] }`, where `SoundChange = { pattern, replacement, condition? }` and `rules` are **ordered** (applied in sequence, not as an unordered random subset — order is what makes a chain read as one historical process).
2. Replace the single `SOUND_CHANGE_RULES` constant with a keyed library `DRIFT_PACKS: Record<string, DriftPack>`. Author the starter set (sketch below). This is the exact data-build we ended on last session; it was skipped.
3. Change `driftWord`/`driftElementSet` to take a `DriftPack` (or an ordered list of stacked packs) instead of a bare intensity, applying its rules in order; keep intensity as a probability multiplier *within* the pack if you still want dialect/sister/distant to mean "how far along the chain."
4. Surface pack choice in `DeriveCultureModal` (`main.ts`) as a dropdown, defaulting to a sensible pack per mood so a user who doesn't care still gets a real result ("least effort in").

**Starter pack sketch** (author these as ordered rules; illustrative, not final):
- *Softening / lenition* (erosion family): intervocalic voiceless stops voice (p→b, t→d, k→g / between vowels); voiced stops spirantise (b→v, d→dh, g→gh); geminates simplify; final stops drop. Trends easier — obeys the law.
- *Compression / erosion*: unstressed medial vowels reduce then delete; long ceremonial forms clip; drop intervocalic h. Trends easier — obeys the law.
- *Vowel-shift*: chain-shift the long vowels (raise then diphthongise) without touching consonants. Systematic remap.
- *Hardening / fortition*: word-initial strengthening; final-obstruent devoicing. Systematic remap (see design note below).
- *Contact packs*: handled under Gap 3, since they operate on an edge, not a chain.

**Design note the rebuild should settle (an inconsistency in our OWN spec).** The framework states "drift always becomes easier, never harder," yet the pack library includes a *hardening* family — fortition is not strictly "easier." Resolve it by scoping the law: tag each pack `direction: "erosion" | "shift"`. **Erosion** packs (softening, compression) obey the ease law and are the safe default — worn forms come out more readable, not less. **Shift** packs (vowel-shift, hardening) are systematic, consistent remaps that need not ease articulation but must stay internally consistent. The gate still runs on the output regardless, so shift packs can't produce unreadable names.

---

## C. Dependent gaps (fix after Gap 1)

### Gap 2 — the 0/1/3/5 scale and the single-language-vs-family distinction

**Designed.** A `0 / 1 / 3 / 5` scale where the number selects **structure**: 0 = none, 1 = age one language in place, 3 = derive a family (mother→daughter→granddaughter), 5 = family + contact. Gaps 2 and 4 reserved as headroom. Levels 0–1 act on a *single* culture; 3–5 act on a *family*.

**Built.** `DriftLevel = "dialect" | "sister" | "distant"` with `DRIFT_PRESETS` = 0.15/0.4/0.7. These are three **intensities** of one derivation, not four structural modes. The single-vs-family distinction is gone; there is no "age one language in place" (level 1) — the only operations are derive-a-descendant and merge.

**Impact.** The structure the user deliberately chose is lost, along with the reserved headroom. More importantly, "am I ageing one tongue or growing a family?" — a real modelling decision — is no longer expressible.

**Fix.** Separate the two axes that got conflated:
- **Structure axis** (restore): a `driftMode` of `none | age | family | family-contact`, mapping to the 0/1/3/5 labels. `age` runs the drift pass on the culture *in place* (level 1) producing archaic+modern forms without creating a new node; `family` enables `deriveCulture`; `family-contact` additionally enables the contact graph (Gap 3).
- **Intensity axis** (keep): reuse the existing `dialect | sister | distant` as *how far* a given derivation drifts along its chosen pack. This is a good reinterpretation of what's already built — nothing wasted.
- Keep 2 and 4 unused but reserved, exactly as specced.

### Gap 3 — directed contact graph flattened into a symmetric merge

**Designed.** Contact as **directional**: a `ContactEdge` with donor→borrower, `contact_type` (prestige | substrate | adstrate), `strength`, `domains[]` (which semantic fields cross), a `reshaping_ruleset` (loanwords worn to the borrower's phonotactics), and prestige-exonym respelling (the Confucius mechanic). Substrate edges bias borrowing toward `place-features`, so conquered-language names survive in the landscape.

**Built.** `mergeCultures(parents, …)` pools phonology symmetrically from all parents and blends shared-meaning roots into hybrid forms, then runs a light drift pass. No direction, no prestige/substrate, no domains, no exonyms.

**Impact.** Conquest and trade — the entire historical layer — reduces to "average the languages." The richest showcase of the family system (a superstrate sitting over a substrate) can't be expressed.

**Fix.**
1. Add the `ContactEdge` model as specced in the framework; drive borrowing from edges rather than a symmetric pool.
2. A borrowing event = take a donor root/name → apply the borrower's phonotactic filter (reuse `gateName`'s onset/joinery logic) → optionally apply a prestige-exonym respelling (reuse a small `DriftPack` from Gap 1) → tag `loan-origin`.
3. Make `contact_type: "substrate"` bias its `domains` toward place-features, wiring into Gap 4.
4. Keep `mergeCultures` if you like it as a distinct "creole / meet-in-the-middle" operation, but rename it (`creoleCultures`) so it isn't mistaken for the directional contact model — an adstrate/trade-creole is one legitimate edge type, not the whole of contact.

### Gap 4 — places demoted from first-class to a flat category

**Designed.** `category = place` with `place_type ∈ {continent, kingdom, settlement, feature}`, each with its own `length_profile`, `naming_source` bias, and **its own default `drift_depth`** — so features resolve to older strata than new settlements. This was an explicit decision, chosen precisely so family history could surface in the landscape.

**Built.** `Category = "personal" | "house" | "place"`. `place` is one flat bucket: no sub-types, no per-place drift depth (`engine.ts`; confirmed no `continent`/`feature`/`settlement`/`kingdom`/`place_type` anywhere).

**Impact.** The single best demonstration of the whole family/contact system — a map whose rivers keep the mother tongue while its cities carry the daughter or the conqueror's tongue — cannot be produced.

**Fix.**
1. Add `placeType` and give each a default `driftDepth` (features deepest/oldest, new settlements shallowest/modern).
2. At generation, resolve a place name at the drift depth for its type — deep types draw on ancestral forms (or substrate loans from Gap 3), shallow types on the modern language.
3. This is the payoff wiring: Gap 3's substrate edges + Gap 4's deep feature depth = rivers and peaks that visibly predate the people. Build 3 and 4 together.

---

## D. Smaller gaps

### Gap 5 — titles dropped from the personal/house/title layering

**Designed.** Layering into personal / house / **title**, titles signalling rank/institution.
**Built.** `Category = personal | house | place`; `place` took the third slot, `title` is absent.
**Fix.** Titles and places are different axes and shouldn't share a slot. Make `Category` hold all four (`personal | house | title | place`), each bound to its own pattern templates (Step 3). Titles use the formal/institutional templates.

### Gap 6 — etymological vs phonetic spelling toggle absent

**Designed.** `spelling_mode ∈ {etymological, phonetic}` on drift output — preserve visible roots vs respell to the eroded pronunciation.
**Built.** Not present; `driftWord` respells unconditionally.
**Fix.** Add a `spellingMode` flag consumed at drift output: `etymological` keeps the pre-drift compound visible (good for spotting cognates), `phonetic` writes the worn form. Cheap once Gap 1's pack pipeline exists.

---

## E. Suggested sequence

1. **Gap 1 — drift-pack library.** Nothing else works properly until drift is directional and pickable. Author the packs, add the `DriftPack` type, retire `SOUND_CHANGE_RULES`, settle the erosion-vs-shift design note.
2. **Gap 2 — restore the structure scale.** Split `driftMode` (structure) from intensity (keep dialect/sister/distant). Adds level-1 "age in place."
3. **Gaps 3 + 4 together — directed contact + place strata.** They interlock; substrate loans need somewhere to surface, and deep place types are that surface.
4. **Gaps 5 + 6 — titles and the spelling toggle.** Small, independent, do last.

Throughout: the gates (`pack_validator.py`, `gateName`) run on all new output unchanged — they are the safety net that lets shift packs and loanword reshaping be adventurous without producing unreadable names.

---

## Cross-reference

- Full design: `naming-system-framework.md`
- Accepted Step 6 amendments: `gate-refinements.md` (keep)
- Data under validation: `starter-packs-v2.json` → `pack_validator.py` → `data.ts` (this pipeline is correct; extend it with a `drift-packs.json` validated the same way)
