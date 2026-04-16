"use client"

import { RiMoonClearFill, RiSunFill } from "@remixicon/react"
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

  if (variant === "icon") {
    return (
      <button
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        className={cn(
          "relative flex size-10 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-foreground",
          className
        )}
        type="button"
        aria-label="Toggle theme"
      >
        <RiSunFill className="size-[1.125rem] scale-100 rotate-0 fill-current transition-all dark:scale-0 dark:-rotate-90" />
        <RiMoonClearFill className="absolute size-[1.125rem] scale-0 rotate-90 fill-current transition-all dark:scale-100 dark:rotate-0" />
      </button>
    )
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className={cn(
        "cursor-pointer text-sm text-muted-foreground transition-colors hover:text-foreground",
        className
      )}
      type="button"
    >
      <span className="block dark:hidden">Light</span>
      <span className="hidden dark:block">Dark</span>
    </button>
  )
}
