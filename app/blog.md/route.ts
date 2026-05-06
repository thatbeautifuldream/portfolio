import { allPosts } from "content-collections"

const SITE_URL = "https://milindmishra.com"

export async function GET() {
  const sorted = [...allPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const md = [
    "# Blog — Milind Kumar Mishra",
    "",
    `> Technical writing on product engineering, AI-native interfaces, and design craft.`,
    "",
    ...sorted.map(
      (post) =>
        `- [${post.title}](${SITE_URL}/blog/${post.slug}) — ${post.category} · ${new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}`
    ),
  ].join("\n")

  return new Response(md, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
}
