import { projects } from "@/lib/portfolio-data"

const SITE_URL = "https://milindmishra.com"

export async function GET() {
  const md = [
    "# Projects — Milind Kumar Mishra",
    "",
    "> Side projects born from curiosity. Built to understand technology, shipped to find clarity.",
    "",
    ...projects.map(
      (project) =>
        [
          `## ${project.name} (${project.status})`,
          "",
          `- **URL:** ${project.href}`,
          ...(project.github ? [`- **Source:** ${project.github}`] : []),
          "",
          project.description,
          "",
          "**Highlights:**",
          "",
          ...project.highlights.map((h) => `- ${h}`),
          "",
          `**Tags:** ${project.tags.join(" · ")}`,
          "",
        ].join("\n")
    ),
    "",
    `[View all projects](${SITE_URL}/projects)`,
  ].join("\n")

  return new Response(md, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
}
