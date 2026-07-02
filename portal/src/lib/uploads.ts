/**
 * Zielbereiche für den Dokumenten-Upload (/hochladen + /api/upload).
 * Alle Ordner liegen in den Scan-Pfaden von lib/media.ts, sodass Uploads
 * automatisch unter /medien auftauchen. Dateien landen jeweils in einem
 * Unterordner uploads/, damit Originale und Portal-Uploads unterscheidbar
 * bleiben (AGENTS.md: Originalquellen nie überschreiben).
 */
export const UPLOAD_ZIELE: Record<string, { dir: string; label: string }> = {
  fotos: { dir: "01_bestand/fotos", label: "Fotos (Bestand/Baustelle)" },
  bauunterlagen: { dir: "01_bestand/bauunterlagen", label: "Bauunterlagen" },
  grundrisse: { dir: "01_bestand/grundrisse", label: "Grundrisse & Pläne" },
  angebote: { dir: "05_angebote", label: "Angebote" },
  foerderung: { dir: "07_foerderung/antraege", label: "Förderung / Anträge" },
  quellen: { dir: "99_quellen", label: "Sonstige Quellen/Dokumente" },
};
