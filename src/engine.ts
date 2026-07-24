// engine.ts — the whole of languageForge's naming engine, pure and testable (no Obsidian imports).
// Implements: unified assembler (pack path + procedural path -> one joinery model),
// stable seeded minting with uniqueness check, capped multiplicity weighting,
// reverse-seeding from pasted names, pin-and-regenerate, pronunciation hints,
// the Step 6 gates (lite), and the culture card.

import {
  PHONETIC_PACKS, SEMANTIC_PACKS, DRIFT_PACKS, DriftPack, SoundChange, DriftWhen, TaggedConcept,
  NAMING_TRADITIONS, NamingTradition, NamingPattern, ToponymicGeneric, ContentPolicy, GenderProfile,
  HouseParticles,
} from "./data";
export {
  DRIFT_PACKS, DriftPack, SoundChange, DriftWhen, TaggedConcept,
  NAMING_TRADITIONS, NamingTradition, NamingPattern, ToponymicGeneric, ContentPolicy, GenderProfile,
  HouseParticles,
};

// ---------------------------------------------------------------- types

export type Mood = "harsh" | "soft" | "bright" | "grand" | "exotic";
export type Register = "ancient" | "balanced" | "modern";
export type Category = "personal" | "house" | "place" | "title";
export type Slot = "start" | "middle" | "end";
export type DriftLevel = "dialect" | "sister" | "distant";
// Structural axis (Gap 2), orthogonal to DriftLevel's intensity axis. "age" never produces
// a Culture (see ageCulture), so it has no place on this type — it's not a lineage label.
export type DriftMode = "family" | "family-contact";

// Gap 4 — place sub-types, each with a default "drift depth": how many ancestor-hops back
// into a family's lineage to draw a place name's roots/elements from. Features are the
// oldest names on a map; settlements the newest.
export type PlaceType = "continent" | "kingdom" | "settlement" | "feature";
export const PLACE_TYPE_DRIFT_DEPTH: Record<PlaceType, number> = {
  feature: 3,
  continent: 2,
  kingdom: 1,
  settlement: 0,
};

export interface ElementSet { start: string[]; middle: string[]; end: string[]; }

export interface Root {
  form: string;
  meaning: string;
  origin: string;          // pack the concept came from
  weight: number;          // capped multiplicity: 1 normal, 2 common, 3 dominant, 0.5 rare (user demotion)
  tags: string[];          // from concept-packs.json's tag_vocabulary — drives contact-edge domain bias
  loanOrigin?: { donorCultureId: string; edgeId: string }; // set only for roots borrowed via a ContactEdge
}

export interface Culture {
  id: string;
  name: string;
  seed: string;            // reproducibility anchor: subsets, mints and cards all derive from it
  mood: Mood;
  register: Register;
  familiarity: "familiar" | "alien";   // familiar = enumerated pack path; alien = procedural open-syllable path
  environment: string;
  elements: ElementSet;    // FROZEN sampled subsets — persisted so cohesion is reproducible
  middleChance: number;
  syllableRange: [number, number];
  stress: "initial" | "penult";
  roots: Root[];           // minted forms, stable across sessions
  appliedPacks: string[];
  registry: string[];      // accepted names — the project-level collision target
  fromNames?: string[];    // if reverse-seeded, the names the user pasted
  summary: string;
  parentIds?: string[];    // ids of the ancestor Culture(s): 1 = pure divergence, 2+ = contact/merge
  generation?: number;     // 0 for root cultures, max(parents' generation)+1 for derived ones
  driftLevel?: DriftLevel; // intensity preset used when deriving/merging from parentIds
  driftPackIds?: string[]; // sound-change pack(s) applied when deriving/merging (lineage display)
  driftMode?: DriftMode;   // structural operation that produced this culture: family | family-contact
}

export interface GeneratedName {
  name: string;
  pronunciation: string;
  parts: { slot: Slot; element: string }[];
  category: Category;
  gloss?: string;          // for semantic-mode names: "strong + spear"
}

// ---------------------------------------------------------------- seeded RNG

function xmur3(str: string): () => number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

function mulberry32(a: number): () => number {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function rngFrom(seed: string): () => number {
  return mulberry32(xmur3(seed)());
}

function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

function sample<T>(rng: () => number, arr: T[], n: number): T[] {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(n, copy.length));
}

// ---------------------------------------------------------------- phonology helpers

const VOWELS = new Set("aeiou");
const SONORANTS = new Set("lrn");
const LEGAL_ONSETS = new Set([
  ..."bcdfghjklmnpqrstvwz", "sh", "ch", "th", "wh", "qu",
  "bl", "br", "cl", "cr", "dr", "dw", "fl", "fr", "gl", "gr", "gn",
  "kl", "kr", "pl", "pr", "sc", "sk", "sl", "sm", "sn", "sp", "st", "sw", "tr", "tw",
  "scr", "skr", "spl", "spr", "str", "shr", "thr", "squ",
]);

// Whole-name connotation cull (contains-match, curated small; extend freely).
const NAME_BLOCKLIST = ["obam", "hitler", "stalin", "noel", "jesus", "allah", "satan"];

const isVowel = (c: string, i: number) => VOWELS.has(c) || (c === "y" && i > 0);

/** Split a lowercase string into syllables using maximal-onset against LEGAL_ONSETS. */
export function syllabify(word: string): string[] {
  const w = word.toLowerCase();
  const nuclei: [number, number][] = [];
  let i = 0;
  while (i < w.length) {
    if (isVowel(w[i], i)) {
      let j = i;
      while (j < w.length && isVowel(w[j], j)) j++;
      nuclei.push([i, j]);
      i = j;
    } else i++;
  }
  if (nuclei.length <= 1) return [w];
  const sylls: string[] = [];
  let startIdx = 0;
  for (let n = 0; n < nuclei.length - 1; n++) {
    const clusterStart = nuclei[n][1];
    const clusterEnd = nuclei[n + 1][0];
    const cluster = w.slice(clusterStart, clusterEnd);
    // maximal onset: give the longest legal onset to the next syllable
    let onsetLen = 0;
    for (let len = Math.min(3, cluster.length); len >= 1; len--) {
      if (LEGAL_ONSETS.has(cluster.slice(cluster.length - len))) { onsetLen = len; break; }
    }
    if (cluster.length === 1) onsetLen = 1;
    if (onsetLen === 0) onsetLen = 1; // unsplittable run: give one consonant to the onset regardless
    const boundary = clusterEnd - onsetLen;
    sylls.push(w.slice(startIdx, boundary));
    startIdx = boundary;
  }
  sylls.push(w.slice(startIdx));
  return sylls.filter(s => s.length > 0);
}

// ---------------------------------------------------------------- pronunciation hints

const NUCLEUS_MAP: Record<string, string> = {
  ae: "ay", ai: "eye", ei: "ay", ey: "ay", oi: "oy", oy: "oy", au: "ow",
  eu: "yoo", ou: "oo", ui: "wee", ua: "wah", oe: "oh", ao: "ah-oh", io: "ee-oh",
  ia: "ee-ah", ea: "ay-ah", aio: "ay-oh", oa: "oh-ah", ya: "yah", yo: "yoh",
};

function respellSyllable(syl: string, isFinal: boolean): string {
  let s = syl;
  // c softens before front vowels
  s = s.replace(/c(?=[ei])/g, "s").replace(/c/g, "k").replace(/qu/g, "kw");
  // find nucleus
  let n0 = -1, n1 = -1;
  for (let i = 0; i < s.length; i++) {
    if (isVowel(s[i], i)) { if (n0 < 0) n0 = i; n1 = i + 1; } else if (n0 >= 0) break;
  }
  if (n0 < 0) return s;
  const onset = s.slice(0, n0), nucleus = s.slice(n0, n1), coda = s.slice(n1);
  if (coda.startsWith("r") && ["ai", "ei", "ae", "oi", "eir", "air"].includes(nucleus)) {
    return onset + nucleus + coda; // air/eir/oir already read naturally as written
  }
  let spoken = NUCLEUS_MAP[nucleus] ?? NUCLEUS_MAP[nucleus.replace(/y/g, "i")];
  if (!spoken) {
    const open = coda.length === 0;
    const v = nucleus.replace(/y/g, "i");
    if (open) spoken = ({ a: "ah", e: isFinal ? "eh" : "eh", i: "ee", o: "oh", u: "oo" } as Record<string, string>)[v] ?? v;
    else spoken = ({ a: "a", e: "e", i: "i", o: "o", u: "u" } as Record<string, string>)[v] ?? v;
  }
  return onset + spoken + coda;
}

/** "Vaelen" -> "VAY-len" (stress per culture). */
export function pronounce(name: string, stress: "initial" | "penult" = "initial"): string {
  const sylls = syllabify(name);
  const stressIdx = sylls.length <= 1 ? 0
    : stress === "initial" ? 0
    : Math.max(0, sylls.length - 2);
  return sylls
    .map((s, i) => {
      const spoken = respellSyllable(s, i === sylls.length - 1);
      return i === stressIdx ? spoken.toUpperCase() : spoken.toLowerCase();
    })
    .join("-");
}

