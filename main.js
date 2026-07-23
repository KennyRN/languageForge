"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => LanguageForgePlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");

// src/data.ts
var PHONETIC_PACKS = {
  "harsh": {
    "start": [
      "Ka",
      "Kro",
      "Gra",
      "Dru",
      "Gro",
      "Bra",
      "Dra",
      "Gru",
      "Kae",
      "Tro",
      "Skra",
      "Vra",
      "Zar",
      "Kor",
      "Dro"
    ],
    "middle": [
      "kta",
      "gda",
      "rka",
      "tro",
      "dra",
      "gna",
      "kra",
      "rna",
      "gto",
      "dko",
      "kar",
      "gorn"
    ],
    "end": [
      "-kar",
      "-gorn",
      "-drak",
      "-tuk",
      "-gath",
      "-korr",
      "-dun",
      "-grim",
      "-tak",
      "-druk",
      "-gnar",
      "-krag"
    ]
  },
  "soft": {
    "start": [
      "Ae",
      "Ela",
      "Mae",
      "Li",
      "Na",
      "Lae",
      "Elo",
      "Ali",
      "Nae",
      "Ona",
      "Ila",
      "Elya",
      "Oli",
      "Ma"
    ],
    "middle": [
      "lia",
      "mena",
      "noli",
      "lela",
      "ria",
      "lae",
      "moa",
      "nia",
      "lena",
      "mira",
      "lor",
      "nan"
    ],
    "end": [
      "-lian",
      "-mel",
      "-nor",
      "-lia",
      "-wen",
      "-mor",
      "-riel",
      "-len",
      "-nal",
      "-mira",
      "-lyn",
      "-nel"
    ]
  },
  "bright": {
    "start": [
      "Si",
      "Se",
      "Sha",
      "Isi",
      "Esi",
      "Sei",
      "Ti",
      "Zi",
      "Shi",
      "Sae",
      "Ise",
      "Eshi",
      "Asi"
    ],
    "middle": [
      "sil",
      "sisha",
      "sesi",
      "sita",
      "sia",
      "sse",
      "shi",
      "ssi",
      "siti",
      "sesha",
      "ser",
      "sin"
    ],
    "end": [
      "-sil",
      "-shen",
      "-tis",
      "-kis",
      "-sith",
      "-lish",
      "-sen",
      "-riss",
      "-shil",
      "-kit",
      "-sis",
      "-cen"
    ]
  },
  "grand": {
    "start": [
      "A",
      "O",
      "Aro",
      "Ola",
      "Ora",
      "Alo",
      "Amo",
      "Ono",
      "Ava",
      "Oro",
      "Aldo",
      "Auro",
      "Orda"
    ],
    "middle": [
      "nala",
      "moro",
      "nama",
      "dano",
      "dona",
      "mora",
      "lova",
      "noma",
      "daro",
      "nola",
      "mor",
      "lon"
    ],
    "end": [
      "-don",
      "-mor",
      "-thal",
      "-gorn",
      "-noth",
      "-dor",
      "-mon",
      "-rath",
      "-bal",
      "-moran",
      "-domos",
      "-daion"
    ]
  },
  "exotic": {
    "start": [
      "Zae",
      "Roi",
      "Eu",
      "Nae",
      "Voi",
      "Jae",
      "Kai",
      "Ai",
      "Qua",
      "Tsa",
      "Vae",
      "Zoi",
      "Nei"
    ],
    "middle": [
      "vaeda",
      "noira",
      "leuna",
      "naixa",
      "doela",
      "naewa",
      "luina",
      "noena",
      "vaeno",
      "neir"
    ],
    "end": [
      "-vaeth",
      "-doir",
      "-neun",
      "-nael",
      "-raen",
      "-luin",
      "-noen",
      "-zyth",
      "-vaal",
      "-teir",
      "-naum"
    ]
  }
};
var SEMANTIC_PACKS = {
  "core": {
    "additive": false,
    "concepts": [
      "strong",
      "wise",
      "noble",
      "fair",
      "bright",
      "swift",
      "brave",
      "true",
      "free",
      "high",
      "old",
      "young",
      "great",
      "fierce",
      "gentle",
      "proud",
      "bold",
      "pure",
      "dark",
      "light",
      "man",
      "woman",
      "child",
      "son",
      "daughter",
      "born-of",
      "kin",
      "elder",
      "chief",
      "lord",
      "lady",
      "guardian",
      "gift",
      "hope",
      "joy",
      "fortune",
      "blessed",
      "beloved",
      "honoured",
      "far-seeing",
      "stone",
      "river",
      "hill",
      "star",
      "sun",
      "moon",
      "sky",
      "flame",
      "wind",
      "dawn",
      "wolf",
      "hawk",
      "bear",
      "stag",
      "raven",
      "lion",
      "serpent",
      "eagle",
      "horse",
      "hound",
      "iron",
      "gold",
      "silver",
      "oak",
      "ash",
      "thorn",
      "shield",
      "spear",
      "crown",
      "oath"
    ]
  },
  "warrior": {
    "additive": true,
    "concepts": [
      "sword",
      "blade",
      "axe",
      "spear",
      "shield",
      "war",
      "battle",
      "valour",
      "victory",
      "conquest",
      "blood",
      "fury",
      "wrath",
      "iron",
      "steel",
      "banner",
      "fortress",
      "strike",
      "wound",
      "vengeance",
      "guard",
      "warband",
      "champion",
      "scar",
      "siege",
      "rally",
      "onslaught",
      "bane",
      "unbroken",
      "deathless"
    ]
  },
  "seafaring": {
    "additive": true,
    "concepts": [
      "sea",
      "wave",
      "tide",
      "salt",
      "storm",
      "harbour",
      "sail",
      "ship",
      "deep",
      "current",
      "foam",
      "anchor",
      "horizon",
      "island",
      "shore",
      "fathom",
      "gull",
      "brine",
      "reef",
      "squall",
      "voyage",
      "mast",
      "keel",
      "drowned",
      "far-shore",
      "seaborne",
      "spray",
      "leviathan",
      "beacon",
      "helm"
    ]
  },
  "mountain": {
    "additive": true,
    "concepts": [
      "peak",
      "granite",
      "cliff",
      "snow",
      "ore",
      "ridge",
      "cavern",
      "echo",
      "avalanche",
      "summit",
      "delve",
      "deep-road",
      "frost",
      "eagle",
      "chasm",
      "boulder",
      "scree",
      "glacier",
      "hold",
      "highborn"
    ]
  },
  "forest": {
    "additive": true,
    "concepts": [
      "leaf",
      "root",
      "thorn",
      "oak",
      "moss",
      "grove",
      "green",
      "hunt",
      "shadow",
      "antler",
      "briar",
      "hollow",
      "fern",
      "boar",
      "vine",
      "wildwood",
      "trail",
      "quiet",
      "undergrowth",
      "evergreen"
    ]
  },
  "arcane": {
    "additive": true,
    "concepts": [
      "rune",
      "veil",
      "spell",
      "spirit",
      "dream",
      "ward",
      "ether",
      "glyph",
      "star",
      "moon",
      "hollow",
      "whisper",
      "sigil",
      "aether",
      "unseen",
      "threshold",
      "binding",
      "far-mind",
      "twilight",
      "wyrd"
    ]
  },
  "desert": {
    "additive": true,
    "concepts": [
      "sand",
      "sun",
      "dune",
      "mirage",
      "ember",
      "scorpion",
      "dry",
      "oasis",
      "dust",
      "glare",
      "thirst",
      "wanderer",
      "caravan",
      "scorched",
      "sirocco",
      "waterless",
      "flint",
      "vulture",
      "far-road",
      "sunblind"
    ]
  },
  "mercantile": {
    "additive": true,
    "concepts": [
      "coin",
      "gate",
      "guild",
      "road",
      "market",
      "bell",
      "ledger",
      "tower",
      "key",
      "scale",
      "bridge",
      "toll",
      "banker",
      "contract",
      "quarter",
      "counting-house",
      "seal",
      "vault",
      "wheelwright",
      "highroad"
    ]
  },
  "priestly": {
    "additive": true,
    "concepts": [
      "light",
      "temple",
      "prayer",
      "saint",
      "vow",
      "dawn",
      "incense",
      "pilgrim",
      "grace",
      "ash",
      "relic",
      "hymn",
      "cloister",
      "penitent",
      "sanctified",
      "vigil",
      "sacred-fire",
      "confessor",
      "shroud",
      "benediction"
    ]
  },
  "agrarian": {
    "additive": true,
    "concepts": [
      "field",
      "grain",
      "harvest",
      "ox",
      "plough",
      "hearth",
      "seed",
      "meadow",
      "shepherd",
      "orchard",
      "furrow",
      "millstone",
      "cattle",
      "well-fed",
      "sunlit",
      "homestead",
      "scythe",
      "fallow",
      "greenrow",
      "goodhearth"
    ]
  }
};

