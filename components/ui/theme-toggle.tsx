"use client"

import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="min-w-[3rem] cursor-pointer text-sm text-muted-foreground transition-colors hover:text-foreground"
      type="button"
    >
      <span className="block dark:hidden">Light</span>
      <span className="hidden dark:block">Dark</span>
    </button>
  )
}