// ---------------------------------------------------------------- gates (name-level, lite)

function hasUnstressedOpenMedialU(name: string): boolean {
  const sylls = syllabify(name);
  for (let i = 1; i < sylls.length - 1; i++) {
    const s = sylls[i];
    if (s.endsWith("u") && !s.endsWith("au") && !s.endsWith("eu") && !s.endsWith("ou")) return true;
  }
  return false;
}

function medialVowelRun3(name: string): boolean {
  return /[aeiou]{3}/.test(name.toLowerCase().slice(1));
}

function levenshtein(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 2) return 3;
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...new Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return dp[a.length][b.length];
}

export interface GateResult { pass: boolean; reason?: string; }

export function gateName(name: string, culture: Culture, parts: { slot: Slot; element: string }[], sessionNames: Set<string>): GateResult {
  const lower = name.toLowerCase();
  // echo filter: same element twice, or repeated syllable at a seam
  const els = parts.map(p => p.element.toLowerCase().replace(/^-/, ""));
  if (new Set(els).size !== els.length) return { pass: false, reason: "element repeated" };
  for (let i = 0; i < els.length - 1; i++) {
    const a = els[i], b = els[i + 1];
    if (a.slice(-2) === b.slice(0, 2) && a.length > 1 && b.length > 1) return { pass: false, reason: "seam echo" };
  }
  if (/(.{2,3})\1/.test(lower)) return { pass: false, reason: "internal stutter" };
  if (/([bcdfghjklmnpqrstvwz])\1[bcdfghjklmnpqrstvwz]/.test(lower)) return { pass: false, reason: "welded triple cluster" }; // Kor+rka = "rrk"
  if (hasUnstressedOpenMedialU(lower)) return { pass: false, reason: "unstressed medial U" };
  if (medialVowelRun3(lower)) return { pass: false, reason: "vowel pile-up" };
  if (NAME_BLOCKLIST.some(b => lower.includes(b))) return { pass: false, reason: "connotation collision" };
  const sylls = syllabify(lower).length;
  const [lo, hi] = culture.syllableRange;
  const slack = parts.length === 2 && parts.every(p => p.slot === "start" || p.slot === "end") && parts[0].element.length >= 3 ? 1 : 0; // root compounds may run one longer
  if (sylls < lo || sylls > hi + slack) return { pass: false, reason: "length outside profile" };
  if (sessionNames.has(lower)) return { pass: false, reason: "duplicate in batch" };
  for (const r of culture.registry) {
    if (levenshtein(lower, r.toLowerCase()) <= 1) return { pass: false, reason: "collides with registry" };
  }
  return { pass: true };
}

// ---------------------------------------------------------------- two element sources, one assembler

const PROCEDURAL_CONSONANTS: Record<Mood, string[]> = {
  harsh:  ["k", "g", "t", "d", "b", "r", "z", "k", "g", "t"],
  soft:   ["l", "m", "n", "r", "s", "v", "l", "m", "n"],
  bright: ["s", "sh", "t", "s", "k", "z", "s", "sh"],
  grand:  ["m", "n", "d", "r", "l", "th", "m", "n", "d"],
  exotic: ["v", "z", "n", "j", "k", "ts", "v", "n"],
};
const PROCEDURAL_VOWELS: Record<Mood, string[]> = {
  harsh:  ["a", "o", "u", "a", "o"],
  soft:   ["a", "e", "i", "a", "e", "ia"],
  bright: ["i", "e", "i", "e", "a"],
  grand:  ["a", "o", "a", "o", "au"],
  exotic: ["ae", "oi", "a", "ei", "ai", "u"],
};

/** Procedural path: build gate-clean open-syllable elements from a small inventory.
 *  Feeds the SAME joinery model as the enumerated packs. */
function buildProceduralElements(rng: () => number, mood: Mood): ElementSet {
  const C = PROCEDURAL_CONSONANTS[mood], V = PROCEDURAL_VOWELS[mood];
  const mk = new Set<string>();
  const starts: string[] = [], middles: string[] = [], ends: string[] = [];
  const cv = () => pick(rng, C) + pick(rng, V);
  let guard = 0;
  while (starts.length < 10 && guard++ < 200) {
    const el = (rng() < 0.2 ? pick(rng, V.filter(v => v[0] !== "u" && v[0] !== "o")) : cv());
    const cap = el[0].toUpperCase() + el.slice(1);
    if (!mk.has(cap) && !/[aeiou]{3}/.test(el)) { mk.add(cap); starts.push(cap); }
  }
  guard = 0;
  while (middles.length < 8 && guard++ < 200) {
    const el = cv();
    if (!mk.has(el) && !el.endsWith("u")) { mk.add(el); middles.push(el); }
  }
  guard = 0;
  while (ends.length < 5 && guard++ < 200) {
    const coda = rng() < 0.4 ? pick(rng, ["n", "r", "l", "th", "s"]) : "";
    const el = "-" + cv() + coda;
    if (!mk.has(el)) { mk.add(el); ends.push(el); }
  }
  return { start: starts, middle: middles, end: ends };
}

/** Pack path: sample a frozen subset from the mood's enumerated pack —
 *  wide starts for distinctiveness, TIGHT endings for cohesion. */
function samplePackElements(rng: () => number, mood: Mood): ElementSet {
  const p = PHONETIC_PACKS[mood];
  return {
    start: sample(rng, p.start, 10),
    middle: sample(rng, p.middle, 8),
    end: sample(rng, p.end, 5),
  };
}

// ---------------------------------------------------------------- culture seeding

export interface SeedTraits {
  name: string;
  mood: Mood;
  register: Register;
  familiarity: "familiar" | "alien";
  environment: string;
  packs: string[];         // thematic semantic packs; core is always applied
  seed?: string;
}

export const ENV_DEFAULT_PACK: Record<string, string> = {
  desert: "desert", mountain: "mountain", forest: "forest",
  coastal: "seafaring", urban: "mercantile",
};

export function seedCulture(traits: SeedTraits): Culture {
  const seed = traits.seed ?? `${traits.name}::${Date.now().toString(36)}`;
  const rng = rngFrom(seed + "::elements");
  const elements = traits.familiarity === "alien"
    ? buildProceduralElements(rng, traits.mood)
    : samplePackElements(rng, traits.mood);

  const syllableRange: [number, number] =
    traits.register === "ancient" ? [3, 5] : traits.register === "modern" ? [2, 3] : [2, 4];

  const culture: Culture = {
    id: seed,
    name: traits.name,
    seed,
    mood: traits.mood,
    register: traits.register,
    familiarity: traits.familiarity,
    environment: traits.environment,
    elements,
    middleChance: traits.register === "ancient" ? 0.7 : traits.register === "modern" ? 0.3 : 0.45,
    syllableRange,
    stress: traits.mood === "grand" || traits.register === "ancient" ? "penult" : "initial",
    roots: [],
    appliedPacks: [],
    registry: [],
    summary: "",
  };

  const packs = new Set(traits.packs);
  const envPack = ENV_DEFAULT_PACK[traits.environment];
  if (envPack) packs.add(envPack);
  applySemanticPacks(culture, [...packs]);
  culture.summary = oneBreath(culture);
  return culture;
}

// ---------------------------------------------------------------- minting (stable, unique, capped weights)

/** Mint one concept into a native form. Deterministic for (culture.seed, concept). */
function mintForm(culture: Culture, concept: string, existing: string[]): string {
  const rng = rngFrom(`${culture.seed}::mint::${concept}`);
  const { start, middle, end } = culture.elements;
  for (let attempt = 0; attempt < 14; attempt++) {
    const long = attempt >= 8; // widen on repeated collision
    let form = pick(rng, start).toLowerCase();
    if (rng() < (long ? 0.9 : 0.35)) form += pick(rng, middle);
    if (rng() < 0.5) form += pick(rng, end).replace(/^-/, "");
    form = form.replace(/[aeiou]{3,}/g, m => m.slice(0, 2)); // repair rare pile-ups
    if (form.length < 3 || form.length > 9) continue;
    // mint-time uniqueness: near-identical forms are cheaper to catch here than to debug in output
    if (existing.every(f => levenshtein(form, f) >= 2)) return form;
  }
  return pick(rng, start).toLowerCase() + pick(rng, middle) + pick(rng, end).replace(/^-/, "");
}

/** Apply core + chosen thematic packs. Weights use CAPPED multiplicity:
 *  weight = number of applied packs containing the concept, capped at 3.
 *  Displayed to users only as rare / normal / common / dominant, never raw counts. */
