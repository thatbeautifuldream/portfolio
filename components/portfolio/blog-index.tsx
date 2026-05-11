"use client"

import NumberFlow from "@number-flow/react"
import { RiArrowDownSLine, RiArrowLeftLine } from "@remixicon/react"
import { motion, useReducedMotion } from "motion/react"
import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"

import type { Heading } from "@/lib/extract-headings"
import { cn } from "@/lib/utils"

type BlogIndexProps = {
  headings: Heading[]
  articleSelector?: string
  backHref?: string
  backLabel?: string
}

const RING_RADIUS = 7
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

const EMIL_EASE = [0.32, 0.72, 0, 1] as const
const layoutTransition = { duration: 0.32, ease: EMIL_EASE }

export function BlogIndex({
  headings,
  articleSelector = "article",
  backHref,
  backLabel = "Back",
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
        initial: { opacity: 0, y: -8 },
        animate: { opacity: 1, y: 0 },
      }

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-40 h-28"
      >
        <div
          className="absolute inset-0 backdrop-blur-[2px]"
          style={{
            maskImage:
              "linear-gradient(to bottom, black 0%, black 25%, transparent 50%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 25%, transparent 50%)",
          }}
        />
        <div
          className="absolute inset-0 backdrop-blur-[4px]"
          style={{
            maskImage:
              "linear-gradient(to bottom, black 0%, black 20%, transparent 45%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 20%, transparent 45%)",
          }}
        />
        <div
          className="absolute inset-0 backdrop-blur-[8px]"
          style={{
            maskImage:
              "linear-gradient(to bottom, black 0%, black 15%, transparent 40%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 15%, transparent 40%)",
          }}
        />
        <div
          className="absolute inset-0 backdrop-blur-[16px]"
          style={{
            maskImage:
              "linear-gradient(to bottom, black 0%, black 10%, transparent 35%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 10%, transparent 35%)",
          }}
        />
        <div
          className="absolute inset-0 backdrop-blur-[24px]"
          style={{
            maskImage:
              "linear-gradient(to bottom, black 0%, black 5%, transparent 30%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 5%, transparent 30%)",
          }}
        />
        <div
          className="absolute inset-0 bg-background/30"
          style={{
            maskImage:
              "linear-gradient(to bottom, black 0%, transparent 60%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, transparent 60%)",
          }}
        />
      </div>
      <div className="fixed top-4 left-1/2 z-50 flex -translate-x-1/2 items-start gap-2">
      {backHref && (
        <motion.div
          {...entrance}
          transition={shouldReduceMotion ? { duration: 0 } : layoutTransition}
        >
          <Link
            href={backHref}
            aria-label={backLabel}
            className={cn(
              "flex size-9 items-center justify-center rounded-full",
              "bg-gradient-to-b from-foreground/90 via-foreground/95 to-foreground",
              "text-background",
              "shadow-xl shadow-foreground/20",
              "ring-1 inset-ring-1 ring-foreground/20 inset-ring-background/10",
              "transition-transform hover:scale-105 active:scale-95"
            )}
          >
            <RiArrowLeftLine className="size-4" />
          </Link>
        </motion.div>
      )}
      <motion.div
        ref={pillRef}
        {...entrance}
        transition={shouldReduceMotion ? { duration: 0 } : layoutTransition}
        style={{ borderRadius: 18 }}
        className={cn(
          "relative w-[15rem] max-w-[calc(100vw-4.5rem)]",
          "overflow-hidden",
          "bg-gradient-to-b from-foreground/90 via-foreground/95 to-foreground",
          "text-background",
          "shadow-xl shadow-foreground/20",
          "ring-1 inset-ring-1 ring-foreground/20 inset-ring-background/10"
        )}
      >
      <button
        ref={triggerRef}
        type="button"
        onClick={() => hasHeadings && setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-label={expanded ? "Collapse index" : "Expand index"}
        className={cn(
          "relative flex w-full items-center gap-2 px-3 py-2 text-left",
          hasHeadings ? "cursor-pointer" : "cursor-default"
        )}
      >
        <svg
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
        </svg>
        <span className="text-sm font-medium">Index</span>
        {hasHeadings && (
          <span
            className="flex transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
            style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            <RiArrowDownSLine className="size-3.5 opacity-80" />
          </span>
        )}
        <span className="ml-auto flex items-center text-xs text-background/70 tabular-nums">
          <span className="inline-flex w-[3ch] justify-end tabular-nums">
            <NumberFlow value={percent} className="tabular-nums" />
          </span>
          %
        </span>
      </button>

      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
          expanded && hasHeadings
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        )}
        aria-hidden={!expanded}
      >
        <div className="overflow-hidden">
          <ul className="flex min-w-56 flex-col gap-0.5 px-3 pt-1 pb-3">
            {headings.map((h) => (
              <li key={h.id}>
                <button
                  type="button"
                  onClick={() => scrollTo(h.id)}
                  tabIndex={expanded ? 0 : -1}
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
              </li>
            ))}
          </ul>
        </div>
      </div>
      </motion.div>
      </div>
    </>
  )
}

function normalize(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, " ")
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n))
}
