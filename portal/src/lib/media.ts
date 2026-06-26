import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

export interface MediaFile {
  url: string; // wird über public/-Symlinks ausgeliefert
  rel: string;
  name: string;
  ext: string;
  kind: "bild" | "pdf" | "plan";
  dir: string;
}

const IMG = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"]);
const SCAN_DIRS = [
  "01_bestand/grundrisse",
  "01_bestand/bauunterlagen",
  "01_bestand/fotos",
  "99_quellen",
  "05_angebote",
  "07_foerderung/antraege",
];

function walk(abs: string, acc: string[]) {
  let entries: fs.Dirent[];
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

export function listMedia(): MediaFile[] {
  const files: string[] = [];
  for (const d of SCAN_DIRS) walk(path.join(REPO_ROOT, d), files);

  const out: MediaFile[] = [];
  for (const abs of files) {
    const ext = path.extname(abs).toLowerCase();
    const isImg = IMG.has(ext);
    if (!isImg && ext !== ".pdf") continue;
    const rel = path.relative(REPO_ROOT, abs).split(path.sep).join("/");
    out.push({
      url: "/" + rel.split("/").map(encodeURIComponent).join("/"),
      rel,
      name: path.basename(abs),
      ext,
      kind: ext === ".pdf" ? "pdf" : rel.includes("grundriss") ? "plan" : "bild",
      dir: path.dirname(rel),
    });
  }
  return out.sort((a, b) => a.rel.localeCompare(b.rel, "de"));
}
