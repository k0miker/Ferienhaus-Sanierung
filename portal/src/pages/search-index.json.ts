import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { titleFor, sectionFor, excerptFor } from "../lib/sections";

export const GET: APIRoute = async () => {
  const docs = await getCollection("docs");
  const items = docs.map((d) => ({
    url: `/docs/${d.id}`,
    title: titleFor(d),
    section: sectionFor(d.id).label,
    icon: sectionFor(d.id).icon,
    excerpt: excerptFor(d, 180),
    text: (d.body ?? "")
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/[#*`>|]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase(),
  }));
  return new Response(JSON.stringify(items), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
};
