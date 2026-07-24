// Visual genealogy chart for cultures: parents above, siblings across,
// merge parents joined by a marriage mark with children beneath the union.
// Forests pack left→right: most complex trees first, isolated languages last.

import { Culture } from "./engine";

const NODE_W = 112;
const NODE_H = 36;
const H_GAP = 28;
const V_GAP = 72;
const PAD = 12;
const UNION_R = 10;
const FOREST_GAP = 48; // space between separate family forests

interface PlacedNode {
  id: string;
  name: string;
  cx: number; // center x
  cy: number; // center y
}

interface PlacedUnion {
  key: string;
  parentIds: string[];
  childIds: string[];
  cx: number;
  cy: number;
}

interface Edge {
  x1: number; y1: number;
  x2: number; y2: number;
  childIds?: string[]; // which child nodes this segment leads to (for hover highlight)
}

interface Layout {
  width: number;
  height: number;
  nodes: PlacedNode[];
  unions: PlacedUnion[];
  edges: Edge[];
}

function generationOf(c: Culture, byId: Map<string, Culture>, memo: Map<string, number>, stack: Set<string>): number {
  if (memo.has(c.id)) return memo.get(c.id)!;
  if (stack.has(c.id)) return 0;
  if (c.generation !== undefined) {
    memo.set(c.id, c.generation);
    return c.generation;
  }
  const parents = (c.parentIds ?? []).map(id => byId.get(id)).filter((p): p is Culture => !!p);
  if (parents.length === 0) {
    memo.set(c.id, 0);
    return 0;
  }
  stack.add(c.id);
  const g = Math.max(...parents.map(p => generationOf(p, byId, memo, stack))) + 1;
  stack.delete(c.id);
  memo.set(c.id, g);
  return g;
}

function unionKey(parentIds: string[]): string {
  return [...parentIds].sort().join("+");
}

/** Undirected connected components via parent↔child links (incl. merges). */
function connectedComponents(cultures: Culture[]): Culture[][] {
  const byId = new Map(cultures.map(c => [c.id, c]));
  const adj = new Map<string, Set<string>>();
  for (const c of cultures) adj.set(c.id, new Set());

  for (const c of cultures) {
    for (const pid of c.parentIds ?? []) {
      if (!byId.has(pid)) continue;
      adj.get(c.id)!.add(pid);
      adj.get(pid)!.add(c.id);
    }
  }

  const seen = new Set<string>();
  const comps: Culture[][] = [];
  for (const c of cultures) {
    if (seen.has(c.id)) continue;
    const ids: string[] = [];
    const stack = [c.id];
    seen.add(c.id);
    while (stack.length) {
      const id = stack.pop()!;
      ids.push(id);
      for (const n of adj.get(id) ?? []) {
        if (seen.has(n)) continue;
        seen.add(n);
        stack.push(n);
      }
    }
    comps.push(ids.map(id => byId.get(id)!));
  }
  return comps;
}

/** Higher = more branching / deeper / more merges. */
function forestComplexity(members: Culture[]): number {
  if (members.length <= 1) return 0;
  const ids = new Set(members.map(c => c.id));
  let edges = 0;
  let merges = 0;
  let maxGen = 0;
  for (const c of members) {
    const pids = (c.parentIds ?? []).filter(id => ids.has(id));
    edges += pids.length;
    if (pids.length >= 2) merges++;
    maxGen = Math.max(maxGen, c.generation ?? 0);
  }
  // Prefer size, then depth, then merge count, then edge density
  return members.length * 100 + maxGen * 20 + merges * 15 + edges;
}

function offsetLayout(layout: Layout, dx: number): Layout {
  return {
    width: layout.width + dx,
    height: layout.height,
    nodes: layout.nodes.map(n => ({ ...n, cx: n.cx + dx })),
    unions: layout.unions.map(u => ({ ...u, cx: u.cx + dx })),
    edges: layout.edges.map(e => ({
      x1: e.x1 + dx, y1: e.y1,
      x2: e.x2 + dx, y2: e.y2,
      childIds: e.childIds,
    })),
  };
}

