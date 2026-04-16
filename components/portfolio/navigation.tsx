"use client"

import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "motion/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

import { cn } from "@/lib/utils"
import { Sign } from "@/components/portfolio/sign"
import { ThemeToggle } from "@/components/ui/theme-toggle"

const navItems = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/projects", label: "Projects" },
  { href: "/talks", label: "Talks" },
  { href: "/wakatime", label: "Wakatime" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
]

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <div className="relative size-4">
      <span
        className={cn(
          "absolute left-0 block h-0.5 w-4 bg-foreground transition-all duration-150",
          open ? "top-[0.4rem] -rotate-45" : "top-1"
        )}
      />
      <span
        className={cn(
          "absolute left-0 block h-0.5 w-4 bg-foreground transition-all duration-150",
          open ? "top-[0.4rem] rotate-45" : "top-2.5"
        )}
      />
    </div>
  )
}

export function Navigation() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  const isBlogArticle = pathname.startsWith("/blog/") && pathname !== "/blog"
  const logoHref = isBlogArticle ? "/blog" : "/"
  const logoLabel = isBlogArticle ? "Blog" : "Milind"
  const navTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const }

  useEffect(() => setMounted(true), [])
  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const prevBody = document.body.style.overflow
    const prevHtml = document.documentElement.style.overflow
    document.body.style.overflow = "hidden"
    document.documentElement.style.overflow = "hidden"

    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        !triggerRef.current?.contains(target) &&
        !panelRef.current?.contains(target)
      ) {
        setOpen(false)
      }
    }
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }

    document.addEventListener("mousedown", onPointerDown)
    document.addEventListener("keydown", onEscape)
    return () => {
      document.body.style.overflow = prevBody
      document.documentElement.style.overflow = prevHtml
      document.removeEventListener("mousedown", onPointerDown)
      document.removeEventListener("keydown", onEscape)
    }
  }, [open])

  const getLinkMotion = (index: number) => {
    if (shouldReduceMotion) {
      return {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 1 },
      }
    }
    return {
      initial: { filter: "blur(4px)", translateY: -10, opacity: 0 },
      animate: {
        filter: "blur(0px)",
        translateY: 0,
        opacity: 1,
        transition: {
          delay: 0.02 + index * 0.035,
          duration: 0.16,
          ease: [0.25, 0.1, 0.25, 1] as const,
        },
      },
      exit: {
        filter: "blur(4px)",
        translateY: -10,
        opacity: 0,
        transition: { duration: 0.1 },
      },
    }
  }

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[padding] duration-300",
        scrolled ? "px-4 pt-4 sm:px-6" : "px-0 pt-0"
      )}
    >
      <LayoutGroup>
        <nav
          className={cn(
            "relative mx-auto flex max-w-3xl items-center justify-between px-4 py-3 transition-all duration-300 sm:px-6",
            scrolled
              ? "rounded-2xl bg-background/85 shadow-lg ring-1 ring-black/5 backdrop-blur-xl dark:shadow-none dark:ring-0 dark:inset-ring dark:inset-ring-white/5"
              : "bg-background/80 backdrop-blur-lg"
          )}
        >
          {/* Left slot */}
          <div className="relative flex items-center">
            <AnimatePresence initial={false} mode="popLayout">
              {isBlogArticle ? (
                <motion.div
                  key="blog-label"
                  initial={{ opacity: 0, filter: "blur(4px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(4px)" }}
                  transition={navTransition}
                >
                  <Link
                    className="text-sm font-medium text-muted-foreground no-underline transition-colors hover:text-foreground"
                    href="/blog"
                  >
                    Blog
                  </Link>
                </motion.div>
              ) : (
                <motion.div key="logo-left">
                  <Link
                    className="no-underline hover:text-foreground"
                    href="/"
                    aria-label="Home"
                  >
                    <motion.div layoutId="nav-logo" transition={navTransition}>
                      <Sign className="h-5 w-auto" />
                    </motion.div>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Center slot — logo when on blog article */}
          {isBlogArticle && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <Link
                className="pointer-events-auto no-underline hover:text-foreground"
                href="/"
                aria-label="Home"
              >
                <motion.div layoutId="nav-logo" transition={navTransition}>
                  <Sign className="h-5 w-auto" />
                </motion.div>
              </Link>
            </div>
          )}

          {/* Right actions */}
          <div className="relative z-10 flex items-center">
            <ThemeToggle variant="icon" />
            <button
              ref={triggerRef}
              type="button"
              aria-expanded={open}
              aria-haspopup="dialog"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative flex size-10 items-center justify-center"
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
      </LayoutGroup>

      {/* Portal menu */}
      {mounted
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <div className="fixed inset-0 z-120">
                  {/* Backdrop */}
                  <motion.div
                    className="absolute inset-0 bg-background dark:bg-background/80 dark:backdrop-blur-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{
                      opacity: 0,
                      transition: {
                        duration: shouldReduceMotion ? 0 : 0.12,
                        delay: shouldReduceMotion ? 0 : 0.1,
                      },
                    }}
                  />

                  {/* Panel */}
                  <div
                    className="fixed inset-0 overflow-y-auto"
                    ref={panelRef}
                    role="dialog"
                  >
                    <div className="flex min-h-dvh flex-col">
                      {/* Mirror the navbar structure so logo + X align */}
                      <div
                        className={cn(
                          "transition-[padding] duration-300",
                          scrolled ? "px-4 pt-4 sm:px-6" : "px-0 pt-0"
                        )}
                      >
                        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6">
                          <Link
                            className="no-underline hover:text-foreground"
                            href={logoHref}
                            aria-label={logoLabel}
                            onClick={() => setOpen(false)}
                          >
                            <Sign className="h-5 w-auto" />
                          </Link>
                          <button
                            type="button"
                            aria-label="Close menu"
                            className="relative flex size-10 items-center justify-center"
                            onClick={() => setOpen(false)}
                          >
                            <HamburgerIcon open={true} />
                            <span
                              className="absolute top-1/2 left-1/2 size-[max(100%,3rem)] -translate-x-1/2 -translate-y-1/2 pointer-fine:hidden"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </div>

                      {/* Links */}
                      <div
                        className={cn(
                          "mx-auto flex w-full max-w-3xl flex-col gap-3 px-4 pt-6 sm:px-6",
                          scrolled && "px-8 sm:px-10"
                        )}
                      >
                        {navItems.map(({ href, label }, index) => (
                          <motion.div key={href} {...getLinkMotion(index)}>
                            <Link
                              href={href}
                              onClick={() => setOpen(false)}
                              className="text-2xl font-medium text-foreground no-underline hover:text-primary"
                            >
                              {label}
                            </Link>
                          </motion.div>
                        ))}
                        <motion.div {...getLinkMotion(navItems.length)}>
                          <Link
                            className="text-2xl font-medium text-foreground no-underline hover:text-primary"
                            href="https://cal.com/milind"
                            onClick={() => setOpen(false)}
                          >
                            Book time
                          </Link>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </AnimatePresence>,
            document.body
          )
        : null}
    </header>
  )
}
