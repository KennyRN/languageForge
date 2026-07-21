# Spec — Name classes (gender, and beyond)

*Covers QoL point 4. Today there is no gender at all — personal names are undifferentiated, so you can't tell a masculine name from a feminine one. This restores two things the build dropped: Step 5's gender-ending maps and the "class/archetype bends the culture" lens. Decision locked: ship **feminine / masculine / neutral**, and let the user add their own classes. Everything here is per-culture and never forced. Written against the real code (`engine.ts`, `main.ts`).*

---

## The core idea

A class is a named **ending signature** — a small set of endings that names of that class draw from. That's it, at heart. It works because of the ending-primacy principle we already validated: endings carry most of a name's "feel," so swapping the ending pool is enough to make a class audibly distinct while the starts and middles keep every class sounding like one language. No new sound data, no new generator — just a different slice of the same machinery.

Gender is simply the three signatures the seed ships with. "Warriors" or "outsiders" are signatures you add. The distinction male-vs-female becomes concrete: the feminine signature leans vowel-final and soft, the masculine leans consonant-final and hard, the neutral is the base mix — all generated inside the culture's own phonotactics and passed through the Step 6 gates, so they diverge in feel without breaking cohesion.

---

## Part 1 — The model

**GUIDE.** A class owns an ending signature and, optionally, a couple of light modifiers: a concept pull (so a warrior class leans on the warrior pack in meaning-mode) and a length lean. Nothing else is required.

**Flat list, one class per name (decision).** Classes are a single per-culture list; a name belongs to one class. This matches how you framed it ("add other genders… so some classes can be built") and keeps config minimal. The alternative — crossing a gender axis with a role axis to get "feminine warrior" — is more powerful but doubles the setup, so it's noted as a future option rather than built now. If you want a feminine warrior naming style today, it's just another class.

**SPEC.** A class now bundles three independent knobs — an **ending signature**, a **root policy**, and a **generation preference** — plus light length/source modifiers:

```ts
interface NameClass {
  id: string;
  label: string;             // "feminine", "warriors", "feminine warrior"…
  kind: "gender" | "class";  // affects only defaults + UI grouping

  // 1. endings — where the signature comes from
  endingSource: "generate" | "inherit" | "manual";
  endings?: string[];        // manual: hand-authored (consonant-initial, per joinery)
  inheritFrom?: string;      // inherit: reuse another class's endings by id (e.g. reuse "feminine")

  // 2. roots — which meanings this class draws on
  rootPolicy?: {
    mode: "favour" | "lock"; // favour = weight up, others still possible; lock = restrict to these only
    include: string[];       // pack names, tag names, or individual concepts
    exclude?: string[];      // subtracted from include (e.g. include "flora", exclude "tree")
  };

  // 3. generation — do names of this class carry meaning?
  generation?: "sound" | "meaning" | "mixed"; // default inherits the culture's default

  lengthLean?: number;       // -1 shorter … +1 longer
  sourceLanguageId?: string; // point-5 residue hook (Part 6)
  note?: string;
}
// Culture gains:  classes: NameClass[]
```

Endings still obey joinery and pass the gates however they're sourced. The `rootPolicy` only bites when names carry meaning (see the generation note below), which is exactly what lets a class like "feminine" lean on flowers and hearth roots.

---

## Part 1b — Roots by class: favour, lock, and the tag layer

**GUIDE.** You want gender (and class) to steer *which kinds of roots* a name is built from: women toward flowers, plants and hearth; men toward forest, sea and strength; and combinations like a feminine-warrior class that takes feminine endings but warrior roots. Two things make that work.

**Favour vs lock.** A class's `rootPolicy.mode` is either *favour* (those root domains are weighted up, but others can still appear — so not every woman is literally named "Rose") or *lock* (names of this class draw only from the listed domains). You asked for both; both are here.

**Tags, because packs are too coarse.** "Flowers and plants but not trees" cuts across the existing packs — our `forest` pack mixes oak (a tree) with fern and moss. So concepts gain **tags** finer than packs, and a policy's `include`/`exclude` can name a pack, a tag, or an individual concept. "Flora but not trees" becomes `include: ["flora"], exclude: ["tree"]`. A first tag vocabulary (a concept may hold several): `flora, tree, flower, herb, hearth, kin, strength, war, craft, trade, sacred, beast, sea, water, weather, sky, celestial, stone, earth, forest, wild, light, dark, death, fortune, virtue`. Authoring these onto the concept data is the companion data-build (see the closing note), exactly parallel to how the drift packs followed the element packs.

