import { getCollection } from "./content";
import { contactLinks, contributions, roles, talks } from "../data/portfolio";
import { absoluteUrl, siteConfig, sitePages } from "./seo";

function date(value: Date | string) {
  return typeof value === "string" ? value : value.toISOString().slice(0, 10);
}

function link(label: string, path: string, site?: URL | null) {
  return `[${label}](${absoluteUrl(path, site)})`;
}

function list(items: string[]) {
  return items.map((item) => `- ${item}`).join("\n");
}

function page(title: string, body: string, site?: URL | null) {
  return `# ${title}\n\n${body.trim()}\n\n---\n\nSource: ${absoluteUrl("/", site)}`;
}

function staticPage(path: string, site?: URL | null): string | null {
  const pages: Record<string, string> = {
    "/contact": page(
      `Contact ${siteConfig.name}`,
      `I'm most responsive on email and LinkedIn. If you have something interesting to discuss, send a detailed message rather than a generic introduction.\n\nEmail: ${siteConfig.email}\n\nBased in ${siteConfig.location.city}, ${siteConfig.location.country} (${siteConfig.location.timezoneLabel}). I keep a 3–4 hour overlap with US mornings and most of the European workday, and I'm open to remote roles, B2B contractor, or EOR arrangements.\n\n${list(contactLinks.map((item) => `[${item.label}](${item.href}) — ${item.copy}`))}`,
      site,
    ),
    "/docs": page(
      `API documentation · ${siteConfig.name}`,
      `This is the public API documentation for ${siteConfig.name}. It provides stable, read-only access to professional identity, current role, expertise, blog posts, gists, and canonical links.\n\n## Quickstart\n\nNo authentication or API key is required.\n\n\`\`\`sh\ncurl -s ${absoluteUrl("/api/v1/index.json", site)}\ncurl -s ${absoluteUrl("/api/v1/profile.json", site)}\n\`\`\`\n\n## Resources\n\n- ${link("OpenAPI", "/openapi.json", site)}\n- ${link("API index", "/api/v1/index.json", site)}\n- ${link("Profile JSON", "/api/v1/profile.json", site)}\n- ${link("Posts JSON", "/api/v1/posts.json", site)}\n- ${link("Gists JSON", "/api/v1/gists.json", site)}\n\nUse \/api\/v1\/ for integrations. JSON errors expose stable \`code\`, \`message\`, and \`hint\` fields.`,
      site,
    ),
    "/privacy": page(
      `Privacy · ${siteConfig.name}`,
      `The pages are primarily static content. When analytics are enabled, Google Analytics and Microsoft Clarity load only after a visitor interacts with the page or after the idle fallback. Those services may receive page-view, device, browser, and interaction information according to their own policies. The site does not ask visitors to create an account or submit a password.\n\nIf you email me, I receive the information you choose to include so I can reply. I use it for the conversation you initiated and do not sell personal information. The public profile and developer API are read-only and do not require cookies, login, API keys, or personal data.`,
      site,
    ),
    "/work": page(
      `Work · ${siteConfig.name}`,
      `Product and AI work across startup environments. Different products and teams, but a consistent pull toward the surfaces people touch and the craft behind them.\n\n## How I approach product work\n\nI care most about the surfaces people actually touch. Good product engineering means understanding not just the code, but how users move through a system and where their mental models break down.\n\n${roles
        .map(
          (role) =>
            `## ${role.company}\n\n**${role.role}** · ${role.period} · ${role.location}\n\n${role.summary}\n\n${list(role.highlights)}`,
        )
        .join("\n\n")}`,
      site,
    ),
    "/talks": page(
      `Talks · ${siteConfig.name}`,
      `I share what I learn because it forces me to learn it deeper. These talks come from things I ran into firsthand and couldn't stop thinking about.\n\n${talks
        .map(
          (talk) =>
            `## ${talk.title}\n\n${talk.event} · ${talk.date}\n\n${talk.description}\n\n[View talk](${talk.href})`,
        )
        .join("\n\n")}\n\n## Open source contributions\n\n${contributions
        .map((item) => `- [${item.title}](${item.href}) — ${item.context}`)
        .join("\n")}`,
      site,
    ),
  };

  return pages[path] ?? null;
}

async function collectionPages(site?: URL | null) {
  const posts = (await getCollection("posts")).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
  const gists = (await getCollection("gists"))
    .filter((item) => item.data.isPublic)
    .sort(
      (a, b) =>
        (b.data.datePublished ?? b.data.date ?? new Date(0)).getTime() -
        (a.data.datePublished ?? a.data.date ?? new Date(0)).getTime(),
    );
  const projects = (await getCollection("projects")).sort((a, b) =>
    a.data.title.localeCompare(b.data.title),
  );
  const uses = (await getCollection("uses")).sort((a, b) =>
    a.data.title.localeCompare(b.data.title),
  );
  const pages = new Map<string, string>();

  pages.set(
    "/blog",
    page(
      "Blog",
      `Notes on the journey of building products.\n\n${posts
        .map(
          (post) =>
            `- ${link(post.data.title, `/blog/${post.id}`, site)} — ${post.data.description}`,
        )
        .join("\n")}`,
      site,
    ),
  );
  pages.set(
    "/gist",
    page(
      "Gists",
      `Code snippets and quick solutions.\n\n${gists
        .map(
          (gist) =>
            `- ${link(gist.data.title, `/gist/${gist.id}`, site)}${gist.data.description ? ` — ${gist.data.description}` : ""}`,
        )
        .join("\n")}`,
      site,
    ),
  );
  pages.set(
    "/uses",
    page(
      "Uses",
      `The hardware, software, and services I use every day to build products.\n\n${uses
        .map(
          (item) =>
            `- ${link(item.data.title, `/uses/${item.id}`, site)} — ${item.data.description}`,
        )
        .join("\n")}`,
      site,
    ),
  );

  for (const post of posts) {
    pages.set(
      `/blog/${post.id}`,
      page(
        post.data.title,
        `**${post.data.category}** · ${date(post.data.date)}\n\n${post.data.description}\n\n${post.body?.trim() ?? ""}`,
        site,
      ),
    );
  }
  for (const gist of gists) {
    const published = gist.data.datePublished ?? gist.data.date ?? new Date(0);
    pages.set(
      `/gist/${gist.id}`,
      page(
        gist.data.title,
        `${gist.data.description ? `${gist.data.description}\n\n` : ""}**${gist.data.tags?.split(",")[0]?.trim() ?? "Gist"}** · ${date(published)}\n\n${gist.body?.trim() ?? ""}\n\n[View on GitHub](${gist.data.gistUrl})`,
        site,
      ),
    );
  }
  pages.set(
    "/project",
    page(
      "Projects",
      `Tools I build and use every day.\n\n${projects
        .map(
          (project) =>
            `- ${link(project.data.title, `/project/${project.id}`, site)} — ${project.data.description}`,
        )
        .join("\n")}`,
      site,
    ),
  );
  for (const project of projects) {
    pages.set(
      `/project/${project.id}`,
      page(
        project.data.title,
        `${project.data.description}\n\n[${project.data.url}](${project.data.url})\n\n${project.body?.trim() ?? ""}`,
        site,
      ),
    );
  }
  for (const item of uses) {
    pages.set(
      `/uses/${item.id}`,
      page(
        item.data.title,
        `**${item.data.category}**\n\n${item.data.description}${item.data.url ? `\n\n[${item.data.url}](${item.data.url})` : ""}\n\n${item.body?.trim() ?? ""}`,
        site,
      ),
    );
  }

  return pages;
}

export async function getMarkdownPaths() {
  const paths = new Set(sitePages.map((item) => item.path));
  paths.add("/uses");
  const pages = await collectionPages();
  for (const path of pages.keys()) paths.add(path);
  paths.delete("/");
  return [...paths].map((path) => ({
    params: { path: path.slice(1) },
  }));
}

export async function buildPageMarkdown(path: string, site?: URL | null) {
  const normalized = path === "/" ? "/" : `/${path.replace(/^\/+|\/+$/g, "")}`;
  if (normalized === "/") {
    const projects = (await getCollection("projects")).sort((a, b) =>
      a.data.title.localeCompare(b.data.title),
    );
    return page(
      siteConfig.name,
      `> ${siteConfig.description}

${siteConfig.name} is a product engineer building AI-native interfaces, product systems, and developer tools.

Based in ${siteConfig.location.city}, ${siteConfig.location.country}. Current role: ${siteConfig.currentRole.title} at ${siteConfig.currentRole.company}.

## Projects

${projects.map((project) => `- ${link(project.data.title, `/project/${project.id}`, site)} — ${project.data.description}`).join("\n")}

## Resources

- ${link("API documentation", "/docs", site)}
- ${link("OpenAPI contract", "/openapi.json", site)}
- ${link("Profile JSON", "/api/v1/profile.json", site)}
- ${link("Full context", "/llms-full.txt", site)}

## Navigation

${list(["Work", "Talks", "Blog", "Gists", "Contact"].map((label) => link(label, `/${label.toLowerCase() === "gists" ? "gist" : label.toLowerCase()}`, site)))}`,
      site,
    );
  }
  return (
    staticPage(normalized, site) ??
    (await collectionPages(site)).get(normalized) ??
    null
  );
}
