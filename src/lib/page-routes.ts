import type { ComponentType } from "react";
import { isLocale, locales, type Locale } from "../i18n";
import { contentParams, type ContentSection } from "./page";
import type { ComponentProps } from "./ui";

type ViewLoader = () => Promise<{ default: ComponentType<ComponentProps> }>;

const staticRoutes = {
  "/": () => import("../views/index"),
  "/work": () => import("../views/work"),
  "/talks": () => import("../views/talks"),
  "/contact": () => import("../views/contact"),
  "/privacy": () => import("../views/privacy"),
  "/blog": () => import("../views/blog/index"),
  "/gist": () => import("../views/gist/index"),
  "/project": () => import("../views/project/index"),
  "/uses": () => import("../views/uses/index"),
} satisfies Record<string, ViewLoader>;

const contentRoutes = {
  blog: { load: () => import("../views/blog/slug"), prop: "post" },
  gist: { load: () => import("../views/gist/slug"), prop: "gist" },
  project: { load: () => import("../views/project/slug"), prop: "project" },
  uses: { load: () => import("../views/uses/slug"), prop: "item" },
} satisfies Record<ContentSection, { load: ViewLoader; prop: string }>;

export type LocalizedPageParams = { locale: string; path?: string[] };

type PageRoute = {
  locale: Locale;
  path: string;
  load: ViewLoader;
} & (
  | { kind: "static" }
  | { kind: "content"; section: ContentSection; slug: string; prop: string }
);

export function resolvePageRoute({
  locale,
  path: segments = [],
}: LocalizedPageParams): PageRoute | undefined {
  if (!isLocale(locale)) return;
  const path = "/" + segments.join("/");
  if (Object.hasOwn(staticRoutes, path)) {
    return {
      kind: "static",
      locale,
      path: segments.length ? path + "/" : path,
      load: staticRoutes[path as keyof typeof staticRoutes],
    };
  }
  const [section, slug] = segments;
  if (
    segments.length !== 2 ||
    !section ||
    !slug ||
    !Object.hasOwn(contentRoutes, section)
  )
    return;
  const contentSection = section as ContentSection;
  return {
    kind: "content",
    locale,
    path,
    section: contentSection,
    slug,
    ...contentRoutes[contentSection],
  };
}

export async function localizedPageParams(): Promise<
  { locale: Locale; path: string[] }[]
> {
  const paths = Object.keys(staticRoutes).map((path) =>
    path.split("/").filter(Boolean),
  );
  for (const section of Object.keys(contentRoutes) as ContentSection[]) {
    for (const { slug } of await contentParams(section))
      paths.push([section, slug]);
  }
  return (Object.keys(locales) as Locale[]).flatMap((locale) =>
    paths.map((path) => ({ locale, path })),
  );
}