**The meaning point — the one thing to be deliberate about.** Standard personal names today are generated in *sound mode*: pure phonetic assembly (start + middle + end) that never touches roots. So for gendered roots to actually surface, those names must carry meaning. That's why a class has a `generation` preference. Set a class to `meaning` (or `mixed`) and its names are built from its permitted roots — so "standard feminine names" can genuinely be flower-and-hearth names — while an unmarked class can stay `sound` and remain opaque. `favour` + `mixed` is the sweet spot for most gendered naming: meaningful often, but not every name a transparent noun, and drift can further wear the meaning down. This is your call per class; the model supports every combination.

**Worked example — building a feminine warrior.**

- *feminine* (shipped): `endingSource: generate` (soft lean); `rootPolicy: { favour, include: ["flora","hearth","virtue"], exclude: ["tree"] }`; `generation: mixed`.
- *masculine* (shipped): generate (hard lean); `favour ["forest","sea","strength"]`; `mixed`.
- *feminine warrior* (you add): `endingSource: inherit, inheritFrom: "feminine"` — reuses the feminine endings verbatim; `rootPolicy: { lock, include: ["war","strength"] }`; `generation: meaning`. The result reads unmistakably feminine by ending yet martial by meaning, standing apart from ordinary feminine names — which is exactly the composition you described.

**SPEC.** `rootPolicy.include`/`exclude` resolve against three namespaces in one list: pack ids, tag ids, and literal concepts; resolution expands packs and tags to their concept sets, unions `include`, subtracts `exclude`. In `favour` mode the resolved set gets capped-multiplicity weighting (Step 4's mechanism); in `lock` mode the culture's root pool is filtered to the resolved set for this class's names. Policy applies only when a name is generated in `meaning` or `mixed` mode. If `lock` leaves too few roots to build a name, the engine falls back to `favour` for that name and flags it once (a lock that's too tight is an authoring warning, not a crash).

---


