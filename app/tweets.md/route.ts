const SITE_URL = "https://milindmishra.com"

export async function GET() {
  const md = [
    "# Tweets — Milind Kumar Mishra",
    "",
    "> A collection of thoughts and observations.",
    "",
    "Embedded tweets are rendered on the website. Visit the page to view them.",
    "",
    `[View tweets](${SITE_URL}/tweets)`,
  ].join("\n")

  return new Response(md, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
}
