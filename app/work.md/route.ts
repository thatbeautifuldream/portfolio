import { roles } from "@/lib/portfolio-data"

const SITE_URL = "https://milindmishra.com"

export async function GET() {
  const md = [
    "# Work Experience — Milind Kumar Mishra",
    "",
    "> Product and AI work across startup environments.",
    "",
    ...roles.map(
      (role) =>
        [
          `## ${role.company}`,
          "",
          `- **Role:** ${role.role}`,
          `- **Period:** ${role.period}`,
          `- **Location:** ${role.location}`,
          "",
          role.summary,
          "",
          "**Highlights:**",
          "",
          ...role.highlights.map((h) => `- ${h}`),
          "",
        ].join("\n")
    ),
    "",
    `[View full profile](${SITE_URL}/work)`,
  ].join("\n")

  return new Response(md, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
}
