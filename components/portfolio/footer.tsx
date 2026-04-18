import {
  RiGithubFill,
  RiLinkedinBoxFill,
  RiTwitterXFill,
} from "@remixicon/react"

import { siteLinks } from "@/lib/portfolio-data"

const REPO_URL = "https://github.com/thatbeautifuldream/portfolio"

const socialLinks = [
  { href: siteLinks.github.href, icon: RiGithubFill, label: "GitHub" },
  { href: siteLinks.linkedin.href, icon: RiLinkedinBoxFill, label: "LinkedIn" },
  { href: siteLinks.x.href, icon: RiTwitterXFill, label: "X" },
]

export function Footer() {
  const sha = process.env.NEXT_PUBLIC_COMMIT_SHA
  const shortSha = sha?.slice(0, 7)

  return (
    <footer className="py-6">
      <div className="section-inner flex items-center justify-between">
        <div className="flex items-center gap-4">
          {socialLinks.map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-muted-foreground no-underline transition-colors hover:text-foreground"
            >
              <Icon className="size-4" />
            </a>
          ))}
        </div>

        {shortSha && (
          <a
            href={`${REPO_URL}/commit/${sha}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-muted-foreground no-underline transition-colors hover:text-foreground"
          >
            {shortSha}
          </a>
        )}
      </div>
    </footer>
  )
}
