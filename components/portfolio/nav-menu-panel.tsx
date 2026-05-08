"use client"

import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useSyncExternalStore } from "react"
import { createPortal } from "react-dom"

import { Sign } from "@/components/portfolio/sign"
import { cn } from "@/lib/utils"

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/projects", label: "Projects" },
  { href: "/talks", label: "Talks" },
  { href: "/wakatime", label: "Wakatime" },
  { href: "/spotify", label: "Spotify" },
  { href: "/guestbook", label: "Guestbook" },
  { href: "/blog", label: "Blog" },
  { href: "/gist", label: "Gist" },
  { href: "/tweets", label: "Tweets" },
  { href: "/contact", label: "Contact" },
]

export function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <div className="relative size-4">
      <span
        className={cn(
          "absolute left-0 block h-0.5 w-4 bg-current transition-all duration-150",
          open ? "top-[0.4rem] -rotate-45" : "top-1"
        )}
      />
      <span
        className={cn(
          "absolute left-0 block h-0.5 w-4 bg-current transition-all duration-150",
          open ? "top-[0.4rem] rotate-45" : "top-2.5"
        )}
      />
    </div>
  )
}

function NavItem({
  href,
  label,
  isActive,
  onClick,
}: {
  href: string
  label: string
  isActive: boolean
  onClick?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group relative block text-2xl font-medium no-underline transition-colors duration-200 ease-out",
        isActive
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      <span className="relative inline-block transition-transform duration-200 ease-out group-hover:translate-x-5 before:absolute before:top-1/2 before:-left-5 before:size-1.5 before:-translate-y-1/2 before:scale-0 before:rounded-full before:bg-foreground before:opacity-0 before:transition before:duration-200 before:ease-out before:content-[''] group-hover:before:scale-100 group-hover:before:opacity-100">
        {label}
      </span>
    </Link>
  )
}

type NavMenuPanelProps = {
  open: boolean
  onClose: () => void
  triggerRef: React.RefObject<HTMLElement | null>
  scrolled?: boolean
  logoHref?: string
  logoLabel?: string
}

const subscribe = () => () => {}
const getClientSnapshot = () => true
const getServerSnapshot = () => false

export function NavMenuPanel({
  open,
  onClose,
  triggerRef,
  scrolled = false,
  logoHref = "/",
  logoLabel = "Homepage",
}: NavMenuPanelProps) {
  const pathname = usePathname()
  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  )
  const panelRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

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
        onClose()
      }
    }
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    document.addEventListener("mousedown", onPointerDown)
    document.addEventListener("keydown", onEscape)
    return () => {
      document.body.style.overflow = prevBody
      document.documentElement.style.overflow = prevHtml
      document.removeEventListener("mousedown", onPointerDown)
      document.removeEventListener("keydown", onEscape)
    }
  }, [open, onClose, triggerRef])

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

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-120">
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

          <div
            className="fixed inset-0 overflow-y-auto"
            ref={panelRef}
            role="dialog"
          >
            <div className="flex min-h-dvh flex-col">
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
                    onClick={onClose}
                  >
                    <Sign className="h-5 w-auto" />
                  </Link>
                  <button
                    type="button"
                    aria-label="Close menu"
                    className="relative flex size-10 cursor-pointer items-center justify-center text-foreground"
                    onClick={onClose}
                  >
                    <HamburgerIcon open={true} />
                    <span
                      className="absolute top-1/2 left-1/2 size-[max(100%,3rem)] -translate-x-1/2 -translate-y-1/2 pointer-fine:hidden"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>

              <div
                className={cn(
                  "mx-auto flex w-full max-w-3xl flex-col gap-3 px-4 pt-6 sm:px-6",
                  scrolled && "px-8 sm:px-10"
                )}
              >
                {navItems.map(({ href, label }, index) => (
                  <motion.div key={href} {...getLinkMotion(index)}>
                    <NavItem
                      href={href}
                      label={label}
                      isActive={
                        href === "/"
                          ? pathname === "/"
                          : pathname.startsWith(href)
                      }
                      onClick={onClose}
                    />
                  </motion.div>
                ))}
                <motion.div {...getLinkMotion(navItems.length)}>
                  <Link
                    className="group relative block text-2xl font-medium text-muted-foreground no-underline transition-colors duration-200 ease-out hover:text-foreground"
                    href="https://cal.com/milind"
                    onClick={onClose}
                  >
                    <span className="relative inline-block transition-transform duration-200 ease-out group-hover:translate-x-5 before:absolute before:top-1/2 before:-left-5 before:size-1.5 before:-translate-y-1/2 before:scale-0 before:rounded-full before:bg-foreground before:opacity-0 before:transition before:duration-200 before:ease-out before:content-[''] group-hover:before:scale-100 group-hover:before:opacity-100">
                      Book time
                    </span>
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
}
