import { Section } from "@/components/section"

export type TWakatimeStatsCard = {
  title: string
  value: string
  description: string
  delay: number
}

export function WakatimeStatsCard({
  title,
  value,
  description,
  delay,
}: TWakatimeStatsCard) {
  return (
    <Section delay={delay}>
      <div className="flex flex-col space-y-2 rounded-lg border bg-card p-4 shadow-sm">
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        <p className="text-2xl font-semibold text-foreground tabular-nums">
          {value}
        </p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Section>
  )
}
