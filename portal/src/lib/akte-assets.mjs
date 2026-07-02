import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Liefert Originaldateien der Akte (PDF, Bilder …) unter /<pfad-relativ-zur-akte> aus.
// Ersetzt die früheren Symlinks in public/, die auf Windows und beim
// Netlify-Deploy nicht funktionieren (Symlink-Ziele landen nicht im dist/).

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

const AKTE_DIRS = [
  "00_projekt",
  "01_bestand",
  "02_gebaeudehuelle",
  "03_haustechnik",
  "04_innenausbau",
  "05_angebote",
  "06_kosten",
  "07_foerderung",
  "08_entscheidungen",
  "09_bauablauf",
  "99_quellen",
];

const ASSET_EXT = new Set([
  ".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg",
  ".pdf", ".html",
]);

const MIME = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
  ".html": "text/html; charset=utf-8",
};

function walk(abs, acc) {
  let entries;
  try {
    entries = fs.readdirSync(abs, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    const p = path.join(abs, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.isFile() && !e.name.startsWith(".")) acc.push(p);
  }
}

/** Auflösung einer Request-URL auf eine Akte-Datei – oder null. */
function resolveAkteFile(url) {
  let rel;
  try {
    rel = decodeURIComponent(url.split("?")[0]).replace(/^\/+/, "");
  } catch {
    return null;
  }
  if (rel.includes("..") || rel.includes("\0")) return null;
  if (!AKTE_DIRS.some((d) => rel === d || rel.startsWith(d + "/"))) return null;
  const ext = path.extname(rel).toLowerCase();
  if (!ASSET_EXT.has(ext)) return null;
  const abs = path.join(REPO_ROOT, rel);
  if (!abs.startsWith(REPO_ROOT)) return null;
  return fs.existsSync(abs) && fs.statSync(abs).isFile() ? { abs, ext } : null;
}

export function akteAssets() {
  return {
    name: "akte-assets",
    hooks: {
      // Dev: Dateien direkt aus der Akte ausliefern.
      "astro:server:setup": ({ server }) => {
        server.middlewares.use((req, res, next) => {
          const hit = req.url && resolveAkteFile(req.url);
          if (!hit) return next();
          res.setHeader("Content-Type", MIME[hit.ext] ?? "application/octet-stream");
          fs.createReadStream(hit.abs).pipe(res);
        });
      },
      // Build: Assets real ins dist/ kopieren (Netlify deployt nur echte Dateien).
      "astro:build:done": ({ dir, logger }) => {
        const outRoot = fileURLToPath(dir);
        let count = 0;
        for (const d of AKTE_DIRS) {
          const files = [];
          walk(path.join(REPO_ROOT, d), files);
          for (const abs of files) {
            const ext = path.extname(abs).toLowerCase();
            if (!ASSET_EXT.has(ext)) continue;
            const rel = path.relative(REPO_ROOT, abs);
            const dest = path.join(outRoot, rel);
            fs.mkdirSync(path.dirname(dest), { recursive: true });
            fs.copyFileSync(abs, dest);
            count++;
          }
        }
        logger.info(`akte-assets: ${count} Originaldateien nach dist/ kopiert`);
      },
    },
  };
}
