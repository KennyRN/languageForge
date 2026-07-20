// Simulates the complete user journey the modals drive.
import { seedCulture, reverseSeedCulture, generateBatch, reinforce, reshuffleElements, makeCultureCard, cultureNote } from "./src/engine";

// Journey 1: wizard -> card -> reshuffle -> accept -> generate -> star -> more-like -> insert
const c = seedCulture({ name: "Dravok", mood: "harsh", register: "balanced", familiarity: "familiar", environment: "mountain", packs: ["warrior"], seed: "dravok-1" });
console.log("card 1:", makeCultureCard(c, 0).summary);
reshuffleElements(c, "1");                       // user hits "Reshuffle the sounds"
console.log("card 2:", makeCultureCard(c, 1).summary);
let batch = generateBatch(c, "personal", 12);
console.log("batch:", batch.map(g => g.name).join(" "));
const starred = batch.filter(g => g.parts.some(p => p.slot === "end" && p.element === batch[0].parts.find(q => q.slot === "end")!.element)).slice(0, 2);
reinforce(c, starred);                           // "More like starred"
const batch2 = generateBatch(c, "personal", 8);
const starEnd = starred[0].parts.find(p => p.slot === "end")!.element.toLowerCase();
const share = batch2.filter(g => g.name.toLowerCase().endsWith(starEnd.replace("-", ""))).length;
console.log(`starred ending ${starEnd}: ${share}/8 of next batch share it (learning loop working: ${share >= 3})`);
for (const g of batch2.slice(0, 4)) c.registry.push(g.name.toLowerCase());   // "Insert into note"
const clash = generateBatch(c, "personal", 20).some(g => c.registry.includes(g.name.toLowerCase()));
console.log("registry protects inserted names:", !clash);

// Journey 2: paste-your-own -> card -> generate meaning-mode -> note export
const rc = reverseSeedCulture("Kaelthi", ["Kaelith", "Veyra", "Kaeloth"], ["arcane"]);
console.log("reverse card:", makeCultureCard(rc, 0).summary);
console.log("kin:", generateBatch(rc, "personal", 6).map(g => `${g.name}`).join(" "));
console.log("meaning:", generateBatch(rc, "place", 3, "meaning").map(g => `${g.name} (${g.gloss})`).join("  "));
const note = cultureNote(rc);
console.log("note has frontmatter/glossary/pronunciation:", note.includes("seed:"), note.includes("| Form |"), note.includes("say it:"));
console.log("glossary rows:", (note.match(/\| \w+ \|/g) || []).length);
