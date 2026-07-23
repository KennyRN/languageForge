# Fantasy Naming-System Framework

*Working draft. A framework for a plugin that produces real-sounding fantasy names and languages, with the user doing the least work possible.*

---

## How to read this document

Every stage is written in two layers, clearly separated:

- **GUIDE** — the reasoning a worldbuilder applies. Plain language, no engineering.
- **SPEC** — the rule an engine encodes. What the plugin actually does under the hood.

You can read only the GUIDE lines and understand the whole system. The SPEC lines are for building it.

---

## Founding principle

**Least effort in, real language out.** The plugin does the linguistics *for* the user and hands back genuine, reusable artefacts — not throwaway scaffolding. A user should be able to pick a few traits and receive a coherent language and a set of names that sound like they belong to one history. Every heavier feature is an opt-in dial layered on the same core engine.

The system degrades gracefully: at its default settings it is simple descriptive naming with no drift and no family machinery; at full stretch it derives whole language families with contact between them. Same engine throughout — only the scope widens.

**The 26-letter constraint.** Whatever sounds a language uses internally, the output is written in the 26 letters of the Latin alphabet, and it must transliterate cleanly into them. A sound system that cannot be written so a reader guesses the pronunciation is a failed one, however elegant on paper. This is not a limitation to work around — it is the hard boundary the whole engine serves, and it is why the readability gate (Step 6) is a first-class part of generation rather than a cosmetic afterthought. (Source: rassaku Part II, learned the hard way from an 11-vowel first conlang that would not romanise.)

