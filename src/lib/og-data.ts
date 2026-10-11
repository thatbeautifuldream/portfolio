import { getLocalizedCollection } from "../i18n/content";
import { useTranslations } from "../i18n";
import { siteConfig } from "./seo";
import type { OGPage } from "./og";

export async function getOGPages() {
  const pages: Record<string, OGPage> = {};
  for (const locale of ["en", "hi"] as const) {
    const prefix = locale === "hi" ? "hi/" : "";
    for (const [collection, route] of [
      ["posts", ""],
      ["projects", "project/"],
      ["gists", "gist/"],
    ] as const) {
      for (const entry of await getLocalizedCollection(collection, locale)) {
        // Gist URLs historically put the locale after /og/gist/.
        const id =
          collection === "gists"
            ? `gist/${prefix}${entry.id}`
            : `${prefix}${route}${entry.id}`;
        pages[`${id}.png`] = {
          title: entry.data.title,
          description: entry.data.description,
        };
      }
    }
  }
  const hi = useTranslations("hi");
  pages["hi.png"] = { title: hi.name, description: hi.tagline };
  return pages;
}

export async function getStoryPages(locale: "en" | "hi") {
  return Object.fromEntries(
    (await getLocalizedCollection("posts", locale)).map((post) => [
      `${post.id}.png`,
      {
        title: post.data.title,
        description: post.data.description,
        link: `${siteConfig.url.replace(/^https?:\/\//, "")}/${locale === "hi" ? "hi/" : ""}blog/${post.id}`,
      },
    ]),
  );
}
