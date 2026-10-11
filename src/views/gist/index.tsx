import type { ComponentProps } from "../../lib/ui";
import ClientScript from "../../components/ClientScript";
import Layout from "../../layouts/Layout";
import PageHeader from "../../components/PageHeader";
import IndexList from "../../components/IndexList";
import { absoluteUrl, buildPersonRef, siteConfig } from "../../lib/seo";
import { getLocale, localizePath, useTranslations } from "../../i18n";
import { getLocalizedCollection } from "../../i18n/content";
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
      <Layout
        context={context}
        title={t.title}
        description={t.description}
        jsonLd={jsonLd}
      >
        <main className="stagger grid gap-12">
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
                  ? date.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                    })
                  : gist.data.tags?.split(",")[0]?.trim(),
                group: date ? String(date.getFullYear()) : undefined,
                attrs: { "data-gist-title": gist.data.title },
              };
            })}
          />
        </main>
      </Layout>

      <ClientScript
        id="src/views/gist/index.tsx:0"
        code={
          '"use strict";\ndocument.querySelectorAll(\'a[href^="/gist/"]\').forEach((link) => {\n    link.addEventListener("click", () => {\n        window.posthog?.capture("gist_clicked", {\n            gist_slug: link.getAttribute("href").replace("/gist/", ""),\n            gist_title: link.dataset.gistTitle ?? null,\n        });\n    });\n});\n'
        }
        vars={{}}
      />
    </>
  );
}
