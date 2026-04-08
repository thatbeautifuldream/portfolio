export const easings = {
  DEFAULT: [0.25, 0.46, 0.45, 0.94] as const,
  QUICK: [0.165, 0.84, 0.44, 1] as const,
  LAYOUT: [0.25, 0.46, 0.45, 0.94] as const,
  SPRING: { type: "spring", stiffness: 400, damping: 30 } as const,
} as const

export const durations = {
  instant: 0.1,
  fast: 0.15,
  normal: 0.2,
  medium: 0.25,
  slow: 0.4,
  slower: 0.6,
} as const

export const staggers = {
  tight: 0.03,
  normal: 0.08,
  loose: 0.12,
} as const

export type Easing = (typeof easings)[keyof typeof easings]
export type Duration = (typeof durations)[keyof typeof durations]
export type Stagger = (typeof staggers)[keyof typeof staggers]
