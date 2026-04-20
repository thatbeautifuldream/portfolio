# Project Conventions

> **Self-Improving Directive**: This file is the single source of truth for all project conventions. Whenever a new pattern, approach, or convention is established during a session, update this file immediately to reflect that change. If existing conventions are corrected or replaced, update the relevant section here. This file should self-improve after every session where new knowledge is gained.

## Stack

- **Framework**: Next.js 16 (App Router) with React 19 and TypeScript
- **Styling**: Tailwind CSS v4 (CSS-first config, no `tailwind.config.ts`)
- **UI primitives**: shadcn/ui (`radix-luma` style, base color: neutral)
- **Animations**: `motion` (Framer Motion v12) — imported as `motion/react`
- **Theme**: `next-themes` with `attribute="class"`, default dark, no transition on change
- **Data fetching**: `@tanstack/react-query`
- **Blog content**: `@content-collections/core` with Markdown
- **Charts**: `recharts` with shadcn chart wrapper
- **Package manager**: pnpm (always use `pnpm` for installs, runs, scripts)

## Commands

- `pnpm install <library>` - install library using pnpm
- `pnpm dev` — dev server (Turbopack)
- `pnpm build` — production build
- `pnpm lint` — ESLint
- `pnpm typecheck` — `tsc --noEmit`
- `pnpm format` — Prettier (with `prettier-plugin-tailwindcss`)

## Icons

- **Use `@remixicon/react` exclusively** — never use `lucide-react`, heroicons, or raw SVGs
- Remix Icon naming: `Ri<PascalCase><Fill|Line>` (e.g. `RiSunFill`, `RiCodeLine`)
- Prefer `Fill` variants for standalone decorative icons, `Line` variants for inline/UI context icons
- Use `size-{n}` className for sizing, not the `size` prop
- Import only what you need: `import { RiSunFill } from "@remixicon/react"`
- `components.json` has `iconLibrary: "remixicon"` — future `shadcn add` commands will use Remix Icons

## Styling Rules

- Use `cn()` from `@/lib/utils` (clsx + tailwind-merge) for conditional class merging
- CSS variables for theming defined in `app/globals.css` (`:root` for light, `.dark` for dark)
- Dark variant: `@custom-variant dark (&:is(.dark *))` — use Tailwind `dark:` prefix
- No shadows in dark mode — use `dark:shadow-none` and `dark:inset-ring dark:inset-ring-white/5` instead
- Use `@utility` in globals.css for reusable custom classes (see `section-shell`, `section-inner`)
- Prefer `size-{n}` over `h-{n} w-{n}` when both are equal
- Prefer `gap-*` on flex/grid parents over `mt-*`/`mb-*` between children
- Use `min-h-svh`/`min-h-dvh`, never `min-h-screen` (deprecated)

## File Structure

```
app/                  → Next.js App Router pages and layouts
  layout.tsx          → Root layout with ThemeProvider, QueryProvider, Navigation, Footer
  globals.css         → Tailwind v4 config, CSS variables, keyframes, base styles
components/
  portfolio/          → App-specific components (navigation, footer, sign)
  ui/                 → shadcn/ui primitives (button, card, badge, etc.)
  theme-provider.tsx  → next-themes wrapper ("use client")
  query-provider.tsx  → react-query wrapper ("use client")
  section.tsx         → Motion-based scroll animation wrapper
lib/
  utils.ts            → cn() helper
  portfolio-data.ts   → Site content data (roles, links, stats)
  metadata.ts         → createMetadata() helper
  motion-tokens.ts    → Shared motion/animation values
  wakatime/           → WakaTime API types and fetch logic
content/              → Markdown blog posts (Content Collections)
fonts/                → OpenRunde (local woff2: 400, 500, 600, 700)
```

## Component Conventions

- Client components must have `"use client"` directive at top
- Import order: React/Next → third-party → local components → local lib → types
- Use `motion/react` for animations, not `framer-motion`
- Navigation uses `createPortal` for the mobile menu panel
- Section wrapper (`<Section>`) provides scroll-triggered entrance animations with configurable delay
- Links default to `text-foreground` with underline and `hover:text-muted-foreground` (set in base styles)

## Entrance Animation Stagger Pattern

All pages use CSS `animate-fade-up` with staggered delays for a top-to-bottom entrance cascade. Follow the established pattern:

### Animation Delay Implementation

**Always use inline styles for animation delays.** Never use Tailwind `delay-*` classes or CSS `calc()` with `var(--i)` custom properties.

```tsx
// Static delay (for headings and section titles)
<div className="animate-fade-up" style={{ animationDelay: "100ms" }}>

// Staggered list items (for maps over data)
{items.map((item, index) => (
  <div
    key={item.id}
    className="animate-fade-up"
    style={{ animationDelay: `${baseDelay + index * 80}ms` }}
  >
    {/* content */}
  </div>
))}
```

### Stagger Timing

| Element | Delay |
|---------|-------|
| Page heading (h1) | 100ms |
| Section intro (h2) | 200ms |
| First list item | 300ms |
| Each subsequent item | +80ms |
| Next section heading | After last item completes |

### Key Rules

- Use `style={{ animationDelay: "..." }}` for all animation delays
- Calculate stagger delays with template literals: `` `${base + index * 80}ms` ``
- Base delays: 100ms (headings), 200ms (sub-sections), 300ms (list start)
- Stagger gap: 80ms between each item in a list
- Never use Tailwind arbitrary values like `delay-[100ms]` or `animation-delay-[calc(...)]`
- Never use CSS custom properties like `var(--i)` for stagger calculations

## Theme Toggle

- Located in `components/ui/theme-toggle.tsx`
- Two variants: `"icon"` (navbar, filled sun/moon with rotate+scale transition) and `"text"` (shows "Light"/"Dark" text)
- Uses `useTheme()` from `next-themes`
- Sun: `RiSunFill`, Moon: `RiMoonClearFill`

## Fonts

- Primary: OpenRunde (loaded via `next/font/local` as `--font-sans`)
- Weights: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)

## Writing & Copy

- Never use em dashes (—) in any prose, UI copy, or content. Use commas, colons, periods, or restructure the sentence instead.

## Git

- Never attribute AI as co-author in commits or PRs
- Only commit when explicitly asked
- Never push unless explicitly asked
