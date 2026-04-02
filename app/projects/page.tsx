import Link from "next/link"

import { MobileNav } from "@/components/portfolio/mobile-nav"
import { projects } from "@/lib/portfolio-data"

export const metadata = {
  title: "Projects",
  description:
    "These are the products and tools that best show what I build when I can choose the problem framing, the interaction model, and where polish actually matters.",
}

export default function ProjectsPage() {
  return (
    <main className="isolate">
      <MobileNav />

      <section className="section-shell">
        <div className="section-inner grid gap-12">
          <div className="grid gap-4">
            <p className="text-sm text-muted-foreground">Selected projects</p>
            <h1 className="max-w-[28ch] text-3xl font-semibold tracking-tight text-balance md:text-4xl">
              These are the products and tools that best show what I build when
              I can choose the problem framing, the interaction model, and where
              polish actually matters.
            </h1>
          </div>

          <div className="grid gap-12">
            {projects.map((project) => (
              <div key={project.name} className="grid gap-4">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <p className="text-lg font-semibold tracking-tight">
                    {project.name}
                  </p>
                  <span className="text-sm text-muted-foreground">
                    {project.status}
                  </span>
                </div>
                <p className="max-w-[52ch] text-pretty text-muted-foreground">
                  {project.description}
                </p>

                <div className="grid gap-3">
                  {project.metrics.map((metric) => (
                    <div
                      className="flex items-baseline justify-between gap-3 border-b border-border/40 pb-2"
                      key={metric.label}
                    >
                      <span className="text-sm text-muted-foreground">
                        {metric.label}
                      </span>
                      <span className="text-xl font-semibold tabular-nums">
                        {metric.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="grid gap-3">
                  {project.highlights.map((highlight) => (
                    <p
                      className="text-base text-muted-foreground"
                      key={highlight}
                    >
                      {highlight}
                    </p>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                  <Link href={project.href} className="font-medium">
                    Open project
                  </Link>
                  {project.github ? (
                    <Link href={project.github}>Source</Link>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
