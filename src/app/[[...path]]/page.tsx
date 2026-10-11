import { notFound } from "next/navigation";
import { getCollection } from "../../lib/content";
import { getLocalizedCollection } from "../../i18n/content";
import { siteConfig } from "../../lib/seo";
import type { Locale } from "../../i18n";
import Home from "../../views/index";
import Blog from "../../views/blog/index";
import Gists from "../../views/gist/index";
import Projects from "../../views/project/index";
import Uses from "../../views/uses/index";
import Work from "../../views/work";
import Talks from "../../views/talks";
import Contact from "../../views/contact";
import Privacy from "../../views/privacy";
import Docs from "../../views/docs";
import Post from "../../views/blog/[slug]";
import Gist from "../../views/gist/[slug]";
import Project from "../../views/project/[slug]";
import Use from "../../views/uses/[slug]";
import Missing from "../../views/404";
const views = {
  "": Home,
  blog: Blog,
  gist: Gists,
  project: Projects,
  uses: Uses,
  work: Work,
  talks: Talks,
  contact: Contact,
  privacy: Privacy,
  docs: Docs,
  "404": Missing,
};
const collections = {
  blog: "posts",
  gist: "gists",
  project: "projects",
  uses: "uses",
} as const;
export const dynamicParams = false;
export async function generateStaticParams() {
  const paths: string[][] = [];
  for (const locale of ["en", "hi"] as Locale[]) {
    const prefix = locale === "en" ? [] : ["hi"];
    for (const key of Object.keys(views)) {
      if (locale === "hi" && ["docs", "404"].includes(key)) continue;
      paths.push([...prefix, ...(key ? [key] : [])]);
    }
    for (const [route, collection] of Object.entries(collections)) {
      for (const entry of await getCollection(collection))
        paths.push([...prefix, route, entry.id]);
    }
  }
  return paths.map((path) => ({ path }));
}
export default async function Page({
  params,
}: {
  params: Promise<{ path?: string[] }>;
}) {
  const { path = [] } = await params;
  const locale: Locale = path[0] === "hi" ? "hi" : "en";
  const parts = locale === "hi" ? path.slice(1) : path;
  const context = {
    locale,
    url: new URL(
      "/" + path.join("/") + (parts.length <= 1 && path.length ? "/" : ""),
      siteConfig.url,
    ),
    site: new URL(siteConfig.url),
  };
  if (parts.length <= 1) {
    const View = views[(parts[0] ?? "") as keyof typeof views];
    if (View) return <View context={context} />;
  }
  if (parts.length === 2 && parts[0]! in collections) {
    const collection = collections[parts[0] as keyof typeof collections];
    const entry = (await getLocalizedCollection(collection, locale)).find(
      (e) => e.id === parts[1],
    );
    if (entry) {
      const View = { blog: Post, gist: Gist, project: Project, uses: Use }[
        parts[0] as keyof typeof collections
      ];
      const key = {
        blog: "post",
        gist: "gist",
        project: "project",
        uses: "item",
      }[parts[0] as keyof typeof collections];
      return <View context={context} {...{ [key]: entry }} />;
    }
  }
  notFound();
}
