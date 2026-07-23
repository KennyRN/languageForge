# Spec — Naming-tradition presets (content + structure)

*What you originally meant by "standard packs": presets that capture how a real culture named its people — the concepts they drew on **and** the way names were built. Content reuses the tagged concept system just built; structure is a new **naming-pattern** layer. Sound is deliberately out of scope (that's the future phonology-preset addition). Written against the real code (`engine.ts`).*

---

## The orthogonality that keeps this clean

Three independent axes, chosen separately:

1. **Sound** — how the language sounds (the culture's phonology: minted forms, elements). Already exists; real-world *phonology presets* are the future addition.
2. **Content** — what names are drawn from (concept domains). The tagged concept packs, via root policy.
3. **Structure** — how a name is assembled (compound, patronymic, theophoric…). **New here.**

A naming tradition sets **2 and 3**; the culture supplies **1**. So Old Norse naming produces dithematic, patronymic, beast-and-war-themed names *in whatever the culture sounds like*. Combine with a Germanic sound preset later for the full picture; until then the structure and content alone already read unmistakably Norse.

---

## Layer 1 — Content (reuses what exists)

**GUIDE.** A tradition favours or locks concept domains via the tag system — Norse leans beasts/war/strength/gods, Roman leans virtues/traits, Puritan English leans sacred/virtue. Nothing new; it's a `rootPolicy` bundled into the preset.

**SPEC.** `NamingTradition.contentPolicy: { favour?, lock?, exclude? }` over packs/tags/concepts (Part 1b of the classes spec). When a tradition is active on a culture, its content policy drives personal-name root selection, overriding the culture's default pack mix for people (place/house generation is untouched).

---

## Layer 2 — Naming patterns (the new mechanism)

**GUIDE.** The structure is what makes a tradition recognisable. A pattern is a template the generator fills from the tradition's content and its particles, then renders in the culture's sounds. The library:

- **single** — one meaningful root + class ending. *Bjǫrn* ("bear"), *Faith*.
- **dithematic** — two welded elements, the second drawn from a gendered theme set. *Sig+rún* ("victory-secret", fem.), *Ead+weard* ("wealth-guard", masc.).
- **patronymic** — a given name plus a parent's name carrying an affix. *Haralds+son*, *Ni+dóttir*, *Mac+*, *‑ovich*. Needs a parent given-name (generated on the fly, seeded).
- **theophoric** — a sacred/deity element bound to a relation (gift / servant / beloved / protected / praise). *Theo+doros* ("god-gift"), servant-of-the-god forms.
- **epithet** — a given name plus a descriptive byname from a trait/appearance/deed. *[name] the Red*, *[name] Ironhand*.
- **circumstance** — a name describing birth: day, season, birth-order, or the emotion around it. (Common well beyond Europe; included for later traditions.)

**SPEC.** A `NamingPattern = { type, weight, particles? }`. A tradition holds a weighted list; generation picks one per its weight. Each pattern is a small assembler:

- resolve the needed root(s) via `contentPolicy` (+ the active gender's themes), minting forms from the culture's phonology exactly as `assembleMeaning` already does;
- apply the pattern's particles/affixes (patronymic suffix, theophoric relation word, epithet article) from the tradition;
- repair seams per joinery, gate, register.

Patronymic parent-names: generate a parent given-name in the same tradition (seeded off the child's seed so it's stable), attach the tradition's affix and any genitive. `GeneratedName` gains structured parts — `given`, optional `patronymic`, optional `epithet` — plus the `gloss` that spells the structure out ("victory-secret, daughter of Harald").

---

## Layer 3 — Place and house conventions

**GUIDE.** Traditions are often *most* recognisable in their places and houses — the ‑by/‑ton/‑fell of a map, the Mac‑/‑ov/gens of a lineage. Both reuse the same machinery (content policy + particles + the culture's sounds); they just add their own pattern types and, for places, a set of tradition-specific geographic generics keyed to place type.

**Place patterns.** A place name is usually a descriptive element welded to a **generic** that marks what kind of place it is, and the generic is the tradition's fingerprint:

- **descriptive-generic** — [descriptive/quality root] + settlement generic. *north + ‑by*, *stone + ‑ton*.
- **feature-descriptive** — [colour/quality/nature root] + feature generic. *black + ‑fell*, *red + ‑combe*.
- **possessive-settlement** — [personal name] + generic ("X's homestead"). *Beorma + ‑ham* → Birmingham.
- **theonymic-place** — named for a deity or temple (pairs with the theophoric particles).

The generics live in `toponymicGenerics`, keyed by **place type** (continent / kingdom / settlement / feature — the same types the framework's Places-as-first-class work defines). This dovetails with that Gap-4 work: features draw on the oldest, deepest generics; new settlements on the shallowest. Until place types are built, a tradition still ships a settlement set and a feature set, and the engine uses those two.

**House patterns.** A house/family name is one of a few tradition-bound kinds:

- **gens** — a distinct hereditary surname root with a family suffix (Roman ‑ius/‑ia). The strongest family-name traditions.
- **clan-patronymic** — a founder bound to a clan prefix (Gaelic Mac‑/Ó‑, "sons of").
- **locative** — a particle plus a place ("of/von/de [place]").
- **occupational** — a trade root (Smith, Baker).
- **founder-line** — descendants-of an ancestor (Norse ‑ung/‑ingar, Greek ‑idai, Anglo-Saxon ‑ingas).

**SPEC.** Place and house patterns are `NamingPattern`s under `patterns.place` / `patterns.house`, each resolving roots via `contentPolicy` (a place descriptive still comes from the tradition's content), applying the relevant generic/particle, minting forms from the culture's phonology, and gating as usual. Personal names optionally carry a house/patronymic component per `surnameRate`, drawing from `patterns.house` (or the patronymic particle) — which is why a Roman personal name naturally acquires its gens and a Gaelic one its clan: the house pattern *is* the surname.

---


```ts
interface NamingTradition {
  id: string;
  label: string;              // friendly: "Old Norse naming"
  subtitle: string;           // the tradition/family: "Norse · Scandinavian"
  contentPolicy: RootPolicy;  // favour/lock/exclude over packs, tags, concepts
  genders: Record<string, {   // feminine / masculine / neutral / custom
    themes?: string[];        // gendered dithematic deuterothemes / preferred domains
    endings?: string[];       // optional ending signature (else the class default)
    patronymicAffix?: string; // "-dóttir", "-son", "-ovna"…
  }>;
  patterns: {                 // weighted structures, keyed by category
    personal: NamingPattern[];
    place?: NamingPattern[];
    house?: NamingPattern[];
  };
  toponymicGenerics?: Record<string, { form: string; meaning: string }[]>;
                              // per place_type: settlement/feature/… generic elements (-by, -ton, -fell)
  particles?: {
    theophoric?: { relations: Record<string,string>; order: "element-first" | "relation-first" };
    epithet?: { article?: string; position: "before" | "after" };
    patronymic?: { of?: string; genitive?: string };
    house?: { kind: "gens"|"clan"|"locative"|"occupational"|"founder-line"; affix?: string; prefix?: string; of?: string };
  };
  surnameRate?: number;       // chance a personal name also carries a house/patronymic component
  notes?: string;
}
// Culture gains:  tradition?: string   // id of an active tradition, optional
```

A tradition can also **seed the culture's classes**: applying it populates feminine/masculine with its themes, endings, and patronymic affixes, so gender and tradition line up without separate setup.

---

## How generation runs with a tradition

`generateBatch(culture, "personal", n, mode?, className?)` when `culture.tradition` is set:
1. pick a `NamingPattern` by weight;
2. resolve roots via `contentPolicy` + the class's gender themes;
3. mint forms from the culture's phonology; assemble per the pattern with its particles;
4. gate + register; attach structured parts and a structural gloss.

Unmarked cultures (no `tradition`) behave exactly as the meaningful-names spec defines. Places and houses ignore the tradition unless it declares place/house patterns (future).

---

## Reconciliation with earlier specs

- **Meaningful-names spec:** `dithematic` and `single` patterns *are* `assembleMeaning` at 2 and 1 roots — the tradition just selects which, and adds the affixing patterns on top. No conflict; the tradition is a higher-level chooser.
- **Classes spec:** a tradition's `genders` populate/override the class system (endings, themes, patronymic affix per gender). Root policy is the shared meeting point again.
- **Contact/adoption (future point 5):** patronymics and theophorics are where an invader-residue class will show — the elite keeping an ancestral patronymic or god-element while the population's content goes local. The `sourceLanguageId` hook already reserved on classes feeds this.

---

## Build target — the European first set

To be built next as data (`naming-traditions.json` + validator/demo), one entry per tradition. Each line notes personal · place · house:

- **Old Norse** — dithematic + patronymic (‑son/‑dóttir) · settlements ‑by/‑thorpe/‑garðr, features ‑fell/‑dalr/‑vík/‑foss · house founder-line (‑ungar). Content: beast, war, strength, sacred, rank.
- **Anglo-Saxon (Old English)** — dithematic, family alliteration · settlements ‑ton/‑ham/‑bury, features ‑ford/‑mere/‑combe · house founder-line (‑ingas). Content: virtue, rank, war, sacred.
- **Roman (Latin)** — given + gens + trait cognomen · settlements Colonia‑/Castra‑/Portus‑, features Mons‑/Flumen‑/Silva‑ · house **gens** (‑ius/‑ia). Content: virtue, beauty, nature.
- **Ancient Greek** — theophoric + dithematic + patronymic · settlements ‑polis/‑a, features Acro‑/‑oros/potamos · house founder-line (‑idai). Content: sacred, virtue, war, celestial.
- **Gaelic (Irish/Scottish)** — single + epithet · settlements Bally‑/Kil‑/Dun‑, features Inver‑/Glen‑/Ben‑/Loch‑ · house **clan** (Mac‑/Ó‑). Content: virtue, beast, sacred, nature.
- **Welsh** — single + patronymic (ap/ab) + epithet · settlements Llan‑/Caer‑/Tre‑, features Aber‑/Pen‑/Cwm‑/Nant‑ · house patronymic (ap). Content: nature, virtue, rank.
- **Slavic** — dithematic + patronymic · settlements ‑grad/‑sk/‑ovo, features ‑gora/‑reka/‑les · house **locative/gens** (‑ov/‑ski). Content: rank, sacred, war, virtue.
- **Puritan English** — single virtue-name (locked sacred + virtue) · settlements New‑/Mount‑/‑field (Providence, Concord) · house occupational/locative. Content: sacred, virtue.
- **Finnic** — nature single-roots + patronymic (‑poika/‑tytär) · settlements ‑la/‑kylä, features ‑järvi/‑joki/‑mäki/‑koski · house **occupational-nature** (‑nen). Content: nature, weather, beast, forest.

Each carries the honest caveat that it *evokes* a documented naming practice, not defines a people; presets are editable.

---

## Data & function summary

| Symbol                                   | Where     | Purpose                                                                |
| ---------------------------------------- | --------- | ---------------------------------------------------------------------- |
| `NamingTradition` interface              | engine.ts | content policy + gender conventions + weighted patterns + particles    |
| `NamingPattern` + pattern assemblers     | engine.ts | single / dithematic / patronymic / theophoric / epithet / circumstance |
| `Culture.tradition?: string`             | engine.ts | active tradition id (optional)                                         |
| `GeneratedName.given/patronymic/epithet` | engine.ts | structured parts + structural gloss                                    |
| parent-name generation (seeded)          | engine.ts | for patronymics/matronymics, stable per child seed                     |
| `naming-traditions.json` + validator     | data      | the European first set, demo-generated to prove they read right        |
| tradition picker                         | main.ts   | on the culture page + Generate modal                                   |

---

## Build order

1. `NamingPattern` types + the six pattern assemblers, reusing `assembleMeaning` for single/dithematic.
2. `NamingTradition` model + `Culture.tradition`; a tradition seeds/overrides classes.
3. Patronymic parent-name generation (seeded, stable).
4. `naming-traditions.json` — the European set — with a validator + a per-tradition demo (generate names, show gloss), the same way the element and drift packs were proven.
5. Tradition picker in the UI; structured-name display (given + patronymic + epithet + gloss).

---

## Decisions locked / open

- **Locked:** content + patterns (your pick); tradition sets content+structure, culture supplies sound; European traditions first; friendly label + tradition subtitle. **Places and houses are in scope** — each tradition defines settlement/feature generics and a house-name convention, keyed to place type where the Places-as-first-class work provides it.
