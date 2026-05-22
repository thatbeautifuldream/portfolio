"use client"

import * as React from "react"
import { KeyboardShortcutsProvider } from "@/components/keyboard-shortcuts"
import { ThemeProvider as NextThemesProvider } from "next-themes"

function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <KeyboardShortcutsProvider>{children}</KeyboardShortcutsProvider>
    </NextThemesProvider>
  )
}

export { ThemeProvider }
