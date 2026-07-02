import type { APIRoute } from "astro";
import { promises as fs } from "node:fs";
import path from "node:path";
import { UPLOAD_ZIELE } from "../../lib/uploads";

// Server-Route (kein Prerender) – nimmt Dokumente/Fotos entgegen und legt sie
// in der Akte ab (GitHub-Commit in Produktion, Dateisystem im lokalen Dev).
// Zusätzlich wird jeder Upload im Protokoll 99_quellen/upload-log.md vermerkt,
// damit Herkunft und Kontext (wer, wann, wozu) Teil der Akte sind.
export const prerender = false;

const env = (k: string): string | undefined =>
  (import.meta.env as Record<string, string | undefined>)[k] ?? process.env[k];

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });

const ERLAUBTE_ENDUNGEN = new Set([
  ".jpg", ".jpeg", ".png", ".webp", ".gif", ".heic",
  ".pdf", ".txt", ".md", ".csv",
]);

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB pro Datei (Netlify-Body-Limit ~6 MB)
const LOG_PATH = "99_quellen/upload-log.md";
const LOG_HEADER = `---\ntitle: Upload-Protokoll\nbereich: Sonstiges\n---\n\n# Upload-Protokoll\n\nÜber das Portal hochgeladene Dateien (neueste zuerst ergänzt am Ende).\nAlle Angaben stammen von den Hochladenden [ANGABE].\n\n`;

/** Dateiname säubern: nur Basename, sichere Zeichen, Datumspräfix. */
function safeFilename(name: unknown): { file: string; ext: string } | null {
  if (typeof name !== "string" || !name.trim()) return null;
  const base = name.split(/[\\/]/).pop()!.trim();
  const ext = (base.match(/\.[A-Za-z0-9]+$/)?.[0] ?? "").toLowerCase();
  if (!ERLAUBTE_ENDUNGEN.has(ext)) return null;
  const stem = base
    .slice(0, base.length - ext.length)
    .replace(/[ÄÀÁÂ]/g, "A").replace(/[äàáâ]/g, "a")
    .replace(/[ÖÒÓÔ]/g, "O").replace(/[öòóô]/g, "o")
    .replace(/[ÜÙÚÛ]/g, "U").replace(/[üùúû]/g, "u")
    .replace(/ß/g, "ss")
    .replace(/[^0-9A-Za-z._-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "")
    .slice(0, 80);
  if (!stem) return null;
  return { file: stem + ext, ext };
}

interface GitHubCfg {
  token: string;
  repo: string;
  branch: string;
}

function githubCfg(): GitHubCfg | null {
  const token = env("GITHUB_TOKEN");
  const repo = env("GITHUB_REPO");
  if (!token || !repo) return null;
  return { token, repo, branch: env("GITHUB_BRANCH") || "main" };
}

function ghHeaders(cfg: GitHubCfg) {
  return {
    Authorization: `Bearer ${cfg.token}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "ferienhaus-portal",
  };
}

async function ghGet(cfg: GitHubCfg, filePath: string): Promise<{ sha: string; content: string } | null> {
  const api = `https://api.github.com/repos/${cfg.repo}/contents/${encodeURI(filePath)}?ref=${cfg.branch}`;
  const res = await fetch(api, { headers: ghHeaders(cfg) });
  if (!res.ok) return null;
  const data = await res.json();
  return { sha: data.sha, content: Buffer.from(data.content ?? "", "base64").toString("utf8") };
}

async function ghPut(cfg: GitHubCfg, filePath: string, contentBase64: string, message: string, sha?: string) {
  const api = `https://api.github.com/repos/${cfg.repo}/contents/${encodeURI(filePath)}`;
  const res = await fetch(api, {
    method: "PUT",
    headers: { ...ghHeaders(cfg), "Content-Type": "application/json" },
    body: JSON.stringify({ message, content: contentBase64, branch: cfg.branch, sha }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`GitHub ${res.status}: ${t.slice(0, 200)}`);
  }
}

/** Absoluten Zielpfad im Repo (eine Ebene über portal/) bestimmen, ohne Ausbruch. */
function diskPath(filePath: string): string {
  const root = path.resolve(process.cwd(), "..");
  const abs = path.resolve(root, filePath);
  if (!abs.startsWith(root + path.sep)) throw new Error("Ungültiger Zielpfad");
  return abs;
}

export const POST: APIRoute = async ({ request }) => {
  let body: {
    key?: string;
    uploader?: string;
    ziel?: string;
    note?: string;
    filename?: string;
    data?: string; // Base64 (ohne data:-Präfix)
  };
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

  const ziel = UPLOAD_ZIELE[body.ziel ?? ""];
  if (!ziel) return json({ error: "Unzulässiger Zielbereich" }, 400);

  const named = safeFilename(body.filename);
  if (!named) return json({ error: "Unzulässiger Dateiname oder Dateityp" }, 400);

  if (typeof body.data !== "string" || body.data.length < 8)
    return json({ error: "Keine Dateidaten" }, 400);
  let bytes: Buffer;
  try {
    bytes = Buffer.from(body.data, "base64");
  } catch {
    return json({ error: "Dateidaten nicht lesbar (Base64 erwartet)" }, 400);
  }
  if (bytes.length === 0) return json({ error: "Leere Datei" }, 400);
  if (bytes.length > MAX_BYTES)
    return json({ error: `Datei zu groß (max. ${Math.round(MAX_BYTES / 1024 / 1024)} MB)` }, 413);

  const uploader = String(body.uploader ?? "").trim().slice(0, 60) || "unbekannt";
  const note = String(body.note ?? "").trim().slice(0, 500);

  const now = new Date();
  const datum = now.toISOString().slice(0, 10);
  const zeit = now.toISOString().slice(11, 16);
  const filePath = `${ziel.dir}/uploads/${datum}_${named.file}`;
  const logLine = `- ${datum} ${zeit} UTC – **${uploader}**: [\`${filePath}\`](/${filePath}) → ${ziel.label}${note ? ` – ${note}` : ""}\n`;

  try {
    const gh = githubCfg();
    if (gh) {
      // 1) Datei committen (falls gleicher Name schon existiert: sha für Update mitgeben)
      const existing = await ghGet(gh, filePath);
      await ghPut(
        gh,
        filePath,
        bytes.toString("base64"),
        `upload: ${named.file} von ${uploader} (Portal)`,
        existing?.sha,
      );
      // 2) Protokoll ergänzen
      const log = await ghGet(gh, LOG_PATH);
      const logContent = (log?.content ?? LOG_HEADER) + logLine;
      await ghPut(
        gh,
        LOG_PATH,
        Buffer.from(logContent, "utf8").toString("base64"),
        `upload-log: ${named.file} (Portal)`,
        log?.sha,
      );
      return json({ ok: true, path: filePath, via: "git" });
    }

    // Lokaler Dev-Modus: direkt ins Dateisystem
    const abs = diskPath(filePath);
    await fs.mkdir(path.dirname(abs), { recursive: true });
    await fs.writeFile(abs, bytes);
    const logAbs = diskPath(LOG_PATH);
    let logContent = LOG_HEADER;
    try {
      logContent = await fs.readFile(logAbs, "utf8");
    } catch {
      /* Datei existiert noch nicht */
    }
    await fs.writeFile(logAbs, logContent + logLine, "utf8");
    return json({ ok: true, path: filePath, via: "fs" });
  } catch (err) {
    return json({ error: (err as Error).message }, 500);
  }
};
