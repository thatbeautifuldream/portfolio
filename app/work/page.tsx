import { RoughNote } from "@/components/portfolio/rough-note"
import { roles } from "@/lib/portfolio-data"
import { createMetadata } from "@/lib/metadata"
import { JsonLd } from "@/components/json-ld"

export const metadata = createMetadata({
  title: "Work",
  description:
    "Work across startup environments. Different products and teams, but a consistent pull toward the surfaces people touch and the craft behind them.",
  canonical: "https://milindmishra.com/work",
  ogType: "work",
})

const workSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Work Experience — Milind Kumar Mishra",
  description:
    "Work across startup environments. Different products and teams, but a consistent pull toward the surfaces people touch and the craft behind them.",
  url: "https://milindmishra.com/work",
  author: {
    "@type": "Person",
    name: "Milind Kumar Mishra",
    url: "https://milindmishra.com",
  },
  hasPart: roles.map((role) => ({
    "@type": "OrganizationRole",
    roleName: role.role,
    worksFor: {
      "@type": "Organization",
      name: role.company,
    },
  })),
}

export default function WorkPage() {
  return (
    <>
      <JsonLd data={workSchema} />
      <main className="isolate">
      <section className="section-shell">
        <div className="section-inner grid gap-12">
          <div
            className="animate-fade-up grid gap-4"
            style={{ animationDelay: "100ms" }}
          >
            <p className="text-sm text-muted-foreground">Selected work</p>
            <h1 className="max-w-[28ch] text-3xl font-semibold tracking-tight text-balance md:text-5xl">
              Product and AI work across startup environments.
            </h1>
            <p className="max-w-[56ch] text-base text-pretty text-muted-foreground md:text-lg">
              Different products and teams, but a consistent pull toward the{" "}
              <RoughNote
                type="underline"
                color="currentColor"
                strokeWidth={2}
                padding={2}
                animationDuration={500}
                iterations={1}
              >
                surfaces people touch
              </RoughNote>{" "}
              and the craft behind them. I&apos;m still sharpening that
              instinct, and honestly, that&apos;s what keeps the work alive for
              me.
            </p>
          </div>

          <div
            className="animate-fade-up grid gap-4"
            style={{ animationDelay: "200ms" }}
          >
            <h2 className="max-w-[24ch] text-2xl font-semibold tracking-tight md:text-3xl">
              How I approach product work
            </h2>
            <p className="max-w-[56ch] text-base text-pretty text-muted-foreground">
              I care most about the surfaces people actually touch. Good product
              engineering means understanding not just the code, but how users
              move through a system and where their mental models break down.
            </p>
          </div>

          <div className="grid gap-12">
            {roles.map((role, index) => (
              <article
                key={`${role.company}-${role.period}`}
                className="animate-fade-up grid gap-4"
                style={{ animationDelay: `${300 + index * 80}ms` }}
              >
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
                <ul role="list" className="grid max-w-[56ch] gap-3">
                  {role.highlights.map((highlight) => (
                    <li
                      className="text-base text-pretty text-muted-foreground before:mr-2 before:text-muted-foreground/50 before:content-['–']"
                      key={highlight}
                    >
                      {highlight}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>
      </main>
    </>
  )
}
