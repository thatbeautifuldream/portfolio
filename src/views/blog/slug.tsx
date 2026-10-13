import Content from "../../components/content";
import type { ComponentProps } from "../../lib/ui";
import type { CollectionEntry } from "../../lib/content";
import { formatSiteDate } from "../../lib/dates";
import ClientEnhancement from "../../components/client-enhancement";
import { Image } from "../../lib/ui";
import { Icon } from "../../lib/ui";
import Layout from "../../layouts/layout";
import CodeCopy from "../../components/code-copy";
import PageHeader from "../../components/page-header";
import { buildPersonRef } from "../../lib/seo";
import { getLocale, locales, useTranslations } from "../../i18n";
export default async function View(props: ComponentProps) {
  const context = props.context;
  const post: CollectionEntry<"posts" | "hiPosts"> = props.post;
  const locale = getLocale(context.locale);
  const t = useTranslations(locale).blog;
  function formatDate(date: Date): string {
    return formatSiteDate(date, locales[locale].dateLocale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.data.title,
    description: post.data.description,
    author: buildPersonRef(context.site),
    datePublished: post.data.date.toISOString(),
    dateModified: post.data.date.toISOString(),
  };
  return (
    <>
      <Layout context={context} jsonLd={jsonLd}>
        <main>
          <article className="grid min-w-0 stagger gap-8">
            <PageHeader
              context={context}
              title={post.data.title}
              meta={`${post.data.category} · ${formatDate(post.data.date)}`}
            >
              <button
                type="button"
                data-share
                className="relative inline-flex w-fit cursor-pointer items-center gap-1.5 text-faint hover:text-foreground"
              >
                <Icon
                  name="ri:share-forward-line"
                  className="size-5 shrink-0 sm:size-4"
                />
                <span data-share-label>{t.share}</span>
                <span
                  className="absolute top-1/2 left-1/2 size-[max(100%,3rem)] -translate-1/2 pointer-fine:hidden"
                  aria-hidden="true"
                ></span>
              </button>
            </PageHeader>
            {post.data.coverImage && (
              <Image
                src={post.data.coverImage}
                alt=""
                className="w-full rounded-lg outline-1 -outline-offset-1 outline-black/5 dark:outline-white/10"
              />
            )}
            <Content className="prose min-w-0" html={post.html} />
          </article>
        </main>
        <CodeCopy context={context} />
      </Layout>

      <ClientEnhancement
        kind="blog-article"
        vars={{
          slug: post.id,
          title: post.data.title,
          shareLabel: t.share,
          copiedLabel: t.linkCopied,
          sharePrefix: locale === "en" ? "/share" : `/share/${locale}`,
        }}
      />
    </>
  );
}
