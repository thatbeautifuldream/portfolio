import { allPosts, allGists } from "content-collections"
import { projects, roles, talks } from "@/lib/portfolio-data"
import { logAICrawlerRequest } from "@/lib/ai-crawler-logger"

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

export async function GET(request: Request) {
  const userAgent = request.headers.get("user-agent") ?? ""
  logAICrawlerRequest("/llms.txt", userAgent, { event: "llms_txt_fetch" })
  const sortedPosts = [...allPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  const sortedGists = [...allGists].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const md = [
    "# Milind Kumar Mishra",
    "",
    "> Product engineer building AI-native interfaces, product systems, and tools people return to. I work at the intersection of product engineering and design craft, with a focus on interaction quality, motion systems, and agentic workflows.",
    "",
    "## About",
    "",
    `- [Portfolio](${SITE_URL}) — Personal website with work, projects, talks, and writing`,
    `- [GitHub](https://github.com/thatbeautifuldream) — Open source contributions and side projects`,
    `- [LinkedIn](https://www.linkedin.com/in/mishramilind/) — Professional profile and work history`,
    `- [X/Twitter](https://x.com/milindmishra_) — Thoughts on product engineering and design`,
    `- [Resume](https://resume.milind.app) — Detailed work history`,
    `- [Calendly](https://cal.com/milind) — Book a conversation`,
    "",
    "## Work Experience",
    "",
    ...roles.map(
      (role) =>
        `- [${role.company}](${SITE_URL}/work) — ${role.role} (${role.period}, ${role.location})`
    ),
    "",
    "## Projects",
    "",
    ...projects.map(
      (project) =>
        `- [${project.name}](${project.href}) (${project.status}): ${project.description}`
    ),
    "",
    "## Talks",
    "",
    ...talks.map(
      (talk) =>
        `- [${talk.title}](${talk.href}) — ${talk.event}, ${talk.date}`
    ),
    "",
    "## Blog Posts",
    "",
    ...sortedPosts.map(
      (post) =>
        `- [${post.title}](${SITE_URL}/blog/${post.slug}${post.category ? ` — ${post.category} · ${formatDate(post.date)}` : ""})`
    ),
    "",
    "## Code Gists",
    "",
    ...sortedGists.map(
      (gist) =>
        `- [${gist.title}](${SITE_URL}/gist/${gist.slug}${gist.description ? ` — ${gist.description}` : ""})`
    ),
    "",
    "## Site Pages",
    "",
    `- [Work](${SITE_URL}/work) — Professional experience and roles`,
    `- [Projects](${SITE_URL}/projects) — Side projects and experiments`,
    `- [Talks](${SITE_URL}/talks) — Conference talks and open source contributions`,
    `- [Blog](${SITE_URL}/blog) — Technical writing and essays`,
    `- [Tweets](${SITE_URL}/tweets) — A collection of thoughts and observations`,
    `- [Contact](${SITE_URL}/contact) — Ways to get in touch`,
    `- [Guestbook](${SITE_URL}/guestbook) — Leave a message`,
    `- [Spotify](${SITE_URL}/spotify) — What I'm listening to`,
    `- [WakaTime](${SITE_URL}/wakatime) — Coding activity dashboard`,
    "",
    `_Last updated: ${formatDate(new Date())}_`,
  ].join("\n")

  return new Response(md, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
