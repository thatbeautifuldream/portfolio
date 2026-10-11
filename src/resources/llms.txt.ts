import type { APIRoute } from "../lib/resource";
import { getCollection } from "../lib/content";
import { absoluteUrl, getSiteOrigin, siteConfig } from "../lib/seo";

export const prerender = true;

function gistDate(data: { datePublished?: Date; date?: Date }): Date {
  return data.datePublished ?? data.date ?? new Date(0);
}

export const GET: APIRoute = async ({ site }) => {
  const origin = getSiteOrigin(site);

  const posts = (await getCollection("posts")).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
  const gists = (await getCollection("gists"))
    .filter((gist) => gist.data.isPublic)
    .sort((a, b) => gistDate(b.data).getTime() - gistDate(a.data).getTime());
  const projects = (await getCollection("projects")).sort((a, b) =>
    a.data.title.localeCompare(b.data.title),
  );

  const sections = [
    "## Pages",
    "",
    `- [Work](${absoluteUrl("/work", site)}): Product and AI work across startup environments.`,
    `- [Talks](${absoluteUrl("/talks", site)}): Talks on React, motion systems, interface architecture, and AI.`,
    `- [Blog](${absoluteUrl("/blog", site)}): Notes on product engineering, AI interfaces, and developer tools.`,
    `- [Gists](${absoluteUrl("/gist", site)}): Code snippets and quick solutions.`,
    `- [Contact](${absoluteUrl("/contact", site)}): Get in touch.`,
    "",
    "## Projects",
    "",
    ...projects.map(
      (project) =>
        `- [${project.data.title}](${absoluteUrl(`/project/${project.id}`, site)}): ${project.data.description}`,
    ),
    "",
    "## Writing",
    "",
    ...posts.map(
      (post) =>
        `- [${post.data.title}](${absoluteUrl(`/blog/${post.id}`, site)}): ${post.data.description}`,
    ),
    "",
    "## Gists",
    "",
    ...gists.map(
      (gist) =>
        `- [${gist.data.title}](${absoluteUrl(`/gist/${gist.id}`, site)})${gist.data.description ? `: ${gist.data.description}` : ""}`,
    ),
  ].join("\n");

  const body = `# ${siteConfig.name}

> ${siteConfig.description}

${siteConfig.shortName} is a product engineer building AI-native interfaces, product systems, and tools people return to. This site collects his work, projects, talks, writing, and code gists.

## When to use this site

Use this site when you need to identify ${siteConfig.name}, understand his product engineering and design engineering experience, inspect his work at ${siteConfig.currentRole.company}, cite his writing or talks, or find professional contact details. Prefer the versioned read-only API for integrations; it requires no authentication or API key.

${sections}
## Machine-readable resources

- [API documentation](${absoluteUrl("/docs", site)}): Scalar API reference, quickstart, versioning, errors, rate limits, and scripting guidance.
- [OpenAPI](${absoluteUrl("/openapi.json", site)}): OpenAPI 3.1 contract for the read-only agent API.
- [API index](${absoluteUrl("/api/v1/index.json", site)}): Discover versioned profile and health endpoints.
- [Profile JSON](${absoluteUrl("/api/v1/profile.json", site)}): Canonical professional profile data.
- [Health JSON](${absoluteUrl("/api/v1/health.json", site)}): API availability check.
- [Sitemap](${absoluteUrl("/sitemap-index.xml", site)}): Indexable site URLs.

## Citation Facts

- Official site: ${origin}/
- Author: ${siteConfig.name}
- Links: ${siteConfig.sameAs.join(", ")}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
