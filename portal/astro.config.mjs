// @ts-check
import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify";
import { rewriteProjectLinks } from "./src/lib/remark-rewrite-links.mjs";

// https://astro.build
// Seiten werden statisch vorgerendert; nur API-Routen (prerender=false) laufen
// als Netlify-Function (z.B. /api/checklist/save → Git-Commit).
export default defineConfig({
  output: "static",
  adapter: netlify(),
  site: process.env.SITE_URL || "http://localhost:4321",
  trailingSlash: "ignore",
  markdown: {
    remarkPlugins: [rewriteProjectLinks],
    shikiConfig: {
      theme: "github-dark",
      wrap: true,
    },
  },
  devToolbar: { enabled: false },
});
