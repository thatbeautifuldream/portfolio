/**
 * Motion token system for consistent animation timing and easing.
 *
 * These tokens provide a shared language for motion across the site,
 * ensuring animations feel cohesive and polished.
 */

// Easing curves - different "personalities" for different animation types
export const easings = {
  // Default easing for most animations (sections, page content)
  // ease-out-quart-like - smooth deceleration
  DEFAULT: [0.25, 0.46, 0.45, 0.94] as const,

  // Quick interactions (hovers, taps, micro-interactions)
  // ease-out-quart - snappy and responsive
  QUICK: [0.165, 0.84, 0.44, 1] as const,

  // Layout changes (shared layout animations, resizing)
  // ease-in-out-quart - smooth entry and exit
  LAYOUT: [0.25, 0.46, 0.45, 0.94] as const,

  // Springs for playful, bouncy elements
  SPRING: { type: "spring", stiffness: 400, damping: 30 } as const,
} as const;

// Duration tokens for consistent timing
export const durations = {
  // Micro-interactions (hover states, small feedback)
  instant: 0.1,

  // Quick transitions (hovers, small elements)
  fast: 0.15,

  // Standard transitions (navigation pills, small components)
  normal: 0.2,

  // Default transitions (form reveals, content switches)
  medium: 0.25,

  // Large elements, standard entrances
  slow: 0.4,

  // Hero sections, major transitions
  slower: 0.6,
} as const;

// Stagger delays for sequential animations
export const staggers = {
  // Related items appearing in quick succession
  tight: 0.03,

  // Standard stagger for list items, cards
  normal: 0.08,

  // Unrelated items or larger groupings
  loose: 0.12,
} as const;

// Type exports for TypeScript users
export type Easing = (typeof easings)[keyof typeof easings];
export type Duration = (typeof durations)[keyof typeof durations];
export type Stagger = (typeof staggers)[keyof typeof staggers];