export function applySemanticPacks(culture: Culture, packNames: string[]): void {
  const applied = ["core", ...packNames.filter(p => p !== "core" && SEMANTIC_PACKS[p])];
  culture.appliedPacks = applied;
  const weightOf = new Map<string, { w: number; origin: string; tags: string[] }>();
  for (const packName of applied) {
    for (const { concept, tags } of SEMANTIC_PACKS[packName].concepts) {
      const cur = weightOf.get(concept);
      if (cur) cur.w = Math.min(3, cur.w + 1);
      else weightOf.set(concept, { w: 1, origin: packName, tags });
    }
  }
  const existingByMeaning = new Map(culture.roots.map(r => [r.meaning, r]));
  const forms = culture.roots.map(r => r.form);
  const roots: Root[] = [];
  for (const [meaning, { w, origin, tags }] of weightOf) {
    const prior = existingByMeaning.get(meaning);
    // mints are stable: never re-mint the form, but tags aren't part of that promise —
    // refresh them from the current data so reapplying packs keeps them in sync.
    if (prior) { prior.weight = prior.weight === 0.5 ? 0.5 : w; prior.tags = tags; roots.push(prior); continue; }
    const form = mintForm(culture, meaning, forms);
    forms.push(form);
    roots.push({ form, meaning, origin, weight: w, tags });
  }
  culture.roots = roots;
}

export function weightLabel(w: number): string {
  return w >= 3 ? "dominant" : w >= 2 ? "common" : w >= 1 ? "normal" : "rare";
}

// ---------------------------------------------------------------- naming traditions

// Module-load index over SEMANTIC_PACKS — a complete substitute for concept-packs.json's
// tag_vocabulary (every declared tag is used, every used tag is declared), so scanning the
// packs once here covers the same ground as the Python validator's build_index(C).
const TAG_TO_CONCEPTS = new Map<string, Set<string>>();
const CONCEPT_TAGS = new Map<string, string[]>();
const CONCEPT_ORIGIN = new Map<string, string>();
const ALL_CONCEPTS = new Set<string>();
for (const [packName, pack] of Object.entries(SEMANTIC_PACKS)) {
  for (const { concept, tags } of pack.concepts) {
    ALL_CONCEPTS.add(concept);
    if (!CONCEPT_TAGS.has(concept)) { CONCEPT_TAGS.set(concept, tags); CONCEPT_ORIGIN.set(concept, packName); }
    for (const t of tags) {
      if (!TAG_TO_CONCEPTS.has(t)) TAG_TO_CONCEPTS.set(t, new Set());
      TAG_TO_CONCEPTS.get(t)!.add(concept);
    }
  }
}

/** tokens = pack names, tag names, or literal concepts -> resolved concept set.
 *  Faithful port of naming_traditions_validator.py's resolve(); pack name wins over tag
 *  if a token happens to be both (matches the validator's own documented ambiguity). */
function resolveTokens(tokens: string[]): Set<string> {
  const out = new Set<string>();
  for (const t of tokens) {
    if (SEMANTIC_PACKS[t]) { for (const c of SEMANTIC_PACKS[t].concepts) out.add(c.concept); }
    else if (TAG_TO_CONCEPTS.has(t)) { for (const c of TAG_TO_CONCEPTS.get(t)!) out.add(c); }
    else if (ALL_CONCEPTS.has(t)) out.add(t);
  }
  return out;
}

/** Port of naming_traditions_validator.py's policy_pool(). */
function policyPool(policy: ContentPolicy): Set<string> {
  const inc = [...(policy.favour ?? []), ...(policy.lock ?? [])];
  const pool = inc.length ? resolveTokens(inc) : new Set<string>();
  if (policy.exclude?.length) { for (const c of resolveTokens(policy.exclude)) pool.delete(c); }
  return pool;
}

function pickFrom<T>(rng: () => number, set: Set<T>): T {
  return pick(rng, [...set].sort() as T[]);
}

/** Mint (via the existing mintForm, respecting stable-minting for anything already present)
 *  any concept not yet in culture.roots, mutating culture.roots directly — additive, same
 *  pattern as acceptLoanedRoots. Returns whether anything was actually added, so callers can
 *  decide whether a persist is warranted. */
export function ensureConceptsMinted(culture: Culture, concepts: Iterable<string>): boolean {
  const existingByMeaning = new Map(culture.roots.map(r => [r.meaning, r]));
  const forms = culture.roots.map(r => r.form);
  let added = false;
  for (const concept of concepts) {
    if (existingByMeaning.has(concept)) continue;
    const form = mintForm(culture, concept, forms);
    forms.push(form);
    const root: Root = {
      form, meaning: concept,
      origin: CONCEPT_ORIGIN.get(concept) ?? "tradition",
      weight: 1,
      tags: CONCEPT_TAGS.get(concept) ?? [],
    };
    culture.roots.push(root);
    existingByMeaning.set(concept, root);
    added = true;
  }
  return added;
}

/** Real-form lookup for a concept already ensured minted (see ensureConceptsMinted). Falls
 *  back to an ad-hoc mint if called before minting — safe (mintForm is deterministic per
 *  culture.seed+concept+existing-forms) but that fallback form won't be a persisted Root,
 *  so callers should always pre-mint the full pool a generation pass could touch. */
function formOf(culture: Culture, concept: string): string {
  const r = culture.roots.find(r => r.meaning === concept);
  return r ? r.form : mintForm(culture, concept, culture.roots.map(r => r.form));
}

function intersectSets<T>(a: Set<T>, b: Set<T>): Set<T> {
  const out = new Set<T>();
  for (const x of a) if (b.has(x)) out.add(x);
  return out;
}

function weightedPatternType(rng: () => number, patterns: NamingPattern[]): string {
  const total = patterns.reduce((t, p) => t + p.weight, 0);
  let x = rng() * total;
  for (const p of patterns) { x -= p.weight; if (x <= 0) return p.type; }
  return patterns[patterns.length - 1].type;
}

function traditionGenderPool(tradition: NamingTradition, gender: "masculine" | "feminine" | "neutral", content: Set<string>): Set<string> {
  const themes = tradition.genders[gender]?.themes ?? [];
  const resolved = themes.length ? resolveTokens(themes) : new Set<string>();
  return resolved.size > 0 ? resolved : content;
}

/** Result shape for every tradition-pattern builder: `name` is the full rendered string
 *  (possibly multi-word — surnames/epithets/particles may add literal, ungated words);
 *  `headWord`/`parts` are the single fused portion actually built from real culture
 *  phonology, which is what gateName checks (see generateTraditionBatch). */
interface TraditionBuild {
  name: string;
  headWord: string;
  parts: { slot: Slot; element: string }[];
  gloss?: string;
}

/** Port of naming_traditions_validator.py's given(). Note: "single" and "epithet" pattern
 *  types share the same plain-concept-pick fallback — the reference has no dedicated
 *  epithet case here; epithet's only effect is the independent append in
 *  buildTraditionPersonal. */
function buildGiven(
  rng: () => number, culture: Culture, tradition: NamingTradition,
  content: Set<string>, gender: "masculine" | "feminine" | "neutral",
): { headWord: string; parts: { slot: Slot; element: string }[]; gloss: string } {
  const type = weightedPatternType(rng, tradition.patterns.personal);
  const gp = traditionGenderPool(tradition, gender, content);
  if (type === "dithematic") {
    const c1 = pickFrom(rng, content);
    const c2 = pickFrom(rng, gp);
    const f1 = formOf(culture, c1);
    const f2raw = formOf(culture, c2).replace(/-/g, "").toLowerCase();
    return {
      headWord: cap(f1) + f2raw,
      parts: [{ slot: "start", element: f1 }, { slot: "end", element: f2raw }],
      gloss: `${c1}-${c2}`,
    };
  }
  if (type === "theophoric" && tradition.particles?.theophoric) {
    const sacBase = resolveTokens(["sacred", "celestial"]);
    const sacIntersect = intersectSets(sacBase, content);
    const sac = sacIntersect.size > 0 ? sacIntersect : resolveTokens(["sacred"]);
    const s = pickFrom(rng, sac);
    const relations = tradition.particles.theophoric.relations;
    const rk = pick(rng, Object.keys(relations));
    const f = formOf(culture, s);
    return {
      headWord: cap(f) + relations[rk],
      parts: [{ slot: "start", element: f }, { slot: "end", element: "-" + relations[rk] }],
      gloss: `${s}-${rk}`,
    };
  }
  const c = pickFrom(rng, gp);
  const f = formOf(culture, c);
  return { headWord: cap(f), parts: [{ slot: "start", element: f }], gloss: c };
}

/** Shared by surname()'s house-fallback branch and standalone house-name generation —
 *  faithful port of the Python's clan/occupational/locative/default branching. */
