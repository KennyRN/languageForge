// Simulates the complete user journey the modals drive.
import { seedCulture, reverseSeedCulture, generateBatch, reshuffleElements, makeCultureCard, cultureNote } from "./src/engine";

// Journey 1: wizard -> card -> reshuffle -> accept -> generate -> insert
const c = seedCulture({ name: "Dravok", mood: "harsh", register: "balanced", familiarity: "familiar", environment: "mountain", packs: ["warrior"], seed: "dravok-1" });
console.log("card 1:", makeCultureCard(c, 0).summary);
reshuffleElements(c, "1");                       // user hits "Reshuffle the sounds"
console.log("card 2:", makeCultureCard(c, 1).summary);
let batch = generateBatch(c, "personal", 12);
console.log("batch:", batch.map(g => g.name).join(" "));
const batch2 = generateBatch(c, "personal", 8);
for (const g of batch2.slice(0, 4)) c.registry.push(g.name.toLowerCase());   // "Insert into note"
const clash = generateBatch(c, "personal", 20).some(g => c.registry.includes(g.name.toLowerCase()));
console.log("registry protects inserted names:", !clash);

// Journey 2: paste-your-own -> card -> generate meaning-mode -> note export
const rc = reverseSeedCulture("Kaelthi", ["Kaelith", "Veyra", "Kaeloth"], ["arcane"]);
console.log("reverse card:", makeCultureCard(rc, 0).summary);
console.log("kin:", generateBatch(rc, "personal", 6).map(g => `${g.name}`).join(" "));
console.log("meaning:", generateBatch(rc, "place", 3, "meaning").map(g => `${g.name} (${g.gloss})`).join("  "));
const note = cultureNote(rc);
console.log("note has frontmatter/glossary/managed:", note.includes("lf-id:"), note.includes("| Form |"), note.includes("lf:managed:start"));
console.log("glossary rows:", (note.match(/\| \w+ \|/g) || []).length);
