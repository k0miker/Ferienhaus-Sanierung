# CLAUDE.md – Arbeitsanweisung für Claude Code

Dieses Repository ist die lokale Projektakte für die **Sanierung des Ferienhauses
in Fürstenau** (Wilhelm-Busch-Straße 7, Baujahr 1978, Erbbaurecht).

## Verbindliche Regeln

Es gelten dieselben Arbeits- und Sicherheitsregeln wie für den Codex-Agenten.
**Vor inhaltlicher Arbeit lesen:**

- [`AGENTS.md`](AGENTS.md) – Arbeits-, Qualitäts- und Sicherheitsregeln (Statuswerte,
  Qualitäts-/Evidenz-Tags `[BELEGT]`/`[OFFEN]` …, ADR-Schema, Kostengruppen).
- [`memory.md`](memory.md) – objektspezifisches Langzeitwissen (früher `codex_memory.md`).
- [`PROJEKTSTATUS.md`](PROJEKTSTATUS.md) – aktueller Gesamtstand, Blocker, nächste Schritte.

Kurz: keine Fakten erfinden (Maße, Kosten, U-Werte, Förderfähigkeit …), Unsicheres
als `[OFFEN]` markieren, Originalquellen nie überschreiben, Geldbeträge brutto in €,
Datum `YYYY-MM-DD`, fachliche Prüfungen (Statik, Elektro, Feuchte, Förderung …) nie
als entbehrlich darstellen.

## Aufbau

Nummerierte Ordner `00_projekt` … `09_bauablauf` plus `99_quellen`. Inhalte sind
Markdown; Originale (PDF/Bilder) liegen daneben und bleiben unverändert.

## Web-Portal (`portal/`)

Astro-Portal, das die Markdown-Akte direkt einliest und aufbereitet darstellt
(Dashboard, Dokumente, Kosten, Aufgaben, Medien, Suche) sowie Erfassung über ein
CMS bietet. Details: [`portal/README.md`](portal/README.md).

```bash
cd portal && npm run dev    # Portal:  http://localhost:4321
cd portal && npm run cms    # CMS-Backend (zum Bearbeiten unter /admin)
```

- Strukturierte **Kosten** liegen in `06_kosten/positionen/*.md` (CMS-gepflegt).
- **Entscheidungen** (`08_entscheidungen/ADR-*.md`) haben Frontmatter
  (`title`, `status`, `datum`, `verantwortlich`) und werden im CMS bearbeitet.
- Die alte statische `web/`-Seite ist durch `portal/` abgelöst.
