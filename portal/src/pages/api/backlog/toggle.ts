import type { APIRoute } from "astro";
import { checkWriteKey, json, readAkteFile, writeAkteFile } from "../../../lib/akte-write";

// Hakt eine Backlog-Aufgabe in 09_bauablauf/backlog.md ab (oder wieder auf)
// und verschiebt die Zeile in den passenden Abschnitt (Offen/Erledigt).
export const prerender = false;

const FILE = "09_bauablauf/backlog.md";

export const POST: APIRoute = async ({ request }) => {
  let body: { text?: string; done?: boolean; key?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Ungültiger Request-Body" }, 400);
  }

  const denied = checkWriteKey(body.key);
  if (denied) return denied;

  const text = (body.text ?? "").trim();
  if (!text) return json({ error: "Kein Aufgabentext" }, 400);
  const done = Boolean(body.done);

  try {
    const raw = await readAkteFile(FILE);
    // CRLF-tolerant einlesen; geschrieben wird einheitlich mit LF.
    const lines = raw.split(/\r?\n/);

    // Aufgabenzeile finden (Checkbox-Zustand egal)
    const idx = lines.findIndex((l) => {
      const m = l.match(/^\s*[-*]\s*\[[ xX]\]\s*(.*)$/);
      return m && m[1].trim() === text;
    });
    if (idx === -1) return json({ error: "Aufgabe nicht gefunden" }, 404);

    lines.splice(idx, 1);
    const newLine = `- [${done ? "x" : " "}] ${text}`;

    // Unter der Ziel-Überschrift einsortieren (ans Ende des Abschnitts)
    const targetHeading = done ? "## Erledigt" : "## Offen";
    const hIdx = lines.findIndex((l) => l.trim() === targetHeading);
    if (hIdx === -1) {
      lines.push("", targetHeading, "", newLine);
    } else {
      let end = hIdx + 1;
      while (end < lines.length && !/^##\s/.test(lines[end])) end++;
      while (end > hIdx + 1 && lines[end - 1].trim() === "") end--;
      lines.splice(end, 0, newLine);
    }

    const via = await writeAkteFile(
      FILE,
      lines.join("\n"),
      `backlog: „${text.slice(0, 60)}“ ${done ? "erledigt" : "wieder geöffnet"} (Portal)`,
    );
    return json({ ok: true, via });
  } catch (err) {
    return json({ error: (err as Error).message }, 500);
  }
};
