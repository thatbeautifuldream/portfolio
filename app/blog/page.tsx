import { allPosts } from "content-collections"
import Link from "next/link"
import { createMetadata } from "@/lib/metadata"
import { JsonLd } from "@/components/json-ld"

export const metadata = createMetadata({
  title: "Blog",
  description:
    "Notes on product engineering, AI interfaces, developer tools, and the journey of building products.",
  canonical: "https://milindmishra.com/blog",
  ogType: "blog",
})

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Milind Mishra - Blog",
  description:
    "Notes on product engineering, AI interfaces, developer tools, and the journey of building products.",
  url: "https://milindmishra.com/blog",
  author: {
    "@type": "Person",
    name: "Milind Mishra",
    url: "https://milindmishra.com",
  },
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export default function BlogPage() {
  const sortedPosts = [...allPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <>
      <JsonLd data={blogSchema} />

      <main className="isolate">
        <section className="section-shell">
          <div className="section-inner grid gap-12">
            <div
            className="animate-fade-up grid gap-4"
            style={{ animationDelay: "100ms" }}
          >
              <p className="text-sm text-muted-foreground">Blog</p>
              <h1 className="max-w-[24ch] text-3xl font-semibold tracking-tight text-balance md:text-5xl">
                Notes on the journey of building products.
              </h1>
            </div>

            <div
              className="animate-fade-up grid gap-4"
              style={{ animationDelay: "200ms" }}
            >
              <h2 className="max-w-[24ch] text-2xl font-semibold tracking-tight md:text-3xl">
                Writing to understand, not to teach
              </h2>
              <p className="max-w-[56ch] text-base text-pretty text-muted-foreground">
                These posts are notes I wish existed when I was figuring things out.
                If even one idea here saves someone an hour of confusion, the post
                did its job.
              </p>
            </div>

            <div className="grid gap-0 divide-y divide-border/40">
              {sortedPosts.map((post, index) => (
                <div
                  key={post.slug}
                  className="animate-fade-up grid gap-2 py-6 first:pt-0 last:pb-0"
                  style={{ animationDelay: `${300 + index * 80}ms` }}
                >
                  <p className="font-mono text-sm tracking-wide text-muted-foreground uppercase">
                    {post.category} · {formatDate(post.date)}
                  </p>
                  <h2 className="text-xl font-semibold tracking-tight">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className="max-w-[56ch] text-base text-pretty text-muted-foreground">
                    {post.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
