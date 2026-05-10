"use client"

import { useEffect, useRef, useState } from "react"
import { RoughNotation } from "react-rough-notation"
import type { RoughNotationProps } from "react-rough-notation"

type RoughNoteProps = Omit<RoughNotationProps, "show"> & {
  threshold?: number
  delay?: number
  /** "span" for inline annotations; "div" for block-level (bracket) */
  tag?: "span" | "div"
  className?: string
}

export function RoughNote({
  threshold = 0.3,
  delay = 0,
  tag: Tag = "span",
  className,
  children,
  ...props
}: RoughNoteProps) {
  const containerRef = useRef<HTMLElement>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return
    const el = containerRef.current
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            timeoutId = setTimeout(() => setShow(true), delay)
          } else {
            setShow(true)
          }
          observer.disconnect()
        }
      },
      { threshold }
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      if (timeoutId !== undefined) clearTimeout(timeoutId)
    }
  }, [threshold, delay])

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={containerRef as any} className={className}>
      <RoughNotation show={show} {...props}>
        <Tag>{children}</Tag>
      </RoughNotation>
    </Tag>
  )
}