function buildHouseWord(
  rng: () => number, culture: Culture, content: Set<string>, type: string, hpart: HouseParticles,
): { text: string; headWord: string; parts: { slot: Slot; element: string }[] } {
  if (type === "clan" || type === "clan-patronymic") {
    const c = pickFrom(rng, content);
    const f = formOf(culture, c);
    const prefix = hpart.prefix ?? "Mac";
    const text = prefix + cap(f);
    return { text, headWord: text, parts: [{ slot: "start", element: prefix }, { slot: "end", element: "-" + f }] };
  }
  if (type === "occupational") {
    const craft = resolveTokens(["craft", "trade"]);
    const pool = craft.size > 0 ? craft : content;
    const c = pickFrom(rng, pool);
    const f = formOf(culture, c);
    const affix = (hpart.affix ?? "").replace(/^-/, "");
    const text = cap(f) + affix;
    const parts: { slot: Slot; element: string }[] = affix
      ? [{ slot: "start", element: f }, { slot: "end", element: "-" + affix }]
      : [{ slot: "start", element: f }];
    return { text, headWord: text, parts };
  }
  if (type === "locative") {
    const c = pickFrom(rng, content);
    const f = formOf(culture, c);
    const text = "of " + cap(f);
    return { text, headWord: cap(f), parts: [{ slot: "start", element: f }] };
  }
  // founder-line / gens / patronymic-as-house-type default
  const c = pickFrom(rng, content);
  const f = formOf(culture, c);
  const affix = (hpart.affix ?? "").replace(/^-/, "");
  const text = cap(f) + affix;
  const parts: { slot: Slot; element: string }[] = affix
    ? [{ slot: "start", element: f }, { slot: "end", element: "-" + affix }]
    : [{ slot: "start", element: f }];
  return { text, headWord: text, parts };
}

/** Port of naming_traditions_validator.py's surname(). */
function buildSurname(
  rng: () => number, culture: Culture, tradition: NamingTradition,
  content: Set<string>, gender: "masculine" | "feminine" | "neutral",
): { text: string } {
  const genderProfile = tradition.genders[gender];
  const affix = genderProfile?.patronymicAffix;
  if (affix && tradition.particles?.patronymic) {
    const parentConcept = pickFrom(rng, content);
    const parentForm = formOf(culture, parentConcept);
    if (affix.startsWith("-")) {
      const genitive = tradition.particles.patronymic.genitive ?? "";
      const text = cap(parentForm) + genitive + affix.slice(1);
      return { text };
    }
    return { text: affix + " " + cap(parentForm) };
  }
  const housePatterns = tradition.patterns.house.length ? tradition.patterns.house : [{ type: "founder-line", weight: 1 }];
  const type = housePatterns[0].type;
  const hpart = tradition.particles?.house ?? {};
  return buildHouseWord(rng, culture, content, type, hpart);
}

/** Personal names: given name (gated) + optional surname + optional epithet, per
 *  surnameRate and whether "epithet" appears in patterns.personal. Only the given name's
 *  headWord/parts are gated (scope decision: gateName's syllable/echo checks are tuned for
 *  one word; surname/epithet are still built from real minted forms, just not re-gated). */
export function buildTraditionPersonal(
  rng: () => number, culture: Culture, tradition: NamingTradition,
  gender: "masculine" | "feminine" | "neutral",
): TraditionBuild {
  const content = policyPool(tradition.contentPolicy);
  const given = buildGiven(rng, culture, tradition, content, gender);
  const words = [given.headWord];
  if (rng() < (tradition.surnameRate ?? 0)) {
    words.push(buildSurname(rng, culture, tradition, content, gender).text);
  }
  if (tradition.patterns.personal.some(p => p.type === "epithet") && rng() < 0.4) {
    const article = tradition.particles?.epithet?.article ?? "";
    const traitBase = resolveTokens(["light", "beast", "virtue", "strength"]);
    const traitIntersect = intersectSets(traitBase, content);
    const traitPool = traitIntersect.size > 0 ? traitIntersect : content;
    const c = pickFrom(rng, traitPool);
    const traitCap = cap(formOf(culture, c));
    words.push((article + " " + traitCap).trim());
  }
  return { name: words.join(" "), headWord: given.headWord, parts: given.parts, gloss: given.gloss };
}

function applyGeneric(baseForm: string, g: ToponymicGeneric): string {
  const s = g.position === "suffix" ? cap(baseForm) + g.form : cap(g.form) + baseForm.toLowerCase();
  return s.length ? s[0].toUpperCase() + s.slice(1) : s;
}

/** Places: the reference demo() never actually consults patterns.place's weighted types —
 *  it always picks a random toponymic generic + a random content concept. Mirrored exactly
 *  here. Continent/kingdom have no generics in any of the 9 traditions, so they fall back to
 *  a bare capitalized content form (the "single" place-pattern behavior). */
export function buildTraditionPlace(
  rng: () => number, culture: Culture, tradition: NamingTradition, placeType: PlaceType,
): TraditionBuild {
  const content = policyPool(tradition.contentPolicy);
  const genericsKey = placeType === "feature" || placeType === "settlement" ? placeType : null;
  const gens = genericsKey ? tradition.toponymicGenerics?.[genericsKey] : undefined;
  if (gens && gens.length > 0) {
    const g = pick(rng, gens);
    const baseConcept = pickFrom(rng, content);
    const baseForm = formOf(culture, baseConcept);
    const name = applyGeneric(baseForm, g);
    const parts: { slot: Slot; element: string }[] = g.position === "suffix"
      ? [{ slot: "start", element: baseForm }, { slot: "end", element: "-" + g.form }]
      : [{ slot: "start", element: g.form }, { slot: "end", element: "-" + baseForm }];
    return { name, headWord: name, parts, gloss: `${baseConcept} + '${g.form}' (${g.meaning})` };
  }
  const baseConcept = pickFrom(rng, content);
  const baseForm = formOf(culture, baseConcept);
  const name = cap(baseForm);
  return { name, headWord: name, parts: [{ slot: "start", element: baseForm }], gloss: baseConcept };
}

/** Standalone house names — same branching as buildSurname's house-fallback. */
export function buildTraditionHouse(rng: () => number, culture: Culture, tradition: NamingTradition): TraditionBuild {
  const content = policyPool(tradition.contentPolicy);
  const housePatterns = tradition.patterns.house.length ? tradition.patterns.house : [{ type: "founder-line", weight: 1 }];
  const type = housePatterns[0].type;
  const hpart = tradition.particles?.house ?? {};
  const h = buildHouseWord(rng, culture, content, type, hpart);
  return { name: h.text, headWord: h.headWord, parts: h.parts, gloss: type };
}

/** Every concept a tradition's patterns could reference, pre-minted in one batch so
 *  formOf's lookups always hit a real, persisted Root (see ensureConceptsMinted). */
export function traditionConceptUniverse(tradition: NamingTradition): Set<string> {
  const out = policyPool(tradition.contentPolicy);
  for (const g of Object.values(tradition.genders)) {
    if (g?.themes?.length) for (const c of resolveTokens(g.themes)) out.add(c);
  }
  for (const c of resolveTokens(["sacred", "celestial"])) out.add(c);
  for (const c of resolveTokens(["light", "beast", "virtue", "strength"])) out.add(c);
  return out;
}

/** Retry-until-gate-passes wrapper, mirroring generateBatch's loop exactly. Gates only the
 *  built head-word (scope decision 1); a plain exact-duplicate check on the full rendered
 *  name still applies so identical full names don't repeat within one batch. */
export function generateTraditionBatch(
  culture: Culture, tradition: NamingTradition, category: Category, count: number,
  gender: "masculine" | "feminine" | "neutral" = "neutral",
  placeType: PlaceType = "settlement",
  rng: () => number = rngFrom(`${culture.seed}::tradition-batch::${Date.now()}::${Math.random()}`),
): GeneratedName[] {
  ensureConceptsMinted(culture, traditionConceptUniverse(tradition));
  const out: GeneratedName[] = [];
  const session = new Set<string>();
  let attempts = 0;
  while (out.length < count && attempts++ < count * 40) {
    const built = category === "personal" ? buildTraditionPersonal(rng, culture, tradition, gender)
      : category === "place" ? buildTraditionPlace(rng, culture, tradition, placeType)
      : buildTraditionHouse(rng, culture, tradition);
    if (session.has(built.name.toLowerCase())) continue;
    const gate = gateName(built.headWord, culture, built.parts, session);
    if (!gate.pass) continue;
    session.add(built.name.toLowerCase());
    out.push({
      name: built.name,
      pronunciation: pronounce(built.headWord, culture.stress),
      parts: built.parts,
      category,
      gloss: built.gloss,
    });
  }
  return out;
}

// ---------------------------------------------------------------- generation

function assemble(rng: () => number, culture: Culture, category: Category): { name: string; parts: { slot: Slot; element: string }[] } {
  const { start, middle, end } = culture.elements;
  const parts: { slot: Slot; element: string }[] = [];
  const s = pick(rng, start);
  parts.push({ slot: "start", element: s });
  let body = s;
  const middles = category === "house" || category === "title" ? (rng() < 0.5 ? 2 : 1)
    : category === "place" ? 1
    : rng() < culture.middleChance ? 1 : 0;
  for (let i = 0; i < middles; i++) {
    const m = pick(rng, middle);
    parts.push({ slot: "middle", element: m });
    body += m;
  }
  const e = pick(rng, end);
  parts.push({ slot: "end", element: e });
  body += e.replace(/^-/, "");
  const name = body[0].toUpperCase() + body.slice(1).toLowerCase();
  return { name, parts };
}

