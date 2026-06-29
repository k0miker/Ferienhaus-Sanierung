/**
 * Parst die Markdown-Aufmaß-Checkliste in ein interaktives Modell:
 * - Checkbox-Punkte (`- [ ]`), inkl. Ausfüll-Lücken (`___`) und inline `[ ] ja/nein`
 * - Markdown-Tabellen mit ausfüllbaren Zellen (`___` → Eingabe, `[ ]` → Haken)
 *
 * Jedes interaktive Feld bekommt eine stabile ID (f0, f1 …), damit Render und
 * Export-/Speicher-Logik dieselben localStorage-Schlüssel verwenden.
 */

export type Seg =
  | { t: "text"; v: string }
  | { t: "blank"; id: string }
  | { t: "icheck"; id: string; done: boolean };

export type Cell =
  | { kind: "text"; v: string }
  | { kind: "blank"; id: string }
  | { kind: "check"; id: string; done: boolean };

export type Block =
  | { type: "subhead"; text: string }
  | { type: "note"; text: string }
  | { type: "item"; checkId: string; done: boolean; segs: Seg[] }
  | { type: "table"; headers: string[]; rows: Cell[][] };

export interface Section {
  title: string;
  icon: string;
  blocks: Block[];
}

function iconFor(titel: string): string {
  if (titel.includes("Raum")) return "ruler";
  if (titel.includes("Fenster")) return "layout-grid";
  if (titel.includes("Außenwand") || titel.includes("Fassade")) return "layers";
  if (titel.includes("Dach")) return "home";
  if (titel.includes("PV")) return "sun";
  if (titel.includes("Elektro")) return "zap";
  if (titel.includes("Heizung") || titel.includes("Warmwasser")) return "flame";
  if (titel.includes("Wanddurchbruch")) return "hammer";
  if (titel.includes("Foto")) return "camera";
  if (titel.includes("Ausrüstung") || titel.includes("Pack")) return "backpack";
  return "clipboard-list";
}

function splitRow(line: string): string[] {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
}
function isDivider(line: string): boolean {
  return /^\s*\|?\s*:?-{1,}:?\s*(\|\s*:?-{1,}:?\s*)+\|?\s*$/.test(line);
}

export interface ParsedChecklist {
  sections: Section[];
  totalChecks: number;
}

/** Stabiler Slug/localStorage-Key je Checkliste (aus der Doc-ID). */
export function checklistSlug(id: string): string {
  return id.replace(/\.md$/i, "");
}

/** localStorage-Key für die erfassten Werte einer Checkliste. */
export function checklistStateKey(id: string): string {
  return "checklist:" + checklistSlug(id) + ":v1";
}

/** Dateiname der Erfassungs-Kopie in der Akte (neben dem Original). */
export function checklistResultPath(id: string): string {
  const slug = checklistSlug(id);
  return slug + "-erfasst.md";
}

export function parseChecklistDoc(body: string): ParsedChecklist {
  const lines = body.split("\n");
  const sections: Section[] = [];
  let cur: Section | null = null;
  let counter = 0;
  const nextId = () => "f" + counter++;
  let totalChecks = 0;

  const tokenizeSegs = (rest: string): Seg[] => {
    const segs: Seg[] = [];
    // an Lücken (___) und inline-Checkboxen ([ ] / [x]) splitten
    const parts = rest.split(/(_{2,}|\[[ xX]\])/);
    for (const part of parts) {
      if (!part) continue;
      if (/^_{2,}$/.test(part)) segs.push({ t: "blank", id: nextId() });
      else if (/^\[[ xX]\]$/.test(part))
        segs.push({ t: "icheck", id: nextId(), done: /[xX]/.test(part) });
      else segs.push({ t: "text", v: part });
    }
    return segs;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const h2 = line.match(/^##\s+(?:\d+\.\s+)?(.*)$/);
    if (h2) {
      const title = h2[1].trim();
      cur = { title, icon: iconFor(title), blocks: [] };
      sections.push(cur);
      continue;
    }
    if (!cur) continue;

    const h3 = line.match(/^###\s+(.*)$/);
    if (h3) {
      cur.blocks.push({ type: "subhead", text: h3[1].trim() });
      continue;
    }

    // Checkbox-Punkt
    const it = line.match(/^\s*[-*]\s+\[([ xX])\]\s+(.*)$/);
    if (it) {
      totalChecks++;
      cur.blocks.push({
        type: "item",
        checkId: nextId(),
        done: it[1].toLowerCase() === "x",
        segs: tokenizeSegs(it[2].trim()),
      });
      continue;
    }

    // Tabelle
    if (line.trim().startsWith("|") && lines[i + 1] && isDivider(lines[i + 1])) {
      const headers = splitRow(line);
      const rows: Cell[][] = [];
      let j = i + 2;
      while (j < lines.length && lines[j].trim().startsWith("|")) {
        const raw = splitRow(lines[j]);
        rows.push(
          raw.map((c): Cell => {
            if (/^_{2,}$/.test(c)) return { kind: "blank", id: nextId() };
            const cm = c.match(/^\[([ xX])\]$/);
            if (cm) {
              totalChecks++;
              return { kind: "check", id: nextId(), done: cm[1].toLowerCase() === "x" };
            }
            return { kind: "text", v: c };
          }),
        );
        j++;
      }
      cur.blocks.push({ type: "table", headers, rows });
      i = j - 1;
      continue;
    }

    // Hinweis/Absatz (nicht leer, kein reines ---)
    const txt = line.trim();
    if (txt && txt !== "---") {
      cur.blocks.push({ type: "note", text: txt.replace(/\*\*/g, "") });
    }
  }

  return { sections, totalChecks };
}
