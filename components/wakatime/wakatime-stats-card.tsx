import { Section } from "@/components/section"
import { cn } from "@/lib/utils"

export type TWakatimeStatsCard = {
  title: string
  value: string
  description: string
  delay: number
}

export function WakatimeStatsRow({ stats }: { stats: TWakatimeStatsCard[] }) {
  return (
    <Section delay={stats[0]?.delay ?? 0}>
      <div className="grid grid-cols-1 divide-y divide-border/50 px-3 md:grid-cols-3 md:divide-x md:divide-y-0">
        {stats.map((stat, index) => (
          <div
            key={stat.title}
            className={cn(
              "py-4 md:py-5",
              index === 0 && "pt-0 md:pt-5 md:pr-8",
              index === stats.length - 1 && "pb-0 md:pb-5 md:pl-8",
              index > 0 && index < stats.length - 1 && "md:px-4"
            )}
          >
            <p className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </p>
            <p className="mt-1.5 text-3xl font-semibold tracking-tight tabular-nums">
              {stat.value}
            </p>
            <p className="mt-1 text-sm text-muted-foreground/60">
              {stat.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  )
}
