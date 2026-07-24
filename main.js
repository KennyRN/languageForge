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
var DRIFT_PACKS = {
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

// src/engine.ts
var PLACE_TYPE_DRIFT_DEPTH = {
  feature: 3,
  continent: 2,
  kingdom: 1,
  settlement: 0
};
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
  var _a, _b;
  const givenName = ((_a = traits.name) == null ? void 0 : _a.trim()) || "";
  const seed = (_b = traits.seed) != null ? _b : `${givenName || "culture"}::${Date.now().toString(36)}`;
  const rng = rngFrom(seed + "::elements");
  const elements = traits.familiarity === "alien" ? buildProceduralElements(rng, traits.mood) : samplePackElements(rng, traits.mood);
  const syllableRange = traits.register === "ancient" ? [3, 5] : traits.register === "modern" ? [2, 3] : [2, 4];
  const culture = {
    id: seed,
    name: givenName || "Untitled",
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
    defaultGeneration: "mixed"
  };
  const packs = new Set(traits.packs);
  const envPack = ENV_DEFAULT_PACK[traits.environment];
  if (envPack) packs.add(envPack);
  applySemanticPacks(culture, [...packs]);
  if (!givenName) culture.name = placeholderName(culture);
  seedGenderClasses(culture);
  refreshSamples(culture);
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
    for (const { concept, tags } of SEMANTIC_PACKS[packName].concepts) {
      const cur = weightOf.get(concept);
      if (cur) cur.w = Math.min(3, cur.w + 1);
      else weightOf.set(concept, { w: 1, origin: packName, tags });
    }
  }
  const existingByMeaning = new Map(culture.roots.map((r) => [r.meaning, r]));
  const forms = culture.roots.map((r) => r.form);
  const roots = [];
  for (const [meaning, { w, origin, tags }] of weightOf) {
    const prior = existingByMeaning.get(meaning);
    if (prior) {
      prior.weight = prior.weight === 0.5 ? 0.5 : w;
      prior.tags = tags;
      roots.push(prior);
      continue;
    }
    const form = mintForm(culture, meaning, forms);
    forms.push(form);
    roots.push({ form, meaning, origin, weight: w, tags });
  }
  culture.roots = roots;
}
function weightLabel(w) {
  return w >= 3 ? "dominant" : w >= 2 ? "common" : w >= 1 ? "normal" : "rare";
}
var TAG_TO_CONCEPTS = /* @__PURE__ */ new Map();
var CONCEPT_TAGS = /* @__PURE__ */ new Map();
var CONCEPT_ORIGIN = /* @__PURE__ */ new Map();
var ALL_CONCEPTS = /* @__PURE__ */ new Set();
for (const [packName, pack] of Object.entries(SEMANTIC_PACKS)) {
  for (const { concept, tags } of pack.concepts) {
    ALL_CONCEPTS.add(concept);
    if (!CONCEPT_TAGS.has(concept)) {
      CONCEPT_TAGS.set(concept, tags);
      CONCEPT_ORIGIN.set(concept, packName);
    }
    for (const t of tags) {
      if (!TAG_TO_CONCEPTS.has(t)) TAG_TO_CONCEPTS.set(t, /* @__PURE__ */ new Set());
      TAG_TO_CONCEPTS.get(t).add(concept);
    }
  }
}
function endingLeanScore(end, lean) {
  const core = end.replace(/^-/, "").toLowerCase();
  if (!core) return 0;
  const last = core[core.length - 1];
  const softFinal = "aeioulrnmy".includes(last);
  const hardFinal = "ktdgbpr".includes(last);
  switch (lean) {
    case "soft":
      return softFinal ? 3 : 0;
    case "hard":
      return hardFinal ? 3 : softFinal ? 0 : 1;
    case "long":
      return core.length >= 4 ? 3 : core.length >= 3 ? 1 : 0;
    case "short":
      return core.length <= 3 ? 3 : 0;
    case "exotic":
      return /[zxqjw]/.test(core) ? 3 : /y/.test(core) ? 1 : 0;
  }
}
function generateClassEndings(culture, lean, count = 4, salt = "") {
  var _a, _b;
  const rng = rngFrom(`${culture.seed}::class-ends::${lean}::${salt}`);
  const pool = [...culture.elements.end];
  for (const e of (_b = (_a = PHONETIC_PACKS[culture.mood]) == null ? void 0 : _a.end) != null ? _b : []) {
    if (!pool.some((p) => p.toLowerCase() === e.toLowerCase())) pool.push(e);
  }
  const cons = [...new Set(
    [...culture.elements.start, ...culture.elements.middle].join("").toLowerCase().replace(/[^bcdfghjklmnpqrstvwxyz]/g, "").split("")
  )].filter((c) => c.length === 1);
  const softVowels = ["a", "ae", "ia", "ie", "e"];
  const hardFinals = ["k", "r", "n", "d", "th", "g", "t"];
  for (let i = 0; i < 6; i++) {
    const c0 = pick(rng, cons.length ? cons : ["n", "l", "r"]);
    if (lean === "soft" || lean === "long") {
      pool.push(`-${c0}${pick(rng, softVowels)}`);
    } else if (lean === "hard") {
      pool.push(`-${c0}${pick(rng, softVowels).slice(0, 1)}${pick(rng, hardFinals)}`);
    } else if (lean === "short") {
      pool.push(`-${c0}${pick(rng, ["a", "e", "i"])}`);
    } else {
      pool.push(`-${pick(rng, ["z", "x", "j", "q"])}${pick(rng, softVowels)}`);
    }
  }
  const scored = pool.map((e) => ({ e, s: endingLeanScore(e, lean) + rng() })).sort((a, b) => b.s - a.s);
  const picked = [];
  for (const { e } of scored) {
    if (picked.length >= count) break;
    const norm = e.startsWith("-") ? e : `-${e}`;
    if (!picked.some((p) => p.toLowerCase() === norm.toLowerCase())) picked.push(norm);
  }
  while (picked.length < Math.min(count, culture.elements.end.length)) {
    const e = culture.elements.end[picked.length % culture.elements.end.length];
    if (!picked.some((p) => p.toLowerCase() === e.toLowerCase())) picked.push(e);
  }
  return picked;
}
function resolveClassEndings(culture, cls, seen = /* @__PURE__ */ new Set()) {
  var _a, _b;
  if (seen.has(cls.id)) return culture.elements.end;
  seen.add(cls.id);
  if (cls.endingSource === "inherit" && cls.inheritFrom) {
    const parent = (_a = culture.classes) == null ? void 0 : _a.find((c) => c.id === cls.inheritFrom);
    if (parent) return resolveClassEndings(culture, parent, seen);
  }
  if ((_b = cls.endings) == null ? void 0 : _b.length) return cls.endings;
  return culture.elements.end;
}
function resolveRootPool(culture, policy) {
  var _a;
  const expand = (token) => {
    var _a2;
    const concepts = /* @__PURE__ */ new Set();
    const pack = SEMANTIC_PACKS[token];
    if (pack) for (const { concept } of pack.concepts) concepts.add(concept);
    const tagged = TAG_TO_CONCEPTS.get(token);
    if (tagged) for (const c of tagged) concepts.add(c);
    for (const r of culture.roots) {
      if (((_a2 = r.tags) == null ? void 0 : _a2.includes(token)) || r.meaning === token) concepts.add(r.meaning);
    }
    if (ALL_CONCEPTS.has(token)) concepts.add(token);
    return concepts;
  };
  const included = /* @__PURE__ */ new Set();
  for (const t of policy.include) for (const c of expand(t)) included.add(c);
  for (const t of (_a = policy.exclude) != null ? _a : []) for (const c of expand(t)) included.delete(c);
  if (policy.mode === "lock") {
    const locked = culture.roots.filter((r) => included.has(r.meaning));
    if (locked.length < 2) {
      const favoured2 = culture.roots.map(
        (r) => included.has(r.meaning) ? { ...r, weight: Math.min(3, r.weight + 1) } : { ...r }
      );
      return { roots: favoured2, fellBack: true };
    }
    return { roots: locked, fellBack: false };
  }
  const favoured = culture.roots.map(
    (r) => included.has(r.meaning) ? { ...r, weight: Math.min(3, r.weight + 1) } : { ...r }
  );
  return { roots: favoured, fellBack: false };
}
function seedGenderClasses(culture) {
  if (culture.gendered === void 0) culture.gendered = true;
  culture.classes = [
    {
      id: "feminine",
      label: "feminine",
      kind: "gender",
      endingSource: "generate",
      endings: generateClassEndings(culture, "soft", 4, "feminine"),
      rootPolicy: { mode: "favour", include: ["flora", "hearth", "virtue"], exclude: ["tree"] },
      generation: "mixed"
    },
    {
      id: "masculine",
      label: "masculine",
      kind: "gender",
      endingSource: "generate",
      endings: generateClassEndings(culture, "hard", 4, "masculine"),
      rootPolicy: { mode: "favour", include: ["forest", "sea", "strength"] },
      generation: "mixed"
    },
    {
      id: "neutral",
      label: "neutral",
      kind: "gender",
      endingSource: "generate",
      endings: culture.elements.end.slice()
    }
  ];
}
function ensureCultureClasses(culture) {
  var _a;
  let changed = false;
  if (culture.defaultGeneration === void 0) {
    culture.defaultGeneration = "mixed";
    changed = true;
  }
  if ((_a = culture.classes) == null ? void 0 : _a.length) {
    if (culture.gendered === void 0) culture.gendered = true;
    return changed;
  }
  seedGenderClasses(culture);
  return true;
}
function visibleClasses(culture) {
  var _a;
  ensureCultureClasses(culture);
  const all = (_a = culture.classes) != null ? _a : [];
  if (culture.gendered === false) {
    return all.filter((c) => !(c.kind === "gender" && (c.id === "feminine" || c.id === "masculine")));
  }
  return all;
}
function slugClassId(label, culture) {
  var _a;
  let base = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "class";
  let id = base;
  let n = 2;
  while ((_a = culture.classes) == null ? void 0 : _a.some((c) => c.id === id)) {
    id = `${base}-${n++}`;
  }
  return id;
}
function addClass(culture, label, lean = "soft") {
  ensureCultureClasses(culture);
  const id = slugClassId(label, culture);
  const cls = {
    id,
    label: label.trim() || id,
    kind: "class",
    endingSource: "generate",
    endings: generateClassEndings(culture, lean, 4, id),
    generation: "mixed"
  };
  culture.classes.push(cls);
  return cls;
}
function editClass(culture, id, patch) {
  var _a;
  ensureCultureClasses(culture);
  const cls = (_a = culture.classes) == null ? void 0 : _a.find((c) => c.id === id);
  if (!cls) return null;
  const { id: _ignore, ...rest } = patch;
  void _ignore;
  Object.assign(cls, rest);
  return cls;
}
function removeClass(culture, id) {
  if (!culture.classes) return false;
  const before = culture.classes.length;
  culture.classes = culture.classes.filter((c) => c.id !== id);
  for (const c of culture.classes) {
    if (c.inheritFrom === id) {
      c.inheritFrom = void 0;
      if (c.endingSource === "inherit") {
        c.endingSource = "generate";
        c.endings = generateClassEndings(culture, "soft", 4, c.id);
      }
    }
  }
  return culture.classes.length < before;
}
function regenerateClassEndings(culture, id, lean) {
  var _a;
  const cls = (_a = culture.classes) == null ? void 0 : _a.find((c) => c.id === id);
  if (!cls) return null;
  cls.endingSource = "generate";
  cls.inheritFrom = void 0;
  cls.endings = generateClassEndings(culture, lean, 4, `${id}::${Date.now().toString(36)}`);
  return cls;
}
function classSpecimens(culture, classId, n = 2) {
  return generateBatch(culture, "personal", n, void 0, classId, rngFrom(`${culture.seed}::class-sample::${classId}`)).map((g) => g.gloss ? `${g.name} (${g.gloss})` : g.name);
}
function assemble(rng, culture, category, opts = {}) {
  var _a;
  const { start, middle } = culture.elements;
  const endPool = ((_a = opts.ends) == null ? void 0 : _a.length) ? opts.ends : culture.elements.end;
  const parts = [];
  const s = pick(rng, start);
  parts.push({ slot: "start", element: s });
  let body = s;
  let middleChance = culture.middleChance;
  if (opts.lengthLean) middleChance = Math.max(0, Math.min(1, middleChance + opts.lengthLean * 0.25));
  const middles = category === "house" || category === "title" ? rng() < 0.5 ? 2 : 1 : category === "place" ? 1 : rng() < middleChance ? 1 : 0;
  for (let i = 0; i < middles; i++) {
    const m = pick(rng, middle);
    parts.push({ slot: "middle", element: m });
    body += m;
  }
  const e = pick(rng, endPool);
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
function joinForms(rng, left, right) {
  let a = left, b = right;
  const aEndsVowel = isVowel(a[a.length - 1], 1);
  const bStartsVowel = isVowel(b[0], 0);
  if (aEndsVowel && bStartsVowel) b = pick(rng, ["n", "r", "l"]) + b;
  if (!aEndsVowel && !bStartsVowel && !SONORANTS.has(a[a.length - 1])) a = a + pick(rng, ["a", "o", "e"]);
  return a + b;
}
function pickRootCount(rng, register) {
  const r = rng();
  if (register === "modern") return r < 0.7 ? 1 : 2;
  if (register === "ancient") return r < 0.25 ? 1 : r < 0.9 ? 2 : 3;
  return r < 0.45 ? 1 : 2;
}
function categoryRootBias(category) {
  if (category === "place") return { mode: "favour", include: ["place", "water", "earth", "forest", "river", "mountain", "sea", "stone"] };
  if (category === "house") return { mode: "favour", include: ["kin", "rank", "virtue", "home", "hearth"] };
  if (category === "title") return { mode: "favour", include: ["rank", "virtue", "war", "strength"] };
  return void 0;
}
function assembleMeaning(rng, culture, opts = {}) {
  var _a, _b, _c;
  const pool = ((_a = opts.roots) == null ? void 0 : _a.length) ? opts.roots : culture.roots;
  const n = Math.min(pickRootCount(rng, culture.register), Math.max(1, pool.length));
  const picked = [];
  for (let i = 0; i < n; i++) {
    const r = weightedRoot(rng, pool, picked[picked.length - 1]);
    picked.push(r);
  }
  let body = picked[0].form.toLowerCase();
  const parts = [{ slot: "start", element: picked[0].form }];
  for (let i = 1; i < picked.length; i++) {
    const next = picked[i].form.toLowerCase();
    body = joinForms(rng, body, next);
    parts.push({ slot: i === picked.length - 1 && !((_b = opts.ends) == null ? void 0 : _b.length) ? "end" : "middle", element: picked[i].form });
  }
  const endPool = ((_c = opts.ends) == null ? void 0 : _c.length) ? opts.ends : culture.elements.end;
  const endEl = pick(rng, endPool);
  let endCore = endEl.replace(/^-/, "").toLowerCase();
  const bodyEndsVowel = isVowel(body[body.length - 1], 1);
  const endStartsVowel = isVowel(endCore[0], 0);
  if (bodyEndsVowel && endStartsVowel) {
    endCore = endCore.replace(/^[aeiouy]+/, "") || endCore;
    if (isVowel(endCore[0], 0)) endCore = pick(rng, ["n", "r", "l"]) + endCore;
  } else if (!bodyEndsVowel && !endStartsVowel && !SONORANTS.has(body[body.length - 1])) {
    body = body + pick(rng, ["a", "o", "e"]);
  }
  if (opts.lengthLean && opts.lengthLean > 0 && rng() < opts.lengthLean * 0.4 && culture.elements.middle.length) {
    const m = pick(rng, culture.elements.middle).toLowerCase();
    body = joinForms(rng, body, m);
    parts.push({ slot: "middle", element: m });
  }
  body = body + endCore;
  parts.push({ slot: "end", element: endEl.startsWith("-") ? endEl : `-${endCore}` });
  const name = body[0].toUpperCase() + body.slice(1);
  const gloss = picked.map((r) => r.meaning).join(" + ");
  return {
    name,
    gloss,
    parts,
    roots: picked.map((r) => ({ form: r.form, meaning: r.meaning }))
  };
}
function generateBatch(culture, category, count, mode, classNameOrRng, rngArg) {
  var _a, _b, _c, _d;
  let className;
  let rng;
  if (typeof classNameOrRng === "function") {
    rng = classNameOrRng;
  } else {
    className = classNameOrRng != null ? classNameOrRng : void 0;
    rng = rngArg != null ? rngArg : rngFrom(`${culture.seed}::batch::${Date.now()}::${Math.random()}`);
  }
  const cls = category === "personal" && className ? (_a = culture.classes) == null ? void 0 : _a.find((c) => c.id === className) : void 0;
  const ends = cls ? resolveClassEndings(culture, cls) : culture.elements.end;
  let modePref = (_d = (_c = (_b = cls == null ? void 0 : cls.generation) != null ? _b : mode) != null ? _c : culture.defaultGeneration) != null ? _d : "mixed";
  let rootPool = culture.roots;
  if (cls == null ? void 0 : cls.rootPolicy) {
    rootPool = resolveRootPool(culture, cls.rootPolicy).roots;
  } else {
    const bias = categoryRootBias(category);
    if (bias) rootPool = resolveRootPool(culture, bias).roots;
  }
  const out = [];
  const session = /* @__PURE__ */ new Set();
  let attempts = 0;
  while (out.length < count && attempts++ < count * 40) {
    let nameMode = modePref === "mixed" ? rng() < 0.7 ? "meaning" : "sound" : modePref === "meaning" ? "meaning" : "sound";
    const useMeaning = nameMode === "meaning" && rootPool.length >= 1;
    if (useMeaning) {
      const built = assembleMeaning(rng, culture, {
        roots: rootPool,
        ends,
        lengthLean: cls == null ? void 0 : cls.lengthLean
      });
      const gate = gateName(built.name, culture, built.parts, session);
      if (!gate.pass) continue;
      session.add(built.name.toLowerCase());
      out.push({
        name: built.name,
        pronunciation: pronounce(built.name, culture.stress),
        parts: built.parts,
        category,
        gloss: built.gloss,
        roots: built.roots,
        className: cls == null ? void 0 : cls.id
      });
    } else {
      const built = assemble(rng, culture, category, { ends, lengthLean: cls == null ? void 0 : cls.lengthLean });
      const gate = gateName(built.name, culture, built.parts, session);
      if (!gate.pass) continue;
      session.add(built.name.toLowerCase());
      out.push({
        name: built.name,
        pronunciation: pronounce(built.name, culture.stress),
        parts: built.parts,
        category,
        className: cls == null ? void 0 : cls.id
      });
    }
  }
  return out;
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
function reverseSeedCulture(cultureName, pastedNames, packsOrTraits = []) {
  var _a, _b, _c, _d;
  const traits = Array.isArray(packsOrTraits) ? { packs: packsOrTraits } : packsOrTraits;
  const cleaned = pastedNames.map((n) => n.trim()).filter((n) => n.length >= 3);
  const mood = (_a = traits.mood) != null ? _a : detectMood(cleaned);
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
  const register = (_b = traits.register) != null ? _b : "balanced";
  const syllableRange = register === "ancient" ? [3, 5] : register === "modern" ? [2, 3] : [lo, Math.max(lo, hi)];
  const env = !traits.environment || traits.environment === "none" ? "\u2014" : traits.environment;
  const culture = {
    id: seed,
    name: cultureName,
    seed,
    mood,
    register,
    familiarity: (_c = traits.familiarity) != null ? _c : "familiar",
    environment: env,
    elements: { start: starts, middle: middles, end: ends },
    middleChance: syllCounts.some((c) => c >= 3) ? 0.5 : 0.3,
    syllableRange,
    stress: mood === "grand" || register === "ancient" ? "penult" : "initial",
    roots: [],
    appliedPacks: [],
    registry: cleaned.map((n) => n.toLowerCase()),
    // their names are already taken
    fromNames: cleaned,
    summary: "",
    defaultGeneration: "mixed"
  };
  const semanticPacks = new Set((_d = traits.packs) != null ? _d : []);
  const envPack = ENV_DEFAULT_PACK[env];
  if (envPack) semanticPacks.add(envPack);
  applySemanticPacks(culture, [...semanticPacks]);
  seedGenderClasses(culture);
  refreshSamples(culture);
  culture.summary = oneBreath(culture);
  return culture;
}
function isRomanisedName(raw) {
  const letters = raw.trim().replace(/[\s\-'.]/g, "");
  return letters.length >= 3 && /^[A-Za-z]+$/.test(letters);
}
function parseImportInput(raw) {
  var _a, _b, _c;
  const rejected = [];
  const seen = /* @__PURE__ */ new Set();
  const candidates = [];
  const STOP = /* @__PURE__ */ new Set([
    "the",
    "and",
    "or",
    "of",
    "a",
    "an",
    "to",
    "in",
    "on",
    "by",
    "for",
    "was",
    "were",
    "are",
    "is",
    "be",
    "called",
    "named",
    "with",
    "from",
    "that",
    "this",
    "their",
    "his",
    "her",
    "she",
    "he",
    "they",
    "who",
    "whom",
    "which",
    "into",
    "onto",
    "over",
    "under"
  ]);
  const push = (token) => {
    const t = token.trim();
    if (!t) return;
    const key = t.toLowerCase();
    if (seen.has(key)) return;
    if (!isRomanisedName(t)) {
      if (/[^\x00-\x7F]/.test(t) || t.replace(/[^A-Za-z]/g, "").length >= 3) {
        seen.add(key);
        rejected.push(t);
      }
      return;
    }
    seen.add(key);
    candidates.push(t);
  };
  if (/[,;\n|/]/.test(raw)) {
    for (const part of raw.split(/[,;\n|/]+/)) push(part);
  } else {
    const caps = (_a = raw.match(/\b[A-Z][A-Za-z'-]{2,}\b/g)) != null ? _a : [];
    const nameLike = caps.filter((w) => !STOP.has(w.toLowerCase()));
    if (nameLike.length >= 1) {
      for (const w of nameLike) push(w);
    } else {
      const words = (_b = raw.match(/[A-Za-z][A-Za-z'-]{2,}/g)) != null ? _b : [];
      for (const w of words) {
        if (!STOP.has(w.toLowerCase())) push(w);
      }
      if (candidates.length === 0 && raw.trim()) push(raw.trim());
    }
    const nonLatin = (_c = raw.match(/[^\s,;|/]+/g)) != null ? _c : [];
    for (const tok of nonLatin) {
      if (/[^\x00-\x7F]/.test(tok)) push(tok);
    }
  }
  return { candidates, rejected };
}
function importNames(culture, raw) {
  var _a;
  const { candidates, rejected } = parseImportInput(raw);
  const added = { start: [], middle: [], end: [] };
  const accepted = [];
  let segmented = 0;
  const capCount = (list, el) => list.filter((x) => x.toLowerCase() === el.toLowerCase()).length;
  const pushCapped = (list, el, times = 3) => {
    for (let i = 0; i < times; i++) {
      if (capCount(list, el) < 4) list.push(el);
    }
  };
  for (const name of candidates) {
    const seg = segmentPastedName(name);
    accepted.push(name);
    const key = name.toLowerCase();
    if (!culture.registry.includes(key)) culture.registry.push(key);
    if (!culture.importedNames) culture.importedNames = [];
    if (!culture.importedNames.some((n) => n.toLowerCase() === key)) culture.importedNames.push(name);
    if (!seg) continue;
    segmented++;
    pushCapped(culture.elements.start, seg.start);
    pushCapped(added.start, seg.start, 1);
    for (const m of seg.middles) {
      pushCapped(culture.elements.middle, m);
      pushCapped(added.middle, m, 1);
    }
    pushCapped(culture.elements.end, seg.end);
    pushCapped(added.end, seg.end, 1);
  }
  const importedEnds = [...new Set(added.end)];
  if (importedEnds.length > 0) {
    const counts = /* @__PURE__ */ new Map();
    for (const e of culture.elements.end) counts.set(e, ((_a = counts.get(e)) != null ? _a : 0) + 1);
    const rest = [...counts.keys()].filter((e) => !importedEnds.some((s) => s.toLowerCase() === e.toLowerCase())).sort((x, y) => {
      var _a2, _b;
      return ((_a2 = counts.get(y)) != null ? _a2 : 0) - ((_b = counts.get(x)) != null ? _b : 0);
    });
    const keep = [...importedEnds, ...rest].slice(0, 6);
    culture.elements.end = culture.elements.end.filter(
      (e) => keep.some((k) => k.toLowerCase() === e.toLowerCase())
    );
    for (const s of importedEnds) {
      if (capCount(culture.elements.end, s) < 2) culture.elements.end.push(s);
      if (capCount(culture.elements.end, s) < 2) culture.elements.end.push(s);
    }
  }
  if (accepted.length >= 2) {
    const sylls = accepted.map((n) => syllabify(n.replace(/[^a-zA-Z]/g, "")).length).filter((n) => n > 0);
    if (sylls.length) {
      const lo = Math.min(...sylls);
      const hi = Math.max(...sylls);
      culture.syllableRange = [
        Math.min(culture.syllableRange[0], Math.max(2, lo)),
        Math.max(culture.syllableRange[1], Math.min(5, hi))
      ];
    }
  }
  culture.summary = oneBreath(culture);
  refreshSamples(culture);
  return { accepted, rejected, segmented, added };
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
    ...generateBatch(culture, "personal", 2, void 0, rng),
    ...generateBatch(culture, "house", 1, void 0, rng),
    ...generateBatch(culture, "place", 1, void 0, rng)
  ];
  const glossaryPreview = culture.roots.filter((r) => r.weight >= 2).slice(0, 6).concat(culture.roots.slice(0, 6)).slice(0, 6).map((r) => ({ form: r.form, meaning: r.meaning, weight: weightLabel(r.weight) }));
  return { summary: culture.summary || oneBreath(culture), samples, packs: culture.appliedPacks, glossaryPreview };
}
var DRIFT_PRESETS = {
  dialect: 0.15,
  sister: 0.4,
  distant: 0.7
};
var MOOD_DEFAULT_DRIFT_PACK = {
  harsh: "germanic_hardening",
  soft: "romance_softening",
  bright: "vowel_shift",
  grand: "celtic_lenition",
  exotic: "vowel_melting"
};
var DRIFT_VOWELS = "aeiou";
function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function applyOneRule(word, rule) {
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
      const m = word.match(new RegExp(`[${DRIFT_VOWELS}]`));
      if (!m || m.index === void 0) return word;
      const headEnd = m.index + 1;
      return word.slice(0, headEnd) + word.slice(headEnd).replace(new RegExp(f, "g"), rule.to);
    }
  }
}
function driftWord(rng, word, pack, intensity) {
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
function driftWordWithPacks(rng, word, packs, intensity) {
  return packs.reduce((acc, pack) => driftWord(rng, acc, pack, intensity), word);
}
function driftElementSet(rng, elements, packs, intensity) {
  return {
    start: elements.start.map((el) => driftWordWithPacks(rng, el, packs, intensity)),
    middle: elements.middle.map((el) => driftWordWithPacks(rng, el, packs, intensity)),
    end: elements.end.map((el) => driftWordWithPacks(rng, el, packs, intensity))
  };
}
function driftRootForm(rng, root, packs, intensity, spellingMode) {
  if (spellingMode === "etymological" && root.origin.includes("+")) return root.form;
  return driftWordWithPacks(rng, root.form, packs, intensity);
}
function deriveCulture(parent, name, driftLevel, driftPackIds, overrides = {}, spellingMode = "phonetic") {
  var _a, _b, _c, _d;
  const intensity = DRIFT_PRESETS[driftLevel];
  const packs = driftPackIds.map((id) => DRIFT_PACKS[id]).filter((p) => !!p);
  const seed = `${name}::from::${parent.id}::${Date.now().toString(36)}`;
  const rng = rngFrom(seed + "::drift");
  const elements = driftElementSet(rng, parent.elements, packs, intensity);
  const roots = parent.roots.map((r) => ({ ...r, form: driftRootForm(rng, r, packs, intensity, spellingMode) }));
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
    defaultGeneration: (_b = parent.defaultGeneration) != null ? _b : "mixed",
    parentIds: [parent.id],
    generation: ((_c = parent.generation) != null ? _c : 0) + 1,
    driftLevel,
    driftPackIds,
    driftMode: "family"
  };
  if ((_d = overrides.packs) == null ? void 0 : _d.length) {
    applySemanticPacks(culture, [.../* @__PURE__ */ new Set([...culture.appliedPacks, ...overrides.packs])]);
  }
  seedGenderClasses(culture);
  refreshSamples(culture);
  culture.summary = oneBreath(culture);
  return culture;
}
function ageCulture(culture, packId, driftLevel, category = "personal", spellingMode = "phonetic") {
  const pack = DRIFT_PACKS[packId];
  if (!pack) throw new Error(`ageCulture: unknown drift pack '${packId}'`);
  const intensity = DRIFT_PRESETS[driftLevel];
  const driftRng = rngFrom(`${culture.seed}::age::${packId}::${driftLevel}`);
  const modernElements = driftElementSet(driftRng, culture.elements, [pack], intensity);
  const modernRoots = culture.roots.map((r) => ({
    ...r,
    form: driftRootForm(driftRng, r, [pack], intensity, spellingMode)
  }));
  const modernView = { ...culture, elements: modernElements, roots: modernRoots };
  const archaicRng = rngFrom(`${culture.seed}::age::samples::archaic::${packId}::${driftLevel}`);
  const modernSampleRng = rngFrom(`${culture.seed}::age::samples::modern::${packId}::${driftLevel}`);
  return {
    archaic: {
      elements: culture.elements,
      roots: culture.roots,
      samples: generateBatch(culture, category, 3, "sound", archaicRng)
    },
    modern: {
      elements: modernElements,
      roots: modernRoots,
      samples: generateBatch(modernView, category, 3, "sound", modernSampleRng)
    },
    packId,
    driftLevel
  };
}
function resolvePlaceSourceCulture(culture, allCultures, placeType) {
  var _a;
  let current = culture;
  let hops = PLACE_TYPE_DRIFT_DEPTH[placeType];
  while (hops > 0) {
    const parents = ((_a = current.parentIds) != null ? _a : []).map((id) => allCultures.find((c) => c.id === id)).filter((c) => !!c);
    if (parents.length === 0) break;
    current = parents.reduce((best, p) => {
      var _a2, _b;
      const bg = (_a2 = best.generation) != null ? _a2 : 0, pg = (_b = p.generation) != null ? _b : 0;
      if (pg !== bg) return pg < bg ? p : best;
      const bi = best.driftLevel ? DRIFT_PRESETS[best.driftLevel] : 0;
      const pi = p.driftLevel ? DRIFT_PRESETS[p.driftLevel] : 0;
      return pi < bi ? p : best;
    });
    hops--;
  }
  return current;
}
var CONTACT_DOMAIN_TAGS = {
  administration: ["rank"],
  religion: ["sacred"],
  warfare: ["war", "weapon"],
  trade: ["trade", "wealth", "craft"],
  "place-features": ["place", "mountain", "river", "water", "sea", "forest", "earth", "settlement"]
};
function legalOnset(word) {
  const w = word.replace(/^-/, "").toLowerCase();
  const m = w.match(/^[^aeiou]*/);
  const onset = m ? m[0] : "";
  return onset === "" || LEGAL_ONSETS.has(onset);
}
function previewContactEdge(donor, borrower, edge, category = "personal") {
  var _a;
  const rng = rngFrom(`${edge.id}::contact::${donor.id}::${borrower.id}`);
  const domainTags = edge.domains.flatMap((d) => CONTACT_DOMAIN_TAGS[d]);
  const matching = domainTags.length ? donor.roots.filter((r) => {
    var _a2;
    return ((_a2 = r.tags) != null ? _a2 : []).some((t) => domainTags.includes(t));
  }) : [];
  const pool = matching.length >= 3 ? matching : donor.roots;
  const count = Math.max(1, Math.round(edge.strength * pool.length));
  const chosen = sample(rng, pool, Math.min(count, pool.length));
  const reshapePack = DRIFT_PACKS.prestige_exonym;
  const existingForms = borrower.roots.map((r) => r.form.toLowerCase());
  const loanedRoots = [];
  for (const donorRoot of chosen) {
    const reshaped = driftWordWithPacks(rng, donorRoot.form, [reshapePack], 1);
    if (!legalOnset(reshaped)) continue;
    if (existingForms.some((f) => levenshtein(reshaped.toLowerCase(), f) < 2)) continue;
    existingForms.push(reshaped.toLowerCase());
    loanedRoots.push({
      form: reshaped[0].toUpperCase() + reshaped.slice(1).toLowerCase(),
      meaning: donorRoot.meaning,
      origin: `loan:${donor.id}`,
      weight: 1,
      tags: (_a = donorRoot.tags) != null ? _a : [],
      loanOrigin: { donorCultureId: donor.id, edgeId: edge.id }
    });
  }
  const previewCulture = { ...borrower, roots: [...borrower.roots, ...loanedRoots] };
  const sampleRng = rngFrom(`${edge.id}::contact::samples`);
  const samples = generateBatch(previewCulture, category, 3, "sound", sampleRng);
  return { loanedRoots, samples };
}
function acceptLoanedRoots(borrower, loanedRoots) {
  const existingForms = new Set(borrower.roots.map((r) => r.form.toLowerCase()));
  for (const r of loanedRoots) {
    if (!existingForms.has(r.form.toLowerCase())) {
      borrower.roots.push(r);
      existingForms.add(r.form.toLowerCase());
    }
  }
  refreshSamples(borrower);
}
var MANAGED_START = "<!-- lf:managed:start -->";
var MANAGED_END = "<!-- lf:managed:end -->";
function placeholderName(culture) {
  const rng = rngFrom(`${culture.seed}::placeholder`);
  const start = pick(rng, culture.elements.start);
  const endRaw = pick(rng, culture.elements.end).replace(/^-/, "");
  let form = (start + endRaw).toLowerCase().replace(/[aeiou]{3,}/g, (m) => m.slice(0, 2));
  if (form.length < 3) form = start.toLowerCase() + "a" + endRaw.toLowerCase();
  return form[0].toUpperCase() + form.slice(1);
}
function refreshSamples(culture) {
  const salt = `${culture.roots.length}:${culture.elements.start.join(",")}:${culture.elements.end.join(",")}`;
  const card = makeCultureCard(culture, salt.length);
  culture.sampleNames = card.samples.map((s) => ({
    name: s.name,
    pronunciation: s.pronunciation,
    category: s.category,
    gloss: s.gloss,
    className: s.className
  }));
}
function renameCulture(culture, newName, translatedName) {
  culture.name = newName.trim();
  if (translatedName !== void 0) {
    const t = translatedName.trim();
    culture.translatedName = t || void 0;
  }
  culture.summary = oneBreath(culture);
}
function renderFrontmatter(culture, kind = "language") {
  const lines = [
    "---",
    `lf-id: ${JSON.stringify(culture.id)}`,
    `lf-kind: ${kind}`,
    `languageforge-culture: ${culture.name}`,
    ...culture.translatedName ? [`translated-name: ${JSON.stringify(culture.translatedName)}`] : [],
    `seed: ${JSON.stringify(culture.seed)}`,
    `mood: ${culture.mood}`,
    `register: ${culture.register}`,
    `packs: [${culture.appliedPacks.join(", ")}]`,
    "---"
  ];
  return lines.join("\n");
}
function glossaryNoteTitle(culture) {
  return `${culture.name} Glossary`;
}
function renderManagedInner(culture, allCultures) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
  const lines = [];
  lines.push(`# ${culture.name}`);
  lines.push("");
  if ((_a = culture.translatedName) == null ? void 0 : _a.trim()) {
    lines.push(`*${culture.translatedName.trim()}*`);
    lines.push("");
  }
  lines.push(`> ${culture.summary || oneBreath(culture)}`);
  lines.push("");
  if ((_b = culture.fromNames) == null ? void 0 : _b.length) {
    lines.push(`Seeded from your own names: ${culture.fromNames.join(", ")}.`);
    lines.push("");
  }
  const parents = ((_c = culture.parentIds) != null ? _c : []).map((id) => allCultures.find((c) => c.id === id)).filter((c) => !!c);
  const descendants = allCultures.filter((c) => {
    var _a2;
    return (_a2 = c.parentIds) == null ? void 0 : _a2.includes(culture.id);
  });
  if (parents.length > 0 || descendants.length > 0) {
    lines.push("## Family");
    lines.push("");
    const packLabel = ((_d = culture.driftPackIds) == null ? void 0 : _d.length) ? ` via ${culture.driftPackIds.join(" + ")}` : "";
    const wiki = (c) => `[[${c.name}]]`;
    if (parents.length === 1) {
      lines.push(`Descended from: ${wiki(parents[0])} (generation ${(_e = culture.generation) != null ? _e : 1}, drift: ${(_f = culture.driftLevel) != null ? _f : "unknown"}${packLabel})`);
    } else if (parents.length >= 2) {
      lines.push(`Merged from: ${parents.map(wiki).join(" + ")} (generation ${(_g = culture.generation) != null ? _g : 1}, contact drift: ${(_h = culture.driftLevel) != null ? _h : "unknown"}${packLabel})`);
    }
    if ((_i = culture.driftPackIds) == null ? void 0 : _i.length) {
      const flavor = culture.driftPackIds.map((id) => {
        var _a2;
        return (_a2 = DRIFT_PACKS[id]) == null ? void 0 : _a2.plainDescription;
      }).filter((s) => !!s).join(" ");
      if (flavor) lines.push(`*${flavor}*`);
    }
    if (descendants.length > 0) {
      lines.push(`Descendants: ${descendants.map(wiki).join(", ")}`);
    }
    lines.push("");
  }
  lines.push("## Sample names");
  lines.push("");
  const samples = ((_j = culture.sampleNames) == null ? void 0 : _j.length) ? culture.sampleNames : makeCultureCard(culture).samples.map((s) => ({
    name: s.name,
    pronunciation: s.pronunciation,
    category: s.category,
    gloss: s.gloss,
    className: s.className
  }));
  for (const s of samples) {
    let line = `- **${s.name}** (${s.category}) \u2014 say it: *${s.pronunciation}*`;
    if (s.gloss) {
      line += ` \u2014 "${s.gloss}"`;
      if (s.className) line += ` (${s.className})`;
    } else if (s.className) {
      line += ` (${s.className})`;
    }
    lines.push(line);
  }
  lines.push("");
  lines.push("## Accepted names");
  lines.push("");
  for (const n of culture.registry) lines.push(`- ${n[0].toUpperCase() + n.slice(1)}`);
  lines.push("");
  lines.push("## Import");
  lines.push("");
  lines.push("Paste romanised names (Latin letters) via **Import names\u2026** to bend this language's sounds. Raw non-Latin script is skipped.");
  lines.push("");
  if ((_k = culture.importedNames) == null ? void 0 : _k.length) {
    lines.push("Imported into this language:");
    lines.push("");
    for (const n of culture.importedNames) lines.push(`- ${n}`);
    lines.push("");
  } else if ((_l = culture.fromNames) == null ? void 0 : _l.length) {
    lines.push(`Seeded at creation from: ${culture.fromNames.join(", ")}.`);
    lines.push("");
  } else {
    lines.push("_No names imported yet._");
    lines.push("");
  }
  lines.push("## Name classes");
  lines.push("");
  ensureCultureClasses(culture);
  if (culture.gendered === false) {
    lines.push("_Gender marking off \u2014 feminine/masculine hidden; custom classes still apply._");
    lines.push("");
  }
  lines.push("| Class | Endings | Roots | Meaning | Sample |");
  lines.push("|---|---|---|---|---|");
  for (const cls of visibleClasses(culture)) {
    const ends = resolveClassEndings(culture, cls).join(", ") || "\u2014";
    let roots = "\u2014";
    if (cls.rootPolicy) {
      const bits = [...cls.rootPolicy.include];
      if ((_m = cls.rootPolicy.exclude) == null ? void 0 : _m.length) bits.push(`\u2212${cls.rootPolicy.exclude.join(",\u2212")}`);
      roots = `${cls.rootPolicy.mode}: ${bits.join(", ")}`;
    }
    const meaning = (_n = cls.generation) != null ? _n : "inherit";
    const classSamples = classSpecimens(culture, cls.id, 2).join(", ") || "\u2014";
    lines.push(`| ${cls.label} | ${ends} | ${roots} | ${meaning} | ${classSamples} |`);
  }
  lines.push("");
  lines.push("## Sound elements");
  lines.push("");
  lines.push(`Starts: ${culture.elements.start.join(", ")}`);
  lines.push("");
  lines.push(`Middles: ${culture.elements.middle.join(", ")}`);
  lines.push("");
  lines.push(`Endings: ${culture.elements.end.join(", ")}`);
  lines.push("");
  lines.push(`Glossary: [[${glossaryNoteTitle(culture)}]]`);
  lines.push("");
  return lines.join("\n");
}
function hasHeading(text, heading) {
  return new RegExp(`(^|\\n)## ${heading}(\\s|$)`).test(text);
}
function extractDescriptionFromPage(body) {
  if (!body) return "";
  const m = body.match(/## Description\s*\n([\s\S]*?)(?=\n## |\n<!-- lf:managed:start -->|$)/);
  if (!m) return "";
  return m[1].replace(/\s+$/, "").replace(/^\s+/, "");
}
function renderGlossaryManagedInner(culture) {
  const lines = [];
  lines.push(`# ${glossaryNoteTitle(culture)}`);
  lines.push("");
  lines.push(`Part of [[${culture.name}]].`);
  lines.push("");
  lines.push("| Form | Meaning | Frequency |");
  lines.push("|---|---|---|");
  for (const r of culture.roots.slice().sort((a, b) => b.weight - a.weight)) {
    lines.push(`| ${r.form} | ${r.meaning} | ${weightLabel(r.weight)} |`);
  }
  lines.push("");
  return lines.join("\n");
}
function renderGlossaryPage(culture, existingBody) {
  const fm = renderFrontmatter(culture, "glossary");
  const managed = `${MANAGED_START}
${renderGlossaryManagedInner(culture)}${MANAGED_END}`;
  if (!existingBody) return `${fm}

${managed}
`;
  let body = existingBody;
  const fmMatch = body.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);
  if (fmMatch) body = body.slice(fmMatch[0].length);
  const startIdx = body.indexOf(MANAGED_START);
  const endIdx = body.indexOf(MANAGED_END);
  if (startIdx >= 0 && endIdx > startIdx) {
    const before = body.slice(0, startIdx);
    const after = body.slice(endIdx + MANAGED_END.length);
    return `${fm}

${(before + managed + after).replace(/^\s+/, "")}`;
  }
  const user = body.trim();
  return user ? `${fm}

${managed}

${user}
` : `${fm}

${managed}
`;
}
function renderLanguagePage(culture, allCultures = [], existingBody) {
  const fm = renderFrontmatter(culture, "language");
  const managed = `${MANAGED_START}
${renderManagedInner(culture, allCultures)}${MANAGED_END}`;
  const descStub = "## Description\n\n";
  const notesStub = "## Notes\n";
  if (!existingBody) {
    return `${fm}

${descStub}${managed}

${notesStub}`;
  }
  let body = existingBody;
  const fmMatch = body.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);
  if (fmMatch) body = body.slice(fmMatch[0].length);
  const startIdx = body.indexOf(MANAGED_START);
  const endIdx = body.indexOf(MANAGED_END);
  if (startIdx >= 0 && endIdx > startIdx) {
    let before = body.slice(0, startIdx);
    const after = body.slice(endIdx + MANAGED_END.length);
    if (!hasHeading(before + after, "Description") && !hasHeading(before, "Description")) {
      before = descStub + before;
    }
    let spliced = before + managed + after;
    if (!hasHeading(spliced, "Notes")) spliced = spliced.replace(/\s*$/, "") + `

${notesStub}`;
    return `${fm}

${spliced.replace(/^\s+/, "")}`;
  }
  const user = body.trim();
  let migrated = `${fm}

${descStub}${managed}

`;
  if (user) migrated += `${user}

`;
  if (!hasHeading(migrated, "Notes")) migrated += notesStub;
  return migrated;
}

// src/familyTreeView.ts
var NODE_W = 112;
var NODE_H = 36;
var H_GAP = 28;
var V_GAP = 72;
var PAD = 12;
var UNION_R = 10;
var FOREST_GAP = 48;
function generationOf(c, byId, memo, stack) {
  var _a;
  if (memo.has(c.id)) return memo.get(c.id);
  if (stack.has(c.id)) return 0;
  if (c.generation !== void 0) {
    memo.set(c.id, c.generation);
    return c.generation;
  }
  const parents = ((_a = c.parentIds) != null ? _a : []).map((id) => byId.get(id)).filter((p) => !!p);
  if (parents.length === 0) {
    memo.set(c.id, 0);
    return 0;
  }
  stack.add(c.id);
  const g = Math.max(...parents.map((p) => generationOf(p, byId, memo, stack))) + 1;
  stack.delete(c.id);
  memo.set(c.id, g);
  return g;
}
function unionKey(parentIds) {
  return [...parentIds].sort().join("+");
}
function connectedComponents(cultures) {
  var _a, _b;
  const byId = new Map(cultures.map((c) => [c.id, c]));
  const adj = /* @__PURE__ */ new Map();
  for (const c of cultures) adj.set(c.id, /* @__PURE__ */ new Set());
  for (const c of cultures) {
    for (const pid of (_a = c.parentIds) != null ? _a : []) {
      if (!byId.has(pid)) continue;
      adj.get(c.id).add(pid);
      adj.get(pid).add(c.id);
    }
  }
  const seen = /* @__PURE__ */ new Set();
  const comps = [];
  for (const c of cultures) {
    if (seen.has(c.id)) continue;
    const ids = [];
    const stack = [c.id];
    seen.add(c.id);
    while (stack.length) {
      const id = stack.pop();
      ids.push(id);
      for (const n of (_b = adj.get(id)) != null ? _b : []) {
        if (seen.has(n)) continue;
        seen.add(n);
        stack.push(n);
      }
    }
    comps.push(ids.map((id) => byId.get(id)));
  }
  return comps;
}
function forestComplexity(members) {
  var _a, _b;
  if (members.length <= 1) return 0;
  const ids = new Set(members.map((c) => c.id));
  let edges = 0;
  let merges = 0;
  let maxGen = 0;
  for (const c of members) {
    const pids = ((_a = c.parentIds) != null ? _a : []).filter((id) => ids.has(id));
    edges += pids.length;
    if (pids.length >= 2) merges++;
    maxGen = Math.max(maxGen, (_b = c.generation) != null ? _b : 0);
  }
  return members.length * 100 + maxGen * 20 + merges * 15 + edges;
}
function offsetLayout(layout, dx) {
  return {
    width: layout.width + dx,
    height: layout.height,
    nodes: layout.nodes.map((n) => ({ ...n, cx: n.cx + dx })),
    unions: layout.unions.map((u) => ({ ...u, cx: u.cx + dx })),
    edges: layout.edges.map((e) => ({
      x1: e.x1 + dx,
      y1: e.y1,
      x2: e.x2 + dx,
      y2: e.y2,
      childIds: e.childIds
    }))
  };
}
function layoutConnectedForest(cultures) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
  const byId = new Map(cultures.map((c) => [c.id, c]));
  const genMemo = /* @__PURE__ */ new Map();
  const gen = /* @__PURE__ */ new Map();
  for (const c of cultures) {
    gen.set(c.id, generationOf(c, byId, genMemo, /* @__PURE__ */ new Set()));
  }
  const unionsByKey = /* @__PURE__ */ new Map();
  for (const c of cultures) {
    const pids = ((_a = c.parentIds) != null ? _a : []).filter((id) => byId.has(id));
    if (pids.length < 2) continue;
    const key = unionKey(pids);
    let u = unionsByKey.get(key);
    if (!u) {
      u = { parentIds: [...pids].sort(), childIds: [] };
      unionsByKey.set(key, u);
    }
    u.childIds.push(c.id);
  }
  const soloChildren = /* @__PURE__ */ new Map();
  for (const c of cultures) {
    const pids = ((_b = c.parentIds) != null ? _b : []).filter((id) => byId.has(id));
    if (pids.length !== 1) continue;
    const list = (_c = soloChildren.get(pids[0])) != null ? _c : [];
    list.push(c.id);
    soloChildren.set(pids[0], list);
  }
  const byGen = /* @__PURE__ */ new Map();
  for (const c of cultures) {
    const g = gen.get(c.id);
    const list = (_d = byGen.get(g)) != null ? _d : [];
    list.push(c.id);
    byGen.set(g, list);
  }
  const maxGen = cultures.length === 0 ? 0 : Math.max(0, ...[...byGen.keys()]);
  const xIndex = /* @__PURE__ */ new Map();
  for (let g = 0; g <= maxGen; g++) {
    const ids = (_e = byGen.get(g)) != null ? _e : [];
    ids.sort((a, b) => {
      const ca = byId.get(a);
      const cb = byId.get(b);
      if (g > 0) {
        const avg = (id) => {
          var _a2, _b2;
          const pids = (_b2 = (_a2 = byId.get(id)) == null ? void 0 : _a2.parentIds) != null ? _b2 : [];
          const slots = pids.map((p) => xIndex.get(p)).filter((n) => n !== void 0);
          if (slots.length === 0) return 0;
          return slots.reduce((s, n) => s + n, 0) / slots.length;
        };
        const d = avg(a) - avg(b);
        if (Math.abs(d) > 1e-6) return d;
      }
      return ca.name.localeCompare(cb.name);
    });
    ids.forEach((id, i) => xIndex.set(id, i));
    byGen.set(g, ids);
  }
  const nodePos = /* @__PURE__ */ new Map();
  const pitch = NODE_W + H_GAP;
  for (let g = 0; g <= maxGen; g++) {
    const ids = (_f = byGen.get(g)) != null ? _f : [];
    const startX = PAD + NODE_W / 2;
    ids.forEach((id, i) => {
      nodePos.set(id, {
        cx: startX + i * pitch,
        cy: PAD + NODE_H / 2 + g * (NODE_H + V_GAP)
      });
    });
  }
  for (let iter = 0; iter < 4; iter++) {
    for (let g = 1; g <= maxGen; g++) {
      const ids = (_g = byGen.get(g)) != null ? _g : [];
      const targets = ids.map((id) => {
        var _a2, _b2;
        const pids = (_b2 = (_a2 = byId.get(id)) == null ? void 0 : _a2.parentIds) != null ? _b2 : [];
        const pxs = pids.map((p) => {
          var _a3;
          return (_a3 = nodePos.get(p)) == null ? void 0 : _a3.cx;
        }).filter((n) => n !== void 0);
        const cx = pxs.length ? pxs.reduce((s, n) => s + n, 0) / pxs.length : nodePos.get(id).cx;
        return { id, cx };
      });
      targets.sort((a, b) => a.cx - b.cx || a.id.localeCompare(b.id));
      let cursor = PAD + NODE_W / 2;
      for (const t of targets) {
        const cx = Math.max(cursor, t.cx);
        const pos = nodePos.get(t.id);
        pos.cx = cx;
        cursor = cx + pitch;
      }
    }
    for (let g = 0; g < maxGen; g++) {
      for (const id of (_h = byGen.get(g)) != null ? _h : []) {
        const kids = [...(_i = soloChildren.get(id)) != null ? _i : []];
        for (const u of unionsByKey.values()) {
          if (u.parentIds.includes(id)) kids.push(...u.childIds);
        }
        const kxs = kids.map((k) => {
          var _a2;
          return (_a2 = nodePos.get(k)) == null ? void 0 : _a2.cx;
        }).filter((n) => n !== void 0);
        if (kxs.length === 0) continue;
        const mean = kxs.reduce((s, n) => s + n, 0) / kxs.length;
        const pos = nodePos.get(id);
        pos.cx = pos.cx * 0.6 + mean * 0.4;
      }
      const ids = [...(_j = byGen.get(g)) != null ? _j : []];
      ids.sort((a, b) => nodePos.get(a).cx - nodePos.get(b).cx || a.localeCompare(b));
      let cursor = PAD + NODE_W / 2;
      for (const id of ids) {
        const pos = nodePos.get(id);
        pos.cx = Math.max(cursor, pos.cx);
        cursor = pos.cx + pitch;
      }
    }
  }
  const placedUnions = [];
  for (const [key, u] of unionsByKey) {
    const pxs = u.parentIds.map((id) => {
      var _a2;
      return (_a2 = nodePos.get(id)) == null ? void 0 : _a2.cx;
    }).filter((n) => n !== void 0);
    const pys = u.parentIds.map((id) => {
      var _a2;
      return (_a2 = nodePos.get(id)) == null ? void 0 : _a2.cy;
    }).filter((n) => n !== void 0);
    const cys = u.childIds.map((id) => {
      var _a2;
      return (_a2 = nodePos.get(id)) == null ? void 0 : _a2.cy;
    }).filter((n) => n !== void 0);
    if (pxs.length < 2 || cys.length === 0) continue;
    const cx = (Math.min(...pxs) + Math.max(...pxs)) / 2;
    const parentBottom = Math.max(...pys) + NODE_H / 2;
    const childTop = Math.min(...cys) - NODE_H / 2;
    const cy = (parentBottom + childTop) / 2;
    placedUnions.push({ key, parentIds: u.parentIds, childIds: u.childIds, cx, cy });
  }
  const edges = [];
  for (const [pid, kids] of soloChildren) {
    const p = nodePos.get(pid);
    if (!p) continue;
    for (const kid of kids) {
      const c = nodePos.get(kid);
      if (!c) continue;
      const midY = (p.cy + NODE_H / 2 + c.cy - NODE_H / 2) / 2;
      edges.push({ x1: p.cx, y1: p.cy + NODE_H / 2, x2: p.cx, y2: midY, childIds: [kid] });
      edges.push({ x1: p.cx, y1: midY, x2: c.cx, y2: midY, childIds: [kid] });
      edges.push({ x1: c.cx, y1: midY, x2: c.cx, y2: c.cy - NODE_H / 2, childIds: [kid] });
    }
  }
  for (const u of placedUnions) {
    const parents = u.parentIds.map((id) => nodePos.get(id)).filter((p) => !!p);
    if (parents.length < 2) continue;
    const minPx = Math.min(...parents.map((p) => p.cx));
    const maxPx = Math.max(...parents.map((p) => p.cx));
    const barY = u.cy;
    edges.push({ x1: minPx, y1: barY, x2: maxPx, y2: barY, childIds: [...u.childIds] });
    for (const p of parents) {
      edges.push({ x1: p.cx, y1: p.cy + NODE_H / 2, x2: p.cx, y2: barY, childIds: [...u.childIds] });
    }
    for (const cid of u.childIds) {
      const c = nodePos.get(cid);
      if (!c) continue;
      const midY = (barY + c.cy - NODE_H / 2) / 2;
      edges.push({ x1: u.cx, y1: barY, x2: u.cx, y2: midY, childIds: [cid] });
      edges.push({ x1: u.cx, y1: midY, x2: c.cx, y2: midY, childIds: [cid] });
      edges.push({ x1: c.cx, y1: midY, x2: c.cx, y2: c.cy - NODE_H / 2, childIds: [cid] });
    }
  }
  const nodes = cultures.map((c) => {
    const p = nodePos.get(c.id);
    return { id: c.id, name: c.name, cx: p.cx, cy: p.cy };
  });
  let minLeft = Infinity;
  for (const n of nodes) minLeft = Math.min(minLeft, n.cx - NODE_W / 2);
  for (const u of placedUnions) minLeft = Math.min(minLeft, u.cx - UNION_R);
  for (const e of edges) minLeft = Math.min(minLeft, e.x1, e.x2);
  const pull = Number.isFinite(minLeft) ? minLeft - PAD : 0;
  if (pull > 0) {
    for (const n of nodes) n.cx -= pull;
    for (const u of placedUnions) u.cx -= pull;
    for (const e of edges) {
      e.x1 -= pull;
      e.x2 -= pull;
    }
  }
  let maxX = PAD + NODE_W;
  let maxY = PAD + NODE_H;
  for (const n of nodes) {
    maxX = Math.max(maxX, n.cx + NODE_W / 2);
    maxY = Math.max(maxY, n.cy + NODE_H / 2);
  }
  for (const u of placedUnions) {
    maxX = Math.max(maxX, u.cx + UNION_R);
    maxY = Math.max(maxY, u.cy + UNION_R);
  }
  return {
    width: maxX + PAD,
    height: maxY + PAD,
    nodes,
    unions: placedUnions,
    edges
  };
}
function layoutFamilyTree(cultures) {
  if (cultures.length === 0) {
    return { width: PAD * 2, height: PAD * 2, nodes: [], unions: [], edges: [] };
  }
  const comps = connectedComponents(cultures);
  const trees = comps.filter((c) => c.length > 1);
  const singles = comps.filter((c) => c.length === 1);
  trees.sort((a, b) => {
    var _a, _b, _c, _d;
    const d = forestComplexity(b) - forestComplexity(a);
    if (d !== 0) return d;
    const na = (_b = (_a = a.slice().sort((x, y) => x.name.localeCompare(y.name))[0]) == null ? void 0 : _a.name) != null ? _b : "";
    const nb = (_d = (_c = b.slice().sort((x, y) => x.name.localeCompare(y.name))[0]) == null ? void 0 : _c.name) != null ? _d : "";
    return na.localeCompare(nb);
  });
  singles.sort((a, b) => a[0].name.localeCompare(b[0].name));
  const ordered = [...trees, ...singles];
  let cursorX = 0;
  let height = PAD * 2;
  const merged = { width: 0, height: 0, nodes: [], unions: [], edges: [] };
  for (let i = 0; i < ordered.length; i++) {
    const local = layoutConnectedForest(ordered[i]);
    const localLeft = Math.min(
      ...local.nodes.map((n) => n.cx - NODE_W / 2),
      ...local.unions.length ? local.unions.map((u) => u.cx - UNION_R) : [Infinity],
      PAD
    );
    const shift = i === 0 ? 0 : cursorX + FOREST_GAP - localLeft;
    const placed = offsetLayout(local, shift);
    merged.nodes.push(...placed.nodes);
    merged.unions.push(...placed.unions);
    merged.edges.push(...placed.edges);
    height = Math.max(height, placed.height);
    let right = 0;
    for (const n of placed.nodes) right = Math.max(right, n.cx + NODE_W / 2);
    for (const u of placed.unions) right = Math.max(right, u.cx + UNION_R);
    cursorX = Math.max(cursorX, right);
  }
  return {
    width: cursorX + PAD,
    height,
    nodes: merged.nodes,
    unions: merged.unions,
    edges: merged.edges
  };
}
function renderFamilyTreeView(parent, cultures, onSelect) {
  var _a, _b, _c;
  if (cultures.length === 0) {
    parent.createEl("p", {
      text: "No cultures yet \u2014 create one on the New or Seeded tab first.",
      cls: "lf-hint"
    });
    return;
  }
  const layout = layoutFamilyTree(cultures);
  const viewport = parent.createDiv({ cls: "lf-tree-viewport" });
  const canvas = viewport.createDiv({ cls: "lf-tree-canvas" });
  canvas.style.width = `${layout.width}px`;
  canvas.style.height = `${layout.height}px`;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "lf-tree-edges");
  svg.setAttribute("width", String(layout.width));
  svg.setAttribute("height", String(layout.height));
  svg.setAttribute("viewBox", `0 0 ${layout.width} ${layout.height}`);
  const edgesByChild = /* @__PURE__ */ new Map();
  for (const e of layout.edges) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", String(e.x1));
    line.setAttribute("y1", String(e.y1));
    line.setAttribute("x2", String(e.x2));
    line.setAttribute("y2", String(e.y2));
    line.setAttribute("class", "lf-tree-edge");
    svg.appendChild(line);
    for (const cid of (_a = e.childIds) != null ? _a : []) {
      const list = (_b = edgesByChild.get(cid)) != null ? _b : [];
      list.push(line);
      edgesByChild.set(cid, list);
    }
  }
  canvas.appendChild(svg);
  for (const u of layout.unions) {
    const mark = canvas.createDiv({ cls: "lf-tree-marriage", text: "\u26AD" });
    mark.style.left = `${u.cx - UNION_R}px`;
    mark.style.top = `${u.cy - UNION_R}px`;
    mark.setAttr("title", "Merged languages");
  }
  for (const n of layout.nodes) {
    const node = canvas.createDiv({ cls: "lf-tree-chip" });
    node.style.left = `${n.cx - NODE_W / 2}px`;
    node.style.top = `${n.cy - NODE_H / 2}px`;
    node.style.width = `${NODE_W}px`;
    node.style.height = `${NODE_H}px`;
    node.setAttr("title", n.name);
    const label = node.createSpan({ text: n.name, cls: "lf-tree-chip-label" });
    fitChipLabel(label, node);
    const parentLines = (_c = edgesByChild.get(n.id)) != null ? _c : [];
    node.addEventListener("mouseenter", () => {
      for (const line of parentLines) {
        line.classList.add("is-highlighted");
        svg.appendChild(line);
      }
    });
    node.addEventListener("mouseleave", () => {
      for (const line of parentLines) line.classList.remove("is-highlighted");
    });
    node.onclick = () => onSelect(n.id);
  }
}
function fitChipLabel(label, chip, maxPx = 13, minPx = 7) {
  let size = maxPx;
  label.style.fontSize = `${size}px`;
  while (size > minPx && label.scrollWidth > chip.clientWidth - 16) {
    size -= 0.5;
    label.style.fontSize = `${size}px`;
  }
}

// src/main.ts
var DEFAULT_SETTINGS = {
  folder: "LanguageForge",
  batchSize: 12,
  showPronunciation: true,
  insertFormat: "list"
};
function sanitiseNoteName(name) {
  return name.replace(/[\\/:*?"<>|#^[\]]/g, "").trim() || "Untitled";
}
function elevateStackedModal(modal) {
  const open = document.querySelectorAll(
    ".modal-container.lf-stacked-modal-nested, .modal-container.lf-stacked-modal-container"
  );
  const aboveNested = [...open].some((el) => el.classList.contains("lf-stacked-modal-nested"));
  modal.containerEl.addClass(aboveNested ? "lf-stacked-modal-over" : "lf-stacked-modal-nested");
}
var LanguageForgePlugin = class extends import_obsidian.Plugin {
  constructor() {
    super(...arguments);
    this.data = { settings: { ...DEFAULT_SETTINGS }, cultures: [], contactEdges: [] };
  }
  async onload() {
    var _a, _b, _c;
    const stored = await this.loadData();
    if (stored) {
      this.data.settings = { ...DEFAULT_SETTINGS, ...(_a = stored.settings) != null ? _a : {} };
      this.data.cultures = (_b = stored.cultures) != null ? _b : [];
      this.data.contactEdges = (_c = stored.contactEdges) != null ? _c : [];
    }
    let migrated = false;
    for (const c of this.data.cultures) {
      if (ensureCultureClasses(c)) migrated = true;
    }
    if (migrated) await this.persist();
    this.addCommand({
      id: "create-culture",
      name: "Create a culture",
      callback: () => new CreateLanguageModal(this.app, this).open()
    });
    this.addCommand({
      id: "create-culture-from-names",
      name: "Create a culture from names you already have",
      callback: () => new CreateLanguageModal(this.app, this, "seeded").open()
    });
    this.addCommand({
      id: "generate-names",
      name: "Generate names",
      callback: () => this.openGenerate()
    });
    this.addCommand({
      id: "derive-culture",
      name: "Derive a descendant language",
      callback: () => {
        if (this.data.cultures.length === 0) {
          new import_obsidian.Notice("No cultures yet \u2014 create one first.");
          new CreateLanguageModal(this.app, this).open();
          return;
        }
        new CreateLanguageModal(this.app, this, "child").open();
      }
    });
    this.addCommand({
      id: "age-culture",
      name: "Age a language in place",
      callback: () => {
        if (this.data.cultures.length === 0) {
          new import_obsidian.Notice("No cultures yet \u2014 create one first.");
          return;
        }
        new PickCultureModal(this.app, this, (c) => new AgeCultureModal(this.app, this, c).open(), "Age this").open();
      }
    });
    this.addCommand({
      id: "create-contact-edge",
      name: "Connect two languages via contact",
      callback: () => {
        if (this.data.cultures.length < 2) {
          new import_obsidian.Notice("Need at least two languages to connect.");
          return;
        }
        new CreateLanguageModal(this.app, this, "child", void 0, "contact").open();
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
          await this.openCulturePage(c);
          new import_obsidian.Notice(`Saved language page for ${c.name}`);
        }, "Open page").open();
      }
    });
    this.addCommand({
      id: "import-names",
      name: "Import names into a language",
      callback: () => {
        if (this.data.cultures.length === 0) {
          new import_obsidian.Notice("No cultures yet \u2014 create one first.");
          new CreateLanguageModal(this.app, this).open();
          return;
        }
        new PickCultureModal(this.app, this, (c) => {
          new ImportNamesModal(this.app, this, c).open();
        }, "Import into\u2026").open();
      }
    });
    this.addCommand({
      id: "edit-languages",
      name: "Edit languages",
      callback: () => new CreateLanguageModal(this.app, this, "edit").open()
    });
    this.addCommand({
      id: "languages-hub",
      name: "Create a language",
      callback: () => new CreateLanguageModal(this.app, this).open()
    });
    this.addRibbonIcon("tree-deciduous", "languageForge: Languages", () => {
      new FamilyTreeModal(this.app, this).open();
    });
    this.addRibbonIcon("sparkles", "languageForge: Generate names", () => {
      this.openGenerate();
    });
    this.addSettingTab(new LanguageForgeSettingTab(this.app, this));
  }
  openGenerate(opts) {
    if (this.data.cultures.length === 0) {
      new import_obsidian.Notice("No cultures yet \u2014 create one first.");
      new FamilyTreeModal(this.app, this).open();
      return;
    }
    new GenerateModal(this.app, this, opts).open();
  }
  async persist() {
    await this.saveData(this.data);
  }
  notePathFor(culture) {
    const folder = (0, import_obsidian.normalizePath)(this.data.settings.folder.replace(/\/+$/, ""));
    return (0, import_obsidian.normalizePath)(`${folder}/${sanitiseNoteName(culture.name)}.md`);
  }
  glossaryPathFor(culture) {
    const folder = (0, import_obsidian.normalizePath)(this.data.settings.folder.replace(/\/+$/, ""));
    return (0, import_obsidian.normalizePath)(`${folder}/${sanitiseNoteName(culture.name)} Glossary.md`);
  }
  findCultureNote(culture) {
    var _a, _b;
    const expected = this.notePathFor(culture);
    const byPath = this.app.vault.getAbstractFileByPath(expected);
    if (byPath instanceof import_obsidian.TFile) return byPath;
    const folder = (0, import_obsidian.normalizePath)(this.data.settings.folder.replace(/\/+$/, ""));
    const prefix = folder + "/";
    for (const f of this.app.vault.getMarkdownFiles()) {
      if (!f.path.startsWith(prefix)) continue;
      const cache = this.app.metadataCache.getFileCache(f);
      const id = (_a = cache == null ? void 0 : cache.frontmatter) == null ? void 0 : _a["lf-id"];
      const kind = (_b = cache == null ? void 0 : cache.frontmatter) == null ? void 0 : _b["lf-kind"];
      if ((id === culture.id || String(id) === culture.id) && kind !== "glossary") return f;
    }
    return null;
  }
  findGlossaryNote(culture) {
    var _a, _b;
    const expected = this.glossaryPathFor(culture);
    const byPath = this.app.vault.getAbstractFileByPath(expected);
    if (byPath instanceof import_obsidian.TFile) return byPath;
    const folder = (0, import_obsidian.normalizePath)(this.data.settings.folder.replace(/\/+$/, ""));
    const prefix = folder + "/";
    for (const f of this.app.vault.getMarkdownFiles()) {
      if (!f.path.startsWith(prefix)) continue;
      const cache = this.app.metadataCache.getFileCache(f);
      const id = (_a = cache == null ? void 0 : cache.frontmatter) == null ? void 0 : _a["lf-id"];
      const kind = (_b = cache == null ? void 0 : cache.frontmatter) == null ? void 0 : _b["lf-kind"];
      if ((id === culture.id || String(id) === culture.id) && kind === "glossary") return f;
    }
    return null;
  }
  hasCulturePage(culture) {
    return !!this.findCultureNote(culture);
  }
  async readCultureDescription(culture) {
    const file = this.findCultureNote(culture);
    if (!file) return "";
    return extractDescriptionFromPage(await this.app.vault.read(file));
  }
  async writeGlossaryNote(culture) {
    var _a;
    const folder = (0, import_obsidian.normalizePath)(this.data.settings.folder.replace(/\/+$/, ""));
    try {
      await this.app.vault.createFolder(folder);
    } catch {
    }
    const existing = this.findGlossaryNote(culture);
    const path = (_a = existing == null ? void 0 : existing.path) != null ? _a : this.glossaryPathFor(culture);
    const prior = existing ? await this.app.vault.read(existing) : void 0;
    const content = renderGlossaryPage(culture, prior);
    if (existing) await this.app.vault.modify(existing, content);
    else await this.app.vault.create(path, content);
    return path;
  }
  async writeCultureNote(culture) {
    var _a;
    const folder = (0, import_obsidian.normalizePath)(this.data.settings.folder.replace(/\/+$/, ""));
    try {
      await this.app.vault.createFolder(folder);
    } catch {
    }
    const existing = this.findCultureNote(culture);
    const path = (_a = existing == null ? void 0 : existing.path) != null ? _a : this.notePathFor(culture);
    const prior = existing ? await this.app.vault.read(existing) : void 0;
    const content = renderLanguagePage(culture, this.data.cultures, prior);
    if (existing) await this.app.vault.modify(existing, content);
    else await this.app.vault.create(path, content);
    await this.writeGlossaryNote(culture);
    return path;
  }
  async openCulturePage(culture) {
    const path = await this.writeCultureNote(culture);
    const file = this.app.vault.getAbstractFileByPath(path);
    if (file instanceof import_obsidian.TFile) await this.app.workspace.getLeaf(false).openFile(file);
  }
  async renameCultureAndNote(culture, newName, translatedName) {
    const trimmed = newName.trim();
    if (!trimmed) {
      new import_obsidian.Notice("Name can't be empty.");
      return;
    }
    if (this.data.cultures.some((c) => c.id !== culture.id && c.name.toLowerCase() === trimmed.toLowerCase())) {
      new import_obsidian.Notice("A culture with that name already exists.");
      return;
    }
    const file = this.findCultureNote(culture);
    const glossFile = this.findGlossaryNote(culture);
    renameCulture(culture, trimmed, translatedName);
    this.upsertCulture(culture);
    await this.persist();
    if (file instanceof import_obsidian.TFile) {
      const dest = this.notePathFor(culture);
      if (file.path !== dest) {
        try {
          await this.app.fileManager.renameFile(file, dest);
        } catch (e) {
          new import_obsidian.Notice(`Renamed culture but file rename failed: ${e}`);
        }
      }
    }
    if (glossFile instanceof import_obsidian.TFile) {
      const dest = this.glossaryPathFor(culture);
      if (glossFile.path !== dest) {
        try {
          await this.app.fileManager.renameFile(glossFile, dest);
        } catch (e) {
          new import_obsidian.Notice(`Glossary rename failed: ${e}`);
        }
      }
    }
    if (file || glossFile) await this.writeCultureNote(culture);
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
var DRIFT_LEVELS = [
  { value: "dialect", label: "Dialect \u2014 light drift, clearly the same tongue" },
  { value: "sister", label: "Sister language \u2014 moderate drift, kin but distinct" },
  { value: "distant", label: "Distant cousin \u2014 heavy drift, related if you look closely" }
];
var DRIFT_PACK_LABELS = {
  romance_softening: "Romance softening",
  celtic_lenition: "Celtic lenition",
  vowel_melting: "Vowel melting",
  syllable_erosion: "Syllable erosion",
  vowel_shift: "Vowel shift",
  germanic_hardening: "Germanic hardening"
};
function descentPackIds() {
  return Object.keys(DRIFT_PACKS).filter((id) => DRIFT_PACKS[id].appliesTo === "descent");
}
var CONTACT_TYPES = [
  { value: "prestige", label: "Prestige \u2014 a ruling/administrative tongue lends downward" },
  { value: "substrate", label: "Substrate \u2014 the conquered tongue survives underneath" },
  { value: "adstrate", label: "Adstrate \u2014 neighbours trading as equals" }
];
var CONTACT_STRENGTHS = [
  { value: 0.2, label: "Light" },
  { value: 0.5, label: "Moderate" },
  { value: 0.8, label: "Heavy" }
];
var CONTACT_DOMAINS = ["administration", "religion", "warfare", "trade", "place-features"];
function culturesByGeneration(cultures) {
  var _a, _b;
  const map = /* @__PURE__ */ new Map();
  for (const c of cultures) {
    const g = (_a = c.generation) != null ? _a : 0;
    const list = (_b = map.get(g)) != null ? _b : [];
    list.push(c);
    map.set(g, list);
  }
  return [...map.entries()].sort((a, b) => a[0] - b[0]).map(([gen, list]) => ({
    gen,
    cultures: list.slice().sort((a, b) => a.name.localeCompare(b.name))
  }));
}
function resolveGenTab(preferred, cultures, fallback = "oldest") {
  const groups = culturesByGeneration(cultures);
  if (groups.length === 0) return 0;
  if (preferred !== null && groups.some((g) => g.gen === preferred)) return preferred;
  return fallback === "newest" ? groups[groups.length - 1].gen : groups[0].gen;
}
function mountGenSubTabs(parent, cultures, activeGen, onSelect, order = "asc") {
  var _a;
  const groups = culturesByGeneration(cultures);
  const tabGroups = order === "desc" ? [...groups].reverse() : groups;
  const resolved = activeGen;
  const tabs = parent.createDiv({ cls: "lf-tabs lf-subtabs" });
  for (const g of tabGroups) {
    const btn = tabs.createEl("button", {
      text: `Gen ${g.gen}`,
      cls: "lf-tab" + (g.gen === resolved ? " is-active" : "")
    });
    btn.onclick = () => onSelect(g.gen);
  }
  const pane = parent.createDiv({ cls: "lf-subtab-pane" });
  const active = groups.find((g) => g.gen === resolved);
  return { activeGen: resolved, pane, cultures: (_a = active == null ? void 0 : active.cultures) != null ? _a : [] };
}
function mintChildDisplayName(source, existing) {
  const taken = new Set(existing.map((c) => c.name.toLowerCase()));
  for (const g of generateBatch(source, "personal", 12)) {
    if (!taken.has(g.name.toLowerCase())) return g.name;
  }
  let fallback = placeholderName(source);
  if (taken.has(fallback.toLowerCase())) {
    fallback = `${fallback}${Math.floor(Math.random() * 90 + 10)}`;
  }
  return fallback;
}
var CreateLanguageModal = class extends import_obsidian.Modal {
  constructor(app, plugin, initialTab = "new", parentId, initialChildMode = "branch") {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    super(app);
    this.traits = {
      name: "",
      mood: "soft",
      register: "balanced",
      familiarity: "familiar",
      environment: "none",
      packs: []
    };
    this.pasted = "";
    this.editDescriptions = /* @__PURE__ */ new Map();
    this.editGen = null;
    // Child tab — branch (derive) or contact (directed borrowing)
    this.childMode = "branch";
    this.branchParentId = "";
    this.childName = "";
    this.childDriftLevel = "sister";
    this.childDriftPackId = "";
    this.childDriftPackTouched = false;
    this.childSpellingMode = "phonetic";
    this.childEnvironment = "none";
    // Contact mode (Gap 3) — donor lends to borrower
    this.contactDonorId = "";
    this.contactBorrowerId = "";
    this.contactType = "prestige";
    this.contactStrength = 0.5;
    this.contactDomains = /* @__PURE__ */ new Set();
    this.contactPreview = null;
    this.contactPendingEdge = null;
    this.plugin = plugin;
    this.tab = initialTab;
    this.childMode = initialChildMode;
    this.branchParentId = (_b = parentId != null ? parentId : (_a = plugin.data.cultures[0]) == null ? void 0 : _a.id) != null ? _b : "";
    this.contactDonorId = (_d = (_c = plugin.data.cultures[0]) == null ? void 0 : _c.id) != null ? _d : "";
    this.contactBorrowerId = (_h = (_g = (_e = plugin.data.cultures[1]) == null ? void 0 : _e.id) != null ? _g : (_f = plugin.data.cultures[0]) == null ? void 0 : _f.id) != null ? _h : "";
    this.childDriftPackId = this.defaultChildPack();
  }
  defaultChildPack() {
    var _a, _b;
    const firstParent = this.plugin.data.cultures.find((c) => c.id === this.branchParentId);
    const mood = firstParent == null ? void 0 : firstParent.mood;
    return (_b = (_a = mood && MOOD_DEFAULT_DRIFT_PACK[mood]) != null ? _a : descentPackIds()[0]) != null ? _b : "";
  }
  onOpen() {
    this.modalEl.addClass("lf-languages-modal");
    this.render();
  }
  render() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("languageforge-modal");
    contentEl.createEl("h2", { text: "Languages", cls: "lf-modal-title" });
    const tabs = contentEl.createDiv({ cls: "lf-tabs" });
    const panes = contentEl.createDiv({ cls: "lf-tab-panes" });
    const footer = contentEl.createDiv({ cls: "lf-modal-footer" });
    const defs = [
      { id: "new", label: "New" },
      { id: "seeded", label: "Seeded" },
      { id: "child", label: "Child" },
      { id: "edit", label: "Edit" }
    ];
    for (const d of defs) {
      const btn = tabs.createEl("button", {
        text: d.label,
        cls: "lf-tab" + (this.tab === d.id ? " is-active" : "")
      });
      btn.onclick = () => {
        this.tab = d.id;
        this.render();
      };
    }
    if (this.tab === "new") this.renderNewTab(panes, footer);
    else if (this.tab === "seeded") this.renderSeededTab(panes, footer);
    else if (this.tab === "child") this.renderChildTab(panes, footer);
    else {
      footer.remove();
      void this.renderEditTab(panes);
    }
  }
  renderNewTab(parent, footer) {
    parent.createEl("p", {
      text: "Choose the sound of a new tongue.",
      cls: "lf-hint"
    });
    this.mountSeedTraits(parent);
    const buttons = new import_obsidian.Setting(footer);
    buttons.addButton((b) => b.setButtonText("Cancel").onClick(() => this.close()));
    buttons.addButton((b) => b.setButtonText("Seed the language").setCta().onClick(() => {
      var _a;
      const given = ((_a = this.traits.name) == null ? void 0 : _a.trim()) || "";
      if (given && this.plugin.data.cultures.some((c) => c.name.toLowerCase() === given.toLowerCase())) {
        new import_obsidian.Notice("A culture with that name already exists.");
        return;
      }
      const env = this.traits.environment === "none" ? "\u2014" : this.traits.environment;
      const culture = seedCulture({ ...this.traits, name: given || void 0, environment: env });
      this.close();
      new CultureCardModal(this.app, this.plugin, culture, true).open();
    }));
  }
  renderSeededTab(parent, footer) {
    parent.createEl("p", {
      text: "Paste romanised names or a short paragraph. Latin letters only \u2014 the language bends to match.",
      cls: "lf-hint"
    });
    const area = parent.createEl("textarea", { cls: "lf-seeded-textarea" });
    area.rows = 12;
    area.placeholder = "Kaelith, Veyra, Kaeloth\n\u2014 or \u2014\nThe sisters were called Elowen and Maeriel.";
    area.value = this.pasted;
    area.addEventListener("input", () => {
      this.pasted = area.value;
    });
    this.mountSeedTraits(parent);
    const buttons = new import_obsidian.Setting(footer);
    buttons.addButton((b) => b.setButtonText("Cancel").onClick(() => this.close()));
    buttons.addButton((b) => b.setButtonText("Seed from text").setCta().onClick(() => {
      var _a;
      const parsed = parseImportInput(this.pasted);
      if (parsed.candidates.length < 2) {
        new import_obsidian.Notice("Paste at least two romanised names (or a paragraph that contains them).");
        return;
      }
      const given = ((_a = this.traits.name) == null ? void 0 : _a.trim()) || "";
      if (given && this.plugin.data.cultures.some((c) => c.name.toLowerCase() === given.toLowerCase())) {
        new import_obsidian.Notice("A culture with that name already exists.");
        return;
      }
      const name = given || parsed.candidates[0] + "-kin";
      const culture = reverseSeedCulture(name, parsed.candidates, {
        mood: this.traits.mood,
        register: this.traits.register,
        familiarity: this.traits.familiarity,
        environment: this.traits.environment,
        packs: [...this.traits.packs]
      });
      this.close();
      new CultureCardModal(this.app, this.plugin, culture, true).open();
    }));
  }
  /** Shared New / Seeded trait controls — both tabs bind the same `this.traits`. */
  mountSeedTraits(parent) {
    new import_obsidian.Setting(parent).setName("Culture name").setDesc("Optional. Blank \u2192 a name minted from this culture's own sounds (New) or from the paste (Seeded).").addText((t) => {
      var _a;
      return t.setPlaceholder("Velari (or leave blank)").setValue((_a = this.traits.name) != null ? _a : "").onChange((v) => this.traits.name = v.trim());
    });
    new import_obsidian.Setting(parent).setName("Sound").setDesc("The phonaesthetic mood of the language.").addDropdown((d) => {
      for (const m of MOODS) d.addOption(m.value, m.label);
      d.setValue(this.traits.mood).onChange((v) => this.traits.mood = v);
    });
    new import_obsidian.Setting(parent).setName("Register").setDesc("Ancient names run long with penult stress; modern names run short.").addDropdown((d) => {
      d.addOption("balanced", "Balanced");
      d.addOption("ancient", "Ancient");
      d.addOption("modern", "Modern");
      d.setValue(this.traits.register).onChange((v) => this.traits.register = v);
    });
    new import_obsidian.Setting(parent).setName("Familiarity").setDesc("Familiar samples the curated element packs; alien builds sounds procedurally.").addDropdown((d) => {
      d.addOption("familiar", "Familiar (English-adjacent)");
      d.addOption("alien", "Alien (procedural)");
      d.setValue(this.traits.familiarity).onChange((v) => this.traits.familiarity = v);
    });
    new import_obsidian.Setting(parent).setName("Environment").setDesc("Coastal adds seafaring words, mountain adds highland words, and so on.").addDropdown((d) => {
      for (const e of ENVIRONMENTS) d.addOption(e, e === "none" ? "None in particular" : e[0].toUpperCase() + e.slice(1));
      d.setValue(this.traits.environment).onChange((v) => this.traits.environment = v);
    });
    new import_obsidian.Setting(parent).setName("Word themes (optional)").setDesc("Core words \u2014 kinship, virtues, nature \u2014 are always on. Stack themes to tilt what names mean.");
    for (const packName of Object.keys(SEMANTIC_PACKS)) {
      if (!SEMANTIC_PACKS[packName].additive) continue;
      new import_obsidian.Setting(parent).setName(packName[0].toUpperCase() + packName.slice(1)).addToggle((t) => t.setValue(this.traits.packs.includes(packName)).onChange((on) => {
        if (on) {
          if (!this.traits.packs.includes(packName)) this.traits.packs.push(packName);
        } else {
          this.traits.packs = this.traits.packs.filter((p) => p !== packName);
        }
      }));
    }
  }
  renderChildTab(parent, footer) {
    if (!this.childDriftPackTouched) this.childDriftPackId = this.defaultChildPack();
    parent.createEl("p", {
      text: "Language aging drifts one parent's sounds into a descendant. Language intermixing connects two existing languages: a donor lends vocabulary, reshaped to fit the borrower's mouth.",
      cls: "lf-hint"
    });
    const buttons = new import_obsidian.Setting(footer);
    buttons.addButton((b) => b.setButtonText("Cancel").onClick(() => this.close()));
    if (this.plugin.data.cultures.length === 0) {
      parent.createEl("p", { text: "No cultures yet \u2014 create one on the New or Seeded tab first.", cls: "lf-hint" });
      return;
    }
    const genGroups = culturesByGeneration(this.plugin.data.cultures);
    new import_obsidian.Setting(parent).setName("Mode").setDesc("Language aging creates a new language. Language intermixing links two existing ones without minting a third.").addDropdown((d) => {
      d.addOption("branch", "Language aging");
      d.addOption("contact", "Language intermixing");
      d.setValue(this.childMode).onChange((v) => {
        this.childMode = v;
        this.contactPreview = null;
        this.contactPendingEdge = null;
        this.render();
      });
    });
    if (this.childMode === "contact") {
      this.renderChildContact(parent, buttons);
      return;
    }
    new import_obsidian.Setting(parent).setName("Parent language").setDesc("Grouped by generation \u2014 Gen 0 are roots, higher gens are descendants.").addDropdown((d) => {
      var _a, _b, _c;
      const sel = d.selectEl;
      sel.empty();
      for (const group of genGroups) {
        const og = sel.createEl("optgroup");
        og.label = `Gen ${group.gen}`;
        for (const c of group.cultures) {
          og.createEl("option", { text: c.name, value: c.id });
        }
      }
      if (!this.branchParentId || !this.plugin.data.cultures.some((c) => c.id === this.branchParentId)) {
        this.branchParentId = (_c = (_b = (_a = genGroups[0]) == null ? void 0 : _a.cultures[0]) == null ? void 0 : _b.id) != null ? _c : "";
      }
      d.setValue(this.branchParentId);
      d.onChange((v) => this.branchParentId = v);
    });
    new import_obsidian.Setting(parent).setName("New language name").setDesc("Optional. Leave blank to mint a name from the parent tongue's generator.").addText((t) => t.setPlaceholder("Blank \u2192 auto from generator").setValue(this.childName).onChange((v) => this.childName = v.trim()));
    new import_obsidian.Setting(parent).setName("Drift").setDesc("How far the branch has diverged from its parent.").addDropdown((d) => {
      for (const lvl of DRIFT_LEVELS) d.addOption(lvl.value, lvl.label);
      d.setValue(this.childDriftLevel).onChange((v) => this.childDriftLevel = v);
    });
    const packHint = parent.createEl("p", { cls: "lf-hint" });
    const updatePackHint = () => {
      const pack = DRIFT_PACKS[this.childDriftPackId];
      packHint.setText(pack ? `${pack.plainDescription} ${pack.why}` : "");
    };
    new import_obsidian.Setting(parent).setName("Sound-change pack").setDesc("The kind of sound change this branch undergoes.").addDropdown((d) => {
      var _a;
      for (const id of descentPackIds()) d.addOption(id, (_a = DRIFT_PACK_LABELS[id]) != null ? _a : id);
      d.setValue(this.childDriftPackId).onChange((v) => {
        this.childDriftPackId = v;
        this.childDriftPackTouched = true;
        updatePackHint();
      });
    });
    updatePackHint();
    new import_obsidian.Setting(parent).setName("Spelling").setDesc("Phonetic respells everything to the worn sound; etymological keeps compound roots more visible.").addDropdown((d) => {
      d.addOption("phonetic", "Phonetic (respell to the worn sound)");
      d.addOption("etymological", "Etymological (keep compound roots visible)");
      d.setValue(this.childSpellingMode).onChange((v) => this.childSpellingMode = v);
    });
    new import_obsidian.Setting(parent).setName("Environment").setDesc("Optional \u2014 adds regional word themes on top of the parent's vocabulary.").addDropdown((d) => {
      for (const e of ENVIRONMENTS) d.addOption(e, e === "none" ? "None in particular" : e[0].toUpperCase() + e.slice(1));
      d.setValue(this.childEnvironment).onChange((v) => this.childEnvironment = v);
    });
    buttons.addButton((b) => b.setButtonText("Derive language").setCta().onClick(() => {
      const envPack = ENV_DEFAULT_PACK[this.childEnvironment];
      const overrides = {};
      if (this.childEnvironment !== "none") {
        overrides.environment = this.childEnvironment;
        if (envPack) overrides.packs = [envPack];
      }
      const parentCulture = this.plugin.data.cultures.find((c) => c.id === this.branchParentId);
      if (!parentCulture) {
        new import_obsidian.Notice("Pick a parent language first.");
        return;
      }
      let name = this.childName.trim();
      if (!name) name = mintChildDisplayName(parentCulture, this.plugin.data.cultures);
      else if (this.plugin.data.cultures.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
        new import_obsidian.Notice("A culture with that name already exists.");
        return;
      }
      const culture = deriveCulture(
        parentCulture,
        name,
        this.childDriftLevel,
        [this.childDriftPackId],
        overrides,
        this.childSpellingMode
      );
      this.close();
      new CultureCardModal(this.app, this.plugin, culture, true).open();
    }));
  }
  renderChildContact(parent, buttons) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    if (this.plugin.data.cultures.length < 2) {
      parent.createEl("p", {
        text: "Intermixing needs at least two languages. Create another on the New or Seeded tab first.",
        cls: "lf-hint"
      });
      return;
    }
    const genGroups = culturesByGeneration(this.plugin.data.cultures);
    if (!this.plugin.data.cultures.some((c) => c.id === this.contactDonorId)) {
      this.contactDonorId = (_c = (_b = (_a = genGroups[0]) == null ? void 0 : _a.cultures[0]) == null ? void 0 : _b.id) != null ? _c : "";
    }
    const donor = this.plugin.data.cultures.find((c) => c.id === this.contactDonorId);
    const donorGen = (_d = donor == null ? void 0 : donor.generation) != null ? _d : 0;
    const peerCultures = ((_f = (_e = genGroups.find((g) => g.gen === donorGen)) == null ? void 0 : _e.cultures) != null ? _f : []).filter((c) => c.id !== this.contactDonorId);
    if (!peerCultures.some((c) => c.id === this.contactBorrowerId)) {
      this.contactBorrowerId = (_h = (_g = peerCultures[0]) == null ? void 0 : _g.id) != null ? _h : "";
    }
    const fillByGeneration = (d, cultures, groupLabel) => {
      const sel = d.selectEl;
      sel.empty();
      if (groupLabel) {
        const og = sel.createEl("optgroup");
        og.label = groupLabel;
        for (const c of cultures) og.createEl("option", { text: c.name, value: c.id });
      } else {
        for (const group of genGroups) {
          const og = sel.createEl("optgroup");
          og.label = `Gen ${group.gen}`;
          for (const c of group.cultures) {
            og.createEl("option", { text: c.name, value: c.id });
          }
        }
      }
    };
    new import_obsidian.Setting(parent).setName("Donor").setDesc("The language that lends vocabulary (primary / prestige side when type is prestige).").addDropdown((d) => {
      fillByGeneration(d, this.plugin.data.cultures);
      d.setValue(this.contactDonorId).onChange((v) => {
        this.contactDonorId = v;
        this.contactPreview = null;
        this.contactPendingEdge = null;
        this.render();
      });
    });
    new import_obsidian.Setting(parent).setName("Borrower").setDesc("Receives reshaped loanwords \u2014 only languages from the donor's generation.").addDropdown((d) => {
      if (peerCultures.length === 0) {
        d.addOption("", "(no other language in this generation)");
        d.setDisabled(true);
      } else {
        fillByGeneration(d, peerCultures, `Gen ${donorGen}`);
        d.setValue(this.contactBorrowerId).onChange((v) => {
          this.contactBorrowerId = v;
          this.contactPreview = null;
          this.contactPendingEdge = null;
        });
      }
    });
    if (peerCultures.length === 0) {
      parent.createEl("p", {
        text: "Pick a donor that shares its generation with at least one other language.",
        cls: "lf-hint"
      });
    }
    new import_obsidian.Setting(parent).setName("Contact type").addDropdown((d) => {
      for (const t of CONTACT_TYPES) d.addOption(t.value, t.label);
      d.setValue(this.contactType).onChange((v) => {
        this.contactType = v;
        this.contactPreview = null;
        this.contactPendingEdge = null;
      });
    });
    new import_obsidian.Setting(parent).setName("Strength").setDesc("How much of the donor's vocabulary crosses \u2014 how heavily one side impacts the other.").addDropdown((d) => {
      for (const s of CONTACT_STRENGTHS) d.addOption(String(s.value), s.label);
      d.setValue(String(this.contactStrength)).onChange((v) => {
        this.contactStrength = Number(v);
        this.contactPreview = null;
        this.contactPendingEdge = null;
      });
    });
    parent.createEl("p", { text: "Which kinds of words cross:", cls: "lf-hint" });
    for (const dom of CONTACT_DOMAINS) {
      new import_obsidian.Setting(parent).setName(dom).addToggle((t) => t.setValue(this.contactDomains.has(dom)).onChange((on) => {
        if (on) this.contactDomains.add(dom);
        else this.contactDomains.delete(dom);
        this.contactPreview = null;
        this.contactPendingEdge = null;
      }));
    }
    if (this.contactPreview) {
      const borrower = this.plugin.data.cultures.find((c) => c.id === this.contactBorrowerId);
      if (borrower) {
        parent.createEl("h3", { text: `Loanwords ${borrower.name} would gain` });
        const grid = parent.createDiv({ cls: "lf-specimens" });
        for (const s of this.contactPreview.samples) {
          const chip = grid.createDiv({ cls: "lf-specimen" });
          chip.createDiv({ text: s.name, cls: "lf-specimen-name" });
          chip.createDiv({ text: s.pronunciation, cls: "lf-specimen-pron" });
        }
        parent.createEl("p", {
          text: `Words: ${this.contactPreview.loanedRoots.map((r) => `${r.form} = ${r.meaning}`).join("  \xB7  ") || "(none survived the borrower's phonotactics)"}`,
          cls: "lf-hint"
        });
      }
    }
    buttons.addButton((b) => {
      b.setButtonText("Preview").setCta().onClick(() => {
        const donorCulture = this.plugin.data.cultures.find((c) => c.id === this.contactDonorId);
        const borrowerCulture = this.plugin.data.cultures.find((c) => c.id === this.contactBorrowerId);
        if (!donorCulture || !borrowerCulture) {
          new import_obsidian.Notice("Pick a donor and a borrower first.");
          return;
        }
        if (donorCulture.id === borrowerCulture.id) {
          new import_obsidian.Notice("Donor and borrower must be different languages.");
          return;
        }
        const edge = {
          id: `${donorCulture.id}->${borrowerCulture.id}::${Date.now().toString(36)}`,
          donorId: donorCulture.id,
          borrowerId: borrowerCulture.id,
          contactType: this.contactType,
          strength: this.contactStrength,
          domains: [...this.contactDomains]
        };
        this.contactPreview = previewContactEdge(donorCulture, borrowerCulture, edge);
        this.contactPendingEdge = edge;
        this.render();
      });
      if (peerCultures.length === 0) b.setDisabled(true);
    });
    if (this.contactPreview) {
      buttons.addButton((b) => b.setButtonText("Save contact edge").onClick(async () => {
        const edge = this.contactPendingEdge;
        if (!edge) return;
        this.plugin.data.contactEdges.push(edge);
        await this.plugin.persist();
        new import_obsidian.Notice("Contact edge saved.");
      }));
      buttons.addButton((b) => b.setButtonText("Add loanwords").onClick(async () => {
        const borrower = this.plugin.data.cultures.find((c) => c.id === this.contactBorrowerId);
        if (!borrower || !this.contactPreview) return;
        if (this.contactPreview.loanedRoots.length === 0) {
          new import_obsidian.Notice("Nothing to add.");
          return;
        }
        acceptLoanedRoots(borrower, this.contactPreview.loanedRoots);
        this.plugin.upsertCulture(borrower);
        await this.plugin.persist();
        await this.plugin.writeCultureNote(borrower);
        new import_obsidian.Notice(`${this.contactPreview.loanedRoots.length} loanword(s) added to ${borrower.name}.`);
      }));
    }
  }
  async renderEditTab(parent) {
    var _a, _b;
    if (this.plugin.data.cultures.length === 0) {
      parent.createEl("p", {
        text: "No languages yet. Create one on the New or Seeded tab.",
        cls: "lf-hint"
      });
      return;
    }
    parent.createEl("p", { text: "Loading\u2026", cls: "lf-hint lf-edit-loading" });
    for (const c of this.plugin.data.cultures) {
      if (!this.editDescriptions.has(c.id)) {
        this.editDescriptions.set(c.id, await this.plugin.readCultureDescription(c));
      }
    }
    if (this.tab !== "edit") return;
    parent.empty();
    this.editGen = resolveGenTab(this.editGen, this.plugin.data.cultures, "oldest");
    const { pane, cultures } = mountGenSubTabs(
      parent,
      this.plugin.data.cultures,
      this.editGen,
      (gen) => {
        this.editGen = gen;
        this.render();
      },
      "asc"
    );
    if (cultures.length === 0) {
      pane.createEl("p", { text: "No languages in this generation.", cls: "lf-hint" });
      return;
    }
    for (const c of cultures) {
      const block = pane.createDiv({ cls: "lf-gen-row" });
      block.createEl("h3", { text: c.name, cls: "lf-gen-name" });
      block.createEl("p", {
        text: ((_a = c.summary) == null ? void 0 : _a.trim()) || "\u2014",
        cls: "lf-gen-summary"
      });
      const desc = (_b = this.editDescriptions.get(c.id)) == null ? void 0 : _b.trim();
      block.createEl("p", {
        text: desc || "No description yet \u2014 add one under ## Description on the language page.",
        cls: "lf-gen-notes"
      });
      const row = block.createDiv({ cls: "lf-gen-actions" });
      const classBtn = row.createEl("button", { text: "Classes" });
      classBtn.onclick = () => {
        this.close();
        new NameClassesModal(this.app, this.plugin, c).open();
      };
      const renameBtn = row.createEl("button", { text: "Rename" });
      renameBtn.onclick = () => {
        new RenameCultureModal(this.app, this.plugin, c, async (name, translated) => {
          await this.plugin.renameCultureAndNote(c, name, translated);
          this.editDescriptions.delete(c.id);
          this.render();
        }).open();
      };
      row.createDiv({ cls: "lf-gen-spacer" });
      const hasPage = this.plugin.hasCulturePage(c);
      const pageBtn = row.createEl("button", { text: hasPage ? "Page exists" : "Create page" });
      if (hasPage) {
        pageBtn.disabled = true;
        pageBtn.setAttr("title", "A language page already exists for this culture.");
      } else {
        pageBtn.onclick = async () => {
          await this.plugin.openCulturePage(c);
          this.editDescriptions.set(c.id, await this.plugin.readCultureDescription(c));
          this.render();
        };
      }
    }
  }
  onClose() {
    this.contentEl.empty();
  }
};
var SeedWizardModal = CreateLanguageModal;
var CultureCardModal = class extends import_obsidian.Modal {
  constructor(app, plugin, culture, isNew, opts) {
    super(app);
    this.plugin = plugin;
    this.culture = culture;
    this.isNew = isNew;
    this.hostModal = opts == null ? void 0 : opts.hostModal;
    this.onDismiss = opts == null ? void 0 : opts.onDismiss;
  }
  render() {
    var _a, _b;
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("languageforge-modal");
    const card = makeCultureCard(this.culture);
    const titleRow = contentEl.createDiv({ cls: "lf-card-title-row" });
    titleRow.createEl("h2", { text: this.culture.name });
    if ((_a = this.culture.translatedName) == null ? void 0 : _a.trim()) {
      contentEl.createEl("p", {
        text: this.culture.translatedName.trim(),
        cls: "lf-translated-name"
      });
    }
    contentEl.createEl("p", { text: card.summary, cls: "lf-onebreath" });
    if ((_b = this.culture.fromNames) == null ? void 0 : _b.length) {
      contentEl.createEl("p", {
        text: `Seeded from: ${this.culture.fromNames.join(", ")}`,
        cls: "lf-hint"
      });
    }
    const grid = contentEl.createDiv({ cls: "lf-specimens lf-specimens-card" });
    const main = grid.createDiv({ cls: "lf-specimens-main" });
    for (const s of card.samples.slice(0, 4)) {
      const chip = main.createDiv({ cls: "lf-specimen" });
      chip.createDiv({ text: s.name, cls: "lf-specimen-name" });
      chip.createDiv({ text: s.pronunciation, cls: "lf-specimen-pron" });
      if (s.gloss) chip.createDiv({ text: s.gloss, cls: "lf-chip-gloss" });
      chip.createDiv({ text: s.category, cls: "lf-specimen-cat" });
    }
    const side = grid.createDiv({ cls: "lf-specimens-side" + (this.isNew ? " is-new" : "") });
    const themes = side.createDiv({ cls: "lf-specimen lf-specimen-themes" });
    themes.createDiv({ text: "Word Themes", cls: "lf-themes-heading" });
    const themeList = card.packs.length ? card.packs.map((p) => p[0].toUpperCase() + p.slice(1)).join(" \xB7 ") : "Core only";
    themes.createDiv({ text: themeList, cls: "lf-themes-body" });
    if (!this.isNew) {
      const hasPage = this.plugin.hasCulturePage(this.culture);
      const pageCard = side.createDiv({
        cls: "lf-specimen lf-specimen-page",
        attr: { role: "button", tabindex: "0", title: hasPage ? "Open language page" : "Create language page" }
      });
      pageCard.createDiv({
        text: hasPage ? "Page" : "Create page",
        cls: "lf-page-card-label"
      });
      const openPage = async () => {
        if (hasPage) {
          const host = this.hostModal;
          this.onDismiss = void 0;
          this.close();
          host == null ? void 0 : host.close();
          await this.plugin.openCulturePage(this.culture);
        } else {
          await this.plugin.openCulturePage(this.culture);
          this.render();
        }
      };
      pageCard.onclick = () => {
        void openPage();
      };
      pageCard.onkeydown = (ev) => {
        if (ev.key === "Enter" || ev.key === " ") {
          ev.preventDefault();
          void openPage();
        }
      };
    }
    if (card.glossaryPreview.length > 0) {
      const gl = contentEl.createDiv({ cls: "lf-glossary" });
      gl.createEl("span", { text: "Words: ", cls: "lf-hint" });
      gl.createEl("span", {
        text: card.glossaryPreview.map((g) => `${g.form} = ${g.meaning}`).join("  \xB7  "),
        cls: "lf-glossary-items"
      });
    }
    if (this.isNew) {
      const actions = contentEl.createDiv({ cls: "lf-card-actions" });
      const addBtn = (label, onClick, cta = false) => {
        const btn = actions.createEl("button", { text: label });
        if (cta) btn.addClass("mod-cta");
        btn.onclick = () => {
          void onClick();
        };
        return btn;
      };
      addBtn("Cancel", () => {
        this.close();
        new import_obsidian.Notice("Culture discarded \u2014 nothing was saved.");
      });
      addBtn("Accept culture", async () => {
        this.plugin.upsertCulture(this.culture);
        await this.plugin.persist();
        this.close();
        new import_obsidian.Notice(`${this.culture.name} saved.`);
        new CreatePagePromptModal(this.app, this.plugin, this.culture).open();
      }, true);
    }
  }
  onOpen() {
    var _a, _b;
    if (((_a = this.hostModal) == null ? void 0 : _a.containerEl.hasClass("lf-stacked-modal-container")) || ((_b = this.hostModal) == null ? void 0 : _b.containerEl.hasClass("lf-stacked-modal-nested"))) {
      this.containerEl.addClass("lf-stacked-modal-nested");
    } else {
      this.containerEl.addClass("lf-stacked-modal-container");
    }
    this.render();
  }
  onClose() {
    var _a;
    this.contentEl.empty();
    (_a = this.onDismiss) == null ? void 0 : _a.call(this);
  }
};
var CreatePagePromptModal = class extends import_obsidian.Modal {
  constructor(app, plugin, culture) {
    super(app);
    this.plugin = plugin;
    this.culture = culture;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.addClass("languageforge-modal");
    contentEl.createEl("h2", { text: "Create a language page?" });
    contentEl.createEl("p", {
      text: `Save ${this.culture.name} as a note in your vault (with a linked glossary). You can always create it later from Edit languages or Generate.`,
      cls: "lf-hint"
    });
    const buttons = new import_obsidian.Setting(contentEl);
    buttons.addButton((b) => b.setButtonText("Not now").onClick(() => this.close()));
    buttons.addButton((b) => b.setButtonText("Create language page").setCta().onClick(async () => {
      this.close();
      await this.plugin.openCulturePage(this.culture);
    }));
  }
  onClose() {
    this.contentEl.empty();
  }
};
var RenameCultureModal = class extends import_obsidian.Modal {
  constructor(app, plugin, culture, onDone) {
    var _a;
    super(app);
    this.translated = "";
    this.nameInput = null;
    this.translatedInput = null;
    this.plugin = plugin;
    this.culture = culture;
    this.onDone = onDone;
    this.value = culture.name;
    this.translated = (_a = culture.translatedName) != null ? _a : "";
  }
  setName(name) {
    this.value = name;
    if (this.nameInput) this.nameInput.value = name;
  }
  setTranslated(text) {
    this.translated = text;
    if (this.translatedInput) this.translatedInput.value = text;
  }
  pickDisplayForm(form) {
    const t = form.trim();
    if (!t) return t;
    return t[0].toUpperCase() + t.slice(1);
  }
  onOpen() {
    elevateStackedModal(this);
    this.modalEl.addClass("lf-rename-modal");
    const { contentEl } = this;
    contentEl.addClass("languageforge-modal");
    contentEl.addClass("lf-rename-body");
    const columns = contentEl.createDiv({ cls: "lf-rename-columns" });
    const left = columns.createDiv({ cls: "lf-rename-left" });
    const right = columns.createDiv({ cls: "lf-rename-right" });
    const nameBox = left.createEl("input", {
      cls: "lf-rename-name-input",
      type: "text",
      value: this.value,
      attr: { placeholder: "Language name" }
    });
    this.nameInput = nameBox;
    nameBox.addEventListener("input", () => {
      this.value = nameBox.value;
    });
    nameBox.focus();
    left.createEl("h3", { text: "Name", cls: "lf-rename-field-label" });
    new import_obsidian.Setting(left).setName("Translated name").setDesc("Optional English meaning of this culture's name.").addText((t) => {
      this.translatedInput = t.inputEl;
      t.setPlaceholder("e.g. People of the river").setValue(this.translated).onChange((v) => this.translated = v);
    });
    new import_obsidian.Setting(left).addButton((b) => b.setButtonText("Random word").onClick(() => {
      var _a, _b, _c;
      const roots2 = this.culture.roots;
      let name = "";
      if (roots2.length > 0) {
        const r = roots2[Math.floor(Math.random() * roots2.length)];
        name = this.pickDisplayForm(r.form);
        if (r.meaning) this.setTranslated(r.meaning);
      }
      if (!name) {
        const batch = generateBatch(this.culture, "personal", 1);
        name = (_b = (_a = batch[0]) == null ? void 0 : _a.name) != null ? _b : placeholderName(this.culture);
        if ((_c = batch[0]) == null ? void 0 : _c.gloss) this.setTranslated(batch[0].gloss);
      }
      this.setName(name);
    }));
    const buttons = new import_obsidian.Setting(left);
    buttons.addButton((b) => b.setButtonText("Cancel").onClick(() => this.close()));
    buttons.addButton((b) => b.setButtonText("Rename").setCta().onClick(async () => {
      const name = this.value.trim();
      if (!name) {
        new import_obsidian.Notice("Name can't be empty.");
        return;
      }
      if (this.plugin.data.cultures.some((c) => c.id !== this.culture.id && c.name.toLowerCase() === name.toLowerCase())) {
        new import_obsidian.Notice("A culture with that name already exists.");
        return;
      }
      this.close();
      await this.onDone(name, this.translated.trim());
    }));
    const scroll = right.createDiv({ cls: "lf-rename-glossary-scroll" });
    const roots = this.culture.roots.slice().sort((a, b) => b.weight - a.weight || a.form.localeCompare(b.form));
    if (roots.length === 0) {
      scroll.createEl("p", { text: "No glossary words yet.", cls: "lf-hint" });
    } else {
      for (const r of roots) {
        const row = scroll.createDiv({ cls: "lf-rename-glossary-row" });
        row.createSpan({ text: r.form, cls: "lf-rename-glossary-form" });
        row.createSpan({ text: r.meaning, cls: "lf-rename-glossary-meaning" });
      }
    }
  }
  onClose() {
    this.nameInput = null;
    this.translatedInput = null;
    this.contentEl.empty();
  }
};
var NameClassesModal = class extends import_obsidian.Modal {
  constructor(app, plugin, culture) {
    super(app);
    this.newLabel = "";
    this.newLean = "soft";
    this.plugin = plugin;
    this.culture = culture;
    ensureCultureClasses(this.culture);
  }
  async save() {
    this.plugin.upsertCulture(this.culture);
    await this.plugin.persist();
    await this.plugin.writeCultureNote(this.culture);
  }
  render() {
    var _a;
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("languageforge-modal");
    contentEl.createEl("h2", { text: `Name classes \u2014 ${this.culture.name}` });
    contentEl.createEl("p", {
      text: "Each class is an ending signature. Gender ships by default; add warriors, leaders, and the rest yourself.",
      cls: "lf-hint"
    });
    new import_obsidian.Setting(contentEl).setName("Gender marking").setDesc("Off hides feminine/masculine; neutral and custom classes remain.").addToggle((t) => t.setValue(this.culture.gendered !== false).onChange(async (v) => {
      this.culture.gendered = v;
      await this.save();
      this.render();
    }));
    new import_obsidian.Setting(contentEl).setName("Default generation").setDesc("How unmarked names are built. Classes can override.").addDropdown((d) => {
      var _a2;
      d.addOption("mixed", "Mixed (mostly meaning)");
      d.addOption("meaning", "Always meaning");
      d.addOption("sound", "Always sound");
      d.setValue((_a2 = this.culture.defaultGeneration) != null ? _a2 : "mixed").onChange(async (v) => {
        this.culture.defaultGeneration = v;
        await this.save();
      });
    });
    for (const cls of (_a = this.culture.classes) != null ? _a : []) {
      if (this.culture.gendered === false && cls.kind === "gender" && (cls.id === "feminine" || cls.id === "masculine")) {
        continue;
      }
      const box = contentEl.createDiv({ cls: "lf-class-card" });
      box.createEl("h3", { text: `${cls.label} (${cls.kind})` });
      const ends = resolveClassEndings(this.culture, cls).join(", ");
      box.createEl("p", { text: `Endings: ${ends}`, cls: "lf-hint" });
      const samples = classSpecimens(this.culture, cls.id, 2);
      if (samples.length) box.createEl("p", { text: `Samples: ${samples.join(", ")}`, cls: "lf-hint" });
      new import_obsidian.Setting(box).setName("Ending source").addDropdown((d) => {
        d.addOption("generate", "Generated");
        d.addOption("inherit", "Inherit from\u2026");
        d.addOption("manual", "Manual");
        d.setValue(cls.endingSource).onChange(async (v) => {
          var _a2;
          editClass(this.culture, cls.id, { endingSource: v });
          if (v === "generate" && !((_a2 = cls.endings) == null ? void 0 : _a2.length)) {
            regenerateClassEndings(this.culture, cls.id, cls.id === "masculine" ? "hard" : "soft");
          }
          await this.save();
          this.render();
        });
      });
      if (cls.endingSource === "inherit") {
        new import_obsidian.Setting(box).setName("Inherit from").addDropdown((d) => {
          var _a2, _b;
          d.addOption("", "\u2014");
          for (const other of (_a2 = this.culture.classes) != null ? _a2 : []) {
            if (other.id !== cls.id) d.addOption(other.id, other.label);
          }
          d.setValue((_b = cls.inheritFrom) != null ? _b : "").onChange(async (v) => {
            editClass(this.culture, cls.id, { inheritFrom: v || void 0 });
            await this.save();
            this.render();
          });
        });
      }
      if (cls.endingSource === "manual") {
        new import_obsidian.Setting(box).setName("Endings").setDesc("Comma-separated, with leading hyphens (e.g. -lia, -mira).").addText((t) => {
          var _a2;
          return t.setValue(((_a2 = cls.endings) != null ? _a2 : []).join(", ")).onChange(async (v) => {
            const endings = v.split(",").map((s) => s.trim()).filter(Boolean).map((e) => e.startsWith("-") ? e : `-${e}`);
            editClass(this.culture, cls.id, { endings });
            await this.save();
          });
        });
      }
      new import_obsidian.Setting(box).setName("Generation").setDesc("Meaning-bearing names let root policy steer concepts.").addDropdown((d) => {
        var _a2;
        d.addOption("", "Inherit culture default");
        d.addOption("sound", "Sound");
        d.addOption("meaning", "Meaning");
        d.addOption("mixed", "Mixed");
        d.setValue((_a2 = cls.generation) != null ? _a2 : "").onChange(async (v) => {
          editClass(this.culture, cls.id, {
            generation: v || void 0
          });
          await this.save();
        });
      });
      new import_obsidian.Setting(box).setName("Root policy mode").addDropdown((d) => {
        var _a2, _b;
        d.addOption("", "None");
        d.addOption("favour", "Favour");
        d.addOption("lock", "Lock");
        d.setValue((_b = (_a2 = cls.rootPolicy) == null ? void 0 : _a2.mode) != null ? _b : "").onChange(async (v) => {
          var _a3, _b2, _c;
          if (!v) {
            editClass(this.culture, cls.id, { rootPolicy: void 0 });
          } else {
            editClass(this.culture, cls.id, {
              rootPolicy: {
                mode: v,
                include: ((_b2 = (_a3 = cls.rootPolicy) == null ? void 0 : _a3.include) == null ? void 0 : _b2.length) ? cls.rootPolicy.include : ["virtue"],
                exclude: (_c = cls.rootPolicy) == null ? void 0 : _c.exclude
              }
            });
          }
          await this.save();
          this.render();
        });
      });
      if (cls.rootPolicy) {
        new import_obsidian.Setting(box).setName("Include").setDesc("Packs, tags, or concepts \u2014 comma-separated.").addText((t) => t.setValue(cls.rootPolicy.include.join(", ")).onChange(async (v) => {
          const include = v.split(",").map((s) => s.trim()).filter(Boolean);
          editClass(this.culture, cls.id, {
            rootPolicy: { ...cls.rootPolicy, include: include.length ? include : ["virtue"] }
          });
          await this.save();
        }));
        new import_obsidian.Setting(box).setName("Exclude").addText((t) => {
          var _a2;
          return t.setValue(((_a2 = cls.rootPolicy.exclude) != null ? _a2 : []).join(", ")).onChange(async (v) => {
            const exclude = v.split(",").map((s) => s.trim()).filter(Boolean);
            editClass(this.culture, cls.id, {
              rootPolicy: { ...cls.rootPolicy, exclude: exclude.length ? exclude : void 0 }
            });
            await this.save();
          });
        });
      }
      const row = new import_obsidian.Setting(box);
      row.addButton((b) => b.setButtonText("Reroll endings").onClick(async () => {
        const lean = cls.id === "masculine" ? "hard" : cls.id === "feminine" ? "soft" : "soft";
        regenerateClassEndings(this.culture, cls.id, lean);
        await this.save();
        this.render();
      }));
      if (cls.kind === "class" || cls.kind === "gender" && cls.id !== "neutral") {
        if (cls.kind === "class") {
          row.addButton((b) => b.setButtonText("Remove").setWarning().onClick(async () => {
            removeClass(this.culture, cls.id);
            await this.save();
            this.render();
          }));
        }
      }
    }
    contentEl.createEl("h3", { text: "Add a class" });
    new import_obsidian.Setting(contentEl).setName("Label").addText((t) => t.setPlaceholder("warriors").onChange((v) => this.newLabel = v));
    new import_obsidian.Setting(contentEl).setName("Lean").addDropdown((d) => {
      for (const lean of ["soft", "hard", "long", "short", "exotic"]) {
        d.addOption(lean, lean[0].toUpperCase() + lean.slice(1));
      }
      d.setValue(this.newLean).onChange((v) => this.newLean = v);
    });
    new import_obsidian.Setting(contentEl).addButton((b) => b.setButtonText("Add class").setCta().onClick(async () => {
      if (!this.newLabel.trim()) {
        new import_obsidian.Notice("Give the class a name.");
        return;
      }
      addClass(this.culture, this.newLabel.trim(), this.newLean);
      this.newLabel = "";
      await this.save();
      this.render();
    })).addButton((b) => b.setButtonText("Close").onClick(() => this.close()));
  }
  onOpen() {
    this.render();
  }
  onClose() {
    this.contentEl.empty();
  }
};
var ImportNamesModal = class extends import_obsidian.Modal {
  constructor(app, plugin, culture) {
    super(app);
    this.pasted = "";
    this.plugin = plugin;
    this.culture = culture;
  }
  renderPreview(host) {
    host.empty();
    const { candidates, rejected } = parseImportInput(this.pasted);
    if (!this.pasted.trim()) {
      host.createEl("p", { text: "Nothing pasted yet.", cls: "lf-hint" });
      return;
    }
    host.createEl("p", {
      text: `Will import ${candidates.length} name${candidates.length === 1 ? "" : "s"}` + (rejected.length ? `; skip ${rejected.length} non-romanised` : "") + ".",
      cls: "lf-hint"
    });
    if (candidates.length) {
      host.createEl("p", { text: candidates.join(", "), cls: "lf-glossary-items" });
    }
    if (rejected.length) {
      host.createEl("p", {
        text: `Skipped (need Latin letters): ${rejected.join(", ")}`,
        cls: "lf-hint"
      });
    }
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.addClass("languageforge-modal");
    contentEl.createEl("h2", { text: `Import into ${this.culture.name}` });
    contentEl.createEl("p", {
      text: "Paste romanised names (or prose containing them). Their sounds bend this language; the names themselves are reserved. Non-Latin script is skipped.",
      cls: "lf-hint"
    });
    new import_obsidian.Setting(contentEl).setName("Names or text").setDesc("Comma- or line-separated, or a short paragraph of romanised words.").addTextArea((t) => {
      t.setPlaceholder("Kaelith, Veyra, Kaeloth\n\u2014 or \u2014\nThe sisters were called Elowen and Maeriel.");
      t.inputEl.rows = 5;
      t.onChange((v) => {
        this.pasted = v;
        this.renderPreview(preview);
      });
    });
    const preview = contentEl.createDiv({ cls: "lf-import-preview" });
    this.renderPreview(preview);
    const buttons = new import_obsidian.Setting(contentEl);
    buttons.addButton((b) => b.setButtonText("Cancel").onClick(() => this.close()));
    buttons.addButton((b) => b.setButtonText("Bend the sounds").setCta().onClick(async () => {
      const previewParse = parseImportInput(this.pasted);
      if (previewParse.candidates.length === 0) {
        new import_obsidian.Notice(previewParse.rejected.length ? "Only non-romanised text found \u2014 use Latin letters (or romaji)." : "Paste at least one romanised name.");
        return;
      }
      const result = importNames(this.culture, this.pasted);
      this.plugin.upsertCulture(this.culture);
      await this.plugin.persist();
      await this.plugin.writeCultureNote(this.culture);
      this.close();
      const skip = result.rejected.length ? ` (skipped ${result.rejected.length})` : "";
      new import_obsidian.Notice(
        `Imported ${result.accepted.length} into ${this.culture.name}` + (result.segmented ? ` \u2014 ${result.segmented} shaped the phonology` : "") + skip + "."
      );
      await this.plugin.openCulturePage(this.culture);
    }));
  }
  onClose() {
    this.contentEl.empty();
  }
};
var AgeCultureModal = class extends import_obsidian.Modal {
  constructor(app, plugin, culture) {
    var _a;
    super(app);
    this.driftLevel = "sister";
    this.spellingMode = "phonetic";
    this.snapshot = null;
    this.plugin = plugin;
    this.culture = culture;
    this.packId = (_a = MOOD_DEFAULT_DRIFT_PACK[culture.mood]) != null ? _a : descentPackIds()[0];
  }
  render() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("languageforge-modal");
    contentEl.createEl("h2", { text: `Age ${this.culture.name} in place` });
    contentEl.createEl("p", {
      text: "A single language, aged: archaic and worn-modern forms shown side by side. This doesn't create a new language or touch the family tree.",
      cls: "lf-hint"
    });
    const packHint = contentEl.createEl("p", { cls: "lf-hint" });
    const updatePackHint = () => {
      const pack = DRIFT_PACKS[this.packId];
      packHint.setText(pack ? `${pack.plainDescription} ${pack.why}` : "");
    };
    new import_obsidian.Setting(contentEl).setName("Sound-change pack").addDropdown((d) => {
      var _a;
      for (const id of descentPackIds()) d.addOption(id, (_a = DRIFT_PACK_LABELS[id]) != null ? _a : id);
      d.setValue(this.packId).onChange((v) => {
        this.packId = v;
        updatePackHint();
      });
    });
    updatePackHint();
    new import_obsidian.Setting(contentEl).setName("Drift").setDesc("How far the modern form has worn from the archaic one.").addDropdown((d) => {
      for (const lvl of DRIFT_LEVELS) d.addOption(lvl.value, lvl.label);
      d.setValue(this.driftLevel).onChange((v) => this.driftLevel = v);
    });
    new import_obsidian.Setting(contentEl).setName("Spelling").setDesc("Etymological keeps blended-compound spellings visible; phonetic respells everything to the worn sound.").addDropdown((d) => {
      d.addOption("phonetic", "Phonetic (respell to the worn sound)");
      d.addOption("etymological", "Etymological (keep compound roots visible)");
      d.setValue(this.spellingMode).onChange((v) => this.spellingMode = v);
    });
    new import_obsidian.Setting(contentEl).addButton((b) => b.setButtonText("Preview").setCta().onClick(() => {
      this.snapshot = ageCulture(this.culture, this.packId, this.driftLevel, "personal", this.spellingMode);
      this.render();
    }));
    if (this.snapshot) {
      const cols = contentEl.createDiv({ cls: "lf-age-columns" });
      const renderColumn = (title, samples) => {
        const col = cols.createDiv({ cls: "lf-age-column" });
        col.createEl("h3", { text: title });
        const grid = col.createDiv({ cls: "lf-specimens" });
        for (const s of samples) {
          const chip = grid.createDiv({ cls: "lf-specimen" });
          chip.createDiv({ text: s.name, cls: "lf-specimen-name" });
          chip.createDiv({ text: s.pronunciation, cls: "lf-specimen-pron" });
        }
      };
      renderColumn("Archaic", this.snapshot.archaic.samples);
      renderColumn("Modern", this.snapshot.modern.samples);
    }
    new import_obsidian.Setting(contentEl).addButton((b) => b.setButtonText("Close").onClick(() => this.close()));
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
    this.modalEl.addClass("lf-languages-modal");
    this.modalEl.addClass("lf-family-tree-modal");
    this.render();
  }
  onClose() {
    this.contentEl.empty();
  }
  render() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("languageforge-modal");
    const titleRow = contentEl.createDiv({ cls: "lf-modal-title-row" });
    titleRow.createEl("h2", { text: "Languages", cls: "lf-modal-title" });
    const addBtn = titleRow.createEl("button", {
      cls: "lf-modal-title-action",
      attr: { type: "button", title: "Create language", "aria-label": "Create language" }
    });
    (0, import_obsidian.setIcon)(addBtn, "plus");
    addBtn.onclick = () => {
      const create = new CreateLanguageModal(this.app, this.plugin);
      const prevOpen = create.onOpen.bind(create);
      create.onOpen = () => {
        prevOpen();
        create.containerEl.addClass("lf-stacked-modal-container");
      };
      create.open();
    };
    const panes = contentEl.createDiv({ cls: "lf-tab-panes is-tree" });
    if (this.plugin.data.cultures.length === 0) {
      panes.createEl("p", {
        text: "No languages yet. Use + to create one.",
        cls: "lf-hint"
      });
      return;
    }
    renderFamilyTreeView(panes, this.plugin.data.cultures, (cultureId) => {
      const culture = this.plugin.data.cultures.find((c) => c.id === cultureId);
      if (!culture) return;
      this.plugin.openGenerate({ cultureId: culture.id });
    });
  }
};
function hubSelectorsFor(culture) {
  ensureCultureClasses(culture);
  const out = [];
  for (const cls of visibleClasses(culture)) {
    out.push({ id: `class:${cls.id}`, label: cls.label, sel: { kind: "class", classId: cls.id } });
  }
  out.push({ id: "cat:house", label: "houses", sel: { kind: "category", category: "house" } });
  out.push({ id: "cat:place", label: "places", sel: { kind: "category", category: "place", placeType: "settlement" } });
  out.push({ id: "cat:title", label: "titles", sel: { kind: "category", category: "title" } });
  return out;
}
function hubPackOptions(cultures) {
  const out = [];
  for (const c of cultures) {
    for (const o of hubSelectorsFor(c)) {
      out.push({
        key: `${c.id}::${o.id}`,
        cultureId: c.id,
        selectorId: o.id,
        label: `${c.name} - ${o.label}`,
        sel: o.sel
      });
    }
  }
  return out;
}
function runHubBatch(plugin, culture, sel, count) {
  var _a;
  ensureCultureClasses(culture);
  const n = count != null ? count : plugin.data.settings.batchSize;
  if (sel.kind === "class") {
    return generateBatch(culture, "personal", n, void 0, sel.classId);
  }
  if (sel.category === "place") {
    const src = resolvePlaceSourceCulture(culture, plugin.data.cultures, (_a = sel.placeType) != null ? _a : "settlement");
    return generateBatch(src, "place", n, void 0);
  }
  return generateBatch(culture, sel.category, n, void 0);
}
function formatGeneratedLine(g) {
  var _a;
  const gloss = (_a = g.gloss) == null ? void 0 : _a.trim();
  if (gloss) return `${g.name} (${g.pronunciation}) (${gloss})`;
  return `${g.name} (${g.pronunciation})`;
}
var HUB_BATCH_COUNTS = [10, 15, 25, 50, 100];
var GenerateModal = class extends import_obsidian.Modal {
  constructor(app, plugin, opts) {
    var _a, _b, _c, _d;
    super(app);
    this.activeGen = null;
    this.packKey = "";
    this.batchCount = 25;
    this.batch = [];
    this.resultsEl = null;
    this.clearResultsSelection = () => {
    };
    this.plugin = plugin;
    const cultures = plugin.data.cultures;
    const pre = (opts == null ? void 0 : opts.cultureId) ? cultures.find((c) => c.id === opts.cultureId) : void 0;
    this.activeGen = resolveGenTab(
      pre ? (_a = pre.generation) != null ? _a : 0 : null,
      cultures,
      "newest"
    );
    const packs = this.packsForActiveGen();
    if (opts == null ? void 0 : opts.cultureId) {
      const want = opts.selectorId ? `${opts.cultureId}::${opts.selectorId}` : (_b = packs.find((p) => p.cultureId === opts.cultureId)) == null ? void 0 : _b.key;
      if (want && packs.some((p) => p.key === want)) this.packKey = want;
    }
    if (!this.packKey) this.packKey = (_d = (_c = packs[0]) == null ? void 0 : _c.key) != null ? _d : "";
  }
  culturesForActiveGen() {
    var _a;
    this.activeGen = resolveGenTab(this.activeGen, this.plugin.data.cultures, "newest");
    const group = culturesByGeneration(this.plugin.data.cultures).find((g) => g.gen === this.activeGen);
    return (_a = group == null ? void 0 : group.cultures) != null ? _a : [];
  }
  packsForActiveGen() {
    return hubPackOptions(this.culturesForActiveGen());
  }
  currentPack() {
    var _a;
    return (_a = this.packsForActiveGen().find((p) => p.key === this.packKey)) != null ? _a : hubPackOptions(this.plugin.data.cultures).find((p) => p.key === this.packKey);
  }
  currentCulture() {
    const pack = this.currentPack();
    if (!pack) return void 0;
    return this.plugin.data.cultures.find((c) => c.id === pack.cultureId);
  }
  registryCulture() {
    var _a;
    const pack = this.currentPack();
    const culture = this.currentCulture();
    if (!pack || !culture) return void 0;
    if (pack.sel.kind === "category" && pack.sel.category === "place") {
      return resolvePlaceSourceCulture(
        culture,
        this.plugin.data.cultures,
        (_a = pack.sel.placeType) != null ? _a : "settlement"
      );
    }
    return culture;
  }
  onOpen() {
    this.modalEl.addClass("lf-generate-modal");
    this.containerEl.addClass("lf-stacked-modal-container");
    this.render();
  }
  onClose() {
    this.contentEl.empty();
  }
  render() {
    var _a, _b;
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("languageforge-modal");
    contentEl.addClass("lf-generate-body");
    if (this.plugin.data.cultures.length === 0) {
      contentEl.createEl("p", { text: "No languages yet.", cls: "lf-hint" });
      return;
    }
    this.activeGen = resolveGenTab(this.activeGen, this.plugin.data.cultures, "newest");
    const genGroups = culturesByGeneration(this.plugin.data.cultures);
    const packs = this.packsForActiveGen();
    if (!packs.some((p) => p.key === this.packKey)) this.packKey = (_b = (_a = packs[0]) == null ? void 0 : _a.key) != null ? _b : "";
    const options = contentEl.createDiv({ cls: "lf-generate-options" });
    const packRow = options.createDiv({ cls: "lf-generate-pack-row" });
    const genSelect = packRow.createEl("select", {
      cls: "dropdown lf-generate-gen-select",
      attr: { "aria-label": "Generation" }
    });
    for (const g of genGroups) {
      const opt = genSelect.createEl("option", { text: `Gen ${g.gen}`, value: String(g.gen) });
      if (g.gen === this.activeGen) opt.selected = true;
    }
    genSelect.onchange = () => {
      var _a2, _b2;
      this.activeGen = Number(genSelect.value);
      this.packKey = (_b2 = (_a2 = this.packsForActiveGen()[0]) == null ? void 0 : _a2.key) != null ? _b2 : "";
      this.batch = [];
      this.render();
    };
    const select = packRow.createEl("select", { cls: "dropdown lf-generate-pack-select" });
    if (packs.length === 0) {
      select.createEl("option", { text: "No languages in this generation", value: "" });
      select.disabled = true;
    } else {
      for (const p of packs) {
        const opt = select.createEl("option", { text: p.label, value: p.key });
        if (p.key === this.packKey) opt.selected = true;
      }
      select.onchange = () => {
        this.packKey = select.value;
        this.batch = [];
        this.renderResults(this.batch, "Generate names to see them here.");
      };
    }
    const infoBtn = packRow.createEl("button", {
      cls: "lf-generate-info-button",
      attr: {
        type: "button",
        title: "Language info",
        "aria-label": "Language info"
      }
    });
    (0, import_obsidian.setIcon)(infoBtn, "info");
    infoBtn.disabled = !this.currentCulture();
    infoBtn.onclick = () => {
      const culture = this.currentCulture();
      if (!culture) return;
      new CultureCardModal(this.app, this.plugin, culture, false, {
        hostModal: this
      }).open();
    };
    const quantity = options.createDiv({ cls: "lf-toggle-panel lf-quantity-toggle" });
    for (const n of HUB_BATCH_COUNTS) {
      const btn = quantity.createEl("button", {
        text: String(n),
        cls: "lf-toggle-button" + (n === this.batchCount ? " is-active" : ""),
        attr: { type: "button", "aria-pressed": n === this.batchCount ? "true" : "false" }
      });
      btn.onclick = () => {
        this.batchCount = n;
        quantity.querySelectorAll(".lf-toggle-button").forEach((el) => {
          const b = el;
          const active = b.textContent === String(n);
          b.toggleClass("is-active", active);
          b.setAttribute("aria-pressed", active ? "true" : "false");
        });
      };
    }
    const genBtn = options.createEl("button", {
      text: "Generate",
      cls: "lf-generate-button",
      attr: { type: "button" }
    });
    genBtn.disabled = packs.length === 0;
    genBtn.onclick = () => this.runGenerate();
    this.resultsEl = contentEl.createDiv({ cls: "lf-generate-results" });
    this.renderResults(
      this.batch,
      this.batch.length === 0 ? "Generate names to see them here." : void 0
    );
  }
  runGenerate() {
    const pack = this.currentPack();
    const culture = this.currentCulture();
    if (!pack || !culture) {
      new import_obsidian.Notice("Select a culture and pack first.");
      return;
    }
    this.batch = runHubBatch(this.plugin, culture, pack.sel, this.batchCount);
    this.renderResults(
      this.batch,
      this.batch.length === 0 ? "Nothing passed the gates \u2014 try another pack." : void 0
    );
  }
  renderResults(names, placeholderMessage) {
    if (!this.resultsEl) return;
    this.resultsEl.empty();
    const list = this.resultsEl.createEl("ul", { cls: "lf-results-list" });
    const actions = this.resultsEl.createDiv({ cls: "lf-results-actions" });
    const buttons = actions.createDiv({ cls: "lf-results-buttons" });
    const insertBtn = buttons.createEl("button", {
      text: "Insert",
      cls: "lf-text-button",
      attr: { type: "button", title: "Insert selected name" }
    });
    const checklistBtn = buttons.createEl("button", {
      text: "Checklist",
      cls: "lf-text-button",
      attr: { type: "button", title: "Insert checklist" }
    });
    const listBtn = buttons.createEl("button", {
      text: "List",
      cls: "lf-text-button",
      attr: { type: "button", title: "Insert bullet list" }
    });
    const selectedNames = () => {
      const out = [];
      list.querySelectorAll("li.is-selected").forEach((el) => {
        const i = Number(el.dataset.index);
        if (Number.isFinite(i) && names[i]) out.push(names[i]);
      });
      return out;
    };
    const updateButtons = () => {
      const selected = selectedNames();
      insertBtn.disabled = selected.length !== 1;
      checklistBtn.disabled = selected.length === 0;
      listBtn.disabled = selected.length === 0;
    };
    this.clearResultsSelection = () => {
      list.querySelectorAll("li.is-selected").forEach((el) => el.removeClass("is-selected"));
      updateButtons();
    };
    if (placeholderMessage) {
      list.createEl("li", { text: placeholderMessage, cls: "lf-results-placeholder" });
    } else {
      names.forEach((g, i) => {
        const item = list.createEl("li", { text: formatGeneratedLine(g) });
        item.dataset.index = String(i);
        item.onclick = () => {
          item.toggleClass("is-selected", !item.hasClass("is-selected"));
          updateButtons();
        };
      });
    }
    insertBtn.onclick = async () => {
      var _a, _b, _c;
      const [g] = selectedNames();
      if (!g) return;
      const editor = (_c = (_a = this.app.workspace.activeEditor) == null ? void 0 : _a.editor) != null ? _c : (_b = this.app.workspace.getActiveViewOfType(import_obsidian.MarkdownView)) == null ? void 0 : _b.editor;
      if (!editor) {
        new import_obsidian.Notice("Open a note to insert into.");
        return;
      }
      editor.replaceSelection(g.name);
      editor.focus();
      await this.reserveNames([g]);
      this.close();
    };
    checklistBtn.onclick = async () => {
      const selected = selectedNames();
      if (selected.length === 0) return;
      if (!this.insertNamesAsList(selected.map((g) => g.name), "checklist")) return;
      await this.reserveNames(selected);
      this.clearResultsSelection();
    };
    listBtn.onclick = async () => {
      const selected = selectedNames();
      if (selected.length === 0) return;
      if (!this.insertNamesAsList(selected.map((g) => g.name), "bullet")) return;
      await this.reserveNames(selected);
      this.clearResultsSelection();
    };
    updateButtons();
  }
  async reserveNames(names) {
    const target = this.registryCulture();
    if (!target) return;
    let changed = false;
    for (const g of names) {
      const key = g.name.toLowerCase();
      if (!target.registry.includes(key)) {
        target.registry.push(key);
        changed = true;
      }
    }
    if (changed) await this.plugin.persist();
  }
  insertNamesAsList(names, listType) {
    var _a, _b, _c, _d, _e;
    if (names.length === 0) return false;
    const editor = (_c = (_a = this.app.workspace.activeEditor) == null ? void 0 : _a.editor) != null ? _c : (_b = this.app.workspace.getActiveViewOfType(import_obsidian.MarkdownView)) == null ? void 0 : _b.editor;
    if (!editor) {
      new import_obsidian.Notice("Open a note to insert into.");
      return false;
    }
    const marker = listType === "checklist" ? "- [ ] " : "- ";
    const emptyMarkerPattern = listType === "checklist" ? /^(\s*)[-*+]\s\[ \]\s$/ : /^(\s*)[-*+]\s$/;
    const cursor = editor.getCursor();
    const lineText = editor.getLine(cursor.line);
    let from = cursor;
    let insertion;
    if (/^\s*$/.test(lineText)) {
      insertion = names.map((name) => `${marker}${name}`).join("\n");
    } else if (cursor.ch === lineText.length && emptyMarkerPattern.test(lineText)) {
      const indent = (_e = (_d = lineText.match(emptyMarkerPattern)) == null ? void 0 : _d[1]) != null ? _e : "";
      const [first, ...rest] = names;
      insertion = first + rest.map((name) => `
${indent}${marker}${name}`).join("");
    } else {
      from = { line: cursor.line, ch: lineText.length };
      insertion = "\n" + names.map((name) => `${marker}${name}`).join("\n");
    }
    editor.replaceRange(insertion, from);
    editor.focus();
    return true;
  }
};
var PickCultureModal = class extends import_obsidian.Modal {
  constructor(app, plugin, onPick, buttonText = "Save card") {
    super(app);
    this.plugin = plugin;
    this.onPick = onPick;
    this.buttonText = buttonText;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.addClass("languageforge-modal");
    contentEl.createEl("h2", { text: "Which culture?" });
    for (const c of this.plugin.data.cultures) {
      new import_obsidian.Setting(contentEl).setName(c.name).setDesc(c.summary).addButton((b) => b.setButtonText(this.buttonText).onClick(() => {
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
      new import_obsidian.Setting(containerEl).setName("Branch or contact").setDesc("Derive a descendant, or connect two languages via directed contact (donor \u2192 borrower).").addButton((b) => b.setButtonText("Open Child tab\u2026").onClick(() => {
        new CreateLanguageModal(this.app, this.plugin, "child").open();
      }));
      new import_obsidian.Setting(containerEl).setName("Family tree").setDesc("Browse every language's ancestors and descendants.").addButton((b) => b.setButtonText("View family tree\u2026").onClick(() => {
        new FamilyTreeModal(this.app, this.plugin).open();
      }));
    }
    new import_obsidian.Setting(containerEl).setName("Folder for language pages").setDesc("Language notes are saved as LanguageForge/Name.md under this folder (default LanguageForge).").addText((t) => t.setValue(this.plugin.data.settings.folder).onChange(async (v) => {
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
