import { allPosts, allGists } from "content-collections"
import { projects, roles, talks, contactLinks } from "@/lib/portfolio-data"

const SITE_URL = "https://milindmishra.com"

function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  if (Number.isNaN(d.getTime())) return ""
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export async function GET() {
  const sortedPosts = [...allPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  const sortedGists = [...allGists].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const sections = [
    "# Milind Kumar Mishra — Full Content",
    "",
    "> Product engineer building AI-native interfaces, product systems, and tools people return to. I work at the intersection of product engineering and design craft, with a focus on interaction quality, motion systems, and agentic workflows.",
    "",
    "## Personal Info",
    "",
    `- **Name:** Milind Kumar Mishra`,
    `- **Location:** Bengaluru, India`,
    `- **Role:** Product Engineer / Design Engineer`,
    `- **Website:** ${SITE_URL}`,
    `- **GitHub:** https://github.com/thatbeautifuldream`,
    `- **LinkedIn:** https://www.linkedin.com/in/mishramilind/`,
    `- **X/Twitter:** https://x.com/milindmishra_`,
    `- **Email:** milindmishra.work@gmail.com`,
    "",
    "---",
    "",
    "## Work Experience",
    "",
    ...roles.map(
      (role) =>
        [
          `### ${role.company}`,
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
    "---",
    "",
    "## Projects",
    "",
    ...projects.map(
      (project) =>
        [
          `### ${project.name} (${project.status})`,
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
    "---",
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
    "",
    "---",
    "",
    "## Blog Posts",
    "",
    ...sortedPosts.map(
      (post) =>
        [
          `### ${post.title}`,
          "",
          `- **Category:** ${post.category}`,
          `- **Date:** ${formatDate(post.date)}`,
          `- **URL:** ${SITE_URL}/blog/${post.slug}`,
          "",
          post.description,
          "",
          "**Content:**",
          "",
          post.content,
          "",
          "---",
          "",
        ].join("\n")
    ),
    "",
    "## Code Gists",
    "",
    ...sortedGists.map(
      (gist) =>
        [
          `### ${gist.title}`,
          "",
          `- **Date:** ${formatDate(gist.date)}`,
          `- **URL:** ${SITE_URL}/gist/${gist.slug}`,
          `- **GitHub Gist:** ${gist.gistUrl}`,
          ...(gist.description ? ["", gist.description] : []),
          "",
          "**Content:**",
          "",
          gist.content,
          "",
          "---",
          "",
        ].join("\n")
    ),
    "",
    "## Contact",
    "",
    ...contactLinks.map(
      (link) =>
        [
          `### ${link.label}`,
          "",
          `- **URL:** ${link.href}`,
          "",
          link.copy,
          "",
        ].join("\n")
    ),
    `- **Email:** milindmishra.work@gmail.com`,
    `- **Book time:** https://cal.com/milind`,
    "",
    `_Generated: ${formatDate(new Date())}_`,
  ].join("\n")

  return new Response(sections, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
