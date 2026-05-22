"use client"

import { shortcutCatalog } from "@/lib/keyboard-shortcuts"
import {
  formatForDisplay,
  HotkeysProvider,
  useHotkey,
  useHotkeyRegistrations,
  useHotkeySequences,
} from "@tanstack/react-hotkeys"
import type { HotkeySequence } from "@tanstack/react-hotkeys"
import { useTheme } from "next-themes"
import { usePathname, useRouter } from "next/navigation"
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Kbd, KbdGroup } from "@/components/ui/kbd"

type KeyboardShortcutsContextValue = {
  commandOpen: boolean
  setCommandOpen: (open: boolean) => void
}

const KeyboardShortcutsContext =
  createContext<KeyboardShortcutsContextValue | null>(null)

const routeBySequence: Array<{ sequence: HotkeySequence; href: string }> = [
  { sequence: ["G", "H"], href: "/" },
  { sequence: ["G", "W"], href: "/work" },
  { sequence: ["G", "P"], href: "/projects" },
  { sequence: ["G", "B"], href: "/blog" },
  { sequence: ["G", "T"], href: "/talks" },
  { sequence: ["G", "C"], href: "/contact" },
]

function renderChord(hotkey: string) {
  const keys = hotkey.split("+")

  return (
    <KbdGroup>
      {keys.map((key, index) => (
        <span key={`${key}-${index}`} className="inline-flex items-center gap-1">
          <Kbd>{formatForDisplay(key as never)}</Kbd>
          {index < keys.length - 1 ? (
            <span className="text-xs text-muted-foreground">+</span>
          ) : null}
        </span>
      ))}
    </KbdGroup>
  )
}

function renderSequence(sequence: string[]) {
  return (
    <span className="inline-flex items-center gap-2">
      {sequence.map((step, stepIndex) => (
        <span key={`${step}-${stepIndex}`} className="inline-flex items-center gap-2">
          {renderChord(step)}
          {stepIndex < sequence.length - 1 ? (
            <span className="text-xs text-muted-foreground">then</span>
          ) : null}
        </span>
      ))}
    </span>
  )
}

function KeyboardShortcutsDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { hotkeys, sequences } = useHotkeyRegistrations()
  const grouped = useMemo(() => {
    return shortcutCatalog.reduce<Record<string, typeof shortcutCatalog>>(
      (acc, shortcut) => {
        const key = shortcut.category
        acc[key] ??= []
        acc[key].push(shortcut)
        return acc
      },
      {}
    )
  }, [])

  const hasRegisteredShortcuts = hotkeys.length > 0 || sequences.length > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Keyboard shortcuts</DialogTitle>
          <DialogDescription>
            Speed up navigation and common actions across the portfolio.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] space-y-6 overflow-y-auto pr-1">
          {Object.entries(grouped).map(([category, shortcuts]) => (
            <section key={category} className="space-y-2">
              <h3 className="text-sm font-medium text-foreground">{category}</h3>
              <ul className="space-y-1.5">
                {shortcuts.map((shortcut) => {
                  return (
                    <li
                      key={shortcut.id}
                      className="flex items-center justify-between gap-4 px-1 py-1.5"
                    >
                      <span className="text-sm text-muted-foreground">
                        {shortcut.name}
                      </span>
                      {shortcut.hotkey ? renderChord(shortcut.hotkey) : null}
                      {shortcut.sequence ? renderSequence(shortcut.sequence) : null}
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}

          {!hasRegisteredShortcuts && (
            <p className="text-sm text-muted-foreground">No shortcuts registered.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function KeyboardShortcutsRuntime({ children }: PropsWithChildren) {
  const [commandOpen, setCommandOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()

  const navigate = useCallback(
    (href: string) => {
      setCommandOpen(false)
      setHelpOpen(false)
      if (pathname !== href) {
        router.push(href)
      }
    },
    [pathname, router]
  )

  useHotkey("Mod+K", () => {
    setHelpOpen(false)
    setCommandOpen((prev) => !prev)
  }, {
    meta: {
      name: "Toggle command palette",
      description: "Open or close the global command menu",
    },
  })

  useHotkey(
    "Mod+Shift+K",
    () => {
      setCommandOpen(false)
      setHelpOpen((prev) => !prev)
    },
    {
      meta: {
        name: "Show shortcuts",
        description: "Open keyboard shortcuts help",
      },
    }
  )

  useHotkey(
    "D",
    () => {
      setTheme(resolvedTheme === "dark" ? "light" : "dark")
    },
    {
      requireReset: true,
      meta: {
        name: "Toggle theme",
        description: "Switch between light and dark mode",
      },
    }
  )

  useHotkeySequences(
    routeBySequence.map(({ sequence, href }) => ({
      sequence,
      callback: () => navigate(href),
      options: {
        meta: {
          name: `Navigate ${href === "/" ? "home" : href}`,
          description: `Navigate to ${href}`,
        },
      },
    }))
  )

  const contextValue = useMemo(
    () => ({ commandOpen, setCommandOpen }),
    [commandOpen]
  )

  return (
    <KeyboardShortcutsContext.Provider value={contextValue}>
      {children}
      <KeyboardShortcutsDialog open={helpOpen} onOpenChange={setHelpOpen} />
    </KeyboardShortcutsContext.Provider>
  )
}

export function KeyboardShortcutsProvider({ children }: PropsWithChildren) {
  return (
    <HotkeysProvider
      defaultOptions={{
        hotkey: {
          ignoreInputs: true,
          preventDefault: true,
          stopPropagation: true,
          conflictBehavior: "warn",
        },
      }}
    >
      <KeyboardShortcutsRuntime>{children}</KeyboardShortcutsRuntime>
    </HotkeysProvider>
  )
}

export function useKeyboardShortcuts() {
  const context = useContext(KeyboardShortcutsContext)
  if (!context) {
    throw new Error(
      "useKeyboardShortcuts must be used within KeyboardShortcutsProvider"
    )
  }
  return context
}
