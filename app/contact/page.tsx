import Link from "next/link"

import { contactLinks, siteLinks } from "@/lib/portfolio-data"
import { Section } from "@/components/section"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Contact",
  description: "Get in touch: email, GitHub, LinkedIn, or book a slot, time,",
  canonical: "https://milindmishra.com/contact",
  ogType: "contact",
})
export default function contactPage() {
  return (
    <main className="isolate">
      <section className="section-shell">
        <div className="section-inner grid gap-12">
          <Section delay={0.1}>
            <div className="grid gap-4">
              <p className="text-sm text-muted-foreground">Contact</p>
              <h1 className="max-w-[28ch] text-3xl font-semibold tracking-tight text-balance md:text-5xl">
                If the work needs product judgment and implementation
                discipline, here, reach me.
              </h1>
            </div>
          </Section>

          <div className="grid gap-6">
            {contactLinks.map((link, index) => (
              <Section key={link.label} delay={0.15 + index * 0.05}>
                <div className="grid gap-4">
                  <div className="grid gap-1">
                    <p className="text-lg font-semibold">{link.label}</p>
                    <p className="text-base text-muted-foreground">
                      {link.copy}
                    </p>
                  </div>
                  <Link
                    href={link.href}
                    className="text-sm font-medium transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </div>
              </Section>
            ))}
          </div>

          <Section
            delay={0.35}
            className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm"
          >
            <Link href={siteLinks.primaryCta.href} className="font-medium">
              {siteLinks.primaryCta.label}
            </Link>
            <Link href="mailto:milindmishra.work@gmail.com">
              milindmishra.work@gmail.com
            </Link>
          </Section>
        </div>
      </section>
    </main>
  )
}