**Generate-then-filter, not generate-perfect.** No generator produces usable names every time; a realistic target is that a majority of output is usable and the rest is filtered out. The engine therefore always generates a batch and scores it against the gates, keeping the passers — it does not try to produce one guaranteed-perfect name in a single pass. (Source: rassaku's "Decent Fantasy Name Generator", which aimed for 50%+ usable output.)

---

## Two cross-cutting concepts

These sit above every step and shape all of them.

### Layering — a name is not one thing

**GUIDE.** A name belongs to a *category*, and each category behaves differently:

- **Personal names** stay light and easy to speak in dialogue.
- **House / clan names** carry the heavier historical texture.
- **Titles** signal rank or institution before they signal personality.
- **Place names** are their own category (see Step 2 and the Places section).

A world where all four "come from the same bucket" feels flat. Layering is what stops a setting sounding monotonous.

**SPEC.** Every generated name carries a `category` tag (`personal | house | title | place`) and a `layer_origin` tag (`core-culture | class/role | frontier`). Category selects which patterns and roots apply; layer_origin records where in the system the name came from.

### Dual readability — the name must read twice

**GUIDE.** Every name must survive two independent tests:

- **Silent** — a reader parses it instantly on the page, without tripping mid-sentence.
- **Aloud** — it can be spoken cleanly, for audiobooks and for tabletop use where a DM says it and players hear it.

A name can pass one and fail the other. Both are hard gates. The usual culprits for failure are stray apostrophes and consonant clusters with no obvious pronunciation.

**SPEC.** Every candidate must pass both `silent_readability` and `aloud_readability` before it is returned (scoring defined in Step 6).

---

## Step 1 — Define the cultures and their layers

**GUIDE.** List 3–5 core traits per culture: environment, values, technology level. Then run the layering pass — for each culture, decide how its *personal*, *house*, and *title* names differ from one another. Then let *class or archetype* bend the baseline: a disciplined city's wizard keeps the local rhythm but adds ceremonial phrasing; an oath-bound order favours public, formal names. Finally, reserve **frontier zones** — borderlands, ruins, conquered lands, trade routes — where unfamiliar names are allowed *because they have a route in*, not because they are random.

**SPEC.** A `culture` object holds its traits, its three sound rules (Step 2), its root set (Step 4), and three sub-profiles (`personal`, `house`, `title`). `class` and `archetype` are *modifiers* that transform a base profile rather than replacing it. `frontier` is a flag that loosens phonotactic constraints by a controlled margin and requires a stated route of entry.

---

## Step 2 — Sound palette: a proper "naming language"

**GUIDE.** Go beyond loose tendencies and define what sound *combinations* the language actually permits — its phonotactics. English allows "thr" but not "sxr"; your culture needs the same kind of rule. That single discipline is what makes names sound like one culture no matter how exotic. The practical shortcut is **three sound rules per culture**: (1) which sounds recur, (2) typical length, (3) what ending feels native. If you can explain a culture's names in one breath, it works.

Mood rides on top of this via the **phonaesthetics dial** (see the dedicated section) — a nudge on sound selection, never a rule that overrides what the phonotactics permit.

**SPEC.** Each culture defines a `phoneme_inventory` (permitted consonants and vowels), `phonotactics` (permitted onsets, codas, clusters), an optional `phonaesthetic_bias`, a `length_profile`, and `preferred_endings`. The generator composes names only from permitted phonemes in permitted arrangements. This is the core engine; everything else decorates it.

---

## Step 3 — Naming patterns, per category

**GUIDE.** Use pattern templates, but assign them *by layer*. Personal names use light templates (prefix + root + suffix). House names use older, territorial ones (name + clan). Titles use formal, institutional ones (title/epithet + name). This is what stops everything sounding the same.

Underneath the templates sits a concrete generation architecture, drawn from a working name generator. A name is built from three slots: a **start element**, an optional **middle element**, and an **end element**. The engine holds a list for each slot and assembles a name by picking one from each. Two findings make this work:

- **The ending matters more than the start.** Endings carry most of the "feel" of a name and vary more than beginnings. Shared endings are what make a set of names feel like one culture, while different starts keep them from being confused with each other (Ivyssa and Cordyssa read as kin without being mistakable). So the engine keeps a culture's *endings* relatively tight for cohesion, and lets *starts* range more widely for distinctiveness. This is the mechanical form of Nymia's "repetition over originality" and Step 5's consistency rule.
- **The seams must not create illegal clusters.** The joinery rule: start elements end in a vowel, end elements begin with a consonant, and middle elements end in a vowel (or in *r*/*n*, which lead cleanly into another consonant). Because the pieces interlock vowel-to-consonant, the generator never accidentally welds an unpronounceable cluster at a slot boundary. (Source: rassaku's name generator.)

**SPEC.** Patterns are templates bound to a `category`. Under each template, generation draws from three ordered element lists — `start[]`, `middle[]` (optional), `end[]` — with joinery constraints enforced (`start` and `middle` end vowel-final or in *r*/*n*; `end` is consonant-initial). Element-selection weighting is by list multiplicity (a phoneme listed *n* times is *n* times as likely) — a cheap, transparent way to skew frequency without extra code, and the mechanism the phonaesthetic dial rides on. `end[]` is deliberately smaller and more constrained than `start[]` to produce cohesion.

**Open- vs closed-syllable shortcut.** If a language uses only open syllables (every consonant followed by a vowel), the engine can build syllables procedurally from a consonants list × a vowels list, with no enumerated element lists at all — far cheaper to seed. Closed-syllable, English-like languages need enumerated elements because their permitted clusters are full of exceptions. This split matters for the seed engine: open-syllable proto-languages are the cheap, safe default.

---

## Step 4 — Word roots, with meaning and drift

**GUIDE.** A set of meaningful roots per culture is the backbone — roughly a hundred is enough to combine into effectively infinite names (established naming-language research puts the figure at about 100 "adjective" roots). Two things sit on top:

- **Meaning is a feature.** Roots recombine into visibly related families (a "dark" root and a "land" root appearing across several names on one map). Names can be generated *semantically* — ask for "silver + jewel" and compose from roots — as well as phonetically. Worked example from a naming language: roots for *strong* (-sa) and *spear* (zo-) combine into Zosa, "strong spear"; *lucky* (kama-) and *man* (-u) into Kamau. The user picks two meanings; the engine returns a name that means both.
- **Meaning encodes intent, not identity.** A name reflects what the *namer* (usually a parent) hoped for, not what the character is — a "gift of a beautiful girl" can grow up to be the villain. This gives the semantic layer dramatic use rather than just decoration.
- **Drift over time.** Let names erode as real ones do. This is the linguistic-drift engine, defined in full in its own section below.

Naming *source* is also selectable: literal, descriptive, or historical (named after a founder, family, or event).

**SPEC.** Each root is a `{form, meaning}` pair. Generation can run in `phonetic` or `semantic` mode. An optional `erosion` pass applies rule-based sound changes to age a name. `naming_source ∈ {literal, descriptive, historical}`.

---

## Step 5 — Naming rules (depth)

**GUIDE.** Rules that add texture: gender markers, generational patterns, earned or "true" names, forbidden/reserved names, length-as-status. The governing principle is **repetition over originality** — clustered endings and repeated stress patterns are what read as *designed*, not lazy. And because people shorten long names over centuries, status and age can surface as length and erosion.

**SPEC.** Rules are constraints and post-processors layered on the generator: gender-ending maps, reserved-name blocklists, status-to-length mappings, and consistency enforcers that *maintain* a target rate of shared endings per culture rather than suppressing repetition.

---

## Step 6 — Test: the dual gate

**GUIDE.** Generate a batch, mix cultures to check they are separable, read aloud, and check for collisions with real-world names and existing fiction. The failure taxonomy to check against: no "rule of cool" clusters, no stray real-world names from unrelated cultures, no register mixing (an ornate invented name beside a plain modern one). Split the readability check in two, per the dual-readability principle: silent and aloud.

The readability rules below are concrete enough to encode directly — most come from a conlanger's hard-won trial and error, and several are the difference between a name a reader glides over and one they stumble on:

- **Every digraph must earn its keep.** Write "dh" only if it is a distinct sound from "d"; "kh" only if distinct from "k". If it sounds the same as the single letter, drop the extra letter. Decoration that changes nothing just slows the reader.
- **Apostrophes must have a job.** Legitimate jobs: marking a glottal stop (Hawaiian *ki'n*), or separating two letters that would otherwise be misread as a digraph (*Bast'helm*, so it isn't read "th"). An apostrophe placed purely to look exotic is deleted.
- **Accent marks are a last resort.** Readers mangle them even when they carry real meaning, so use them only to rescue a genuine ambiguity — e.g. when a phonetic spelling accidentally matches an English word-shape (*Tale* read as "tail" instead of TAH-le), an accent (*Talè* / *Talé*) can disambiguate stress. Never sprinkle them for flavour.
- **Watch the "throwaway U".** English devoices unstressed middle vowels to a neutral "uh", and the brain does this automatically for most vowels — but *U* resists it and pulls the eye toward an unusual reading (*Ithasel* reads easily as ITH-uh-sell; *Ithusel* wants to become i-THOO-sil). A U in an unstressed middle syllable is a silent-readability risk unless that odd stress is what you want.
- **Vowel position isn't neutral.** At the *start* of a name, A/I/E read naturally, but U/O look off unless a consonant cluster follows (*Ornafel* works, *Onafel* doesn't); *AE* reads nicely, *Y* often doesn't (*Maelan* vs *Mylan*). Some starts need a following *R* or look broken (*Warner* vs *Waner*).
- **Connotation collision is real.** Beyond real-world and IP clashes, names can be "tainted" by association — a name that now reads as comic, dated, or cartoonish (a brooding romantic hero sharing his name with a cartoon cat) fails even if it is phonically fine. This is a distinct check from spelling collision.

**SPEC.** Automated gates a candidate must pass:

- `silent_readability` — penalise: apostrophes with no glottal/separator function; digraphs that duplicate a single-letter sound; accent marks; a *U* in an unstressed medial position; start-position U/O without a following cluster; start-position *Y*; ambiguous letter sequences; excessive length; and any letter combination with no obvious English pronunciation.
- `aloud_readability` — penalise illegal-for-English clusters and syllable-count spikes relative to the culture's profile.
- `distinctiveness` — measurably separable from sibling cultures (shared endings are fine and desirable; shared *whole shapes* are not).
- `collision_check` — against real-world names, known IP, **and unwanted connotation** (comic/dated/branded associations).
- `consistency` — matches the culture's own repetition targets, chiefly a shared-ending rate.

---

## The linguistic-drift engine

The heart of the "real-sounding" promise. One mechanism at four scales. A drift is an ordered set of sound-change rules; the level determines whether those rules age a single language or derive a whole family.

**GUIDE — the 0 / 1 / 3 / 5 scale.**

- **Level 0 — None.** Names generate from the culture's current phonology and roots. No transformation. The floor. *(Default for simple use.)*
- **Level 1 — Simple drift.** A single language, aged. One short erosion ruleset applied once, giving an archaic form and a worn modern form side by side. No family tree — just the sense that time has passed.
- **Level 3 — Family (mother → daughter → granddaughter).** Define a proto-language (mother tongue), then a sound-change chain per descendant. Apply a chain to the proto-roots to get a daughter; apply another on top to get a granddaughter. Because siblings share proto-roots, **cognates emerge automatically** — related cultures whose names visibly rhyme with each other's history without being identical. This is what "family groupings" buys.
- **Level 5 — Family plus contact.** Everything in 3, plus **language interaction**: languages borrow from each other, and loanwords are reshaped to fit the borrower's rules. Conquest, trade routes, and frontier zones become mechanical rather than cosmetic. Larger family groups with a contact graph laid over the family tree.

**Why 0 / 1 / 3 / 5 and not 1–5.** The gaps at 2 and 4 are reserved headroom — a future "family without contact, two generations only" could slot in at 2 without renumbering, and 6/7 stay open for a full areal (sprachbund) tier if ever wanted. Treat the empty numbers as reserved, not skipped.

**The governing law of drift: language always becomes easier, never harder.** Every erosion rule should trend toward easier articulation — sounds drop, clusters simplify, stresses regularise. A name that is hard to say *will* be worn smooth by its speakers over time; that is the engine of all sound change. This gives the drift packs a consistent direction and doubles as a readability ally: aged forms are, as a rule, more pronounceable than their roots, not less.

**Worked example of a daughter split (validates level 3).** In one documented naming language, a single proto-root meaning "man" evolved into *-ja* in one region and *-han* in another. So *Keilja* and *Keilhan* are the same name in two dialects — cognates diverged by regional sound change from a shared root. This is exactly what the level-3 descent chains produce automatically: apply two different chains to one proto-root set and you get sibling cultures whose names visibly rhyme with each other's history. (Source: rassaku Part III.)

**Etymological vs phonetic spelling (a drift output toggle).** When a compound erodes (*Ban-hoc* → pronounced "Bannock"), the written form can either preserve the original compound spelling or be respelled to match the new pronunciation — depending on whether the culture had a written standard *before* or *after* the sound change. The engine exposes this as a switch on drift output: `etymological` keeps the visible roots (better for readers spotting cognates), `phonetic` respells to the eroded sound (better for realism and readability). (Source: rassaku Part III.)

**SPEC.** `drift_level ∈ {0, 1, 3, 5}`.

- Levels 0–1 take a single `culture`.
- Levels 3–5 take a `proto_language` plus a set of `descent_chains` (each an ordered sound-change ruleset).
- Level 5 additionally takes a `contact_graph` whose edges carry contact packs.
- Output for any name above level 0 is `{proto_form, modern_form, drift_path}`, so lineage is inspectable.
- `spelling_mode ∈ {etymological, phonetic}` controls whether `modern_form` preserves visible roots or is respelled to the eroded pronunciation.
- The same rule-engine runs at every level; author-written and preset rules are treated identically once loaded.

---

## Seed-and-export: the proto-language as a deliverable

**GUIDE.** At levels 3–5 the user needs a mother tongue, but they should not have to build one by hand. The plugin **seeds** it:

1. The user picks a few traits (environment, values, tone) — five or six taps.
2. The app generates a coherent language: a phoneme inventory, a phonotactic ruleset, a starter set of 20–40 roots with meanings, and a length profile.
3. The app **exports** it as a self-contained language the user can name, save, re-open, and generate from directly — usable on its own even if they never touch drift, and feedable into higher levels as the mother tongue.

This makes the proto-language portable between projects and the family tree reproducible: one mother tongue can spin off several daughter cultures across different campaigns.

**SPEC.** `seed_proto_language(traits) → LanguageObject`, where

```
LanguageObject = {
  name,
  phoneme_inventory,
  phonotactics,
  roots[],            // {form, meaning} pairs
  length_profile,
  phonaesthetic_bias,
  lexicon_sample[]
}
```

The object is serialisable, human-readable, editable, and is the required input type for `descent_chains` at drift ≥ 3. A user may consume a `LanguageObject` at drift 0/1 and never engage the family system.

**Trait-to-phonology mapping (how the seed decides the sounds).** The seed turns a handful of trait choices into concrete phonology parameters. The single most important input is a **familiarity axis** (familiar ↔ alien), because it drives the choices that most affect readability:

| Trait input | Drives | Effect |
|---|---|---|
| **Familiarity** (familiar ↔ alien) | phonotactics + inventory source | *Familiar* reuses English-like phonology and permits closed syllables and clusters. *Alien* uses a small, restricted inventory with open syllables — which, counter-intuitively, is the safe way to sound exotic *and* stay readable (a 5-vowel open-syllable language like Japanese romanises cleanly, whereas a large exotic inventory does not). |
| **Mood / tone** (harsh, soft, grand, bright, exotic) | `phonaesthetic_bias` + phoneme weighting | Selects a dial preset (see phonaesthetics) and skews which permitted phonemes recur. |
| **Environment** (desert, mountain, forest, coastal, urban) | mood default + flavour roots | Suggests a mood (a harsh desert warleader culture leans hard) and seeds a few environment-appropriate root meanings. |
| **Register / age** (ancient ↔ modern) | `length_profile` + default `drift_depth` | Ancient → longer, more ceremonial forms and a deeper default erosion; modern → shorter, worn forms. |

From these, the seed fixes: a `phoneme_inventory` (size and membership set by familiarity + mood), `phonotactics` (open vs closed syllables from familiarity; permitted clusters), a `length_profile` (from register), a small tight set of `preferred_endings` (kept small because endings carry cohesion — see Step 3), and a `phonaesthetic_bias` (from mood). The default seed is deliberately open-syllable and small-inventory, because that path is both the cheapest to generate and the safest for the 26-letter constraint. The user can then edit any field.

---

## Places as a first-class category

**GUIDE.** Places get their own category, with sub-types that carry their own tendencies:

- **Continents** — broad, sweeping, ancient-sounding.
- **Kingdoms** — reflect the ruling power or the primary resource.
- **Settlements** — landmark-descriptive (river + run, winter + fell).
- **Features** (rivers, peaks) — often the *oldest* names on the map.

Places are separated because they are the natural home of linguistic history. In the real world, place names preserve older layers long after the people have changed — English maps stack Celtic, Roman, Norse and Norman names together. So places are where the drift family shows most vividly: a river named in the mother tongue, the city later built on it named in the daughter tongue, the fortress above named by conquerors in a third — all visible in one region at once. This is why features default to deeper, older strata than new settlements.

At drift 0–1, places just use literal / descriptive / historical naming, no family machinery.

**SPEC.** `category = place` with `place_type ∈ {continent, kingdom, settlement, feature}`. Each type carries its own `length_profile`, `naming_source` bias, and its own default `drift_depth`, so features can resolve to older strata than settlements within the same family.

---

## The phonaesthetics dial

**GUIDE.** A nudge on sound selection to set mood — never a hard rule. It leans on the genuine mechanism (how a sound is physically produced) rather than asserting fixed emotional meanings. Sound symbolism is a real, researched effect; the tidy "this letter means evil" tables in pop advice are not, so the dial biases within what the culture's sound rules already permit and no further.

Starter presets, each as *effect → why*:

- **Harsh / hard** — favours stops (k, g, t, d), clusters, closed syllables. *These sounds stop the airflow abruptly, so names feel clipped and forceful.*
- **Soft / flowing** — favours liquids (l, r), nasals (m, n), open vowels and syllables. *Air keeps moving, so names feel smooth and unbroken.*
- **Bright / sharp** — favours front vowels (i, e) and sibilants (s, sh). *These read as small, quick and keen.*
- **Grand / ancient** — favours open back vowels (a, o) and longer forms. *Big open vowels and length feel weighty and slow, so names feel old and large.*
- **Exotic / other** — favours diphthongs (ae, oi) and combinations uncommon in English. *Reads as foreign without becoming unpronounceable.*

**SPEC.** `phonaesthetic_bias` is an optional weight vector over the culture's existing `phoneme_inventory`, applied at selection time and always subordinate to `phonotactics`. Ships with named presets (above) plus a manual mode. Each preset stores plain-language `effect` and `why` strings for display.

---

## Drift-pack library

**GUIDE.** The user picks a flavour; the pack carries the sound-change chain and the app runs it. Packs are grouped by what they *do to* a language, so a user can reach for an effect without knowing historical linguistics.

**Softening / erosion** — make a language flow more over time.
- *Romance-style softening* — hard consonants soften and voice.
- *Lenition* — consonants weaken between vowels (Celtic pattern).
- *Vowel-melting* — adjacent vowels merge, endings wear away.

**Hardening / fortifying** — make a language crunchier.
- *Germanic-style shift* — consonants harden and shift.
- *Cluster-building* — vowels drop, consonants collide (Slavic/Norse feel).
- *Glottal-sharpening* — stops and glottal stops proliferate.

**Vowel-movement** — reshape colour without touching consonants much.
- *Great-Vowel-Shift style* — long vowels raise and diphthongise.
- *Fronting / backing* — the whole vowel space slides.
- *Rounding / unrounding*.

**Compression** — change length and rhythm.
- *Syllable-loss* — long ceremonial names erode to clipped modern ones.
- *Stress-collapse* — unstressed syllables vanish.

**Contact (level 5 only)** — govern how borrowing behaves.
- *Prestige-borrowing* — a conqueror/administrative tongue lends formal and place vocabulary (Norman-French-on-English layer).
- *Substrate-retention* — the conquered language survives in landscape and feature names (Celtic river-names under English).
- *Trade-creole* — two neighbours meet in the middle at a frontier.

A user wanting "an old, worn, flowing language with a harsh conqueror's tongue over its cities" picks a softening pack for the substrate, a hardening pack for the superstrate, and a prestige-borrowing contact pack — three choices, and the engine derives the rest. **User-added rules** are an optional advanced layer on top: append a rule to any pack, or write a chain from scratch, but nothing requires it.

**SPEC.** A `DriftPack` is a named, ordered `sound_change_ruleset` with metadata `{effect_family, plain_description, why}`. Packs are selectable per descent-chain and can stack (applied in order). `contact_packs` are a distinct type operating on a `contact_graph` edge rather than a descent chain. `user_rules[]` optionally append to any pack. Author rules and preset rules are treated identically once loaded.

---

## The contact graph (level 5)

**GUIDE.** At level 5, languages don't just descend — they touch. The contact graph lays borrowing relationships over the family tree. Each relationship has a direction (who lends to whom), a strength (how heavily), and a domain (which *kinds* of words cross — conquerors typically lend administration, law, and religion vocabulary; the conquered leave their mark on the land itself). Crucially, a borrowed word is **reshaped to fit the borrower's mouth**: it doesn't arrive intact, it arrives worn to the borrower's sound rules. The Confucius case is the model — a foreign name ("Kong Qiu") entered European use as an ad-hoc, readable respelling because there was no standard way to carry it across. The engine reproduces this: loanwords get a **prestige-exonym** pass that respells them for the borrower, which is also a readability win.

The three contact patterns map onto real history: a prestige/superstrate tongue lending downward (Norman French onto English), a substrate surviving underneath (Celtic river-names persisting under English), and adstrate/trade between equals meeting at a frontier. The substrate pattern is why *places* — especially natural features — are the best showcase for contact: the oldest layer clings to rivers and peaks long after the people have changed.

**SPEC.** A `contact_graph` is a directed graph over `LanguageObject` nodes. Each edge carries:

```
ContactEdge = {
  donor,                 // source LanguageObject
  borrower,              // target LanguageObject
  contact_type,          // prestige | substrate | adstrate
  strength,              // 0..1, share of borrowed vocabulary
  domains[],              // e.g. administration, religion, warfare, trade, place-features
  reshaping_ruleset,     // borrower-phonotactic adaptation + optional prestige-exonym respelling
  spelling_mode          // etymological | phonetic, as elsewhere
}
```

A borrowing event: take a donor root or name → apply the borrower's phonotactic filter → optionally apply the prestige-exonym respelling → tag the result `loan-origin: {donor, edge}`. `substrate` edges bias their `domains` toward `place-features`, so conquered-language forms survive preferentially in rivers, mountains, and old settlements (feeding the Places category's deep `drift_depth`). Edge `strength` and `domains` together decide how much of the borrower's lexicon shows foreign residue, and where.

