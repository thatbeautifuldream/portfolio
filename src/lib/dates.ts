import { siteConfig } from "./seo";

export function formatSiteDate(
  date: Date,
  locale: string,
  options: Intl.DateTimeFormatOptions,
): string {
  return date.toLocaleDateString(locale, {
    ...options,
    timeZone: siteConfig.location.timezone,
  });
}