**GUIDE.** A new culture is born with feminine / masculine / neutral already populated, so gender works out of the box. The feminine and masculine signatures are generated with a phonaesthetic lean — soft and vowel-final for one, hard and consonant-final for the other — within the culture's phonotactics, so they sound like the same tongue's two genders rather than two languages. Gender marking is on by default but is one toggle to remove (some cultures don't gender-mark; then only "neutral" remains and personal names are unmarked).

**SPEC.** `seedGenderClasses(culture)`:
- `feminine`: endings generated with a **soft** lean (liquids/nasals, vowel-final) — e.g. ‑lia, ‑mira, ‑nae; `rootPolicy: { favour, include: ["flora","hearth","virtue"], exclude: ["tree"] }`; `generation: mixed`.
- `masculine`: endings generated with a **hard** lean (stops, consonant-final) — e.g. ‑dor, ‑kan, ‑roth; `rootPolicy: { favour, include: ["forest","sea","strength"] }`; `generation: mixed`.
- `neutral`: the culture's base ending mix; no root policy; `generation` inherits the culture default.

All gate-checked and stored. A `gendered: boolean` convenience (default true) toggles the pair in/out. The soft/hard leans reuse the existing phonaesthetic code; the root defaults are the sensible starting point you described and are fully editable. Nothing new sound-wise.

---

## Part 3 — Custom classes

**GUIDE.** You add a class by naming it and picking a lean (hard / soft / long / short / exotic); the plugin generates a distinctive ending signature for it — least effort in. Or hand-pick the endings if you want control. Two optional extras: a concept pull (tick "warrior" and meaning-mode names for that class lean martial) and a length lean. Examples you named — leaders, warriors, outsiders, slaves, religious — are all just this.

**SPEC.**
- `addClass(culture, label, lean?)` → generates an ending signature under `lean` (same generator as the gender defaults), gate-checked.
- `editClass` / `removeClass`; `regenerateClassEndings(class, lean)` to reroll a signature.
- `conceptPacks` reuses the capped-multiplicity weighting from Step 4 — a class doesn't add concepts, it raises the frequency of an existing pack's concepts for names of that class.

---

## Part 4 — Generation integration

**GUIDE.** The Generate modal gains a class picker, defaulting to **unmarked** (base endings, sound-mode — current behaviour, nothing forced). Pick a class and personal names take its endings, its root policy, its generation preference, and its length lean together.

**SPEC.** `generateBatch(culture, category, n, mode?, className?)`. When `category === "personal"` and `className` is set, the assembler: swaps `elements.end` for the class's resolved endings (generated, inherited, or manual); uses the class's `generation` preference over the passed `mode` when the class sets one; applies `lengthLean`; and, when generating with meaning, filters or weights the root pool per `rootPolicy` before assembling. `GeneratedName` records its `className` (and, in meaning-mode, its `gloss`) so batches group and star per class. Unmarked or non-personal categories behave exactly as today.

---

## Part 5 — On the language page

**GUIDE.** The `## Name classes` heading stubbed in the page spec fills in: each class with its endings, what its names lean on (root policy), whether it carries meaning, and a live specimen or two; buttons to add, edit, remove, reroll endings, pick an ending source (generate / inherit-from / manual), set the root policy, and toggle gender marking.

**SPEC.** Render inside the managed block: `| Class | Endings | Roots (favour/lock) | Meaning | Sample |`. The class editor exposes `endingSource` (with an inherit-from picker listing sibling classes), the `rootPolicy` builder (include/exclude across packs, tags, and concepts), and the `generation` preference. Per-class specimens refresh when that class changes; the culture's base `sampleNames` are untouched.

---

## Part 6 — Forward hook: where point 5 lands

**GUIDE.** This is the seat for the invader-adopts-the-local-tongue scenario. When a population takes up a local language, the elite often keep a residue of their ancestral names while everyone else's names go fully local. That's a **class whose ending signature is sourced from another language** — the leaders/nobility class draws its endings from the invader's original tongue, not the local one.

**SPEC.** The optional `sourceLanguageId` on `NameClass` is the wiring: unused now, but when adoption is built (in the Gap 3 / directed-contact work), a class can point at a related culture and draw (a reshaped slice of) its endings as the signature. One optional field today buys the whole residue mechanic later.

---

## Data & function summary

| Symbol                                                              | Where                | Purpose                                                                                 |
| ------------------------------------------------------------------- | -------------------- | --------------------------------------------------------------------------------------- |
| `NameClass` interface                                               | engine.ts            | endings (generate/inherit/manual) + root policy + generation preference + length/source |
| `Culture.classes: NameClass[]`                                      | engine.ts            | per-culture class list                                                                  |
| `Culture.gendered: boolean`                                         | engine.ts            | convenience toggle for the gender pair (default true)                                   |
| `seedGenderClasses(culture)`                                        | engine.ts            | populates feminine/masculine/neutral with default endings + root policies               |
| `resolveRootPool(culture, policy)`                                  | engine.ts            | expands packs/tags/concepts, applies include−exclude, returns the class's root set      |
| `addClass` / `editClass` / `removeClass` / `regenerateClassEndings` | engine.ts            | custom-class lifecycle                                                                  |
| `generateBatch(…, className?)`                                      | engine.ts            | class-aware generation: endings + root policy + generation mode                         |
| `GeneratedName.className`                                           | engine.ts            | tags each name with its class                                                           |
| concept **tags**                                                    | data (concept packs) | finer-than-pack domains — the companion data-build (flora/tree/hearth/strength/…)       |
| class picker + class editor                                         | main.ts              | Generate modal + the `## Name classes` page section                                     |

---

## Build order

1. `NameClass` + `Culture.classes` + migration (existing cultures get gender classes on load).
2. Concept **tags** data-build + `resolveRootPool` (needed before root policy can bite).
3. `seedGenderClasses` (endings + default root policies) and the `gendered` toggle.
4. `generateBatch(…, className?)` — endings, root policy, generation mode — plus the Generate-modal class picker.
5. Custom-class lifecycle + the page editor (ending source incl. inherit-from, root-policy builder, generation).
6. Leave `sourceLanguageId` in place, unused, for the point-5 build.

Migration note: on load, any culture without `classes` gets `seedGenderClasses` run once. `refreshSamples` is unaffected — classes are a lens, not a change to the base element set.

---

## Decisions locked

- Ship **feminine / masculine / neutral**; user adds more. (Your pick.)
- **Flat** class list, one class per name; crossing gender × role is a future option — though inherit-from + root policy already lets you *build* a "feminine warrior" as its own class, which covers the practical need.
- Root association supports both **favour** (weight up) and **lock** (restrict to), by **pack, tag, or concept**, with **exclude** (so "flora but not trees" works).
- Endings can be **generated, inherited from another class, or hand-authored**.
- Gendered roots require **meaning-bearing generation**, so classes carry a `generation` preference; unmarked classes stay sound-mode and opaque.
- Classes are **personal-name-scoped** for v1; gender marking is **per-culture and removable**.
