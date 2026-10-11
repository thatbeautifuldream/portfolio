import Content from "../../components/Content";
import SiteLink from "../../components/SiteLink";
import type { ComponentProps } from "../../lib/ui";
import { classes } from "../../lib/ui";
import { getCollection } from "../../lib/content";
import { Image } from "../../lib/ui";
import Layout from "../../layouts/Layout";
import PageHeader from "../../components/PageHeader";
import { hostname } from "../../data/portfolio";
import { absoluteUrl, buildPersonRef } from "../../lib/seo";
import { getLocale, localizePath, useTranslations } from "../../i18n";
export default async function View(props: ComponentProps) {
  const context = props.context;
  const { item } = props;
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
      <Layout
        context={context}
        title={item.data.title}
        description={item.data.description}
        canonical={absoluteUrl(
          localizePath(`/uses/${item.id}`, locale),
          context.site,
        )}
        jsonLd={jsonLd}
      >
        <main>
          <article className="stagger grid min-w-0 gap-8">
            <PageHeader
              context={context}
              title={item.data.title}
              meta={t.categories[item.data.category] ?? item.data.category}
            />
            <div className="grid gap-4">
              <p className="text-muted-foreground text-pretty">
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
