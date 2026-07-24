// main.ts — Obsidian layer over engine.ts. Progressive disclosure:
// three commands, one card, everything else behind it.

import {
  App, DropdownComponent, MarkdownView, Modal, Notice, Plugin, PluginSettingTab,
  Setting, SettingDefinitionItem, TFile, TFolder, normalizePath, setIcon,
} from "obsidian";
import {
  AgedSnapshot, Category, ClassLean, ContactDomain, ContactEdge, ContactPreview, ContactType, Culture,
  DriftLevel, DRIFT_PACKS, ENV_DEFAULT_PACK, GeneratedName, NameClass,
  MOOD_DEFAULT_DRIFT_PACK, Mood, PlaceType, Register,
  SeedTraits, SpellingMode,
  acceptLoanedRoots, addClass, ageCulture, classSpecimens, deriveCulture, editClass,
  ensureCultureClasses, extractDescriptionFromPage, generateBatch, importNames,
  makeCultureCard, parseImportInput, previewContactEdge,
  regenerateClassEndings, removeClass, renameCulture, renderGlossaryPage, renderLanguagePage,
  resolveClassEndings, resolvePlaceSourceCulture, reverseSeedCulture,
  seedCulture, visibleClasses, placeholderName,
} from "./engine";
import { SEMANTIC_PACKS } from "./data";
import { renderFamilyTreeView } from "./familyTreeView";

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
  contactEdges: ContactEdge[];
}

const DEFAULT_SETTINGS: LanguageForgeSettings = {
  folder: "LanguageForge",
  batchSize: 12,
  showPronunciation: true,
  insertFormat: "list",
};

