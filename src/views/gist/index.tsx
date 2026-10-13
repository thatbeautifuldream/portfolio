import type { ComponentProps } from "../../lib/ui";
import ClientEnhancement from "../../components/client-enhancement";
import Layout from "../../layouts/layout";
import PageHeader from "../../components/page-header";
import IndexList from "../../components/index-list";
import { absoluteUrl, buildPersonRef, siteConfig } from "../../lib/seo";
import { getLocale, localizePath, useTranslations } from "../../i18n";
import { getLocalizedCollection } from "../../i18n/content";
import { formatSiteDate } from "../../lib/dates";
export default async function View(props: ComponentProps) {
  const context = props.context;
  const locale = getLocale(context.locale);
  const t = useTranslations(locale).gist;
  function gistDate(data: { datePublished?: Date; date?: Date }): Date {
    return data.datePublished ?? data.date ?? new Date(0);
  }
  const gists = (await getLocalizedCollection("gists", locale)).sort(
    (a, b) => gistDate(b.data).getTime() - gistDate(a.data).getTime(),
  );
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${siteConfig.shortName} - Gists`,
    description: t.description,
    url: absoluteUrl(localizePath("/gist", locale), context.site),
    author: buildPersonRef(context.site),
  };
  return (
    <>
      <Layout context={context} jsonLd={jsonLd}>
        <main className="grid stagger gap-12">
          <PageHeader context={context} title={t.title} meta={t.description} />
          <IndexList
            context={context}
            title={t.snippets}
            items={gists.map((gist) => {
              const date = gist.data.datePublished ?? gist.data.date;
              return {
                href: localizePath(`/gist/${gist.id}`, locale),
                title: gist.data.title,
                meta: date
                  ? formatSiteDate(date, "en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                    })
                  : gist.data.tags?.split(",")[0]?.trim(),
                group: date
                  ? formatSiteDate(date, "en-US", { year: "numeric" })
                  : undefined,
                attrs: { "data-gist-title": gist.data.title },
              };
            })}
          />
        </main>
      </Layout>

      <ClientEnhancement kind="gist-list" />
    </>
  );
}
