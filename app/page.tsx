import Link from "next/link"
import { RiHeartFill, RiMagicFill, RiSparklingFill } from "@remixicon/react"

import { heroStats, siteLinks } from "@/lib/portfolio-data"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Milind Kumar Mishra",
  description:
    "Product engineer building AI-native interfaces, thoughtful product systems, and tools people return to.",
  canonical: "https://milindmishra.com",
  ogType: "home",
})

export default function Page() {
  return (
    <main className="isolate">
      <section className="section-shell">
        <div className="section-inner grid gap-16">
          <div className="grid gap-12">
            <div className="animate-fade-up grid gap-4 delay-100">
              <div className="grid gap-6">
                <p className="text-sm text-muted-foreground">
                  Bengaluru · Product engineer · AI-native interfaces
                </p>
                <h1 className="max-w-[22ch] text-4xl leading-[1.25] font-semibold tracking-tight text-balance select-none md:text-6xl md:leading-[1.2]">
                  <span className="text-foreground">Building</span>{" "}
                  <span className="text-muted-foreground/50">AI-native</span>{" "}
                  <span className="inline-flex translate-y-[-0.08em] cursor-pointer items-center gap-1.5 rounded-xl bg-blue-100 py-1 pr-3 pl-2 text-[0.85em] text-blue-700 shadow-sm ring-1 ring-blue-200/80 transition-transform duration-200 ease-out ring-inset hover:-rotate-3 hover:shadow-lg dark:bg-blue-500/15 dark:text-blue-300 dark:ring-blue-400/20">
                    <RiSparklingFill className="size-[0.7em] shrink-0" />
                    interfaces
                  </span>{" "}
                  <span className="text-muted-foreground/50">
                    and product systems
                  </span>{" "}
                  <span className="text-foreground">that feel</span>{" "}
                  <span className="inline-flex translate-y-[-0.08em] cursor-pointer items-center gap-1.5 rounded-xl bg-amber-100 py-1 pr-3 pl-2 text-[0.85em] text-amber-800 shadow-sm ring-1 ring-amber-200/80 transition-transform duration-200 ease-out ring-inset hover:rotate-3 hover:shadow-lg dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-400/20">
                    <RiMagicFill className="size-[0.7em] shrink-0" />
                    human
                  </span>{" "}
                  <span className="text-muted-foreground/50">
                    and obviously
                  </span>{" "}
                  <span className="inline-flex translate-y-[-0.08em] cursor-pointer items-center gap-1.5 rounded-xl bg-rose-100 py-1 pr-3 pl-2 text-[0.85em] text-rose-700 shadow-sm ring-1 ring-rose-200/80 transition-transform duration-200 ease-out ring-inset hover:-rotate-2 hover:shadow-lg dark:bg-rose-500/15 dark:text-rose-300 dark:ring-rose-400/20">
                    <RiHeartFill className="size-[0.7em] shrink-0" />
                    cared for
                  </span>
                  <span className="text-foreground">.</span>
                </h1>
                <p className="max-w-[52ch] text-base text-pretty text-muted-foreground md:text-lg">
                  Most recently at Merlin AI, I worked across onboarding, chat
                  history, model selection, and interaction systems. The
                  through-line is consistent: complex workflows should feel
                  legible, human, and obviously cared for.
                </p>
              </div>
            </div>

            <div className="animate-fade-up flex flex-wrap items-center gap-x-6 gap-y-2 text-sm delay-150">
              <Link href={siteLinks.primaryCta.href} className="font-medium">
                {siteLinks.primaryCta.label}
              </Link>
              <Link href={siteLinks.resume.href}>{siteLinks.resume.label}</Link>
              <Link href={siteLinks.github.href}>{siteLinks.github.label}</Link>
            </div>

            <div className="animate-fade-up grid gap-6 pt-8 delay-200 md:grid-cols-3">
              {heroStats.map((stat) => (
                <div key={stat.label} className="grid gap-1">
                  <p className="text-3xl font-semibold tabular-nums">
                    {stat.value}
                  </p>
                  <p className="text-sm text-pretty text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="animate-fade-up grid gap-4 delay-250">
            <div className="grid gap-8">
              <div className="grid gap-4">
                <p className="text-sm text-muted-foreground">Current focus</p>
                <h2 className="max-w-[24ch] text-3xl font-semibold tracking-tight text-balance md:text-4xl">
                  AI product engineering with a bias toward interface clarity.
                </h2>
                <p className="max-w-[56ch] text-base text-pretty text-muted-foreground">
                  I gravitate toward product areas where interaction quality
                  materially changes comprehension: onboarding, model choice,
                  histories, evaluative tooling, and the UI systems that make
                  those workflows feel humane.
                </p>
              </div>

              <div className="grid gap-4 text-sm">
                <p className="text-muted-foreground">Quick navigation</p>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <Link href="/work" className="font-medium">
                    View my work experience
                  </Link>
                  <Link href="/projects">Explore my projects</Link>
                  <Link href="/talks">See my talks</Link>
                  <Link href="/blog">Read my blog</Link>
                  <Link href="/contact">Get in touch</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
