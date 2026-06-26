/** Ordnet AGENTS.md-Statuswerte einer Badge-Farbe zu. Tolerant gegenüber Schreibweisen. */
export function statusClass(raw: string): "ok" | "warn" | "bad" | "info" {
  const s = raw.toUpperCase().replace(/`/g, "").trim();
  if (/ERLEDIGT|AUSGEFÜHRT|ABGENOMMEN|ENTSCHIEDEN|BEAUFTRAGT|IN AUSFÜHRUNG/.test(s)) return "ok";
  if (/DATEN FEHLEN|WIDERSPRUCH|MANGEL OFFEN|VERWORFEN|🔴|ROT/.test(s)) return "bad";
  if (/ANGEBOT VORHANDEN|ANGEBOT ANGEFRAGT|IDEE/.test(s)) return "info";
  return "warn"; // ZU PRÜFEN, ENTSCHEIDUNG OFFEN, FÖRDERUNG ZU KLÄREN, Tendenzen …
}

/** Reine Anzeige: Backticks/Whitespace säubern. */
export function cleanStatus(raw: string): string {
  return raw.replace(/`/g, "").trim();
}
