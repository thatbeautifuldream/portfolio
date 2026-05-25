export const FONT_COOKIE_NAME = "font-preference"

export const FONT_PRESETS = [
  {
    id: "openrunde",
    label: "OpenRunde",
    variable: "--font-openrunde",
  },
  {
    id: "manrope",
    label: "Manrope",
    variable: "--font-manrope",
  },
  {
    id: "sora",
    label: "Sora",
    variable: "--font-sora",
  },
  {
    id: "plus-jakarta-sans",
    label: "Plus Jakarta Sans",
    variable: "--font-plus-jakarta-sans",
  },
  {
    id: "space-grotesk",
    label: "Space Grotesk",
    variable: "--font-space-grotesk",
  },
] as const

export type FontPreset = (typeof FONT_PRESETS)[number]
export type FontPresetId = FontPreset["id"]

export const DEFAULT_FONT_PRESET: FontPresetId = "openrunde"

export function isFontPresetId(value: string): value is FontPresetId {
  return FONT_PRESETS.some((preset) => preset.id === value)
}
