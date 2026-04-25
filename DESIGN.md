# Design System: Milind Mishra Portfolio

> **Self-Improving Directive**: This file is the single source of truth for the visual design system, interaction language, and editorial philosophy of this portfolio. Whenever a new visual pattern, animation treatment, component variant, or layout approach is established during a session, update this file immediately to reflect that change. If existing design conventions are corrected or replaced, update the relevant section here. This file should self-improve after every session where new visual knowledge is gained.
>
> **Agent Rule**: At the end of every task or feature implementation, review this file and append or update sections to capture what was learned. Pay special attention to new color treatments, typography scales, spacing rhythms, animation curves, component variants, or layout compositions.

---

## 1. Design Philosophy

The portfolio is designed around an **editorial minimalism** ethos: content-forward, structurally honest, and richly interactive without being noisy. The design prioritizes:

- **Interaction quality over decoration**: Every motion serves a purpose (entrance, feedback, or wayfinding).
- **Dark-first identity**: The default and most considered mode is dark. Light mode exists as a graceful inversion.
- **Typography as structure**: Type scale creates hierarchy; whitespace creates rhythm. No decorative noise.
- **Surface honesty**: Elements sit flat or use true glassmorphism. No fake depth via heavy shadows in dark mode.
- **Content density**: We use a narrow reading measure (`max-w-3xl`) for prose, but allow wider layouts (`max-w-7xl`) for media-rich or gallery pages when needed.

**Production URL**: `https://milindmishra.com`

---

## 2. Design Tokens

### 2.1 Colors

Colors are defined as CSS custom properties in `app/globals.css` and consumed via Tailwind v4 `@theme inline`.

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--background` | `#ffffff` | `#0a0a0a` | Page canvas |
| `--foreground` | `#171717` | `#fafafa` | Primary text, headings |
| `--card` | `#ffffff` | `#171717` | Elevated surfaces |
| `--card-foreground` | `#171717` | `#fafafa` | Text on cards |
| `--muted` | `#f5f5f5` | `#262626` | Subtle backgrounds, wells |
| `--muted-foreground` | `#737373` | `#a3a3a3` | Secondary text, eyebrows |
| `--border` | `#e5e5e5` | `#262626` | Dividers, borders |
| `--ring` | `#171717` | `#d4d4d4` | Focus rings |
| `--accent` | `#e5e5e5` | `#262626` | Highlighted subtle surfaces |
| `--destructive` | `#dc2626` | `#dc2626` | Errors |

**Chart Colors** (used in WakaTime dashboard):
- Light: `chart-1` → `#171717`, `chart-2` → `#737373`, descending to `#f5f5f5`
- Dark: `chart-1` → `#fafafa`, `chart-2` → `#a3a3a3`, descending to `#262626`

**OG Image Colors** (`lib/og/config.ts`):
- Background: `#0a0a0a`
- Primary text: `#fafafa`
- Secondary text: `#a3a3a3`

### 2.2 Typography

**Primary Font**: OpenRunde (local woff2), loaded as `--font-sans`.
- Weights: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- Applied in `layout.tsx` via `next/font/local`

**Monospace**: `ui-monospace, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", Liberation Mono, monospace`

**Scale & Rules**:

| Element | Size | Weight | Tracking | Line Height | Max Width |
|---------|------|--------|----------|-------------|-----------|
| Display / H1 | `text-4xl` / `md:text-6xl` | `font-semibold` | `tracking-tight` | Default | `max-w-[22ch]`–`max-w-[28ch]` |
| Section H2 | `text-2xl` / `md:text-3xl` | `font-semibold` | `tracking-tight` | Default | `max-w-[24ch]` |
| Card / Item Title | `text-lg` | `font-semibold` | `tracking-tight` | Default | — |
| Body | `text-base` | `font-normal` | Default | `leading-[1.75]` (prose) | `max-w-[56ch]` |
| Eyebrow / Label | `text-sm` | `font-normal` | Default | Default | — |
| Mono / Tags | `text-xs` / `text-sm` | `font-medium` | `tracking-wide` | Default | — |
| Stat Value | `text-3xl` | `font-semibold` | `tabular-nums` | Default | — |

**Rules**:
- Never use `font-bold` for headings. Always `font-semibold` or `font-medium`.
- Never add custom `leading-*` to headings. Use Tailwind's default line-height for the given size.
- Always use `text-balance` on headings; always use `text-pretty` on paragraph text.
- Always add `tracking-tight` to headings larger than `text-xl`.
- Never use `text-xs` for body text or general page content. Minimum body size is `text-base`.
- Constrain text width with `max-w-[*ch]` directly on the element.
- Apply `tabular-nums` to numbers that change or are displayed as data.

### 2.3 Spacing

