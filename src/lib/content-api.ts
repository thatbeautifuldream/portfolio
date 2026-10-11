import { getCollection, type CollectionEntry } from "./content";
import { z } from "zod";
import { absoluteUrl } from "./seo";

const registry = z.registry<{ id: string }>();

const ImageSchema = z
  .object({
    url: z.url(),
    width: z.int().positive(),
    height: z.int().positive(),
    alt: z.string(),
  })
  .register(registry, { id: "Image" });

const ContentSchema = z
  .object({
    html: z
      .string()
      .describe(
        "Rendered HTML fragment with absolute URLs. Code blocks carry Shiki inline styles with --shiki-light/--shiki-dark variables.",
      ),
    markdown: z
      .string()
      .describe("Source Markdown with local image URLs made absolute."),
  })
  .register(registry, { id: "Content" });

const PostSummarySchema = z
  .object({
    slug: z.string(),
    title: z.string(),
    description: z.string(),
    category: z.string(),
    publishedAt: z.iso.datetime(),
    url: z.url().describe("Canonical web page."),
    apiUrl: z.url().describe("Full post resource, including content."),
    coverImage: ImageSchema.nullable(),
  })
  .register(registry, { id: "PostSummary" });

const PostSchema = PostSummarySchema.extend({
  content: ContentSchema,
}).register(registry, { id: "Post" });

const GistSummarySchema = z
  .object({
    slug: z.string(),
    title: z.string(),
    description: z.string().nullable(),
    tags: z.array(z.string()),
    publishedAt: z.iso.datetime().nullable(),
    url: z.url().describe("Canonical web page."),
    apiUrl: z.url().describe("Full gist resource, including content."),
    gistId: z.string(),
    gistUrl: z.url(),
  })
  .register(registry, { id: "GistSummary" });

const GistSchema = GistSummarySchema.extend({
  content: ContentSchema,
}).register(registry, { id: "Gist" });

const listSchema = <T extends z.ZodType>(item: T, id: string) =>
  z
    .object({
      items: z.array(item),
      total: z.int().nonnegative(),
    })
    .register(registry, { id });

const PostListSchema = listSchema(PostSummarySchema, "PostList");
const GistListSchema = listSchema(GistSummarySchema, "GistList");

export type Image = z.infer<typeof ImageSchema>;
export type Content = z.infer<typeof ContentSchema>;
export type PostSummary = z.infer<typeof PostSummarySchema>;
export type Post = z.infer<typeof PostSchema>;
export type PostList = z.infer<typeof PostListSchema>;
export type GistSummary = z.infer<typeof GistSummarySchema>;
export type Gist = z.infer<typeof GistSchema>;
export type GistList = z.infer<typeof GistListSchema>;

export function contentJsonSchemas() {
  const { schemas } = z.toJSONSchema(registry, {
    uri: (id) => `#/components/schemas/${id}`,
    io: "output",
  });
  return Object.fromEntries(
    Object.entries(schemas).map(([id, { $schema, $id, ...schema }]) => [
      id,
      schema,
    ]),
  );
}

type PostEntry = CollectionEntry<"posts">;
type GistEntry = CollectionEntry<"gists">;

function gistDate(gist: GistEntry) {
  return gist.data.datePublished ?? gist.data.date;
}

export async function getPosts() {
  return (await getCollection("posts")).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
}

export async function getGists() {
  return (await getCollection("gists"))
    .filter((gist) => gist.data.isPublic)
    .sort(
      (a, b) => (gistDate(b)?.getTime() ?? 0) - (gistDate(a)?.getTime() ?? 0),
    );
}

async function renderHtml(entry: PostEntry | GistEntry, site?: URL | null) {
  return entry.html.replace(
    /\b(src|href|poster)="(\/[^/"][^"]*)"/g,
    (_, attr: string, path: string) => `${attr}="${absoluteUrl(path, site)}"`,
  );
}

function postMarkdown(post: PostEntry, site?: URL | null) {
  return (post.body ?? "")
    .trim()
    .replace(
      /(!\[[^\]]*\]\()\.\/([^)\s]+)/g,
      (match, prefix: string, file: string) => {
        const image = { src: `/content-assets/${file}` };
        return image ? `${prefix}${absoluteUrl(image.src, site)}` : match;
      },
    );
}

function postSummary(post: PostEntry, site?: URL | null): PostSummary {
  const { coverImage } = post.data;
  return {
    slug: post.id,
    title: post.data.title,
    description: post.data.description ?? "",
    category: post.data.category,
    publishedAt: post.data.date.toISOString(),
    url: absoluteUrl(`/blog/${post.id}`, site),
    apiUrl: absoluteUrl(`/api/v1/posts/${post.id}.json`, site),
    coverImage: coverImage
      ? {
          url: absoluteUrl(coverImage.src, site),
          width: coverImage.width,
          height: coverImage.height,
          alt: post.data.title,
        }
      : null,
  };
}

function gistSummary(gist: GistEntry, site?: URL | null): GistSummary {
  return {
    slug: gist.id,
    title: gist.data.title,
    description: gist.data.description ?? null,
    tags: (gist.data.tags ?? "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    publishedAt: gistDate(gist)?.toISOString() ?? null,
    url: absoluteUrl(`/gist/${gist.id}`, site),
    apiUrl: absoluteUrl(`/api/v1/gists/${gist.id}.json`, site),
    gistId: gist.data.gistId,
    gistUrl: gist.data.gistUrl,
  };
}

export function buildPostList(posts: PostEntry[], site?: URL | null) {
  return PostListSchema.parse({
    items: posts.map((post) => postSummary(post, site)),
    total: posts.length,
  } satisfies PostList);
}

export async function buildPost(post: PostEntry, site?: URL | null) {
  return PostSchema.parse({
    ...postSummary(post, site),
    content: {
      html: await renderHtml(post, site),
      markdown: postMarkdown(post, site),
    },
  } satisfies Post);
}

export function buildGistList(gists: GistEntry[], site?: URL | null) {
  return GistListSchema.parse({
    items: gists.map((gist) => gistSummary(gist, site)),
    total: gists.length,
  } satisfies GistList);
}

export async function buildGist(gist: GistEntry, site?: URL | null) {
  return GistSchema.parse({
    ...gistSummary(gist, site),
    content: {
      html: await renderHtml(gist, site),
      markdown: (gist.body ?? "").trim(),
    },
  } satisfies Gist);
}
