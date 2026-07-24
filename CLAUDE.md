# languageForge — project context for Claude Code

An Obsidian plugin (TypeScript, esbuild) that generates fantasy names and languages.

## Golden rules
- JSON data files in /data are the source of truth. Never hand-edit /src/data.ts —
  regenerate it from JSON and re-run the matching validator in /tools.
- Every validator must pass before a change is done. A FAIL blocks the build.
- Names are written in the 26 Latin letters only. No diacritics, no gratuitous apostrophes.
- A language's identity is its `id` (seed). `name` is display-only. The family tree
  links by `parentIds`. Do not key data or logic off `name`.
- All generated names pass the Step 6 readability gates (joinery, echo, throwaway-U,
  connotation, per-culture registry).

## Where things live
- /docs/reconciliation.md — how the current build diverged from the design; start here.
  Gives a precise, dependency-ordered gap list (Gap 1: drift-pack library, Gap 2: structure/
  intensity split, Gap 3: contact graph, Gap 4: place strata, Gap 5: titles, Gap 6: spelling
  toggle). Gap 1 must be fixed before Gaps 2–4 are buildable — follow its sequence.
- /docs/naming-system-framework.md — the master design.
- /docs/spec-*.md — feature specs (language page, name classes, meaningful names, traditions).
- /docs/gate-refinements.md — accepted amendments to the Step 6 gates.
- /data + /tools — validated data and its validators: starter-packs-v2.json (phonetic
  elements), concept-packs.json (tagged semantic concepts), drift-packs.json (sound-change
  rule packs), naming-traditions.json (content+structure presets), each paired with its
  /tools validator. Run `npm run validate` to check all four.

## Current status (read before assuming a spec is implemented)
- **All 6 reconciliation.md gaps are done**, and `naming-traditions.json` is wired into real
  generation — the naming system is feature-complete relative to the reconciliation doc.
  - Gap 1 (drift-pack library): `deriveCulture`/`mergeCultures` take `driftPackIds` and apply
    `DRIFT_PACKS` (ported from `drift-packs.json`) as ordered rule packs, not the old
    unordered `SOUND_CHANGE_RULES`.
  - Gap 2 (structure/intensity split): `Culture.driftMode` (`family`/`family-contact`)
    formalizes what `deriveCulture`/`mergeCultures` already did; `ageCulture` is the Level-1
    "single language, aged" operation (`AgeCultureModal`, command `age-culture`) — read-only,
    no lineage node, never mutates a culture's stably-minted `roots`/`elements`.
  - Gap 3 (directed contact graph): `ContactEdge` (`donorId`→`borrowerId`, `contactType`,
    `strength`, `domains`) lives in `plugin.data.contactEdges`. `previewContactEdge` biases
    borrowing toward a domain's tags (via `CONTACT_DOMAIN_TAGS`), reshapes via the
    `prestige_exonym` pack, filters through the borrower's `legalOnset`. Preview-only by
    default; `acceptLoanedRoots` is the one explicit, user-consented mutation that saves
    loanwords into a culture (`ContactEdgeModal`, command `create-contact-edge`).
    `mergeCultures` stays symmetric, labeled `family-contact` as an interim implementation —
    not the directional model.
  - Gap 4 (place strata): `PlaceType` (`continent`/`kingdom`/`settlement`/`feature`) each has
    a default `PLACE_TYPE_DRIFT_DEPTH`; `resolvePlaceSourceCulture` walks a culture's
    `parentIds` chain that many hops (oldest/least-drifted parent at each fork) so a
    `feature` can draw on an ancestral tongue. Wired into `GenerateModal`'s place-type
    dropdown; substrate loanwords accepted via Gap 3 become ordinary roots, so they're
    automatically eligible once an ancestor is resolved — the two gaps compose with no
    extra glue code.
  - Gap 5 (titles): `Category` gained `"title"`, treated like `"house"` in `assemble`'s
    middle-slot logic (formal/institutional per the framework). `naming-traditions.json`
    defines no title patterns, so titles never route through tradition generation regardless
    of tradition selection — always the plain phonetic path.
  - Gap 6 (spelling mode): `SpellingMode` (`"etymological"|"phonetic"`, default phonetic) is
    consumed by a shared `driftRootForm` helper wherever a `Root`'s form gets drifted
    (`deriveCulture`, `mergeCultures`, `ageCulture`) — `"etymological"` skips drifting any
    root whose `origin` is machine-marked as a blend (`"a+b"`, from `mergeCultures`), so the
    compound stays legible; `"phonetic"` drifts everything. Exposed as a "Spelling" dropdown
    on `DeriveCultureModal`/`AgeCultureModal`.
  - **`naming-traditions.json` is now wired into real generation.** `SEMANTIC_PACKS`
    (`data.ts`) was migrated from plain concept strings to the tagged `{concept, tags}` shape
    `concept-packs.json` already had — `Root` carries `tags: string[]` and an optional
    `loanOrigin`. `policyPool`/`resolveTokens` (faithful ports of
    `naming_traditions_validator.py`'s `resolve`/`policy_pool`) resolve a tradition's
    `contentPolicy` against real culture concepts; `ensureConceptsMinted` mints any concept a
    tradition references that a culture hasn't minted yet (additive, respects stable-minting).
    `buildTraditionPersonal`/`Place`/`House` + `generateTraditionBatch` build real names using
    a tradition's patterns (dithematic/theophoric/single/epithet, patronymic/clan/occupational/
    locative house forms, toponymic generics) — `formOf` replaces the validator's placeholder
    `W(concept)` with real minted forms. Wired into `GenerateModal` via a "Naming tradition"
    dropdown (+ conditional gender dropdown for personal names); selecting a tradition hides
    the sound/meaning mode dropdown, since tradition generation has its own internal
    pattern-type selection. `gateName` is applied only to the single fused head-word of a
    tradition-built name (its syllable/echo checks are tuned for one word); surname/epithet
    additions are still built from real minted forms but not independently re-gated.
- All data files validate clean via `npm run validate`. The `NAMING_TRADITIONS` port was
  structurally diffed against `naming-traditions.json` (exact match, same technique as
  `DRIFT_PACKS`/`SEMANTIC_PACKS`). A standalone esbuild-compiled harness exercised
  `generateTraditionBatch` for all 9 traditions × personal(both genders)/place(settlement+
  feature)/house — every batch produced full, well-formed output (patronymic/clan/theophoric/
  occupational particles all rendering correctly); the title category's plain-assemble path
  was confirmed working independently.
- Not yet manually smoke-tested inside Obsidian itself (would require driving the user's
  real desktop install via Electron automation with no dedicated test vault — flagged rather
  than attempted unprompted). `npx tsc --noEmit` and the esbuild bundle both succeed.

## Build
- npm install
- npx tsc  (type-check)
- esbuild bundle to main.js (see README)
