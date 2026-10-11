export const dynamic = "force-static";
const encodeXML = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&apos;",
      })[char]!,
  );
import { getCollection } from "../../lib/content";
import { siteConfig } from "../../lib/seo";
export async function GET() {
  const posts = (await getCollection("posts")).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
  const items = posts
    .map((post) => {
      const url = `${siteConfig.url}/blog/${post.id}`;
      return `<item><title>${encodeXML(post.data.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><description>${encodeXML(post.data.description ?? "")}</description><pubDate>${post.data.date.toUTCString()}</pubDate><category>${encodeXML(post.data.category)}</category></item>`;
    })
    .join("");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${siteConfig.shortName} · Blog</title><description>Notes on product engineering, AI interfaces, developer tools, and the journey of building products.</description><link>${siteConfig.url}</link>${items}</channel></rss>`,
    { headers: { "Content-Type": "application/xml" } },
  );
}
