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
  const t = useTranslations(locale).blog;
  const posts = (await getLocalizedCollection("posts", locale)).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${siteConfig.shortName} - Blog`,
    description: t.description,
    url: absoluteUrl(localizePath("/blog", locale), context.site),
    author: buildPersonRef(context.site),
  };
  return (
    <>
      <Layout context={context} jsonLd={jsonLd}>
        <main className="grid stagger gap-12">
          <PageHeader context={context} title={t.heading} meta={t.meta} />
          <IndexList
            context={context}
            title={t.posts}
            items={posts.map((post) => ({
              href: localizePath(`/blog/${post.id}`, locale),
              title: post.data.title,
              meta: formatSiteDate(post.data.date, "en-GB", {
                day: "2-digit",
                month: "2-digit",
              }),
              group: formatSiteDate(post.data.date, "en-US", {
                year: "numeric",
              }),
              attrs: { "data-post-title": post.data.title },
            }))}
          />
        </main>
      </Layout>

      <ClientEnhancement kind="blog-list" />
    </>
  );
}
