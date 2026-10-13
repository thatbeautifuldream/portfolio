import Content from "../../components/content";
import SiteLink from "../../components/site-link";
import type { ComponentProps } from "../../lib/ui";
import type { CollectionEntry } from "../../lib/content";
import { Icon } from "../../lib/ui";
import Layout from "../../layouts/layout";
import CodeCopy from "../../components/code-copy";
import PageHeader from "../../components/page-header";
import { hostname } from "../../data/portfolio";
import { buildPersonRef } from "../../lib/seo";
export default async function View(props: ComponentProps) {
  const context = props.context;
  const project: CollectionEntry<"projects" | "hiProjects"> = props.project;
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
      <Layout context={context} jsonLd={jsonLd}>
        <main>
          <article className="grid min-w-0 stagger gap-8">
            <PageHeader
              context={context}
              title={project.data.title}
              meta={project.data.description}
            >
              <SiteLink
                href={project.data.url}
                className="inline-flex w-fit items-center gap-1 text-faint no-underline hover:text-foreground"
              >
                {hostname(project.data.url)}
                <Icon
                  name="ri:arrow-right-up-line"
                  className="size-5 shrink-0 sm:size-4"
                />
              </SiteLink>
            </PageHeader>
            <Content className="prose min-w-0" html={project.html} />
          </article>
        </main>
        <CodeCopy context={context} />
      </Layout>
    </>
  );
}