function sanitiseNoteName(name: string): string {
  return name.replace(/[\\/:*?"<>|#^[\]]/g, "").trim() || "Untitled";
}

/** Walk markdown notes under a folder (and nested folders) without vault-wide enumeration. */
function* markdownFilesInFolder(folder: TFolder): Generator<TFile> {
  for (const child of folder.children) {
    if (child instanceof TFolder) {
      yield* markdownFilesInFolder(child);
    } else if (child instanceof TFile && child.extension === "md") {
      yield child;
    }
  }
}

/** Raise a modal above other languageForge modals already on screen. */
function elevateStackedModal(modal: Modal) {
  const open = Array.from(document.querySelectorAll(
    ".modal-container.lf-stacked-modal-nested, .modal-container.lf-stacked-modal-container",
  ));
  const aboveNested = open.some(el => el.classList.contains("lf-stacked-modal-nested"));
  modal.containerEl.addClass(aboveNested ? "lf-stacked-modal-over" : "lf-stacked-modal-nested");
}

export default class LanguageForgePlugin extends Plugin {
  data: LanguageForgeData = { settings: { ...DEFAULT_SETTINGS }, cultures: [], contactEdges: [] };

  async onload() {
    const stored = (await this.loadData()) as Partial<LanguageForgeData> | null;
    if (stored) {
      this.data.settings = { ...DEFAULT_SETTINGS, ...(stored.settings ?? {}) };
      this.data.cultures = stored.cultures ?? [];
      this.data.contactEdges = stored.contactEdges ?? [];
    }
    let migrated = false;
    for (const c of this.data.cultures) {
      if (ensureCultureClasses(c)) migrated = true;
    }
    if (migrated) await this.persist();

    this.addCommand({
      id: "create-culture",
      name: "Create a culture",
      callback: () => new CreateLanguageModal(this.app, this).open(),
    });

    this.addCommand({
      id: "create-culture-from-names",
      name: "Create a culture from names you already have",
      callback: () => new CreateLanguageModal(this.app, this, "seeded").open(),
    });

    this.addCommand({
      id: "generate-names",
      name: "Generate names",
      callback: () => this.openGenerate(),
    });

    this.addCommand({
      id: "derive-culture",
      name: "Derive a descendant language",
      callback: () => {
        if (this.data.cultures.length === 0) {
          new Notice("No cultures yet — create one first.");
          new CreateLanguageModal(this.app, this).open();
          return;
        }
        new CreateLanguageModal(this.app, this, "child").open();
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
      id: "create-contact-edge",
      name: "Connect two languages via contact",
      callback: () => {
        if (this.data.cultures.length < 2) { new Notice("Need at least two languages to connect."); return; }
        new CreateLanguageModal(this.app, this, "child", undefined, "contact").open();
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
          await this.openCulturePage(c);
          new Notice(`Saved language page for ${c.name}`);
        }, "Open page").open();
      },
    });

    this.addCommand({
      id: "import-names",
      name: "Import names into a language",
      callback: () => {
        if (this.data.cultures.length === 0) {
          new Notice("No cultures yet — create one first.");
          new CreateLanguageModal(this.app, this).open();
          return;
        }
        new PickCultureModal(this.app, this, (c) => {
          new ImportNamesModal(this.app, this, c).open();
        }, "Import into…").open();
      },
    });

    this.addCommand({
      id: "edit-languages",
      name: "Edit languages",
      callback: () => new CreateLanguageModal(this.app, this, "edit").open(),
    });

    this.addCommand({
      id: "languages-hub",
      name: "Create a language",
      callback: () => new CreateLanguageModal(this.app, this).open(),
    });

    this.addRibbonIcon("tree-deciduous", "languageForge: Languages", () => {
      new FamilyTreeModal(this.app, this).open();
    });
    this.addRibbonIcon("sparkles", "languageForge: Generate names", () => {
      this.openGenerate();
    });

    this.addSettingTab(new LanguageForgeSettingTab(this.app, this));
  }

  openGenerate(opts?: { cultureId?: string; selectorId?: string }) {
    if (this.data.cultures.length === 0) {
      new Notice("No cultures yet — create one first.");
      new FamilyTreeModal(this.app, this).open();
      return;
    }
    new GenerateModal(this.app, this, opts).open();
  }

  async persist() {
    await this.saveData(this.data);
  }

  notePathFor(culture: Culture): string {
    const folder = normalizePath(this.data.settings.folder.replace(/\/+$/, ""));
    return normalizePath(`${folder}/${sanitiseNoteName(culture.name)}.md`);
  }

  glossaryPathFor(culture: Culture): string {
    const folder = normalizePath(this.data.settings.folder.replace(/\/+$/, ""));
    return normalizePath(`${folder}/${sanitiseNoteName(culture.name)} Glossary.md`);
  }

  findCultureNote(culture: Culture): TFile | null {
    const expected = this.notePathFor(culture);
    const byPath = this.app.vault.getAbstractFileByPath(expected);
    if (byPath instanceof TFile) return byPath;

    const folderPath = normalizePath(this.data.settings.folder.replace(/\/+$/, ""));
    const folder = this.app.vault.getAbstractFileByPath(folderPath);
    if (!(folder instanceof TFolder)) return null;
    for (const f of markdownFilesInFolder(folder)) {
      const cache = this.app.metadataCache.getFileCache(f);
      const id = cache?.frontmatter?.["lf-id"] as string | number | undefined;
      const kind = cache?.frontmatter?.["lf-kind"] as string | undefined;
      if ((id === culture.id || String(id) === culture.id) && kind !== "glossary") return f;
    }
    return null;
  }

  findGlossaryNote(culture: Culture): TFile | null {
    const expected = this.glossaryPathFor(culture);
    const byPath = this.app.vault.getAbstractFileByPath(expected);
    if (byPath instanceof TFile) return byPath;

    const folderPath = normalizePath(this.data.settings.folder.replace(/\/+$/, ""));
    const folder = this.app.vault.getAbstractFileByPath(folderPath);
    if (!(folder instanceof TFolder)) return null;
    for (const f of markdownFilesInFolder(folder)) {
      const cache = this.app.metadataCache.getFileCache(f);
      const id = cache?.frontmatter?.["lf-id"] as string | number | undefined;
      const kind = cache?.frontmatter?.["lf-kind"] as string | undefined;
      if ((id === culture.id || String(id) === culture.id) && kind === "glossary") return f;
    }
    return null;
  }

  hasCulturePage(culture: Culture): boolean {
    return !!this.findCultureNote(culture);
  }

  async readCultureDescription(culture: Culture): Promise<string> {
    const file = this.findCultureNote(culture);
    if (!file) return "";
    return extractDescriptionFromPage(await this.app.vault.read(file));
  }

  async writeGlossaryNote(culture: Culture): Promise<string> {
    const folder = normalizePath(this.data.settings.folder.replace(/\/+$/, ""));
    try { await this.app.vault.createFolder(folder); } catch { /* exists */ }
    const existing = this.findGlossaryNote(culture);
    const path = existing?.path ?? this.glossaryPathFor(culture);
    const prior = existing ? await this.app.vault.read(existing) : undefined;
    const content = renderGlossaryPage(culture, prior);
    if (existing) await this.app.vault.modify(existing, content);
    else await this.app.vault.create(path, content);
    return path;
  }

  async writeCultureNote(culture: Culture): Promise<string> {
    const folder = normalizePath(this.data.settings.folder.replace(/\/+$/, ""));
    try { await this.app.vault.createFolder(folder); } catch { /* exists */ }
    const existing = this.findCultureNote(culture);
    const path = existing?.path ?? this.notePathFor(culture);
    const prior = existing ? await this.app.vault.read(existing) : undefined;
    const content = renderLanguagePage(culture, this.data.cultures, prior);
    if (existing) await this.app.vault.modify(existing, content);
    else await this.app.vault.create(path, content);
    await this.writeGlossaryNote(culture);
    return path;
  }

  async openCulturePage(culture: Culture): Promise<void> {
    const path = await this.writeCultureNote(culture);
    const file = this.app.vault.getAbstractFileByPath(path);
    if (file instanceof TFile) await this.app.workspace.getLeaf(false).openFile(file);
  }

  async renameCultureAndNote(culture: Culture, newName: string, translatedName?: string): Promise<void> {
    const trimmed = newName.trim();
    if (!trimmed) { new Notice("Name can't be empty."); return; }
    if (this.data.cultures.some(c => c.id !== culture.id && c.name.toLowerCase() === trimmed.toLowerCase())) {
      new Notice("A culture with that name already exists.");
      return;
    }

    const file = this.findCultureNote(culture);
    const glossFile = this.findGlossaryNote(culture);

    renameCulture(culture, trimmed, translatedName);
    this.upsertCulture(culture);
    await this.persist();

    if (file instanceof TFile) {
      const dest = this.notePathFor(culture);
      if (file.path !== dest) {
        try { await this.app.fileManager.renameFile(file, dest); }
        catch (e) { new Notice(`Renamed culture but file rename failed: ${e instanceof Error ? e.message : String(e)}`); }
      }
    }
    if (glossFile instanceof TFile) {
      const dest = this.glossaryPathFor(culture);
      if (glossFile.path !== dest) {
        try { await this.app.fileManager.renameFile(glossFile, dest); }
        catch (e) { new Notice(`Glossary rename failed: ${e instanceof Error ? e.message : String(e)}`); }
      }
    }
    if (file || glossFile) await this.writeCultureNote(culture);
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

// ---------------------------------------------------------------- branching helpers (Child tab)

const DRIFT_LEVELS: { value: DriftLevel; label: string }[] = [
  { value: "dialect", label: "Dialect — light drift, clearly the same tongue" },
  { value: "sister", label: "Sister language — moderate drift, kin but distinct" },
  { value: "distant", label: "Distant cousin — heavy drift, related if you look closely" },
];

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

const CONTACT_TYPES: { value: ContactType; label: string }[] = [
  { value: "prestige", label: "Prestige — a ruling/administrative tongue lends downward" },
  { value: "substrate", label: "Substrate — the conquered tongue survives underneath" },
  { value: "adstrate", label: "Adstrate — neighbours trading as equals" },
];

const CONTACT_STRENGTHS: { value: number; label: string }[] = [
  { value: 0.2, label: "Light" },
  { value: 0.5, label: "Moderate" },
  { value: 0.8, label: "Heavy" },
];

const CONTACT_DOMAINS: ContactDomain[] = ["administration", "religion", "warfare", "trade", "place-features"];

/** Cultures grouped by generation ascending (Gen 0, Gen 1, …). */
function culturesByGeneration(cultures: Culture[]): { gen: number; cultures: Culture[] }[] {
  const map = new Map<number, Culture[]>();
  for (const c of cultures) {
    const g = c.generation ?? 0;
    const list = map.get(g) ?? [];
    list.push(c);
    map.set(g, list);
  }
  return [...map.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([gen, list]) => ({
      gen,
      cultures: list.slice().sort((a, b) => a.name.localeCompare(b.name)),
    }));
}

/** Keep a remembered gen tab if it still exists; otherwise fall back to oldest or newest. */
function resolveGenTab(
  preferred: number | null,
  cultures: Culture[],
  fallback: "oldest" | "newest" = "oldest",
): number {
  const groups = culturesByGeneration(cultures);
  if (groups.length === 0) return 0;
  if (preferred !== null && groups.some(g => g.gen === preferred)) return preferred;
  return fallback === "newest" ? groups[groups.length - 1].gen : groups[0].gen;
}

/** Gen 0 / Gen 1 / … strip. Returns the pane element for the active generation's content.
 *  `order: "asc"` = oldest left (Edit); `"desc"` = newest left (Generate). */
function mountGenSubTabs(
  parent: HTMLElement,
  cultures: Culture[],
  activeGen: number,
  onSelect: (gen: number) => void,
  order: "asc" | "desc" = "asc",
): { activeGen: number; pane: HTMLElement; cultures: Culture[] } {
  const groups = culturesByGeneration(cultures);
  const tabGroups = order === "desc" ? [...groups].reverse() : groups;
  const resolved = activeGen;
  const tabs = parent.createDiv({ cls: "lf-tabs lf-subtabs" });
  for (const g of tabGroups) {
    const btn = tabs.createEl("button", {
      text: `Gen ${g.gen}`,
      cls: "lf-tab" + (g.gen === resolved ? " is-active" : ""),
    });
    btn.onclick = () => onSelect(g.gen);
  }
  const pane = parent.createDiv({ cls: "lf-subtab-pane" });
  const active = groups.find(g => g.gen === resolved);
  return { activeGen: resolved, pane, cultures: active?.cultures ?? [] };
}

/** Mint a display name from a source culture's name generator; avoid collisions. */
function mintChildDisplayName(source: Culture, existing: Culture[]): string {
  const taken = new Set(existing.map(c => c.name.toLowerCase()));
  for (const g of generateBatch(source, "personal", 12)) {
    if (!taken.has(g.name.toLowerCase())) return g.name;
  }
  let fallback = placeholderName(source);
  if (taken.has(fallback.toLowerCase())) {
    fallback = `${fallback}${Math.floor(Math.random() * 90 + 10)}`;
  }
  return fallback;
}

// ---------------------------------------------------------------- create language (tabbed: New / Seeded / Child / Edit)

type CreateLangTab = "new" | "seeded" | "child" | "edit";

class CreateLanguageModal extends Modal {
  plugin: LanguageForgePlugin;
  tab: CreateLangTab;
  traits: SeedTraits = {
    name: "", mood: "soft", register: "balanced",
    familiarity: "familiar", environment: "none", packs: [],
  };
  pasted = "";
  editDescriptions = new Map<string, string>();
  editGen: number | null = null;

  // Child tab — branch (derive) or contact (directed borrowing)
  childMode: "branch" | "contact" = "branch";
  branchParentId = "";
  childName = "";
  childDriftLevel: DriftLevel = "sister";
  childDriftPackId = "";
  childDriftPackTouched = false;
  childSpellingMode: SpellingMode = "phonetic";
  childEnvironment = "none";
  // Contact mode (Gap 3) — donor lends to borrower
  contactDonorId = "";
  contactBorrowerId = "";
  contactType: ContactType = "prestige";
  contactStrength = 0.5;
  contactDomains = new Set<ContactDomain>();
  contactPreview: ContactPreview | null = null;
  contactPendingEdge: ContactEdge | null = null;

  constructor(
    app: App,
    plugin: LanguageForgePlugin,
    initialTab: CreateLangTab = "new",
    parentId?: string,
    initialChildMode: "branch" | "contact" = "branch",
  ) {
    super(app);
    this.plugin = plugin;
    this.tab = initialTab;
    this.childMode = initialChildMode;
    this.branchParentId = parentId ?? plugin.data.cultures[0]?.id ?? "";
    this.contactDonorId = plugin.data.cultures[0]?.id ?? "";
    this.contactBorrowerId = plugin.data.cultures[1]?.id ?? plugin.data.cultures[0]?.id ?? "";
    this.childDriftPackId = this.defaultChildPack();
  }

  defaultChildPack(): string {
    const firstParent = this.plugin.data.cultures.find(c => c.id === this.branchParentId);
    const mood = firstParent?.mood;
    return (mood && MOOD_DEFAULT_DRIFT_PACK[mood]) ?? descentPackIds()[0] ?? "";
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
    const defs: { id: CreateLangTab; label: string }[] = [
      { id: "new", label: "New" },
      { id: "seeded", label: "Seeded" },
      { id: "child", label: "Child" },
      { id: "edit", label: "Edit" },
    ];
    for (const d of defs) {
      const btn = tabs.createEl("button", {
        text: d.label,
        cls: "lf-tab" + (this.tab === d.id ? " is-active" : ""),
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

  renderNewTab(parent: HTMLElement, footer: HTMLElement) {
    parent.createEl("p", {
      text: "Choose the sound of a new tongue.",
      cls: "lf-hint",
    });
    this.mountSeedTraits(parent);

    const buttons = new Setting(footer);
    buttons.addButton(b => b.setButtonText("Cancel").onClick(() => this.close()));
    buttons.addButton(b => b.setButtonText("Seed the language").setCta().onClick(() => {
      const given = this.traits.name?.trim() || "";
      if (given && this.plugin.data.cultures.some(c => c.name.toLowerCase() === given.toLowerCase())) {
        new Notice("A culture with that name already exists."); return;
      }
      const env = this.traits.environment === "none" ? "—" : this.traits.environment;
      const culture = seedCulture({ ...this.traits, name: given || undefined, environment: env });
      this.close();
      new CultureCardModal(this.app, this.plugin, culture, true).open();
    }));
  }

  renderSeededTab(parent: HTMLElement, footer: HTMLElement) {
    parent.createEl("p", {
      text: "Paste romanised names or a short paragraph. Latin letters only — the language bends to match.",
      cls: "lf-hint",
    });

    const area = parent.createEl("textarea", { cls: "lf-seeded-textarea" });
    area.rows = 12;
    area.placeholder = "Kaelith, Veyra, Kaeloth\n— or —\nThe sisters were called Elowen and Maeriel.";
    area.value = this.pasted;
    area.addEventListener("input", () => { this.pasted = area.value; });

    this.mountSeedTraits(parent);

    const buttons = new Setting(footer);
    buttons.addButton(b => b.setButtonText("Cancel").onClick(() => this.close()));
    buttons.addButton(b => b.setButtonText("Seed from text").setCta().onClick(() => {
      const parsed = parseImportInput(this.pasted);
      if (parsed.candidates.length < 2) {
        new Notice("Paste at least two romanised names (or a paragraph that contains them).");
        return;
      }
      const given = this.traits.name?.trim() || "";
      if (given && this.plugin.data.cultures.some(c => c.name.toLowerCase() === given.toLowerCase())) {
        new Notice("A culture with that name already exists."); return;
      }
      const name = given || (parsed.candidates[0] + "-kin");
      const culture = reverseSeedCulture(name, parsed.candidates, {
        mood: this.traits.mood,
        register: this.traits.register,
        familiarity: this.traits.familiarity,
        environment: this.traits.environment,
        packs: [...this.traits.packs],
      });
      this.close();
      new CultureCardModal(this.app, this.plugin, culture, true).open();
    }));
  }

  /** Shared New / Seeded trait controls — both tabs bind the same `this.traits`. */
  mountSeedTraits(parent: HTMLElement) {
    new Setting(parent).setName("Culture name")
      .setDesc("Optional. Blank → a name minted from this culture's own sounds (New) or from the paste (Seeded).")
      .addText(t => t.setPlaceholder("Velari (or leave blank)")
        .setValue(this.traits.name ?? "")
        .onChange(v => (this.traits.name = v.trim())));

    new Setting(parent).setName("Sound")
      .setDesc("The phonaesthetic mood of the language.")
      .addDropdown(d => {
        for (const m of MOODS) d.addOption(m.value, m.label);
        d.setValue(this.traits.mood).onChange(v => (this.traits.mood = v as Mood));
      });

    new Setting(parent).setName("Register")
      .setDesc("Ancient names run long with penult stress; modern names run short.")
      .addDropdown(d => {
        d.addOption("balanced", "Balanced");
        d.addOption("ancient", "Ancient");
        d.addOption("modern", "Modern");
        d.setValue(this.traits.register).onChange(v => (this.traits.register = v as Register));
      });

    new Setting(parent).setName("Familiarity")
      .setDesc("Familiar samples the curated element packs; alien builds sounds procedurally.")
      .addDropdown(d => {
        d.addOption("familiar", "Familiar (English-adjacent)");
        d.addOption("alien", "Alien (procedural)");
        d.setValue(this.traits.familiarity).onChange(v => (this.traits.familiarity = v as "familiar" | "alien"));
      });

    new Setting(parent).setName("Environment")
      .setDesc("Coastal adds seafaring words, mountain adds highland words, and so on.")
      .addDropdown(d => {
        for (const e of ENVIRONMENTS) d.addOption(e, e === "none" ? "None in particular" : e[0].toUpperCase() + e.slice(1));
        d.setValue(this.traits.environment).onChange(v => (this.traits.environment = v));
      });

    new Setting(parent)
      .setName("Word themes (optional)")
      .setDesc("Core words — kinship, virtues, nature — are always on. Stack themes to tilt what names mean.");
    for (const packName of Object.keys(SEMANTIC_PACKS)) {
      if (!SEMANTIC_PACKS[packName].additive) continue;
      new Setting(parent).setName(packName[0].toUpperCase() + packName.slice(1))
        .addToggle(t => t.setValue(this.traits.packs.includes(packName)).onChange(on => {
          if (on) {
            if (!this.traits.packs.includes(packName)) this.traits.packs.push(packName);
          } else {
            this.traits.packs = this.traits.packs.filter(p => p !== packName);
          }
        }));
    }
  }

  renderChildTab(parent: HTMLElement, footer: HTMLElement) {
    if (!this.childDriftPackTouched) this.childDriftPackId = this.defaultChildPack();

    parent.createEl("p", {
      text: "Language aging drifts one parent's sounds into a descendant. Language intermixing connects two existing languages: a donor lends vocabulary, reshaped to fit the borrower's mouth.",
      cls: "lf-hint",
    });

    const buttons = new Setting(footer);
    buttons.addButton(b => b.setButtonText("Cancel").onClick(() => this.close()));

    if (this.plugin.data.cultures.length === 0) {
      parent.createEl("p", { text: "No cultures yet — create one on the New or Seeded tab first.", cls: "lf-hint" });
      return;
    }

    const genGroups = culturesByGeneration(this.plugin.data.cultures);

    new Setting(parent).setName("Mode")
      .setDesc("Language aging creates a new language. Language intermixing links two existing ones without minting a third.")
      .addDropdown(d => {
        d.addOption("branch", "Language aging");
        d.addOption("contact", "Language intermixing");
        d.setValue(this.childMode).onChange(v => {
          this.childMode = v as "branch" | "contact";
          this.contactPreview = null;
          this.contactPendingEdge = null;
          this.render();
        });
      });

    if (this.childMode === "contact") {
      this.renderChildContact(parent, buttons);
      return;
    }

    new Setting(parent).setName("Parent language")
      .setDesc("Grouped by generation — Gen 0 are roots, higher gens are descendants.")
      .addDropdown(d => {
        const sel = d.selectEl;
        sel.empty();
        for (const group of genGroups) {
          const og = sel.createEl("optgroup");
          og.label = `Gen ${group.gen}`;
          for (const c of group.cultures) {
            og.createEl("option", { text: c.name, value: c.id });
          }
        }
        if (!this.branchParentId || !this.plugin.data.cultures.some(c => c.id === this.branchParentId)) {
          this.branchParentId = genGroups[0]?.cultures[0]?.id ?? "";
        }
        d.setValue(this.branchParentId);
        d.onChange(v => (this.branchParentId = v));
      });

    new Setting(parent).setName("New language name")
      .setDesc("Optional. Leave blank to mint a name from the parent tongue's generator.")
      .addText(t => t.setPlaceholder("Blank → auto from generator")
        .setValue(this.childName)
        .onChange(v => (this.childName = v.trim())));

    new Setting(parent).setName("Drift")
      .setDesc("How far the branch has diverged from its parent.")
      .addDropdown(d => {
        for (const lvl of DRIFT_LEVELS) d.addOption(lvl.value, lvl.label);
        d.setValue(this.childDriftLevel).onChange(v => (this.childDriftLevel = v as DriftLevel));
      });

    const packHint = parent.createEl("p", { cls: "lf-hint" });
    const updatePackHint = () => {
      const pack = DRIFT_PACKS[this.childDriftPackId];
      packHint.setText(pack ? `${pack.plainDescription} ${pack.why}` : "");
    };
    new Setting(parent).setName("Sound-change pack")
      .setDesc("The kind of sound change this branch undergoes.")
      .addDropdown(d => {
        for (const id of descentPackIds()) d.addOption(id, DRIFT_PACK_LABELS[id] ?? id);
        d.setValue(this.childDriftPackId).onChange(v => {
          this.childDriftPackId = v;
          this.childDriftPackTouched = true;
          updatePackHint();
        });
      });
    updatePackHint();

    new Setting(parent).setName("Spelling")
      .setDesc("Phonetic respells everything to the worn sound; etymological keeps compound roots more visible.")
      .addDropdown(d => {
        d.addOption("phonetic", "Phonetic (respell to the worn sound)");
        d.addOption("etymological", "Etymological (keep compound roots visible)");
        d.setValue(this.childSpellingMode).onChange(v => (this.childSpellingMode = v as SpellingMode));
      });

    new Setting(parent).setName("Environment")
      .setDesc("Optional — adds regional word themes on top of the parent's vocabulary.")
      .addDropdown(d => {
        for (const e of ENVIRONMENTS) d.addOption(e, e === "none" ? "None in particular" : e[0].toUpperCase() + e.slice(1));
        d.setValue(this.childEnvironment).onChange(v => (this.childEnvironment = v));
      });

    buttons.addButton(b => b.setButtonText("Derive language").setCta().onClick(() => {
      const envPack = ENV_DEFAULT_PACK[this.childEnvironment];
      const overrides: { environment?: string; packs?: string[] } = {};
      if (this.childEnvironment !== "none") {
        overrides.environment = this.childEnvironment;
        if (envPack) overrides.packs = [envPack];
      }
      const parentCulture = this.plugin.data.cultures.find(c => c.id === this.branchParentId);
      if (!parentCulture) { new Notice("Pick a parent language first."); return; }
      let name = this.childName.trim();
      if (!name) name = mintChildDisplayName(parentCulture, this.plugin.data.cultures);
      else if (this.plugin.data.cultures.some(c => c.name.toLowerCase() === name.toLowerCase())) {
        new Notice("A culture with that name already exists."); return;
      }
      const culture = deriveCulture(
        parentCulture, name, this.childDriftLevel, [this.childDriftPackId], overrides, this.childSpellingMode,
      );
      this.close();
      new CultureCardModal(this.app, this.plugin, culture, true).open();
    }));
  }

  renderChildContact(parent: HTMLElement, buttons: Setting) {
    if (this.plugin.data.cultures.length < 2) {
      parent.createEl("p", {
        text: "Intermixing needs at least two languages. Create another on the New or Seeded tab first.",
        cls: "lf-hint",
      });
      return;
    }

    const genGroups = culturesByGeneration(this.plugin.data.cultures);
    if (!this.plugin.data.cultures.some(c => c.id === this.contactDonorId)) {
      this.contactDonorId = genGroups[0]?.cultures[0]?.id ?? "";
    }
    const donor = this.plugin.data.cultures.find(c => c.id === this.contactDonorId);
    const donorGen = donor?.generation ?? 0;
    const peerCultures = (genGroups.find(g => g.gen === donorGen)?.cultures ?? [])
      .filter(c => c.id !== this.contactDonorId);
    if (!peerCultures.some(c => c.id === this.contactBorrowerId)) {
      this.contactBorrowerId = peerCultures[0]?.id ?? "";
    }

    const fillByGeneration = (d: DropdownComponent, cultures: Culture[], groupLabel?: string) => {
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

    new Setting(parent).setName("Donor")
      .setDesc("The language that lends vocabulary (primary / prestige side when type is prestige).")
      .addDropdown(d => {
        fillByGeneration(d, this.plugin.data.cultures);
        d.setValue(this.contactDonorId).onChange(v => {
          this.contactDonorId = v;
          this.contactPreview = null;
          this.contactPendingEdge = null;
          this.render();
        });
      });
    new Setting(parent).setName("Borrower")
      .setDesc("Receives reshaped loanwords — only languages from the donor's generation.")
      .addDropdown(d => {
        if (peerCultures.length === 0) {
          d.addOption("", "(no other language in this generation)");
          d.setDisabled(true);
        } else {
          fillByGeneration(d, peerCultures, `Gen ${donorGen}`);
          d.setValue(this.contactBorrowerId).onChange(v => {
            this.contactBorrowerId = v;
            this.contactPreview = null;
            this.contactPendingEdge = null;
          });
        }
      });
    if (peerCultures.length === 0) {
      parent.createEl("p", {
        text: "Pick a donor that shares its generation with at least one other language.",
        cls: "lf-hint",
      });
    }
    new Setting(parent).setName("Contact type")
      .addDropdown(d => {
        for (const t of CONTACT_TYPES) d.addOption(t.value, t.label);
        d.setValue(this.contactType).onChange(v => {
          this.contactType = v as ContactType;
          this.contactPreview = null;
          this.contactPendingEdge = null;
        });
      });
    new Setting(parent).setName("Strength")
      .setDesc("How much of the donor's vocabulary crosses — how heavily one side impacts the other.")
      .addDropdown(d => {
        for (const s of CONTACT_STRENGTHS) d.addOption(String(s.value), s.label);
        d.setValue(String(this.contactStrength)).onChange(v => {
          this.contactStrength = Number(v);
          this.contactPreview = null;
          this.contactPendingEdge = null;
        });
      });
    parent.createEl("p", { text: "Which kinds of words cross:", cls: "lf-hint" });
    for (const dom of CONTACT_DOMAINS) {
      new Setting(parent).setName(dom)
        .addToggle(t => t.setValue(this.contactDomains.has(dom)).onChange(on => {
          if (on) this.contactDomains.add(dom); else this.contactDomains.delete(dom);
          this.contactPreview = null;
          this.contactPendingEdge = null;
        }));
    }

    if (this.contactPreview) {
      const borrower = this.plugin.data.cultures.find(c => c.id === this.contactBorrowerId);
      if (borrower) {
        parent.createEl("h3", { text: `Loanwords ${borrower.name} would gain` });
        const grid = parent.createDiv({ cls: "lf-specimens" });
        for (const s of this.contactPreview.samples) {
          const chip = grid.createDiv({ cls: "lf-specimen" });
          chip.createDiv({ text: s.name, cls: "lf-specimen-name" });
          chip.createDiv({ text: s.pronunciation, cls: "lf-specimen-pron" });
        }
        parent.createEl("p", {
          text: `Words: ${this.contactPreview.loanedRoots.map(r => `${r.form} = ${r.meaning}`).join("  ·  ") || "(none survived the borrower's phonotactics)"}`,
          cls: "lf-hint",
        });
      }
    }

    buttons.addButton(b => {
      b.setButtonText("Preview").setCta().onClick(() => {
        const donorCulture = this.plugin.data.cultures.find(c => c.id === this.contactDonorId);
        const borrowerCulture = this.plugin.data.cultures.find(c => c.id === this.contactBorrowerId);
        if (!donorCulture || !borrowerCulture) { new Notice("Pick a donor and a borrower first."); return; }
        if (donorCulture.id === borrowerCulture.id) { new Notice("Donor and borrower must be different languages."); return; }
        const edge: ContactEdge = {
          id: `${donorCulture.id}->${borrowerCulture.id}::${Date.now().toString(36)}`,
          donorId: donorCulture.id,
          borrowerId: borrowerCulture.id,
          contactType: this.contactType,
          strength: this.contactStrength,
          domains: [...this.contactDomains],
        };
        this.contactPreview = previewContactEdge(donorCulture, borrowerCulture, edge);
        this.contactPendingEdge = edge;
        this.render();
      });
      if (peerCultures.length === 0) b.setDisabled(true);
    });

    if (this.contactPreview) {
      buttons.addButton(b => b.setButtonText("Save contact edge").onClick(async () => {
        const edge = this.contactPendingEdge;
        if (!edge) return;
        this.plugin.data.contactEdges.push(edge);
        await this.plugin.persist();
        new Notice("Contact edge saved.");
      }));
      buttons.addButton(b => b.setButtonText("Add loanwords").onClick(async () => {
        const borrower = this.plugin.data.cultures.find(c => c.id === this.contactBorrowerId);
        if (!borrower || !this.contactPreview) return;
        if (this.contactPreview.loanedRoots.length === 0) { new Notice("Nothing to add."); return; }
        acceptLoanedRoots(borrower, this.contactPreview.loanedRoots);
        this.plugin.upsertCulture(borrower);
        await this.plugin.persist();
        await this.plugin.writeCultureNote(borrower);
        new Notice(`${this.contactPreview.loanedRoots.length} loanword(s) added to ${borrower.name}.`);
      }));
    }
  }

  async renderEditTab(parent: HTMLElement) {
    if (this.plugin.data.cultures.length === 0) {
      parent.createEl("p", {
        text: "No languages yet. Create one on the New or Seeded tab.",
        cls: "lf-hint",
      });
      return;
    }

    parent.createEl("p", { text: "Loading…", cls: "lf-hint lf-edit-loading" });
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
      "asc",
    );

    if (cultures.length === 0) {
      pane.createEl("p", { text: "No languages in this generation.", cls: "lf-hint" });
      return;
    }

    for (const c of cultures) {
      const block = pane.createDiv({ cls: "lf-gen-row" });
      block.createEl("h3", { text: c.name, cls: "lf-gen-name" });
      block.createEl("p", {
        text: c.summary?.trim() || "—",
        cls: "lf-gen-summary",
      });
      const desc = this.editDescriptions.get(c.id)?.trim();
      block.createEl("p", {
        text: desc || "No description yet — add one under ## Description on the language page.",
        cls: "lf-gen-notes",
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

  onClose() { this.contentEl.empty(); }
}

// ---------------------------------------------------------------- the culture card

class CultureCardModal extends Modal {
  plugin: LanguageForgePlugin;
  culture: Culture;
  isNew: boolean;
  /** When opened from another modal, keep that modal underneath. */
  hostModal?: Modal;
  onDismiss?: () => void;

  constructor(
    app: App,
    plugin: LanguageForgePlugin,
    culture: Culture,
    isNew: boolean,
    opts?: { hostModal?: Modal; onDismiss?: () => void },
  ) {
    super(app);
    this.plugin = plugin;
    this.culture = culture;
    this.isNew = isNew;
    this.hostModal = opts?.hostModal;
    this.onDismiss = opts?.onDismiss;
  }

  render() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("languageforge-modal");
    const card = makeCultureCard(this.culture);

    const titleRow = contentEl.createDiv({ cls: "lf-card-title-row" });
    titleRow.createEl("h2", { text: this.culture.name });

    if (this.culture.translatedName?.trim()) {
      contentEl.createEl("p", {
        text: this.culture.translatedName.trim(),
        cls: "lf-translated-name",
      });
    }

    contentEl.createEl("p", { text: card.summary, cls: "lf-onebreath" });

    if (this.culture.fromNames?.length) {
      contentEl.createEl("p", {
        text: `Seeded from: ${this.culture.fromNames.join(", ")}`,
        cls: "lf-hint",
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
    const themeList = card.packs.length
      ? card.packs.map(p => p[0].toUpperCase() + p.slice(1)).join(" · ")
      : "Core only";
    themes.createDiv({ text: themeList, cls: "lf-themes-body" });

    if (!this.isNew) {
      const hasPage = this.plugin.hasCulturePage(this.culture);
      const pageCard = side.createDiv({
        cls: "lf-specimen lf-specimen-page",
        attr: { role: "button", tabindex: "0", title: hasPage ? "Open language page" : "Create language page" },
      });
      pageCard.createDiv({
        text: hasPage ? "Page" : "Create page",
        cls: "lf-page-card-label",
      });
      const openPage = async () => {
        if (hasPage) {
          const host = this.hostModal;
          this.onDismiss = undefined;
          this.close();
          host?.close();
          await this.plugin.openCulturePage(this.culture);
        } else {
          await this.plugin.openCulturePage(this.culture);
          this.render();
        }
      };
      pageCard.onclick = () => { void openPage(); };
      pageCard.onkeydown = (ev: KeyboardEvent) => {
        if (ev.key === "Enter" || ev.key === " ") {
          ev.preventDefault();
          void openPage();
        }
      };
    }

    if (card.glossaryPreview.length > 0) {
      const gl = contentEl.createDiv({ cls: "lf-glossary" });
      gl.createSpan({ text: "Words: ", cls: "lf-hint" });
      gl.createSpan({
        text: card.glossaryPreview.map(g => `${g.form} = ${g.meaning}`).join("  ·  "),
        cls: "lf-glossary-items",
      });
    }

    if (this.isNew) {
      const actions = contentEl.createDiv({ cls: "lf-card-actions" });
      const addBtn = (label: string, onClick: () => void | Promise<void>, cta = false) => {
        const btn = actions.createEl("button", { text: label });
        if (cta) btn.addClass("mod-cta");
        btn.onclick = () => { void onClick(); };
        return btn;
      };
      addBtn("Cancel", () => {
        this.close();
        new Notice("Culture discarded — nothing was saved.");
      });
      addBtn("Accept culture", async () => {
        this.plugin.upsertCulture(this.culture);
        await this.plugin.persist();
        this.close();
        new Notice(`${this.culture.name} saved.`);
        new CreatePagePromptModal(this.app, this.plugin, this.culture).open();
      }, true);
    }
  }

  onOpen() {
    // Above Generate (+20) or Languages/Family tree (base): claim the next stacking tier.
    if (this.hostModal?.containerEl.hasClass("lf-stacked-modal-container")
      || this.hostModal?.containerEl.hasClass("lf-stacked-modal-nested")) {
      this.containerEl.addClass("lf-stacked-modal-nested");
    } else {
      this.containerEl.addClass("lf-stacked-modal-container");
    }
    this.render();
  }
  onClose() {
    this.contentEl.empty();
    this.onDismiss?.();
  }
}

/** After accepting a new language — ask before writing vault notes. */
class CreatePagePromptModal extends Modal {
  plugin: LanguageForgePlugin;
  culture: Culture;

  constructor(app: App, plugin: LanguageForgePlugin, culture: Culture) {
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
      cls: "lf-hint",
    });
    const buttons = new Setting(contentEl);
    buttons.addButton(b => b.setButtonText("Not now").onClick(() => this.close()));
    buttons.addButton(b => b.setButtonText("Create language page").setCta().onClick(async () => {
      this.close();
      await this.plugin.openCulturePage(this.culture);
    }));
  }

  onClose() { this.contentEl.empty(); }
}

/** Prompt for a new display name. Caller applies renameCulture / renameCultureAndNote. */
class RenameCultureModal extends Modal {
  plugin: LanguageForgePlugin;
  culture: Culture;
  onDone: (name: string, translatedName: string) => void | Promise<void>;
  value: string;
  translated = "";
  private nameInput: HTMLInputElement | null = null;
  private translatedInput: HTMLInputElement | null = null;

  constructor(
    app: App,
    plugin: LanguageForgePlugin,
    culture: Culture,
    onDone: (name: string, translatedName: string) => void | Promise<void>,
  ) {
    super(app);
    this.plugin = plugin;
    this.culture = culture;
    this.onDone = onDone;
    this.value = culture.name;
    this.translated = culture.translatedName ?? "";
  }

  private setName(name: string) {
    this.value = name;
    if (this.nameInput) this.nameInput.value = name;
  }

  private setTranslated(text: string) {
    this.translated = text;
    if (this.translatedInput) this.translatedInput.value = text;
  }

  private pickDisplayForm(form: string): string {
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
      attr: { placeholder: "Language name" },
    });
    this.nameInput = nameBox;
    nameBox.addEventListener("input", () => { this.value = nameBox.value; });
    nameBox.focus();

    left.createEl("h3", { text: "Name", cls: "lf-rename-field-label" });

    new Setting(left).setName("Translated name")
      .setDesc("Optional English meaning of this culture's name.")
      .addText(t => {
        this.translatedInput = t.inputEl;
        t.setPlaceholder("e.g. People of the river")
          .setValue(this.translated)
          .onChange(v => (this.translated = v));
      });

    new Setting(left)
      .addButton(b => b.setButtonText("Random word").onClick(() => {
        const roots = this.culture.roots;
        let name = "";
        if (roots.length > 0) {
          const r = roots[Math.floor(Math.random() * roots.length)];
          name = this.pickDisplayForm(r.form);
          if (r.meaning) this.setTranslated(r.meaning);
        }
        if (!name) {
          const batch = generateBatch(this.culture, "personal", 1);
          name = batch[0]?.name ?? placeholderName(this.culture);
          if (batch[0]?.gloss) this.setTranslated(batch[0].gloss);
        }
        this.setName(name);
      }));

    const buttons = new Setting(left);
    buttons.addButton(b => b.setButtonText("Cancel").onClick(() => this.close()));
    buttons.addButton(b => b.setButtonText("Rename").setCta().onClick(async () => {
      const name = this.value.trim();
      if (!name) { new Notice("Name can't be empty."); return; }
      if (this.plugin.data.cultures.some(c => c.id !== this.culture.id && c.name.toLowerCase() === name.toLowerCase())) {
        new Notice("A culture with that name already exists."); return;
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
}

// ---------------------------------------------------------------- name classes editor

class NameClassesModal extends Modal {
  plugin: LanguageForgePlugin;
  culture: Culture;
  newLabel = "";
  newLean: ClassLean = "soft";

  constructor(app: App, plugin: LanguageForgePlugin, culture: Culture) {
    super(app);
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
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("languageforge-modal");
    contentEl.createEl("h2", { text: `Name classes — ${this.culture.name}` });
    contentEl.createEl("p", {
      text: "Each class is an ending signature. Gender ships by default; add warriors, leaders, and the rest yourself.",
      cls: "lf-hint",
    });

    new Setting(contentEl).setName("Gender marking")
      .setDesc("Off hides feminine/masculine; neutral and custom classes remain.")
      .addToggle(t => t.setValue(this.culture.gendered !== false).onChange(async v => {
        this.culture.gendered = v;
        await this.save();
        this.render();
      }));

    new Setting(contentEl).setName("Default generation")
      .setDesc("How unmarked names are built. Classes can override.")
      .addDropdown(d => {
        d.addOption("mixed", "Mixed (mostly meaning)");
        d.addOption("meaning", "Always meaning");
        d.addOption("sound", "Always sound");
        d.setValue(this.culture.defaultGeneration ?? "mixed").onChange(async v => {
          this.culture.defaultGeneration = v as "sound" | "meaning" | "mixed";
          await this.save();
        });
      });

    for (const cls of this.culture.classes ?? []) {
      if (this.culture.gendered === false && cls.kind === "gender" && (cls.id === "feminine" || cls.id === "masculine")) {
        continue;
      }
      const box = contentEl.createDiv({ cls: "lf-class-card" });
      box.createEl("h3", { text: `${cls.label} (${cls.kind})` });
      const ends = resolveClassEndings(this.culture, cls).join(", ");
      box.createEl("p", { text: `Endings: ${ends}`, cls: "lf-hint" });
      const samples = classSpecimens(this.culture, cls.id, 2);
      if (samples.length) box.createEl("p", { text: `Samples: ${samples.join(", ")}`, cls: "lf-hint" });

      new Setting(box).setName("Ending source")
        .addDropdown(d => {
          d.addOption("generate", "Generated");
          d.addOption("inherit", "Inherit from…");
          d.addOption("manual", "Manual");
          d.setValue(cls.endingSource).onChange(async v => {
            editClass(this.culture, cls.id, { endingSource: v as NameClass["endingSource"] });
            if (v === "generate" && !cls.endings?.length) {
              regenerateClassEndings(this.culture, cls.id, cls.id === "masculine" ? "hard" : "soft");
            }
            await this.save();
            this.render();
          });
        });

      if (cls.endingSource === "inherit") {
        new Setting(box).setName("Inherit from")
          .addDropdown(d => {
            d.addOption("", "—");
            for (const other of this.culture.classes ?? []) {
              if (other.id !== cls.id) d.addOption(other.id, other.label);
            }
            d.setValue(cls.inheritFrom ?? "").onChange(async v => {
              editClass(this.culture, cls.id, { inheritFrom: v || undefined });
              await this.save();
              this.render();
            });
          });
      }

      if (cls.endingSource === "manual") {
        new Setting(box).setName("Endings")
          .setDesc("Comma-separated, with leading hyphens (e.g. -lia, -mira).")
          .addText(t => t.setValue((cls.endings ?? []).join(", ")).onChange(async v => {
            const endings = v.split(",").map(s => s.trim()).filter(Boolean)
              .map(e => e.startsWith("-") ? e : `-${e}`);
            editClass(this.culture, cls.id, { endings });
            await this.save();
          }));
      }

      new Setting(box).setName("Generation")
        .setDesc("Meaning-bearing names let root policy steer concepts.")
        .addDropdown(d => {
          d.addOption("", "Inherit culture default");
          d.addOption("sound", "Sound");
          d.addOption("meaning", "Meaning");
          d.addOption("mixed", "Mixed");
          d.setValue(cls.generation ?? "").onChange(async v => {
            editClass(this.culture, cls.id, {
              generation: (v || undefined) as NameClass["generation"],
            });
            await this.save();
          });
        });

      new Setting(box).setName("Root policy mode")
        .addDropdown(d => {
          d.addOption("", "None");
          d.addOption("favour", "Favour");
          d.addOption("lock", "Lock");
          d.setValue(cls.rootPolicy?.mode ?? "").onChange(async v => {
            if (!v) {
              editClass(this.culture, cls.id, { rootPolicy: undefined });
            } else {
              editClass(this.culture, cls.id, {
                rootPolicy: {
                  mode: v as "favour" | "lock",
                  include: cls.rootPolicy?.include?.length ? cls.rootPolicy.include : ["virtue"],
                  exclude: cls.rootPolicy?.exclude,
                },
              });
            }
            await this.save();
            this.render();
          });
        });

      if (cls.rootPolicy) {
        new Setting(box).setName("Include")
          .setDesc("Packs, tags, or concepts — comma-separated.")
          .addText(t => t.setValue(cls.rootPolicy!.include.join(", ")).onChange(async v => {
            const include = v.split(",").map(s => s.trim()).filter(Boolean);
            editClass(this.culture, cls.id, {
              rootPolicy: { ...cls.rootPolicy!, include: include.length ? include : ["virtue"] },
            });
            await this.save();
          }));
        new Setting(box).setName("Exclude")
          .addText(t => t.setValue((cls.rootPolicy!.exclude ?? []).join(", ")).onChange(async v => {
            const exclude = v.split(",").map(s => s.trim()).filter(Boolean);
            editClass(this.culture, cls.id, {
              rootPolicy: { ...cls.rootPolicy!, exclude: exclude.length ? exclude : undefined },
            });
            await this.save();
          }));
      }

      const row = new Setting(box);
      row.addButton(b => b.setButtonText("Reroll endings").onClick(async () => {
        const lean: ClassLean = cls.id === "masculine" ? "hard" : cls.id === "feminine" ? "soft" : "soft";
        regenerateClassEndings(this.culture, cls.id, lean);
        await this.save();
        this.render();
      }));
      if (cls.kind === "class" || (cls.kind === "gender" && cls.id !== "neutral")) {
        // Allow removing custom classes; gender pair can be toggled off instead,
        // but removing custom is the main path. Also allow removing gender entries if user wants.
        if (cls.kind === "class") {
          row.addButton(b => b.setButtonText("Remove").setDestructive().onClick(async () => {
            removeClass(this.culture, cls.id);
            await this.save();
            this.render();
          }));
        }
      }
    }

    contentEl.createEl("h3", { text: "Add a class" });
    new Setting(contentEl).setName("Label")
      .addText(t => t.setPlaceholder("warriors").onChange(v => (this.newLabel = v)));
    new Setting(contentEl).setName("Lean")
      .addDropdown(d => {
        for (const lean of ["soft", "hard", "long", "short", "exotic"] as ClassLean[]) {
          d.addOption(lean, lean[0].toUpperCase() + lean.slice(1));
        }
        d.setValue(this.newLean).onChange(v => (this.newLean = v as ClassLean));
      });
    new Setting(contentEl)
      .addButton(b => b.setButtonText("Add class").setCta().onClick(async () => {
        if (!this.newLabel.trim()) { new Notice("Give the class a name."); return; }
        addClass(this.culture, this.newLabel.trim(), this.newLean);
        this.newLabel = "";
        await this.save();
        this.render();
      }))
      .addButton(b => b.setButtonText("Close").onClick(() => this.close()));
  }

  onOpen() { this.render(); }
  onClose() { this.contentEl.empty(); }
}

// ---------------------------------------------------------------- import names into a language

class ImportNamesModal extends Modal {
  plugin: LanguageForgePlugin;
  culture: Culture;
  pasted = "";

  constructor(app: App, plugin: LanguageForgePlugin, culture: Culture) {
    super(app);
    this.plugin = plugin;
    this.culture = culture;
  }

  renderPreview(host: HTMLElement) {
    host.empty();
    const { candidates, rejected } = parseImportInput(this.pasted);
    if (!this.pasted.trim()) {
      host.createEl("p", { text: "Nothing pasted yet.", cls: "lf-hint" });
      return;
    }
    host.createEl("p", {
      text: `Will import ${candidates.length} name${candidates.length === 1 ? "" : "s"}` +
        (rejected.length ? `; skip ${rejected.length} non-romanised` : "") + ".",
      cls: "lf-hint",
    });
    if (candidates.length) {
      host.createEl("p", { text: candidates.join(", "), cls: "lf-glossary-items" });
    }
    if (rejected.length) {
      host.createEl("p", {
        text: `Skipped (need Latin letters): ${rejected.join(", ")}`,
        cls: "lf-hint",
      });
    }
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.addClass("languageforge-modal");
    contentEl.createEl("h2", { text: `Import into ${this.culture.name}` });
    contentEl.createEl("p", {
      text: "Paste romanised names (or prose containing them). Their sounds bend this language; the names themselves are reserved. Non-Latin script is skipped.",
      cls: "lf-hint",
    });

    new Setting(contentEl).setName("Names or text")
      .setDesc("Comma- or line-separated, or a short paragraph of romanised words.")
      .addTextArea(t => {
        t.setPlaceholder("Kaelith, Veyra, Kaeloth\n— or —\nThe sisters were called Elowen and Maeriel.");
        t.inputEl.rows = 5;
        t.onChange(v => {
          this.pasted = v;
          this.renderPreview(preview);
        });
      });

    const preview = contentEl.createDiv({ cls: "lf-import-preview" });
    this.renderPreview(preview);

    const buttons = new Setting(contentEl);
    buttons.addButton(b => b.setButtonText("Cancel").onClick(() => this.close()));
    buttons.addButton(b => b.setButtonText("Bend the sounds").setCta().onClick(async () => {
      const previewParse = parseImportInput(this.pasted);
      if (previewParse.candidates.length === 0) {
        new Notice(previewParse.rejected.length
          ? "Only non-romanised text found — use Latin letters (or romaji)."
          : "Paste at least one romanised name.");
        return;
      }
      const result = importNames(this.culture, this.pasted);
      this.plugin.upsertCulture(this.culture);
      await this.plugin.persist();
      await this.plugin.writeCultureNote(this.culture);
      this.close();
      const skip = result.rejected.length ? ` (skipped ${result.rejected.length})` : "";
      new Notice(
        `Imported ${result.accepted.length} into ${this.culture.name}` +
        (result.segmented ? ` — ${result.segmented} shaped the phonology` : "") +
        skip + ".",
      );
      await this.plugin.openCulturePage(this.culture);
    }));
  }

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
  spellingMode: SpellingMode = "phonetic";
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

    new Setting(contentEl).setName("Spelling")
      .setDesc("Etymological keeps blended-compound spellings visible; phonetic respells everything to the worn sound.")
      .addDropdown(d => {
        d.addOption("phonetic", "Phonetic (respell to the worn sound)");
        d.addOption("etymological", "Etymological (keep compound roots visible)");
        d.setValue(this.spellingMode).onChange(v => (this.spellingMode = v as SpellingMode));
      });

    new Setting(contentEl).addButton(b => b.setButtonText("Preview").setCta().onClick(() => {
      this.snapshot = ageCulture(this.culture, this.packId, this.driftLevel, "personal", this.spellingMode);
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

// ---------------------------------------------------------------- contact graph (Gap 3) — lives on Child tab “Connect via contact”

// ---------------------------------------------------------------- family tree

class FamilyTreeModal extends Modal {
  plugin: LanguageForgePlugin;

  constructor(app: App, plugin: LanguageForgePlugin) {
    super(app);
    this.plugin = plugin;
  }

  onOpen() {
    this.modalEl.addClass("lf-languages-modal");
    this.modalEl.addClass("lf-family-tree-modal");
    this.render();
  }

  onClose() { this.contentEl.empty(); }

  render() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("languageforge-modal");

    const titleRow = contentEl.createDiv({ cls: "lf-modal-title-row" });
    titleRow.createEl("h2", { text: "Languages", cls: "lf-modal-title" });
    const addBtn = titleRow.createEl("button", {
      cls: "lf-modal-title-action",
      attr: { type: "button", title: "Create language", "aria-label": "Create language" },
    });
    setIcon(addBtn, "plus");
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
        cls: "lf-hint",
      });
      return;
    }

    renderFamilyTreeView(panes, this.plugin.data.cultures, (cultureId) => {
      const culture = this.plugin.data.cultures.find(c => c.id === cultureId);
      if (!culture) return;
      // Keep the family tree open; Generate is its own stacked window.
      this.plugin.openGenerate({ cultureId: culture.id });
    });
  }
}

// ---------------------------------------------------------------- generate (nameForge-style single screen)

type HubSelector =
  | { kind: "class"; classId: string }
  | { kind: "category"; category: Category; placeType?: PlaceType };

type HubPackOption = {
  key: string;
  cultureId: string;
  selectorId: string;
  label: string;
  sel: HubSelector;
};

function hubSelectorsFor(culture: Culture): { id: string; label: string; sel: HubSelector }[] {
  ensureCultureClasses(culture);
  const out: { id: string; label: string; sel: HubSelector }[] = [];
  for (const cls of visibleClasses(culture)) {
    out.push({ id: `class:${cls.id}`, label: cls.label, sel: { kind: "class", classId: cls.id } });
  }
  out.push({ id: "cat:house", label: "houses", sel: { kind: "category", category: "house" } });
  out.push({ id: "cat:place", label: "places", sel: { kind: "category", category: "place", placeType: "settlement" } });
  out.push({ id: "cat:title", label: "titles", sel: { kind: "category", category: "title" } });
  return out;
}

function hubPackOptions(cultures: Culture[]): HubPackOption[] {
  const out: HubPackOption[] = [];
  for (const c of cultures) {
    for (const o of hubSelectorsFor(c)) {
      out.push({
        key: `${c.id}::${o.id}`,
        cultureId: c.id,
        selectorId: o.id,
        label: `${c.name} - ${o.label}`,
        sel: o.sel,
      });
    }
  }
  return out;
}

function runHubBatch(
  plugin: LanguageForgePlugin,
  culture: Culture,
  sel: HubSelector,
  count?: number,
): GeneratedName[] {
  ensureCultureClasses(culture);
  const n = count ?? plugin.data.settings.batchSize;
  if (sel.kind === "class") {
    return generateBatch(culture, "personal", n, undefined, sel.classId);
  }
  if (sel.category === "place") {
    const src = resolvePlaceSourceCulture(culture, plugin.data.cultures, sel.placeType ?? "settlement");
    return generateBatch(src, "place", n, undefined);
  }
  return generateBatch(culture, sel.category, n, undefined);
}

function formatGeneratedLine(g: GeneratedName): string {
  const gloss = g.gloss?.trim();
  if (gloss) return `${g.name} (${g.pronunciation}) (${gloss})`;
  return `${g.name} (${g.pronunciation})`;
}

const HUB_BATCH_COUNTS = [10, 15, 25, 50, 100] as const;

/** Single-screen generate: culture–pack dropdown, quantity, results, insert actions. */
class GenerateModal extends Modal {
  plugin: LanguageForgePlugin;
  activeGen: number | null = null;
  packKey = "";
  batchCount = 25;
  batch: GeneratedName[] = [];
  resultsEl: HTMLElement | null = null;
  clearResultsSelection: () => void = () => {};

  constructor(
    app: App,
    plugin: LanguageForgePlugin,
    opts?: { cultureId?: string; selectorId?: string },
  ) {
    super(app);
    this.plugin = plugin;
    const cultures = plugin.data.cultures;
    const pre = opts?.cultureId ? cultures.find(c => c.id === opts.cultureId) : undefined;
    this.activeGen = resolveGenTab(
      pre ? (pre.generation ?? 0) : null,
      cultures,
      "newest",
    );
    const packs = this.packsForActiveGen();
    if (opts?.cultureId) {
      const want = opts.selectorId
        ? `${opts.cultureId}::${opts.selectorId}`
        : packs.find(p => p.cultureId === opts.cultureId)?.key;
      if (want && packs.some(p => p.key === want)) this.packKey = want;
    }
    if (!this.packKey) this.packKey = packs[0]?.key ?? "";
  }

  culturesForActiveGen(): Culture[] {
    this.activeGen = resolveGenTab(this.activeGen, this.plugin.data.cultures, "newest");
    const group = culturesByGeneration(this.plugin.data.cultures).find(g => g.gen === this.activeGen);
    return group?.cultures ?? [];
  }

  packsForActiveGen(): HubPackOption[] {
    return hubPackOptions(this.culturesForActiveGen());
  }

  currentPack(): HubPackOption | undefined {
    return this.packsForActiveGen().find(p => p.key === this.packKey)
      ?? hubPackOptions(this.plugin.data.cultures).find(p => p.key === this.packKey);
  }

  currentCulture(): Culture | undefined {
    const pack = this.currentPack();
    if (!pack) return undefined;
    return this.plugin.data.cultures.find(c => c.id === pack.cultureId);
  }

  registryCulture(): Culture | undefined {
    const pack = this.currentPack();
    const culture = this.currentCulture();
    if (!pack || !culture) return undefined;
    if (pack.sel.kind === "category" && pack.sel.category === "place") {
      return resolvePlaceSourceCulture(
        culture,
        this.plugin.data.cultures,
        pack.sel.placeType ?? "settlement",
      );
    }
    return culture;
  }

  onOpen() {
    this.modalEl.addClass("lf-generate-modal");
    // Sit above Family Tree / Languages when those are open; leave room for the culture card above.
    this.containerEl.addClass("lf-stacked-modal-container");
    this.render();
  }

  onClose() { this.contentEl.empty(); }

  render() {
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
    if (!packs.some(p => p.key === this.packKey)) this.packKey = packs[0]?.key ?? "";

    const options = contentEl.createDiv({ cls: "lf-generate-options" });

    const packRow = options.createDiv({ cls: "lf-generate-pack-row" });
    const genSelect = packRow.createEl("select", {
      cls: "dropdown lf-generate-gen-select",
      attr: { "aria-label": "Generation" },
    });
    for (const g of genGroups) {
      const opt = genSelect.createEl("option", { text: `Gen ${g.gen}`, value: String(g.gen) });
      if (g.gen === this.activeGen) opt.selected = true;
    }
    genSelect.onchange = () => {
      this.activeGen = Number(genSelect.value);
      this.packKey = this.packsForActiveGen()[0]?.key ?? "";
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
        "aria-label": "Language info",
      },
    });
    setIcon(infoBtn, "info");
    infoBtn.disabled = !this.currentCulture();
    infoBtn.onclick = () => {
      const culture = this.currentCulture();
      if (!culture) return;
      new CultureCardModal(this.app, this.plugin, culture, false, {
        hostModal: this,
      }).open();
    };

    const quantity = options.createDiv({ cls: "lf-toggle-panel lf-quantity-toggle" });
    for (const n of HUB_BATCH_COUNTS) {
      const btn = quantity.createEl("button", {
        text: String(n),
        cls: "lf-toggle-button" + (n === this.batchCount ? " is-active" : ""),
        attr: { type: "button", "aria-pressed": n === this.batchCount ? "true" : "false" },
      });
      btn.onclick = () => {
        this.batchCount = n;
        quantity.querySelectorAll(".lf-toggle-button").forEach(el => {
          const b = el as HTMLButtonElement;
          const active = b.textContent === String(n);
          b.toggleClass("is-active", active);
          b.setAttribute("aria-pressed", active ? "true" : "false");
        });
      };
    }

    const genBtn = options.createEl("button", {
      text: "Generate",
      cls: "lf-generate-button",
      attr: { type: "button" },
    });
    genBtn.disabled = packs.length === 0;
    genBtn.onclick = () => this.runGenerate();

    this.resultsEl = contentEl.createDiv({ cls: "lf-generate-results" });
    this.renderResults(
      this.batch,
      this.batch.length === 0 ? "Generate names to see them here." : undefined,
    );
  }

  runGenerate() {
    const pack = this.currentPack();
    const culture = this.currentCulture();
    if (!pack || !culture) {
      new Notice("Select a culture and pack first.");
      return;
    }
    this.batch = runHubBatch(this.plugin, culture, pack.sel, this.batchCount);
    this.renderResults(
      this.batch,
      this.batch.length === 0 ? "Nothing passed the gates — try another pack." : undefined,
    );
  }

  renderResults(names: GeneratedName[], placeholderMessage?: string) {
    if (!this.resultsEl) return;
    this.resultsEl.empty();

    const list = this.resultsEl.createEl("ul", { cls: "lf-results-list" });
    const actions = this.resultsEl.createDiv({ cls: "lf-results-actions" });
    const buttons = actions.createDiv({ cls: "lf-results-buttons" });

    const insertBtn = buttons.createEl("button", {
      text: "Insert",
      cls: "lf-text-button",
      attr: { type: "button", title: "Insert selected name" },
    });
    const checklistBtn = buttons.createEl("button", {
      text: "Checklist",
      cls: "lf-text-button",
      attr: { type: "button", title: "Insert checklist" },
    });
    const listBtn = buttons.createEl("button", {
      text: "List",
      cls: "lf-text-button",
      attr: { type: "button", title: "Insert bullet list" },
    });

    const selectedNames = (): GeneratedName[] => {
      const out: GeneratedName[] = [];
      list.querySelectorAll("li.is-selected").forEach(el => {
        const i = Number((el as HTMLElement).dataset.index);
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
      list.querySelectorAll("li.is-selected").forEach(el => el.removeClass("is-selected"));
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
      const [g] = selectedNames();
      if (!g) return;
      const editor = this.app.workspace.activeEditor?.editor
        ?? this.app.workspace.getActiveViewOfType(MarkdownView)?.editor;
      if (!editor) {
        new Notice("Open a note to insert into.");
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
      if (!this.insertNamesAsList(selected.map(g => g.name), "checklist")) return;
      await this.reserveNames(selected);
      this.clearResultsSelection();
    };

    listBtn.onclick = async () => {
      const selected = selectedNames();
      if (selected.length === 0) return;
      if (!this.insertNamesAsList(selected.map(g => g.name), "bullet")) return;
      await this.reserveNames(selected);
      this.clearResultsSelection();
    };

    updateButtons();
  }

  async reserveNames(names: GeneratedName[]) {
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

  insertNamesAsList(names: string[], listType: "bullet" | "checklist"): boolean {
    if (names.length === 0) return false;
    const editor = this.app.workspace.activeEditor?.editor
      ?? this.app.workspace.getActiveViewOfType(MarkdownView)?.editor;
    if (!editor) {
      new Notice("Open a note to insert into.");
      return false;
    }

    const marker = listType === "checklist" ? "- [ ] " : "- ";
    const emptyMarkerPattern = listType === "checklist"
      ? /^(\s*)[-*+]\s\[ \]\s$/
      : /^(\s*)[-*+]\s$/;

    const cursor = editor.getCursor();
    const lineText = editor.getLine(cursor.line);

    let from = cursor;
    let insertion: string;

    if (/^\s*$/.test(lineText)) {
      insertion = names.map(name => `${marker}${name}`).join("\n");
    } else if (cursor.ch === lineText.length && emptyMarkerPattern.test(lineText)) {
      const indent = lineText.match(emptyMarkerPattern)?.[1] ?? "";
      const [first, ...rest] = names;
      insertion = first + rest.map(name => `\n${indent}${marker}${name}`).join("");
    } else {
      from = { line: cursor.line, ch: lineText.length };
      insertion = "\n" + names.map(name => `${marker}${name}`).join("\n");
    }

    editor.replaceRange(insertion, from);
    editor.focus();
    return true;
  }
}

// ---------------------------------------------------------------- small chooser

class PickCultureModal extends Modal {
  plugin: LanguageForgePlugin;
  onPick: (c: Culture) => void | Promise<void>;
  buttonText: string;

  constructor(
    app: App,
    plugin: LanguageForgePlugin,
    onPick: (c: Culture) => void | Promise<void>,
    buttonText = "Save card",
  ) {
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
        .addButton(b => b.setButtonText(this.buttonText).onClick(() => {
          this.close();
          void this.onPick(c);
        }));
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

  getSettingDefinitions(): SettingDefinitionItem[] {
    return [
      {
        name: "Folder for language pages",
        desc: "Language notes are saved as LanguageForge/Name.md under this folder (default LanguageForge).",
        control: {
          type: "text",
          key: "folder",
          defaultValue: DEFAULT_SETTINGS.folder,
        },
      },
      {
        name: "Names per batch",
        control: {
          type: "slider",
          key: "batchSize",
          min: 6,
          max: 24,
          step: 2,
          defaultValue: DEFAULT_SETTINGS.batchSize,
        },
      },
      {
        name: "Show pronunciation hints",
        desc: "Say-it-like respellings under every name.",
        control: {
          type: "toggle",
          key: "showPronunciation",
          defaultValue: DEFAULT_SETTINGS.showPronunciation,
        },
      },
      {
        name: "Insert format",
        desc: "How names are written into your note.",
        control: {
          type: "dropdown",
          key: "insertFormat",
          defaultValue: DEFAULT_SETTINGS.insertFormat,
          options: {
            list: "Bulleted list with details",
            inline: "Names only, comma-separated",
          },
        },
      },
    ];
  }

  getControlValue(key: string): unknown {
    return this.plugin.data.settings[key as keyof LanguageForgeSettings];
  }

  async setControlValue(key: string, value: unknown): Promise<void> {
    const settings = this.plugin.data.settings;
    if (key === "folder") {
      settings.folder = (typeof value === "string" && value.trim()) || DEFAULT_SETTINGS.folder;
    } else if (key === "batchSize" && typeof value === "number") {
      settings.batchSize = value;
    } else if (key === "showPronunciation" && typeof value === "boolean") {
      settings.showPronunciation = value;
    } else if (key === "insertFormat" && (value === "list" || value === "inline")) {
      settings.insertFormat = value;
    } else {
      return;
    }
    await this.plugin.persist();
  }
}
