import Link from "next/link"

import { heroStats, siteLinks } from "@/lib/portfolio-data"
import { Section } from "@/components/section"

export const metadata = {
  title: "Milind Kumar Mishra",
  description:
    "Product engineer building AI-native interfaces, thoughtful product systems, and tools people return to.",
}

export default function Page() {
  return (
    <main className="isolate">
      <section className="section-shell">
        <div className="section-inner grid gap-16">
          <div className="grid gap-12">
            <Section delay={0.1}>
              <div className="grid gap-6">
                <p className="text-sm text-muted-foreground">
                  Bengaluru · Product engineer · AI-native interfaces
                </p>
                <h1 className="max-w-[20ch] text-4xl font-semibold tracking-tight text-balance md:text-6xl">
                  A lifetime of building products, and I&apos;m just getting
                  started.
                </h1>
                <p className="max-w-[52ch] text-base text-pretty text-muted-foreground md:text-lg">
                  Most recently at Merlin AI, I worked across onboarding, chat
                  history, model selection, and interaction systems. The
                  through-line is consistent: complex workflows should feel
                  legible, human, and obviously cared for.
                </p>
              </div>
            </Section>

            <Section delay={0.15} className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <Link href={siteLinks.primaryCta.href} className="font-medium">
                {siteLinks.primaryCta.label}
              </Link>
              <Link href={siteLinks.resume.href}>{siteLinks.resume.label}</Link>
              <Link href={siteLinks.github.href}>{siteLinks.github.label}</Link>
            </Section>

            <Section delay={0.2} className="grid gap-6 pt-8 md:grid-cols-3">
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
            </Section>
          </div>

          <Section delay={0.25}>
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
          </Section>
        </div>
      </section>
    </main>
  )
}
