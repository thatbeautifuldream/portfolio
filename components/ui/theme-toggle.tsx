"use client"

import { motion } from "motion/react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export function ThemeToggle({
  className,
  variant = "text",
}: {
  className?: string
  variant?: "text" | "icon"
}) {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={cn(
          "cursor-pointer rounded-full bg-background text-foreground transition-all duration-300 active:scale-95",
          className
        )}
        aria-label="Toggle theme"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          fill="currentColor"
          strokeLinecap="round"
          viewBox="0 0 32 32"
          className="size-5"
        >
          <clipPath id="skiper-btn-2">
            <motion.path
              animate={{ y: isDark ? 10 : 0, x: isDark ? -12 : 0 }}
              transition={{ ease: "easeInOut", duration: 0.35 }}
              d="M0-5h30a1 1 0 0 0 9 13v24H0Z"
            />
          </clipPath>
          <g clipPath="url(#skiper-btn-2)">
            <motion.circle
              animate={{ r: isDark ? 10 : 8 }}
              transition={{ ease: "easeInOut", duration: 0.35 }}
              cx="16"
              cy="16"
            />
            <motion.g
              animate={{
                rotate: isDark ? -100 : 0,
                scale: isDark ? 0.5 : 1,
                opacity: isDark ? 0 : 1,
              }}
              transition={{ ease: "easeInOut", duration: 0.35 }}
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M16 5.5v-4" />
              <path d="M16 30.5v-4" />
              <path d="M1.5 16h4" />
              <path d="M26.5 16h4" />
              <path d="m23.4 8.6 2.8-2.8" />
              <path d="m5.7 26.3 2.9-2.9" />
              <path d="m5.8 5.8 2.8 2.8" />
              <path d="m23.4 23.4 2.9 2.9" />
            </motion.g>
          </g>
        </svg>
      </button>
    )
  }

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "rounded-full bg-background text-foreground transition-all duration-300 active:scale-95",
        className
      )}
      type="button"
    >
      <span className="block px-2 py-1 text-sm dark:hidden">Light</span>
      <span className="hidden px-2 py-1 text-sm dark:block">Dark</span>
    </button>
  )
}
