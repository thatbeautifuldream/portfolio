import { allPosts } from "content-collections"
import Link from "next/link"
import { createMetadata } from "@/lib/metadata"
import { JsonLd } from "@/components/json-ld"

export const metadata = createMetadata({
  title: "Blog",
  description:
    "Notes on product engineering, AI interfaces, developer tools, and building products people return to.",
  canonical: "https://milind.app/blog",
})

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Milind Mishra - Blog",
  description:
    "Notes on product engineering, AI interfaces, developer tools, and building products people return to.",
  url: "https://milind.app/blog",
  author: {
    "@type": "Person",
    name: "Milind Mishra",
    url: "https://milind.app",
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
            <div className="grid gap-4">
              <p className="text-sm text-muted-foreground">Blog</p>
              <h1 className="max-w-[24ch] text-3xl font-semibold tracking-tight text-balance md:text-5xl">
                Notes on building products people return to
              </h1>
            </div>

            <div className="grid gap-8">
              {sortedPosts.map((post) => (
                <div key={post.slug} className="grid gap-2">
                  <p className="font-mono text-sm tracking-wide text-muted-foreground uppercase">
                    {post.category} · {formatDate(post.date)}
                  </p>
                  <h2 className="text-xl font-semibold tracking-tight">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className="max-w-[56ch] text-pretty text-muted-foreground">
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
