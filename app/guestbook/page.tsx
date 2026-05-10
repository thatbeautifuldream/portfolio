import { RoughNote } from "@/components/portfolio/rough-note"
import { createMetadata } from "@/lib/metadata"
import { Guestbook } from "@/components/guestbook"

export const metadata = createMetadata({
  title: "Guestbook",
  description: "Leave a message, a thought, or just say hello.",
  canonical: "https://milindmishra.com/guestbook",
  ogType: "home",
})

export default function GuestbookPage() {
  return (
    <main className="isolate">
      <section className="section-shell">
        <div className="section-inner grid gap-16">
          <div
            className="animate-fade-up grid gap-4"
            style={{ animationDelay: "100ms" }}
          >
            <p className="text-sm text-muted-foreground">Guestbook</p>
            <h1 className="max-w-[28ch] text-3xl font-semibold tracking-tight text-balance md:text-5xl">
              Leave a note,{" "}
              <RoughNote
                type="box"
                color="currentColor"
                strokeWidth={1.5}
                padding={4}
                animationDuration={500}
                iterations={1}
              >
                say hello
              </RoughNote>
              , or share a thought.
            </h1>
            <p className="max-w-[56ch] text-base text-pretty text-muted-foreground">
              Whatever brought you here, I&apos;d like to hear about it. Entries
              are public and stick around.
            </p>
          </div>

          <Guestbook />
        </div>
      </section>
    </main>
  )
}
