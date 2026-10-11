import SiteLink from "../components/SiteLink";
import type { ComponentProps } from "../lib/ui";
import ClientScript from "../components/ClientScript";
import Layout from "../layouts/Layout";
import PageHeader from "../components/PageHeader";
import IndexList from "../components/IndexList";
import EmailLink from "../components/EmailLink";
import { contactLinks } from "../data/portfolio";
import { absoluteUrl, buildPersonSchema, siteConfig } from "../lib/seo";
import { getLocale, localizePath, useTranslations } from "../i18n";
export default async function View(props: ComponentProps) {
  const context = props.context;
  const locale = getLocale(context.locale);
  const i18n = useTranslations(locale);
  const t = i18n.contact;
  const pageUrl = absoluteUrl(localizePath("/contact", locale), context.site);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: `${t.title} · ${siteConfig.name}`,
    description: t.description,
    url: pageUrl,
    mainEntity: buildPersonSchema(context.site),
  };
  return (
    <>
      <Layout context={context} jsonLd={jsonLd}>
        <main className="stagger grid gap-12">
          <article className="grid gap-4">
            <PageHeader context={context} title={t.title} meta={t.meta} />
            <p className="text-pretty">{t.body}</p>
            <EmailLink context={context} />
            <p className="text-pretty">
              {t.call[0]}
              <SiteLink href="https://cal.com/milind/15min">{t.book}</SiteLink>
              {t.call[1]}
            </p>
          </article>

          <section className="grid gap-4">
            <h2 className="section-title">{t.abroad}</h2>
            <p className="text-pretty">
              {t.abroadBody(
                i18n.city,
                t.country,
                siteConfig.location.timezoneLabel,
              )}
            </p>
          </section>

          <IndexList
            context={context}
            title={t.elsewhere}
            items={contactLinks.map((link) => ({
              href: link.href,
              title: link.label,
              meta: t.links[link.label] ?? link.copy,
              external: true,
              attrs: { "data-contact-label": link.label },
            }))}
          />
        </main>
      </Layout>

      <ClientScript
        id="src/views/contact.tsx:0"
        code={
          '"use strict";\ndocument.querySelectorAll("[data-contact-label]").forEach((link) => {\n    link.addEventListener("click", () => {\n        window.posthog?.capture("contact_link_clicked", {\n            platform: link.dataset.contactLabel,\n            href: link.getAttribute("href"),\n        });\n    });\n});\n'
        }
        vars={{}}
      />
    </>
  );
}
