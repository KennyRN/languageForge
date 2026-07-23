# Gate refinements — drop-in amendments for the framework

*Produced by running all five phonetic element packs through the Step 6 gates (see `pack_validator.py`). Three rules needed refinement, one needed splitting in two, and two new cheap filters fell out of the smoke test. Each section below is written in the framework's own GUIDE/SPEC style and can be pasted over the corresponding passage.*

---

## 1. The joinery rule — amend to sonorant finals (replaces Step 3's joinery paragraph and the JSON `joinery_rules` note)

**GUIDE.** Start and middle elements end in a vowel **or a sonorant (l, r, n)**; middle and end elements begin with a consonant. Sonorants make natural syllable codas that lead cleanly into any following onset — *Gorn-drak*, *Kar-tha*, *Sil-shen* all speak easily — so restricting finals to vowels alone was stricter than the phonology requires, and the original packs already knew it: *Kor*, *kar*, *gorn*, *sil*, *ser*, *sin*, *mor*, *lon* and *neir* all violated the written rule while being perfectly good elements. Amend the rule rather than delete good data.

Two asymmetries matter:

- **Middles and ends may open with clusters; starts may not have illegal ones.** A cluster-initial middle (*gda*, *kta*, *dko*) is legal because the seam splits it across the syllable boundary (*Ka + gda = Kag-da*). A start element has nothing before it — no seam, no rescue — so its onset must be a legal English onset or carry a **named waiver** (see §3). This is why *Zga* fails while *gda* passes.
- **Sibilants are not sonorants.** A middle ending in *sh* (*sish*, *sesh*) welds badly at the seam (*sish + kis = sishkis*; *sesh + sen = seshsen*). Only l/r/n earn the coda exemption.

**SPEC.** `start[]` and `middle[]` elements are `[vowel | l | r | n]`-final. `middle[]` and `end[]` elements are consonant-initial; a leading cluster is valid iff it is a legal onset OR its first consonant can act as a coda while the remainder is a legal onset. `start[]` onsets must be legal or explicitly waived — no seam-split rescue at position zero.

---

## 2. The start-vowel rule — grade it (replaces the "vowel position isn't neutral" bullet in Step 6)

**GUIDE.** The original rule ("U/O look off unless a consonant cluster follows — *Ornafel* works, *Onafel* doesn't") is too strict for O: English names offer abundant counter-evidence for O + single consonant — *Oliver*, *Omar*, *Owen*, *Oona*, *Otis*. The graded rule:

- **A / E / I** open freely.
- **O** needs a following consonant; a single one is fine (*Olamor*, *Oronoth*), and a bare `O` start element is fine because the joinery guarantees a consonant follows. What fails is **O + vowel** at the opening (*Oa-*, *Oi-*) — the reader has no anchor for the diphthong. (*Oi* additionally collides with the British interjection; see §4.)
- **U** keeps the strict rule: it resists reduction and needs a following cluster to read (*Ulric* works, *Unafel* wants to become "you-nafel").
- **Initial Y** fails, as before.
- **No element opens with three consecutive vowels** (*Aoi*). Medial three-vowel runs (*-daion*) are readable but should stay rare — warn, don't fail.

**SPEC.** `silent_readability` start-position checks: `[aei]` pass; `o` requires next-char consonant (element `"o"` alone passes via joinery guarantee); `u` requires a following 2-consonant cluster; initial `y` fails; initial vowel-run ≥ 3 fails; medial vowel-run ≥ 3 warns.

---

## 3. Letters vs clusters, and the waiver mechanism (replaces the JSON `readability_note`)

**GUIDE.** "Pre-filtered for the 26-letter constraint" conflated two different gates. The **26-letter constraint** governs *letters*: no gratuitous apostrophes, no accents, no decorative digraphs. The **cluster rules** govern *sounds*: legal onsets, seam joinery. An element can pass one and fail the other — *Zga* uses only honest letters and is still unsayable.

Where a mood genuinely wants to press against English phonology, the pack does it by **named waiver**, not by silence: *ts-* is waived for exotic (familiar via *tsar*, *tsunami*); *vr-* is waived for harsh (marginal but readable via *vroom*). A waiver states its justification and shows up as a warning in validation, never silently. Anything unwaived must be a legal English onset — *zg-* marks where the line is: no analogue, not even a marginal one, so it goes.

**SPEC.** `WAIVED_ONSETS = {onset: justification}` per pack library. Validation reports waived elements as WARN with the justification string; unwaived illegal onsets are FAIL. Waivers are data, reviewable and removable.

---

## 4. Split the element-level and name-level collision checks (extends Step 6's `collision_check`)