function weightedRoot(rng: () => number, roots: Root[], exclude?: Root): Root {
  let pool = roots.filter(r => r !== exclude);
  const short = pool.filter(r => syllabify(r.form).length <= 2);
  if (short.length >= 6) pool = short; // compounds want short roots
  const total = pool.reduce((t, r) => t + r.weight, 0);
  let x = rng() * total;
  for (const r of pool) { x -= r.weight; if (x <= 0) return r; }
  return pool[pool.length - 1];
}

/** Semantic mode: compose two minted roots, repairing the seam per joinery. */
function assembleSemantic(rng: () => number, culture: Culture): { name: string; gloss: string; parts: { slot: Slot; element: string }[] } {
  const r1 = weightedRoot(rng, culture.roots);
  const r2 = weightedRoot(rng, culture.roots, r1);
  let a = r1.form, b = r2.form;
  const aEndsVowel = isVowel(a[a.length - 1], 1);
  const bStartsVowel = isVowel(b[0], 0);
  if (aEndsVowel && bStartsVowel) b = pick(rng, ["n", "r", "l"]) + b;          // link
  if (!aEndsVowel && !bStartsVowel && !SONORANTS.has(a[a.length - 1])) a = a + pick(rng, ["a", "o", "e"]); // buffer
  const body = a + b;
  const name = body[0].toUpperCase() + body.slice(1);
  return { name, gloss: `${r1.meaning} + ${r2.meaning}`, parts: [{ slot: "start", element: a }, { slot: "end", element: b }] };
}

export function generateBatch(
  culture: Culture,
  category: Category,
  count: number,
  mode: "sound" | "meaning" = "sound",
  rng: () => number = rngFrom(`${culture.seed}::batch::${Date.now()}::${Math.random()}`),
): GeneratedName[] {
  const out: GeneratedName[] = [];
  const session = new Set<string>();
  let attempts = 0;
  const useMeaning = mode === "meaning" && culture.roots.length >= 2;
  while (out.length < count && attempts++ < count * 40) {
    const built = useMeaning ? assembleSemantic(rng, culture) : assemble(rng, culture, category);
    const gate = gateName(built.name, culture, built.parts, session);
    if (!gate.pass) continue;
    session.add(built.name.toLowerCase());
    out.push({
      name: built.name,
      pronunciation: pronounce(built.name, culture.stress),
      parts: built.parts,
      category,
      gloss: (built as { gloss?: string }).gloss,
    });
  }
  return out;
}

// ---------------------------------------------------------------- pin-and-regenerate

/** Star names -> their elements are duplicated into the culture's lists (capped x4)
 *  and the endings subset tightens around theirs. Multiplicity IS the learning loop. */
export function reinforce(culture: Culture, starred: GeneratedName[]): void {
  const capCount = (list: string[], el: string) => list.filter(x => x.toLowerCase() === el.toLowerCase()).length;
  for (const g of starred) {
    for (const p of g.parts) {
      const list = culture.elements[p.slot];
      if (capCount(list, p.element) < 4) list.push(p.element);
    }
  }
  // tighten endings: starred endings first, then the current most-weighted, max 5
  const starredEnds = [...new Set(starred.flatMap(g => g.parts.filter(p => p.slot === "end").map(p => p.element)))];
  if (starredEnds.length > 0) {
    const counts = new Map<string, number>();
    for (const e of culture.elements.end) counts.set(e, (counts.get(e) ?? 0) + 1);
    const rest = [...counts.keys()]
      .filter(e => !starredEnds.some(s => s.toLowerCase() === e.toLowerCase()))
      .sort((x, y) => (counts.get(y) ?? 0) - (counts.get(x) ?? 0));
    const keep = [...starredEnds, ...rest].slice(0, 5);
    culture.elements.end = culture.elements.end.filter(e => keep.some(k => k.toLowerCase() === e.toLowerCase()));
    for (const s of starredEnds) {
      if (capCount(culture.elements.end, s) < 4) culture.elements.end.push(s);
      if (capCount(culture.elements.end, s) < 4) culture.elements.end.push(s);
    }
  }
  culture.summary = oneBreath(culture);
}

// ---------------------------------------------------------------- reverse-seeding from pasted names

function segmentPastedName(raw: string): { start: string; middles: string[]; end: string } | null {
  const w = raw.trim().toLowerCase().replace(/[^a-z]/g, "");
  if (w.length < 3) return null;
  const sylls = syllabify(w);
  if (sylls.length === 1) {
    // single syllable: split at the vowel group
    const m = w.match(/^([^aeiou]*[aeiouy]+)(.*)$/);
    if (!m || !m[2]) return null;
    return { start: cap(m[1]), middles: [], end: "-" + m[2].replace(/^([aeiouy])/, "n$1") };
  }
  let start = sylls[0];
  // starts end in a vowel or sonorant; trim other codas into the next chunk
  while (start.length > 1 && !isVowel(start[start.length - 1], 1) && !SONORANTS.has(start[start.length - 1])) {
    start = start.slice(0, -1);
  }
  let rest = w.slice(start.length);
  let end = sylls[sylls.length - 1];
  if (isVowel(end[0], 0)) {
    // ends begin with a consonant: steal the preceding one
    const prev = rest.slice(0, rest.length - end.length);
    if (prev.length > 0) end = prev[prev.length - 1] + end;
  }
  const middleRaw = rest.slice(0, Math.max(0, rest.length - end.length));
  const middles: string[] = [];
  if (middleRaw.length >= 2 && !isVowel(middleRaw[0], 0)) middles.push(middleRaw);
  return { start: cap(start), middles, end: "-" + end };
}

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

function bigrams(s: string): Set<string> {
  const out = new Set<string>();
  for (let i = 0; i < s.length - 1; i++) out.add(s.slice(i, i + 2));
  return out;
}

/** Score each mood pack by character-bigram overlap with the pasted names; best mood wins. */
export function detectMood(names: string[]): Mood {
  const userGrams = bigrams(names.join("").toLowerCase());
  let best: Mood = "soft", bestScore = -1;
  for (const mood of Object.keys(PHONETIC_PACKS) as Mood[]) {
    const p = PHONETIC_PACKS[mood];
    const packGrams = bigrams([...p.start, ...p.middle, ...p.end].join("").toLowerCase().replace(/-/g, ""));
    let overlap = 0;
    for (const g of userGrams) if (packGrams.has(g)) overlap++;
    const score = overlap / Math.max(1, userGrams.size);
    if (score > bestScore) { bestScore = score; best = mood; }
  }
  return best;
}

/** Reverse-seed: segment the user's names against the joinery model, weight their
 *  elements heavily (x3), backfill sparsely from the best-matching mood pack, and
 *  keep the endings subset tight around theirs. Same machinery as pin-and-regenerate,
 *  pointed at external input. */
export function reverseSeedCulture(cultureName: string, pastedNames: string[], packs: string[] = []): Culture {
  const cleaned = pastedNames.map(n => n.trim()).filter(n => n.length >= 3);
  const mood = detectMood(cleaned);
  const segments = cleaned.map(segmentPastedName).filter((s): s is NonNullable<typeof s> => s !== null);

  const seed = `${cultureName}::from::${cleaned.join("+").toLowerCase()}`;
  const rng = rngFrom(seed + "::backfill");
  const pack = PHONETIC_PACKS[mood];

  const starts: string[] = [], middles: string[] = [], ends: string[] = [];
  for (const seg of segments) {
    for (let k = 0; k < 3; k++) {           // their material dominates: x3 multiplicity
      starts.push(seg.start);
      for (const m of seg.middles) middles.push(m);
      ends.push(seg.end);
    }
  }
  for (const el of sample(rng, pack.start, 6)) if (!starts.some(s => s.toLowerCase() === el.toLowerCase())) starts.push(el);
  for (const el of sample(rng, pack.middle, 5)) if (!middles.some(m => m.toLowerCase() === el.toLowerCase())) middles.push(el);
  for (const el of sample(rng, pack.end, Math.max(2, 4 - new Set(ends).size))) if (!ends.some(e => e.toLowerCase() === el.toLowerCase())) ends.push(el);
  if (middles.length === 0) middles.push(...sample(rng, pack.middle, 5));

  const syllCounts = cleaned.map(n => syllabify(n).length);
  const lo = Math.max(2, Math.min(...syllCounts) - 0);
  const hi = Math.min(5, Math.max(...syllCounts) + 1);

  const culture: Culture = {
    id: seed,
    name: cultureName,
    seed,
    mood,
    register: "balanced",
    familiarity: "familiar",
    environment: "—",
    elements: { start: starts, middle: middles, end: ends },
    middleChance: syllCounts.some(c => c >= 3) ? 0.5 : 0.3,
    syllableRange: [lo, Math.max(lo, hi)],
    stress: mood === "grand" ? "penult" : "initial",
    roots: [],
    appliedPacks: [],
    registry: cleaned.map(n => n.toLowerCase()),   // their names are already taken
    fromNames: cleaned,
    summary: "",
  };
  applySemanticPacks(culture, packs);
  culture.summary = oneBreath(culture);
  return culture;
}

