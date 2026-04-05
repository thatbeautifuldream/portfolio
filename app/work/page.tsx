import { roles } from "@/lib/portfolio-data"
import { Section } from "@/components/section"

export const metadata = {
  title: "Work",
  description:
    "A recent run through product, AI, and high-velocity startup environments. These roles best explain what I optimize for now: shipping product-critical interfaces, improving workflow clarity, and making early systems resilient enough to grow.",
}

export default function WorkPage() {
  return (
    <main className="isolate">
      <section className="section-shell">
        <div className="section-inner grid gap-12">
          <Section delay={0.1}>
            <div className="grid gap-4">
              <p className="text-sm text-muted-foreground">Selected work</p>
              <h1 className="max-w-[28ch] text-3xl font-semibold tracking-tight text-balance md:text-5xl">
                A recent run through product, AI, and high-velocity startup
                environments.
              </h1>
              <p className="max-w-[56ch] text-base text-pretty text-muted-foreground md:text-lg">
                These roles best explain what I optimize for now: shipping
                product-critical interfaces, improving workflow clarity, and
                making early systems resilient enough to grow.
              </p>
            </div>
          </Section>

          <div className="grid gap-12">
            {roles.map((role, index) => (
              <Section key={`${role.company}-${role.period}`} delay={0.15 + index * 0.05}>
                <article className="grid gap-4">
                  <div className="grid gap-2">
                    <h2 className="text-2xl font-semibold tracking-tight">
                      {role.company}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {role.role} · {role.period} · {role.location}
                    </p>
                  </div>
                  <p className="max-w-[56ch] text-base text-pretty text-muted-foreground">
                    {role.summary}
                  </p>
                  <ul className="grid max-w-[56ch] gap-3">
                    {role.highlights.map((highlight) => (
                      <li
                        className="text-base text-pretty text-muted-foreground"
                        key={highlight}
                      >
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </article>
              </Section>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
