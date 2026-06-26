/**
 * Leichtgewichtige Helfer, um strukturierte Infos live aus den bestehenden
 * Markdown-Dateien zu ziehen (Tabellen, Checklisten), ohne Daten zu duplizieren.
 */

export interface MdTable {
  headers: string[];
  rows: string[][];
}

function splitRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => c.trim());
}

function isDivider(line: string): boolean {
  return /^\s*\|?\s*:?-{1,}:?\s*(\|\s*:?-{1,}:?\s*)+\|?\s*$/.test(line);
}

/** Alle Markdown-Tabellen eines Dokuments. */
export function parseTables(body: string): MdTable[] {
  const lines = body.split("\n");
  const tables: MdTable[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().startsWith("|") && lines[i + 1] && isDivider(lines[i + 1])) {
      const headers = splitRow(line);
      const rows: string[][] = [];
      let j = i + 2;
      while (j < lines.length && lines[j].trim().startsWith("|")) {
        rows.push(splitRow(lines[j]));
        j++;
      }
      tables.push({ headers, rows });
      i = j - 1;
    }
  }
  return tables;
}

/** Erste Tabelle nach einer Überschrift, deren Text das Suchwort enthält. */
export function tableUnderHeading(body: string, headingMatch: RegExp): MdTable | null {
  const lines = body.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (/^#{1,6}\s/.test(lines[i]) && headingMatch.test(lines[i])) {
      for (let j = i + 1; j < lines.length; j++) {
        if (/^#{1,6}\s/.test(lines[j])) break;
        if (lines[j].trim().startsWith("|") && lines[j + 1] && isDivider(lines[j + 1])) {
          const sub = parseTables(lines.slice(j).join("\n"));
          return sub[0] ?? null;
        }
      }
    }
  }
  return null;
}

/** Checkbox-Listenpunkte (- [ ] / - [x]) mit Zustand. */
export function parseChecklist(body: string): { done: boolean; text: string }[] {
  const out: { done: boolean; text: string }[] = [];
  for (const line of body.split("\n")) {
    const m = line.match(/^\s*[-*]\s+\[([ xX])\]\s+(.*)$/);
    if (m) out.push({ done: m[1].toLowerCase() === "x", text: m[2].trim() });
  }
  return out;
}

export type AmpelFarbe = "gruen" | "gelb" | "rot" | null;

export function ampelOf(cell: string): AmpelFarbe {
  if (/🟢|🟩/.test(cell)) return "gruen";
  if (/🟡|🟨/.test(cell)) return "gelb";
  if (/🔴|🟥/.test(cell)) return "rot";
  return null;
}