---

## Starter packs (see `starter-packs.json`)

The framework's abstract slots now have real starter data, in a companion file. Two independent pack types:

**Phonetic element packs** — one per phonaesthetic mood (harsh, soft, bright, grand, exotic). Each supplies `start`, `middle`, and `end` element lists obeying the joinery rule (starts end in a vowel; middles and ends begin with a consonant). These feed Step 3's generation architecture and are selected by the phonaesthetics dial. A seeded culture samples a *subset* — especially a tight subset of endings — for cohesion, then leans on generate-then-filter to drop the denser combinations.

**Semantic concept packs** — a `core` set of ~70 universal name concepts every culture draws on, plus thematic packs (`warrior`, `seafaring`, `mountain`, `forest`, `arcane`, `desert`, `mercantile`, `priestly`, `agrarian`) that are **additive on top of core, never replacements**. The mechanic:

- A pack is a list of *concepts* (meanings), not finished words. When a pack is applied to a culture, the engine mints a *form* for each concept from that culture's own phonology — so "tide" or "sword" sounds native in every language that uses it.
- A culture may **stack** packs. A seafaring warrior people takes `core + warrior + seafaring` and gets sea-and-war vocabulary that still sounds like one language.
- Applying a pack also **raises the frequency** of its concepts in generated names (via multiplicity weighting), not just their availability — so a warrior culture's names visibly lean martial, a seafaring culture's lean maritime.

