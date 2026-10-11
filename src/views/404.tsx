import type { ComponentProps } from "../lib/ui";
import Layout from "../layouts/Layout";
import PageHeader from "../components/PageHeader";
import IndexList from "../components/IndexList";
export default async function View(props: ComponentProps) {
  const context = props.context;

  return (
    <>
      <Layout context={context}>
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
