"use client"

import NumberFlow from "@number-flow/react"
import { RiArrowDownSLine } from "@remixicon/react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useCallback, useEffect, useRef, useState } from "react"

import type { Heading } from "@/lib/extract-headings"
import { cn } from "@/lib/utils"

type BlogIndexProps = {
  headings: Heading[]
  articleSelector?: string
}

const RING_RADIUS = 7
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

const EASE_OUT = [0.23, 1, 0.32, 1] as const
const layoutTransition = { duration: 0.22, ease: EASE_OUT }

export function BlogIndex({
  headings,
  articleSelector = "article",
}: BlogIndexProps) {
  const [expanded, setExpanded] = useState(false)
  const [progress, setProgress] = useState(0)
  const [activeId, setActiveId] = useState<string | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const pillRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (!expanded) return

    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node
      if (pillRef.current && !pillRef.current.contains(target)) {
        setExpanded(false)
      }
    }
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false)
    }

    document.addEventListener("mousedown", onPointerDown)
    document.addEventListener("keydown", onEscape)
    return () => {
      document.removeEventListener("mousedown", onPointerDown)
      document.removeEventListener("keydown", onEscape)
    }
  }, [expanded])

  const hasHeadings = headings.length > 0

  useEffect(() => {
    if (!hasHeadings) return
    const article = document.querySelector(articleSelector)
    if (!article) return

    const tag = () => {
      const nodes = article.querySelectorAll<HTMLElement>("h2, h3")
      const byText = new Map(headings.map((h) => [normalize(h.text), h]))
      const used = new Set<string>()
      let tagged = 0
      nodes.forEach((node) => {
        if (node.id) {
          tagged++
          return
        }
        const key = normalize(node.textContent ?? "")
        const match = byText.get(key)
        if (!match || used.has(match.id)) return
        node.id = match.id
        used.add(match.id)
        tagged++
      })
      return tagged >= headings.length
    }

    if (tag()) return

    const observer = new MutationObserver(() => {
      if (tag()) observer.disconnect()
    })
    observer.observe(article, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [headings, hasHeadings, articleSelector])

  useEffect(() => {
    let frame: number | null = null
    const compute = () => {
      frame = null
      const article = document.querySelector<HTMLElement>(articleSelector)
      if (!article) return
      const rect = article.getBoundingClientRect()
      const start = rect.top + window.scrollY
      const end = start + article.scrollHeight - window.innerHeight
      const range = Math.max(1, end - start)
      setProgress(clamp01((window.scrollY - start) / range))
    }
    const onScroll = () => {
      if (frame !== null) return
      frame = requestAnimationFrame(compute)
    }
    compute()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [articleSelector])

  useEffect(() => {
    if (!hasHeadings) return
    let stopped = false
    let observer: IntersectionObserver | null = null

    const setup = () => {
      if (stopped) return
      const nodes = headings
        .map((h) => document.getElementById(h.id))
        .filter((n): n is HTMLElement => Boolean(n))
      if (nodes.length !== headings.length) {
        requestAnimationFrame(setup)
        return
      }
      observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
          if (visible.length > 0) {
            setActiveId(visible[0].target.id)
          }
        },
        { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
      )
      nodes.forEach((n) => observer?.observe(n))
    }
    setup()
    return () => {
      stopped = true
      observer?.disconnect()
    }
  }, [headings, hasHeadings])

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: "smooth", block: "start" })
    setExpanded(false)
  }, [])

  const percent = Math.round(progress * 100)
  const dashOffset = RING_CIRCUMFERENCE * (1 - progress)

  const entrance = shouldReduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
    : {
        initial: { opacity: 0, y: -12, scale: 0.96 },
        animate: { opacity: 1, y: 0, scale: 1 },
      }

  return (
    <motion.div
      ref={pillRef}
      layout
      transition={shouldReduceMotion ? { duration: 0 } : layoutTransition}
      {...entrance}
      style={{ borderRadius: 22 }}
      className={cn(
        "fixed top-4 left-1/2 z-50 -translate-x-1/2",
        "w-[18rem] max-w-[calc(100vw-1.5rem)]",
        "overflow-hidden",
        "bg-gradient-to-b from-foreground/90 via-foreground/95 to-foreground",
        "text-background",
        "shadow-xl shadow-foreground/20",
        "ring-1 inset-ring-1 ring-foreground/20 inset-ring-background/10"
      )}
    >
      <motion.button
        layout="position"
        ref={triggerRef}
        type="button"
        onClick={() => hasHeadings && setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-label={expanded ? "Collapse index" : "Expand index"}
        className={cn(
          "flex w-full items-center gap-2 px-3 py-2 text-left",
          hasHeadings ? "cursor-pointer" : "cursor-default"
        )}
      >
        <motion.svg
          layout="position"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          aria-hidden="true"
          className="shrink-0"
        >
          <defs>
            <linearGradient id="ring-silver" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" style={{ stopColor: "var(--background)" }} />
              <stop
                offset="100%"
                style={{ stopColor: "var(--muted-foreground)" }}
              />
            </linearGradient>
          </defs>
          <circle
            cx="10"
            cy="10"
            r={RING_RADIUS}
            style={{ stroke: "var(--background)", strokeOpacity: 0.18 }}
            strokeWidth="2"
            fill="none"
          />
          <circle
            cx="10"
            cy="10"
            r={RING_RADIUS}
            stroke="url(#ring-silver)"
            strokeWidth="2"
            fill="none"
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform="rotate(-90 10 10)"
            style={{
              transition: shouldReduceMotion
                ? "none"
                : "stroke-dashoffset 0.2s linear",
            }}
          />
        </motion.svg>
        <motion.span layout="position" className="text-sm font-medium">
          Index
        </motion.span>
        {hasHeadings && (
          <motion.span
            layout="position"
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={layoutTransition}
            className="flex"
          >
            <RiArrowDownSLine className="size-3.5 opacity-80" />
          </motion.span>
        )}
        <motion.span
          layout="position"
          className="ml-auto flex items-center text-xs text-background/70 tabular-nums"
        >
          <span className="inline-flex w-[3ch] justify-end">
            <NumberFlow value={percent} />
          </span>
          %
        </motion.span>
      </motion.button>

      <AnimatePresence initial={false} mode="popLayout">
        {expanded && hasHeadings ? (
          <motion.ul
            key="toc"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: EASE_OUT }}
            className="flex flex-col gap-0.5 px-3 pt-1 pb-3"
          >
            {headings.map((h, i) => (
              <motion.li
                key={h.id}
                layout="position"
                initial={
                  shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -6 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.18,
                  delay: shouldReduceMotion ? 0 : i * 0.03,
                  ease: EASE_OUT,
                }}
              >
                <button
                  type="button"
                  onClick={() => scrollTo(h.id)}
                  className={cn(
                    "block w-full cursor-pointer truncate rounded-md px-2 py-1 text-left text-sm transition-colors",
                    h.level === 3 && "pl-5",
                    activeId === h.id
                      ? "text-background"
                      : "text-background/50 hover:text-background"
                  )}
                >
                  {h.text}
                </button>
              </motion.li>
            ))}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </motion.div>
  )
}

function normalize(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, " ")
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n))
}
