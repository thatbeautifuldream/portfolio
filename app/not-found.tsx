import Link from "next/link"
import { RiArrowLeftLine, RiHome3Line } from "@remixicon/react"

export default function NotFound() {
  return (
    <main className="isolate">
      <section className="section-shell">
        <div className="section-inner flex min-h-[60vh] flex-col items-center justify-center text-center">
          <div className="animate-fade-up grid gap-4 delay-100">
            <p className="font-mono text-sm tracking-wide text-muted-foreground uppercase">
              404
            </p>
            <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
              Page not found.
            </h1>
            <p className="max-w-[42ch] text-pretty text-muted-foreground">
              The page you are looking for does not exist, or has been moved.
              Head back to the homepage and find your way from there.
            </p>
          </div>

          <div className="animate-fade-up flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-8 text-sm delay-200">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-medium"
            >
              <RiArrowLeftLine className="size-4" />
              Back to home
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
