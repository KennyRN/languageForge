import { seedCulture, generateBatch, reinforce } from "./src/engine";
let improved = 0, trials = 20;
for (let t = 0; t < trials; t++) {
  const c = seedCulture({ name: "T", mood: "harsh", register: "balanced", familiarity: "familiar", environment: "—", packs: [], seed: "trial-" + t });
  const before = generateBatch(c, "personal", 30);
  const target = before[0].parts.find(p => p.slot === "end")!.element.toLowerCase();
  const baseRate = before.filter(g => g.name.toLowerCase().endsWith(target.replace("-", ""))).length / 30;
  reinforce(c, [before[0]]);   // star ONE name
  const after = generateBatch(c, "personal", 30);
  const newRate = after.filter(g => g.name.toLowerCase().endsWith(target.replace("-", ""))).length / 30;
  if (newRate > baseRate) improved++;
}
console.log(`starring one name raised its ending's share in ${improved}/${trials} trials`);
