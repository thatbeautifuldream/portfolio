import { allGists } from "content-collections"
import { notFound } from "next/navigation"
import { RiExternalLinkLine } from "@remixicon/react"
import { StreamdownWrapper } from "@/components/streamdown-wrapper"
import { createMetadata } from "@/lib/metadata"
import { JsonLd } from "@/components/json-ld"

export async function generateStaticParams() {
  return allGists.map((gist) => ({
    slug: gist.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const gist = allGists.find((g) => g.slug === slug)

  if (!gist) {
    return {}
  }

  return createMetadata({
    title: gist.title,
    description: gist.description ?? "",
    canonical: `https://milindmishra.com/gist/${slug}`,
    ogType: "blog-post",
    slug,
  })
}

const author = {
  name: "Milind Mishra",
  href: "https://milindmishra.com",
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export default async function GistPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const gist = allGists.find((g) => g.slug === slug)

  if (!gist) {
    notFound()
  }

  const tag = gist.tags?.split(",")[0]?.trim() ?? "Gist"

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: gist.title,
    description: gist.description ?? "",
    author: {
      "@type": "Person",
      name: author.name,
      url: author.href,
    },
    datePublished: gist.date.toISOString(),
    dateModified: gist.date.toISOString(),
  }

  return (
    <>
      <JsonLd data={articleSchema} />

      <main className="isolate">
        <section className="section-shell">
          <div className="section-inner grid min-w-0 gap-12">
            <article className="grid min-w-0 gap-8">
              <header
                className="animate-fade-up grid gap-2"
                style={{ animationDelay: "100ms" }}
              >
                <p className="font-mono text-sm tracking-wide text-muted-foreground uppercase">
                  {tag} · {formatDate(gist.date)}
                </p>
                <h1 className="max-w-[24ch] text-3xl font-semibold tracking-tight text-pretty md:text-5xl">
                  {gist.title}
                </h1>
                {gist.description && (
                  <p className="max-w-[56ch] text-base text-pretty text-muted-foreground">
                    {gist.description}
                  </p>
                )}
                <a
                  href={gist.gistUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                  View on GitHub
                  <RiExternalLinkLine className="size-3" />
                </a>
              </header>

              <div
                className="animate-fade-up prose max-w-none overflow-x-hidden"
                style={{ animationDelay: "200ms" }}
              >
                <StreamdownWrapper content={gist.content} />
              </div>
            </article>
          </div>
        </section>
      </main>
    </>
  )
}
