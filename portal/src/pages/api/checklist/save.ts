import type { APIRoute } from "astro";
import { promises as fs } from "node:fs";
import path from "node:path";

// Server-Route (kein Prerender) – schreibt die ausgefüllte Checkliste in die Akte.
export const prerender = false;

const env = (k: string): string | undefined =>
  (import.meta.env as Record<string, string | undefined>)[k] ?? process.env[k];

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });

/** Nur Erfassungs-Dateien (…-erfasst.md) in den bekannten Ordnern, kein Path-Traversal. */
function safePath(p: unknown): string | null {
  if (typeof p !== "string") return null;
  const clean = p.replace(/^\/+/, "");
  if (clean.includes("..") || !/-erfasst\.md$/.test(clean)) return null;
  if (!/^[0-9A-Za-zÄÖÜäöüß._\-/]+$/.test(clean)) return null;
  return clean;
}

async function writeViaGitHub(filePath: string, markdown: string, title: string) {
  const token = env("GITHUB_TOKEN")!;
  const repo = env("GITHUB_REPO")!; // "owner/repo"
  const branch = env("GITHUB_BRANCH") || "main";
  const api = `https://api.github.com/repos/${repo}/contents/${encodeURI(filePath)}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "ferienhaus-portal",
  };
  // Vorhandene Datei → sha für Update holen
  let sha: string | undefined;
  const head = await fetch(`${api}?ref=${branch}`, { headers });
  if (head.ok) sha = (await head.json()).sha;

  const res = await fetch(api, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: `checkliste: ${title} erfasst (Portal)`,
      content: Buffer.from(markdown, "utf8").toString("base64"),
      branch,
      sha,
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`GitHub ${res.status}: ${t.slice(0, 200)}`);
  }
}

async function writeToDisk(filePath: string, markdown: string) {
  // Dev-Server läuft im portal/-Verzeichnis; die Akte liegt eine Ebene höher.
  const root = path.resolve(process.cwd(), "..");
  const abs = path.resolve(root, filePath);
  if (!abs.startsWith(root + path.sep)) throw new Error("Ungültiger Zielpfad");
  await fs.mkdir(path.dirname(abs), { recursive: true });
  await fs.writeFile(abs, markdown, "utf8");
}

export const POST: APIRoute = async ({ request }) => {
  let body: { slug?: string; path?: string; title?: string; markdown?: string; key?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Ungültiger Request-Body" }, 400);
  }

  const requiredKey = env("PORTAL_WRITE_KEY");
  if (requiredKey) {
    if (body.key !== requiredKey) return json({ error: "Falscher Speicher-Schlüssel" }, 401);
  } else if (!import.meta.env.DEV) {
    return json({ error: "Server nicht konfiguriert (PORTAL_WRITE_KEY fehlt)" }, 500);
  }

  const filePath = safePath(body.path);
  if (!filePath) return json({ error: "Unzulässiger Zielpfad" }, 400);
  if (typeof body.markdown !== "string" || body.markdown.length < 10)
    return json({ error: "Kein Inhalt" }, 400);

  const title = (body.title || "Checkliste").slice(0, 120);

  try {
    if (env("GITHUB_TOKEN") && env("GITHUB_REPO")) {
      await writeViaGitHub(filePath, body.markdown, title);
      return json({ ok: true, path: filePath, via: "git" });
    }
    await writeToDisk(filePath, body.markdown);
    return json({ ok: true, path: filePath, via: "fs" });
  } catch (err) {
    return json({ error: (err as Error).message }, 500);
  }
};
