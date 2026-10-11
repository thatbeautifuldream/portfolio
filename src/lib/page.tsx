import { ViewTransition, type ComponentType } from "react";
import { cache } from "react";
import { notFound } from "next/navigation";
import { getCollection } from "./content";
import { getLocalizedCollection } from "../i18n/content";
import { localizePath, type Locale } from "../i18n";
import { siteConfig } from "./seo";
import type { ComponentProps, SiteContext } from "./ui";

export function pageContext(path: string, locale: Locale): SiteContext {
  return {
    locale,
    url: new URL(localizePath(path, locale), siteConfig.url),
    site: new URL(siteConfig.url),
  };
}
export function renderPage(
  View: ComponentType<ComponentProps>,
  path: string,
  locale: Locale,
  props: Record<string, unknown> = {},
) {
  const context = pageContext(path, locale);
  return (
    <ViewTransition
      key={context.url.pathname}
      name="page-content"
      default="none"
      share="page-navigation"
      enter="page-navigation"
      exit="page-navigation"
    >
      <div className="min-h-svh">
        <View context={context} {...props} />
      </div>
    </ViewTransition>
  );
}
export type ContentSection = "blog" | "gist" | "project" | "uses";
const collections = {
  blog: "posts",
  gist: "gists",
  project: "projects",
  uses: "uses",
} as const;
export async function contentParams(section: ContentSection) {
  return (await getCollection(collections[section])).map((entry) => ({
    slug: entry.id,
  }));
}
export const contentEntry = cache(
  async (section: ContentSection, slug: string, locale: Locale) => {
    const entry = (
      await getLocalizedCollection(collections[section], locale)
    ).find((entry) => entry.id === slug);
    if (!entry) notFound();
    return entry;
  },
);