/** Layout one connected family (positions origin at PAD). */
function layoutConnectedForest(cultures: Culture[]): Layout {
  const byId = new Map(cultures.map(c => [c.id, c]));
  const genMemo = new Map<string, number>();
  const gen = new Map<string, number>();
  for (const c of cultures) {
    gen.set(c.id, generationOf(c, byId, genMemo, new Set()));
  }

  const unionsByKey = new Map<string, { parentIds: string[]; childIds: string[] }>();
  for (const c of cultures) {
    const pids = (c.parentIds ?? []).filter(id => byId.has(id));
    if (pids.length < 2) continue;
    const key = unionKey(pids);
    let u = unionsByKey.get(key);
    if (!u) {
      u = { parentIds: [...pids].sort(), childIds: [] };
      unionsByKey.set(key, u);
    }
    u.childIds.push(c.id);
  }

  const soloChildren = new Map<string, string[]>();
  for (const c of cultures) {
    const pids = (c.parentIds ?? []).filter(id => byId.has(id));
    if (pids.length !== 1) continue;
    const list = soloChildren.get(pids[0]) ?? [];
    list.push(c.id);
    soloChildren.set(pids[0], list);
  }

  const byGen = new Map<number, string[]>();
  for (const c of cultures) {
    const g = gen.get(c.id)!;
    const list = byGen.get(g) ?? [];
    list.push(c.id);
    byGen.set(g, list);
  }
  const maxGen = cultures.length === 0 ? 0 : Math.max(0, ...[...byGen.keys()]);

  const xIndex = new Map<string, number>();
  for (let g = 0; g <= maxGen; g++) {
    const ids = byGen.get(g) ?? [];
    ids.sort((a, b) => {
      const ca = byId.get(a)!;
      const cb = byId.get(b)!;
      if (g > 0) {
        const avg = (id: string) => {
          const pids = byId.get(id)?.parentIds ?? [];
          const slots = pids.map(p => xIndex.get(p)).filter((n): n is number => n !== undefined);
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

  const nodePos = new Map<string, { cx: number; cy: number }>();
  const pitch = NODE_W + H_GAP;

  for (let g = 0; g <= maxGen; g++) {
    const ids = byGen.get(g) ?? [];
    const startX = PAD + NODE_W / 2;
    ids.forEach((id, i) => {
      nodePos.set(id, {
        cx: startX + i * pitch,
        cy: PAD + NODE_H / 2 + g * (NODE_H + V_GAP),
      });
    });
  }

  for (let iter = 0; iter < 4; iter++) {
    for (let g = 1; g <= maxGen; g++) {
      const ids = byGen.get(g) ?? [];
      const targets = ids.map(id => {
        const pids = byId.get(id)?.parentIds ?? [];
        const pxs = pids.map(p => nodePos.get(p)?.cx).filter((n): n is number => n !== undefined);
        const cx = pxs.length ? pxs.reduce((s, n) => s + n, 0) / pxs.length : nodePos.get(id)!.cx;
        return { id, cx };
      });
      targets.sort((a, b) => a.cx - b.cx || a.id.localeCompare(b.id));
      let cursor = PAD + NODE_W / 2;
      for (const t of targets) {
        const cx = Math.max(cursor, t.cx);
        const pos = nodePos.get(t.id)!;
        pos.cx = cx;
        cursor = cx + pitch;
      }
    }
    for (let g = 0; g < maxGen; g++) {
      for (const id of byGen.get(g) ?? []) {
        const kids: string[] = [...(soloChildren.get(id) ?? [])];
        for (const u of unionsByKey.values()) {
          if (u.parentIds.includes(id)) kids.push(...u.childIds);
        }
        const kxs = kids.map(k => nodePos.get(k)?.cx).filter((n): n is number => n !== undefined);
        if (kxs.length === 0) continue;
        const mean = kxs.reduce((s, n) => s + n, 0) / kxs.length;
        const pos = nodePos.get(id)!;
        pos.cx = pos.cx * 0.6 + mean * 0.4;
      }
      const ids = [...(byGen.get(g) ?? [])];
      ids.sort((a, b) => nodePos.get(a)!.cx - nodePos.get(b)!.cx || a.localeCompare(b));
      let cursor = PAD + NODE_W / 2;
      for (const id of ids) {
        const pos = nodePos.get(id)!;
        pos.cx = Math.max(cursor, pos.cx);
        cursor = pos.cx + pitch;
      }
    }
  }

  const placedUnions: PlacedUnion[] = [];
  for (const [key, u] of unionsByKey) {
    const pxs = u.parentIds.map(id => nodePos.get(id)?.cx).filter((n): n is number => n !== undefined);
    const pys = u.parentIds.map(id => nodePos.get(id)?.cy).filter((n): n is number => n !== undefined);
    const cys = u.childIds.map(id => nodePos.get(id)?.cy).filter((n): n is number => n !== undefined);
    if (pxs.length < 2 || cys.length === 0) continue;
    const cx = (Math.min(...pxs) + Math.max(...pxs)) / 2;
    const parentBottom = Math.max(...pys) + NODE_H / 2;
    const childTop = Math.min(...cys) - NODE_H / 2;
    const cy = (parentBottom + childTop) / 2;
    placedUnions.push({ key, parentIds: u.parentIds, childIds: u.childIds, cx, cy });
  }

  const edges: Edge[] = [];

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
    const parents = u.parentIds.map(id => nodePos.get(id)).filter((p): p is { cx: number; cy: number } => !!p);
    if (parents.length < 2) continue;
    const minPx = Math.min(...parents.map(p => p.cx));
    const maxPx = Math.max(...parents.map(p => p.cx));
    const barY = u.cy;
    // Union parent bar + parent verticals are shared by all of the union's children.
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

  const nodes: PlacedNode[] = cultures.map(c => {
    const p = nodePos.get(c.id)!;
    return { id: c.id, name: c.name, cx: p.cx, cy: p.cy };
  });

  // Pull the forest flush left — barycenter packing only expands rightward.
  let minLeft = Infinity;
  for (const n of nodes) minLeft = Math.min(minLeft, n.cx - NODE_W / 2);
  for (const u of placedUnions) minLeft = Math.min(minLeft, u.cx - UNION_R);
  for (const e of edges) minLeft = Math.min(minLeft, e.x1, e.x2);
  const pull = Number.isFinite(minLeft) ? minLeft - PAD : 0;
  if (pull > 0) {
    for (const n of nodes) n.cx -= pull;
    for (const u of placedUnions) u.cx -= pull;
    for (const e of edges) { e.x1 -= pull; e.x2 -= pull; }
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
    edges,
  };
}

/**
 * Build a top-down genealogy layout.
 * Forests are packed left→right: connected trees by complexity (most complex first),
 * then isolated single-language families.
 */
export function layoutFamilyTree(cultures: Culture[]): Layout {
  if (cultures.length === 0) {
    return { width: PAD * 2, height: PAD * 2, nodes: [], unions: [], edges: [] };
  }

  const comps = connectedComponents(cultures);
  const trees = comps.filter(c => c.length > 1);
  const singles = comps.filter(c => c.length === 1);

  trees.sort((a, b) => {
    const d = forestComplexity(b) - forestComplexity(a);
    if (d !== 0) return d;
    const na = a.slice().sort((x, y) => x.name.localeCompare(y.name))[0]?.name ?? "";
    const nb = b.slice().sort((x, y) => x.name.localeCompare(y.name))[0]?.name ?? "";
    return na.localeCompare(nb);
  });
  singles.sort((a, b) => a[0].name.localeCompare(b[0].name));

  const ordered = [...trees, ...singles];

  let cursorX = 0;
  let height = PAD * 2;
  const merged: Layout = { width: 0, height: 0, nodes: [], unions: [], edges: [] };

  for (let i = 0; i < ordered.length; i++) {
    const local = layoutConnectedForest(ordered[i]);
    const localLeft = Math.min(
      ...local.nodes.map(n => n.cx - NODE_W / 2),
      ...(local.unions.length ? local.unions.map(u => u.cx - UNION_R) : [Infinity]),
      PAD,
    );
    // First forest keeps natural left padding; later forests start after a gap.
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
    edges: merged.edges,
  };
}

/** Render the chart into `parent`. `onSelect(cultureId)` fires when a node is clicked. */
export function renderFamilyTreeView(
  parent: HTMLElement,
  cultures: Culture[],
  onSelect: (cultureId: string) => void,
): void {
  if (cultures.length === 0) {
    parent.createEl("p", {
      text: "No cultures yet — create one on the New or Seeded tab first.",
      cls: "lf-hint",
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

  const edgesByChild = new Map<string, SVGLineElement[]>();
  for (const e of layout.edges) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", String(e.x1));
    line.setAttribute("y1", String(e.y1));
    line.setAttribute("x2", String(e.x2));
    line.setAttribute("y2", String(e.y2));
    line.setAttribute("class", "lf-tree-edge");
    svg.appendChild(line);
    for (const cid of e.childIds ?? []) {
      const list = edgesByChild.get(cid) ?? [];
      list.push(line);
      edgesByChild.set(cid, list);
    }
  }
  canvas.appendChild(svg);

  for (const u of layout.unions) {
    const mark = canvas.createDiv({ cls: "lf-tree-marriage", text: "⚭" });
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
    const parentLines = edgesByChild.get(n.id) ?? [];
    node.addEventListener("mouseenter", () => {
      for (const line of parentLines) {
        line.classList.add("is-highlighted");
        svg.appendChild(line); // raise above other (non-hovered) lines
      }
    });
    node.addEventListener("mouseleave", () => {
      for (const line of parentLines) line.classList.remove("is-highlighted");
    });
    node.onclick = () => onSelect(n.id);
  }
}

/** Shrink label font until the name fits inside the chip (or hits a floor). */
function fitChipLabel(label: HTMLElement, chip: HTMLElement, maxPx = 13, minPx = 7) {
  let size = maxPx;
  label.style.fontSize = `${size}px`;
  // clientWidth is available after the chip has fixed width in the layout.
  while (size > minPx && label.scrollWidth > chip.clientWidth - 16) {
    size -= 0.5;
    label.style.fontSize = `${size}px`;
  }
}
