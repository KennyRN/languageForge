// main.ts — Obsidian layer over engine.ts. Progressive disclosure:
// three commands, one card, everything else behind it.

import {
  App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab,
  Setting, TFile, normalizePath,
} from "obsidian";
import {
  AgedSnapshot, Category, Culture, DriftLevel, DRIFT_PACKS, ENV_DEFAULT_PACK, GeneratedName,
  MOOD_DEFAULT_DRIFT_PACK, Mood, Register, SeedTraits,
  ageCulture, cultureNote, deriveCulture, generateBatch, makeCultureCard, mergeCultures, reinforce,
  reshuffleElements, reverseSeedCulture, seedCulture, weightLabel,
} from "./engine";
import { PHONETIC_PACKS, SEMANTIC_PACKS } from "./data";

// ---------------------------------------------------------------- settings & data

interface LanguageForgeSettings {
  folder: string;
  batchSize: number;
  showPronunciation: boolean;
  insertFormat: "list" | "inline";
}

interface LanguageForgeData {
  settings: LanguageForgeSettings;
  cultures: Culture[];
}

const DEFAULT_SETTINGS: LanguageForgeSettings = {
  folder: "languageForge",
  batchSize: 12,
  showPronunciation: true,
  insertFormat: "list",
};

export default class LanguageForgePlugin extends Plugin {
  data: LanguageForgeData = { settings: { ...DEFAULT_SETTINGS }, cultures: [] };

