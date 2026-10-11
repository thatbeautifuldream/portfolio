import type { ComponentProps } from "../../lib/ui";
import Layout from "../../layouts/Layout";
import PageHeader from "../../components/PageHeader";
import IndexList from "../../components/IndexList";
import { hostname } from "../../data/portfolio";
import { absoluteUrl, buildPersonRef, siteConfig } from "../../lib/seo";
import { getLocale, localizePath, useTranslations } from "../../i18n";
import { getLocalizedCollection } from "../../i18n/content";
export default async function View(props: ComponentProps) {
  const context = props.context;
  const locale = getLocale(context.locale);
  const t = useTranslations(locale).project;
  const projects = (await getLocalizedCollection("projects", locale)).sort(
    (a, b) => a.data.title.localeCompare(b.data.title),
  );
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${siteConfig.shortName} - Projects`,
    description: t.description,
    url: absoluteUrl(localizePath("/project", locale), context.site),
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
            title={t.title}
            items={projects.map((project) => ({
              href: localizePath(`/project/${project.id}`, locale),
              title: project.data.title,
              meta: hostname(project.data.url),
            }))}
          />
        </main>
      </Layout>
    </>
  );
}
