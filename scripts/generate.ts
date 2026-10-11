import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { siteConfig, getSitePage } from "../src/lib/seo";
import { getCollection } from "../src/lib/content";
import { getCollection as buildCollection } from "../src/lib/content-build";
import { stripLocale, isTranslated, localizePath } from "../src/i18n";
import { optimizeContentImages } from "./images";
const root = process.cwd();
const publicDir = path.join(root, "public");
async function walk(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((e) =>
        e.isDirectory()
          ? walk(path.join(dir, e.name))
          : Promise.resolve([path.join(dir, e.name)]),
      ),
    )
  ).flat();
}
for (const dir of [
  "api",
  "og",
  "share",
  "blog",
  "gist",
  "project",
  "uses",
  "content-assets",
]) {
  await fs.rm(path.join(publicDir, dir), { recursive: true, force: true });
}
await fs.mkdir(path.join(publicDir, "content-assets"), { recursive: true });
const contentFiles = await walk(path.join(root, "src/content"));
for (const file of contentFiles) {
  if (/\.(png|jpe?g|webp|avif|gif|svg)$/.test(file))
    await fs.copyFile(
      file,
      path.join(publicDir, "content-assets", path.basename(file)),
    );
}
await optimizeContentImages(contentFiles);
const content = Object.fromEntries(
  await Promise.all(
    [
      "posts",
      "hiPosts",
      "gists",
      "hiGists",
      "projects",
      "hiProjects",
      "uses",
      "hiUses",
    ].map(async (name) => [name, await buildCollection(name)]),
  ),
);
await fs.mkdir(".generated", { recursive: true });
await fs.writeFile(".generated/content.json", JSON.stringify(content));
const resourceFiles = (await walk(path.join(root, "src/resources"))).filter(
  (f) => f.endsWith(".ts"),
);
await fs.rm(path.join(publicDir, "og.png"), { force: true });
let count = 0;
for (const file of resourceFiles) {
  const module = await import(pathToFileURL(file).href);
  const routes = module.getStaticPaths
    ? await module.getStaticPaths()
    : [{ params: {}, props: {} }];
  const pattern = path
    .relative(path.join(root, "src/resources"), file)
    .replace(/\.ts$/, "");
  for (const route of routes) {
    const resourcePath = pattern.replace(
      /\[\.\.\.(\w+)\]|\[(\w+)\]/g,
      (_, spread, key) => route.params[spread ?? key],
    );
    const response = await module.GET({
      params: route.params,
      props: route.props ?? {},
      site: new URL(siteConfig.url),
      request: new Request(new URL(resourcePath, siteConfig.url)),
    });
    const target = path.join(publicDir, resourcePath);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, new Uint8Array(await response.arrayBuffer()));
    count++;
  }
}
const routes = [
  "/",
  "/work",
  "/talks",
  "/contact",
  "/privacy",
  "/blog",
  "/gist",
  "/project",
  "/uses",
  "/docs",
];
for (const [prefix, name] of [
  ["blog", "posts"],
  ["gist", "gists"],
  ["project", "projects"],
  ["uses", "uses"],
])
  for (const entry of await getCollection(name!))
    routes.push(`/${prefix}/${entry.id}`);
const urls = routes.flatMap((p) =>
  isTranslated(p) ? [p, localizePath(p, "hi")] : [p],
);
const xml = (s: string) =>
  s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
const sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${urls
  .sort((a, b) => {
    const left = a.replace(/\/?$/, "/"),
      right = b.replace(/\/?$/, "/");
    return left < right ? -1 : left > right ? 1 : 0;
  })
  .map((p) => {
    const data = getSitePage(stripLocale(p));
    return `<url><loc>${siteConfig.url}${p.endsWith("/") ? p : p + "/"}</loc>${data ? `<changefreq>${data.changefreq}</changefreq><priority>${data.priority.toFixed(1)}</priority>` : ""}${isTranslated(stripLocale(p)) ? ["en", "hi"].map((lang) => `<xhtml:link rel="alternate" hreflang="${lang === "en" ? "en-US" : "hi-IN"}" href="${xml(siteConfig.url + localizePath(stripLocale(p).replace(/\/?$/, "/"), lang as "en" | "hi"))}"/>`).join("") : ""}</url>`;
  })
  .join("")}</urlset>`;
await fs.writeFile(path.join(publicDir, "sitemap-0.xml"), sitemap);
await fs.writeFile(
  path.join(publicDir, "sitemap-index.xml"),
  `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${siteConfig.url}/sitemap-0.xml</loc></sitemap></sitemapindex>`,
);
console.log(`Generated ${count} resources and ${urls.length} sitemap URLs.`);
