import Link from "next/link"

import { Separator } from "@/components/ui/separator"
import { talks, contributions } from "@/lib/portfolio-data"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Talks",
  description:
    "Talks on React, motion systems, interface architecture, and AI for frontend engineers.",
  canonical: "https://milindmishra.com/talks",
  ogType: "talks",
})

export default function talksPage() {
  return (
    <main className="isolate">
      <section className="section-shell">
        <div className="section-inner grid gap-12">
          <div className="animate-fade-up grid gap-4 delay-100">
            <p className="text-sm text-muted-foreground">Talks</p>
            <h1 className="max-w-[24ch] text-3xl font-semibold tracking-tight text-balance md:text-5xl">
              I share what I learn because it forces me to learn it deeper.
            </h1>
            <p className="max-w-[56ch] text-pretty text-muted-foreground">
              These talks come from things I ran into firsthand and
              couldn&apos;t stop thinking about. Sharing them publicly keeps me
              honest, helps others experiment sooner, and sharpens my own
              understanding in a way that building alone never could.
            </p>
          </div>

          <div className="grid gap-8">
            {talks.map((talk, index) => (
              <div
                key={talk.title}
                className="animate-fade-up grid gap-2 [animation-delay:calc(200ms_+_var(--i)_*_80ms)]"
                style={{ "--i": index } as React.CSSProperties}
              >
                <p className="font-mono text-sm tracking-wide text-muted-foreground uppercase">
                  {talk.event} · {talk.date}
                </p>
                <h2 className="text-xl font-semibold tracking-tight">
                  {talk.title}
                </h2>
                <p className="max-w-[56ch] text-base text-pretty text-muted-foreground">
                  {talk.description}
                </p>
                <Link href={talk.href} className="text-sm">
                  View talk
                </Link>
              </div>
            ))}
          </div>

          <Separator />

          <div className="animate-fade-up grid gap-4 delay-[440ms]">
            <p className="text-sm text-muted-foreground">Open source</p>
            <h2 className="max-w-[24ch] text-2xl font-semibold tracking-tight">
              Contributions that started as problems I hit at work.
            </h2>
            <p className="max-w-[56ch] text-base text-pretty text-muted-foreground">
              While building AI chat interfaces at Merlin, the core challenge
              was rendering streamed markdown responses cleanly. That led me to
              Streamdown, Vercel&apos;s open source markdown renderer built for
              AI streaming. These contributions came from real product gaps, not
              side quests.
            </p>
          </div>

          <div className="grid gap-6">
            {contributions.map((item, index) => (
              <div
                key={item.title}
                className="animate-fade-up grid gap-2 [animation-delay:calc(520ms_+_var(--i)_*_80ms)]"
                style={{ "--i": index } as React.CSSProperties}
              >
                <h3 className="text-lg font-semibold tracking-tight">
                  {item.title}
                </h3>
                <p className="max-w-[56ch] text-base text-pretty text-muted-foreground">
                  {item.context}
                </p>
                <Link href={item.href} className="text-sm">
                  Open contribution
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
