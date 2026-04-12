"use client"

import { useQuery } from "@tanstack/react-query"
import { Section } from "@/components/section"
import { DailyBreakdownChart } from "@/components/wakatime/daily-breakdown-chart"
import { dateFormatterLong } from "@/lib/date-formatters"
import { fetchWakatime } from "@/lib/wakatime/api"
import type { TCodingActivityResponse } from "@/lib/wakatime/types"
import {
  type TWakatimeStatsCard,
  WakatimeStatsRow,
} from "./wakatime-stats-card"

export function WakatimeCodingActivity() {
  const codingActivityQuery = useQuery({
    queryKey: ["wakatime", "coding-activity"],
    queryFn: () => fetchWakatime<TCodingActivityResponse>("coding-activity"),
  })

  if (codingActivityQuery.isPending) {
    return (
      <Section>
        <div className="space-y-4">
          <div className="p-6">
            <div className="flex items-center justify-center py-8">
              <div className="space-y-3 text-center">
                <p className="text-md text-muted-foreground">
                  <span className="animate-pulse">
                    Analyzing Milind&apos;s coding habits...
                  </span>
                </p>
                <p className="text-xs text-muted-foreground/60">
                  Counting how many times he has typed &quot;console.log&quot;
                  today
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    )
  }

  if (codingActivityQuery.error) {
    return (
      <Section>
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-lg border-destructive bg-destructive/10 p-4 transition-all hover:bg-destructive/20">
            <div className="flex items-center gap-2 text-sm text-destructive">
              <span>
                Oops! My coding stats seem to have gone on a chai break.
              </span>
            </div>
          </div>
        </div>
      </Section>
    )
  }

  const data = codingActivityQuery.data?.data
  if (!data || data.length === 0) {
    return null
  }

  const totalSeconds = data.reduce(
    (sum, day) => sum + day.grand_total.total_seconds,
    0
  )
  const totalHours = Math.floor(totalSeconds / 3600)
  const totalMinutes = Math.floor((totalSeconds % 3600) / 60)
  const totalText = `${totalHours}h ${totalMinutes}m`

  const dailyAverageSeconds = totalSeconds / data.length
  const dailyAverageHours = Math.floor(dailyAverageSeconds / 3600)
  const dailyAverageMinutes = Math.floor((dailyAverageSeconds % 3600) / 60)
  const dailyAverageText = `${dailyAverageHours}h ${dailyAverageMinutes}m`

  const mostActiveDay = data.reduce((max, day) =>
    day.grand_total.total_seconds > max.grand_total.total_seconds ? day : max
  )

  const statCards: TWakatimeStatsCard[] = [
    {
      title: "Total Time",
      value: totalText,
      description: "Over the period",
      delay: 0.1,
    },
    {
      title: "Daily Average",
      value: dailyAverageText,
      description: "Time per day",
      delay: 0.2,
    },
    {
      title: "Most Active Day",
      value: dateFormatterLong.format(new Date(mostActiveDay.range.date)),
      description: "Peak coding day",
      delay: 0.3,
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <WakatimeStatsRow stats={statCards} />
      <Section delay={0.4}>
        <div className="px-3">
          <DailyBreakdownChart data={data} />
        </div>
      </Section>
    </div>
  )
}