New thematic packs follow the same shape, so the library extends indefinitely: pick a theme, list its concepts, mark it additive.

---

## Source-to-axis map

For our own reference — which source contributes which axis.

| Source | Contribution |
|---|---|
| Base article (*How to Build a Naming System*) | The six-step spine |
| Nymia (*Build a Fantasy Naming System*) | Layering (personal/house/title), class/archetype bending, frontier zones, three-rules compression, repetition over originality |
| rassaku Part I (*Naming Languages: Why names suck*) | The naming-language / phonotactics discipline; failure taxonomy |
| rassaku Part II (*Making sounds*) | 26-letter transliteration constraint; digraph/apostrophe/accent readability rules; open vs closed syllables; "language becomes easier" law; prestige-exonym (Confucius) mechanic |
| rassaku Part III (*Putting it all together*) | ~100-root figure; semantic mix-and-match; parental-intent meaning; the *-ja/-han* daughter-split worked example; silent-h erosion; etymological-vs-phonetic spelling; connotation/zeitgeist collision |
| rassaku (*Decent Fantasy Name Generator*) | Top/middle/end element architecture; ending-primacy; vowel-to-consonant joinery; multiplicity weighting; generate-then-filter; U-devoicing and vowel-position readability rules |
| Dabble (*Five Ways to Name Your Fantasy World*) | Semantic roots; literal/descriptive/historical sources; erosion and drift over time |
| Mythic Name Forge (*How to Name a DnD World*) | Dual readability gate; phonaesthetics dial; the "functional reference" principle |

---

## Open threads / next steps

Resolved in this pass: rassaku Parts II & III and the name-generator post pulled and folded in; the contact-graph data model specified; the seed-language trait-to-phonology mapping specified; starter data built (`starter-packs.json`) — phonetic element packs for all five moods and ten semantic concept packs with the additive customisation mechanic.

Still open:

- **Level 2 and 4** remain reserved by design (see drift engine) — define only if a real need appears.
- **Prestige-exonym respelling ruleset** — the mechanic is specified; the actual respelling rules (how a donor form is made readable for a borrower) need authoring, and could reuse the drift-pack sound-change machinery.
- **Connotation-collision data** — the check is defined but needs a source of "tainted" associations to test against; likely a maintained blocklist plus a real-world-name proximity check.
- **Drift-pack sound-change rules** — the packs are named and described by effect, but the actual ordered sound-change rules inside each still need writing (the next natural data-build task, parallel to what the starter packs just did for elements).
- **Zompist Language Construction Kit** (referenced by rassaku) is a candidate deeper source if the phonotactics engine needs more rigour than the current model.
