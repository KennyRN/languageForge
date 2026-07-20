import { seedCulture, reverseSeedCulture, generateBatch, reinforce, makeCultureCard, pronounce, cultureNote, weightLabel } from "./src/engine";

// 1. Seed a pack-path culture, deterministic seed
const c = seedCulture({ name: "Velari", mood: "soft", register: "balanced", familiarity: "familiar", environment: "coastal", packs: ["arcane"], seed: "velari-test" });
console.log("CARD:", c.summary);
console.log("endings subset:", c.elements.end.join(" "));

// 2. Stable minting: same seed -> same forms; uniqueness respected
const c2 = seedCulture({ name: "Velari", mood: "soft", register: "balanced", familiarity: "familiar", environment: "coastal", packs: ["arcane"], seed: "velari-test" });
const stable = c.roots.every((r, i) => r.form === c2.roots[i].form && r.meaning === c2.roots[i].meaning);
console.log("MINT STABLE ACROSS SESSIONS:", stable, "| roots:", c.roots.length);
const forms = c.roots.map(r => r.form);
console.log("MINT UNIQUE:", new Set(forms).size === forms.length);
console.log("sample mints:", c.roots.slice(0, 5).map(r => `${r.form}=${r.meaning}(${weightLabel(r.weight)})`).join(", "));
const sea = c.roots.find(r => r.meaning === "star"); // in core AND arcane -> weight 2
console.log("CAPPED WEIGHT (star in core+arcane):", sea && weightLabel(sea.weight));

// 3. Batches by category + pronunciation
for (const cat of ["personal", "house", "place"] as const) {
  const b = generateBatch(c, cat, 5);
  console.log(cat + ":", b.map(g => `${g.name} [${g.pronunciation}]`).join("  "));
}

// 4. Semantic mode with gloss
const sem = generateBatch(c, "place", 4, "meaning");
console.log("meaning-mode:", sem.map(g => `${g.name} (${g.gloss})`).join("  "));

// 5. Pin-and-regenerate: star two names, reinforce, check endings tightened
const batch = generateBatch(c, "personal", 8);
const starred = batch.slice(0, 2);
console.log("starred:", starred.map(s => s.name).join(", "));
reinforce(c, starred);
console.log("after reinforce, endings:", c.elements.end.join(" "));
console.log("more-like-these:", generateBatch(c, "personal", 6).map(g => g.name).join("  "));

// 6. Reverse-seed from pasted names
const rc = reverseSeedCulture("Kaelthi", ["Kaelith", "Veyra", "Kaeloth"]);
console.log("REVERSE mood detected:", rc.mood);
console.log("REVERSE card:", rc.summary);
console.log("REVERSE kin:", generateBatch(rc, "personal", 8).map(g => `${g.name}`).join("  "));
console.log("their names in registry (collision-protected):", rc.registry.join(", "));

// 7. Alien procedural path feeds same assembler
const alien = seedCulture({ name: "Xhorvenai", mood: "exotic", register: "ancient", familiarity: "alien", environment: "desert", packs: [], seed: "alien-test" });
console.log("ALIEN card:", alien.summary);
console.log("ALIEN names:", generateBatch(alien, "personal", 5).map(g => `${g.name} [${g.pronunciation}]`).join("  "));

// 8. Culture card + note render
const card = makeCultureCard(c);
console.log("card samples:", card.samples.map(s => `${s.name}/${s.category}`).join(", "));
console.log("note preview:\n" + cultureNote(c).split("\n").slice(0, 14).join("\n"));

// 9. pronounce spot checks
for (const n of ["Vaelen", "Ithasel", "Kordrak", "Ordamor"]) console.log(n, "->", pronounce(n, "initial"), "/", pronounce(n, "penult"));
