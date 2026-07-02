import type { APIRoute } from "astro";
import { checkWriteKey, json, readAkteFile, writeAkteFile } from "../../../lib/akte-write";

// Setzt den Status eines Zeitplan-Schritts in 09_bauablauf/zeitplan.json.
export const prerender = false;

const FILE = "09_bauablauf/zeitplan.json";
const STATUS = new Set(["OFFEN", "IN ARBEIT", "ERLEDIGT"]);

export const POST: APIRoute = async ({ request }) => {
  let body: { nr?: number; status?: string; key?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Ungültiger Request-Body" }, 400);
  }

  const denied = checkWriteKey(body.key);
  if (denied) return denied;

  const nr = Number(body.nr);
  if (!Number.isInteger(nr) || nr < 1) return json({ error: "Ungültige Schritt-Nummer" }, 400);
  if (!body.status || !STATUS.has(body.status)) return json({ error: "Ungültiger Status" }, 400);

  try {
    const raw = await readAkteFile(FILE);
    const data = JSON.parse(raw) as { schritte: { nr: number; status: string; titel: string }[] };
    const schritt = data.schritte.find((s) => s.nr === nr);
    if (!schritt) return json({ error: `Schritt ${nr} nicht gefunden` }, 404);
    if (schritt.status === body.status) return json({ ok: true, unchanged: true });
    schritt.status = body.status;
    const via = await writeAkteFile(
      FILE,
      JSON.stringify(data, null, 2) + "\n",
      `zeitplan: Schritt ${nr} „${schritt.titel}“ → ${body.status} (Portal)`,
    );
    return json({ ok: true, via });
  } catch (err) {
    return json({ error: (err as Error).message }, 500);
  }
};
