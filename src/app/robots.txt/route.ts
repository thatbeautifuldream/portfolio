import { siteConfig } from "../../lib/seo";

export const dynamic = "force-static";

// AI crawlers are explicitly allowed so assistants can cite and index the
// site. Listed by user-agent rather than relying on the blanket `User-agent:
// *` rule, which keeps intent unambiguous and survives future bot policy
// changes.
const aiCrawlers = [
  "GPTBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "anthropic-ai",
  "Claude-Web",
  "Google-Extended",
  "Applebot-Extended",
  "DeepSeekBot",
  "ora-agent",
  "Bytespider",
  "CCBot",
  "cohere-ai",
  "Meta-ExternalAgent",
  "Amazonbot",
];

const getRobotsTxt = (sitemapURL: URL) => {
  const rules = aiCrawlers
    .map((ua) => `User-agent: ${ua}\nAllow: /`)
    .join("\n\n");

  return `# AI assistants and search crawlers are welcome to read this site.
${rules}

User-agent: *
Allow: /

Sitemap: ${sitemapURL.href}
`;
};

export function GET() {
  const sitemapURL = new URL("sitemap-index.xml", siteConfig.url);
  return new Response(getRobotsTxt(sitemapURL), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
