import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import Anthropic from "@anthropic-ai/sdk";

// Server-Route (kein Prerender) – KI-Assistent über die komplette Projektakte.
// Die Markdown-Akte (Content-Collection "docs") wird als System-Kontext an die
// Claude-API gegeben; die Antwort wird als Klartext gestreamt. Der Akte-Block
// trägt einen Prompt-Cache-Breakpoint, sodass Folgefragen innerhalb von
// 5 Minuten nur ~10 % der Eingabekosten verursachen.
export const prerender = false;

const env = (k: string): string | undefined =>
  (import.meta.env as Record<string, string | undefined>)[k] ?? process.env[k];

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });

const MODEL = () => env("CHAT_MODEL") || "claude-opus-4-8";
const MAX_TURNS = 24; // Verlauf begrenzen (Kosten/Kontext)
const MAX_MSG_CHARS = 4000;

const ANWEISUNG = `Du bist der KI-Assistent des Sanierungsportals für das Ferienhaus Wilhelm-Busch-Straße 7 in Fürstenau (Baujahr 1978, Erbbaurecht). Deine Nutzer sind Besitzer, Energieberater, Bauleitung und Handwerker.

Im Block <akte> steht die vollständige Projektakte (Markdown-Dateien, Dateiname jeweils in der =====-Zeile).

Regeln:
- Antworte auf Deutsch, klar und so knapp wie möglich; Fachbegriffe kurz erklären, wenn sie nicht selbsterklärend sind.
- Stütze dich ausschließlich auf die Akte. Erfinde keine Maße, Kosten, U-Werte, Termine oder Förderaussagen.
- Beachte die Evidenz-Kennzeichnung der Akte ([BELEGT], [ABGELESEN], [ANGABE], [ANNAHME], [OFFEN], [WIDERSPRUCH]): Gib Unsicheres als unsicher wieder; ist etwas offen oder widersprüchlich, sage das ausdrücklich statt eine Version auszuwählen.
- Nenne am Ende der Antwort die Quelldatei(en), auf die du dich stützt (z. B. „Quelle: 02_gebaeudehuelle/fensterliste.md").
- Stelle fachliche Prüfungen (Statik, Elektro, Feuchte, Förderfähigkeit …) nie als entbehrlich dar.
- Wenn die Akte zu einer Frage nichts hergibt, sage das klar, statt zu raten – und nenne, wo/wie die Information beschafft werden könnte, falls die Akte dazu einen nächsten Schritt kennt.`;

let corpusCache: string | null = null;

async function buildCorpus(): Promise<string> {
  if (corpusCache) return corpusCache;
  const docs = await getCollection("docs");
  const parts = docs
    .filter((d) => (d.body ?? "").trim().length > 0)
    .sort((a, b) => a.id.localeCompare(b.id, "de"))
    .map((d) => `===== DATEI: ${d.id} =====\n${(d.body ?? "").trim()}`);
  corpusCache = `<akte>\n${parts.join("\n\n")}\n</akte>`;
  return corpusCache;
}

interface Turn {
  role: "user" | "assistant";
  content: string;
}

function parseTurns(input: unknown): Turn[] | null {
  if (!Array.isArray(input) || input.length === 0) return null;
  const turns: Turn[] = [];
  for (const t of input.slice(-MAX_TURNS)) {
    if (!t || (t.role !== "user" && t.role !== "assistant")) return null;
    if (typeof t.content !== "string" || !t.content.trim()) return null;
    turns.push({ role: t.role, content: t.content.trim().slice(0, MAX_MSG_CHARS) });
  }
  if (turns[turns.length - 1].role !== "user") return null;
  return turns;
}

export const POST: APIRoute = async ({ request }) => {
  const apiKey = env("CLAUDE_API_KEY") ?? env("ANTHROPIC_API_KEY");
  if (!apiKey) return json({ error: "Server nicht konfiguriert (CLAUDE_API_KEY fehlt)" }, 500);

  let body: { messages?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Ungültiger Request-Body" }, 400);
  }
  const turns = parseTurns(body.messages);
  if (!turns) return json({ error: "Ungültiger Gesprächsverlauf" }, 400);

  const corpus = await buildCorpus();
  const client = new Anthropic({ apiKey });

  const stream = client.messages.stream({
    model: MODEL(),
    max_tokens: 4096,
    thinking: { type: "adaptive" },
    system: [
      { type: "text", text: ANWEISUNG },
      { type: "text", text: corpus, cache_control: { type: "ephemeral" } },
    ],
    messages: turns,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal") {
          controller.enqueue(encoder.encode("\n\n_(Anfrage wurde aus Sicherheitsgründen abgelehnt.)_"));
        } else if (final.stop_reason === "max_tokens") {
          controller.enqueue(encoder.encode("\n\n_(Antwort gekürzt – bitte konkreter nachfragen.)_"));
        }
        controller.close();
      } catch (err) {
        controller.enqueue(encoder.encode(`\n\n_(Fehler: ${(err as Error).message})_`));
        controller.close();
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
};
