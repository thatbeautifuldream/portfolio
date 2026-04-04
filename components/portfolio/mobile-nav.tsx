"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/ui/theme-toggle"

const navItems = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/projects", label: "Projects" },
  { href: "/talks", label: "Talks" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
]

export function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-background">
      <div className="section-shell">
        <div className="section-inner">
          <div className="flex items-center justify-between gap-3 py-1.5">
            <Link
              className="text-lg font-semibold tracking-tight"
              href={
                pathname.startsWith("/blog/") && pathname !== "/blog"
                  ? "/blog"
                  : "/"
              }
            >
              {pathname.startsWith("/blog/") && pathname !== "/blog"
                ? "Blog"
                : "Milind"}
            </Link>

            <nav
              className="hidden items-center gap-6 lg:flex"
              aria-label="Desktop"
            >
              {navItems.map((item) => (
                <Link
                  className={cn(
                    "text-sm transition-colors",
                    pathname === item.href
                      ? "font-medium text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="hidden items-center lg:flex">
              <ThemeToggle />
            </div>

            <div className="flex items-center gap-4 lg:hidden">
              <button
                aria-expanded={open}
                aria-label="Toggle navigation menu"
                className="text-sm"
                onClick={() => setOpen((value) => !value)}
                type="button"
              >
                Menu
              </button>
            </div>
          </div>

          <div
            className={cn(
              "overflow-hidden transition-[max-height,opacity] duration-200 lg:hidden",
              open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <nav aria-label="Mobile" className="grid gap-2 py-1.5">
              {navItems.map((item) => (
                <Link
                  className={cn(
                    "text-base transition-colors",
                    pathname === item.href
                      ? "font-medium text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  href={item.href}
                  key={item.href}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                className="text-base font-medium"
                href="https://cal.com/milind"
                onClick={() => setOpen(false)}
              >
                Book time
              </Link>
              <ThemeToggle className="text-left text-base" />
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}
