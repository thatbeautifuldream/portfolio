import fs from "node:fs/promises";
import path from "node:path";
import { parseFrontmatter } from "./frontmatter";
import {
  contentSchemas,
  type CollectionEntry,
  type CollectionName,
} from "./content-schema";
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
import { createHighlighter, type BundledLanguage } from "shiki";
import type { Element, Root } from "hast";
import type { ResponsiveImage } from "../../scripts/images";
const paths: Record<CollectionName, string> = {
  posts: "posts",
  hiPosts: "posts/hi",
  gists: "gist",
  hiGists: "gist/hi",
  projects: "projects",
  hiProjects: "projects/hi",
  uses: "uses",
  hiUses: "uses/hi",
};
const collections = new Map<CollectionName, Promise<CollectionEntry[]>>();
const highlighter = createHighlighter({
  themes: ["github-light", "vesper"],
  langs: [],
});
async function highlightTree(tree: Root) {
  const renderer = await highlighter;
  async function walk(node: Root | Element) {
    for (const child of node.children) {
      if (child.type !== "element") continue;
      const code = child.children[0];
      if (
        child.tagName === "pre" &&
        code?.type === "element" &&
        code.tagName === "code"
      ) {
        const classes = code.properties.className;
        const languageClass = Array.isArray(classes)
          ? classes.find(
              (value) =>
                typeof value === "string" && value.startsWith("language-"),
            )
          : undefined;
        const language =
          typeof languageClass === "string" ? languageClass.slice(9) : "text";
        try {
          if (
            language !== "text" &&
            !renderer.getLoadedLanguages().includes(language)
          )
            await renderer.loadLanguage(language as BundledLanguage);
        } catch {}
        const html = renderer.codeToHtml(
          code.children
            .map((node) => (node.type === "text" ? node.value : ""))
            .join(""),
          {
            lang: renderer.getLoadedLanguages().includes(language)
              ? language
              : "text",
            themes: { light: "github-light", dark: "vesper" },
            defaultColor: "light",
          },
        );
        const { fromHtml } = await import("hast-util-from-html");
        const replacement = fromHtml(html, { fragment: true }).children.find(
          (node) => node.type === "element",
        );
        if (!replacement)
          throw new Error("Syntax highlighter returned no element");
        replacement.properties.className = ["code-highlight"];
        Object.assign(child, replacement);
      } else await walk(child);
    }
  }
  await walk(tree);
}
function wrapTables() {
  return (tree: Root) => {
    function walk(node: Root | Element) {
      node.children.forEach((child, index) => {
        if (child.type !== "element") return;
        if (child.tagName === "table")
          node.children[index] = {
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
  return async (tree: Root) => {
    const images: Record<string, ResponsiveImage> = JSON.parse(
      await fs.readFile(".generated/images.json", "utf8"),
    );
    function walk(node: Root | Element) {
      const image =
        node.type === "element" && typeof node.properties.src === "string"
          ? images[node.properties.src]
          : undefined;
      if (node.type === "element" && node.tagName === "img" && image) {
        Object.assign(node.properties, {
          src: image.src,
          width: image.width,
          height: image.height,
          sizes: image.sizes,
          loading: "lazy",
          decoding: "async",
        });
      }
      for (const child of node.children)
        if (child.type === "element") walk(child);
    }
    walk(tree);
  };
}
function highlight() {
  return highlightTree;
}
export function getCollection<T extends CollectionName>(
  name: T,
): Promise<CollectionEntry<T>[]> {
  if (!collections.has(name)) collections.set(name, loadCollection(name));
  return collections.get(name)! as Promise<CollectionEntry<T>[]>;
}
async function loadCollection(
  name: CollectionName,
): Promise<CollectionEntry[]> {
  const dir = path.resolve("src/content", paths[name]!);
  const files = (await fs.readdir(dir)).filter((f) => /\.mdx?$/.test(f));
  return Promise.all(
    files.map(async (file) => {
      const filename = path.join(dir, file);
      const parsed = parseFrontmatter(await fs.readFile(filename, "utf8"));
      const content = parsed.content;
      const parsedData = contentSchemas[name].parse(parsed.data);
      let coverImage;
      if ("coverImage" in parsedData && parsedData.coverImage) {
        const imagePath = path.resolve(dir, parsedData.coverImage);
        const metadata = await sharp(imagePath).metadata();
        if (!metadata.width || !metadata.height)
          throw new Error(`Missing image dimensions: ${imagePath}`);
        coverImage = {
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
        const Embed = ({
          src,
          title,
          caption,
        }: {
          src: string;
          title: string;
          caption?: string;
        }) => (
          <figure data-wide>
            <iframe
              src={src}
              title={title}
              loading="lazy"
              className="block h-[32rem] w-full rounded-lg border border-rule"
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
        id:
          ("slug" in parsedData ? parsedData.slug : undefined) ??
          file.replace(/\.mdx?$/, ""),
        collection: name,
        data: {
          ...parsedData,
          ...("coverImage" in parsedData ? { coverImage } : {}),
        },
        body: content,
        html,
      } as CollectionEntry;
    }),
  );
}
