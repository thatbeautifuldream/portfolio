"use client"

import { RiHeartFill, RiMagicFill, RiSparklingFill } from "@remixicon/react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useCallback, useRef, useState } from "react"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

const burstIcons = {
  RiSparklingFill,
  RiMagicFill,
  RiHeartFill,
} as const

type BurstIconKey = keyof typeof burstIcons

type Particle = {
  id: number
  x: number
  y: number
  rotate: number
  duration: number
  size: number
}

type HeroBadgeProps = {
  children: ReactNode
  icon: ReactNode
  burstIcon: BurstIconKey
  className?: string
}

function useIconBurst() {
  const [particles, setParticles] = useState<Particle[]>([])
  const counter = useRef(0)

  const burst = useCallback(() => {
    const count = 10 + Math.floor(Math.random() * 6)
    const spawned: Particle[] = Array.from({ length: count }, () => {
      const angle = (Math.random() - 0.5) * Math.PI
      const distance = 50 + Math.random() * 110
      counter.current += 1
      return {
        id: counter.current,
        x: Math.sin(angle) * distance,
        y: -(Math.cos(angle) * distance + 20),
        rotate: (Math.random() - 0.5) * 360,
        duration: 0.7 + Math.random() * 0.5,
        size: 12 + Math.random() * 8,
      }
    })

    setParticles(spawned)
    setTimeout(() => setParticles([]), 1500)
  }, [])

  return { particles, burst }
}

export function HeroBadge({
  children,
  icon,
  burstIcon,
  className,
}: HeroBadgeProps) {
  const BurstIcon = burstIcons[burstIcon]
  const { particles, burst } = useIconBurst()
  const [pressed, setPressed] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  const handleClick = useCallback(() => {
    if (shouldReduceMotion) return
    setPressed(true)
    burst()
    setTimeout(() => setPressed(false), 120)
  }, [burst, shouldReduceMotion])

  return (
    <span className="relative inline-flex">
      <motion.span
        className={cn(
          "inline-flex translate-y-[-0.08em] cursor-pointer items-center gap-1.5 rounded-xl py-1 pr-3 pl-2 text-[0.85em] shadow-sm ring-1 transition-shadow duration-200 ease-out select-none ring-inset hover:shadow-lg",
          className
        )}
        animate={{ scale: pressed ? 0.97 : 1 }}
        transition={{ type: "spring", stiffness: 600, damping: 18, mass: 0.6 }}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleClick()
        }}
      >
        {icon}
        {children}
        <AnimatePresence>
          {particles.map((p) => (
            <motion.span
              key={p.id}
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-1/2 fill-current"
              initial={{ x: "-50%", y: "-50%", opacity: 1, scale: 0.3 }}
              animate={{
                x: `calc(-50% + ${p.x}px)`,
                y: `calc(-50% + ${p.y}px)`,
                opacity: [1, 1, 0],
                scale: [0.3, 1.3, 1],
                rotate: p.rotate,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: p.duration,
                ease: [0.15, 0.85, 0.25, 1],
              }}
            >
              <BurstIcon style={{ width: p.size, height: p.size }} />
            </motion.span>
          ))}
        </AnimatePresence>
      </motion.span>
    </span>
  )
}
