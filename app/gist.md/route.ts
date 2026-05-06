import { allGists } from "content-collections"

const SITE_URL = "https://milindmishra.com"

export async function GET() {
  const sorted = [...allGists].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const md = [
    "# Code Gists — Milind Kumar Mishra",
    "",
    "> Code snippets and technical notes synced from GitHub Gists.",
    "",
    ...sorted.map(
      (gist) =>
        `- [${gist.title}](${SITE_URL}/gist/${gist.slug})${gist.description ? ` — ${gist.description}` : ""}`
    ),
  ].join("\n")

  return new Response(md, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
}