  async onload() {
    const stored = (await this.loadData()) as Partial<LanguageForgeData> | null;
    if (stored) {
      this.data.settings = { ...DEFAULT_SETTINGS, ...(stored.settings ?? {}) };
      this.data.cultures = stored.cultures ?? [];
    }

    this.addCommand({
      id: "create-culture",
      name: "Create a culture",
      callback: () => new SeedWizardModal(this.app, this).open(),
    });

    this.addCommand({
      id: "create-culture-from-names",
      name: "Create a culture from names you already have",
      callback: () => new PasteNamesModal(this.app, this).open(),
    });

    this.addCommand({
      id: "generate-names",
      name: "Generate names",
      callback: () => {
        if (this.data.cultures.length === 0) {
          new Notice("No cultures yet — create one first.");
          new SeedWizardModal(this.app, this).open();
          return;
        }
        new GenerateModal(this.app, this).open();
      },
    });

    this.addCommand({
      id: "derive-culture",
      name: "Derive a descendant language",
      callback: () => {
        if (this.data.cultures.length === 0) {
          new Notice("No cultures yet — create one first.");
          new SeedWizardModal(this.app, this).open();
          return;
        }
        new DeriveCultureModal(this.app, this).open();
      },
    });

    this.addCommand({
      id: "age-culture",
      name: "Age a language in place",
      callback: () => {
        if (this.data.cultures.length === 0) { new Notice("No cultures yet — create one first."); return; }
        new PickCultureModal(this.app, this, (c) => new AgeCultureModal(this.app, this, c).open(), "Age this").open();
      },
    });

    this.addCommand({
      id: "view-family-tree",
      name: "View language family tree",
      callback: () => {
        if (this.data.cultures.length === 0) { new Notice("No cultures yet — create one first."); return; }
        new FamilyTreeModal(this.app, this).open();
      },
    });

    this.addCommand({
      id: "save-culture-card",
      name: "Save a culture card as a note",
      callback: () => {
        if (this.data.cultures.length === 0) { new Notice("No cultures yet."); return; }
        new PickCultureModal(this.app, this, async (c) => {
          const path = await this.writeCultureNote(c);
          new Notice(`Saved ${path}`);
        }).open();
      },
    });

    this.addRibbonIcon("languages", "languageForge: Generate names", () => {
      if (this.data.cultures.length === 0) {
        new Notice("No cultures yet — create one first.");
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

  async writeCultureNote(culture: Culture): Promise<string> {
    const folder = normalizePath(`${this.data.settings.folder}/Cultures`);
    try { await this.app.vault.createFolder(folder); } catch { /* exists */ }
    const path = normalizePath(`${folder}/${culture.name}.md`);
    const content = cultureNote(culture, this.data.cultures);
    const existing = this.app.vault.getAbstractFileByPath(path);
    if (existing instanceof TFile) await this.app.vault.modify(existing, content);
    else await this.app.vault.create(path, content);
    return path;
  }

  upsertCulture(culture: Culture) {
    const i = this.data.cultures.findIndex(c => c.id === culture.id);
    if (i >= 0) this.data.cultures[i] = culture;
    else this.data.cultures.push(culture);
  }
}

// ---------------------------------------------------------------- seed wizard

const MOODS: { value: Mood; label: string }[] = [
  { value: "harsh", label: "Harsh — clipped, forceful (Kordrak)" },
  { value: "soft", label: "Soft — smooth, flowing (Elowen)" },
  { value: "bright", label: "Bright — sharp, keen (Sisen)" },
  { value: "grand", label: "Grand — weighty, old (Aromoran)" },
  { value: "exotic", label: "Exotic — foreign but readable (Zaeneir)" },
];

const ENVIRONMENTS = ["none", "coastal", "mountain", "forest", "desert", "urban"];

class SeedWizardModal extends Modal {
  plugin: LanguageForgePlugin;
  traits: SeedTraits = {
    name: "", mood: "soft", register: "balanced",
    familiarity: "familiar", environment: "none", packs: [],
  };

  constructor(app: App, plugin: LanguageForgePlugin) {
    super(app);
    this.plugin = plugin;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.addClass("languageforge-modal");
    contentEl.createEl("h2", { text: "Create a culture" });
    contentEl.createEl("p", {
      text: "Four choices. Everything else is derived, and you can nudge it on the card afterwards.",
      cls: "lf-hint",
    });

    new Setting(contentEl).setName("Culture name")
      .addText(t => t.setPlaceholder("Velari").onChange(v => (this.traits.name = v.trim())));

    new Setting(contentEl).setName("Sound")
      .setDesc("The phonaesthetic mood of the language.")
      .addDropdown(d => {
        for (const m of MOODS) d.addOption(m.value, m.label);
        d.setValue(this.traits.mood).onChange(v => (this.traits.mood = v as Mood));
      });

    new Setting(contentEl).setName("Register")
      .setDesc("Ancient names run long with penult stress; modern names run short.")
      .addDropdown(d => {
        d.addOption("balanced", "Balanced");
        d.addOption("ancient", "Ancient");
        d.addOption("modern", "Modern");
        d.setValue(this.traits.register).onChange(v => (this.traits.register = v as Register));
      });

    new Setting(contentEl).setName("Familiarity")
      .setDesc("Familiar samples the curated element packs; alien builds sounds procedurally.")
      .addDropdown(d => {
        d.addOption("familiar", "Familiar (English-adjacent)");
        d.addOption("alien", "Alien (procedural)");
        d.setValue(this.traits.familiarity).onChange(v => (this.traits.familiarity = v as "familiar" | "alien"));
      });

    new Setting(contentEl).setName("Environment")
      .setDesc("Coastal adds seafaring words, mountain adds highland words, and so on.")
      .addDropdown(d => {
        for (const e of ENVIRONMENTS) d.addOption(e, e === "none" ? "None in particular" : e[0].toUpperCase() + e.slice(1));
        d.setValue(this.traits.environment).onChange(v => (this.traits.environment = v));
      });

    const details = contentEl.createEl("details", { cls: "lf-packs" });
    details.createEl("summary", { text: "Word themes (optional)" });
    details.createEl("p", {
      text: "Core words — kinship, virtues, nature — are always on. Stack themes to tilt what names mean.",
      cls: "lf-hint",
    });
    for (const packName of Object.keys(SEMANTIC_PACKS)) {
      if (!SEMANTIC_PACKS[packName].additive) continue;
      new Setting(details).setName(packName[0].toUpperCase() + packName.slice(1))
        .addToggle(t => t.setValue(false).onChange(on => {
          if (on) this.traits.packs.push(packName);
          else this.traits.packs = this.traits.packs.filter(p => p !== packName);
        }));
    }

    const buttons = new Setting(contentEl);
    buttons.addButton(b => b.setButtonText("Cancel").onClick(() => this.close()));
    buttons.addButton(b => b.setButtonText("Seed the culture").setCta().onClick(() => {
      if (!this.traits.name) { new Notice("The culture needs a name."); return; }
      if (this.plugin.data.cultures.some(c => c.name.toLowerCase() === this.traits.name.toLowerCase())) {
        new Notice("A culture with that name already exists."); return;
      }
      const env = this.traits.environment === "none" ? "—" : this.traits.environment;
      const culture = seedCulture({ ...this.traits, environment: env });
      this.close();
      new CultureCardModal(this.app, this.plugin, culture, true).open();
    }));
  }

  onClose() { this.contentEl.empty(); }
}

// ---------------------------------------------------------------- paste-your-own-names

class PasteNamesModal extends Modal {
  plugin: LanguageForgePlugin;
  cultureName = "";
  pasted = "";

  constructor(app: App, plugin: LanguageForgePlugin) {
    super(app);
    this.plugin = plugin;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.addClass("languageforge-modal");
    contentEl.createEl("h2", { text: "Start from names you already have" });
    contentEl.createEl("p", {
      text: "Paste two or more names you've invented and love. The engine works out a phonology consistent with them and generates kin. Your names are protected — nothing too similar will ever be generated.",
      cls: "lf-hint",
    });

    new Setting(contentEl).setName("Culture name")
      .addText(t => t.setPlaceholder("Kaelthi").onChange(v => (this.cultureName = v.trim())));

    new Setting(contentEl).setName("Your names")
      .setDesc("Separated by commas or new lines.")
      .addTextArea(t => {
        t.setPlaceholder("Kaelith, Veyra, Kaeloth");
        t.inputEl.rows = 4;
        t.onChange(v => (this.pasted = v));
      });

    const buttons = new Setting(contentEl);
    buttons.addButton(b => b.setButtonText("Cancel").onClick(() => this.close()));
    buttons.addButton(b => b.setButtonText("Work out the sound").setCta().onClick(() => {
      const names = this.pasted.split(/[,\n;]+/).map(s => s.trim()).filter(s => s.length >= 3);
      if (names.length < 2) { new Notice("Paste at least two names."); return; }
      if (!this.cultureName) this.cultureName = names[0] + "-kin";
      const culture = reverseSeedCulture(this.cultureName, names);
      this.close();
      new CultureCardModal(this.app, this.plugin, culture, true).open();
    }));
  }

  onClose() { this.contentEl.empty(); }
}

// ---------------------------------------------------------------- the culture card

class CultureCardModal extends Modal {
  plugin: LanguageForgePlugin;
  culture: Culture;
  isNew: boolean;
  shuffle = 0;

  constructor(app: App, plugin: LanguageForgePlugin, culture: Culture, isNew: boolean) {
    super(app);
    this.plugin = plugin;
    this.culture = culture;
    this.isNew = isNew;
  }

  render() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("languageforge-modal");
    const card = makeCultureCard(this.culture, this.shuffle);

    contentEl.createEl("h2", { text: this.culture.name });
    contentEl.createEl("p", { text: card.summary, cls: "lf-onebreath" });

    if (this.culture.fromNames?.length) {
      contentEl.createEl("p", {
        text: `Seeded from: ${this.culture.fromNames.join(", ")}`,
        cls: "lf-hint",
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
        text: card.glossaryPreview.map(g => `${g.form} = ${g.meaning}`).join("  ·  "),
        cls: "lf-glossary-items",
      });
    }
    contentEl.createEl("p", { text: `Word themes: ${card.packs.join(", ")}`, cls: "lf-hint" });

    const row = new Setting(contentEl);
    row.addButton(b => b.setButtonText("Reshuffle the sounds").onClick(() => {
      this.shuffle++;
      reshuffleElements(this.culture, String(this.shuffle));
      this.render();
    }));
    row.addButton(b => b.setButtonText("New samples").onClick(() => {
      this.shuffle++;
      this.render();
    }));
    if (!this.isNew) {
      row.addButton(b => b.setButtonText("Branch a new language…").onClick(() => {
        this.close();
        new DeriveCultureModal(this.app, this.plugin, this.culture.id).open();
      }));
      row.addButton(b => b.setButtonText("Age this language…").onClick(() => {
        this.close();
        new AgeCultureModal(this.app, this.plugin, this.culture).open();
      }));
    }
    if (this.isNew) {
      row.addButton(b => b.setButtonText("Cancel").onClick(() => {
        this.close();
        new Notice("Culture discarded — nothing was saved.");
      }));
    }
    row.addButton(b => b.setButtonText(this.isNew ? "Accept culture" : "Save changes").setCta().onClick(async () => {
      this.plugin.upsertCulture(this.culture);
      await this.plugin.persist();
      this.close();
      new Notice(`${this.culture.name} saved. Generate names any time.`);
      new GenerateModal(this.app, this.plugin, this.culture.id).open();
    }));
  }

  onOpen() { this.render(); }
  onClose() { this.contentEl.empty(); }
}

// ---------------------------------------------------------------- branching a language family

const DRIFT_LEVELS: { value: DriftLevel; label: string }[] = [
  { value: "dialect", label: "Dialect — light drift, clearly the same tongue" },
  { value: "sister", label: "Sister language — moderate drift, kin but distinct" },
  { value: "distant", label: "Distant cousin — heavy drift, related if you look closely" },
];

// Short labels for the pack dropdown (plainDescription runs to a full sentence, which a
// native <select> doesn't wrap). Only descent packs are offered here — prestige_exonym is
// a loanword/contact pack, reserved for the future contact-graph work.
const DRIFT_PACK_LABELS: Record<string, string> = {
  romance_softening: "Romance softening",
  celtic_lenition: "Celtic lenition",
  vowel_melting: "Vowel melting",
  syllable_erosion: "Syllable erosion",
  vowel_shift: "Vowel shift",
  germanic_hardening: "Germanic hardening",
};

function descentPackIds(): string[] {
  return Object.keys(DRIFT_PACKS).filter(id => DRIFT_PACKS[id].appliesTo === "descent");
}

class DeriveCultureModal extends Modal {
  plugin: LanguageForgePlugin;
  mode: "branch" | "merge" = "branch";
  branchParentId: string;
  mergeParentIds = new Set<string>();
  name = "";
  driftLevel: DriftLevel = "sister";
  driftPackId: string;
  driftPackTouched = false; // once the user picks explicitly, stop overwriting on parent change
  environment = "none";

  constructor(app: App, plugin: LanguageForgePlugin, parentId?: string) {
    super(app);
    this.plugin = plugin;
    this.branchParentId = parentId ?? plugin.data.cultures[0]?.id ?? "";
    this.driftPackId = this.defaultPackForCurrentParent();
  }

  defaultPackForCurrentParent(): string {
    const firstParent = this.mode === "branch"
      ? this.plugin.data.cultures.find(c => c.id === this.branchParentId)
      : this.plugin.data.cultures.find(c => this.mergeParentIds.has(c.id));
    const mood = firstParent?.mood;
    return (mood && MOOD_DEFAULT_DRIFT_PACK[mood]) ?? descentPackIds()[0];
  }

  render() {
    const { contentEl } = this;
    if (!this.driftPackTouched) this.driftPackId = this.defaultPackForCurrentParent();
    contentEl.empty();
    contentEl.addClass("languageforge-modal");
    contentEl.createEl("h2", { text: "Branch a new language" });
    contentEl.createEl("p", {
      text: "Branch drifts one parent's sounds and words into a descendant. Merge blends two or more languages together, as if they'd come into contact.",
      cls: "lf-hint",
    });

    if (this.plugin.data.cultures.length === 0) {
      contentEl.createEl("p", { text: "No cultures yet — create one first.", cls: "lf-hint" });
      new Setting(contentEl).addButton(b => b.setButtonText("Close").onClick(() => this.close()));
      return;
    }

    new Setting(contentEl).setName("Mode")
      .setDesc("Branch: one parent drifts into a descendant. Merge: two or more parents blend via contact.")
      .addDropdown(d => {
        d.addOption("branch", "Branch from one parent");
        d.addOption("merge", "Merge two or more parents");
        d.setValue(this.mode).onChange(v => { this.mode = v as "branch" | "merge"; this.render(); });
      });

    if (this.mode === "branch") {
      new Setting(contentEl).setName("Parent language")
        .addDropdown(d => {
          for (const c of this.plugin.data.cultures) d.addOption(c.id, c.name);
          d.setValue(this.branchParentId).onChange(v => (this.branchParentId = v));
        });
    } else {
      contentEl.createEl("p", { text: "Select two or more languages to merge.", cls: "lf-hint" });
      for (const c of this.plugin.data.cultures) {
        new Setting(contentEl).setName(c.name)
          .addToggle(t => t.setValue(this.mergeParentIds.has(c.id)).onChange(on => {
            if (on) this.mergeParentIds.add(c.id);
            else this.mergeParentIds.delete(c.id);
          }));
      }
    }

    new Setting(contentEl).setName("New language name")
      .addText(t => t.setPlaceholder("Velari-dhen").onChange(v => (this.name = v.trim())));

    new Setting(contentEl).setName("Drift")
      .setDesc(this.mode === "branch"
        ? "How far the branch has diverged from its parent."
        : "How far the blended language has settled since contact.")
      .addDropdown(d => {
        for (const lvl of DRIFT_LEVELS) d.addOption(lvl.value, lvl.label);
        d.setValue(this.driftLevel).onChange(v => (this.driftLevel = v as DriftLevel));
      });

    const packHint = contentEl.createEl("p", { cls: "lf-hint" });
    const updatePackHint = () => {
      const pack = DRIFT_PACKS[this.driftPackId];
      packHint.setText(pack ? `${pack.plainDescription} ${pack.why}` : "");
    };
    new Setting(contentEl).setName("Sound-change pack")
      .setDesc("The kind of sound change this branch/merge undergoes.")
      .addDropdown(d => {
        for (const id of descentPackIds()) d.addOption(id, DRIFT_PACK_LABELS[id] ?? id);
        d.setValue(this.driftPackId).onChange(v => {
          this.driftPackId = v;
          this.driftPackTouched = true;
          updatePackHint();
        });
      });
    updatePackHint();

    new Setting(contentEl).setName("Environment")
      .setDesc("Optional — adds regional word themes on top of the parents' vocabulary.")
      .addDropdown(d => {
        for (const e of ENVIRONMENTS) d.addOption(e, e === "none" ? "None in particular" : e[0].toUpperCase() + e.slice(1));
        d.setValue(this.environment).onChange(v => (this.environment = v));
      });

    const buttons = new Setting(contentEl);
    buttons.addButton(b => b.setButtonText("Cancel").onClick(() => this.close()));
    buttons.addButton(b => b.setButtonText(this.mode === "branch" ? "Derive language" : "Merge languages").setCta().onClick(() => {
      if (!this.name) { new Notice("The new language needs a name."); return; }
      if (this.plugin.data.cultures.some(c => c.name.toLowerCase() === this.name.toLowerCase())) {
        new Notice("A culture with that name already exists."); return;
      }
      const envPack = ENV_DEFAULT_PACK[this.environment];
      const overrides: { environment?: string; packs?: string[] } = {};
      if (this.environment !== "none") {
        overrides.environment = this.environment;
        if (envPack) overrides.packs = [envPack];
      }

      let culture: Culture;
      if (this.mode === "branch") {
        const parent = this.plugin.data.cultures.find(c => c.id === this.branchParentId);
        if (!parent) { new Notice("Pick a parent language first."); return; }
        culture = deriveCulture(parent, this.name, this.driftLevel, [this.driftPackId], overrides);
      } else {
        const parents = this.plugin.data.cultures.filter(c => this.mergeParentIds.has(c.id));
        if (parents.length < 2) { new Notice("Select at least two languages to merge."); return; }
        culture = mergeCultures(parents, this.name, this.driftLevel, [this.driftPackId], overrides);
      }
      this.close();
      new CultureCardModal(this.app, this.plugin, culture, true).open();
    }));
  }

  onOpen() { this.render(); }
  onClose() { this.contentEl.empty(); }
}

// ---------------------------------------------------------------- ageing a language in place

// Gap 2, Level 1: a read-only preview, no persistence. Aging deliberately produces no
// Culture node — see ageCulture in engine.ts — so there is no "accept"/"save" action here,
// only pack/level selectors and a preview of the archaic vs. modern forms.
class AgeCultureModal extends Modal {
  plugin: LanguageForgePlugin;
  culture: Culture;
  packId: string;
  driftLevel: DriftLevel = "sister";
  snapshot: AgedSnapshot | null = null;

  constructor(app: App, plugin: LanguageForgePlugin, culture: Culture) {
    super(app);
    this.plugin = plugin;
    this.culture = culture;
    this.packId = MOOD_DEFAULT_DRIFT_PACK[culture.mood] ?? descentPackIds()[0];
  }

  render() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("languageforge-modal");
    contentEl.createEl("h2", { text: `Age ${this.culture.name} in place` });
    contentEl.createEl("p", {
      text: "A single language, aged: archaic and worn-modern forms shown side by side. This doesn't create a new language or touch the family tree.",
      cls: "lf-hint",
    });

    const packHint = contentEl.createEl("p", { cls: "lf-hint" });
    const updatePackHint = () => {
      const pack = DRIFT_PACKS[this.packId];
      packHint.setText(pack ? `${pack.plainDescription} ${pack.why}` : "");
    };
    new Setting(contentEl).setName("Sound-change pack")
      .addDropdown(d => {
        for (const id of descentPackIds()) d.addOption(id, DRIFT_PACK_LABELS[id] ?? id);
        d.setValue(this.packId).onChange(v => { this.packId = v; updatePackHint(); });
      });
    updatePackHint();

    new Setting(contentEl).setName("Drift")
      .setDesc("How far the modern form has worn from the archaic one.")
      .addDropdown(d => {
        for (const lvl of DRIFT_LEVELS) d.addOption(lvl.value, lvl.label);
        d.setValue(this.driftLevel).onChange(v => (this.driftLevel = v as DriftLevel));
      });

    new Setting(contentEl).addButton(b => b.setButtonText("Preview").setCta().onClick(() => {
      this.snapshot = ageCulture(this.culture, this.packId, this.driftLevel);
      this.render();
    }));

    if (this.snapshot) {
      const cols = contentEl.createDiv({ cls: "lf-age-columns" });
      const renderColumn = (title: string, samples: GeneratedName[]) => {
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

    new Setting(contentEl).addButton(b => b.setButtonText("Close").onClick(() => this.close()));
  }

  onOpen() { this.render(); }
  onClose() { this.contentEl.empty(); }
}

// ---------------------------------------------------------------- family tree

class FamilyTreeModal extends Modal {
  plugin: LanguageForgePlugin;

  constructor(app: App, plugin: LanguageForgePlugin) {
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

    const roots = all.filter(c => !c.parentIds || c.parentIds.length === 0);
    if (roots.length === 0) {
      contentEl.createEl("p", { text: "No root languages found.", cls: "lf-hint" });
      return;
    }

    for (const root of roots) {
      const section = contentEl.createDiv({ cls: "lf-tree-section" });
      this.renderNode(section, root, all, 0, new Set());
    }
  }

  renderNode(container: HTMLElement, culture: Culture, all: Culture[], depth: number, visited: Set<string>) {
    const row = container.createDiv({ cls: "lf-tree-node" });
    row.style.marginLeft = `${depth * 18}px`;

    const parents = (culture.parentIds ?? [])
      .map(id => all.find(c => c.id === id))
      .filter((c): c is Culture => !!c);
    const packLabel = culture.driftPackIds?.length ? ` [${culture.driftPackIds.join("+")}]` : "";
    const relLabel = parents.length === 0 ? "root"
      : parents.length === 1 ? `${culture.driftLevel ?? "drift"} of ${parents[0].name}${packLabel}`
      : `merged: ${parents.map(p => p.name).join(" + ")} (${culture.driftLevel ?? "contact"})${packLabel}`;

    const label = row.createEl("a", {
      text: `${culture.name}  ·  gen ${culture.generation ?? 0}  ·  ${relLabel}`,
      cls: "lf-tree-link",
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

    if (depth > 50) return; // cheap safety net against pathological data
    const children = all.filter(c => c.parentIds?.includes(culture.id));
    for (const child of children) this.renderNode(container, child, all, depth + 1, visited);
  }

  onClose() { this.contentEl.empty(); }
}

// ---------------------------------------------------------------- generator with pin-and-regenerate

class GenerateModal extends Modal {
  plugin: LanguageForgePlugin;
  cultureId: string;
  category: Category = "personal";
  mode: "sound" | "meaning" = "sound";
  batch: GeneratedName[] = [];
  starred = new Set<number>();

  constructor(app: App, plugin: LanguageForgePlugin, cultureId?: string) {
    super(app);
    this.plugin = plugin;
    this.cultureId = cultureId ?? plugin.data.cultures[0].id;
  }

  get culture(): Culture {
    return this.plugin.data.cultures.find(c => c.id === this.cultureId) ?? this.plugin.data.cultures[0];
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

    const controls = new Setting(contentEl);
    controls.addDropdown(d => {
      for (const c of this.plugin.data.cultures) d.addOption(c.id, c.name);
      d.setValue(this.cultureId).onChange(v => { this.cultureId = v; this.newBatch(); this.render(); });
    });
    controls.addDropdown(d => {
      d.addOption("personal", "People");
      d.addOption("house", "Houses");
      d.addOption("place", "Places");
      d.setValue(this.category).onChange(v => { this.category = v as Category; this.newBatch(); this.render(); });
    });
    controls.addDropdown(d => {
      d.addOption("sound", "By sound");
      d.addOption("meaning", "By meaning");
      d.setValue(this.mode).onChange(v => { this.mode = v as "sound" | "meaning"; this.newBatch(); this.render(); });
    });
    controls.addButton(b => b.setButtonText("New culture…").onClick(() => {
      this.close();
      new SeedWizardModal(this.app, this.plugin).open();
    }));
    controls.addButton(b => b.setButtonText("Branch a new language…").onClick(() => {
      this.close();
      new DeriveCultureModal(this.app, this.plugin, this.culture.id).open();
    }));
    controls.addButton(b => b.setButtonText("Family tree…").onClick(() => {
      this.close();
      new FamilyTreeModal(this.app, this.plugin).open();
    }));

    contentEl.createEl("p", { text: this.culture.summary, cls: "lf-hint" });

    const grid = contentEl.createDiv({ cls: "lf-batch" });
    this.batch.forEach((g, i) => {
      const chip = grid.createDiv({ cls: "lf-name-chip" + (this.starred.has(i) ? " is-starred" : "") });
      chip.createSpan({ text: (this.starred.has(i) ? "★ " : "") + g.name, cls: "lf-chip-name" });
      if (this.plugin.data.settings.showPronunciation) chip.createDiv({ text: g.pronunciation, cls: "lf-chip-pron" });
      if (g.gloss) chip.createDiv({ text: g.gloss, cls: "lf-chip-gloss" });
      chip.onClickEvent(() => {
        if (this.starred.has(i)) this.starred.delete(i); else this.starred.add(i);
        this.render();
      });
    });
    if (this.batch.length === 0) {
      contentEl.createEl("p", { text: "Nothing passed the gates — try reshuffling the culture's sounds.", cls: "lf-hint" });
    }

    contentEl.createEl("p", {
      text: "Tap names you like, then ask for more like them — the culture learns your taste.",
      cls: "lf-hint",
    });

    const actions = new Setting(contentEl);
    actions.addButton(b => b.setButtonText("New batch").onClick(() => { this.newBatch(); this.render(); }));
    actions.addButton(b => {
      b.setButtonText("More like starred").onClick(async () => {
        const starredNames = [...this.starred].map(i => this.batch[i]);
        if (starredNames.length === 0) { new Notice("Star a name or two first."); return; }
        reinforce(this.culture, starredNames);
        await this.plugin.persist();
        this.newBatch();
        this.render();
      });
      if (this.starred.size === 0) b.buttonEl.addClass("lf-disabled");
    });
    actions.addButton(b => b.setButtonText("Insert into note").setCta().onClick(async () => {
      const chosen = this.starred.size > 0 ? [...this.starred].map(i => this.batch[i]) : this.batch;
      const view = this.app.workspace.getActiveViewOfType(MarkdownView);
      if (!view) { new Notice("Open a note to insert into."); return; }
      this.insert(view.editor, chosen);
      for (const g of chosen) {
        if (!this.culture.registry.includes(g.name.toLowerCase())) this.culture.registry.push(g.name.toLowerCase());
      }
      await this.plugin.persist();
      new Notice(`${chosen.length} name${chosen.length === 1 ? "" : "s"} inserted and reserved.`);
      this.close();
    }));
  }

  insert(editor: Editor, names: GeneratedName[]) {
    const { showPronunciation, insertFormat } = this.plugin.data.settings;
    const fmt = (g: GeneratedName) => {
      let s = g.name;
      if (showPronunciation) s += ` (*${g.pronunciation}*)`;
      if (g.gloss) s += ` — ${g.gloss}`;
      return s;
    };
    const text = insertFormat === "inline"
      ? names.map(g => g.name).join(", ")
      : names.map(g => `- ${fmt(g)}`).join("\n") + "\n";
    editor.replaceSelection(text);
  }

  onOpen() { this.newBatch(); this.render(); }
  onClose() { this.contentEl.empty(); }
}

// ---------------------------------------------------------------- small chooser

class PickCultureModal extends Modal {
  plugin: LanguageForgePlugin;
  onPick: (c: Culture) => void;
  buttonText: string;

  constructor(app: App, plugin: LanguageForgePlugin, onPick: (c: Culture) => void, buttonText = "Save card") {
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
      new Setting(contentEl).setName(c.name).setDesc(c.summary)
        .addButton(b => b.setButtonText(this.buttonText).onClick(() => { this.close(); this.onPick(c); }));
    }
  }

  onClose() { this.contentEl.empty(); }
}

// ---------------------------------------------------------------- settings tab

class LanguageForgeSettingTab extends PluginSettingTab {
  plugin: LanguageForgePlugin;

  constructor(app: App, plugin: LanguageForgePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl).setName("Create a new culture")
      .setDesc("Start the wizard for another culture — you can have as many as you like.")
      .addButton(b => b.setButtonText("New culture…").onClick(() => {
        new SeedWizardModal(this.app, this.plugin).open();
      }));

    if (this.plugin.data.cultures.length > 0) {
      new Setting(containerEl).setName("Branch or merge a language")
        .setDesc("Derive a descendant from one parent, or merge two or more existing languages together via contact.")
        .addButton(b => b.setButtonText("Branch a language…").onClick(() => {
          new DeriveCultureModal(this.app, this.plugin).open();
        }));

      new Setting(containerEl).setName("Family tree")
        .setDesc("Browse every language's ancestors and descendants.")
        .addButton(b => b.setButtonText("View family tree…").onClick(() => {
          new FamilyTreeModal(this.app, this.plugin).open();
        }));
    }

    new Setting(containerEl).setName("Folder for culture cards")
      .setDesc("Culture notes are saved under this folder.")
      .addText(t => t.setValue(this.plugin.data.settings.folder).onChange(async v => {
        this.plugin.data.settings.folder = v.trim() || DEFAULT_SETTINGS.folder;
        await this.plugin.persist();
      }));

    new Setting(containerEl).setName("Names per batch")
      .addSlider(s => s.setLimits(6, 24, 2).setValue(this.plugin.data.settings.batchSize).setDynamicTooltip()
        .onChange(async v => { this.plugin.data.settings.batchSize = v; await this.plugin.persist(); }));

    new Setting(containerEl).setName("Show pronunciation hints")
      .setDesc("Say-it-like respellings under every name.")
      .addToggle(t => t.setValue(this.plugin.data.settings.showPronunciation)
        .onChange(async v => { this.plugin.data.settings.showPronunciation = v; await this.plugin.persist(); }));

    new Setting(containerEl).setName("Insert format")
      .setDesc("How names are written into your note.")
      .addDropdown(d => {
        d.addOption("list", "Bulleted list with details");
        d.addOption("inline", "Names only, comma-separated");
        d.setValue(this.plugin.data.settings.insertFormat)
          .onChange(async v => { this.plugin.data.settings.insertFormat = v as "list" | "inline"; await this.plugin.persist(); });
      });

    containerEl.createEl("p", {
      text: `Element packs loaded: ${Object.keys(PHONETIC_PACKS).length} moods, ${Object.keys(SEMANTIC_PACKS).length} word themes. All gate-validated.`,
      cls: "lf-hint",
    });
  }
}
