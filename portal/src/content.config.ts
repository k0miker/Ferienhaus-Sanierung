import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Statuswerte aus AGENTS.md §11
export const STATUS_WERTE = [
  "IDEE",
  "ZU PRÜFEN",
  "DATEN FEHLEN",
  "ANGEBOT ANGEFRAGT",
  "ANGEBOT VORHANDEN",
  "ENTSCHEIDUNG OFFEN",
  "ENTSCHIEDEN",
  "FÖRDERUNG ZU KLÄREN",
  "BEAUFTRAGT",
  "IN AUSFÜHRUNG",
  "AUSGEFÜHRT",
  "ABGENOMMEN",
  "MANGEL OFFEN",
  "ERLEDIGT",
  "VERWORFEN",
] as const;

// Qualitaets-/Evidenzkennzeichnung aus AGENTS.md §4
export const QUALITAET_WERTE = [
  "BELEGT",
  "ABGELESEN",
  "ANGABE",
  "ANNAHME",
  "OFFEN",
  "WIDERSPRUCH",
] as const;

// Kostengruppen aus AGENTS.md §13
export const KOSTEN_GRUPPEN = [
  "geschätzt",
  "Angebot vorhanden",
  "beauftragt",
  "bezahlt",
  "Reserve",
  "Förderung beantragt",
  "Förderung bewilligt",
  "Förderung ausgezahlt",
] as const;

export const BEREICHE = [
  "Projekt",
  "Bestand",
  "Gebäudehülle",
  "Haustechnik",
  "Innenausbau",
  "Förderung",
  "Sonstiges",
] as const;

/**
 * Bestehende Markdown-Projektakte – wird direkt aus den nummerierten Ordnern
 * gelesen (keine Doppelpflege). Frontmatter ist optional, damit auch Dateien
 * ohne Kopf weiter funktionieren.
 */
const docs = defineCollection({
  loader: glob({
    base: "../",
    pattern: [
      "0[0-9]_*/**/*.md",
      "99_quellen/**/*.md",
      "PROJEKTSTATUS.md",
      "codex_memory.md",
      "README.md",
      "AGENTS.md",
    ],
  }),
  schema: z
    .object({
      title: z.string().optional(),
      status: z.enum(STATUS_WERTE).optional(),
      qualitaet: z.enum(QUALITAET_WERTE).optional(),
      bereich: z.string().optional(),
      datum: z.coerce.date().optional(),
      tags: z.array(z.string()).optional(),
    })
    .passthrough(),
});

/**
 * Strukturierte Kostenpositionen – werden über das CMS (Decap, /admin) gepflegt
 * und liegen als einzelne Markdown-Dateien mit Frontmatter in 06_kosten/positionen/.
 */
const kosten = defineCollection({
  loader: glob({ base: "../06_kosten/positionen", pattern: "**/*.md" }),
  schema: z.object({
    titel: z.string(),
    bereich: z.enum(BEREICHE).default("Sonstiges"),
    gruppe: z.enum(KOSTEN_GRUPPEN),
    betrag: z.number().nonnegative(),
    brutto: z.boolean().default(true),
    status: z.enum(STATUS_WERTE).optional(),
    datum: z.coerce.date().optional(),
    quelle: z.string().optional(),
    notiz: z.string().optional(),
  }),
});

export const collections = { docs, kosten };
