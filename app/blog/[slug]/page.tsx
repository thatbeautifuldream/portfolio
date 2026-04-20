import { allPosts } from "content-collections"
import { notFound } from "next/navigation"
import { StreamdownWrapper } from "@/components/streamdown-wrapper"
import { createMetadata } from "@/lib/metadata"
import { JsonLd } from "@/components/json-ld"

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = allPosts.find((p) => p.slug === slug)

  if (!post) {
    return {}
  }

  return createMetadata({
    title: post.title,
    description: post.description,
    canonical: `https://milindmishra.com/blog/${slug}`,
    ogType: "blog-post",
    slug: slug,
  })
}

const author = {
  name: "Milind Mishra",
  href: "https://milindmishra.com",
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = allPosts.find((p) => p.slug === slug)

  if (!post) {
    notFound()
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    author: {
      "@type": "Person",
      name: author.name,
      url: author.href,
    },
    datePublished: post.date,
    dateModified: post.date,
  }

  return (
    <>
      <JsonLd data={articleSchema} />

      <main className="isolate">
        <section className="section-shell">
          <div className="section-inner grid gap-12">
            <article className="grid gap-8">
              <header className="animate-fade-up grid gap-2 delay-100">
                <p className="font-mono text-sm tracking-wide text-muted-foreground uppercase">
                  {post.category} · {formatDate(post.date)}
                </p>
                <h1 className="max-w-[24ch] text-3xl font-semibold tracking-tight text-pretty md:text-5xl">
                  {post.title}
                </h1>
                <p className="max-w-[56ch] text-pretty text-muted-foreground">
                  {post.description}
                </p>
              </header>

              <div className="animate-fade-up prose max-w-none delay-200">
                <StreamdownWrapper content={post.content} />
              </div>
            </article>
          </div>
        </section>
      </main>
    </>
  )
}
