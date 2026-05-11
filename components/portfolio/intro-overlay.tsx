"use client"

import { markIntroPlayed } from "@/app/actions"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useCallback, useEffect, useState } from "react"
import { FullSignAnimated } from "@/components/portfolio/full-sign-animated"
import { easings } from "@/lib/motion-tokens"

const HOLD_AFTER_DRAW_MS = 250

type Stage = "drawing" | "done"

interface IntroOverlayProps {
  alreadyPlayed: boolean
}

export function IntroOverlay({ alreadyPlayed }: IntroOverlayProps) {
  const reducedMotion = useReducedMotion()
  const [stage, setStage] = useState<Stage>(
    alreadyPlayed || reducedMotion ? "done" : "drawing"
  )

  useEffect(() => {
    if (stage === "done" && !alreadyPlayed) {
      markIntroPlayed()
    }
  }, [stage, alreadyPlayed])

  const finish = useCallback(() => {
    markIntroPlayed()
    setStage("done")
  }, [])

  useEffect(() => {
    if (stage !== "drawing") return
    const original = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish()
    }
    window.addEventListener("keydown", onKey)

    return () => {
      document.body.style.overflow = original
      window.removeEventListener("keydown", onKey)
    }
  }, [stage, finish])

  const handleDrawComplete = useCallback(() => {
    window.setTimeout(finish, HOLD_AFTER_DRAW_MS)
  }, [finish])

  return (
    <AnimatePresence>
      {stage === "drawing" && (
        <motion.div
          key="intro-overlay"
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: easings.DEFAULT }}
          onClick={finish}
          role="presentation"
        >
          <FullSignAnimated
            className="w-[min(70vw,720px)] text-foreground"
            onComplete={handleDrawComplete}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
