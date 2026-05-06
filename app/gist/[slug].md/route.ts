import { allGists } from "content-collections"

const SITE_URL = "https://milindmishra.com"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ "slug.md": string }> }
) {
  const { "slug.md": slugWithExt } = await params
  const slug = slugWithExt.replace(/\.md$/, "")
  const gist = allGists.find((g) => g.slug === slug)

  if (!gist) {
    return new Response("Not found", { status: 404 })
  }

  const tag = gist.tags?.split(",")[0]?.trim() ?? "Gist"

  const md = [
    `# ${gist.title}`,
    "",
    ...(gist.description ? [`> ${gist.description}`, ""] : []),
    `- **Tag:** ${tag}`,
    `- **Date:** ${gist.date instanceof Date ? gist.date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : ""}`,
    `- **URL:** ${SITE_URL}/gist/${slug}`,
    `- **GitHub Gist:** ${gist.gistUrl}`,
    "- **Author:** Milind Kumar Mishra",
    "",
    "---",
    "",
    gist.content,
  ].join("\n")

  return new Response(md, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
}
