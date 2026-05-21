import Image from "next/image"
import Link from "next/link"
import { RiArrowRightUpLine } from "@remixicon/react"

import { hostname, screenshotUrl } from "@/lib/microlink"
import { projects } from "@/lib/portfolio-data"

export function SelectedWork() {
  return (
    <div className="grid gap-10">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-sm text-muted-foreground">Selected work</p>
        <Link
          href="/projects"
          className="text-sm text-muted-foreground no-underline transition-colors hover:text-foreground"
        >
          View all
        </Link>
      </div>

      <dl className="grid divide-y divide-border/40">
        {projects.map((project, index) => (
          <Link
            key={project.name}
            href={project.href}
            target="_blank"
            rel="noreferrer"
            className="group animate-fade-up grid gap-6 py-8 no-underline first:pt-0 last:pb-0 sm:grid-cols-[1fr_1.4fr] sm:items-center sm:gap-10"
            style={{ animationDelay: `${300 + index * 80}ms` }}
          >
            <div className="relative">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[min(1vw,12px)] bg-muted/30 outline-1 -outline-offset-1 outline-black/5 dark:bg-muted/20 dark:outline-white/10">
                <Image
                  src={screenshotUrl(project.href)}
                  alt=""
                  fill
                  unoptimized
                  sizes="(min-width: 640px) 45vw, 100vw"
                  className="object-cover object-top transition-transform duration-500 ease-out will-change-transform group-hover:scale-[1.015]"
                />
              </div>
              <span
                aria-hidden="true"
                className="absolute -top-2 -left-2 inline-flex items-center rounded-full bg-background px-2.5 py-1 font-mono text-[11px] font-medium text-foreground tabular-nums shadow-sm ring-1 ring-black/5 dark:bg-background dark:shadow-none dark:ring-white/10 dark:inset-ring dark:inset-ring-white/5"
              >
                #{String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <div className="grid gap-3">
              <dt className="text-xl font-medium tracking-tight text-foreground sm:text-2xl">
                {project.name}
              </dt>
              <dd className="max-w-[52ch] text-sm text-pretty text-muted-foreground sm:text-base">
                {project.description}
              </dd>
              <div className="mt-1 inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground/70 transition-colors group-hover:text-foreground">
                {hostname(project.href)}
                <RiArrowRightUpLine
                  aria-hidden="true"
                  className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </div>
            </div>
          </Link>
        ))}
      </dl>
    </div>
  )
}
