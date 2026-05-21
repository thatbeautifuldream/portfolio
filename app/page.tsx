import Image from "next/image"
import Link from "next/link"

import { FullSign } from "@/components/portfolio/full-sign"
import { HeroStats } from "@/components/portfolio/hero-stats"
import { RoughNote } from "@/components/portfolio/rough-note"
import { SelectedWork } from "@/components/portfolio/selected-work"
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
                    Bengaluru, India. Design engineer.
                  </p>
                  <h1 className="max-w-[22ch] text-4xl leading-[1.25] font-semibold tracking-tight text-balance select-none md:text-6xl md:leading-[1.2]">
                    <span className="text-muted-foreground/40">Hi,</span>{" "}
                    <Image
                      src="/emojis/waving-hand.webp"
                      alt="Waving hand"
                      width={48}
                      height={48}
                      className="inline-block size-[0.85em] translate-y-[-0.05em] align-middle"
                    />{" "}
                    <span className="text-muted-foreground/40">I&apos;m</span>{" "}
                    <Image
                      src="/icons/icon.png"
                      alt="Milind"
                      width={96}
                      height={96}
                      className="inline-block size-[0.9em] translate-y-[-0.05em] rounded-full object-cover align-middle ring-1 ring-border/70 dark:ring-white/10"
                      priority
                    />{" "}
                    <span className="text-foreground">Milind.</span>{" "}
                    <span className="text-muted-foreground/40">I&apos;m a</span>{" "}
                    <span className="text-foreground">design engineer</span>{" "}
                    <span className="text-muted-foreground/40">at</span>{" "}
                    <Image
                      src="/emojis/merlin.webp"
                      alt="Merlin AI"
                      width={96}
                      height={96}
                      className="inline-block size-[0.85em] translate-y-[-0.05em] cursor-pointer rounded-[0.2em] object-cover align-middle ring-1 ring-border/70 transition-transform duration-300 ease-out hover:-rotate-[15deg] dark:ring-white/10"
                    />{" "}
                    <span className="text-foreground">Merlin AI.</span>
                  </h1>
                  <p className="max-w-[52ch] text-base text-pretty text-muted-foreground md:text-lg">
                    Working across the browser agent extension and Merlin&apos;s
                    chat interface, where ambient AI meets everyday workflows.
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
                <Link href={siteLinks.resume.href}>
                  {siteLinks.resume.label}
                </Link>
                <Link href={siteLinks.github.href}>
                  {siteLinks.github.label}
                </Link>
              </div>

              <div
                className="animate-fade-up"
                style={{ animationDelay: "300ms" }}
              >
                <SelectedWork />
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
                    interaction-heavy surfaces, and I&apos;m sharpening my
                    design intuition through close study of the people and work
                    I admire, with AI accelerating how fast I can ship polished
                    work.
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
