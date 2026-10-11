import type { APIRoute } from "../lib/resource";
import { buildPageMarkdown } from "../lib/page-markdown";

export const prerender = true;

export const GET: APIRoute = async ({ site }) =>
  new Response(await buildPageMarkdown("/", site), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      Vary: "Accept, Accept-Encoding",
    },
  });
