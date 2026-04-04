"use client"

import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()

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
