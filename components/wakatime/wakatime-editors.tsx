"use client"

import { useQuery } from "@tanstack/react-query"
import { Section } from "@/components/section"
import { fetchWakatime } from "@/lib/wakatime/api"
import type { TEditorsResponse } from "@/lib/wakatime/types"
import {
  type TWakatimeStatsCard,
  WakatimeStatsRow,
} from "./wakatime-stats-card"

export function WakatimeEditors() {
  const editorsQuery = useQuery({
    queryKey: ["wakatime", "editors"],
    queryFn: () => fetchWakatime<TEditorsResponse>("editors"),
  })

  if (editorsQuery.isPending) {
    return (
      <Section>
        <div className="space-y-4">
          <div className="p-6">
            <div className="flex items-center justify-center py-8">
              <div className="space-y-3 text-center">
                <p className="text-md text-muted-foreground">
                  <span className="animate-pulse">
                    Analyzing Milind&apos;s editor preferences...
                  </span>
                </p>
                <p className="text-xs text-muted-foreground/60">
                  Counting keyboard shortcuts and extensions
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    )
  }

  if (editorsQuery.error) {
    return (
      <Section>
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-lg border-destructive bg-destructive/10 p-4 transition-all hover:bg-destructive/20">
            <div className="flex items-center gap-2 text-sm text-destructive">
              <span>
                Oops! My editor stats seem to have gone on a chai break.
              </span>
            </div>
          </div>
        </div>
      </Section>
    )
  }

  const data = editorsQuery.data?.data
  if (!data || data.length === 0) {
    return null
  }

  const totalPercent = data.reduce((sum, editor) => sum + editor.percent, 0)
  const topEditor = data[0]

  const statCards: TWakatimeStatsCard[] = [
    {
      title: "Favorite Editor",
      value: topEditor.name,
      description: `${topEditor.percent.toFixed(1)}%`,
      delay: 0.1,
    },
    {
      title: "Editors Used",
      value: data.length.toString(),
      description: "Different editors",
      delay: 0.2,
    },
    {
      title: "Coverage",
      value: `${totalPercent.toFixed(1)}%`,
      description: "Of tracked time",
      delay: 0.3,
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <WakatimeStatsRow stats={statCards} />
      <div className="divide-y divide-border/50 px-3">
        {data.map((editor, index) => (
          <Section delay={0.35 + index * 0.06} key={editor.name}>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div
                  className="size-4 rounded-full"
                  style={{ backgroundColor: editor.color }}
                />
                <span className="font-medium text-foreground">
                  {editor.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-28 rounded-full bg-secondary sm:w-40 md:w-56 lg:w-72">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${editor.percent}%`,
                      backgroundColor: editor.color,
                    }}
                  />
                </div>
                <span className="min-w-[3rem] text-right text-sm text-muted-foreground">
                  {editor.percent.toFixed(1)}%
                </span>
              </div>
            </div>
          </Section>
        ))}
      </div>
    </div>
  )
}
