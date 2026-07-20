// engine.ts — the whole of languageForge's naming engine, pure and testable (no Obsidian imports).
// Implements: unified assembler (pack path + procedural path -> one joinery model),
// stable seeded minting with uniqueness check, capped multiplicity weighting,
// reverse-seeding from pasted names, pin-and-regenerate, pronunciation hints,
// the Step 6 gates (lite), and the culture card.

import { PHONETIC_PACKS, SEMANTIC_PACKS } from "./data";

// ---------------------------------------------------------------- types

export type Mood = "harsh" | "soft" | "bright" | "grand" | "exotic";
export type Register = "ancient" | "balanced" | "modern";
export type Category = "personal" | "house" | "place";
export type Slot = "start" | "middle" | "end";

export interface ElementSet { start: string[]; middle: string[]; end: string[]; }

export interface Root {
  form: string;
  meaning: string;
  origin: string;          // pack the concept came from
  weight: number;          // capped multiplicity: 1 normal, 2 common, 3 dominant, 0.5 rare (user demotion)
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

const ENV_DEFAULT_PACK: Record<string, string> = {
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
  const weightOf = new Map<string, { w: number; origin: string }>();
  for (const packName of applied) {
    for (const concept of SEMANTIC_PACKS[packName].concepts) {
      const cur = weightOf.get(concept);
      if (cur) cur.w = Math.min(3, cur.w + 1);
      else weightOf.set(concept, { w: 1, origin: packName });
    }
  }
  const existingByMeaning = new Map(culture.roots.map(r => [r.meaning, r]));
  const forms = culture.roots.map(r => r.form);
  const roots: Root[] = [];
  for (const [meaning, { w, origin }] of weightOf) {
    const prior = existingByMeaning.get(meaning);
    if (prior) { prior.weight = prior.weight === 0.5 ? 0.5 : w; roots.push(prior); continue; } // mints are stable: never re-mint
    const form = mintForm(culture, meaning, forms);
    forms.push(form);
    roots.push({ form, meaning, origin, weight: w });
  }
  culture.roots = roots;
}

export function weightLabel(w: number): string {
  return w >= 3 ? "dominant" : w >= 2 ? "common" : w >= 1 ? "normal" : "rare";
}

// ---------------------------------------------------------------- generation

function assemble(rng: () => number, culture: Culture, category: Category): { name: string; parts: { slot: Slot; element: string }[] } {
  const { start, middle, end } = culture.elements;
  const parts: { slot: Slot; element: string }[] = [];
  const s = pick(rng, start);
  parts.push({ slot: "start", element: s });
  let body = s;
  const middles = category === "house" ? (rng() < 0.5 ? 2 : 1)
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

// ---------------------------------------------------------------- markdown export

export function cultureNote(culture: Culture): string {
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
