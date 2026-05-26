import Image from "next/image"
import Link from "next/link"
import { RiArrowRightUpLine, RiGithubFill } from "@remixicon/react"

import { RoughNote } from "@/components/portfolio/rough-note"
import { JsonLd } from "@/components/json-ld"
import { hostname, screenshotUrl } from "@/lib/microlink"
import { projects } from "@/lib/portfolio-data"
import { createMetadata } from "@/lib/metadata"

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
              <h1 className="max-w-[28ch] text-3xl font-serif italic font-normal tracking-tight text-balance md:text-4xl">
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
              <h2 className="max-w-[24ch] text-2xl font-semibold tracking-tight md:text-3xl">
                Why I ship experiments publicly
              </h2>
              <p className="max-w-[56ch] text-base text-pretty text-muted-foreground">
                Finishing something is harder than starting it.{" "}
                <RoughNote
                  type="highlight"
                  color="rgba(128, 128, 128, 0.18)"
                  animationDuration={700}
                  iterations={1}
                >
                  Shipping forces clarity.
                </RoughNote>{" "}
                These projects are my way of closing the loop on ideas that
                kept me up, and sharing them because the best feedback is from
                people who actually use what you build.
              </p>
            </div>

            <dl className="grid divide-y divide-border/40">
              {projects.map((project, index) => (
                <article
                  key={project.name}
                  className="animate-fade-up grid gap-8 py-12 first:pt-0 last:pb-0"
                  style={{ animationDelay: `${300 + index * 80}ms` }}
                >
                  <Link
                    href={project.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open ${project.name}`}
                    className="group relative block no-underline"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden rounded-[min(1.4vw,16px)] bg-muted/30 outline-1 -outline-offset-1 outline-black/5 dark:bg-muted/20 dark:outline-white/10">
                      <Image
                        src={screenshotUrl(project.href)}
                        alt=""
                        fill
                        unoptimized
                        sizes="(min-width: 768px) 768px, 100vw"
                        className="object-cover object-top transition-transform duration-500 ease-out will-change-transform group-hover:scale-[1.015]"
                      />
                    </div>
                    <span
                      aria-hidden="true"
                      className="absolute -top-2 -left-2 inline-flex items-center rounded-full bg-background px-2.5 py-1 font-mono text-[11px] font-medium text-foreground tabular-nums shadow-sm ring-1 ring-black/5 dark:bg-background dark:shadow-none dark:ring-white/10 dark:inset-ring dark:inset-ring-white/5"
                    >
                      #{String(index + 1).padStart(2, "0")}
                    </span>
                  </Link>

                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <dt className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                          {project.name}
                        </dt>
                        <span className="font-mono text-xs text-muted-foreground/70 tabular-nums uppercase tracking-wide">
                          {project.status}
                        </span>
                      </div>
                      <dd className="max-w-[60ch] text-base text-pretty text-muted-foreground md:text-lg">
                        {project.description}
                      </dd>
                    </div>

                    {project.metrics.length > 0 && (
                      <dl className="grid grid-cols-1 gap-x-8 gap-y-3 border-t border-border/40 pt-4 sm:grid-cols-2">
                        {project.metrics.map((metric) => (
                          <div
                            className="flex items-baseline justify-between gap-3"
                            key={metric.label}
                          >
                            <dt className="text-sm text-muted-foreground">
                              {metric.label}
                            </dt>
                            <dd className="font-mono text-sm font-medium tabular-nums text-foreground">
                              {metric.value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    )}

                    <ul className="grid gap-2.5 border-t border-border/40 pt-4">
                      {project.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="grid grid-cols-[auto_1fr] gap-3 text-base text-pretty text-muted-foreground"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-2.5 inline-block size-1 rounded-full bg-muted-foreground/50"
                          />
                          <span className="max-w-[60ch]">{highlight}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-muted-foreground/70">
                      {project.tags.map((tag, i) => (
                        <span key={tag} className="inline-flex items-center">
                          {tag}
                          {i < project.tags.length - 1 && (
                            <span
                              aria-hidden="true"
                              className="ml-2 text-muted-foreground/30"
                            >
                              ·
                            </span>
                          )}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-sm">
                      <Link
                        href={project.href}
                        target="_blank"
                        rel="noreferrer"
                        className="group/cta inline-flex items-center gap-1.5 font-medium text-foreground no-underline"
                      >
                        {hostname(project.href)}
                        <RiArrowRightUpLine
                          aria-hidden="true"
                          className="size-3.5 transition-transform duration-200 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5"
                        />
                      </Link>
                      {project.github ? (
                        <Link
                          href={project.github}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-muted-foreground no-underline transition-colors hover:text-foreground"
                        >
                          <RiGithubFill
                            aria-hidden="true"
                            className="size-3.5"
                          />
                          Source
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </article>
              ))}
            </dl>
          </div>
        </section>
      </main>
    </>
  )
}