**Page Rhythm**:
- Vertical section padding: `py-6` mobile, `md:py-8` desktop
- First section top padding: `first:pt-20` mobile, `first:md:pt-22` desktop
- Content max-width: `max-w-3xl` for prose and standard pages
- Wide layouts (tweets, galleries): `max-w-7xl`
- Horizontal padding: `px-4 sm:px-6 lg:px-8`

**Section Pattern** (two-element wrapper):
```tsx
<section className="section-shell">
  <div className="section-inner">...</div>
</section>
```
- Outer handles vertical padding.
- Inner handles max-width, centering, and horizontal padding.

**Gap Patterns**:
- Tight related content: `gap-2`–`gap-4`
- Section internal blocks: `gap-8`–`gap-12`
- Major section separation: `gap-16`
- Prefer `gap-*` on flex/grid parents over `mt-*`/`mb-*` between children.

### 2.4 Radii

- Base radius: `--radius: 0.75rem`
- Buttons: `rounded-4xl` (pill shape)
- Cards / images / code blocks: `rounded-lg` (`var(--radius-lg)`)
- Badges: `rounded-lg`
- Navigation (scrolled): `rounded-2xl`
- Small inline elements (code): `rounded-sm`

### 2.5 Shadows & Elevation

**Light Mode**:
- Elevated nav: `shadow-lg` + `ring-1 ring-black/5`
- Cards: subtle border or very light shadow when standing alone

**Dark Mode** (strict rules):
- **No outer shadows**. Always use `dark:shadow-none`.
- Surface definition via `dark:inset-ring dark:inset-ring-white/5`.
- Glassmorphism: `bg-background/85 backdrop-blur-xl dark:ring-0 dark:inset-ring dark:inset-ring-white/5`.
- Never pair shadows with solid gray borders.

### 2.6 Motion Tokens

Shared in `lib/motion-tokens.ts`:

| Token | Value | Usage |
|-------|-------|-------|
| `easings.DEFAULT` | `[0.25, 0.46, 0.45, 0.94]` | General UI transitions |
| `easings.QUICK` | `[0.165, 0.84, 0.44, 1]` | Snappy interactions |
| `easings.SPRING` | `{ stiffness: 400, damping: 30 }` | Hero badges, playful UI |
| `durations.slow` | `0.4s` | Standard motion |
| `durations.slower` | `0.6s` | Scroll reveals |
| `staggers.normal` | `0.08s` | List item cascades |

---

## 3. Layout & Composition

### 3.1 Container Strategy

- **Standard content**: `max-w-3xl` centered with `mx-auto`.
- **Gallery / media**: `max-w-7xl` with responsive columns.
- **Navigation**: `max-w-3xl` centered, but becomes a floating pill when scrolled.
- Align bounding containers across stacked sections so vertical edges line up when scrolling.

### 3.2 Responsive Breakpoints

We use Tailwind defaults: `sm:`, `md:`, `lg:`.

Common shift points:
- `md:`: Typography upscales (H1 `text-4xl` → `text-6xl`), nav padding changes, grids switch to multi-column.
- `lg:`: Columns expand (tweets `columns-1 sm:columns-2 lg:columns-3`).

### 3.3 Grid vs. Flex

- **Flex**: Navigation, stat rows, button groups, link clusters, inline badge text.
- **Grid**: Page sections, card lists, stat grids, form layouts.
- **CSS Columns**: Masonry layouts (tweets page).

### 3.4 Z-Index & Stacking

- `main` element: `isolate` class to create a new stacking context.
- Navigation: `z-50`
- Floating elements (TOC, menus): `z-40`–`z-50`
- Backdrop overlays: `z-40`

---

## 4. Surfaces & Elevation

### 4.1 Navigation (Scrolled State)

The navbar transforms into a floating glass pill:
- `rounded-2xl`
- `bg-background/85`
- `backdrop-blur-xl`
- `shadow-lg` (light only)
- `ring-1 ring-black/5` (light) / `dark:inset-ring dark:inset-ring-white/5` (dark)

### 4.2 Cards

Cards are intentionally minimal:
- `flex flex-col`
- No default background or shadow in the base `Card` primitive.
- Background is applied contextually (e.g., `bg-card` or transparent).
- In dark mode, if a card needs definition, use `dark:inset-ring dark:inset-ring-white/5`.

### 4.3 Dividers

- Never use solid colors for dividers. Use opacity: `border-border/40`, `divide-border/40`.
- Stat grids use `md:divide-x md:divide-border/40`.
- Metric rows use `border-b border-border/40`.
- When grid columns change at breakpoints, reconfigure divider logic so first/last padding resets correctly.

### 4.4 Wells & Inset Panels

