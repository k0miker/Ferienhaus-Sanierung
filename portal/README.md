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
| `/checklisten` | Übersicht aller Checklisten mit Fortschritt |
| `/checklisten/<slug>` | Interaktive Checkliste (abhaken/ausfüllen, speichern) |
| `/suche` | Volltextsuche über alle Dokumente |

## Checklisten

Jede Markdown-Datei mit `typ: checkliste` im Frontmatter wird automatisch zur
interaktiven Checkliste (egal in welchem Bereich). Aufbau wie gewohnt: `- [ ]`-Punkte,
Lücken `___` und Markdown-Tabellen werden zu ausfüllbaren Feldern.

```markdown
---
title: Aufmaß Dachgeschoss
typ: checkliste
bereich: Bestand
---
## Raum 1
- [ ] Länge (m): ___
```

- Zwischenstände liegen pro Liste im Browser (`localStorage`, auch offline).
- **„In Akte speichern"** schreibt eine versionierte Kopie `…-erfasst.md` neben das
  Original (Werte als `[ABGELESEN]`). Lokal (`npm run dev`) direkt ins Dateisystem,
  gehostet per GitHub-Commit (siehe Deployment).

## Deployment (Netlify)

Das Portal liegt im Unterordner `portal/`. In der Netlify-UI **Base directory =
`portal`** setzen; `portal/netlify.toml` liefert Build-Command und Node-Version.
Der `@astrojs/netlify`-Adapter macht aus Seiten statisches HTML und aus den
API-Routen (`prerender=false`) eine Netlify-Function.

Environment-Variablen (lokal in `.env`, in Produktion Netlify → Site configuration →
Environment variables). Vorlage: `.env.example` → `cp .env.example .env`.

| Variable | Zweck |
|---|---|
| `PORTAL_USER` / `PORTAL_PASSWORD` | gemeinsamer Login für den Zugangsschutz |
| `PORTAL_USERS` | optional mehrere Logins, Format `user:pass,user2:pass2` |
| `PORTAL_WRITE_KEY` | Schlüssel zum Speichern von Checklisten (Pflicht in Produktion) |
| `GITHUB_TOKEN` | Fine-grained PAT mit *Contents: Read+Write* auf das Repo |
| `GITHUB_REPO` | `owner/repo` der Akte |
| `GITHUB_BRANCH` | Zielbranch (optional, Default `main`) |
| `SITE_URL` | öffentliche URL (optional) |

Ohne `GITHUB_TOKEN`/`GITHUB_REPO` schreibt die Save-Route ins lokale Dateisystem –
das ist nur im lokalen `npm run dev` sinnvoll (Netlify-Functions sind zustandslos).

## Zugangsschutz

Das ganze Portal liegt hinter **HTTP-Basic-Auth** (Browser-Anmeldedialog), umgesetzt
als Netlify Edge Function [`netlify/edge-functions/auth.ts`](netlify/edge-functions/auth.ts)
auf `path: "/*"` – schützt auch statische Seiten und Medien.

- Login(s) über `PORTAL_USER`/`PORTAL_PASSWORD` bzw. `PORTAL_USERS` (mehrere Rollen).
- **Lokal** (`npm run dev`, localhost) ist das Portal **nicht** gesperrt.
- Sind keine Zugangsdaten gesetzt, bleibt es offen (z. B. beim allerersten Deploy) –
  also vor dem öffentlichen Teilen die Variablen in Netlify setzen.

## Hinweise

- Die alte statische `web/`-Seite wird durch dieses Portal abgelöst.
- Pflege strukturierter Inhalte (Kosten, ADRs) über das Decap-CMS (`npm run cms`, `/admin`).
