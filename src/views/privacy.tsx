import SiteLink from "../components/site-link";
import type { ComponentProps } from "../lib/ui";
import Layout from "../layouts/layout";
import PageHeader from "../components/page-header";
import { absoluteUrl, siteConfig } from "../lib/seo";
import { getLocale, localizePath, useTranslations } from "../i18n";
export default async function View(props: ComponentProps) {
  const context = props.context;
  const locale = getLocale(context.locale);
  const t = useTranslations(locale).privacy;
  const pageUrl = absoluteUrl(localizePath("/privacy", locale), context.site);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${t.title} · ${siteConfig.name}`,
    description: t.description,
    url: pageUrl,
  };
  return (
    <>
      <Layout context={context} jsonLd={jsonLd}>
        <main className="stagger grid gap-12">
          <PageHeader context={context} title={t.title} meta={t.meta} />
          <section className="grid gap-4">
            <h2 className="section-title">{t.collects}</h2>
            <p className="text-pretty">{t.collectsBody}</p>
          </section>
          <section className="grid gap-4">
            <h2 className="section-title">{t.contactInfo}</h2>
            <p className="text-pretty">
              {t.contactInfoBody[0]}
              <SiteLink href={localizePath("/contact", locale)}>
                {t.contactPage}
              </SiteLink>
              {t.contactInfoBody[1]}
            </p>
          </section>
          <section className="grid gap-4">
            <h2 className="section-title">{t.choices}</h2>
            <p className="prose text-pretty">
              {t.choicesBody[0]}
              <code>PUBLIC_DISABLE_ANALYTICS=true</code>
              {t.choicesBody[1]}
            </p>
            <p className="text-muted-foreground text-pretty">{t.note}</p>
          </section>
        </main>
      </Layout>
    </>
  );
}
