// Auto-generated from data/starter-packs-v2.json (gate-validated). Do not hand-edit element lists;
// edit the JSON, re-run tools/pack_validator.py, and regenerate.

export const PHONETIC_PACKS: Record<string, {start: string[]; middle: string[]; end: string[]}> = {
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

export interface TaggedConcept { concept: string; tags: string[]; }

// Auto-generated from data/concept-packs.json (gate-validated). Do not hand-edit concepts;
// edit the JSON, re-run tools/concept_validator.py, and regenerate.
export const SEMANTIC_PACKS: Record<string, {additive: boolean; concepts: TaggedConcept[]}> = {
  "core": {
    "additive": false,
    "concepts": [
      { "concept": "strong", "tags": ["strength", "virtue"] },
      { "concept": "wise", "tags": ["wisdom", "virtue"] },
      { "concept": "noble", "tags": ["rank", "virtue"] },
      { "concept": "fair", "tags": ["beauty", "virtue"] },
      { "concept": "bright", "tags": ["light", "virtue"] },
      { "concept": "swift", "tags": ["virtue"] },
      { "concept": "brave", "tags": ["courage", "virtue"] },
      { "concept": "true", "tags": ["virtue"] },
      { "concept": "free", "tags": ["virtue"] },
      { "concept": "high", "tags": ["rank"] },
      { "concept": "old", "tags": ["age"] },
      { "concept": "young", "tags": ["age"] },
      { "concept": "great", "tags": ["virtue", "rank"] },
      { "concept": "fierce", "tags": ["courage", "war"] },
      { "concept": "gentle", "tags": ["virtue"] },
      { "concept": "proud", "tags": ["virtue"] },
      { "concept": "bold", "tags": ["courage", "virtue"] },
      { "concept": "pure", "tags": ["virtue", "sacred"] },
      { "concept": "dark", "tags": ["dark"] },
      { "concept": "light", "tags": ["light"] },
      { "concept": "man", "tags": ["kin"] },
      { "concept": "woman", "tags": ["kin"] },
      { "concept": "child", "tags": ["kin"] },
      { "concept": "son", "tags": ["kin"] },
      { "concept": "daughter", "tags": ["kin"] },
      { "concept": "born-of", "tags": ["kin"] },
      { "concept": "kin", "tags": ["kin"] },
      { "concept": "elder", "tags": ["kin", "rank", "age"] },
      { "concept": "chief", "tags": ["rank"] },
      { "concept": "lord", "tags": ["rank"] },
      { "concept": "lady", "tags": ["rank"] },
      { "concept": "guardian", "tags": ["rank", "war"] },
      { "concept": "gift", "tags": ["fortune"] },
      { "concept": "hope", "tags": ["joy", "virtue"] },
      { "concept": "joy", "tags": ["joy"] },
      { "concept": "fortune", "tags": ["fortune"] },
      { "concept": "blessed", "tags": ["sacred", "fortune"] },
      { "concept": "beloved", "tags": ["kin", "virtue"] },
      { "concept": "honoured", "tags": ["rank", "virtue"] },
      { "concept": "far-seeing", "tags": ["wisdom"] },
      { "concept": "stone", "tags": ["stone", "earth"] },
      { "concept": "river", "tags": ["river", "water"] },
      { "concept": "hill", "tags": ["earth", "mountain", "place"] },
      { "concept": "star", "tags": ["celestial"] },
      { "concept": "sun", "tags": ["celestial", "light"] },
      { "concept": "moon", "tags": ["celestial"] },
      { "concept": "sky", "tags": ["sky"] },
      { "concept": "flame", "tags": ["fire"] },
      { "concept": "wind", "tags": ["weather", "sky"] },
      { "concept": "dawn", "tags": ["light", "celestial"] },
      { "concept": "wolf", "tags": ["beast", "wild"] },
      { "concept": "hawk", "tags": ["bird", "wild"] },
      { "concept": "bear", "tags": ["beast", "wild", "strength"] },
      { "concept": "stag", "tags": ["beast", "wild"] },
      { "concept": "raven", "tags": ["bird", "wild", "dark"] },
      { "concept": "lion", "tags": ["beast", "strength"] },
      { "concept": "serpent", "tags": ["serpent", "wild"] },
      { "concept": "eagle", "tags": ["bird", "wild"] },
      { "concept": "horse", "tags": ["beast"] },
      { "concept": "hound", "tags": ["beast"] },
      { "concept": "iron", "tags": ["metal", "war"] },
      { "concept": "gold", "tags": ["metal", "wealth"] },
      { "concept": "silver", "tags": ["metal", "wealth"] },
      { "concept": "oak", "tags": ["tree", "flora"] },
      { "concept": "ash-tree", "tags": ["tree", "flora"] },
      { "concept": "thorn", "tags": ["flora", "wild"] },
      { "concept": "shield", "tags": ["weapon", "war"] },
      { "concept": "spear", "tags": ["weapon", "war"] },
      { "concept": "crown", "tags": ["rank"] },
      { "concept": "oath", "tags": ["sacred", "virtue"] },
      { "concept": "beauty", "tags": ["beauty"] },
      { "concept": "grace", "tags": ["beauty", "virtue"] },
      { "concept": "waterfall", "tags": ["water", "river", "place"] },
      { "concept": "bird", "tags": ["bird"] },
      { "concept": "blossom", "tags": ["flower", "flora"] },
      { "concept": "rose", "tags": ["flower", "flora"] },
      { "concept": "song", "tags": ["sound"] },
      { "concept": "mist", "tags": ["weather", "water"] },
      { "concept": "glory", "tags": ["virtue", "rank"] },
      { "concept": "lily", "tags": ["flower", "flora"] },
      { "concept": "iris", "tags": ["flower", "flora"] },
      { "concept": "violet", "tags": ["flower", "flora"] },
      { "concept": "petal", "tags": ["flower", "flora"] },
      { "concept": "bloom", "tags": ["flower", "flora"] },
      { "concept": "heather", "tags": ["flower", "flora", "herb"] },
      { "concept": "jasmine", "tags": ["flower", "flora"] },
      { "concept": "home", "tags": ["home", "hearth"] },
      { "concept": "cradle", "tags": ["kin", "hearth", "home"] },
      { "concept": "victory", "tags": ["war", "fortune"] },
      { "concept": "tide", "tags": ["sea", "water"] },
      { "concept": "ember", "tags": ["fire"] },
      { "concept": "echo", "tags": ["sound"] }
    ]
  },
  "warrior": {
    "additive": true,
    "concepts": [
      { "concept": "sword", "tags": ["weapon", "war"] },
      { "concept": "blade", "tags": ["weapon", "war"] },
      { "concept": "axe", "tags": ["weapon", "war"] },
      { "concept": "spear", "tags": ["weapon", "war"] },
      { "concept": "shield", "tags": ["weapon", "war"] },
      { "concept": "war", "tags": ["war"] },
      { "concept": "battle", "tags": ["war"] },
      { "concept": "valour", "tags": ["courage", "war", "virtue"] },
      { "concept": "victory", "tags": ["war", "fortune"] },
      { "concept": "conquest", "tags": ["war"] },
      { "concept": "blood", "tags": ["war", "death"] },
      { "concept": "fury", "tags": ["war"] },
      { "concept": "wrath", "tags": ["war"] },
      { "concept": "iron", "tags": ["metal", "war"] },
      { "concept": "steel", "tags": ["metal", "war"] },
      { "concept": "banner", "tags": ["war", "rank"] },
      { "concept": "fortress", "tags": ["war", "settlement", "place"] },
      { "concept": "strike", "tags": ["war"] },
      { "concept": "wound", "tags": ["war", "death"] },
      { "concept": "vengeance", "tags": ["war", "death"] },
      { "concept": "guard", "tags": ["war", "rank"] },
      { "concept": "warband", "tags": ["war", "kin"] },
      { "concept": "champion", "tags": ["war", "rank"] },
      { "concept": "scar", "tags": ["war"] },
      { "concept": "siege", "tags": ["war"] },
      { "concept": "rally", "tags": ["war"] },
      { "concept": "onslaught", "tags": ["war"] },
      { "concept": "bane", "tags": ["war", "death"] },
      { "concept": "unbroken", "tags": ["war", "virtue"] },
      { "concept": "deathless", "tags": ["death", "war"] }
    ]
  },
  "seafaring": {
    "additive": true,
    "concepts": [
      { "concept": "sea", "tags": ["sea", "water"] },
      { "concept": "wave", "tags": ["sea", "water"] },
      { "concept": "tide", "tags": ["sea", "water"] },
      { "concept": "salt", "tags": ["sea"] },
      { "concept": "storm", "tags": ["weather", "sea"] },
      { "concept": "harbour", "tags": ["sea", "settlement", "place"] },
      { "concept": "sail", "tags": ["sea", "craft"] },
      { "concept": "ship", "tags": ["sea", "craft"] },
      { "concept": "deep", "tags": ["sea"] },
      { "concept": "current", "tags": ["sea", "water"] },
      { "concept": "foam", "tags": ["sea", "water"] },
      { "concept": "anchor", "tags": ["sea", "craft"] },
      { "concept": "horizon", "tags": ["sea", "sky", "place"] },
      { "concept": "island", "tags": ["sea", "place"] },
      { "concept": "shore", "tags": ["sea", "place"] },
      { "concept": "fathom", "tags": ["sea"] },
      { "concept": "gull", "tags": ["bird", "sea"] },
      { "concept": "brine", "tags": ["sea", "water"] },
      { "concept": "reef", "tags": ["sea", "stone"] },
      { "concept": "squall", "tags": ["weather", "sea"] },
      { "concept": "voyage", "tags": ["sea"] },
      { "concept": "mast", "tags": ["sea", "craft"] },
      { "concept": "keel", "tags": ["sea", "craft"] },
      { "concept": "drowned", "tags": ["sea", "death"] },
      { "concept": "far-shore", "tags": ["sea", "place"] },
      { "concept": "seaborne", "tags": ["sea"] },
      { "concept": "spray", "tags": ["sea", "water"] },
      { "concept": "leviathan", "tags": ["fish", "sea", "serpent"] },
      { "concept": "beacon", "tags": ["sea", "light", "craft"] },
      { "concept": "helm", "tags": ["sea", "craft"] }
    ]
  },
  "mountain": {
    "additive": true,
    "concepts": [
      { "concept": "peak", "tags": ["mountain", "place"] },
      { "concept": "granite", "tags": ["stone", "mountain"] },
      { "concept": "cliff", "tags": ["mountain", "stone", "place"] },
      { "concept": "snow", "tags": ["ice", "weather"] },
      { "concept": "ore", "tags": ["metal", "stone"] },
      { "concept": "ridge", "tags": ["mountain", "place"] },
      { "concept": "cavern", "tags": ["earth", "place"] },
      { "concept": "echo", "tags": ["sound"] },
      { "concept": "avalanche", "tags": ["mountain", "ice", "weather"] },
      { "concept": "summit", "tags": ["mountain", "place"] },
      { "concept": "delve", "tags": ["earth", "craft"] },
      { "concept": "deep-road", "tags": ["earth", "craft", "place"] },
      { "concept": "frost", "tags": ["ice", "weather"] },
      { "concept": "eagle", "tags": ["bird", "wild"] },
      { "concept": "chasm", "tags": ["earth", "place"] },
      { "concept": "boulder", "tags": ["stone"] },
      { "concept": "scree", "tags": ["stone", "mountain"] },
      { "concept": "glacier", "tags": ["ice", "mountain"] },
      { "concept": "hold", "tags": ["settlement", "place", "war"] },
      { "concept": "highborn", "tags": ["rank", "mountain"] }
    ]
  },
  "forest": {
    "additive": true,
    "concepts": [
      { "concept": "leaf", "tags": ["flora", "tree"] },
      { "concept": "root", "tags": ["flora", "tree", "earth"] },
      { "concept": "thorn", "tags": ["flora", "wild"] },
      { "concept": "oak", "tags": ["tree", "flora"] },
      { "concept": "moss", "tags": ["flora", "herb"] },
      { "concept": "grove", "tags": ["tree", "forest", "place"] },
      { "concept": "green", "tags": ["flora", "forest"] },
      { "concept": "hunt", "tags": ["wild", "war"] },
      { "concept": "shadow", "tags": ["dark"] },
      { "concept": "antler", "tags": ["beast", "wild"] },
      { "concept": "briar", "tags": ["flora", "wild"] },
      { "concept": "hollow", "tags": ["forest", "place"] },
      { "concept": "fern", "tags": ["herb", "flora"] },
      { "concept": "boar", "tags": ["beast", "wild"] },
      { "concept": "vine", "tags": ["flora"] },
      { "concept": "wildwood", "tags": ["forest", "wild", "tree"] },
      { "concept": "trail", "tags": ["wild", "place"] },
      { "concept": "quiet", "tags": ["virtue"] },
      { "concept": "undergrowth", "tags": ["flora", "forest"] },
      { "concept": "evergreen", "tags": ["tree", "flora"] }
    ]
  },
  "arcane": {
    "additive": true,
    "concepts": [
      { "concept": "rune", "tags": ["magic", "craft"] },
      { "concept": "veil", "tags": ["magic", "dark"] },
      { "concept": "spell", "tags": ["magic"] },
      { "concept": "spirit", "tags": ["spirit", "magic"] },
      { "concept": "dream", "tags": ["magic", "spirit"] },
      { "concept": "ward", "tags": ["magic", "war"] },
      { "concept": "ether", "tags": ["magic", "sky"] },
      { "concept": "glyph", "tags": ["magic", "craft"] },
      { "concept": "star", "tags": ["celestial"] },
      { "concept": "moon", "tags": ["celestial"] },
      { "concept": "hollow", "tags": ["magic", "place"] },
      { "concept": "whisper", "tags": ["sound", "magic"] },
      { "concept": "sigil", "tags": ["magic", "craft"] },
      { "concept": "aether", "tags": ["magic", "sky"] },
      { "concept": "unseen", "tags": ["magic", "spirit"] },
      { "concept": "threshold", "tags": ["magic", "place"] },
      { "concept": "binding", "tags": ["magic"] },
      { "concept": "far-mind", "tags": ["magic", "wisdom"] },
      { "concept": "twilight", "tags": ["dark", "light", "celestial"] },
      { "concept": "wyrd", "tags": ["magic", "fortune", "death"] }
    ]
  },
  "desert": {
    "additive": true,
    "concepts": [
      { "concept": "sand", "tags": ["earth"] },
      { "concept": "sun", "tags": ["celestial", "light"] },
      { "concept": "dune", "tags": ["earth", "place"] },
      { "concept": "mirage", "tags": ["light", "magic"] },
      { "concept": "ember", "tags": ["fire"] },
      { "concept": "scorpion", "tags": ["beast", "wild"] },
      { "concept": "dry", "tags": ["weather"] },
      { "concept": "oasis", "tags": ["water", "place"] },
      { "concept": "dust", "tags": ["earth"] },
      { "concept": "glare", "tags": ["light"] },
      { "concept": "thirst", "tags": ["water"] },
      { "concept": "wanderer", "tags": ["wild"] },
      { "concept": "caravan", "tags": ["trade"] },
      { "concept": "scorched", "tags": ["fire"] },
      { "concept": "sirocco", "tags": ["weather"] },
      { "concept": "waterless", "tags": ["water"] },
      { "concept": "flint", "tags": ["stone", "fire"] },
      { "concept": "vulture", "tags": ["bird", "death", "wild"] },
      { "concept": "far-road", "tags": ["place", "trade"] },
      { "concept": "sunblind", "tags": ["light"] }
    ]
  },
  "mercantile": {
    "additive": true,
    "concepts": [
      { "concept": "coin", "tags": ["wealth", "trade"] },
      { "concept": "gate", "tags": ["settlement", "place"] },
      { "concept": "guild", "tags": ["trade", "craft"] },
      { "concept": "road", "tags": ["place", "trade"] },
      { "concept": "market", "tags": ["trade", "settlement"] },
      { "concept": "bell", "tags": ["craft", "sound"] },
      { "concept": "ledger", "tags": ["trade", "craft"] },
      { "concept": "tower", "tags": ["settlement", "place"] },
      { "concept": "key", "tags": ["craft"] },
      { "concept": "scale", "tags": ["trade", "craft"] },
      { "concept": "bridge", "tags": ["settlement", "place"] },
      { "concept": "toll", "tags": ["trade"] },
      { "concept": "banker", "tags": ["trade", "wealth"] },
      { "concept": "contract", "tags": ["trade"] },
      { "concept": "quarter", "tags": ["settlement", "place"] },
      { "concept": "counting-house", "tags": ["trade", "settlement"] },
      { "concept": "seal", "tags": ["craft", "trade"] },
      { "concept": "vault", "tags": ["wealth", "settlement"] },
      { "concept": "wheelwright", "tags": ["craft", "trade"] },
      { "concept": "highroad", "tags": ["place", "trade"] }
    ]
  },
  "priestly": {
    "additive": true,
    "concepts": [
      { "concept": "light", "tags": ["light", "sacred"] },
      { "concept": "temple", "tags": ["sacred", "settlement", "place"] },
      { "concept": "prayer", "tags": ["sacred"] },
      { "concept": "saint", "tags": ["sacred", "rank"] },
      { "concept": "vow", "tags": ["sacred", "virtue"] },
      { "concept": "dawn", "tags": ["light", "celestial", "sacred"] },
      { "concept": "incense", "tags": ["sacred", "craft"] },
      { "concept": "pilgrim", "tags": ["sacred", "wild"] },
      { "concept": "grace", "tags": ["beauty", "sacred", "virtue"] },
      { "concept": "ashes", "tags": ["sacred", "death", "fire"] },
      { "concept": "relic", "tags": ["sacred", "craft"] },
      { "concept": "hymn", "tags": ["sacred", "sound"] },
      { "concept": "cloister", "tags": ["sacred", "settlement", "place"] },
      { "concept": "penitent", "tags": ["sacred"] },
      { "concept": "sanctified", "tags": ["sacred"] },
      { "concept": "vigil", "tags": ["sacred", "light"] },
      { "concept": "sacred-fire", "tags": ["sacred", "fire"] },
      { "concept": "confessor", "tags": ["sacred", "rank"] },
      { "concept": "shroud", "tags": ["sacred", "death"] },
      { "concept": "benediction", "tags": ["sacred"] }
    ]
  },
  "agrarian": {
    "additive": true,
    "concepts": [
      { "concept": "field", "tags": ["earth", "place", "grain"] },
      { "concept": "grain", "tags": ["grain", "flora"] },
      { "concept": "harvest", "tags": ["grain", "fortune"] },
      { "concept": "ox", "tags": ["beast"] },
      { "concept": "plough", "tags": ["craft"] },
      { "concept": "hearth", "tags": ["hearth", "fire", "home"] },
      { "concept": "seed", "tags": ["flora", "grain"] },
      { "concept": "meadow", "tags": ["flora", "place", "wild"] },
      { "concept": "shepherd", "tags": ["beast", "craft"] },
      { "concept": "orchard", "tags": ["tree", "fruit", "place"] },
      { "concept": "furrow", "tags": ["earth"] },
      { "concept": "millstone", "tags": ["craft", "stone"] },
      { "concept": "cattle", "tags": ["beast"] },
      { "concept": "well-fed", "tags": ["hearth", "fortune"] },
      { "concept": "sunlit", "tags": ["light"] },
      { "concept": "homestead", "tags": ["hearth", "settlement", "home", "place"] },
      { "concept": "scythe", "tags": ["craft"] },
      { "concept": "fallow", "tags": ["earth"] },
      { "concept": "greenrow", "tags": ["flora", "place"] },
      { "concept": "goodhearth", "tags": ["hearth", "home", "fortune"] }
    ]
  }
};


// -- Drift packs --------------------------------------------------------
// Types and DRIFT_PACKS live here (not engine.ts) because engine.ts already
// imports PHONETIC_PACKS/SEMANTIC_PACKS from this file — data.ts is the
// dependency leaf.

export type DriftWhen =
  | "always"
  | "intervocalic"
  | "initial"
  | "final"
  | "after_vowel"
  | "before_vowel"
  | "after_consonant"
  | "before_consonant"
  | "unstressed";

export interface SoundChange {
  from: string;
  to: string;
  when: DriftWhen;
  gloss: string;
}

export type EffectFamily = "softening" | "compression" | "vowel-shift" | "hardening" | "reshaping";
export type DriftDirection = "erosion" | "shift";
export type DriftAppliesTo = "descent" | "loanword";

export interface DriftPack {
  effectFamily: EffectFamily;
  direction: DriftDirection;
  appliesTo: DriftAppliesTo;
  plainDescription: string;
  why: string;
  rules: SoundChange[]; // ORDER MATTERS — applied as a single ordered pass, feeding chains intentional
}

// Auto-generated from data/drift-packs.json (gate-validated). Do not hand-edit rules;
// edit the JSON, re-run tools/drift_validator.py, and regenerate.
export const DRIFT_PACKS: Record<string, DriftPack> = {
  "romance_softening": {
    "effectFamily": "softening",
    "direction": "erosion",
    "appliesTo": "descent",
    "plainDescription": "Hard stops soften and voice between vowels, then spirantise; doubles simplify.",
    "why": "The Western Romance path (Latin to Spanish/Italian): vita-like forms wear toward vida-like ones. Names come out fluid and worn.",
    "rules": [
      { "from": "p", "to": "b", "when": "intervocalic", "gloss": "voiceless stop p voices between vowels" },
      { "from": "t", "to": "d", "when": "intervocalic", "gloss": "voiceless stop t voices between vowels" },
      { "from": "c", "to": "g", "when": "intervocalic", "gloss": "voiceless stop k/c voices between vowels" },
      { "from": "k", "to": "g", "when": "intervocalic", "gloss": "voiceless stop k voices between vowels" },
      { "from": "b", "to": "v", "when": "intervocalic", "gloss": "voiced stop b spirantises (feeds from p>b)" },
      { "from": "d", "to": "dh", "when": "intervocalic", "gloss": "voiced stop d spirantises to a soft th (feeds from t>d)" },
      { "from": "g", "to": "gh", "when": "intervocalic", "gloss": "voiced stop g spirantises (feeds from c/k>g)" },
      { "from": "pp", "to": "p", "when": "always", "gloss": "geminate simplifies" },
      { "from": "tt", "to": "t", "when": "always", "gloss": "geminate simplifies" },
      { "from": "kk", "to": "k", "when": "always", "gloss": "geminate simplifies" },
      { "from": "ll", "to": "l", "when": "always", "gloss": "geminate simplifies" }
    ]
  },
  "celtic_lenition": {
    "effectFamily": "softening",
    "direction": "erosion",
    "appliesTo": "descent",
    "plainDescription": "Intervocalic consonants weaken toward fricatives and h; m goes to v, s goes to h.",
    "why": "The Celtic lenition pattern: consonants soften between vowels in distinctive ways (s>h, m>v) that give a different flavour from the Romance path.",
    "rules": [
      { "from": "t", "to": "th", "when": "intervocalic", "gloss": "t spirantises" },
      { "from": "c", "to": "gh", "when": "intervocalic", "gloss": "k/c weakens to a back fricative" },
      { "from": "k", "to": "gh", "when": "intervocalic", "gloss": "k weakens to a back fricative" },
      { "from": "b", "to": "v", "when": "intervocalic", "gloss": "b spirantises" },
      { "from": "m", "to": "v", "when": "intervocalic", "gloss": "nasal lenites to v (the Irish 'mh')" },
      { "from": "s", "to": "h", "when": "intervocalic", "gloss": "s lenites to h" },
      { "from": "d", "to": "dh", "when": "intervocalic", "gloss": "d spirantises to a soft th" }
    ]
  },
  "vowel_melting": {
    "effectFamily": "softening",
    "direction": "erosion",
    "appliesTo": "descent",
    "plainDescription": "Adjacent vowels merge; doubled vowels collapse.",
    "why": "The path toward French-like smoothing, where vowel clusters melt into single sounds and endings blur.",
    "rules": [
      { "from": "aa", "to": "a", "when": "always", "gloss": "long vowel simplifies" },
      { "from": "ee", "to": "e", "when": "always", "gloss": "long vowel simplifies" },
      { "from": "oo", "to": "o", "when": "always", "gloss": "long vowel simplifies" },
      { "from": "ii", "to": "i", "when": "always", "gloss": "long vowel simplifies" },
      { "from": "ae", "to": "e", "when": "always", "gloss": "diphthong monophthongises" },
      { "from": "oe", "to": "e", "when": "always", "gloss": "diphthong monophthongises" },
      { "from": "ea", "to": "a", "when": "always", "gloss": "vowel cluster melts" },
      { "from": "ou", "to": "u", "when": "always", "gloss": "vowel cluster melts" },
      { "from": "eo", "to": "o", "when": "always", "gloss": "vowel cluster melts" }
    ]
  },
  "syllable_erosion": {
    "effectFamily": "compression",
    "direction": "erosion",
    "appliesTo": "descent",
    "plainDescription": "Intervocalic h drops, final unstressed vowels fall away, and resulting doubles simplify.",
    "why": "The literal 'Ban-hok becomes Bannock' path (rassaku Part III): speakers wear names down toward what is easiest to say. The clearest demonstration of the ease law.",
    "rules": [
      { "from": "h", "to": "", "when": "intervocalic", "gloss": "intervocalic h is dropped" },
      { "from": "e", "to": "", "when": "final", "gloss": "final unstressed vowel apocope" },
      { "from": "a", "to": "", "when": "final", "gloss": "final unstressed vowel apocope" },
      { "from": "nn", "to": "n", "when": "always", "gloss": "geminate simplifies after deletion" },
      { "from": "ll", "to": "l", "when": "always", "gloss": "geminate simplifies after deletion" },
      { "from": "tt", "to": "t", "when": "always", "gloss": "geminate simplifies after deletion" }
    ]
  },
  "vowel_shift": {
    "effectFamily": "vowel-shift",
    "direction": "shift",
    "appliesTo": "descent",
    "plainDescription": "A push chain: back vowels raise and the long high front vowel diphthongises. Consonants untouched.",
    "why": "The Great-Vowel-Shift feel. Ordered as a push chain (o>u fires before a>o) so the vowels rotate without merging into each other.",
    "rules": [
      { "from": "ii", "to": "ai", "when": "always", "gloss": "long high front vowel diphthongises" },
      { "from": "o", "to": "u", "when": "always", "gloss": "mid back vowel raises (fires first to clear the slot)" },
      { "from": "a", "to": "o", "when": "always", "gloss": "low vowel raises into the vacated slot" }
    ]
  },
  "germanic_hardening": {
    "effectFamily": "hardening",
    "direction": "shift",
    "appliesTo": "descent",
    "plainDescription": "A Grimm-style consonant shift plus final-obstruent devoicing.",
    "why": "The Germanic path: p/t/k become fricatives while b/d/g harden into p/t/k. Ordered so the two waves stay distinct in a single pass.",
    "rules": [
      { "from": "p", "to": "f", "when": "always", "gloss": "voiceless stop spirantises (wave 1, fires before b>p)" },
      { "from": "t", "to": "th", "when": "always", "gloss": "voiceless stop spirantises" },
      { "from": "k", "to": "h", "when": "always", "gloss": "voiceless stop spirantises" },
      { "from": "b", "to": "p", "when": "always", "gloss": "voiced stop hardens into the vacated p slot (wave 2)" },
      { "from": "d", "to": "t", "when": "always", "gloss": "voiced stop hardens" },
      { "from": "g", "to": "k", "when": "always", "gloss": "voiced stop hardens" },
      { "from": "v", "to": "f", "when": "final", "gloss": "final obstruent devoices (easier to release)" },
      { "from": "z", "to": "s", "when": "final", "gloss": "final obstruent devoices" },
      { "from": "thh", "to": "th", "when": "always", "gloss": "tidy: a stop spirantising beside an existing th leaves th, not thh" },
      { "from": "hh", "to": "h", "when": "always", "gloss": "tidy: doubled h simplifies" }
    ]
  },
  "prestige_exonym": {
    "effectFamily": "reshaping",
    "direction": "shift",
    "appliesTo": "loanword",
    "plainDescription": "Adapts a foreign name to a borrower who lacks its harder sounds: fricatives plainen, exotic letters simplify, glottal marks drop.",
    "why": "The Confucius mechanic. A donor form is worn to the borrower's simpler phonology as it crosses the contact edge, which is also a readability win. Used by contact edges, not descent chains.",
    "rules": [
      { "from": "dh", "to": "d", "when": "always", "gloss": "borrower lacks the soft-th, hears a plain d" },
      { "from": "gh", "to": "g", "when": "always", "gloss": "borrower lacks the back fricative, hears a plain g" },
      { "from": "th", "to": "t", "when": "always", "gloss": "borrower flattens th to t" },
      { "from": "x", "to": "k", "when": "always", "gloss": "borrower reads x as a plain k" },
      { "from": "'", "to": "", "when": "always", "gloss": "borrower ignores the glottal mark it cannot say" },
      { "from": "kh", "to": "k", "when": "always", "gloss": "aspirate simplifies" }
    ]
  }
};

// -- Naming traditions ---------------------------------------------------

export interface NamingPattern { type: string; weight: number; }
export interface ToponymicGeneric { form: string; meaning: string; position: "prefix" | "suffix"; }
export interface ContentPolicy { favour?: string[]; lock?: string[]; exclude?: string[]; }
export interface GenderProfile { themes?: string[]; patronymicAffix?: string; }
export interface TheophoricParticles { relations: Record<string, string>; order?: string; }
export interface HouseParticles { kind?: string; prefix?: string; affix?: string; of?: string; }
export interface PatronymicParticles { genitive?: string; of?: string; }
export interface EpithetParticles { article?: string; position?: string; }
export interface TraditionParticles {
  theophoric?: TheophoricParticles;
  house?: HouseParticles;
  patronymic?: PatronymicParticles;
  epithet?: EpithetParticles;
}
export interface NamingTradition {
  label: string;
  subtitle: string;
  contentPolicy: ContentPolicy;
  genders: { masculine?: GenderProfile; feminine?: GenderProfile; neutral?: GenderProfile };
  patterns: { personal: NamingPattern[]; place: NamingPattern[]; house: NamingPattern[] };
  particles?: TraditionParticles;
  toponymicGenerics?: { settlement?: ToponymicGeneric[]; feature?: ToponymicGeneric[] };
  surnameRate?: number;
  notes?: string;
}

// Auto-generated from data/naming-traditions.json (gate-validated). Do not hand-edit;
// edit the JSON, re-run tools/naming_traditions_validator.py, and regenerate.
export const NAMING_TRADITIONS: Record<string, NamingTradition> = {
  "old_norse": {
    "label": "Old Norse naming",
    "subtitle": "Norse \u00b7 Scandinavian",
    "contentPolicy": {
      "favour": [
        "beast",
        "war",
        "strength",
        "sacred",
        "rank"
      ]
    },
    "genders": {
      "masculine": {
        "themes": [
          "beast",
          "war",
          "strength",
          "weapon",
          "rank"
        ],
        "patronymicAffix": "-son"
      },
      "feminine": {
        "themes": [
          "beauty",
          "virtue",
          "sacred",
          "fortune",
          "joy"
        ],
        "patronymicAffix": "-dottir"
      },
      "neutral": {
        "themes": [
          "beast",
          "sacred",
          "war"
        ]
      }
    },
    "patterns": {
      "personal": [
        {
          "type": "dithematic",
          "weight": 0.7
        },
        {
          "type": "single",
          "weight": 0.3
        }
      ],
      "place": [
        {
          "type": "descriptive-generic",
          "weight": 0.6
        },
        {
          "type": "feature-descriptive",
          "weight": 0.4
        }
      ],
      "house": [
        {
          "type": "founder-line",
          "weight": 1.0
        }
      ]
    },
    "toponymicGenerics": {
      "settlement": [
        {
          "form": "by",
          "meaning": "village",
          "position": "suffix"
        },
        {
          "form": "thorpe",
          "meaning": "outlying farm",
          "position": "suffix"
        },
        {
          "form": "gard",
          "meaning": "enclosure",
          "position": "suffix"
        },
        {
          "form": "stad",
          "meaning": "place",
          "position": "suffix"
        },
        {
          "form": "saetr",
          "meaning": "shieling",
          "position": "suffix"
        }
      ],
      "feature": [
        {
          "form": "fell",
          "meaning": "hill",
          "position": "suffix"
        },
        {
          "form": "dalr",
          "meaning": "valley",
          "position": "suffix"
        },
        {
          "form": "vik",
          "meaning": "bay",
          "position": "suffix"
        },
        {
          "form": "foss",
          "meaning": "waterfall",
          "position": "suffix"
        },
        {
          "form": "vatn",
          "meaning": "lake",
          "position": "suffix"
        },
        {
          "form": "nes",
          "meaning": "headland",
          "position": "suffix"
        }
      ]
    },
    "particles": {
      "patronymic": {
        "genitive": "s",
        "of": ""
      },
      "house": {
        "kind": "founder-line",
        "affix": "-ungar"
      }
    },
    "surnameRate": 0.8,
    "notes": "Dithematic given names plus a patronymic that changes each generation; features keep the deepest map-strata."
  },
  "anglo_saxon": {
    "label": "Anglo-Saxon naming",
    "subtitle": "Old English",
    "contentPolicy": {
      "favour": [
        "virtue",
        "rank",
        "war",
        "sacred",
        "kin"
      ]
    },
    "genders": {
      "masculine": {
        "themes": [
          "rank",
          "war",
          "virtue",
          "weapon"
        ]
      },
      "feminine": {
        "themes": [
          "virtue",
          "beauty",
          "sacred",
          "joy"
        ]
      },
      "neutral": {
        "themes": [
          "virtue",
          "rank"
        ]
      }
    },
    "patterns": {
      "personal": [
        {
          "type": "dithematic",
          "weight": 0.8
        },
        {
          "type": "single",
          "weight": 0.2
        }
      ],
      "place": [
        {
          "type": "descriptive-generic",
          "weight": 0.5
        },
        {
          "type": "possessive-settlement",
          "weight": 0.3
        },
        {
          "type": "feature-descriptive",
          "weight": 0.2
        }
      ],
      "house": [
        {
          "type": "founder-line",
          "weight": 1.0
        }
      ]
    },
    "toponymicGenerics": {
      "settlement": [
        {
          "form": "ton",
          "meaning": "farmstead",
          "position": "suffix"
        },
        {
          "form": "ham",
          "meaning": "homestead",
          "position": "suffix"
        },
        {
          "form": "wich",
          "meaning": "dwelling",
          "position": "suffix"
        },
        {
          "form": "bury",
          "meaning": "fortified place",
          "position": "suffix"
        },
        {
          "form": "worth",
          "meaning": "enclosure",
          "position": "suffix"
        },
        {
          "form": "stead",
          "meaning": "place",
          "position": "suffix"
        }
      ],
      "feature": [
        {
          "form": "ford",
          "meaning": "river crossing",
          "position": "suffix"
        },
        {
          "form": "mere",
          "meaning": "lake",
          "position": "suffix"
        },
        {
          "form": "combe",
          "meaning": "valley",
          "position": "suffix"
        },
        {
          "form": "don",
          "meaning": "hill",
          "position": "suffix"
        },
        {
          "form": "ley",
          "meaning": "clearing",
          "position": "suffix"
        },
        {
          "form": "hurst",
          "meaning": "wooded hill",
          "position": "suffix"
        }
      ]
    },
    "particles": {
      "house": {
        "kind": "founder-line",
        "affix": "-ingas"
      }
    },
    "surnameRate": 0.4,
    "notes": "Dithematic names with family alliteration; -ingas marks 'the people of'."
  },
  "roman": {
    "label": "Roman naming",
    "subtitle": "Latin",
    "contentPolicy": {
      "favour": [
        "virtue",
        "beauty",
        "light",
        "beast",
        "flora"
      ]
    },
    "genders": {
      "masculine": {
        "themes": [
          "virtue",
          "rank",
          "strength"
        ]
      },
      "feminine": {
        "themes": [
          "beauty",
          "virtue",
          "flora"
        ]
      }
    },
    "patterns": {
      "personal": [
        {
          "type": "single",
          "weight": 0.5
        },
        {
          "type": "epithet",
          "weight": 0.5
        }
      ],
      "place": [
        {
          "type": "descriptive-generic",
          "weight": 0.6
        },
        {
          "type": "possessive-settlement",
          "weight": 0.4
        }
      ],
      "house": [
        {
          "type": "gens",
          "weight": 1.0
        }
      ]
    },
    "toponymicGenerics": {
      "settlement": [
        {
          "form": "Colonia",
          "meaning": "colony",
          "position": "prefix"
        },
        {
          "form": "Castra",
          "meaning": "fort",
          "position": "prefix"
        },
        {
          "form": "Portus",
          "meaning": "port",
          "position": "prefix"
        },
        {
          "form": "Forum",
          "meaning": "market",
          "position": "prefix"
        },
        {
          "form": "Villa",
          "meaning": "estate",
          "position": "prefix"
        }
      ],
      "feature": [
        {
          "form": "Mons",
          "meaning": "mountain",
          "position": "prefix"
        },
        {
          "form": "Flumen",
          "meaning": "river",
          "position": "prefix"
        },
        {
          "form": "Silva",
          "meaning": "forest",
          "position": "prefix"
        },
        {
          "form": "Lacus",
          "meaning": "lake",
          "position": "prefix"
        }
      ]
    },
    "particles": {
      "epithet": {
        "article": "",
        "position": "after"
      },
      "house": {
        "kind": "gens",
        "affix": "-ius"
      }
    },
    "surnameRate": 0.9,
    "notes": "Tria nomina \u2014 given + gens (family) + trait cognomen. The gens is the house name; feminine takes -ia."
  },
  "greek": {
    "label": "Ancient Greek naming",
    "subtitle": "Hellenic",
    "contentPolicy": {
      "favour": [
        "sacred",
        "virtue",
        "war",
        "celestial",
        "rank"
      ]
    },
    "genders": {
      "masculine": {
        "themes": [
          "war",
          "rank",
          "virtue",
          "celestial"
        ]
      },
      "feminine": {
        "themes": [
          "beauty",
          "virtue",
          "sacred",
          "joy"
        ]
      }
    },
    "patterns": {
      "personal": [
        {
          "type": "theophoric",
          "weight": 0.4
        },
        {
          "type": "dithematic",
          "weight": 0.4
        },
        {
          "type": "single",
          "weight": 0.2
        }
      ],
      "place": [
        {
          "type": "descriptive-generic",
          "weight": 0.5
        },
        {
          "type": "feature-descriptive",
          "weight": 0.3
        },
        {
          "type": "theonymic-place",
          "weight": 0.2
        }
      ],
      "house": [
        {
          "type": "founder-line",
          "weight": 1.0
        }
      ]
    },
    "toponymicGenerics": {
      "settlement": [
        {
          "form": "polis",
          "meaning": "city",
          "position": "suffix"
        },
        {
          "form": "a",
          "meaning": "place",
          "position": "suffix"
        },
        {
          "form": "ia",
          "meaning": "region",
          "position": "suffix"
        }
      ],
      "feature": [
        {
          "form": "Acro",
          "meaning": "height",
          "position": "prefix"
        },
        {
          "form": "oros",
          "meaning": "mountain",
          "position": "suffix"
        },
        {
          "form": "potamos",
          "meaning": "river",
          "position": "suffix"
        },
        {
          "form": "nesos",
          "meaning": "island",
          "position": "suffix"
        }
      ]
    },
    "particles": {
      "theophoric": {
        "relations": {
          "gift": "doros",
          "glory": "kleos",
          "ruler": "kratos",
          "people": "laos"
        },
        "order": "element-first"
      },
      "house": {
        "kind": "founder-line",
        "affix": "-idai"
      }
    },
    "surnameRate": 0.5,
    "notes": "Theophoric and dithematic given names; -idai marks a descent line (Herakleidai)."
  },
  "gaelic": {
    "label": "Gaelic naming",
    "subtitle": "Irish \u00b7 Scottish",
    "contentPolicy": {
      "favour": [
        "virtue",
        "beast",
        "sacred",
        "flora",
        "wild"
      ]
    },
    "genders": {
      "masculine": {
        "themes": [
          "beast",
          "war",
          "virtue",
          "rank"
        ]
      },
      "feminine": {
        "themes": [
          "beauty",
          "virtue",
          "sacred",
          "flora"
        ]
      }
    },
    "patterns": {
      "personal": [
        {
          "type": "single",
          "weight": 0.7
        },
        {
          "type": "epithet",
          "weight": 0.3
        }
      ],
      "place": [
        {
          "type": "descriptive-generic",
          "weight": 0.6
        },
        {
          "type": "feature-descriptive",
          "weight": 0.4
        }
      ],
      "house": [
        {
          "type": "clan-patronymic",
          "weight": 1.0
        }
      ]
    },
    "toponymicGenerics": {
      "settlement": [
        {
          "form": "Bally",
          "meaning": "town",
          "position": "prefix"
        },
        {
          "form": "Kil",
          "meaning": "church",
          "position": "prefix"
        },
        {
          "form": "Dun",
          "meaning": "fort",
          "position": "prefix"
        },
        {
          "form": "Rath",
          "meaning": "ringfort",
          "position": "prefix"
        },
        {
          "form": "Lis",
          "meaning": "fort",
          "position": "prefix"
        }
      ],
      "feature": [
        {
          "form": "Inver",
          "meaning": "river mouth",
          "position": "prefix"
        },
        {
          "form": "Glen",
          "meaning": "valley",
          "position": "prefix"
        },
        {
          "form": "Ben",
          "meaning": "mountain",
          "position": "prefix"
        },
        {
          "form": "Loch",
          "meaning": "lake",
          "position": "prefix"
        },
        {
          "form": "Ard",
          "meaning": "height",
          "position": "prefix"
        },
        {
          "form": "Drum",
          "meaning": "ridge",
          "position": "prefix"
        }
      ]
    },
    "particles": {
      "epithet": {
        "article": "the",
        "position": "after"
      },
      "house": {
        "kind": "clan",
        "prefix": "Mac",
        "of": ""
      }
    },
    "surnameRate": 0.7,
    "notes": "Single given name plus a clan name (Mac 'son of', O 'grandson of') and a descriptive byname."
  },
  "welsh": {
    "label": "Welsh naming",
    "subtitle": "Brythonic",
    "contentPolicy": {
      "favour": [
        "flora",
        "water",
        "mountain",
        "virtue",
        "rank"
      ]
    },
    "genders": {
      "masculine": {
        "themes": [
          "rank",
          "virtue",
          "beast"
        ],
        "patronymicAffix": "ap"
      },
      "feminine": {
        "themes": [
          "beauty",
          "virtue",
          "flora"
        ],
        "patronymicAffix": "ferch"
      },
      "neutral": {
        "themes": [
          "virtue",
          "flora"
        ]
      }
    },
    "patterns": {
      "personal": [
        {
          "type": "single",
          "weight": 0.7
        },
        {
          "type": "epithet",
          "weight": 0.3
        }
      ],
      "place": [
        {
          "type": "descriptive-generic",
          "weight": 0.7
        },
        {
          "type": "feature-descriptive",
          "weight": 0.3
        }
      ],
      "house": [
        {
          "type": "clan-patronymic",
          "weight": 1.0
        }
      ]
    },
    "toponymicGenerics": {
      "settlement": [
        {
          "form": "Llan",
          "meaning": "church",
          "position": "prefix"
        },
        {
          "form": "Caer",
          "meaning": "fort",
          "position": "prefix"
        },
        {
          "form": "Tre",
          "meaning": "town",
          "position": "prefix"
        }
      ],
      "feature": [
        {
          "form": "Aber",
          "meaning": "estuary",
          "position": "prefix"
        },
        {
          "form": "Pen",
          "meaning": "head",
          "position": "prefix"
        },
        {
          "form": "Cwm",
          "meaning": "valley",
          "position": "prefix"
        },
        {
          "form": "Nant",
          "meaning": "stream",
          "position": "prefix"
        },
        {
          "form": "Bryn",
          "meaning": "hill",
          "position": "prefix"
        }
      ]
    },
    "particles": {
      "epithet": {
        "article": "",
        "position": "after"
      },
      "patronymic": {
        "of": "ap",
        "genitive": ""
      },
      "house": {
        "kind": "clan",
        "prefix": "ap",
        "of": ""
      }
    },
    "surnameRate": 0.6,
    "notes": "Patronymic with ap/ab ('son of') or ferch ('daughter of'); prefix-heavy place names."
  },
  "slavic": {
    "label": "Slavic naming",
    "subtitle": "Slavic",
    "contentPolicy": {
      "favour": [
        "rank",
        "sacred",
        "war",
        "virtue",
        "joy"
      ]
    },
    "genders": {
      "masculine": {
        "themes": [
          "rank",
          "war",
          "virtue",
          "sacred"
        ],
        "patronymicAffix": "-ovich"
      },
      "feminine": {
        "themes": [
          "beauty",
          "virtue",
          "sacred",
          "joy"
        ],
        "patronymicAffix": "-ovna"
      },
      "neutral": {
        "themes": [
          "rank",
          "sacred"
        ]
      }
    },
    "patterns": {
      "personal": [
        {
          "type": "dithematic",
          "weight": 0.7
        },
        {
          "type": "single",
          "weight": 0.3
        }
      ],
      "place": [
        {
          "type": "descriptive-generic",
          "weight": 0.6
        },
        {
          "type": "feature-descriptive",
          "weight": 0.4
        }
      ],
      "house": [
        {
          "type": "gens",
          "weight": 1.0
        }
      ]
    },
    "toponymicGenerics": {
      "settlement": [
        {
          "form": "grad",
          "meaning": "city",
          "position": "suffix"
        },
        {
          "form": "sk",
          "meaning": "town",
          "position": "suffix"
        },
        {
          "form": "ovo",
          "meaning": "village",
          "position": "suffix"
        },
        {
          "form": "Nov",
          "meaning": "new",
          "position": "prefix"
        }
      ],
      "feature": [
        {
          "form": "gora",
          "meaning": "mountain",
          "position": "suffix"
        },
        {
          "form": "reka",
          "meaning": "river",
          "position": "suffix"
        },
        {
          "form": "les",
          "meaning": "forest",
          "position": "suffix"
        },
        {
          "form": "ozero",
          "meaning": "lake",
          "position": "suffix"
        },
        {
          "form": "Bel",
          "meaning": "white",
          "position": "prefix"
        },
        {
          "form": "Chern",
          "meaning": "black",
          "position": "prefix"
        }
      ]
    },
    "particles": {
      "patronymic": {
        "of": "",
        "genitive": ""
      },
      "house": {
        "kind": "gens",
        "affix": "-ov"
      }
    },
    "surnameRate": 0.8,
    "notes": "Dithematic given names, patronymic (-ovich/-ovna), family names in -ov/-ski (feminine -ova/-ska)."
  },
  "puritan_english": {
    "label": "Puritan English naming",
    "subtitle": "English \u00b7 devotional",
    "contentPolicy": {
      "lock": [
        "sacred",
        "virtue"
      ]
    },
    "genders": {
      "masculine": {
        "themes": [
          "sacred",
          "virtue"
        ]
      },
      "feminine": {
        "themes": [
          "virtue",
          "sacred"
        ]
      },
      "neutral": {
        "themes": [
          "virtue",
          "sacred"
        ]
      }
    },
    "patterns": {
      "personal": [
        {
          "type": "single",
          "weight": 0.9
        },
        {
          "type": "epithet",
          "weight": 0.1
        }
      ],
      "place": [
        {
          "type": "single",
          "weight": 0.5
        },
        {
          "type": "descriptive-generic",
          "weight": 0.5
        }
      ],
      "house": [
        {
          "type": "occupational",
          "weight": 0.6
        },
        {
          "type": "locative",
          "weight": 0.4
        }
      ]
    },
    "toponymicGenerics": {
      "settlement": [
        {
          "form": "New",
          "meaning": "new",
          "position": "prefix"
        },
        {
          "form": "Mount",
          "meaning": "mount",
          "position": "prefix"
        },
        {
          "form": "field",
          "meaning": "field",
          "position": "suffix"
        },
        {
          "form": "haven",
          "meaning": "haven",
          "position": "suffix"
        }
      ],
      "feature": [
        {
          "form": "field",
          "meaning": "field",
          "position": "suffix"
        },
        {
          "form": "brook",
          "meaning": "brook",
          "position": "suffix"
        }
      ]
    },
    "particles": {
      "epithet": {
        "article": "",
        "position": "after"
      },
      "house": {
        "kind": "occupational"
      }
    },
    "surnameRate": 0.9,
    "notes": "The given name IS a virtue (Faith, Prudence, Increase); surnames stay ordinary English (occupational/locative)."
  },
  "finnic": {
    "label": "Finnic naming",
    "subtitle": "Finnic",
    "contentPolicy": {
      "favour": [
        "flora",
        "forest",
        "water",
        "weather",
        "beast",
        "ice"
      ]
    },
    "genders": {
      "masculine": {
        "themes": [
          "beast",
          "forest",
          "strength",
          "weather"
        ],
        "patronymicAffix": "-poika"
      },
      "feminine": {
        "themes": [
          "flora",
          "water",
          "light",
          "beauty"
        ],
        "patronymicAffix": "-tytar"
      },
      "neutral": {
        "themes": [
          "forest",
          "water"
        ]
      }
    },
    "patterns": {
      "personal": [
        {
          "type": "single",
          "weight": 0.8
        },
        {
          "type": "dithematic",
          "weight": 0.2
        }
      ],
      "place": [
        {
          "type": "descriptive-generic",
          "weight": 0.6
        },
        {
          "type": "feature-descriptive",
          "weight": 0.4
        }
      ],
      "house": [
        {
          "type": "occupational",
          "weight": 1.0
        }
      ]
    },
    "toponymicGenerics": {
      "settlement": [
        {
          "form": "la",
          "meaning": "place of",
          "position": "suffix"
        },
        {
          "form": "kyla",
          "meaning": "village",
          "position": "suffix"
        }
      ],
      "feature": [
        {
          "form": "jarvi",
          "meaning": "lake",
          "position": "suffix"
        },
        {
          "form": "joki",
          "meaning": "river",
          "position": "suffix"
        },
        {
          "form": "maki",
          "meaning": "hill",
          "position": "suffix"
        },
        {
          "form": "saari",
          "meaning": "island",
          "position": "suffix"
        },
        {
          "form": "vaara",
          "meaning": "forested hill",
          "position": "suffix"
        },
        {
          "form": "koski",
          "meaning": "rapids",
          "position": "suffix"
        }
      ]
    },
    "particles": {
      "patronymic": {
        "of": "",
        "genitive": ""
      },
      "house": {
        "kind": "occupational",
        "affix": "-nen"
      }
    },
    "surnameRate": 0.6,
    "notes": "Nature single-roots, patronymic (-poika/-tytar), family names in -nen from nature/place."
  }
};