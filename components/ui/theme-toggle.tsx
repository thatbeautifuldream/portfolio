"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timeout)
  }, [])

  if (!mounted) {
    return <div className="text-sm text-muted-foreground">Theme</div>
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
      type="button"
      aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
    >
      {resolvedTheme === "dark" ? "Light" : "Dark"}
    </button>
  )
}
