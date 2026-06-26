# Sanierungsportal (Astro)

Web-Portal für die Ferienhaus-Sanierung. Liest die Markdown-Projektakte aus den
nummerierten Ordnern (`00_projekt` … `99_quellen`) **direkt ein** – keine
Doppelpflege. Inhalte werden weiter wie gewohnt in den `.md`-Dateien bzw. von
Codex gepflegt; das Portal stellt sie nur aufbereitet dar.

## Starten

```bash
cd portal
npm install      # einmalig
npm run dev      # http://localhost:4321
```

## Aufbau

- `src/content.config.ts` – Content Collection `docs` (Glob auf die Projektordner).
  Frontmatter ist optional; Status/Qualität nach AGENTS.md-Konventionen.
- `src/lib/sections.ts` – Bereichs-Mapping (Ordner → Label/Icon), Titel-/Auszug-Ableitung.
- `src/lib/mdtable.ts` – zieht Tabellen/Checklisten live aus Markdown (z. B. Projektampel).
- `src/lib/status.ts` – AGENTS.md-Statuswerte → Badge-Farbe.
- `src/lib/media.ts` – scannt Pläne/Fotos/PDFs in den Quellordnern.
- `src/pages/` – Dashboard, `/docs/[...slug]`, `/bereich/[key]`, `/kosten`,
  `/aufgaben`, `/medien`, `/suche`.
- `public/` – Symlinks auf die Projektordner, damit Roh-`.md` und Originale
  (PDF/Bilder) ausgeliefert werden.

## Seiten

| Route | Inhalt |
|---|---|
| `/` | Dashboard: Projektampel, kritische Blocker, Maßnahmenstatus (aus PROJEKTSTATUS.md) |
| `/bereich/<key>` | Alle Dokumente eines Bereichs |
| `/docs/<slug>` | Einzeldokument, gerendert; Qualitäts-Tags farblich; Inhaltsverzeichnis |
| `/kosten` | Budgetrahmen, Kostenplan-Tabelle, automatische Summen |
| `/aufgaben` | Backlog, offene Fragen, ADRs, Entscheidungslog |
| `/medien` | Pläne, Fotos, PDF-Originale |
| `/suche` | Volltextsuche über alle Dokumente |

## Hinweise

- Die alte statische `web/`-Seite wird durch dieses Portal abgelöst.
- Build (`npm run build`) erzeugt `dist/`. Für „später online teilen" werden in
  Phase 2 die `public/`-Symlinks durch einen Kopierschritt ersetzt und das
  Decap-CMS (`npm run cms`) für die Erfassung über Formulare angebunden.
