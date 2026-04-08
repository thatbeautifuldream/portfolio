import { createMetadata } from "@/lib/metadata"
import { Wakatime } from "@/components/wakatime/wakatime"

export const metadata = createMetadata({
  title: "Wakatime",
  description:
    "Milind's coding activity from Wakatime — languages, editors, and daily coding habits.",
  canonical: "https://milindmishra.com/wakatime",
  ogType: "home",
})

export default function WakatimePage() {
  return (
    <main className="isolate">
      <section className="section-shell">
        <div className="section-inner grid gap-12">
          <div className="animate-fade-up grid gap-4 delay-100">
            <h1 className="max-w-[28ch] text-3xl font-semibold tracking-tight md:text-5xl">
              Wakatime
            </h1>
            <p className="max-w-[56ch] text-base text-pretty text-muted-foreground md:text-lg">
              Milind&apos;s coding activity from Wakatime.
            </p>
          </div>
          <Wakatime />
        </div>
      </section>
    </main>
  )
}
