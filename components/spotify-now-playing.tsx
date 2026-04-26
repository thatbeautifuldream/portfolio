"use client"

import { orpc } from "@/lib/orpc"
import { useQuery } from "@tanstack/react-query"
import { RiExternalLinkLine } from "@remixicon/react"

export function SpotifyNowPlaying() {
  const { data, isLoading, error } = useQuery({
    ...orpc.spotify["currently-playing"].queryOptions({}),
    refetchInterval: 30_000,
    refetchIntervalInBackground: false,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  })

  if (isLoading) {
    return null
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <span className="font-semibold text-foreground">Now Playing</span>
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          Unable to load current track.
        </div>
      </div>
    )
  }

  if (!data?.isPlaying || !data.track) {
    return (
      <div className="flex flex-col gap-4">
        <span className="font-semibold text-foreground">Now Playing</span>
        <div className="flex items-center gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-muted">
            <span className="text-muted-foreground text-lg">&#9835;</span>
          </div>
          <div>
            <p className="font-semibold text-foreground">Not playing right now</p>
            <p className="text-muted-foreground text-sm">Check back later to see what I am listening to.</p>
          </div>
        </div>
      </div>
    )
  }

  const { track } = data

  return (
    <div className="flex flex-col gap-4">
      <span className="font-semibold text-foreground">Now Playing</span>

      <div className="flex items-center gap-5">
        {track.album?.image && (
          <img
            alt=""
            className="size-20 shrink-0 rounded-lg object-cover outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10"
            height={80}
            src={track.album.image}
            width={80}
          />
        )}

        <div className="min-w-0 flex-1">
          <a
            className="block truncate text-foreground text-lg font-semibold no-underline hover:text-muted-foreground"
            href={track.url}
            rel="noopener noreferrer"
            target="_blank"
          >
            {track.name}
          </a>
          <p className="truncate text-muted-foreground text-sm">
            {track.artists.map((a) => a.name).join(", ")}
          </p>
          <p className="truncate text-muted-foreground text-xs">
            {track.album.name}
          </p>
        </div>

        <a
          className="shrink-0 text-muted-foreground no-underline hover:text-foreground"
          href={track.url}
          rel="noopener noreferrer"
          target="_blank"
          aria-label="Open in Spotify"
        >
          <RiExternalLinkLine className="size-4" />
        </a>
      </div>
    </div>
  )
}