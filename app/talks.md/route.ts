import { talks, contributions } from "@/lib/portfolio-data"

const SITE_URL = "https://milindmishra.com"

export async function GET() {
  const md = [
    "# Talks & Open Source — Milind Kumar Mishra",
    "",
    "> Talks on React, motion systems, interface architecture, and AI for frontend engineers.",
    "",
    "## Talks",
    "",
    ...talks.map(
      (talk) =>
        [
          `### ${talk.title}`,
          "",
          `- **Event:** ${talk.event}`,
          `- **Date:** ${talk.date}`,
          `- **URL:** ${talk.href}`,
          "",
          talk.description,
          "",
        ].join("\n")
    ),
    "## Open Source Contributions",
    "",
    ...contributions.map(
      (item) =>
        [
          `### ${item.title}`,
          "",
          `- **URL:** ${item.href}`,
          "",
          item.context,
          "",
        ].join("\n")
    ),
    "",
    `[View all talks](${SITE_URL}/talks)`,
  ].join("\n")

  return new Response(md, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
}
