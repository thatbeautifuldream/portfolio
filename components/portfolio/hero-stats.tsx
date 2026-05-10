"use client"

import { useEffect, useRef, useState } from "react"
import { RoughNotation, RoughNotationGroup } from "react-rough-notation"

import { heroStats } from "@/lib/portfolio-data"

export function HeroStats() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return
    const el = containerRef.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className="animate-fade-up md:grid md:grid-cols-3 md:divide-x md:divide-border/40"
      style={{ animationDelay: "300ms" }}
    >
      <RoughNotationGroup show={show}>
        {heroStats.map((stat, index) => (
          <div
            key={stat.label}
            className={`grid gap-1 py-6 md:py-0 ${
              index === 0
                ? "md:pr-6"
                : index === heroStats.length - 1
                  ? "md:pl-6"
                  : "md:px-6"
            }`}
          >
            <p className="text-3xl font-semibold tabular-nums">
              <RoughNotation
                type="circle"
                color="currentColor"
                strokeWidth={1.5}
                padding={14}
                animationDuration={600}
                iterations={1}
              >
                <span>{stat.value}</span>
              </RoughNotation>
            </p>
            <p className="text-sm text-pretty text-muted-foreground">
              {stat.label}
            </p>
          </div>
        ))}
      </RoughNotationGroup>
    </div>
  )
}
