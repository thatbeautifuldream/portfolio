import { getOGPages, getStoryPages } from "../../lib/og-data";
import { siteConfig, studioCopy, studioImagePath } from "../../lib/seo";
import type { Locale } from "../../i18n";

export type StudioImage = {
  src: string;
  title: string;
  locale: Locale;
  kind: "og" | "story";
  width: number;
  height: number;
};

export async function getStudioImages(): Promise<StudioImage[]> {
  const images: StudioImage[] = [
    {
      src: siteConfig.defaultImage,
      title: siteConfig.name,
      locale: "en",
      kind: "og",
      width: 1200,
      height: 630,
    },
  ];
  for (const [route, page] of Object.entries(await getOGPages())) {
    images.push({
      src: `/og/${route}`,
      title: page.title,
      locale:
        route === "hi.png" ||
        route.startsWith("hi/") ||
        route.startsWith("gist/hi/")
          ? "hi"
          : "en",
      kind: "og",
      width: 1200,
      height: 630,
    });
  }
  for (const locale of ["en", "hi"] as const) {
    images.push({
      src: studioImagePath(locale),
      title: studioCopy[locale].title,
      locale,
      kind: "og",
      width: 1200,
      height: 630,
    });
    for (const [filename, page] of Object.entries(
      await getStoryPages(locale),
    )) {
      images.push({
        src: `/share/${locale === "hi" ? "hi/" : ""}${filename}`,
        title: page.title,
        locale,
        kind: "story",
        width: 1080,
        height: 1920,
      });
    }
  }
  return images;
}

export function imageGroups(images: StudioImage[]) {
  const groups: { id: string; title: string; images: StudioImage[] }[] = [];
  for (const kind of ["og", "story"] as const) {
    for (const locale of ["en", "hi"] as const) {
      const matching = images.filter(
        (image) => image.kind === kind && image.locale === locale,
      );
      for (let offset = 0; offset < matching.length; offset += 4) {
        const batch = offset / 4 + 1;
        groups.push({
          id: `${kind}-${locale}-${batch}`,
          title: `${kind === "og" ? "Open Graph" : "Stories"} · ${locale.toUpperCase()} · ${batch}`,
          images: matching.slice(offset, offset + 4),
        });
      }
    }
  }
  return groups;
}
