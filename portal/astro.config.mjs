// @ts-check
import { defineConfig } from "astro/config";
import { rewriteProjectLinks } from "./src/lib/remark-rewrite-links.mjs";

// https://astro.build
export default defineConfig({
  site: "http://localhost:4321",
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
