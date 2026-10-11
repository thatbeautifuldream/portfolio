import type { APIRoute, GetStaticPaths } from "../lib/resource";
import { buildPageMarkdown, getMarkdownPaths } from "../lib/page-markdown";

export const prerender = true;

export const getStaticPaths: GetStaticPaths = getMarkdownPaths;

export const GET: APIRoute = async ({ params, site }) => {
  const body = await buildPageMarkdown(params.path ?? "/", site);

  if (!body) {
    return new Response("Not found\n", {
      status: 404,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      Vary: "Accept, Accept-Encoding",
    },
  });
};
