import type { ComponentProps } from "../lib/ui";
import ClientEnhancement from "../components/client-enhancement";
import Layout from "../layouts/layout";
import PageHeader from "../components/page-header";
import IndexList from "../components/index-list";
import { talks, contributions } from "../data/portfolio";
import { absoluteUrl, buildPersonRef, siteConfig } from "../lib/seo";
import { getLocale, localizePath, useTranslations } from "../i18n";
export default async function View(props: ComponentProps) {
  const context = props.context;
  const locale = getLocale(context.locale);
  const t = useTranslations(locale).talks;
  const pageUrl = absoluteUrl(localizePath("/talks", locale), context.site);
  const localizedTalks = talks.map((talk) => ({
    ...talk,
    ...t.items[talk.title],
    source: talk,
  }));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${t.title} · ${siteConfig.name}`,
    description: t.description,
    url: pageUrl,
    author: buildPersonRef(context.site),
    hasPart: localizedTalks.map((talk) => ({
      "@type": "Event",
      name: talk.title,
      description: talk.description,
      startDate: talk.date,
      location: { "@type": "Place", name: talk.event },
      url: talk.href,
      performer: buildPersonRef(context.site),
    })),
  };
  return (
    <>
      <Layout context={context} jsonLd={jsonLd}>
        <main className="grid stagger gap-12">
          <article className="grid gap-4">
            <PageHeader context={context} title={t.title} meta={t.meta} />
            <p className="text-pretty">{t.body}</p>
          </article>

          <IndexList
            context={context}
            title={t.title}
            items={localizedTalks.map((talk) => ({
              href: talk.href,
              title: talk.title,
              meta: talk.event,
              group: talk.date.slice(-4),
              external: true,
              attrs: {
                "data-talk-title": talk.source.title,
                "data-talk-event": talk.source.event,
              },
            }))}
          />

          <section className="grid gap-4">
            <h2 className="section-title">{t.openSource}</h2>
            <p className="text-pretty">{t.openSourceBody}</p>
          </section>

          <IndexList
            context={context}
            title={t.contributions}
            items={contributions.map((item) => ({
              href: item.href,
              title: t.contributionTitles[item.title] ?? item.title,
              external: true,
              attrs: { "data-contribution-title": item.title },
            }))}
          />
        </main>
      </Layout>

      <ClientEnhancement kind="talks" />
    </>
  );
}
