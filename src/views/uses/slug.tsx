import Content from "../../components/content";
import SiteLink from "../../components/site-link";
import type { ComponentProps } from "../../lib/ui";
import type { CollectionEntry } from "../../lib/content";
import { Image } from "../../lib/ui";
import Layout from "../../layouts/layout";
import PageHeader from "../../components/page-header";
import { hostname } from "../../data/portfolio";
import { buildPersonRef } from "../../lib/seo";
import { getLocale, useTranslations } from "../../i18n";
export default async function View(props: ComponentProps) {
  const context = props.context;
  const item: CollectionEntry<"uses" | "hiUses"> = props.item;
  const locale = getLocale(context.locale);
  const t = useTranslations(locale).uses;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: item.data.title,
    description: item.data.description,
    author: buildPersonRef(context.site),
    datePublished: item.data.date.toISOString(),
    dateModified: item.data.date.toISOString(),
  };
  return (
    <>
      <Layout context={context} jsonLd={jsonLd}>
        <main>
          <article className="grid min-w-0 stagger gap-8">
            <PageHeader
              context={context}
              title={item.data.title}
              meta={t.categories[item.data.category] ?? item.data.category}
            />
            <div className="grid gap-4">
              <p className="text-pretty text-muted-foreground">
                {item.data.description}
              </p>
              {item.data.url && (
                <p>
                  <SiteLink
                    href={item.data.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {hostname(item.data.url)}
                  </SiteLink>
                </p>
              )}
            </div>
            {item.data.coverImage && (
              <Image
                src={item.data.coverImage}
                alt=""
                className="w-full rounded-lg outline-1 -outline-offset-1 outline-black/5 dark:outline-white/10"
              />
            )}
            <Content className="prose min-w-0" html={item.html} />
          </article>
        </main>
      </Layout>
    </>
  );
}
