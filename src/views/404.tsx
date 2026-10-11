import type { ComponentProps } from "../lib/ui";
import { classes } from "../lib/ui";
import Layout from "../layouts/Layout";
import PageHeader from "../components/PageHeader";
import IndexList from "../components/IndexList";
export default async function View(props: ComponentProps) {
  const context = props.context;

  return (
    <>
      <Layout
        context={context}
        title="Not found"
        description="This page could not be found."
      >
        <main className="stagger grid gap-12">
          <article className="grid gap-4">
            <PageHeader
              context={context}
              title="This page wandered off."
              meta="404"
            />
            <p className="text-pretty">
              The page you're looking for doesn't exist or has moved. Let's get
              you back on track.
            </p>
          </article>
          <section className="grid min-w-0 gap-4">
            <h2 className="section-title">Agent recovery links</h2>
            <div className="prose min-w-0">
              <pre>
                <code>{`# Not found

Try the homepage, sitemap, Markdown content, or API docs:

- [Home](/)
- [Sitemap](/sitemap-index.xml)
- [Machine-readable context](/llms.txt)
- [API documentation](/docs)`}</code>
              </pre>
            </div>
          </section>
          <IndexList
            context={context}
            title="Go somewhere"
            items={[
              { href: "/", title: "Home" },
              { href: "/blog", title: "Read the blog" },
              { href: "/docs", title: "API documentation" },
            ]}
          />
        </main>
      </Layout>
    </>
  );
}
