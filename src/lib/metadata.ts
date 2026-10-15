import type { Metadata, Viewport } from "next";
import {
  isTranslated,
  locales,
  localizePath,
  stripLocale,
  useTranslations,
  type Locale,
} from "../i18n";
import {
  absoluteUrl,
  defaultKeywords,
  siteConfig,
  canvasCopy,
  canvasPath,
  canvasImagePath,
  canvasEmbedPath,
  canvasPlayerSize,
} from "./seo";
import { contentEntry, pageContext, type ContentSection } from "./page";

export const documentMetadata: Metadata = {
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48 32x32 16x16" },
      { url: "/favicon-96.png", type: "image/png", sizes: "96x96" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
};

export const documentViewport: Viewport = { themeColor: siteConfig.themeColor };

export function canvasMetadata(locale: Locale, embedded = false): Metadata {
  const copy = canvasCopy[locale];
  const title = `${siteConfig.shortName} · ${copy.title}`;
  const url = new URL(canvasPath(locale), siteConfig.url).href;
  const image = {
    url: canvasImagePath(locale),
    width: 1200,
    height: 630,
    alt: title,
  };
  return {
    metadataBase: new URL(siteConfig.url),
    title,
    description: copy.description,
    keywords: [...defaultKeywords, "Canvas", "UI components", "design system"],
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    applicationName: siteConfig.name,
    robots: {
      index: !embedded,
      follow: !embedded,
      googleBot: { index: !embedded, follow: !embedded },
    },
    alternates: {
      canonical: url,
      languages: embedded
        ? undefined
        : {
            en: new URL(canvasPath("en"), siteConfig.url).href,
            hi: new URL(canvasPath("hi"), siteConfig.url).href,
            "x-default": new URL(canvasPath("en"), siteConfig.url).href,
          },
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title,
      description: copy.description,
      url,
      locale: locales[locale].ogLocale,
      alternateLocale: [locales[locale === "en" ? "hi" : "en"].ogLocale],
      images: [image],
    },
    twitter: {
      title,
      description: copy.description,
      creator: siteConfig.twitter,
      images: [image],
      ...(embedded
        ? { card: "summary_large_image" as const }
        : { card: "player" as const, players: [] }),
    },
    other: embedded
      ? undefined
      : {
          "twitter:player": new URL(canvasEmbedPath(locale), siteConfig.url)
            .href,
          "twitter:player:width": String(canvasPlayerSize.width),
          "twitter:player:height": String(canvasPlayerSize.height),
        },
  };
}

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
      "og:logo": absoluteUrl("/icons/icon-192.png", context.site),
    },
  };
}
