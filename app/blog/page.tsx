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
  const [featured, ...rest] = sortedPosts

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

            {featured && (
              <article
                className="animate-fade-up group grid gap-4"
                style={{ animationDelay: "200ms" }}
              >
                {featured.coverImage && (
                  <Link
                    href={`/blog/${featured.slug}`}
                    aria-label={featured.title}
                    className="block w-full overflow-hidden rounded-3xl border border-border/60 bg-muted no-underline ring-1 ring-inset ring-white/5 dark:border-border/40"
                  >
                    {/** biome-ignore lint/performance/noImgElement: external Twitter-hosted images */}
                    <img
                      src={featured.coverImage}
                      alt=""
                      className="block w-full transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    />
                  </Link>
                )}
                <p className="font-mono text-sm tracking-wide text-muted-foreground uppercase">
                  Latest · {featured.category} · {formatDate(featured.date)}
                </p>
                <h2 className="max-w-[28ch] text-3xl font-semibold tracking-tight text-pretty md:text-4xl">
                  <Link href={`/blog/${featured.slug}`}>{featured.title}</Link>
                </h2>
                <p className="max-w-[60ch] text-base text-pretty text-muted-foreground">
                  {featured.description}
                </p>
              </article>
            )}

            {rest.length > 0 && (
              <div className="grid gap-0 divide-y divide-border/40 border-t border-border/40">
                {rest.map((post, index) => (
                  <article
                    key={post.slug}
                    className="animate-fade-up group grid grid-cols-[88px_1fr] items-start gap-4 py-5 sm:grid-cols-[120px_1fr] sm:gap-6"
                    style={{ animationDelay: `${280 + index * 80}ms` }}
                  >
                    {post.coverImage ? (
                      <Link
                        href={`/blog/${post.slug}`}
                        aria-label={post.title}
                        className="block aspect-square overflow-hidden rounded-xl border border-border/60 bg-muted no-underline ring-1 ring-inset ring-white/5 dark:border-border/40"
                      >
                        {/** biome-ignore lint/performance/noImgElement: external Twitter-hosted images */}
                        <img
                          src={post.coverImage}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                        />
                      </Link>
                    ) : (
                      <div className="aspect-square rounded-xl bg-muted" />
                    )}
                    <div className="grid gap-1.5">
                      <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
                        {post.category} · {formatDate(post.date)}
                      </p>
                      <h3 className="text-base font-semibold tracking-tight sm:text-lg">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <p className="line-clamp-2 max-w-[56ch] text-sm text-pretty text-muted-foreground">
                        {post.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  )
}
