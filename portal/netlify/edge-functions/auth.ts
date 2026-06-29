/**
 * Zugangsschutz fürs ganze Portal per HTTP-Basic-Auth (Anmelde-Dialog im Browser).
 * Läuft als Netlify Edge Function vor jeder Antwort – schützt auch die statischen
 * Seiten und Medien. Prüft gegen Environment-Variablen (Netlify-UI bzw. .env):
 *
 *   PORTAL_USER / PORTAL_PASSWORD   – ein gemeinsamer Login
 *   PORTAL_USERS = "user:pass,bauleitung:geheim,..."  – optional mehrere Logins
 *
 * Verhalten:
 *   - localhost/127.0.0.1 (lokaler `npm run dev`) wird NICHT gesperrt.
 *   - Sind keine Zugangsdaten gesetzt, bleibt das Portal offen (z.B. erstes Deploy).
 */

declare const Deno: { env: { get(key: string): string | undefined } };

export default async (request: Request) => {
  const url = new URL(request.url);
  if (url.hostname === "localhost" || url.hostname === "127.0.0.1") return; // lokale Entwicklung

  const users = collectUsers();
  if (users.size === 0) return; // nicht konfiguriert → offen lassen

  const header = request.headers.get("authorization") ?? "";
  const [scheme, encoded] = header.split(" ");
  if (scheme === "Basic" && encoded) {
    let decoded = "";
    try {
      decoded = atob(encoded);
    } catch {
      decoded = "";
    }
    const sep = decoded.indexOf(":");
    if (sep >= 0) {
      const user = decoded.slice(0, sep);
      const pass = decoded.slice(sep + 1);
      if (users.get(user) === pass) return; // gültig → durchlassen
    }
  }

  return new Response("Zugang geschützt – bitte anmelden.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Ferienhaus Fürstenau", charset="UTF-8"',
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};

function collectUsers(): Map<string, string> {
  const map = new Map<string, string>();
  const user = Deno.env.get("PORTAL_USER");
  const pass = Deno.env.get("PORTAL_PASSWORD");
  if (user && pass) map.set(user, pass);

  const multi = Deno.env.get("PORTAL_USERS");
  if (multi) {
    for (const pair of multi.split(",")) {
      const sep = pair.indexOf(":");
      if (sep > 0) map.set(pair.slice(0, sep).trim(), pair.slice(sep + 1).trim());
    }
  }
  return map;
}

export const config = { path: "/*" };
