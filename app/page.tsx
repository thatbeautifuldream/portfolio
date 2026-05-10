import Link from "next/link"
import { RiHeartFill, RiMagicFill, RiSparklingFill } from "@remixicon/react"

import { FullSign } from "@/components/portfolio/full-sign"
import { HeroBadge } from "@/components/portfolio/hero-badge"
import { HeroStats } from "@/components/portfolio/hero-stats"
import { RoughNote } from "@/components/portfolio/rough-note"
import { siteLinks } from "@/lib/portfolio-data"
import { createMetadata } from "@/lib/metadata"
import { JsonLd } from "@/components/json-ld"

export const metadata = createMetadata({
  title: "Milind Kumar Mishra",
  description:
    "Product engineer building AI-native interfaces, product systems, and tools people return to.",
  canonical: "https://milindmishra.com",
  ogType: "home",
})

const homePageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Milind Kumar Mishra — Product Engineer",
  description:
    "Product engineer building AI-native interfaces, product systems, and tools people return to.",
  url: "https://milindmishra.com",
  author: {
    "@type": "Person",
    name: "Milind Kumar Mishra",
    url: "https://milindmishra.com",
  },
}

export default function Page() {
  return (
    <>
      <JsonLd data={homePageSchema} />
      <main className="isolate">
      <section className="section-shell">
        <div className="section-inner grid gap-16">
          <div className="grid gap-12">
            <div
              className="animate-fade-up grid gap-4"
              style={{ animationDelay: "100ms" }}
            >
              <div className="grid gap-6">
                <p className="text-sm text-muted-foreground">
                  Bengaluru, India. Product engineer.
                </p>
                <h1 className="max-w-[22ch] text-4xl leading-tight font-semibold tracking-tight text-balance select-none md:text-6xl md:leading-[1.2]">
                  <span className="text-foreground">Building</span>{" "}
                  <span className="text-muted-foreground/50">AI-native</span>{" "}
                  <HeroBadge
                    icon={<RiSparklingFill className="size-[0.7em] shrink-0" />}
                    burstIcon="RiSparklingFill"
                    hoverRotate={-3}
                    className="bg-blue-100 text-blue-700 ring-blue-200/80 dark:bg-blue-500/15 dark:text-blue-300 dark:ring-blue-400/20"
                  >
                    interfaces
                  </HeroBadge>{" "}
                  <span className="text-muted-foreground/50">
                    and product systems
                  </span>{" "}
                  <span className="text-foreground">that feel</span>{" "}
                  <HeroBadge
                    icon={<RiMagicFill className="size-[0.7em] shrink-0" />}
                    burstIcon="RiMagicFill"
                    hoverRotate={3}
                    className="bg-amber-100 text-amber-800 ring-amber-200/80 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-400/20"
                  >
                    human
                  </HeroBadge>{" "}
                  <span className="text-muted-foreground/50">and</span>{" "}
                  <HeroBadge
                    icon={<RiHeartFill className="size-[0.7em] shrink-0" />}
                    burstIcon="RiHeartFill"
                    hoverRotate={-2}
                    className="bg-rose-100 text-rose-700 ring-rose-200/80 dark:bg-rose-500/15 dark:text-rose-300 dark:ring-rose-400/20"
                  >
                    cared for
                  </HeroBadge>
                  <span className="text-foreground">.</span>
                </h1>
                <p className="max-w-[52ch] text-base text-pretty text-muted-foreground md:text-lg">
                  Most recently at Merlin AI, I&apos;ve been working across
                  building browser agent extension and merlin&apos;s chat
                  interface.
                </p>
              </div>
            </div>

            <div
              className="animate-fade-up flex flex-wrap items-center gap-x-6 gap-y-2 text-sm"
              style={{ animationDelay: "200ms" }}
            >
              <Link href={siteLinks.primaryCta.href} className="font-medium">
                {siteLinks.primaryCta.label}
              </Link>
              <Link href={siteLinks.resume.href}>{siteLinks.resume.label}</Link>
              <Link href={siteLinks.github.href}>{siteLinks.github.label}</Link>
            </div>

            <HeroStats />
          </div>

          <div
            className="animate-fade-up grid gap-4"
            style={{ animationDelay: "400ms" }}
          >
            <div className="grid gap-8">
              <div className="grid gap-4">
                <p className="text-sm text-muted-foreground">
                  Where I&apos;m headed
                </p>
                <h2 className="max-w-[24ch] text-3xl font-semibold tracking-tight text-balance md:text-4xl">
                  Toward design engineering, where{" "}
                  <RoughNote
                    type="underline"
                    color="currentColor"
                    strokeWidth={2}
                    padding={2}
                    animationDuration={500}
                    iterations={1}
                  >
                    craft and code
                  </RoughNote>{" "}
                  meet at the surface.
                </h2>
                <p className="max-w-[56ch] text-base text-pretty text-muted-foreground">
                  I started as a product engineer who kept caring{" "}
                  <RoughNote
                    type="crossed-off"
                    color="currentColor"
                    strokeWidth={1.5}
                    animationDuration={400}
                    iterations={1}
                  >
                    too much
                  </RoughNote>{" "}
                  about how things looked and moved. Now I&apos;m making that
                  the focus. I build agentic flows, design systems, and
                  interaction-heavy surfaces, and I&apos;m sharpening my design
                  intuition through close study of the people and work I admire,
                  with AI accelerating how fast I can ship polished work.
                </p>
                <FullSign className="h-12 w-auto sm:h-14" />
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
    </>
  )
}
