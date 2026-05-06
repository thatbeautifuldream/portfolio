import Link from "next/link"

import { projects } from "@/lib/portfolio-data"
import { createMetadata } from "@/lib/metadata"
import { JsonLd } from "@/components/json-ld"

export const metadata = createMetadata({
  title: "Projects",
  description:
    "Side projects born from curiosity. Built to understand technology, shipped to find clarity.",
  canonical: "https://milindmishra.com/projects",
  ogType: "projects",
})

const projectsSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Projects — Milind Kumar Mishra",
  description:
    "Side projects born from curiosity. Built to understand technology, shipped to find clarity.",
  url: "https://milindmishra.com/projects",
  author: {
    "@type": "Person",
    name: "Milind Kumar Mishra",
    url: "https://milindmishra.com",
  },
  hasPart: projects.map((project) => ({
    "@type": "SoftwareApplication",
    name: project.name,
    description: project.description,
    url: project.href,
    applicationCategory: "DeveloperApplication",
    programmingLanguage: "TypeScript",
  })),
}

export default function ProjectsPage() {
  return (
    <>
      <JsonLd data={projectsSchema} />
      <main className="isolate">
      <section className="section-shell">
        <div className="section-inner grid gap-16">
          <div
            className="animate-fade-up grid gap-4"
            style={{ animationDelay: "100ms" }}
          >
            <p className="text-sm text-muted-foreground">Side projects</p>
            <h1 className="max-w-[28ch] text-3xl font-semibold tracking-tight text-balance md:text-4xl">
              My experimental ground. Build something, break something, learn
              everything.
            </h1>
            <p className="max-w-[56ch] text-base text-pretty text-muted-foreground">
              Most of these started as a late-night question that I
              couldn&apos;t shake. I build to understand, and I ship because
              finishing forces clarity. Some got real users, most taught me
              something I didn&apos;t expect.
            </p>
          </div>

          <div
            className="animate-fade-up grid gap-4"
            style={{ animationDelay: "200ms" }}
          >
            <div className="grid gap-4">
              <h2 className="max-w-[24ch] text-2xl font-semibold tracking-tight md:text-3xl">
                Why I ship experiments publicly
              </h2>
              <p className="max-w-[56ch] text-base text-pretty text-muted-foreground">
                Finishing something is harder than starting it. Shipping forces
                clarity. These projects are my way of closing the loop on ideas
                that kept me up, and sharing them because the best feedback is
                from people who actually use what you build.
              </p>
            </div>
          </div>

          <div className="grid gap-12">
            {projects.map((project, index) => (
              <div
                key={project.name}
                className="animate-fade-up grid gap-4"
                style={{ animationDelay: `${300 + index * 80}ms` }}
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <p className="text-lg font-semibold tracking-tight">
                    {project.name}
                  </p>
                  <span className="text-sm text-muted-foreground">
                    {project.status}
                  </span>
                </div>
                <p className="max-w-[52ch] text-base text-pretty text-muted-foreground">
                  {project.description}
                </p>

                {project.metrics.length > 0 && (
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
                )}

                <div className="grid gap-3">
                  {project.highlights.map((highlight) => (
                    <p
                      className="max-w-[56ch] text-base text-pretty text-muted-foreground"
                      key={highlight}
                    >
                      {highlight}
                    </p>
                  ))}
                </div>

                <p className="font-mono text-xs tracking-wide text-muted-foreground">
                  {project.tags.join(" · ")}
                </p>

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
    </>
  )
}