// ---------------------------------------------------------------- the culture card

const MOOD_ADJ: Record<Mood, string> = {
  harsh: "clipped and forceful", soft: "smooth and flowing", bright: "sharp and keen",
  grand: "weighty and old", exotic: "foreign but readable",
};

function topConsonants(culture: Culture, n = 3): string[] {
  const counts = new Map<string, number>();
  const all = [...culture.elements.start, ...culture.elements.middle, ...culture.elements.end].join("").toLowerCase();
  for (const ch of all) if (!VOWELS.has(ch) && ch !== "-" && ch !== "y") counts.set(ch, (counts.get(ch) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(e => e[0]);
}

function topEndings(culture: Culture, n = 2): string[] {
  const counts = new Map<string, number>();
  for (const e of culture.elements.end) {
    const k = e.toLowerCase();
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(e => e[0]);
}

/** Step 2's "explain the culture's names in one breath" — as an output, not a test. */
export function oneBreath(culture: Culture): string {
  const [lo, hi] = culture.syllableRange;
  const avg = (lo + hi) / 2;
  const lengthAdj = avg <= 2.5 ? "short" : avg <= 3.5 ? "measured" : "long and ceremonial";
  const cons = topConsonants(culture);
  const consStr = cons.length >= 2 ? `${cons.slice(0, -1).join(", ")} and ${cons[cons.length - 1]}` : cons.join("");
  const endsStr = topEndings(culture).join(" or ");
  return `${culture.name} names are ${lengthAdj}, ${MOOD_ADJ[culture.mood]}, favour ${consStr}, and usually end in ${endsStr}.`;
}

export interface CultureCard {
  summary: string;
  samples: GeneratedName[];    // 2 personal, 2 house, 2 place
  packs: string[];
  glossaryPreview: { form: string; meaning: string; weight: string }[];
}

export function makeCultureCard(culture: Culture, shuffle = 0): CultureCard {
  const rng = rngFrom(`${culture.seed}::card::${shuffle}`);
  const samples = [
    ...generateBatch(culture, "personal", 2, "sound", rng),
    ...generateBatch(culture, "house", 2, "sound", rng),
    ...generateBatch(culture, "place", 2, "sound", rng),
  ];
  const glossaryPreview = culture.roots
    .filter(r => r.weight >= 2).slice(0, 6)
    .concat(culture.roots.slice(0, 6)).slice(0, 6)
    .map(r => ({ form: r.form, meaning: r.meaning, weight: weightLabel(r.weight) }));
  return { summary: culture.summary || oneBreath(culture), samples, packs: culture.appliedPacks, glossaryPreview };
}

/** Resample the frozen subsets under a fresh sub-seed — "reshuffle the sounds". */
export function reshuffleElements(culture: Culture, salt: string): void {
  const rng = rngFrom(`${culture.seed}::reshuffle::${salt}`);
  culture.elements = culture.familiarity === "alien"
    ? buildProceduralElements(rng, culture.mood)
    : samplePackElements(rng, culture.mood);
  // re-mint is NOT allowed for existing roots (stability promise) — only elements move
  culture.summary = oneBreath(culture);
}

// ---------------------------------------------------------------- language families & drift

export const DRIFT_PRESETS: Record<DriftLevel, number> = {
  dialect: 0.15,
  sister: 0.4,
  distant: 0.7,
};

// Mood-based default pack for DeriveCultureModal (Gap 1 point 4: a user who doesn't care
// still gets a real, sensible result). A taste call, not a structural one.
export const MOOD_DEFAULT_DRIFT_PACK: Record<Mood, string> = {
  harsh: "germanic_hardening",
  soft: "romance_softening",
  bright: "vowel_shift",
  grand: "celtic_lenition",
  exotic: "vowel_melting",
};

const DRIFT_VOWELS = "aeiou";

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Apply one ordered SoundChange rule to a lowercased core word under its environment.
 *  Mirrors tools/drift_validator.py's _apply_rule exactly — same regex semantics per
 *  `when` value, cross-checked word-for-word against its demo output. */
function applyOneRule(word: string, rule: SoundChange): string {
  const f = escapeRegExp(rule.from);
  switch (rule.when) {
    case "always":
      return word.replace(new RegExp(f, "g"), rule.to);
    case "intervocalic":
      return word.replace(new RegExp(`(?<=[${DRIFT_VOWELS}])${f}(?=[${DRIFT_VOWELS}])`, "g"), rule.to);
    case "initial":
      return word.replace(new RegExp(`^${f}`), rule.to);
    case "final":
      return word.replace(new RegExp(`${f}$`), rule.to);
    case "after_vowel":
      return word.replace(new RegExp(`(?<=[${DRIFT_VOWELS}])${f}`, "g"), rule.to);
    case "before_vowel":
      return word.replace(new RegExp(`${f}(?=[${DRIFT_VOWELS}])`, "g"), rule.to);
    case "after_consonant":
      return word.replace(new RegExp(`(?<=[^${DRIFT_VOWELS}])${f}`, "g"), rule.to);
    case "before_consonant":
      return word.replace(new RegExp(`${f}(?=[^${DRIFT_VOWELS}])`, "g"), rule.to);
    case "unstressed": {
      // approximation matching the Python validator: everything after the first vowel
      // counts as unstressed.
      const m = word.match(new RegExp(`[${DRIFT_VOWELS}]`));
      if (!m || m.index === undefined) return word;
      const headEnd = m.index + 1;
      return word.slice(0, headEnd) + word.slice(headEnd).replace(new RegExp(f, "g"), rule.to);
    }
  }
}

/** Run one DriftPack's rules IN ORDER over one word, each rule firing with probability
 *  `intensity` (order matters — feeding chains like p>b then b>v are intentional).
 *  Preserves a leading "-" (end-slot marker) and initial capitalization (start-slot marker). */
function driftWord(rng: () => number, word: string, pack: DriftPack, intensity: number): string {
  const hasLeadingDash = word.startsWith("-");
  const hasCap = /^[A-Z]/.test(word.replace(/^-/, ""));
  let w = word.replace(/^-/, "").toLowerCase();
  for (const rule of pack.rules) {
    if (rng() < intensity) w = applyOneRule(w, rule);
  }
  if (w.length === 0) w = word.replace(/^-/, "").toLowerCase();
  if (hasCap) w = w[0].toUpperCase() + w.slice(1);
  return hasLeadingDash ? "-" + w : w;
}

/** Fold a word through stacked packs in order (pack 1's full pass, then pack 2 on the
 *  result, etc.). The engine API accepts multiple packs for future stacking; today's UI
 *  only ever supplies one. */
function driftWordWithPacks(rng: () => number, word: string, packs: DriftPack[], intensity: number): string {
  return packs.reduce((acc, pack) => driftWord(rng, acc, pack, intensity), word);
}

function driftElementSet(rng: () => number, elements: ElementSet, packs: DriftPack[], intensity: number): ElementSet {
  return {
    start: elements.start.map(el => driftWordWithPacks(rng, el, packs, intensity)),
    middle: elements.middle.map(el => driftWordWithPacks(rng, el, packs, intensity)),
    end: elements.end.map(el => driftWordWithPacks(rng, el, packs, intensity)),
  };
}

// Gap 6 — spelling mode, consumed wherever a Root's form gets drifted. "etymological" skips
// drifting a root whose origin is machine-marked as a blend ("a+b", from mergeCultures) so
// the compound stays visibly legible; "phonetic" (default) drifts everything, letting sound
// changes erode compounds like any other form. A compound-marked root can persist across
// generations via ordinary root-copying (deriveCulture, ageCulture), not just at the merge
// that created it, so this is consumed everywhere a Root is drifted, not only in mergeCultures.
export type SpellingMode = "etymological" | "phonetic";

function driftRootForm(rng: () => number, root: Root, packs: DriftPack[], intensity: number, spellingMode: SpellingMode): string {
  if (spellingMode === "etymological" && root.origin.includes("+")) return root.form;
  return driftWordWithPacks(rng, root.form, packs, intensity);
}

/** Derive a descendant Culture from a parent via sound-change drift. Vocabulary meanings
 *  are preserved (a family's relatedness is semantic, per the mint-stability promise) but
 *  forms — and the frozen element set that generates new names — evolve away from the
 *  parent's under the chosen preset, so the branch reads as related but distinct. */
export function deriveCulture(
  parent: Culture,
  name: string,
  driftLevel: DriftLevel,
  driftPackIds: string[],
  overrides: { environment?: string; packs?: string[] } = {},
  spellingMode: SpellingMode = "phonetic",
): Culture {
  const intensity = DRIFT_PRESETS[driftLevel];
  const packs = driftPackIds.map(id => DRIFT_PACKS[id]).filter((p): p is DriftPack => !!p);
  const seed = `${name}::from::${parent.id}::${Date.now().toString(36)}`;
  const rng = rngFrom(seed + "::drift");

  const elements = driftElementSet(rng, parent.elements, packs, intensity);
  const roots: Root[] = parent.roots.map(r => ({ ...r, form: driftRootForm(rng, r, packs, intensity, spellingMode) }));

  const culture: Culture = {
    id: seed,
    name,
    seed,
    mood: parent.mood,
    register: parent.register,
    familiarity: parent.familiarity,
    environment: overrides.environment ?? parent.environment,
    elements,
    middleChance: parent.middleChance,
    syllableRange: [...parent.syllableRange] as [number, number],
    stress: parent.stress,
    roots,
    appliedPacks: [...parent.appliedPacks],
    registry: [],
    summary: "",
    parentIds: [parent.id],
    generation: (parent.generation ?? 0) + 1,
    driftLevel,
    driftPackIds,
    driftMode: "family",
  };

  if (overrides.packs?.length) {
    applySemanticPacks(culture, [...new Set([...culture.appliedPacks, ...overrides.packs])]);
  }
  culture.summary = oneBreath(culture);
  return culture;
}

/** Merge 2+ parent Cultures into a new one via language contact: phonology is pooled
 *  proportionally from every parent, shared-meaning vocabulary is blended into hybrid
 *  forms (not just inherited from one side), and a lighter drift pass runs on top to
 *  represent the variety settling after contact. */
export function mergeCultures(
  parents: Culture[],
  name: string,
  driftLevel: DriftLevel,
  driftPackIds: string[],
  overrides: { environment?: string; packs?: string[] } = {},
  spellingMode: SpellingMode = "phonetic",
): Culture {
  if (parents.length < 2) throw new Error("mergeCultures requires at least two parents");
  const packs = driftPackIds.map(id => DRIFT_PACKS[id]).filter((p): p is DriftPack => !!p);

  const seed = `${name}::merge::${parents.map(p => p.id).join("+")}::${Date.now().toString(36)}`;
  const rng = rngFrom(seed + "::merge");

  const mergeSlot = (slot: Slot, targetSize: number): string[] => {
    const per = Math.max(1, Math.round(targetSize / parents.length));
    const pooled = parents.flatMap(p => sample(rng, p.elements[slot], per));
    const seen = new Set<string>();
    const out = pooled.filter(el => {
      const k = el.toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
    if (out.length < targetSize) {
      const rest = parents.flatMap(p => p.elements[slot]).filter(el => !seen.has(el.toLowerCase()));
      out.push(...sample(rng, rest, targetSize - out.length));
    }
    return out.slice(0, targetSize);
  };
  const elements: ElementSet = {
    start: mergeSlot("start", 10),
    middle: mergeSlot("middle", 8),
    end: mergeSlot("end", 5),
  };

  const byMeaning = new Map<string, Root[]>();
  for (const p of parents) {
    for (const r of p.roots) {
      if (!byMeaning.has(r.meaning)) byMeaning.set(r.meaning, []);
      byMeaning.get(r.meaning)!.push(r);
    }
  }
  const roots: Root[] = [];
  for (const [meaning, variants] of byMeaning) {
    if (variants.length === 1) {
      roots.push({ ...variants[0] });
      continue;
    }
    const [a, b] = sample(rng, variants, 2);
    const sylA = syllabify(a.form), sylB = syllabify(b.form);
    const cutA = Math.max(1, Math.floor(sylA.length / 2));
    const cutB = Math.floor(sylB.length / 2);
    let blended = sylA.slice(0, cutA).join("") + sylB.slice(cutB).join("");
    blended = blended.replace(/[aeiou]{3,}/g, m => m.slice(0, 2));
    if (blended.length < 3) blended = a.form;
    roots.push({
      form: blended[0].toUpperCase() + blended.slice(1).toLowerCase(),
      meaning,
      origin: `${a.origin}+${b.origin}`,
      weight: Math.min(3, Math.max(a.weight, b.weight)),
      tags: [...new Set([...(a.tags ?? []), ...(b.tags ?? [])])], // ?? guards roots saved before tags existed
    });
  }

  const modeOf = <T,>(values: T[]): T => {
    const counts = new Map<string, { v: T; n: number }>();
    for (const v of values) {
      const k = String(v);
      const e = counts.get(k);
      if (e) e.n++; else counts.set(k, { v, n: 1 });
    }
    const max = Math.max(...[...counts.values()].map(e => e.n));
    const tied = [...counts.values()].filter(e => e.n === max).map(e => e.v);
    return pick(rng, tied);
  };

  const syllLo = Math.min(...parents.map(p => p.syllableRange[0]));
  const syllHi = Math.max(...parents.map(p => p.syllableRange[1]));

  const culture: Culture = {
    id: seed,
    name,
    seed,
    mood: modeOf(parents.map(p => p.mood)),
    register: modeOf(parents.map(p => p.register)),
    familiarity: modeOf(parents.map(p => p.familiarity)),
    environment: overrides.environment ?? parents[0].environment,
    elements,
    middleChance: parents.reduce((t, p) => t + p.middleChance, 0) / parents.length,
    syllableRange: [syllLo, Math.max(syllLo, syllHi)],
    stress: modeOf(parents.map(p => p.stress)),
    roots,
    appliedPacks: [...new Set(parents.flatMap(p => p.appliedPacks))],
    registry: [],
    summary: "",
    parentIds: parents.map(p => p.id),
    generation: Math.max(...parents.map(p => p.generation ?? 0)) + 1,
    driftLevel,
    driftPackIds,
    driftMode: "family-contact",
  };

  const intensity = DRIFT_PRESETS[driftLevel] * 0.5;
  culture.elements = driftElementSet(rng, culture.elements, packs, intensity);
  culture.roots = culture.roots.map(r => ({ ...r, form: driftRootForm(rng, r, packs, intensity, spellingMode) }));

  if (overrides.packs?.length) {
    applySemanticPacks(culture, [...new Set([...culture.appliedPacks, ...overrides.packs])]);
  }
  culture.summary = oneBreath(culture);
  return culture;
}

/** Gap 2, Level 1 — "a single language, aged." Unlike deriveCulture/mergeCultures, this
 *  creates NO new Culture node: no id, no parentIds/generation bump, no driftMode. It is a
 *  pure, non-mutating preview that shows a culture's stably-minted roots/elements (archaic,
 *  untouched, returned by reference) alongside a worn "modern" form computed fresh each call
 *  and never written back — the stable-minting promise (a culture's roots are never
 *  re-minted) is never at risk because nothing here is persisted. Deterministic: the same
 *  culture+pack+level always reproduces the same archaic/modern pair. */
export interface AgedSnapshot {
  archaic: { elements: ElementSet; roots: Root[]; samples: GeneratedName[] };
  modern: { elements: ElementSet; roots: Root[]; samples: GeneratedName[] };
  packId: string;
  driftLevel: DriftLevel;
}

export function ageCulture(
  culture: Culture,
  packId: string,
  driftLevel: DriftLevel,
  category: Category = "personal",
  spellingMode: SpellingMode = "phonetic",
): AgedSnapshot {
  const pack = DRIFT_PACKS[packId];
  if (!pack) throw new Error(`ageCulture: unknown drift pack '${packId}'`);
  const intensity = DRIFT_PRESETS[driftLevel];

  const driftRng = rngFrom(`${culture.seed}::age::${packId}::${driftLevel}`);
  const modernElements = driftElementSet(driftRng, culture.elements, [pack], intensity);
  const modernRoots: Root[] = culture.roots.map(r => ({
    ...r,
    form: driftRootForm(driftRng, r, [pack], intensity, spellingMode),
  }));
  // Ephemeral view-only object — never assigned an id, never persisted, thrown away
  // after this call. culture.roots/elements themselves are never written to.
  const modernView: Culture = { ...culture, elements: modernElements, roots: modernRoots };

  const archaicRng = rngFrom(`${culture.seed}::age::samples::archaic::${packId}::${driftLevel}`);
  const modernSampleRng = rngFrom(`${culture.seed}::age::samples::modern::${packId}::${driftLevel}`);

  return {
    archaic: {
      elements: culture.elements,
      roots: culture.roots,
      samples: generateBatch(culture, category, 3, "sound", archaicRng),
    },
    modern: {
      elements: modernElements,
      roots: modernRoots,
      samples: generateBatch(modernView, category, 3, "sound", modernSampleRng),
    },
    packId,
    driftLevel,
  };
}

/** Gap 4 — resolve which Culture a place name should actually draw its roots/elements
 *  from: walk `culture.parentIds` up to the place type's default drift depth, so a
 *  "feature" (deepest) can carry an ancestral form while a "settlement" (depth 0) always
 *  uses the culture as-is. At each hop with 2+ parents (a merge/contact-blend), follows
 *  the oldest/least-drifted one — lowest generation, tie-broken by lowest drift intensity —
 *  as the best approximation of "the most conservative surviving branch." Stops early if
 *  the lineage runs out before the depth does. */
export function resolvePlaceSourceCulture(culture: Culture, allCultures: Culture[], placeType: PlaceType): Culture {
  let current = culture;
  let hops = PLACE_TYPE_DRIFT_DEPTH[placeType];
  while (hops > 0) {
    const parents = (current.parentIds ?? [])
      .map(id => allCultures.find(c => c.id === id))
      .filter((c): c is Culture => !!c);
    if (parents.length === 0) break;
    current = parents.reduce((best, p) => {
      const bg = best.generation ?? 0, pg = p.generation ?? 0;
      if (pg !== bg) return pg < bg ? p : best;
      const bi = best.driftLevel ? DRIFT_PRESETS[best.driftLevel] : 0;
      const pi = p.driftLevel ? DRIFT_PRESETS[p.driftLevel] : 0;
      return pi < bi ? p : best;
    });
    hops--;
  }
  return current;
}

// ---------------------------------------------------------------- contact graph (Gap 3)

export type ContactType = "prestige" | "substrate" | "adstrate";
export type ContactDomain = "administration" | "religion" | "warfare" | "trade" | "place-features";

export interface ContactEdge {
  id: string;
  donorId: string;
  borrowerId: string;
  contactType: ContactType;
  strength: number;        // 0..1, share of donor vocabulary that crosses
  domains: ContactDomain[];
}

// Which concept-packs.json tags a domain draws on, for biasing which donor roots cross.
const CONTACT_DOMAIN_TAGS: Record<ContactDomain, string[]> = {
  administration: ["rank"],
  religion: ["sacred"],
  warfare: ["war", "weapon"],
  trade: ["trade", "wealth", "craft"],
  "place-features": ["place", "mountain", "river", "water", "sea", "forest", "earth", "settlement"],
};

/** A lightweight phonotactic check for a borrowed word — reuses the same LEGAL_ONSETS set
 *  the procedural element-builder uses, rather than the full gateName gate (which needs a
 *  `parts` breakdown a raw borrowed word doesn't have). Vowel-initial words pass trivially. */
function legalOnset(word: string): boolean {
  const w = word.replace(/^-/, "").toLowerCase();
  const m = w.match(/^[^aeiou]*/);
  const onset = m ? m[0] : "";
  return onset === "" || LEGAL_ONSETS.has(onset);
}

export interface ContactPreview {
  loanedRoots: Root[];
  samples: GeneratedName[];
}

/** Gap 3 — preview what a contact edge would lend the borrower: pick donor roots (biased
 *  toward the edge's domains via CONTACT_DOMAIN_TAGS, falling back to the whole donor
 *  vocabulary if too few match), reshape each via the prestige_exonym pack (the Confucius
 *  mechanic — a donor form worn to the borrower's simpler phonology), drop anything that
 *  fails the borrower's phonotactics or collides with its existing roots, and generate a
 *  few samples from an ephemeral borrower-plus-loans view. Pure and non-mutating — nothing
 *  here touches the real borrower Culture; see acceptLoanedRoots for the explicit,
 *  user-consented step that actually saves loanwords. */
export function previewContactEdge(donor: Culture, borrower: Culture, edge: ContactEdge, category: Category = "personal"): ContactPreview {
  const rng = rngFrom(`${edge.id}::contact::${donor.id}::${borrower.id}`);
  const domainTags = edge.domains.flatMap(d => CONTACT_DOMAIN_TAGS[d]);
  const matching = domainTags.length
    ? donor.roots.filter(r => (r.tags ?? []).some(t => domainTags.includes(t)))
    : [];
  const pool = matching.length >= 3 ? matching : donor.roots;
  const count = Math.max(1, Math.round(edge.strength * pool.length));
  const chosen = sample(rng, pool, Math.min(count, pool.length));

  const reshapePack = DRIFT_PACKS.prestige_exonym;
  const existingForms = borrower.roots.map(r => r.form.toLowerCase());
  const loanedRoots: Root[] = [];
  for (const donorRoot of chosen) {
    const reshaped = driftWordWithPacks(rng, donorRoot.form, [reshapePack], 1);
    if (!legalOnset(reshaped)) continue;
    if (existingForms.some(f => levenshtein(reshaped.toLowerCase(), f) < 2)) continue;
    existingForms.push(reshaped.toLowerCase());
    loanedRoots.push({
      form: reshaped[0].toUpperCase() + reshaped.slice(1).toLowerCase(),
      meaning: donorRoot.meaning,
      origin: `loan:${donor.id}`,
      weight: 1,
      tags: donorRoot.tags ?? [],
      loanOrigin: { donorCultureId: donor.id, edgeId: edge.id },
    });
  }

  const previewCulture: Culture = { ...borrower, roots: [...borrower.roots, ...loanedRoots] };
  const sampleRng = rngFrom(`${edge.id}::contact::samples`);
  const samples = generateBatch(previewCulture, category, 3, "sound", sampleRng);

  return { loanedRoots, samples };
}

/** The one explicit, user-consented mutation point for contact: pushes any loanedRoots not
 *  already present (by lowercase form) onto the borrower's SAVED roots[]. Additive — new
 *  root entries, never a re-mint of an existing one — so this doesn't touch the
 *  stable-minting promise. Caller is responsible for persisting the culture afterward. */
export function acceptLoanedRoots(borrower: Culture, loanedRoots: Root[]): void {
  const existingForms = new Set(borrower.roots.map(r => r.form.toLowerCase()));
  for (const r of loanedRoots) {
    if (!existingForms.has(r.form.toLowerCase())) {
      borrower.roots.push(r);
      existingForms.add(r.form.toLowerCase());
    }
  }
}

// ---------------------------------------------------------------- markdown export

export function cultureNote(culture: Culture, allCultures: Culture[] = []): string {
  const card = makeCultureCard(culture);
  const lines: string[] = [];
  lines.push("---");
  lines.push(`languageforge-culture: ${culture.name}`);
  lines.push(`seed: "${culture.seed}"`);
  lines.push(`mood: ${culture.mood}`);
  lines.push(`register: ${culture.register}`);
  lines.push(`packs: [${culture.appliedPacks.join(", ")}]`);
  lines.push("---");
  lines.push("");
  lines.push(`# ${culture.name}`);
  lines.push("");
  lines.push(`> ${card.summary}`);
  lines.push("");
  if (culture.fromNames?.length) {
    lines.push(`Seeded from your own names: ${culture.fromNames.join(", ")}.`);
    lines.push("");
  }

  const parents = (culture.parentIds ?? [])
    .map(id => allCultures.find(c => c.id === id))
    .filter((c): c is Culture => !!c);
  const descendants = allCultures.filter(c => c.parentIds?.includes(culture.id));
  if (parents.length > 0 || descendants.length > 0) {
    lines.push("## Family");
    lines.push("");
    const packLabel = culture.driftPackIds?.length ? ` via ${culture.driftPackIds.join(" + ")}` : "";
    if (parents.length === 1) {
      lines.push(`Descended from: **${parents[0].name}** (generation ${culture.generation ?? 1}, drift: ${culture.driftLevel ?? "unknown"}${packLabel})`);
    } else if (parents.length >= 2) {
      lines.push(`Merged from: ${parents.map(p => `**${p.name}**`).join(" + ")} (generation ${culture.generation ?? 1}, contact drift: ${culture.driftLevel ?? "unknown"}${packLabel})`);
    }
    if (culture.driftPackIds?.length) {
      const flavor = culture.driftPackIds
        .map(id => DRIFT_PACKS[id]?.plainDescription)
        .filter((s): s is string => !!s)
        .join(" ");
      if (flavor) lines.push(`*${flavor}*`);
    }
    if (descendants.length > 0) {
      lines.push(`Descendants: ${descendants.map(d => d.name).join(", ")}`);
    }
    lines.push("");
  }

  lines.push("## Sound elements");
  lines.push("");
  lines.push(`Starts: ${culture.elements.start.join(", ")}`);
  lines.push("");
  lines.push(`Middles: ${culture.elements.middle.join(", ")}`);
  lines.push("");
  lines.push(`Endings: ${culture.elements.end.join(", ")}`);
  lines.push("");

  lines.push("## Sample names");
  lines.push("");
  for (const s of card.samples) lines.push(`- **${s.name}** (${s.category}) — say it: *${s.pronunciation}*`);
  lines.push("");
  lines.push("## Glossary");
  lines.push("");
  lines.push("| Form | Meaning | Frequency |");
  lines.push("|---|---|---|");
  for (const r of culture.roots.slice().sort((a, b) => b.weight - a.weight)) {
    lines.push(`| ${r.form} | ${r.meaning} | ${weightLabel(r.weight)} |`);
  }
  lines.push("");
  lines.push("## Accepted names");
  lines.push("");
  for (const n of culture.registry) lines.push(`- ${n[0].toUpperCase() + n.slice(1)}`);
  lines.push("");
  return lines.join("\n");
}
