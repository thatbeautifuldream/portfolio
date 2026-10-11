import type { Metadata } from "next";
import {
  isTranslated,
  locales,
  localizePath,
  stripLocale,
  useTranslations,
  type Locale,
} from "../i18n";
import { absoluteUrl, defaultKeywords, siteConfig } from "./seo";
import { contentEntry, pageContext, type ContentSection } from "./page";

export async function pageMetadata(
  path: string,
  locale: Locale,
): Promise<Metadata> {
  const context = pageContext(path, locale);
  const t = useTranslations(locale);
  const [section, slug] = stripLocale(path).split("/").filter(Boolean);
  let title: string = siteConfig.name;
  let description: string = t.description;
  let image: string = locale === "en" ? siteConfig.defaultImage : "/og/hi.png";
  if (slug) {
    const entry = await contentEntry(section as ContentSection, slug, locale);
    title = entry.data.title;
    description =
      entry.data.description ??
      (section === "gist" ? t.gist.description : t.description);
    const prefix = locale === "en" ? "" : `/${locale}`;
    if (section === "blog") image = `/og${prefix}/${slug}.png`;
    if (section === "gist") image = `/og/gist${prefix}/${slug}.png`;
    if (section === "project") image = `/og${prefix}/project/${slug}.png`;
  } else if (section === "404") {
    title = "Not found";
    description = "This page could not be found.";
  } else if (section) {
    const page =
      t[
        section as
          | "blog"
          | "gist"
          | "project"
          | "uses"
          | "work"
          | "talks"
          | "contact"
          | "privacy"
      ];
    title = page.title;
    description = page.description;
  }
  const fullTitle =
    title === siteConfig.name
      ? `${siteConfig.shortName} · ${t.tagline}`
      : `${siteConfig.shortName} · ${title}`;
  const alternates = isTranslated(path)
    ? (Object.keys(locales) as Locale[]).map((lang) => ({
        lang,
        href: new URL(localizePath(path, lang), context.site).href,
      }))
    : [];
  return {
    metadataBase: context.site,
    title: fullTitle,
    description,
    keywords: defaultKeywords.join(", "),
    applicationName: siteConfig.name,
    formatDetection: { telephone: false },
    robots:
      section === "404"
        ? "noindex,follow"
        : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
    alternates: {
      canonical: context.url.href,
      languages: alternates.length
        ? Object.fromEntries([
            ...alternates.map((a) => [a.lang, a.href]),
            ["x-default", alternates[0]!.href],
          ])
        : undefined,
      types: {
        "application/rss+xml": [
          {
            url: new URL("rss.xml", context.site).href,
            title: `${siteConfig.shortName} · Blog`,
          },
        ],
      },
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: locales[locale].ogLocale,
      alternateLocale: alternates
        .filter((a) => a.lang !== locale)
        .map((a) => locales[a.lang].ogLocale),
      title: fullTitle,
      description,
      url: context.url.href,
      images: [
        {
          url: absoluteUrl(image, context.site),
          alt: `${siteConfig.name}: ${t.tagline}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [absoluteUrl(image, context.site)],
      creator: siteConfig.twitter,
    },
    other: {
      googlebot:
        section === "404"
          ? "noindex,follow"
          : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
      "og:logo": absoluteUrl("/icons/Icon-192.png", context.site),
    },
  };
}
