import type { APIRoute } from "../lib/resource";
import { getCollection } from "../lib/content";
import { absoluteUrl, getSiteOrigin, siteConfig } from "../lib/seo";

export const prerender = true;

function gistDate(data: { datePublished?: Date; date?: Date }): Date {
  return data.datePublished ?? data.date ?? new Date(0);
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export const GET: APIRoute = async ({ site }) => {
  const origin = getSiteOrigin(site);

  const posts = (await getCollection("posts")).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
  const gists = (await getCollection("gists"))
    .filter((gist) => gist.data.isPublic)
    .sort((a, b) => gistDate(b.data).getTime() - gistDate(a.data).getTime());

  const postSections = posts
    .map(
      (post) => `## ${post.data.title}

URL: ${absoluteUrl(`/blog/${post.id}`, site)}
Category: ${post.data.category}
Published: ${formatDate(post.data.date)}
Summary: ${post.data.description}

${post.body?.trim() ?? ""}`,
    )
    .join("\n\n---\n\n");

  const gistSections = gists
    .map(
      (gist) => `## ${gist.data.title}

URL: ${absoluteUrl(`/gist/${gist.id}`, site)}
Published: ${formatDate(gistDate(gist.data))}
Source: ${gist.data.gistUrl}
${gist.data.description ? `Summary: ${gist.data.description}\n` : ""}
${gist.body?.trim() ?? ""}`,
    )
    .join("\n\n---\n\n");

  const body = `# ${siteConfig.name} - Full LLM Context

Site URL: ${origin}/
Author: ${siteConfig.name}
Language: English
Primary topics: product engineering, AI-native interfaces, frontend, motion design

${siteConfig.description}

Links: ${siteConfig.sameAs.join(", ")}

# Writing

${postSections}

# Gists

${gistSections}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
