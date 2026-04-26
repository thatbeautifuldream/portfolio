"use client"

import { useReducedMotion } from "motion/react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

import {
  HamburgerIcon,
  NavMenuPanel,
} from "@/components/portfolio/nav-menu-panel"
import { FullSign } from "@/components/portfolio/full-sign"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

export function Navigation() {
  const currentPathname = usePathname()
  const isInternalBlogPage =
    currentPathname && currentPathname.startsWith("/blog/")
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  if (isInternalBlogPage) {
    return null
  }

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[padding] duration-300",
        scrolled ? "px-4 pt-4 sm:px-6" : "px-0 pt-0"
      )}
    >
      <nav
        className={cn(
          "relative mx-auto flex max-w-3xl items-center justify-between px-4 py-3 transition-all duration-300 sm:px-6",
          scrolled
            ? "rounded-2xl bg-background/85 shadow-lg ring-1 ring-black/5 backdrop-blur-xl dark:shadow-none dark:ring-0 dark:inset-ring dark:inset-ring-white/5"
            : "bg-background/80 backdrop-blur-lg"
        )}
      >
        <div className="relative flex items-center">
          <Link
            className="no-underline hover:text-foreground"
            href="/"
            aria-label="Homepage"
          >
            <FullSign className="h-6 w-auto" />
          </Link>
        </div>

        <div className="relative z-10 flex items-center">
          <ThemeToggle variant="icon" />
          <button
            ref={triggerRef}
            type="button"
            aria-expanded={open}
            aria-haspopup="dialog"
            aria-label={open ? "Close menu" : "Open menu"}
            className="relative flex size-10 cursor-pointer items-center justify-center text-foreground"
            onClick={() => setOpen((prev) => !prev)}
          >
            <HamburgerIcon open={open} />
            <span
              className="absolute top-1/2 left-1/2 size-[max(100%,3rem)] -translate-x-1/2 -translate-y-1/2 pointer-fine:hidden"
              aria-hidden="true"
            />
          </button>
        </div>
      </nav>

      <NavMenuPanel
        open={open}
        onClose={() => setOpen(false)}
        triggerRef={triggerRef}
        scrolled={scrolled}
      />
    </header>
  )
}
