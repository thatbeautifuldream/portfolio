import Link from "next/link"

export default function NotFound() {
  return (
    <main className="isolate">
      <section className="section-shell">
        <div className="section-inner flex min-h-[50vh] flex-col items-center justify-center py-16">
          <p className="text-sm text-muted-foreground">404</p>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-balance md:text-3xl">
            Post not found
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            Sorry, we couldn&apos;t find the post you&apos;re looking for.
          </p>
          <Link
            href="/blog"
            className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <span>←</span>
            <span>Back to blog</span>
          </Link>
        </div>
      </section>
    </main>
  )
}
