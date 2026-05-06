import { contactLinks } from "@/lib/portfolio-data"

const SITE_URL = "https://milindmishra.com"

export async function GET() {
  const md = [
    "# Contact — Milind Kumar Mishra",
    "",
    "> Get in touch: email, GitHub, LinkedIn, or book a time.",
    "",
    "## Contact Links",
    "",
    ...contactLinks.map(
      (link) => `- **${link.label}:** ${link.href} — ${link.copy}`
    ),
    "",
    "- **Email:** milindmishra.work@gmail.com",
    "- **Book time:** https://cal.com/milind",
    "",
    `[View contact page](${SITE_URL}/contact)`,
  ].join("\n")

  return new Response(md, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
}
