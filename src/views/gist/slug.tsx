import Content from "../../components/content";
import SiteLink from "../../components/site-link";
import type { ComponentProps } from "../../lib/ui";
import type { CollectionEntry } from "../../lib/content";
import Layout from "../../layouts/layout";
import CodeCopy from "../../components/code-copy";
import PageHeader from "../../components/page-header";
import { buildPersonRef } from "../../lib/seo";
import { getLocale, locales, useTranslations } from "../../i18n";
export default async function View(props: ComponentProps) {
  const context = props.context;
  const gist: CollectionEntry<"gists" | "hiGists"> = props.gist;
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
      <Layout context={context} jsonLd={jsonLd}>
        <main>
          <article className="grid min-w-0 stagger gap-8">
            <PageHeader
              context={context}
              title={gist.data.title}
              meta={`${tag} · ${formatDate(date)}`}
            />
            <div className="grid gap-4">
              {gist.data.description && (
                <p className="text-pretty text-muted-foreground">
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
            <Content className="prose min-w-0" html={gist.html} />
          </article>
        </main>
        <CodeCopy context={context} />
      </Layout>
    </>
  );
}