- Use `bg-muted` for recessed secondary content.
- Code blocks: `bg-muted` inline, `pre` blocks use theme-specific backgrounds from `rehypeCode`.

---

## 5. Components & Primitives

### 5.1 Button

File: `components/ui/button.tsx`

- **Shape**: Pill (`rounded-4xl`) for all variants.
- **Sizes**: `xs`, `sm`, `default`, `lg`, `icon`, `icon-xs`, `icon-sm`, `icon-lg`.
- **Variants**:
  - `default`: Filled primary.
  - `outline`: Bordered, transparent in dark mode, hover to muted.
  - `secondary`: Subtle filled.
  - `ghost`: No background until hover.
  - `destructive`: Transparent tint with destructive color.
  - `link`: Text-only with underline.
- **Focus**: `focus-visible:ring-3 focus-visible:ring-ring/30`.
- **Active**: `active:translate-y-px` (subtle press).

### 5.2 Badge

File: `components/ui/badge.tsx`

- **Shape**: `rounded-lg`
- **Typography**: `font-mono text-sm uppercase tracking-wide`
- **Variants**:
  - `default`: `border-border/80 bg-accent/60 text-accent-foreground`
  - `secondary`: `border-border/80 bg-muted text-muted-foreground`

### 5.3 Hero Badge

File: `components/portfolio/hero-badge.tsx`

An interactive inline badge used inside the hero H1:
- Inline-flex with an icon and text.
- **Spring physics** on press (`scale: 0.95`).
- **Particle burst** on release: copies of `burstIcon` explode outward.
- **Hover rotation**: subtle `rotate` on hover.
- **Color convention**: Light mode uses `bg-{color}-100 text-{color}-700 ring-{color}-200/80`. Dark mode uses `dark:bg-{color}-500/15 dark:text-{color}-300 dark:ring-{color}-400/20`.
- Respects `useReducedMotion()`.

### 5.4 Theme Toggle

File: `components/ui/theme-toggle.tsx`

- `"icon"` variant: Custom SVG sun/moon with motion path animations.
- `"text"` variant: Shows "Light" / "Dark" label.

---

## 6. Animation & Motion

### 6.1 CSS Entrance Cascade (Primary Pattern)

All pages use `animate-fade-up` for a top-to-bottom entrance cascade.

**Keyframes** (`app/globals.css`):
```css
@keyframes fade-up {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

**Timing**:

| Element | Delay |
|---------|-------|
| Page heading (h1) | `100ms` |
| Section intro (h2) | `200ms` |
| First list item | `300ms` |
| Each subsequent item | `+80ms` |
| Next section heading | After last item completes |

**Rules**:
- Always use inline `style={{ animationDelay: "..." }}` for delays.
- Never use Tailwind `delay-*` classes for dynamic staggers.
- Never use CSS `calc()` with `var(--i)`.

### 6.2 Scroll-Triggered Motion

File: `components/section.tsx`

- Uses `motion.div` with `viewport={{ once: true, amount: 0.3 }}`.
- Effect: `blur(3px) + translateY(-8px)` → `blur(0) + translateY(0)`.
- Duration: `0.6s` (`durations.slower`).
- Respects `useReducedMotion()`.

### 6.3 Framer Motion Patterns

- Import from `motion/react` (not `framer-motion`).
- Check `useReducedMotion()` before running any non-essential motion.
- Spring physics for playful elements (hero badges).
- Layout animations for floating pills and menus.

### 6.4 Reduced Motion

- All interactive animations must respect `useReducedMotion()`.
- Scroll animations should fall back to static rendering when reduced motion is preferred.
- CSS animations that are essential (fade-up) can remain, but avoid excessive motion.

---

## 7. Iconography

**Library**: `@remixicon/react` exclusively.

**Rules**:
- Naming: `Ri<PascalCase><Fill|Line>` (e.g., `RiSunFill`, `RiCodeLine`).
- Prefer `Fill` for standalone decorative icons.
- Prefer `Line` for inline/UI context.
- Size via `className="size-{n}"`, **never** the `size` prop.
- Import individually: `import { RiSunFill } from "@remixicon/react"`.

---

## 8. Theme & Color Modes

- **Default**: Dark (`defaultTheme="dark"`).
- **Attribute**: `class` (`next-themes`).
- **Transition on change**: Disabled (`disableTransitionOnChange`).
- **System scheme**: `scheme-only-dark` class on `<html>` ensures native UI renders dark.
- **Hydration**: `suppressHydrationWarning` on `<html>`.

### Dark Mode Principles
- Maintain contrast ratios; do not simply invert.
- All headings use a single light color (`#fafafa`).
- No large branded colored panels; use background color + dividers.
- Decorative background images/gradients are hidden or toned down.

