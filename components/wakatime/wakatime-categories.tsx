"use client"

import { useQuery } from "@tanstack/react-query"
import { Section } from "@/components/section"
import { fetchWakatime } from "@/lib/wakatime/api"
import type { TCategoriesResponse } from "@/lib/wakatime/types"
import {
  type TWakatimeStatsCard,
  WakatimeStatsCard,
} from "./wakatime-stats-card"

export function WakatimeCategories() {
  const categoriesQuery = useQuery({
    queryKey: ["wakatime", "categories"],
    queryFn: () => fetchWakatime<TCategoriesResponse>("categories"),
  })

  if (categoriesQuery.isPending) {
    return (
      <Section>
        <div className="space-y-4">
          <div className="p-6">
            <div className="flex items-center justify-center py-8">
              <div className="space-y-3 text-center">
                <p className="text-md text-muted-foreground">
                  <span className="animate-pulse">
                    Analyzing Milind&apos;s project categories...
                  </span>
                </p>
                <p className="text-xs text-muted-foreground/60">
                  Categorizing his coding adventures
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    )
  }

  if (categoriesQuery.error) {
    return (
      <Section>
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-lg border-destructive bg-destructive/10 p-4 transition-all hover:bg-destructive/20">
            <div className="flex items-center gap-2 text-sm text-destructive">
              <span>
                Oops! My category stats seem to have gone on a chai break.
              </span>
            </div>
          </div>
        </div>
      </Section>
    )
  }

  const data = categoriesQuery.data?.data
  if (!data || data.length === 0) {
    return null
  }

  const totalPercent = data.reduce((sum, category) => sum + category.percent, 0)
  const topCategory = data[0]

  const statCards: TWakatimeStatsCard[] = [
    {
      title: "Top Category",
      value: topCategory.name,
      description: `${topCategory.percent.toFixed(1)}%`,
      delay: 0.1,
    },
    {
      title: "Categories",
      value: data.length.toString(),
      description: "Different project types",
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
    <div className="flex flex-col space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {statCards.map((card) => (
          <WakatimeStatsCard key={card.title} {...card} />
        ))}
      </div>
      <div className="space-y-2">
        {data.map((category, index) => (
          <Section delay={0.35 + index * 0.06} key={category.name}>
            <div className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-accent/5">
              <div className="flex items-center gap-3">
                <div
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="font-medium text-foreground">
                  {category.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-28 rounded-full bg-secondary sm:w-40 md:w-56 lg:w-72">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${category.percent}%`,
                      backgroundColor: category.color,
                    }}
                  />
                </div>
                <span className="min-w-[3rem] text-right text-sm text-muted-foreground">
                  {category.percent.toFixed(1)}%
                </span>
              </div>
            </div>
          </Section>
        ))}
      </div>
    </div>
  )
}
