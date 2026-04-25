import { allGists } from "content-collections"
import Link from "next/link"
import { createMetadata } from "@/lib/metadata"
import { JsonLd } from "@/components/json-ld"

export const metadata = createMetadata({
  title: "Gists",
  description: "Code snippets and quick solutions.",
  canonical: "https://milindmishra.com/gist",
  ogType: "blog",
})

const gistsSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Milind Mishra - Gists",
  description: "Code snippets and quick solutions.",
  url: "https://milindmishra.com/gist",
  author: {
    "@type": "Person",
    name: "Milind Mishra",
    url: "https://milindmishra.com",
  },
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export default function GistsPage() {
  const sortedGists = [...allGists].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  )

  return (
    <>
      <JsonLd data={gistsSchema} />

      <main className="isolate">
        <section className="section-shell">
          <div className="section-inner grid gap-12">
            <div
              className="animate-fade-up grid gap-4"
              style={{ animationDelay: "100ms" }}
            >
              <p className="text-sm text-muted-foreground">Gists</p>
              <h1 className="max-w-[24ch] text-3xl font-semibold tracking-tight text-balance md:text-5xl">
                Code snippets and quick solutions.
              </h1>
            </div>

            <div
              className="animate-fade-up grid gap-0 divide-y divide-border/40"
              style={{ animationDelay: "150ms" }}
            >
              {sortedGists.map((gist) => {
                const tag = gist.tags?.split(",")[0]?.trim() ?? "Gist"
                return (
                  <div
                    key={gist.slug}
                    className="grid gap-1 py-5 first:pt-0 last:pb-0"
                  >
                    <h2 className="text-lg font-semibold tracking-tight">
                      <Link href={`/gist/${gist.slug}`}>{gist.title}</Link>
                    </h2>
                    <p className="font-mono text-sm tracking-wide text-muted-foreground uppercase">
                      {tag} &middot; {formatDate(gist.date)}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
