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
    canonical: `https://milind.app/blog/${slug}`,
  })
}

const author = {
  name: "Milind Mishra",
  href: "https://milind.app",
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
              <header className="grid gap-2">
                <p className="font-mono text-sm tracking-wide text-muted-foreground uppercase">
                  {post.category} · {formatDate(post.date)}
                </p>
                <h1 className="max-w-[24ch] text-3xl font-semibold tracking-tight text-balance md:text-5xl">
                  {post.title}
                </h1>
                <p className="max-w-[56ch] text-pretty text-muted-foreground">
                  {post.description}
                </p>
              </header>

              <div className="prose max-w-none prose-neutral dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-balance prose-p:text-pretty prose-a:text-foreground prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-foreground/80">
                <StreamdownWrapper content={post.content} />
              </div>
            </article>
          </div>
        </section>
      </main>
    </>
  )
}
