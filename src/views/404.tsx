import type { ComponentProps } from "../lib/ui";
import Layout from "../layouts/layout";
import PageHeader from "../components/page-header";
import IndexList from "../components/index-list";
export default async function View(props: ComponentProps) {
  const context = props.context;

  return (
    <>
      <Layout context={context}>
        <main className="grid stagger gap-12">
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
          <IndexList
            context={context}
            title="Go somewhere"
            items={[
              { href: "/", title: "Home" },
              { href: "/blog", title: "Read the blog" },
              { href: "/index.md", title: "Homepage Markdown" },
            ]}
          />
        </main>
      </Layout>
    </>
  );
}
