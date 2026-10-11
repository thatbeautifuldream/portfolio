import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { contentSchemas } from "./content-schema";
import sharp from "sharp";
import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkSmartypants from "remark-smartypants";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import rehypeSlug from "rehype-slug";
import { createHighlighter } from "shiki";
export interface EntryData {
  title: string;
  description?: string;
  date: Date;
  datePublished?: Date;
  category: string;
  coverImage?: { src: string; width: number; height: number };
  url: string;
  gistId: string;
  gistUrl: string;
  isPublic: boolean;
  tags?: string;
}
export interface CollectionEntry<T = string> {
  id: string;
  collection: T;
  data: EntryData;
  body: string;
  html: string;
}
const paths: Record<string, string> = {
  posts: "posts",
  hiPosts: "posts/hi",
  gists: "gist",
  hiGists: "gist/hi",
  projects: "projects",
  hiProjects: "projects/hi",
  uses: "uses",
  hiUses: "uses/hi",
};
const collections = new Map<string, Promise<CollectionEntry[]>>();
const highlighter = createHighlighter({
  themes: ["github-light", "vesper"],
  langs: [],
});
async function highlightTree(tree: any) {
  const h = await highlighter;
  async function walk(node: any) {
    for (const child of node.children ?? []) {
      if (child.tagName === "pre" && child.children?.[0]?.tagName === "code") {
        const code = child.children[0],
          lang =
            code.properties?.className
              ?.find((s: string) => s.startsWith("language-"))
              ?.slice(9) ?? "text";
        try {
          if (lang !== "text" && !h.getLoadedLanguages().includes(lang as any))
            await h.loadLanguage(lang as any);
        } catch {}
        const html = h.codeToHtml(
          code.children.map((n: any) => n.value ?? "").join(""),
          {
            lang: h.getLoadedLanguages().includes(lang as any) ? lang : "text",
            themes: { light: "github-light", dark: "vesper" },
            defaultColor: "light",
          },
        );
        const { fromHtml } = await import("hast-util-from-html");
        const replacement = fromHtml(html, { fragment: true })
          .children[0] as any;
        replacement.properties.className = ["code-highlight"];
        Object.assign(child, replacement);
      } else await walk(child);
    }
  }
  await walk(tree);
}
function wrapTables() {
  return (tree: any) => {
    function walk(node: any) {
      node.children?.forEach((child: any, i: number) => {
        if (child.tagName === "table")
          node.children[i] = {
            type: "element",
            tagName: "div",
            properties: { className: ["table-wrap"] },
            children: [child],
          };
        else walk(child);
      });
    }
    walk(tree);
  };
}
function responsiveImages() {
  return async (tree: any) => {
    const images = JSON.parse(
      await fs.readFile(".generated/images.json", "utf8"),
    );
    function walk(node: any) {
      if (node.tagName === "img" && images[node.properties.src]) {
        const image = images[node.properties.src];
        Object.assign(node.properties, {
          src: image.src,
          width: image.width,
          height: image.height,
          srcSet: image.srcSet,
          sizes: image.sizes,
          loading: "lazy",
          decoding: "async",
        });
      }
      for (const child of node.children ?? []) walk(child);
    }
    walk(tree);
  };
}
function highlight() {
  return highlightTree;
}
export function getCollection<T extends string>(
  name: T,
): Promise<CollectionEntry<T>[]> {
  if (!collections.has(name)) collections.set(name, loadCollection(name));
  return collections.get(name)! as Promise<CollectionEntry<T>[]>;
}
async function loadCollection(name: string) {
  const dir = path.resolve("src/content", paths[name]!);
  const files = (await fs.readdir(dir)).filter((f) => /\.mdx?$/.test(f));
  return Promise.all(
    files.map(async (file) => {
      const filename = path.join(dir, file);
      const parsed = matter(await fs.readFile(filename, "utf8"));
      const content = parsed.content;
      const data: Record<string, any> = contentSchemas[
        name as keyof typeof contentSchemas
      ].parse(parsed.data);
      for (const key of ["date", "datePublished"])
        if (data[key]) data[key] = new Date(data[key]);
      if (data.coverImage) {
        const imagePath = path.resolve(dir, data.coverImage);
        const metadata = await sharp(imagePath).metadata();
        data.coverImage = {
          src: "/content-assets/" + path.basename(imagePath),
          width: metadata.width,
          height: metadata.height,
        };
      }
      let body = content;
      body = body.replace(
        /(!\[[^\]]*\]\()((?:\.\.\/|\.\/)[^\s)]+)/g,
        (_, prefix, asset) =>
          prefix + "/content-assets/" + path.basename(asset),
      );
      let html: string;
      if (file.endsWith(".mdx")) {
        body = body.replace(/^import Embed from .*;\s*$/gm, "");
        const result = await evaluate(body, {
          ...runtime,
          remarkPlugins: [remarkGfm, remarkSmartypants],
          rehypePlugins: [rehypeSlug, highlight, responsiveImages, wrapTables],
          baseUrl: import.meta.url,
        });
        const Embed = ({ src, title, caption }: any) => (
          <figure data-wide>
            <iframe
              src={src}
              title={title}
              loading="lazy"
              className="border-rule block h-[32rem] w-full rounded-lg border"
            />
            <figcaption>{caption}</figcaption>
          </figure>
        );
        html = renderToStaticMarkup(<result.default components={{ Embed }} />);
      } else {
        html = String(
          await unified()
            .use(remarkParse)
            .use(remarkGfm)
            .use(remarkSmartypants)
            .use(remarkRehype, { allowDangerousHtml: true })
            .use(rehypeRaw)
            .use(rehypeSlug)
            .use(highlight)
            .use(responsiveImages)
            .use(wrapTables)
            .use(rehypeStringify)
            .process(body),
        );
      }
      return {
        id: data.slug ?? file.replace(/\.mdx?$/, ""),
        collection: name,
        data: data as EntryData,
        body: content,
        html,
      };
    }),
  );
}