// src/engine.ts
function xmur3(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = h << 13 | h >>> 19;
  }
  return () => {
    h = Math.imul(h ^ h >>> 16, 2246822507);
    h = Math.imul(h ^ h >>> 13, 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}
function mulberry32(a) {
  return () => {
    a |= 0;
    a = a + 1831565813 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function rngFrom(seed) {
  return mulberry32(xmur3(seed)());
}
function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}
function sample(rng, arr, n) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(n, copy.length));
}
var VOWELS = new Set("aeiou");
var SONORANTS = new Set("lrn");
var LEGAL_ONSETS = /* @__PURE__ */ new Set([
  ..."bcdfghjklmnpqrstvwz",
  "sh",
  "ch",
  "th",
  "wh",
  "qu",
  "bl",
  "br",
  "cl",
  "cr",
  "dr",
  "dw",
  "fl",
  "fr",
  "gl",
  "gr",
  "gn",
  "kl",
  "kr",
  "pl",
  "pr",
  "sc",
  "sk",
  "sl",
  "sm",
  "sn",
  "sp",
  "st",
  "sw",
  "tr",
  "tw",
  "scr",
  "skr",
  "spl",
  "spr",
  "str",
  "shr",
  "thr",
  "squ"
]);
var NAME_BLOCKLIST = ["obam", "hitler", "stalin", "noel", "jesus", "allah", "satan"];
var isVowel = (c, i) => VOWELS.has(c) || c === "y" && i > 0;
function syllabify(word) {
  const w = word.toLowerCase();
  const nuclei = [];
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
  const sylls = [];
  let startIdx = 0;
  for (let n = 0; n < nuclei.length - 1; n++) {
    const clusterStart = nuclei[n][1];
    const clusterEnd = nuclei[n + 1][0];
    const cluster = w.slice(clusterStart, clusterEnd);
    let onsetLen = 0;
    for (let len = Math.min(3, cluster.length); len >= 1; len--) {
      if (LEGAL_ONSETS.has(cluster.slice(cluster.length - len))) {
        onsetLen = len;
        break;
      }
    }
    if (cluster.length === 1) onsetLen = 1;
    if (onsetLen === 0) onsetLen = 1;
    const boundary = clusterEnd - onsetLen;
    sylls.push(w.slice(startIdx, boundary));
    startIdx = boundary;
  }
  sylls.push(w.slice(startIdx));
  return sylls.filter((s) => s.length > 0);
}
var NUCLEUS_MAP = {
  ae: "ay",
  ai: "eye",
  ei: "ay",
  ey: "ay",
  oi: "oy",
  oy: "oy",
  au: "ow",
  eu: "yoo",
  ou: "oo",
  ui: "wee",
  ua: "wah",
  oe: "oh",
  ao: "ah-oh",
  io: "ee-oh",
  ia: "ee-ah",
  ea: "ay-ah",
  aio: "ay-oh",
  oa: "oh-ah",
  ya: "yah",
  yo: "yoh"
};
function respellSyllable(syl, isFinal) {
  var _a, _b, _c;
  let s = syl;
  s = s.replace(/c(?=[ei])/g, "s").replace(/c/g, "k").replace(/qu/g, "kw");
  let n0 = -1, n1 = -1;
  for (let i = 0; i < s.length; i++) {
    if (isVowel(s[i], i)) {
      if (n0 < 0) n0 = i;
      n1 = i + 1;
    } else if (n0 >= 0) break;
  }
  if (n0 < 0) return s;
  const onset = s.slice(0, n0), nucleus = s.slice(n0, n1), coda = s.slice(n1);
  if (coda.startsWith("r") && ["ai", "ei", "ae", "oi", "eir", "air"].includes(nucleus)) {
    return onset + nucleus + coda;
  }
  let spoken = (_a = NUCLEUS_MAP[nucleus]) != null ? _a : NUCLEUS_MAP[nucleus.replace(/y/g, "i")];
  if (!spoken) {
    const open = coda.length === 0;
    const v = nucleus.replace(/y/g, "i");
    if (open) spoken = (_b = { a: "ah", e: isFinal ? "eh" : "eh", i: "ee", o: "oh", u: "oo" }[v]) != null ? _b : v;
    else spoken = (_c = { a: "a", e: "e", i: "i", o: "o", u: "u" }[v]) != null ? _c : v;
  }
  return onset + spoken + coda;
}
function pronounce(name, stress = "initial") {
  const sylls = syllabify(name);
  const stressIdx = sylls.length <= 1 ? 0 : stress === "initial" ? 0 : Math.max(0, sylls.length - 2);
  return sylls.map((s, i) => {
    const spoken = respellSyllable(s, i === sylls.length - 1);
    return i === stressIdx ? spoken.toUpperCase() : spoken.toLowerCase();
  }).join("-");
}
function hasUnstressedOpenMedialU(name) {
  const sylls = syllabify(name);
  for (let i = 1; i < sylls.length - 1; i++) {
    const s = sylls[i];
    if (s.endsWith("u") && !s.endsWith("au") && !s.endsWith("eu") && !s.endsWith("ou")) return true;
  }
  return false;
}
function medialVowelRun3(name) {
  return /[aeiou]{3}/.test(name.toLowerCase().slice(1));
}
function levenshtein(a, b) {
  if (Math.abs(a.length - b.length) > 2) return 3;
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...new Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return dp[a.length][b.length];
}
function gateName(name, culture, parts, sessionNames) {
  const lower = name.toLowerCase();
  const els = parts.map((p) => p.element.toLowerCase().replace(/^-/, ""));
  if (new Set(els).size !== els.length) return { pass: false, reason: "element repeated" };
  for (let i = 0; i < els.length - 1; i++) {
    const a = els[i], b = els[i + 1];
    if (a.slice(-2) === b.slice(0, 2) && a.length > 1 && b.length > 1) return { pass: false, reason: "seam echo" };
  }
  if (/(.{2,3})\1/.test(lower)) return { pass: false, reason: "internal stutter" };
  if (/([bcdfghjklmnpqrstvwz])\1[bcdfghjklmnpqrstvwz]/.test(lower)) return { pass: false, reason: "welded triple cluster" };
  if (hasUnstressedOpenMedialU(lower)) return { pass: false, reason: "unstressed medial U" };
  if (medialVowelRun3(lower)) return { pass: false, reason: "vowel pile-up" };
  if (NAME_BLOCKLIST.some((b) => lower.includes(b))) return { pass: false, reason: "connotation collision" };
  const sylls = syllabify(lower).length;
  const [lo, hi] = culture.syllableRange;
  const slack = parts.length === 2 && parts.every((p) => p.slot === "start" || p.slot === "end") && parts[0].element.length >= 3 ? 1 : 0;
  if (sylls < lo || sylls > hi + slack) return { pass: false, reason: "length outside profile" };
  if (sessionNames.has(lower)) return { pass: false, reason: "duplicate in batch" };
  for (const r of culture.registry) {
    if (levenshtein(lower, r.toLowerCase()) <= 1) return { pass: false, reason: "collides with registry" };
  }
  return { pass: true };
}
var PROCEDURAL_CONSONANTS = {
  harsh: ["k", "g", "t", "d", "b", "r", "z", "k", "g", "t"],
  soft: ["l", "m", "n", "r", "s", "v", "l", "m", "n"],
  bright: ["s", "sh", "t", "s", "k", "z", "s", "sh"],
  grand: ["m", "n", "d", "r", "l", "th", "m", "n", "d"],
  exotic: ["v", "z", "n", "j", "k", "ts", "v", "n"]
};
var PROCEDURAL_VOWELS = {
  harsh: ["a", "o", "u", "a", "o"],
  soft: ["a", "e", "i", "a", "e", "ia"],
  bright: ["i", "e", "i", "e", "a"],
  grand: ["a", "o", "a", "o", "au"],
  exotic: ["ae", "oi", "a", "ei", "ai", "u"]
};
function buildProceduralElements(rng, mood) {
  const C = PROCEDURAL_CONSONANTS[mood], V = PROCEDURAL_VOWELS[mood];
  const mk = /* @__PURE__ */ new Set();
  const starts = [], middles = [], ends = [];
  const cv = () => pick(rng, C) + pick(rng, V);
  let guard = 0;
  while (starts.length < 10 && guard++ < 200) {
    const el = rng() < 0.2 ? pick(rng, V.filter((v) => v[0] !== "u" && v[0] !== "o")) : cv();
    const cap2 = el[0].toUpperCase() + el.slice(1);
    if (!mk.has(cap2) && !/[aeiou]{3}/.test(el)) {
      mk.add(cap2);
      starts.push(cap2);
    }
  }
  guard = 0;
  while (middles.length < 8 && guard++ < 200) {
    const el = cv();
    if (!mk.has(el) && !el.endsWith("u")) {
      mk.add(el);
      middles.push(el);
    }
  }
  guard = 0;
  while (ends.length < 5 && guard++ < 200) {
    const coda = rng() < 0.4 ? pick(rng, ["n", "r", "l", "th", "s"]) : "";
    const el = "-" + cv() + coda;
    if (!mk.has(el)) {
      mk.add(el);
      ends.push(el);
    }
  }
  return { start: starts, middle: middles, end: ends };
}
function samplePackElements(rng, mood) {
  const p = PHONETIC_PACKS[mood];
  return {
    start: sample(rng, p.start, 10),
    middle: sample(rng, p.middle, 8),
    end: sample(rng, p.end, 5)
  };
}
var ENV_DEFAULT_PACK = {
  desert: "desert",
  mountain: "mountain",
  forest: "forest",
  coastal: "seafaring",
  urban: "mercantile"
};
function seedCulture(traits) {
  var _a;
  const seed = (_a = traits.seed) != null ? _a : `${traits.name}::${Date.now().toString(36)}`;
  const rng = rngFrom(seed + "::elements");
  const elements = traits.familiarity === "alien" ? buildProceduralElements(rng, traits.mood) : samplePackElements(rng, traits.mood);
  const syllableRange = traits.register === "ancient" ? [3, 5] : traits.register === "modern" ? [2, 3] : [2, 4];
  const culture = {
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
    summary: ""
  };
  const packs = new Set(traits.packs);
  const envPack = ENV_DEFAULT_PACK[traits.environment];
  if (envPack) packs.add(envPack);
  applySemanticPacks(culture, [...packs]);
  culture.summary = oneBreath(culture);
  return culture;
}
function mintForm(culture, concept, existing) {
  const rng = rngFrom(`${culture.seed}::mint::${concept}`);
  const { start, middle, end } = culture.elements;
  for (let attempt = 0; attempt < 14; attempt++) {
    const long = attempt >= 8;
    let form = pick(rng, start).toLowerCase();
    if (rng() < (long ? 0.9 : 0.35)) form += pick(rng, middle);
    if (rng() < 0.5) form += pick(rng, end).replace(/^-/, "");
    form = form.replace(/[aeiou]{3,}/g, (m) => m.slice(0, 2));
    if (form.length < 3 || form.length > 9) continue;
    if (existing.every((f) => levenshtein(form, f) >= 2)) return form;
  }
  return pick(rng, start).toLowerCase() + pick(rng, middle) + pick(rng, end).replace(/^-/, "");
}
function applySemanticPacks(culture, packNames) {
  const applied = ["core", ...packNames.filter((p) => p !== "core" && SEMANTIC_PACKS[p])];
  culture.appliedPacks = applied;
  const weightOf = /* @__PURE__ */ new Map();
  for (const packName of applied) {
    for (const concept of SEMANTIC_PACKS[packName].concepts) {
      const cur = weightOf.get(concept);
      if (cur) cur.w = Math.min(3, cur.w + 1);
      else weightOf.set(concept, { w: 1, origin: packName });
    }
  }
  const existingByMeaning = new Map(culture.roots.map((r) => [r.meaning, r]));
  const forms = culture.roots.map((r) => r.form);
  const roots = [];
  for (const [meaning, { w, origin }] of weightOf) {
    const prior = existingByMeaning.get(meaning);
    if (prior) {
      prior.weight = prior.weight === 0.5 ? 0.5 : w;
      roots.push(prior);
      continue;
    }
    const form = mintForm(culture, meaning, forms);
    forms.push(form);
    roots.push({ form, meaning, origin, weight: w });
  }
  culture.roots = roots;
}
function weightLabel(w) {
  return w >= 3 ? "dominant" : w >= 2 ? "common" : w >= 1 ? "normal" : "rare";
}
function assemble(rng, culture, category) {
  const { start, middle, end } = culture.elements;
  const parts = [];
  const s = pick(rng, start);
  parts.push({ slot: "start", element: s });
  let body = s;
  const middles = category === "house" ? rng() < 0.5 ? 2 : 1 : category === "place" ? 1 : rng() < culture.middleChance ? 1 : 0;
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
function weightedRoot(rng, roots, exclude) {
  let pool = roots.filter((r) => r !== exclude);
  const short = pool.filter((r) => syllabify(r.form).length <= 2);
  if (short.length >= 6) pool = short;
  const total = pool.reduce((t, r) => t + r.weight, 0);
  let x = rng() * total;
  for (const r of pool) {
    x -= r.weight;
    if (x <= 0) return r;
  }
  return pool[pool.length - 1];
}
function assembleSemantic(rng, culture) {
  const r1 = weightedRoot(rng, culture.roots);
  const r2 = weightedRoot(rng, culture.roots, r1);
  let a = r1.form, b = r2.form;
  const aEndsVowel = isVowel(a[a.length - 1], 1);
  const bStartsVowel = isVowel(b[0], 0);
  if (aEndsVowel && bStartsVowel) b = pick(rng, ["n", "r", "l"]) + b;
  if (!aEndsVowel && !bStartsVowel && !SONORANTS.has(a[a.length - 1])) a = a + pick(rng, ["a", "o", "e"]);
  const body = a + b;
  const name = body[0].toUpperCase() + body.slice(1);
  return { name, gloss: `${r1.meaning} + ${r2.meaning}`, parts: [{ slot: "start", element: a }, { slot: "end", element: b }] };
}
function generateBatch(culture, category, count, mode = "sound", rng = rngFrom(`${culture.seed}::batch::${Date.now()}::${Math.random()}`)) {
  const out = [];
  const session = /* @__PURE__ */ new Set();
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
      gloss: built.gloss
    });
  }
  return out;
}
function reinforce(culture, starred) {
  var _a;
  const capCount = (list, el) => list.filter((x) => x.toLowerCase() === el.toLowerCase()).length;
  for (const g of starred) {
    for (const p of g.parts) {
      const list = culture.elements[p.slot];
      if (capCount(list, p.element) < 4) list.push(p.element);
    }
  }
  const starredEnds = [...new Set(starred.flatMap((g) => g.parts.filter((p) => p.slot === "end").map((p) => p.element)))];
  if (starredEnds.length > 0) {
    const counts = /* @__PURE__ */ new Map();
    for (const e of culture.elements.end) counts.set(e, ((_a = counts.get(e)) != null ? _a : 0) + 1);
    const rest = [...counts.keys()].filter((e) => !starredEnds.some((s) => s.toLowerCase() === e.toLowerCase())).sort((x, y) => {
      var _a2, _b;
      return ((_a2 = counts.get(y)) != null ? _a2 : 0) - ((_b = counts.get(x)) != null ? _b : 0);
    });
    const keep = [...starredEnds, ...rest].slice(0, 5);
    culture.elements.end = culture.elements.end.filter((e) => keep.some((k) => k.toLowerCase() === e.toLowerCase()));
    for (const s of starredEnds) {
      if (capCount(culture.elements.end, s) < 4) culture.elements.end.push(s);
      if (capCount(culture.elements.end, s) < 4) culture.elements.end.push(s);
    }
  }
  culture.summary = oneBreath(culture);
}
function segmentPastedName(raw) {
  const w = raw.trim().toLowerCase().replace(/[^a-z]/g, "");
  if (w.length < 3) return null;
  const sylls = syllabify(w);
  if (sylls.length === 1) {
    const m = w.match(/^([^aeiou]*[aeiouy]+)(.*)$/);
    if (!m || !m[2]) return null;
    return { start: cap(m[1]), middles: [], end: "-" + m[2].replace(/^([aeiouy])/, "n$1") };
  }
  let start = sylls[0];
  while (start.length > 1 && !isVowel(start[start.length - 1], 1) && !SONORANTS.has(start[start.length - 1])) {
    start = start.slice(0, -1);
  }
  let rest = w.slice(start.length);
  let end = sylls[sylls.length - 1];
  if (isVowel(end[0], 0)) {
    const prev = rest.slice(0, rest.length - end.length);
    if (prev.length > 0) end = prev[prev.length - 1] + end;
  }
  const middleRaw = rest.slice(0, Math.max(0, rest.length - end.length));
  const middles = [];
  if (middleRaw.length >= 2 && !isVowel(middleRaw[0], 0)) middles.push(middleRaw);
  return { start: cap(start), middles, end: "-" + end };
}
var cap = (s) => s[0].toUpperCase() + s.slice(1);
function bigrams(s) {
  const out = /* @__PURE__ */ new Set();
  for (let i = 0; i < s.length - 1; i++) out.add(s.slice(i, i + 2));
  return out;
}
function detectMood(names) {
  const userGrams = bigrams(names.join("").toLowerCase());
  let best = "soft", bestScore = -1;
  for (const mood of Object.keys(PHONETIC_PACKS)) {
    const p = PHONETIC_PACKS[mood];
    const packGrams = bigrams([...p.start, ...p.middle, ...p.end].join("").toLowerCase().replace(/-/g, ""));
    let overlap = 0;
    for (const g of userGrams) if (packGrams.has(g)) overlap++;
    const score = overlap / Math.max(1, userGrams.size);
    if (score > bestScore) {
      bestScore = score;
      best = mood;
    }
  }
  return best;
}
function reverseSeedCulture(cultureName, pastedNames, packs = []) {
  const cleaned = pastedNames.map((n) => n.trim()).filter((n) => n.length >= 3);
  const mood = detectMood(cleaned);
  const segments = cleaned.map(segmentPastedName).filter((s) => s !== null);
  const seed = `${cultureName}::from::${cleaned.join("+").toLowerCase()}`;
  const rng = rngFrom(seed + "::backfill");
  const pack = PHONETIC_PACKS[mood];
  const starts = [], middles = [], ends = [];
  for (const seg of segments) {
    for (let k = 0; k < 3; k++) {
      starts.push(seg.start);
      for (const m of seg.middles) middles.push(m);
      ends.push(seg.end);
    }
  }
  for (const el of sample(rng, pack.start, 6)) if (!starts.some((s) => s.toLowerCase() === el.toLowerCase())) starts.push(el);
  for (const el of sample(rng, pack.middle, 5)) if (!middles.some((m) => m.toLowerCase() === el.toLowerCase())) middles.push(el);
  for (const el of sample(rng, pack.end, Math.max(2, 4 - new Set(ends).size))) if (!ends.some((e) => e.toLowerCase() === el.toLowerCase())) ends.push(el);
  if (middles.length === 0) middles.push(...sample(rng, pack.middle, 5));
  const syllCounts = cleaned.map((n) => syllabify(n).length);
  const lo = Math.max(2, Math.min(...syllCounts) - 0);
  const hi = Math.min(5, Math.max(...syllCounts) + 1);
  const culture = {
    id: seed,
    name: cultureName,
    seed,
    mood,
    register: "balanced",
    familiarity: "familiar",
    environment: "\u2014",
    elements: { start: starts, middle: middles, end: ends },
    middleChance: syllCounts.some((c) => c >= 3) ? 0.5 : 0.3,
    syllableRange: [lo, Math.max(lo, hi)],
    stress: mood === "grand" ? "penult" : "initial",
    roots: [],
    appliedPacks: [],
    registry: cleaned.map((n) => n.toLowerCase()),
    // their names are already taken
    fromNames: cleaned,
    summary: ""
  };
  applySemanticPacks(culture, packs);
  culture.summary = oneBreath(culture);
  return culture;
}
var MOOD_ADJ = {
  harsh: "clipped and forceful",
  soft: "smooth and flowing",
  bright: "sharp and keen",
  grand: "weighty and old",
  exotic: "foreign but readable"
};
function topConsonants(culture, n = 3) {
  var _a;
  const counts = /* @__PURE__ */ new Map();
  const all = [...culture.elements.start, ...culture.elements.middle, ...culture.elements.end].join("").toLowerCase();
  for (const ch of all) if (!VOWELS.has(ch) && ch !== "-" && ch !== "y") counts.set(ch, ((_a = counts.get(ch)) != null ? _a : 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map((e) => e[0]);
}
function topEndings(culture, n = 2) {
  var _a;
  const counts = /* @__PURE__ */ new Map();
  for (const e of culture.elements.end) {
    const k = e.toLowerCase();
    counts.set(k, ((_a = counts.get(k)) != null ? _a : 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map((e) => e[0]);
}
function oneBreath(culture) {
  const [lo, hi] = culture.syllableRange;
  const avg = (lo + hi) / 2;
  const lengthAdj = avg <= 2.5 ? "short" : avg <= 3.5 ? "measured" : "long and ceremonial";
  const cons = topConsonants(culture);
  const consStr = cons.length >= 2 ? `${cons.slice(0, -1).join(", ")} and ${cons[cons.length - 1]}` : cons.join("");
  const endsStr = topEndings(culture).join(" or ");
  return `${culture.name} names are ${lengthAdj}, ${MOOD_ADJ[culture.mood]}, favour ${consStr}, and usually end in ${endsStr}.`;
}
function makeCultureCard(culture, shuffle = 0) {
  const rng = rngFrom(`${culture.seed}::card::${shuffle}`);
  const samples = [
    ...generateBatch(culture, "personal", 2, "sound", rng),
    ...generateBatch(culture, "house", 2, "sound", rng),
    ...generateBatch(culture, "place", 2, "sound", rng)
  ];
  const glossaryPreview = culture.roots.filter((r) => r.weight >= 2).slice(0, 6).concat(culture.roots.slice(0, 6)).slice(0, 6).map((r) => ({ form: r.form, meaning: r.meaning, weight: weightLabel(r.weight) }));
  return { summary: culture.summary || oneBreath(culture), samples, packs: culture.appliedPacks, glossaryPreview };
}
function reshuffleElements(culture, salt) {
  const rng = rngFrom(`${culture.seed}::reshuffle::${salt}`);
  culture.elements = culture.familiarity === "alien" ? buildProceduralElements(rng, culture.mood) : samplePackElements(rng, culture.mood);
  culture.summary = oneBreath(culture);
}
var DRIFT_PRESETS = {
  dialect: 0.15,
  sister: 0.4,
  distant: 0.7
};
var SOUND_CHANGE_RULES = [
  { pattern: /p/g, replacement: "f" },
  { pattern: /t(?!h)/g, replacement: "th" },
  { pattern: /k/g, replacement: "h" },
  { pattern: /(?<=[aeiou])b(?=[aeiou])/g, replacement: "v" },
  { pattern: /(?<=[aeiou])g(?=[aeiou])/g, replacement: "gh" },
  { pattern: /d(?!h)/g, replacement: "dh" },
  { pattern: /o/g, replacement: "u" },
  { pattern: /e/g, replacement: "i" },
  { pattern: /s(?!h)/g, replacement: "z" },
  { pattern: /([aeiou])\1/g, replacement: "$1" }
  // long-vowel simplification
];
function driftWord(rng, word, intensity) {
  const hasLeadingDash = word.startsWith("-");
  const hasCap = /^[A-Z]/.test(word.replace(/^-/, ""));
  let w = word.replace(/^-/, "").toLowerCase();
  for (const rule of SOUND_CHANGE_RULES) {
    if (rng() < intensity) w = w.replace(rule.pattern, rule.replacement);
  }
  if (w.length === 0) w = word.replace(/^-/, "").toLowerCase();
  if (hasCap) w = w[0].toUpperCase() + w.slice(1);
  return hasLeadingDash ? "-" + w : w;
}
function driftElementSet(rng, elements, intensity) {
  return {
    start: elements.start.map((el) => driftWord(rng, el, intensity)),
    middle: elements.middle.map((el) => driftWord(rng, el, intensity)),
    end: elements.end.map((el) => driftWord(rng, el, intensity))
  };
}
function deriveCulture(parent, name, driftLevel, overrides = {}) {
  var _a, _b, _c;
  const intensity = DRIFT_PRESETS[driftLevel];
  const seed = `${name}::from::${parent.id}::${Date.now().toString(36)}`;
  const rng = rngFrom(seed + "::drift");
  const elements = driftElementSet(rng, parent.elements, intensity);
  const roots = parent.roots.map((r) => ({ ...r, form: driftWord(rng, r.form, intensity) }));
  const culture = {
    id: seed,
    name,
    seed,
    mood: parent.mood,
    register: parent.register,
    familiarity: parent.familiarity,
    environment: (_a = overrides.environment) != null ? _a : parent.environment,
    elements,
    middleChance: parent.middleChance,
    syllableRange: [...parent.syllableRange],
    stress: parent.stress,
    roots,
    appliedPacks: [...parent.appliedPacks],
    registry: [],
    summary: "",
    parentIds: [parent.id],
    generation: ((_b = parent.generation) != null ? _b : 0) + 1,
    driftLevel
  };
  if ((_c = overrides.packs) == null ? void 0 : _c.length) {
    applySemanticPacks(culture, [.../* @__PURE__ */ new Set([...culture.appliedPacks, ...overrides.packs])]);
  }
  culture.summary = oneBreath(culture);
  return culture;
}
function mergeCultures(parents, name, driftLevel, overrides = {}) {
  var _a, _b;
  if (parents.length < 2) throw new Error("mergeCultures requires at least two parents");
  const seed = `${name}::merge::${parents.map((p) => p.id).join("+")}::${Date.now().toString(36)}`;
  const rng = rngFrom(seed + "::merge");
  const mergeSlot = (slot, targetSize) => {
    const per = Math.max(1, Math.round(targetSize / parents.length));
    const pooled = parents.flatMap((p) => sample(rng, p.elements[slot], per));
    const seen = /* @__PURE__ */ new Set();
    const out = pooled.filter((el) => {
      const k = el.toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
    if (out.length < targetSize) {
      const rest = parents.flatMap((p) => p.elements[slot]).filter((el) => !seen.has(el.toLowerCase()));
      out.push(...sample(rng, rest, targetSize - out.length));
    }
    return out.slice(0, targetSize);
  };
  const elements = {
    start: mergeSlot("start", 10),
    middle: mergeSlot("middle", 8),
    end: mergeSlot("end", 5)
  };
  const byMeaning = /* @__PURE__ */ new Map();
  for (const p of parents) {
    for (const r of p.roots) {
      if (!byMeaning.has(r.meaning)) byMeaning.set(r.meaning, []);
      byMeaning.get(r.meaning).push(r);
    }
  }
  const roots = [];
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
    blended = blended.replace(/[aeiou]{3,}/g, (m) => m.slice(0, 2));
    if (blended.length < 3) blended = a.form;
    roots.push({
      form: blended[0].toUpperCase() + blended.slice(1).toLowerCase(),
      meaning,
      origin: `${a.origin}+${b.origin}`,
      weight: Math.min(3, Math.max(a.weight, b.weight))
    });
  }
  const modeOf = (values) => {
    const counts = /* @__PURE__ */ new Map();
    for (const v of values) {
      const k = String(v);
      const e = counts.get(k);
      if (e) e.n++;
      else counts.set(k, { v, n: 1 });
    }
    const max = Math.max(...[...counts.values()].map((e) => e.n));
    const tied = [...counts.values()].filter((e) => e.n === max).map((e) => e.v);
    return pick(rng, tied);
  };
  const syllLo = Math.min(...parents.map((p) => p.syllableRange[0]));
  const syllHi = Math.max(...parents.map((p) => p.syllableRange[1]));
  const culture = {
    id: seed,
    name,
    seed,
    mood: modeOf(parents.map((p) => p.mood)),
    register: modeOf(parents.map((p) => p.register)),
    familiarity: modeOf(parents.map((p) => p.familiarity)),
    environment: (_a = overrides.environment) != null ? _a : parents[0].environment,
    elements,
    middleChance: parents.reduce((t, p) => t + p.middleChance, 0) / parents.length,
    syllableRange: [syllLo, Math.max(syllLo, syllHi)],
    stress: modeOf(parents.map((p) => p.stress)),
    roots,
    appliedPacks: [...new Set(parents.flatMap((p) => p.appliedPacks))],
    registry: [],
    summary: "",
    parentIds: parents.map((p) => p.id),
    generation: Math.max(...parents.map((p) => {
      var _a2;
      return (_a2 = p.generation) != null ? _a2 : 0;
    })) + 1,
    driftLevel
  };
  const intensity = DRIFT_PRESETS[driftLevel] * 0.5;
  culture.elements = driftElementSet(rng, culture.elements, intensity);
  culture.roots = culture.roots.map((r) => ({ ...r, form: driftWord(rng, r.form, intensity) }));
  if ((_b = overrides.packs) == null ? void 0 : _b.length) {
    applySemanticPacks(culture, [.../* @__PURE__ */ new Set([...culture.appliedPacks, ...overrides.packs])]);
  }
  culture.summary = oneBreath(culture);
  return culture;
}
function cultureNote(culture, allCultures = []) {
  var _a, _b, _c, _d, _e, _f;
  const card = makeCultureCard(culture);
  const lines = [];
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
  if ((_a = culture.fromNames) == null ? void 0 : _a.length) {
    lines.push(`Seeded from your own names: ${culture.fromNames.join(", ")}.`);
    lines.push("");
  }
  const parents = ((_b = culture.parentIds) != null ? _b : []).map((id) => allCultures.find((c) => c.id === id)).filter((c) => !!c);
  const descendants = allCultures.filter((c) => {
    var _a2;
    return (_a2 = c.parentIds) == null ? void 0 : _a2.includes(culture.id);
  });
  if (parents.length > 0 || descendants.length > 0) {
    lines.push("## Family");
    lines.push("");
    if (parents.length === 1) {
      lines.push(`Descended from: **${parents[0].name}** (generation ${(_c = culture.generation) != null ? _c : 1}, drift: ${(_d = culture.driftLevel) != null ? _d : "unknown"})`);
    } else if (parents.length >= 2) {
      lines.push(`Merged from: ${parents.map((p) => `**${p.name}**`).join(" + ")} (generation ${(_e = culture.generation) != null ? _e : 1}, contact drift: ${(_f = culture.driftLevel) != null ? _f : "unknown"})`);
    }
    if (descendants.length > 0) {
      lines.push(`Descendants: ${descendants.map((d) => d.name).join(", ")}`);
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
  for (const s of card.samples) lines.push(`- **${s.name}** (${s.category}) \u2014 say it: *${s.pronunciation}*`);
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

// src/main.ts
var DEFAULT_SETTINGS = {
  folder: "languageForge",
  batchSize: 12,
  showPronunciation: true,
  insertFormat: "list"
};
var LanguageForgePlugin = class extends import_obsidian.Plugin {
  constructor() {
    super(...arguments);
    this.data = { settings: { ...DEFAULT_SETTINGS }, cultures: [] };
  }
  async onload() {
    var _a, _b;
    const stored = await this.loadData();
    if (stored) {
      this.data.settings = { ...DEFAULT_SETTINGS, ...(_a = stored.settings) != null ? _a : {} };
      this.data.cultures = (_b = stored.cultures) != null ? _b : [];
    }
    this.addCommand({
      id: "create-culture",
      name: "Create a culture",
      callback: () => new SeedWizardModal(this.app, this).open()
    });
    this.addCommand({
      id: "create-culture-from-names",
      name: "Create a culture from names you already have",
      callback: () => new PasteNamesModal(this.app, this).open()
    });
    this.addCommand({
      id: "generate-names",
      name: "Generate names",
      callback: () => {
        if (this.data.cultures.length === 0) {
          new import_obsidian.Notice("No cultures yet \u2014 create one first.");
          new SeedWizardModal(this.app, this).open();
          return;
        }
        new GenerateModal(this.app, this).open();
      }
    });
    this.addCommand({
      id: "derive-culture",
      name: "Derive a descendant language",
      callback: () => {
        if (this.data.cultures.length === 0) {
          new import_obsidian.Notice("No cultures yet \u2014 create one first.");
          new SeedWizardModal(this.app, this).open();
          return;
        }
        new DeriveCultureModal(this.app, this).open();
      }
    });
    this.addCommand({
      id: "view-family-tree",
      name: "View language family tree",
      callback: () => {
        if (this.data.cultures.length === 0) {
          new import_obsidian.Notice("No cultures yet \u2014 create one first.");
          return;
        }
        new FamilyTreeModal(this.app, this).open();
      }
    });
    this.addCommand({
      id: "save-culture-card",
      name: "Save a culture card as a note",
      callback: () => {
        if (this.data.cultures.length === 0) {
          new import_obsidian.Notice("No cultures yet.");
          return;
        }
        new PickCultureModal(this.app, this, async (c) => {
          const path = await this.writeCultureNote(c);
          new import_obsidian.Notice(`Saved ${path}`);
        }).open();
      }
    });
    this.addRibbonIcon("languages", "languageForge: Generate names", () => {
      if (this.data.cultures.length === 0) {
        new import_obsidian.Notice("No cultures yet \u2014 create one first.");
        new SeedWizardModal(this.app, this).open();
        return;
      }
      new GenerateModal(this.app, this).open();
    });
    this.addSettingTab(new LanguageForgeSettingTab(this.app, this));
  }
  async persist() {
    await this.saveData(this.data);
  }
  async writeCultureNote(culture) {
    const folder = (0, import_obsidian.normalizePath)(`${this.data.settings.folder}/Cultures`);
    try {
      await this.app.vault.createFolder(folder);
    } catch {
    }
    const path = (0, import_obsidian.normalizePath)(`${folder}/${culture.name}.md`);
    const content = cultureNote(culture, this.data.cultures);
    const existing = this.app.vault.getAbstractFileByPath(path);
    if (existing instanceof import_obsidian.TFile) await this.app.vault.modify(existing, content);
    else await this.app.vault.create(path, content);
    return path;
  }
  upsertCulture(culture) {
    const i = this.data.cultures.findIndex((c) => c.id === culture.id);
    if (i >= 0) this.data.cultures[i] = culture;
    else this.data.cultures.push(culture);
  }
};
var MOODS = [
  { value: "harsh", label: "Harsh \u2014 clipped, forceful (Kordrak)" },
  { value: "soft", label: "Soft \u2014 smooth, flowing (Elowen)" },
  { value: "bright", label: "Bright \u2014 sharp, keen (Sisen)" },
  { value: "grand", label: "Grand \u2014 weighty, old (Aromoran)" },
  { value: "exotic", label: "Exotic \u2014 foreign but readable (Zaeneir)" }
];
var ENVIRONMENTS = ["none", "coastal", "mountain", "forest", "desert", "urban"];
var SeedWizardModal = class extends import_obsidian.Modal {
  constructor(app, plugin) {
    super(app);
    this.traits = {
      name: "",
      mood: "soft",
      register: "balanced",
      familiarity: "familiar",
      environment: "none",
      packs: []
    };
    this.plugin = plugin;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.addClass("languageforge-modal");
    contentEl.createEl("h2", { text: "Create a culture" });
    contentEl.createEl("p", {
      text: "Four choices. Everything else is derived, and you can nudge it on the card afterwards.",
      cls: "lf-hint"
    });
    new import_obsidian.Setting(contentEl).setName("Culture name").addText((t) => t.setPlaceholder("Velari").onChange((v) => this.traits.name = v.trim()));
    new import_obsidian.Setting(contentEl).setName("Sound").setDesc("The phonaesthetic mood of the language.").addDropdown((d) => {
      for (const m of MOODS) d.addOption(m.value, m.label);
      d.setValue(this.traits.mood).onChange((v) => this.traits.mood = v);
    });
    new import_obsidian.Setting(contentEl).setName("Register").setDesc("Ancient names run long with penult stress; modern names run short.").addDropdown((d) => {
      d.addOption("balanced", "Balanced");
      d.addOption("ancient", "Ancient");
      d.addOption("modern", "Modern");
      d.setValue(this.traits.register).onChange((v) => this.traits.register = v);
    });
    new import_obsidian.Setting(contentEl).setName("Familiarity").setDesc("Familiar samples the curated element packs; alien builds sounds procedurally.").addDropdown((d) => {
      d.addOption("familiar", "Familiar (English-adjacent)");
      d.addOption("alien", "Alien (procedural)");
      d.setValue(this.traits.familiarity).onChange((v) => this.traits.familiarity = v);
    });
    new import_obsidian.Setting(contentEl).setName("Environment").setDesc("Coastal adds seafaring words, mountain adds highland words, and so on.").addDropdown((d) => {
      for (const e of ENVIRONMENTS) d.addOption(e, e === "none" ? "None in particular" : e[0].toUpperCase() + e.slice(1));
      d.setValue(this.traits.environment).onChange((v) => this.traits.environment = v);
    });
    const details = contentEl.createEl("details", { cls: "lf-packs" });
    details.createEl("summary", { text: "Word themes (optional)" });
    details.createEl("p", {
      text: "Core words \u2014 kinship, virtues, nature \u2014 are always on. Stack themes to tilt what names mean.",
      cls: "lf-hint"
    });
    for (const packName of Object.keys(SEMANTIC_PACKS)) {
      if (!SEMANTIC_PACKS[packName].additive) continue;
      new import_obsidian.Setting(details).setName(packName[0].toUpperCase() + packName.slice(1)).addToggle((t) => t.setValue(false).onChange((on) => {
        if (on) this.traits.packs.push(packName);
        else this.traits.packs = this.traits.packs.filter((p) => p !== packName);
      }));
    }
    const buttons = new import_obsidian.Setting(contentEl);
    buttons.addButton((b) => b.setButtonText("Cancel").onClick(() => this.close()));
    buttons.addButton((b) => b.setButtonText("Seed the culture").setCta().onClick(() => {
      if (!this.traits.name) {
        new import_obsidian.Notice("The culture needs a name.");
        return;
      }
      if (this.plugin.data.cultures.some((c) => c.name.toLowerCase() === this.traits.name.toLowerCase())) {
        new import_obsidian.Notice("A culture with that name already exists.");
        return;
      }
      const env = this.traits.environment === "none" ? "\u2014" : this.traits.environment;
      const culture = seedCulture({ ...this.traits, environment: env });
      this.close();
      new CultureCardModal(this.app, this.plugin, culture, true).open();
    }));
  }
  onClose() {
    this.contentEl.empty();
  }
};
var PasteNamesModal = class extends import_obsidian.Modal {
  constructor(app, plugin) {
    super(app);
    this.cultureName = "";
    this.pasted = "";
    this.plugin = plugin;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.addClass("languageforge-modal");
    contentEl.createEl("h2", { text: "Start from names you already have" });
    contentEl.createEl("p", {
      text: "Paste two or more names you've invented and love. The engine works out a phonology consistent with them and generates kin. Your names are protected \u2014 nothing too similar will ever be generated.",
      cls: "lf-hint"
    });
    new import_obsidian.Setting(contentEl).setName("Culture name").addText((t) => t.setPlaceholder("Kaelthi").onChange((v) => this.cultureName = v.trim()));
    new import_obsidian.Setting(contentEl).setName("Your names").setDesc("Separated by commas or new lines.").addTextArea((t) => {
      t.setPlaceholder("Kaelith, Veyra, Kaeloth");
      t.inputEl.rows = 4;
      t.onChange((v) => this.pasted = v);
    });
    const buttons = new import_obsidian.Setting(contentEl);
    buttons.addButton((b) => b.setButtonText("Cancel").onClick(() => this.close()));
    buttons.addButton((b) => b.setButtonText("Work out the sound").setCta().onClick(() => {
      const names = this.pasted.split(/[,\n;]+/).map((s) => s.trim()).filter((s) => s.length >= 3);
      if (names.length < 2) {
        new import_obsidian.Notice("Paste at least two names.");
        return;
      }
      if (!this.cultureName) this.cultureName = names[0] + "-kin";
      const culture = reverseSeedCulture(this.cultureName, names);
      this.close();
      new CultureCardModal(this.app, this.plugin, culture, true).open();
    }));
  }
  onClose() {
    this.contentEl.empty();
  }
};
var CultureCardModal = class extends import_obsidian.Modal {
  constructor(app, plugin, culture, isNew) {
    super(app);
    this.shuffle = 0;
    this.plugin = plugin;
    this.culture = culture;
    this.isNew = isNew;
  }
  render() {
    var _a;
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("languageforge-modal");
    const card = makeCultureCard(this.culture, this.shuffle);
    contentEl.createEl("h2", { text: this.culture.name });
    contentEl.createEl("p", { text: card.summary, cls: "lf-onebreath" });
    if ((_a = this.culture.fromNames) == null ? void 0 : _a.length) {
      contentEl.createEl("p", {
        text: `Seeded from: ${this.culture.fromNames.join(", ")}`,
        cls: "lf-hint"
      });
    }
    const grid = contentEl.createDiv({ cls: "lf-specimens" });
    for (const s of card.samples) {
      const chip = grid.createDiv({ cls: "lf-specimen" });
      chip.createDiv({ text: s.name, cls: "lf-specimen-name" });
      chip.createDiv({ text: s.pronunciation, cls: "lf-specimen-pron" });
      chip.createDiv({ text: s.category, cls: "lf-specimen-cat" });
    }
    if (card.glossaryPreview.length > 0) {
      const gl = contentEl.createDiv({ cls: "lf-glossary" });
      gl.createEl("span", { text: "Words: ", cls: "lf-hint" });
      gl.createEl("span", {
        text: card.glossaryPreview.map((g) => `${g.form} = ${g.meaning}`).join("  \xB7  "),
        cls: "lf-glossary-items"
      });
    }
    contentEl.createEl("p", { text: `Word themes: ${card.packs.join(", ")}`, cls: "lf-hint" });
    const row = new import_obsidian.Setting(contentEl);
    row.addButton((b) => b.setButtonText("Reshuffle the sounds").onClick(() => {
      this.shuffle++;
      reshuffleElements(this.culture, String(this.shuffle));
      this.render();
    }));
    row.addButton((b) => b.setButtonText("New samples").onClick(() => {
      this.shuffle++;
      this.render();
    }));
    if (!this.isNew) {
      row.addButton((b) => b.setButtonText("Branch a new language\u2026").onClick(() => {
        this.close();
        new DeriveCultureModal(this.app, this.plugin, this.culture.id).open();
      }));
    }
    if (this.isNew) {
      row.addButton((b) => b.setButtonText("Cancel").onClick(() => {
        this.close();
        new import_obsidian.Notice("Culture discarded \u2014 nothing was saved.");
      }));
    }
    row.addButton((b) => b.setButtonText(this.isNew ? "Accept culture" : "Save changes").setCta().onClick(async () => {
      this.plugin.upsertCulture(this.culture);
      await this.plugin.persist();
      this.close();
      new import_obsidian.Notice(`${this.culture.name} saved. Generate names any time.`);
      new GenerateModal(this.app, this.plugin, this.culture.id).open();
    }));
  }
  onOpen() {
    this.render();
  }
  onClose() {
    this.contentEl.empty();
  }
};
var DRIFT_LEVELS = [
  { value: "dialect", label: "Dialect \u2014 light drift, clearly the same tongue" },
  { value: "sister", label: "Sister language \u2014 moderate drift, kin but distinct" },
  { value: "distant", label: "Distant cousin \u2014 heavy drift, related if you look closely" }
];
var DeriveCultureModal = class extends import_obsidian.Modal {
  constructor(app, plugin, parentId) {
    var _a, _b;
    super(app);
    this.mode = "branch";
    this.mergeParentIds = /* @__PURE__ */ new Set();
    this.name = "";
    this.driftLevel = "sister";
    this.environment = "none";
    this.plugin = plugin;
    this.branchParentId = (_b = parentId != null ? parentId : (_a = plugin.data.cultures[0]) == null ? void 0 : _a.id) != null ? _b : "";
  }
  render() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("languageforge-modal");
    contentEl.createEl("h2", { text: "Branch a new language" });
    contentEl.createEl("p", {
      text: "Branch drifts one parent's sounds and words into a descendant. Merge blends two or more languages together, as if they'd come into contact.",
      cls: "lf-hint"
    });
    if (this.plugin.data.cultures.length === 0) {
      contentEl.createEl("p", { text: "No cultures yet \u2014 create one first.", cls: "lf-hint" });
      new import_obsidian.Setting(contentEl).addButton((b) => b.setButtonText("Close").onClick(() => this.close()));
      return;
    }
    new import_obsidian.Setting(contentEl).setName("Mode").setDesc("Branch: one parent drifts into a descendant. Merge: two or more parents blend via contact.").addDropdown((d) => {
      d.addOption("branch", "Branch from one parent");
      d.addOption("merge", "Merge two or more parents");
      d.setValue(this.mode).onChange((v) => {
        this.mode = v;
        this.render();
      });
    });
    if (this.mode === "branch") {
      new import_obsidian.Setting(contentEl).setName("Parent language").addDropdown((d) => {
        for (const c of this.plugin.data.cultures) d.addOption(c.id, c.name);
        d.setValue(this.branchParentId).onChange((v) => this.branchParentId = v);
      });
    } else {
      contentEl.createEl("p", { text: "Select two or more languages to merge.", cls: "lf-hint" });
      for (const c of this.plugin.data.cultures) {
        new import_obsidian.Setting(contentEl).setName(c.name).addToggle((t) => t.setValue(this.mergeParentIds.has(c.id)).onChange((on) => {
          if (on) this.mergeParentIds.add(c.id);
          else this.mergeParentIds.delete(c.id);
        }));
      }
    }
    new import_obsidian.Setting(contentEl).setName("New language name").addText((t) => t.setPlaceholder("Velari-dhen").onChange((v) => this.name = v.trim()));
    new import_obsidian.Setting(contentEl).setName("Drift").setDesc(this.mode === "branch" ? "How far the branch has diverged from its parent." : "How far the blended language has settled since contact.").addDropdown((d) => {
      for (const lvl of DRIFT_LEVELS) d.addOption(lvl.value, lvl.label);
      d.setValue(this.driftLevel).onChange((v) => this.driftLevel = v);
    });
    new import_obsidian.Setting(contentEl).setName("Environment").setDesc("Optional \u2014 adds regional word themes on top of the parents' vocabulary.").addDropdown((d) => {
      for (const e of ENVIRONMENTS) d.addOption(e, e === "none" ? "None in particular" : e[0].toUpperCase() + e.slice(1));
      d.setValue(this.environment).onChange((v) => this.environment = v);
    });
    const buttons = new import_obsidian.Setting(contentEl);
    buttons.addButton((b) => b.setButtonText("Cancel").onClick(() => this.close()));
    buttons.addButton((b) => b.setButtonText(this.mode === "branch" ? "Derive language" : "Merge languages").setCta().onClick(() => {
      if (!this.name) {
        new import_obsidian.Notice("The new language needs a name.");
        return;
      }
      if (this.plugin.data.cultures.some((c) => c.name.toLowerCase() === this.name.toLowerCase())) {
        new import_obsidian.Notice("A culture with that name already exists.");
        return;
      }
      const envPack = ENV_DEFAULT_PACK[this.environment];
      const overrides = {};
      if (this.environment !== "none") {
        overrides.environment = this.environment;
        if (envPack) overrides.packs = [envPack];
      }
      let culture;
      if (this.mode === "branch") {
        const parent = this.plugin.data.cultures.find((c) => c.id === this.branchParentId);
        if (!parent) {
          new import_obsidian.Notice("Pick a parent language first.");
          return;
        }
        culture = deriveCulture(parent, this.name, this.driftLevel, overrides);
      } else {
        const parents = this.plugin.data.cultures.filter((c) => this.mergeParentIds.has(c.id));
        if (parents.length < 2) {
          new import_obsidian.Notice("Select at least two languages to merge.");
          return;
        }
        culture = mergeCultures(parents, this.name, this.driftLevel, overrides);
      }
      this.close();
      new CultureCardModal(this.app, this.plugin, culture, true).open();
    }));
  }
  onOpen() {
    this.render();
  }
  onClose() {
    this.contentEl.empty();
  }
};
var FamilyTreeModal = class extends import_obsidian.Modal {
  constructor(app, plugin) {
    super(app);
    this.plugin = plugin;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.addClass("languageforge-modal");
    contentEl.createEl("h2", { text: "Family tree" });
    const all = this.plugin.data.cultures;
    if (all.length === 0) {
      contentEl.createEl("p", { text: "No cultures yet.", cls: "lf-hint" });
      return;
    }
    const roots = all.filter((c) => !c.parentIds || c.parentIds.length === 0);
    if (roots.length === 0) {
      contentEl.createEl("p", { text: "No root languages found.", cls: "lf-hint" });
      return;
    }
    for (const root of roots) {
      const section = contentEl.createDiv({ cls: "lf-tree-section" });
      this.renderNode(section, root, all, 0, /* @__PURE__ */ new Set());
    }
  }
  renderNode(container, culture, all, depth, visited) {
    var _a, _b, _c, _d;
    const row = container.createDiv({ cls: "lf-tree-node" });
    row.style.marginLeft = `${depth * 18}px`;
    const parents = ((_a = culture.parentIds) != null ? _a : []).map((id) => all.find((c) => c.id === id)).filter((c) => !!c);
    const relLabel = parents.length === 0 ? "root" : parents.length === 1 ? `${(_b = culture.driftLevel) != null ? _b : "drift"} of ${parents[0].name}` : `merged: ${parents.map((p) => p.name).join(" + ")} (${(_c = culture.driftLevel) != null ? _c : "contact"})`;
    const label = row.createEl("a", {
      text: `${culture.name}  \xB7  gen ${(_d = culture.generation) != null ? _d : 0}  \xB7  ${relLabel}`,
      cls: "lf-tree-link"
    });
    label.onClickEvent(() => {
      this.close();
      new CultureCardModal(this.app, this.plugin, culture, false).open();
    });
    if (visited.has(culture.id)) {
      row.createSpan({ text: "  (see above)", cls: "lf-hint" });
      return;
    }
    visited.add(culture.id);
    if (depth > 50) return;
    const children = all.filter((c) => {
      var _a2;
      return (_a2 = c.parentIds) == null ? void 0 : _a2.includes(culture.id);
    });
    for (const child of children) this.renderNode(container, child, all, depth + 1, visited);
  }
  onClose() {
    this.contentEl.empty();
  }
};
var GenerateModal = class extends import_obsidian.Modal {
  constructor(app, plugin, cultureId) {
    super(app);
    this.category = "personal";
    this.mode = "sound";
    this.batch = [];
    this.starred = /* @__PURE__ */ new Set();
    this.plugin = plugin;
    this.cultureId = cultureId != null ? cultureId : plugin.data.cultures[0].id;
  }
  get culture() {
    var _a;
    return (_a = this.plugin.data.cultures.find((c) => c.id === this.cultureId)) != null ? _a : this.plugin.data.cultures[0];
  }
  newBatch() {
    this.batch = generateBatch(this.culture, this.category, this.plugin.data.settings.batchSize, this.mode);
    this.starred.clear();
  }
  render() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("languageforge-modal");
    contentEl.createEl("h2", { text: "Generate names" });
    const controls = new import_obsidian.Setting(contentEl);
    controls.addDropdown((d) => {
      for (const c of this.plugin.data.cultures) d.addOption(c.id, c.name);
      d.setValue(this.cultureId).onChange((v) => {
        this.cultureId = v;
        this.newBatch();
        this.render();
      });
    });
    controls.addDropdown((d) => {
      d.addOption("personal", "People");
      d.addOption("house", "Houses");
      d.addOption("place", "Places");
      d.setValue(this.category).onChange((v) => {
        this.category = v;
        this.newBatch();
        this.render();
      });
    });
    controls.addDropdown((d) => {
      d.addOption("sound", "By sound");
      d.addOption("meaning", "By meaning");
      d.setValue(this.mode).onChange((v) => {
        this.mode = v;
        this.newBatch();
        this.render();
      });
    });
    controls.addButton((b) => b.setButtonText("New culture\u2026").onClick(() => {
      this.close();
      new SeedWizardModal(this.app, this.plugin).open();
    }));
    controls.addButton((b) => b.setButtonText("Branch a new language\u2026").onClick(() => {
      this.close();
      new DeriveCultureModal(this.app, this.plugin, this.culture.id).open();
    }));
    controls.addButton((b) => b.setButtonText("Family tree\u2026").onClick(() => {
      this.close();
      new FamilyTreeModal(this.app, this.plugin).open();
    }));
    contentEl.createEl("p", { text: this.culture.summary, cls: "lf-hint" });
    const grid = contentEl.createDiv({ cls: "lf-batch" });
    this.batch.forEach((g, i) => {
      const chip = grid.createDiv({ cls: "lf-name-chip" + (this.starred.has(i) ? " is-starred" : "") });
      chip.createSpan({ text: (this.starred.has(i) ? "\u2605 " : "") + g.name, cls: "lf-chip-name" });
      if (this.plugin.data.settings.showPronunciation) chip.createDiv({ text: g.pronunciation, cls: "lf-chip-pron" });
      if (g.gloss) chip.createDiv({ text: g.gloss, cls: "lf-chip-gloss" });
      chip.onClickEvent(() => {
        if (this.starred.has(i)) this.starred.delete(i);
        else this.starred.add(i);
        this.render();
      });
    });
    if (this.batch.length === 0) {
      contentEl.createEl("p", { text: "Nothing passed the gates \u2014 try reshuffling the culture's sounds.", cls: "lf-hint" });
    }
    contentEl.createEl("p", {
      text: "Tap names you like, then ask for more like them \u2014 the culture learns your taste.",
      cls: "lf-hint"
    });
    const actions = new import_obsidian.Setting(contentEl);
    actions.addButton((b) => b.setButtonText("New batch").onClick(() => {
      this.newBatch();
      this.render();
    }));
    actions.addButton((b) => {
      b.setButtonText("More like starred").onClick(async () => {
        const starredNames = [...this.starred].map((i) => this.batch[i]);
        if (starredNames.length === 0) {
          new import_obsidian.Notice("Star a name or two first.");
          return;
        }
        reinforce(this.culture, starredNames);
        await this.plugin.persist();
        this.newBatch();
        this.render();
      });
      if (this.starred.size === 0) b.buttonEl.addClass("lf-disabled");
    });
    actions.addButton((b) => b.setButtonText("Insert into note").setCta().onClick(async () => {
      const chosen = this.starred.size > 0 ? [...this.starred].map((i) => this.batch[i]) : this.batch;
      const view = this.app.workspace.getActiveViewOfType(import_obsidian.MarkdownView);
      if (!view) {
        new import_obsidian.Notice("Open a note to insert into.");
        return;
      }
      this.insert(view.editor, chosen);
      for (const g of chosen) {
        if (!this.culture.registry.includes(g.name.toLowerCase())) this.culture.registry.push(g.name.toLowerCase());
      }
      await this.plugin.persist();
      new import_obsidian.Notice(`${chosen.length} name${chosen.length === 1 ? "" : "s"} inserted and reserved.`);
      this.close();
    }));
  }
  insert(editor, names) {
    const { showPronunciation, insertFormat } = this.plugin.data.settings;
    const fmt = (g) => {
      let s = g.name;
      if (showPronunciation) s += ` (*${g.pronunciation}*)`;
      if (g.gloss) s += ` \u2014 ${g.gloss}`;
      return s;
    };
    const text = insertFormat === "inline" ? names.map((g) => g.name).join(", ") : names.map((g) => `- ${fmt(g)}`).join("\n") + "\n";
    editor.replaceSelection(text);
  }
  onOpen() {
    this.newBatch();
    this.render();
  }
  onClose() {
    this.contentEl.empty();
  }
};
var PickCultureModal = class extends import_obsidian.Modal {
  constructor(app, plugin, onPick) {
    super(app);
    this.plugin = plugin;
    this.onPick = onPick;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.addClass("languageforge-modal");
    contentEl.createEl("h2", { text: "Which culture?" });
    for (const c of this.plugin.data.cultures) {
      new import_obsidian.Setting(contentEl).setName(c.name).setDesc(c.summary).addButton((b) => b.setButtonText("Save card").onClick(() => {
        this.close();
        this.onPick(c);
      }));
    }
  }
  onClose() {
    this.contentEl.empty();
  }
};
var LanguageForgeSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    new import_obsidian.Setting(containerEl).setName("Create a new culture").setDesc("Start the wizard for another culture \u2014 you can have as many as you like.").addButton((b) => b.setButtonText("New culture\u2026").onClick(() => {
      new SeedWizardModal(this.app, this.plugin).open();
    }));
    if (this.plugin.data.cultures.length > 0) {
      new import_obsidian.Setting(containerEl).setName("Branch or merge a language").setDesc("Derive a descendant from one parent, or merge two or more existing languages together via contact.").addButton((b) => b.setButtonText("Branch a language\u2026").onClick(() => {
        new DeriveCultureModal(this.app, this.plugin).open();
      }));
      new import_obsidian.Setting(containerEl).setName("Family tree").setDesc("Browse every language's ancestors and descendants.").addButton((b) => b.setButtonText("View family tree\u2026").onClick(() => {
        new FamilyTreeModal(this.app, this.plugin).open();
      }));
    }
    new import_obsidian.Setting(containerEl).setName("Folder for culture cards").setDesc("Culture notes are saved under this folder.").addText((t) => t.setValue(this.plugin.data.settings.folder).onChange(async (v) => {
      this.plugin.data.settings.folder = v.trim() || DEFAULT_SETTINGS.folder;
      await this.plugin.persist();
    }));
    new import_obsidian.Setting(containerEl).setName("Names per batch").addSlider((s) => s.setLimits(6, 24, 2).setValue(this.plugin.data.settings.batchSize).setDynamicTooltip().onChange(async (v) => {
      this.plugin.data.settings.batchSize = v;
      await this.plugin.persist();
    }));
    new import_obsidian.Setting(containerEl).setName("Show pronunciation hints").setDesc("Say-it-like respellings under every name.").addToggle((t) => t.setValue(this.plugin.data.settings.showPronunciation).onChange(async (v) => {
      this.plugin.data.settings.showPronunciation = v;
      await this.plugin.persist();
    }));
    new import_obsidian.Setting(containerEl).setName("Insert format").setDesc("How names are written into your note.").addDropdown((d) => {
      d.addOption("list", "Bulleted list with details");
      d.addOption("inline", "Names only, comma-separated");
      d.setValue(this.plugin.data.settings.insertFormat).onChange(async (v) => {
        this.plugin.data.settings.insertFormat = v;
        await this.plugin.persist();
      });
    });
    containerEl.createEl("p", {
      text: `Element packs loaded: ${Object.keys(PHONETIC_PACKS).length} moods, ${Object.keys(SEMANTIC_PACKS).length} word themes. All gate-validated.`,
      cls: "lf-hint"
    });
  }
};