**GUIDE.** Elements are not names, so the collision gate runs twice, at two granularities:

- **Element-level (build time):** an element that *is* a common English word, interjection, or strongly associated name fails the pack — *both*, *Ely* (the cathedral city), *Oi* (the interjection, especially for a British readership), *-noel*. Genre-established borrowings are waived by name: *grim* and *dun* are centuries-deep fantasy/place-name elements; *bra* never surfaces alone (Bram, Brandon). Elements that merely coincide with given names (*Ava*, *Mae*, *Kai*) pass — they are ingredients, not output.
- **Name-level (generate time):** the assembled string is what actually collides, and element-level checks cannot foresee it. Proof from this very pass: the first replacement for *Oa* was *Oba* — individually clean — until the smoke test assembled *Oba + mor = "Obamor"*. The gate that matters most runs on the finished name, against real-world names, IP, connotation, **and the project's own registry**.

**SPEC.** `collision_check` becomes two passes: `element_collision` (blocklist + waiver list, run by the pack validator at build time) and `name_collision` (run per candidate at generation time, as already specified, with the project registry added as a target).

---

## 5. Two cheap generate-then-filter culls (add to Step 6's automated gates)

**GUIDE.** The assembly smoke test surfaced two low-cost filters worth adding to the batch cull:

- **Echo filter.** Multiplicity weighting means an element can legally be picked twice, and near-identical middles/ends can meet at a seam: *Zar + kar + -kar = "Zarkarkar"*, *Kae + gna + -gnar = "Kaegnagnar"*, *Nae + -naum = "Naenaum"*. Reject any candidate where the same element appears twice or the seam creates an immediately repeated syllable. Repetition *across* a culture's names is the design goal; repetition *within* one name is a stutter.
- **Open-U cull.** The pack rule (no middle element may end in open *u*) prevents planting the trap, but drift and user-authored elements can still create an unstressed medial open U downstream — keep the *Ithusel* check in the name-level gate too, as defence in depth.

**SPEC.** Add to the batch filter: `no_element_repetition` (same element ID twice → reject), `no_seam_echo` (identical syllable either side of a seam → reject), and retain `unstressed_medial_u` at name level regardless of pack-level enforcement.

---

## 6. Housekeeping corrections

- **Duplicate-free base packs.** The soft pack shipped `-nor` twice. Since multiplicity *is* the weighting mechanism, base packs must ship duplicate-free — otherwise a user can't tell deliberate weighting from a typo. Stated in the amended `weighting_note`; enforced by the validator (check D1).
- **The ~70 vs ~100 discrepancy.** The framework says core is ~70 concepts; the JSON said "~100-concept backbone". Core is exactly 70; the ~100 figure is the per-culture research target, which core *plus one or two thematic packs* reaches. The JSON description now says so.
- **Validation as a build step.** `pack_validator.py` encodes every rule above. Run it whenever any pack changes; a FAIL blocks the build, WARNs (waivers, medial vowel runs) are informational. This makes the "pre-filtered" claim in the metadata true by construction rather than by assertion.

---

## Changelog applied in `starter-packs-v2.json`

| Pack | Was | Now | Reason |
|---|---|---|---|
| harsh | `Zga` | `Zar` | zg- has no English analogue, even marginal; Zar keeps z + hard sonorant coda |
| harsh | `-both` | `-krag` | English word collision |
| soft | `Ely` | `Elya` | Cambridgeshire cathedral city |
| soft | `nolu` | `noli` | element-final open U = *Ithusel* trap once medial |
| soft | `-nor` (dup) | `-nel` | base packs ship duplicate-free |
| bright | `Ci` / `ci` | `Sei` / `sia` | c+i is ambiguous (cinema vs ciao) |
| bright | `sish` / `sesh` | `sisha` / `sesha` | sh-final middles weld sh+s / sh+k at seams |
| grand | `Oa` | `Orda` | O+vowel opening; first fix (*Oba*) assembled into "Obamor" — name-level collision |
| exotic | `Oi` | `Roi` | interjection collision + O+vowel opening |
| exotic | `Aoi` | `Ai` | triple-vowel opening |
| exotic | `-noel` | `-nael` | Noel/Christmas collision |
| exotic | `-raew` | `-raen` | vowel-cluster + w coda has no English analogue; caught on a second pass after extending the validator with a final-coda gate (-aw/-ew/-ow only) |

Rescued by the sonorant-final amendment rather than replaced: `Kor`, `kar`, `gorn`, `sil`, `ser`, `sin`, `mor`, `lon`, `lor`, `nan`, `neir`.
