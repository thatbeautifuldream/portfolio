"use client"

import { TrendingDown, TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart"

type TWakatimeDay = {
  range: {
    text: string
    date: string
    timezone: string
  }
  grand_total: {
    text: string
    total_seconds: number
  }
}

type TDailyBreakdownChartProps = {
  data: TWakatimeDay[]
}

const chartConfig = {
  codingTime: {
    label: "Coding Time",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

const convertSecondsToHours = (seconds: number): number => {
  return Math.round((seconds / 3600) * 100) / 100
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

const formatWeekday = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { weekday: "short" })
}

const calculatePercentageChange = (data: TWakatimeDay[]) => {
  if (data.length < 2) {
    return null
  }

  const today = data.at(-1)
  const yesterday = data.at(-2)

  const todaySeconds = today?.grand_total.total_seconds ?? 0
  const yesterdaySeconds = yesterday?.grand_total.total_seconds ?? 0

  if (todaySeconds === 0 && yesterdaySeconds === 0) {
    return null
  }

  if (yesterdaySeconds === 0 && todaySeconds > 0) {
    return { value: 100, isIncrease: true }
  }

  if (todaySeconds === 0 && yesterdaySeconds > 0) {
    return { value: 100, isIncrease: false }
  }

  const change = ((todaySeconds - yesterdaySeconds) / yesterdaySeconds) * 100
  return {
    value: Math.abs(Math.round(change * 10) / 10),
    isIncrease: change > 0,
  }
}

export function DailyBreakdownChart({ data }: TDailyBreakdownChartProps) {
  const chartData = data.map((day) => ({
    date: formatDate(day.range.date),
    weekday: formatWeekday(day.range.date),
    codingTime: convertSecondsToHours(day.grand_total.total_seconds),
    originalData: day,
  }))

  const percentageChange = calculatePercentageChange(data)

  return (
    <div>
      <div className="flex items-center gap-2 pb-2">
        <h3 className="text-sm font-medium text-muted-foreground">
          Daily Coding Activity
        </h3>
        {percentageChange && (
          <span
            className={`inline-flex items-center gap-1 rounded-md border-none px-1.5 py-0.5 text-xs font-medium ${
              percentageChange.isIncrease
                ? "bg-emerald-500/10 text-emerald-500"
                : "bg-destructive/10 text-destructive"
            }`}
          >
            {percentageChange.isIncrease ? (
              <TrendingUp className="size-3.5" />
            ) : (
              <TrendingDown className="size-3.5" />
            )}
            {percentageChange.value}%
          </span>
        )}
      </div>
      <p className="pb-4 text-sm text-muted-foreground/60">
        From the last {data.length} days
      </p>
      <ChartContainer config={chartConfig}>
        <LineChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: -28,
            right: 12,
            top: 12,
            bottom: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            axisLine={false}
            dataKey="weekday"
            tickFormatter={(value) => value}
            tickLine={false}
            tickMargin={8}
          />
          <YAxis
            axisLine={false}
            tickFormatter={(value) => `${value}h`}
            tickLine={false}
            tickMargin={8}
          />
          <ChartTooltip
            content={({ active, payload }) => {
              if (!(active && payload?.length)) {
                return null
              }

              const firstPayload = payload[0]
              const originalData = firstPayload?.payload?.originalData

              if (!originalData) {
                return null
              }

              return (
                <div className="grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
                  <div className="font-medium">{originalData.range.text}</div>
                  <div className="grid gap-1.5">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2.5 w-2.5 rounded-[2px]"
                        style={{ backgroundColor: "var(--chart-1)" }}
                      />
                      <span className="text-muted-foreground">Coding Time</span>
                      <span className="ml-auto font-mono font-medium text-foreground tabular-nums">
                        ({originalData.grand_total.text})
                      </span>
                    </div>
                  </div>
                </div>
              )
            }}
            cursor={false}
          />
          <Line
            dataKey="codingTime"
            dot={false}
            filter="url(#rainbow-line-glow)"
            stroke="var(--chart-1)"
            strokeWidth={2}
            type="monotone"
          />
          <defs>
            <filter
              height="140%"
              id="rainbow-line-glow"
              width="140%"
              x="-20%"
              y="-20%"
            >
              <feGaussianBlur result="blur" stdDeviation="10" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
        </LineChart>
      </ChartContainer>
    </div>
  )
}
