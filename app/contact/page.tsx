import Link from "next/link"

import { contactLinks, siteLinks } from "@/lib/portfolio-data"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Contact",
  description: "Get in touch: email, GitHub, LinkedIn, or book a time.",
  canonical: "https://milindmishra.com/contact",
  ogType: "contact",
})

export default function contactPage() {
  return (
    <main className="isolate">
      <section className="section-shell">
        <div className="section-inner grid gap-12">
          <div className="animate-fade-up grid gap-4 delay-100">
            <p className="text-sm text-muted-foreground">Contact</p>
            <h1 className="max-w-[28ch] text-3xl font-semibold tracking-tight text-balance md:text-5xl">
              If the work needs product judgment and implementation discipline, I'd like to hear about it.
            </h1>
          </div>

          <div className="grid gap-6">
            {contactLinks.map((link, index) => (
              <div
                key={link.label}
                className="animate-fade-up grid gap-4"
                style={{ animationDelay: `${150 + index * 50}ms` }}
              >
                <div className="grid gap-1">
                  <p className="text-lg font-semibold">{link.label}</p>
                  <p className="text-base text-muted-foreground">{link.copy}</p>
                </div>
                <Link
                  href={link.href}
                  className="text-sm font-medium transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </div>
            ))}
          </div>

          <div className="animate-fade-up flex flex-wrap items-center gap-x-6 gap-y-2 text-sm delay-350">
            <Link href={siteLinks.primaryCta.href} className="font-medium">
              {siteLinks.primaryCta.label}
            </Link>
            <Link href="mailto:milindmishra.work@gmail.com">
              milindmishra.work@gmail.com
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
