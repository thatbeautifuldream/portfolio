import { allPosts } from "content-collections"

const SITE_URL = "https://milindmishra.com"

export async function GET(
  _request: Request,
  { params }: { params: Promise<Record<string, string>> }
) {
  const resolved = await params
  const slugWithExt = Object.values(resolved)[0] ?? ""
  const slug = slugWithExt.replace(/\.md$/, "")
  const post = allPosts.find((p) => p.slug === slug)

  if (!post) {
    return new Response("Not found", { status: 404 })
  }

  const md = [
    `# ${post.title}`,
    "",
    `> ${post.description}`,
    "",
    `- **Category:** ${post.category}`,
    `- **Date:** ${new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}`,
    `- **URL:** ${SITE_URL}/blog/${slug}`,
    "- **Author:** Milind Kumar Mishra",
    "",
    "---",
    "",
    post.content,
  ].join("\n")

  return new Response(md, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
}