---

## 9. Content Patterns

### 9.1 Hero Section

- Eyebrow: `text-sm text-muted-foreground`.
- H1: Large display, `max-w-[22ch]`, inline `HeroBadge` components for keywords.
- Subhead: `max-w-[52ch]` body text, muted.
- CTAs: Flex wrap row of links, first link `font-medium`.
- Stats: 3-column grid with `md:divide-x`.

### 9.2 Stat Grids

- Use vertical dividers at `md:` breakpoint.
- First item: `md:pr-6` only.
- Middle items: `md:px-6`.
- Last item: `md:pl-6` only.
- Number: `text-3xl font-semibold tabular-nums`.
- Label: `text-sm text-muted-foreground`.

### 9.3 Work / Experience Lists

- Article wrapper with `grid gap-4`.
- Company name as H2.
- Meta line: `text-sm text-muted-foreground` with middot separators.
- Summary paragraph.
- Highlights as `ul role="list"` with custom dash bullets (`before:content-['–']`).

### 9.4 Project Items

- Name + status on one line (flex baseline wrap).
- Description paragraph.
- Metrics: flex row with `border-b border-border/40`.
- Tags: `font-mono text-xs tracking-wide text-muted-foreground` joined by `·`.
- Links: flex wrap row, primary link `font-medium`.

### 9.5 Masonry Gallery (Tweets)

- `columns-1 sm:columns-2 lg:columns-3`.
- Items: `break-inside-avoid mb-3`.
- No `gap` on the columns container; use `mb-3` on items for vertical rhythm.

### 9.6 Blog / Gist Reading Experience

- Rendered via `StreamdownWrapper`.
- Floating TOC: `BlogIndex` component as a floating pill with SVG progress ring.
- Prose styles defined in `@utility prose` in `globals.css`.

---

## 10. OG Image & Brand Expression

- **Runtime**: Edge (`app/api/og/route.tsx`).
- **Dimensions**: 1200×630px.
- **Font**: Familjen Grotesk SemiBold.
- **Aesthetic**: Dark only, minimal editorial, generous whitespace.
- **Background**: `#0a0a0a`
- **Text**: `#fafafa` primary, `#a3a3a3` secondary.
- Templates per page type live in `lib/og/templates/`.

---

## 11. Accessibility

- **Reduced motion**: All Framer Motion components check `useReducedMotion()`.
- **Focus rings**: `focus-visible:ring-3 focus-visible:ring-ring/30` on buttons; standard browser outline on links.
- **Touch targets**: Minimum `3rem` (`size-[max(100%,3rem)]`) for icon buttons and footer social links on touch devices.
- **Scrollbar**: Hidden globally (`scrollbar-width: none`, `::-webkit-scrollbar { display: none; }`).
- **Lists**: `role="list"` on `ul`/`ol` when `list-style` is removed.
- **Semantics**: Proper heading hierarchy, `aria-label` on icon-only controls.

---

## 12. Anti-Patterns & Guardrails

The following are **forbidden** in this design system:

- Never use `font-bold` for headings.
- Never use `text-xs` for body text or paragraphs.
- Never add custom `leading-*` to headings.
- Never use `mt-*`/`mb-*` between flex/grid children (use `gap-*`).
- Never use `min-h-screen` (use `min-h-svh` or `min-h-dvh`).
- Never use shadows in dark mode.
- Never use solid gray dividers (use opacity-based borders).
- Never apply `text-*` or `leading-*` to inline elements (`span`, `a`, `strong`) — apply to block parents.
- Never use `delay-[100ms]` or `animation-delay-[calc(...)]` for entrance cascades.
- Never use `lucide-react` or raw SVGs for icons (use `@remixicon/react`).
- Never use em dashes (`—`) in prose or UI copy.
- Never add `hover:*` states to non-interactive elements.
- Never add `transition-*` for simple color/background hover changes (reserve for transforms/motion).

---

## 13. How to Update This File

After completing any task that introduces or modifies visual design:

1. **New color tokens**: Add to Section 2.1.
2. **New typography scale or rule**: Add to Section 2.2.
3. **New spacing rhythm or layout**: Add to Section 2.3 or 3.
4. **New surface treatment**: Add to Section 4.
5. **New component primitive or variant**: Add to Section 5.
6. **New animation or motion pattern**: Add to Section 6.
7. **New content pattern**: Add to Section 9.
8. **New OG template style**: Add to Section 10.
9. **New anti-pattern discovered**: Add to Section 12.

If a convention is **replaced**, mark the old one as deprecated with a strikethrough and add the new one immediately below it. Do not delete old conventions without explicit user confirmation, as they may apply to legacy code.

**This file was last comprehensively updated based on a full repository analysis.**
