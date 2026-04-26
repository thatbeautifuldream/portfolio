"use client"

import { orpc } from "@/lib/orpc"
import { useQuery } from "@tanstack/react-query"
import { RiExternalLinkLine } from "@remixicon/react"

export function SpotifyTopTracks() {
  const { data, isLoading, error } = useQuery({
    ...orpc.spotify["top-tracks"].queryOptions({}),
    staleTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  })

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">Top Tracks</span>
          <span className="text-xs text-muted-foreground">(All Time)</span>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-pulse text-sm text-muted-foreground">
            Curating top 5 tracks...
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <span className="font-semibold text-foreground">Top Tracks</span>
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          Spotify lost the beat. Top tracks not found.
        </div>
      </div>
    )
  }

  if (!data?.tracks?.length) {
    return null
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-foreground">Top Tracks</span>
        <span className="text-xs text-muted-foreground">(All Time)</span>
      </div>

      <div className="grid grid-cols-1 divide-y divide-border/40">
        {data.tracks.map((track, index) => (
          <a
            key={track.id}
            className="group flex items-center gap-5 py-5 no-underline first:pt-0 last:pb-0"
            href={track.url}
            rel="noopener noreferrer"
            target="_blank"
          >
            <div className="relative shrink-0">
              {track.album?.image ? (
                <img
                  alt=""
                  className="size-14 rounded-md object-cover outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10"
                  height={56}
                  src={track.album.image}
                  width={56}
                />
              ) : (
                <div className="flex size-14 items-center justify-center rounded-md bg-muted">
                  <span className="text-lg text-muted-foreground">&#9835;</span>
                </div>
              )}
              <span className="absolute -top-2 -left-2 flex size-6 items-center justify-center rounded-2xl bg-background/90 text-lg font-bold text-foreground tabular-nums shadow-sm ring-1 ring-border/40">
                {index + 1}
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground group-hover:text-muted-foreground">
                {track.name}
                {track.explicit && (
                  <span className="ml-1 text-xs font-medium text-muted-foreground">
                    E
                  </span>
                )}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {track.artists.map((a) => a.name).join(", ")}
              </p>
            </div>

            <span className="hidden shrink-0 text-xs text-muted-foreground tabular-nums sm:block">
              {track.popularity}%
            </span>

            <RiExternalLinkLine className="size-3.5 shrink-0 text-muted-foreground" />
          </a>
        ))}
      </div>
    </div>
  )
}
