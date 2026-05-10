import { RoughNote } from "@/components/portfolio/rough-note"
import { createMetadata } from "@/lib/metadata"
import { SpotifyNowPlaying } from "@/components/spotify-now-playing"
import { SpotifyTopTracks } from "@/components/spotify-top-tracks"

export const metadata = createMetadata({
  title: "Spotify",
  description: "What I am listening to on Spotify.",
  ogType: "home",
})

export default function SpotifyPage() {
  return (
    <main className="isolate">
      <section className="section-shell">
        <div className="section-inner grid gap-12">
          <div
            className="animate-fade-up grid gap-4"
            style={{ animationDelay: "100ms" }}
          >
            <p className="text-sm text-muted-foreground">Spotify</p>
            <h1 className="max-w-[24ch] text-3xl font-semibold tracking-tight text-balance md:text-5xl">
              What I am listening to{" "}
              <RoughNote
                type="underline"
                color="currentColor"
                strokeWidth={2}
                padding={2}
                animationDuration={400}
                iterations={1}
              >
                right now
              </RoughNote>
              .
            </h1>
          </div>

          <div
            className="animate-fade-up flex flex-col gap-8"
            style={{ animationDelay: "200ms" }}
          >
            <SpotifyNowPlaying />
            <SpotifyTopTracks />
          </div>
        </div>
      </section>
    </main>
  )
}