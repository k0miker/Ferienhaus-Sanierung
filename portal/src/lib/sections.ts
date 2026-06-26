import type { CollectionEntry } from "astro:content";

export type Doc = CollectionEntry<"docs">;

export interface Section {
  key: string; // Ordner-Präfix, z.B. "02_gebaeudehuelle"
  label: string;
  icon: string;
  order: number;
}

export const SECTIONS: Section[] = [
  { key: "_root", label: "Übersicht", icon: "📊", order: -1 },
  { key: "00_projekt", label: "Projekt", icon: "🧭", order: 0 },
  { key: "01_bestand", label: "Bestand", icon: "🏠", order: 1 },
  { key: "02_gebaeudehuelle", label: "Gebäudehülle", icon: "🧱", order: 2 },
  { key: "03_haustechnik", label: "Haustechnik", icon: "⚙️", order: 3 },
  { key: "04_innenausbau", label: "Innenausbau", icon: "🛁", order: 4 },
  { key: "05_angebote", label: "Angebote", icon: "📑", order: 5 },
  { key: "06_kosten", label: "Kosten", icon: "💶", order: 6 },
  { key: "07_foerderung", label: "Förderung", icon: "🏦", order: 7 },
  { key: "08_entscheidungen", label: "Entscheidungen", icon: "✅", order: 8 },
  { key: "09_bauablauf", label: "Bauablauf", icon: "📆", order: 9 },
  { key: "99_quellen", label: "Quellen", icon: "📎", order: 99 },
];

const SECTION_BY_KEY = new Map(SECTIONS.map((s) => [s.key, s]));

export function sectionFor(id: string): Section {
  const top = id.split("/")[0];
  const key = /^(0[0-9]_|99_)/.test(top) ? top : "_root";
  return SECTION_BY_KEY.get(key) ?? SECTION_BY_KEY.get("_root")!;
}

export function prettyName(id: string): string {
  const base = id.split("/").pop() ?? id;
  return base
    .replace(/^ADR-(\d+)-/, "ADR-$1: ")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/Adr/g, "ADR")
    .replace(/Pv\b/gi, "PV")
    .replace(/Bafa/gi, "BAFA")
    .replace(/Kfw/gi, "KfW");
}

/** Titel: Frontmatter > erste H1 im Body > schöner Dateiname. */
export function titleFor(doc: Doc): string {
  if (doc.data.title) return doc.data.title;
  const h1 = doc.body?.match(/^#\s+(.+?)\s*$/m);
  if (h1) return h1[1].replace(/[–—-]\s*$/, "").trim();
  return prettyName(doc.id);
}

/** Kurzer Auszug aus dem Body (erster Absatz, ohne Markdown-Deko). */
export function excerptFor(doc: Doc, max = 160): string {
  const body = (doc.body ?? "")
    .replace(/^---[\s\S]*?---/, "")
    .replace(/^#.*$/gm, "")
    .replace(/^>.*$/gm, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/[#*_`>|]/g, "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const text = body.join(" ").replace(/\s+/g, " ").trim();
  return text.length > max ? text.slice(0, max).trimEnd() + "…" : text;
}

export function sortedSections(): Section[] {
  return [...SECTIONS].sort((a, b) => a.order - b.order);
}
