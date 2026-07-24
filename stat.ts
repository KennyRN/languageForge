import { seedCulture, generateBatch } from "./src/engine";

// Basic generation smoke: batches are non-empty and unique within a run.
let ok = 0;
const trials = 20;
for (let t = 0; t < trials; t++) {
  const c = seedCulture({ name: "T", mood: "harsh", register: "balanced", familiarity: "familiar", environment: "—", packs: [], seed: "trial-" + t });
  const batch = generateBatch(c, "personal", 30);
  const names = batch.map(g => g.name.toLowerCase());
  if (batch.length === 30 && new Set(names).size === names.length) ok++;
}
console.log(`full unique batches in ${ok}/${trials} trials`);
