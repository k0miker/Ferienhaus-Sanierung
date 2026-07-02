import { promises as fs } from "node:fs";
import path from "node:path";

// Gemeinsame Schreib-Helfer für API-Routen, die Dateien der Akte ändern:
// in Produktion per GitHub-Commit (löst Netlify-Rebuild aus), im Dev direkt
// auf die Platte. Muster wie /api/checklist/save.

export const env = (k: string): string | undefined =>
  (import.meta.env as Record<string, string | undefined>)[k] ?? process.env[k];

export const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });

/** Prüft den Speicher-Schlüssel; gibt eine Fehler-Response oder null (= ok) zurück. */
export function checkWriteKey(key: unknown): Response | null {
  const required = env("PORTAL_WRITE_KEY");
  if (required) {
    if (key !== required) return json({ error: "Falscher Speicher-Schlüssel" }, 401);
    return null;
  }
  if (!import.meta.env.DEV)
    return json({ error: "Server nicht konfiguriert (PORTAL_WRITE_KEY fehlt)" }, 500);
  return null;
}

const ghHeaders = () => ({
  Authorization: `Bearer ${env("GITHUB_TOKEN")}`,
  Accept: "application/vnd.github+json",
  "User-Agent": "ferienhaus-portal",
});

export const useGitHub = () => Boolean(env("GITHUB_TOKEN") && env("GITHUB_REPO"));

const repoRoot = () => path.resolve(process.cwd(), "..");

/** Liest eine Akte-Datei – in Produktion über die GitHub-API, im Dev von der Platte. */
export async function readAkteFile(filePath: string): Promise<string> {
  if (useGitHub()) {
    const repo = env("GITHUB_REPO");
    const branch = env("GITHUB_BRANCH") || "main";
    const res = await fetch(
      `https://api.github.com/repos/${repo}/contents/${encodeURI(filePath)}?ref=${branch}`,
      { headers: ghHeaders() },
    );
    if (!res.ok) throw new Error(`GitHub-Lesen fehlgeschlagen (${res.status})`);
    const data = await res.json();
    return Buffer.from(data.content, "base64").toString("utf8");
  }
  return fs.readFile(path.resolve(repoRoot(), filePath), "utf8");
}

/** Schreibt eine Akte-Datei – GitHub-Commit in Produktion, Platte im Dev. */
export async function writeAkteFile(filePath: string, content: string, message: string) {
  if (useGitHub()) {
    const repo = env("GITHUB_REPO");
    const branch = env("GITHUB_BRANCH") || "main";
    const api = `https://api.github.com/repos/${repo}/contents/${encodeURI(filePath)}`;
    let sha: string | undefined;
    const head = await fetch(`${api}?ref=${branch}`, { headers: ghHeaders() });
    if (head.ok) sha = (await head.json()).sha;
    const res = await fetch(api, {
      method: "PUT",
      headers: { ...ghHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        content: Buffer.from(content, "utf8").toString("base64"),
        branch,
        sha,
      }),
    });
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`GitHub ${res.status}: ${t.slice(0, 200)}`);
    }
    return "git" as const;
  }
  const root = repoRoot();
  const abs = path.resolve(root, filePath);
  if (!abs.startsWith(root + path.sep)) throw new Error("Ungültiger Zielpfad");
  await fs.mkdir(path.dirname(abs), { recursive: true });
  await fs.writeFile(abs, content, "utf8");
  return "fs" as const;
}
