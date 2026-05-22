export type ShortcutActionId =
  | "toggle-command-palette"
  | "toggle-navigation-menu"
  | "show-shortcuts"
  | "toggle-theme"
  | "go-home"
  | "go-work"
  | "go-projects"
  | "go-blog"
  | "go-talks"
  | "go-contact"

export type ShortcutMeta = {
  id: ShortcutActionId
  name: string
  description: string
  category: "General" | "Theme" | "Navigation"
  hotkey?: string
  sequence?: string[]
}

export const shortcutCatalog: ShortcutMeta[] = [
  {
    id: "toggle-command-palette",
    name: "Toggle command palette",
    description: "Open or close the global command menu",
    category: "General",
    hotkey: "Mod+K",
  },
  {
    id: "toggle-navigation-menu",
    name: "Toggle navigation menu",
    description: "Open or close the hamburger menu",
    category: "General",
    hotkey: "Mod+B",
  },
  {
    id: "show-shortcuts",
    name: "Show shortcuts",
    description: "Open keyboard shortcuts help",
    category: "General",
    hotkey: "Mod+Shift+K",
  },
  {
    id: "toggle-theme",
    name: "Toggle theme",
    description: "Switch between light and dark mode",
    category: "Theme",
    hotkey: "D",
  },
  {
    id: "go-home",
    name: "Go to home",
    description: "Navigate to homepage",
    category: "Navigation",
    sequence: ["G", "H"],
  },
  {
    id: "go-work",
    name: "Go to work",
    description: "Navigate to work page",
    category: "Navigation",
    sequence: ["G", "W"],
  },
  {
    id: "go-projects",
    name: "Go to projects",
    description: "Navigate to projects page",
    category: "Navigation",
    sequence: ["G", "P"],
  },
  {
    id: "go-blog",
    name: "Go to blog",
    description: "Navigate to blog page",
    category: "Navigation",
    sequence: ["G", "B"],
  },
  {
    id: "go-talks",
    name: "Go to talks",
    description: "Navigate to talks page",
    category: "Navigation",
    sequence: ["G", "T"],
  },
  {
    id: "go-contact",
    name: "Go to contact",
    description: "Navigate to contact page",
    category: "Navigation",
    sequence: ["G", "C"],
  },
]
