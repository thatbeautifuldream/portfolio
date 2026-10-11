import type { ComponentProps } from "../../lib/ui";
import { classes } from "../../lib/ui";
import { getCollection } from "../../lib/content";
import { Icon } from "../../lib/ui";
import Layout from "../../layouts/Layout";
import CodeCopy from "../../components/CodeCopy";
import PageHeader from "../../components/PageHeader";
import { hostname } from "../../data/portfolio";
import { absoluteUrl, buildPersonRef } from "../../lib/seo";
import { getLocale, localizePath } from "../../i18n";
export default async function View(props: ComponentProps) {
  const context = props.context;
  const { project } = props;
  const locale = getLocale(context.locale);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.data.title,
    description: project.data.description,
    url: project.data.url,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    author: buildPersonRef(context.site),
  };
  return (
    <>
      <Layout
        context={context}
        title={project.data.title}
        description={project.data.description}
        canonical={absoluteUrl(
          localizePath(`/project/${project.id}`, locale),
          context.site,
        )}
        image={`/og${locale === "en" ? "" : `/${locale}`}/project/${project.id}.png`}
        jsonLd={jsonLd}
      >
        <main>
          <article className="stagger grid min-w-0 gap-8">
            <PageHeader
              context={context}
              title={project.data.title}
              meta={project.data.description}
            >
              <a
                href={project.data.url}
                className="text-faint hover:text-foreground inline-flex w-fit items-center gap-1 no-underline"
              >
                {hostname(project.data.url)}
                <Icon
                  name="ri:arrow-right-up-line"
                  className="size-5 shrink-0 sm:size-4"
                />
              </a>
            </PageHeader>
            <div
              className="prose min-w-0"
              dangerouslySetInnerHTML={{ __html: project.html }}
            />
          </article>
        </main>
        <CodeCopy context={context} />
      </Layout>
    </>
  );
}
