import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const ASSET_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".pdf"]);

function isExternal(url) {
  return /^([a-z]+:)?\/\//i.test(url) || url.startsWith("#") || url.startsWith("mailto:");
}

/**
 * Rewrites links inside project markdown so the portal can resolve them:
 *  - links to other `.md` files  -> /docs/<slug>
 *  - links/images to assets      -> /<path-relative-to-repo-root> (served from public/)
 *
 * Existing content uses no internal links yet; this keeps future cross-references working.
 */
export function rewriteProjectLinks() {
  return (tree, file) => {
    const fileDir = file?.path ? path.dirname(file.path) : REPO_ROOT;

    const visit = (node) => {
      if (!node || typeof node !== "object") return;
      if ((node.type === "link" || node.type === "image") && typeof node.url === "string") {
        const url = node.url;
        if (!isExternal(url) && !url.startsWith("/")) {
          const [rawPath, hash] = url.split("#");
          const abs = path.resolve(fileDir, rawPath);
          const rel = path.relative(REPO_ROOT, abs);
          if (!rel.startsWith("..")) {
            const ext = path.extname(rel).toLowerCase();
            if (ext === ".md") {
              const slug = rel.slice(0, -3).split(path.sep).join("/");
              node.url = `/docs/${slug}${hash ? "#" + hash : ""}`;
            } else if (ASSET_EXT.has(ext)) {
              node.url = "/" + rel.split(path.sep).join("/");
            }
          }
        }
      }
      if (Array.isArray(node.children)) node.children.forEach(visit);
    };

    visit(tree);
  };
}
