import SiteLink from "../../components/SiteLink";
import type { ComponentProps } from "../../lib/ui";
import { classes } from "../../lib/ui";
import { getCollection } from "../../lib/content";
import Layout from "../../layouts/Layout";
import CodeCopy from "../../components/CodeCopy";
import PageHeader from "../../components/PageHeader";
import { absoluteUrl, buildPersonRef } from "../../lib/seo";
import { getLocale, locales, localizePath, useTranslations } from "../../i18n";
export default async function View(props: ComponentProps) {
  const context = props.context;
  const { gist } = props;
  const locale = getLocale(context.locale);
  const t = useTranslations(locale).gist;
  const date = gist.data.datePublished ?? gist.data.date ?? new Date(0);
  const tag = gist.data.tags?.split(",")[0]?.trim() ?? "Gist";
  function formatDate(date: Date): string {
    return date.toLocaleDateString(locales[locale].dateLocale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: gist.data.title,
    description: gist.data.description ?? "",
    author: buildPersonRef(context.site),
    datePublished: date.toISOString(),
    dateModified: date.toISOString(),
  };
  return (
    <>
      <Layout
        context={context}
        title={gist.data.title}
        description={gist.data.description ?? t.description}
        canonical={absoluteUrl(
          localizePath(`/gist/${gist.id}`, locale),
          context.site,
        )}
        image={`/og/gist${locale === "en" ? "" : `/${locale}`}/${gist.id}.png`}
        jsonLd={jsonLd}
      >
        <main>
          <article className="stagger grid min-w-0 gap-8">
            <PageHeader
              context={context}
              title={gist.data.title}
              meta={`${tag} · ${formatDate(date)}`}
            />
            <div className="grid gap-4">
              {gist.data.description && (
                <p className="text-muted-foreground text-pretty">
                  {gist.data.description}
                </p>
              )}
              <p>
                <SiteLink
                  href={gist.data.gistUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.viewOnGitHub}
                </SiteLink>
              </p>
            </div>
            <div
              className="prose min-w-0"
              dangerouslySetInnerHTML={{ __html: gist.html }}
            />
          </article>
        </main>
        <CodeCopy context={context} />
      </Layout>
    </>
  );
}
