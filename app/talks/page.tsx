import Link from "next/link"

import { talks, contributions } from "@/lib/portfolio-data"
import { Section } from "@/components/section"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Talks",
  description:
    "Talks about React, motion systems, interface architecture, and AI for frontend engineers. It of a useful forcing function for making opinions legible.",
  canonical: "https://milindmishra.com/talks",
  ogType: "talks",
})

export default function talksPage() {
  return (
    <main className="isolate">
      <section className="section-shell">
        <div className="section-inner grid gap-12">
          <Section delay={0.1}>
            <div className="grid gap-4">
              <p className="text-sm text-muted-foreground">Talks</p>
              <h1 className="max-w-[24ch] text-3xl font-semibold tracking-tight text-balance md:text-5xl">
                Thinking in public helps sharpen the product and interface work
              </h1>
            </div>
          </Section>

          <div className="grid gap-8">
            {talks.map((talk, index) => (
              <Section key={talk.title} delay={0.15 + index * 0.05}>
                <div className="grid gap-2">
                  <p className="font-mono text-sm tracking-wide text-muted-foreground uppercase">
                    {talk.event} · {talk.date}
                  </p>
                  <h2 className="text-xl font-semibold tracking-tight">
                    {talk.title}
                  </h2>
                  <p className="max-w-[56ch] text-pretty text-muted-foreground">
                    {talk.description}
                  </p>
                  <Link href={talk.href} className="text-sm">
                    View talk
                  </Link>
                </div>
              </Section>
            ))}
          </div>

          <Section delay={0.3}>
            <div className="grid gap-4 pt-8">
              <p className="text-sm text-muted-foreground">Open source</p>
              <h2 className="max-w-[24ch] text-2xl font-semibold tracking-tight">
                A small but pointed trail of product-minded contributions
              </h2>
              <p className="max-w-[56ch] text-pretty text-muted-foreground">
                The contribution pattern is consistent with the rest of the
                work: polished affordances, stronger authoring ergonomics, and
                more useful interaction details.
              </p>
            </div>
          </Section>

          <div className="grid gap-6">
            {contributions.map((item, index) => (
              <Section key={item.title} delay={0.35 + index * 0.05}>
                <div className="grid gap-2">
                  <h3 className="text-lg font-semibold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-base text-muted-foreground">
                    {item.context}
                  </p>
                  <Link href={item.href} className="text-sm">
                    Open contribution
                  </Link>
                </div>
              </Section>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
