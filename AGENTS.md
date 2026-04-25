# Agent Documentation: Milind Mishra Portfolio

> **Self-Improving Directive**: This file is the single source of truth for all project conventions, architecture, and patterns. Whenever a new pattern, approach, convention, feature, or dependency is established during a session, update this file immediately to reflect that change. If existing conventions are corrected or replaced, update the relevant section here. This file should self-improve after every session where new knowledge is gained.
>
> **Agent Rule**: At the end of every task or feature implementation, review this file and append or update sections to capture what was learned. Pay special attention to new dependencies, changed file structures, new animation patterns, new API routes, or modified data flows.

---

## 1. Project Overview

This is the personal portfolio website of Milind Kumar Mishra. It is a statically generated Next.js application featuring a home page, work experience, projects, talks, blog, gists, tweets, contact, and a WakaTime coding activity dashboard. The site emphasizes motion design, interaction quality, and editorial typography.

**Production URL**: `https://milindmishra.com`

---

## 2. Technology Stack

| Layer | Technology | Version / Notes |
|-------|-----------|-----------------|
| Framework | Next.js | 16 (App Router, Turbopack dev) |
| Runtime | React | 19 |
| Language | TypeScript | Strict mode, `moduleResolution: bundler` |
| Styling | Tailwind CSS | v4 (CSS-first config, **no `tailwind.config.ts`**) |
| UI Primitives | shadcn/ui | `radix-luma` style, base color `neutral` |
| Animation | motion | Framer Motion v12, imported as `motion/react` |
| Theme | next-themes | `attribute="class"`, default dark, no transition on change |
| Data Fetching | @tanstack/react-query | Server prefetch + client hydration pattern |
| Blog Content | @content-collections/core | Markdown (`.md`) and MDX (`.mdx`) with Zod validation |
| Charts | recharts | Used with shadcn `chart.tsx` wrapper |
| OG Images | satori + next/og | Edge runtime, dynamic OG image generation |
| Icons | @remixicon/react | **Exclusive icon library** |
| Markdown Render | streamdown | With `@streamdown/code` and `@streamdown/mermaid` plugins |
| Analytics | Vercel Analytics, Microsoft Clarity, Google Analytics | Via `@t3-oss/env-nextjs` env validation |
| Package Manager | pnpm | Always use `pnpm` for installs and scripts |

### Key Dependencies

- `react-tweet`: Embedded tweet rendering with custom theme overrides
- `@number-flow/react`: Animated number transitions (used in blog progress ring)
- `@octokit/rest`: GitHub API integration for gist syncing
- `reading-time`: Reading time estimation for gists
- `fumadocs-core`: MDX plugins (`rehypeCode`, `remarkGfm`, `remarkHeading`)
- `sharp`: Image optimization
- `zod`: Schema validation (content collections, env vars)

---

## 3. File Structure

```
app/                          → Next.js App Router pages and layouts
  layout.tsx                  → Root layout with ThemeProvider, QueryProvider, Navigation, Footer
  globals.css                 → Tailwind v4 config, CSS variables, keyframes, @utility classes, base styles
  page.tsx                    → Home page (hero badges, stats, quick nav)
  work/page.tsx               → Work experience page
  projects/page.tsx           → Projects page
  talks/page.tsx              → Talks and open source contributions
  blog/page.tsx               → Blog index
  blog/[slug]/page.tsx        → Individual blog post (renders Markdown)
  blog/[slug]/not-found.tsx   → 404 for missing posts
  gist/page.tsx               → Gist index
  gist/[slug]/page.tsx        → Individual gist (renders MDX)
  tweets/page.tsx             → Embedded tweets gallery (masonry columns)
  contact/page.tsx            → Contact page
  wakatime/page.tsx           → WakaTime dashboard
  api/og/route.tsx            → Dynamic OG image API (edge runtime)
  api/wakatime/[endpoint]/route.ts  → WakaTime data proxy API
  manifest.ts                 → PWA manifest

components/
  portfolio/                  → App-specific components
    navigation.tsx            → Fixed navbar with scroll-aware styling
    nav-menu-panel.tsx        → Mobile/desktop menu panel (createPortal)
    footer.tsx                → Footer with social links and commit SHA
    sign.tsx                  → SVG signature logo
    hero-badge.tsx            → Interactive badge with particle burst effect
    blog-index.tsx            → Floating table of contents with progress ring
  ui/                         → shadcn/ui primitives
    button.tsx, card.tsx, badge.tsx, separator.tsx, scroll-area.tsx, tabs.tsx, chart.tsx, theme-toggle.tsx
  section.tsx                 → Motion-based scroll animation wrapper
  streamdown-wrapper.tsx      → Client wrapper for streamdown markdown renderer
  theme-provider.tsx          → next-themes wrapper ("use client")
  query-provider.tsx          → react-query wrapper ("use client")
  service-worker-provider.tsx → Registers /sw.js in production
  json-ld.tsx                 → Schema.org JSON-LD script injector
  providers/analytics-provider.tsx  → Clarity + GA + Vercel Analytics

lib/
  utils.ts                    → cn() helper (clsx + tailwind-merge)
  portfolio-data.ts           → Site content: roles, projects, talks, contributions, links, stats
  metadata.ts                 → createMetadata() helper for OG/SEO
  motion-tokens.ts            → Shared motion values: easings, durations, staggers
  env.ts                      → T3 env validation (CLARITY_ID, GA_ID)
  date-formatters.ts          → Intl.DateTimeFormat instances
  extract-headings.ts         → Markdown heading extraction for TOC
  tweets-data.ts              → Tweet URL/ID definitions
  wakatime/                   → WakaTime integration
    types.ts                  → Zod schemas and TypeScript types
    fetch.ts                  → Generic fetch helper
    api.ts                    → Client-side fetch functions
    constants.ts              → Public WakaTime share URLs
  og/                         → OG image generation system
    config.ts                 → OG dimensions and colors
    font.ts                   → Font loading utility (Familjen Grotesk)
    templates/                → JSX templates per page type
      base.tsx, home.tsx, blog-post.tsx, blog-index.tsx, projects.tsx, work.tsx, talks.tsx, contact.tsx
  service/github.service.ts   → Octokit wrapper for gist/repo fetching
  scripts/gists.ts            → CLI script to sync GitHub gists to content/gist/

content/
  posts/                      → Markdown blog posts (Content Collections)
  gist/                       → MDX gist files (auto-generated by gists.ts script)

fonts/                        → OpenRunde local woff2 files (400, 500, 600, 700)
public/
  fonts/                      → FamiljenGrotesk-SemiBold.ttf (for OG images)
  sw.js                       → Service worker for PWA caching
```

---

## 4. Development Commands

```bash
pnpm install <library>        # Install dependencies
pnpm dev                      # Dev server with Turbopack
pnpm build                    # Production build
pnpm lint                     # ESLint
pnpm typecheck                # TypeScript check (tsc --noEmit)
pnpm format                   # Prettier with tailwindcss plugin
pnpm content:build            # Build content collections
pnpm content:watch            # Watch content collections
pnpm gists:fetch              # Sync GitHub gists to content/gist/
```

---

## 5. Code Conventions

### 5.1 TypeScript & React

- **Strict mode enabled**. No `any` without explicit justification.
- Client components **must** have `"use client"` directive at the very top.
- Import order:
  1. React / Next.js
  2. Third-party libraries
  3. Local components
  4. Local lib/utils
  5. Types
- Use `type` imports where possible: `import type { Metadata } from "next"`.
- Async page components accept `params: Promise<{ slug: string }>` (Next.js 15+ pattern).

### 5.2 Next.js App Router Patterns

- **Metadata**: Every page exports metadata via `createMetadata()` from `lib/metadata.ts`.
- **OG Images**: `createMetadata({ ogType: "blog-post", slug })` auto-generates `/api/og?type=...` URLs.
- **Static Params**: Blog and gist slugs use `generateStaticParams()`.
- **Not Found**: Blog posts use `notFound()` from `next/navigation` for missing slugs.
- **Prefetching**: WakaTime page prefetches react-query data server-side using `QueryClient` + `dehydrate`.

### 5.3 Styling (Tailwind CSS v4)

- **No `tailwind.config.ts`**. All configuration is in `app/globals.css` using `@theme inline`, `@utility`, `@custom-variant`, and `@layer base`.
- Use `cn()` from `@/lib/utils` for conditional class merging.
- CSS variables for theming: `:root` (light), `.dark` (dark).
- Dark variant: `@custom-variant dark (&:is(.dark *))`. Use `dark:` prefix in classes.
- **No shadows in dark mode**: use `dark:shadow-none` and `dark:inset-ring dark:inset-ring-white/5` instead.
- `@utility` classes defined in globals.css:
  - `section-shell`: `py-6 first:pt-20 md:py-8 first:md:pt-22`
  - `section-inner`: `mx-auto max-w-3xl px-4 sm:px-6 lg:px-8`
  - `prose`: Custom typography styles for markdown content
- Prefer `size-{n}` over `h-{n} w-{n}` when both dimensions are equal.
- Prefer `gap-*` on flex/grid parents over `mt-*`/`mb-*` between children.
- Use `min-h-svh` / `min-h-dvh`, never `min-h-screen` (deprecated).
- Links default style: `text-foreground` with underline, `hover:text-muted-foreground` (set in `@layer base`).

### 5.4 Icons

- **Use `@remixicon/react` exclusively**. Never use `lucide-react`, heroicons, or raw SVGs.
- Naming: `Ri<PascalCase><Fill|Line>` (e.g., `RiSunFill`, `RiCodeLine`).
- Prefer `Fill` variants for standalone decorative icons; `Line` for inline/UI context.
- Use `size-{n}` className for sizing, **not** the `size` prop.
- Import only what you need: `import { RiSunFill } from "@remixicon/react"`.
- `components.json` has `iconLibrary: "remixicon"` — future `shadcn add` commands will use Remix Icons.

### 5.5 Fonts

- **Primary font**: OpenRunde, loaded via `next/font/local` as `--font-sans`.
- Weights: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold).
- Applied in `layout.tsx` via `openRunde.variable` and `openRunde.className`.
- Monospace: `var(--font-mono)` (system mono stack).

### 5.6 Theme

- Managed by `next-themes` with `attribute="class"`.
- Default theme: **dark**.
- `disableTransitionOnChange` is set to true.
- `suppressHydrationWarning` on `<html>`.
- `scheme-only-dark` class on `<html>` for system-level dark scheme.
- Theme toggle: `components/ui/theme-toggle.tsx` with `"icon"` and `"text"` variants.

---

## 6. Animation & Motion Patterns

### 6.1 CSS Entrance Animations (Primary Pattern)

All pages use CSS `animate-fade-up` with staggered delays for a top-to-bottom entrance cascade.

**Always use inline styles for animation delays.** Never use Tailwind `delay-*` classes or CSS `calc()` with `var(--i)`.

```tsx
// Static delay
<div className="animate-fade-up" style={{ animationDelay: "100ms" }}>

// Staggered list items
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

**Stagger Timing Reference:**

| Element | Delay |
|---------|-------|
| Page heading (h1) | 100ms |
| Section intro (h2) | 200ms |
| First list item | 300ms |
| Each subsequent item | +80ms |
| Next section heading | After last item completes |

**Key Rules:**
- Base delays: 100ms (headings), 200ms (sub-sections), 300ms (list start)
- Stagger gap: 80ms between items
- Never use `delay-[100ms]` or `animation-delay-[calc(...)]`
- Never use CSS custom properties like `var(--i)` for stagger

### 6.2 Motion/React (Framer Motion v12)

Used for interactive and scroll-triggered animations:
- `motion/react` import (not `framer-motion`)
- `useReducedMotion()` is checked before running animations
- `components/section.tsx`: Scroll-triggered entrance with blur + translateY
- `components/portfolio/blog-index.tsx`: Floating pill with progress ring, layout animations
- `components/portfolio/hero-badge.tsx`: Spring-based press + particle burst
- `components/portfolio/nav-menu-panel.tsx`: Portal-based menu with blur + stagger

### 6.3 Motion Tokens

Shared values in `lib/motion-tokens.ts`:
- `easings.DEFAULT`: `[0.25, 0.46, 0.45, 0.94]`
- `easings.QUICK`: `[0.165, 0.84, 0.44, 1]`
- `durations.slow`: `0.4`, `durations.slower`: `0.6`
- `staggers.normal`: `0.08`

---

## 7. Feature Documentation

### 7.1 Pages & Routes

| Route | Type | Key Features |
|-------|------|-------------|
| `/` | Page | Hero with interactive badges, stats grid, quick navigation |
| `/work` | Page | Role history with highlights list |
| `/projects` | Page | Project cards with metrics, tags, external links |
| `/talks` | Page | Talks list + open source contributions |
| `/blog` | Page | Blog post index (sorted by date) |
| `/blog/[slug]` | Dynamic | Individual post with Streamdown rendering, floating TOC |
| `/gist` | Page | Gist index (sorted by date) |
| `/gist/[slug]` | Dynamic | Individual gist with MDX rendering |
| `/tweets` | Page | Masonry grid of embedded tweets |
| `/contact` | Page | Contact links and email |
| `/wakatime` | Page | Coding activity dashboard with tabs and charts |
| `/api/og` | API Route | Dynamic OG image generation (edge runtime) |
| `/api/wakatime/*` | API Route | Proxied WakaTime data endpoints |

### 7.2 OG Image System

- **Runtime**: Edge (`export const runtime = "edge"`)
- **Library**: Satori + `next/og` `ImageResponse`
- **Font**: Familjen Grotesk SemiBold (loaded from `public/fonts/`)
- **Templates**: One per page type in `lib/og/templates/`
- **URL Pattern**: `/api/og?type={home|blog|projects|work|talks|contact}&slug={optional}`
- **Design**: Dark only (#0a0a0a bg, #fafafa primary text), minimal editorial aesthetic, 1200x630px
- **Integration**: `createMetadata()` in `lib/metadata.ts` auto-generates OG and Twitter card URLs

### 7.3 Blog System

- **Source**: Markdown files in `content/posts/*.md`
- **Collection**: `posts` in `content-collections.ts`
- **Schema**: `title`, `description`, `content`, `category`, `date`
- **Rendering**: `StreamdownWrapper` with `streamdown` + `@streamdown/code` + `@streamdown/mermaid`
- **TOC**: `BlogIndex` component extracts `h2`/`h3` headings, creates floating pill with SVG progress ring
- **Code blocks**: `rehypeCode` with `github-light` / `github-dark-default` themes
- **Not found**: `app/blog/[slug]/not-found.tsx`

### 7.4 Gist System

- **Source**: MDX files in `content/gist/*.mdx` (auto-generated)
- **Collection**: `gists` in `content-collections.ts`
- **Schema**: `title`, `description`, `datePublished`, `slug`, `tags`, `gistId`, `gistUrl`, `isPublic`
- **Sync script**: `lib/scripts/gists.ts` fetches from GitHub API and writes MDX files
  - Run: `pnpm gists:fetch`
  - Fetches public gists for `GITHUB_USERNAME = "thatbeautifuldream"`
  - Batches requests (size 5) with 1s delay between batches
  - Generates frontmatter and fenced code blocks per gist file
- **Rendering**: Same `StreamdownWrapper` as blog

### 7.5 Tweets Page

- **Library**: `react-tweet` (`EmbeddedTweet`, `TweetNotFound`)
- **Data**: `lib/tweets-data.ts` defines tweet URLs; IDs extracted via regex
- **Caching**: `unstable_cache` from Next.js with 24h revalidation
- **Layout**: CSS columns (`columns-1 sm:columns-2 lg:columns-3`) with `break-inside-avoid`
- **Theme**: Custom CSS variables in `globals.css` for `.react-tweet-theme` and `.dark .react-tweet-theme`

### 7.6 WakaTime Dashboard

- **Data source**: Public WakaTime share URLs (`lib/wakatime/constants.ts`)
- **Architecture**:
  1. Page server-component prefetches all endpoints via `QueryClient`
  2. `HydrationBoundary` dehydrates state to client
  3. Client components (`components/wakatime/*.tsx`) use react-query hooks
  4. `lib/wakatime/api.ts` provides typed fetch functions
- **Endpoints**: `coding-activity`, `languages`, `editors`, `operating-systems`, `categories`
- **Charts**: `recharts` LineChart for daily activity (with SVG glow filter), custom stat rows for summaries
- **UI**: `Tabs` component with icon triggers, `Section` wrapper for scroll animations

### 7.7 Service Worker / PWA

- **File**: `public/sw.js`
- **Registration**: `components/service-worker-provider.tsx` (production only)
- **Behavior**: Cache-first for static assets, network-first for navigations, offline fallback to `/`
- **Manifest**: `app/manifest.ts` defines PWA metadata
- **Cache name**: `portfolio-pwa-v1`
- **Excluded**: `/api/*` routes are not cached

### 7.8 Analytics

- **Vercel Analytics**: `@vercel/analytics/react`
- **Google Analytics**: `@next/third-parties/google` with `gaId`
- **Microsoft Clarity**: `@microsoft/clarity` initialized in `useEffect`
- **Env vars**: `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_CLARITY_ID` (validated via `@t3-oss/env-nextjs`)

---

## 8. Component Patterns

### 8.1 Section Wrapper

`components/section.tsx` provides scroll-triggered entrance animations:
- Uses `motion.div` with `viewport={{ once: true, amount: 0.3 }}`
- Configurable `delay` prop
- Respects `useReducedMotion()`
- Creates blur + translateY entrance effect

### 8.2 Navigation

- `components/portfolio/navigation.tsx`: Fixed header, scroll-aware styling (glassmorphism when scrolled)
- `components/portfolio/nav-menu-panel.tsx`: Full-screen overlay menu via `createPortal`
- Hamburger icon morphs to X with CSS transitions
- Menu links stagger in with blur + translateY
- Body scroll is locked when menu is open
- **Hidden on internal blog pages** (`isInternalBlogPage` check)

### 8.3 Theme Toggle

- `components/ui/theme-toggle.tsx`
- `"icon"` variant: Custom SVG sun/moon with motion path animations (used in navbar)
- `"text"` variant: Shows "Light" / "Dark" text

### 8.4 Hero Badge

- `components/portfolio/hero-badge.tsx`
- Interactive inline badge with spring physics
- On press: scale down; on release: particle burst of icon copies
- Configurable `burstIcon`, `hoverRotate`, and color classes
- Respects `useReducedMotion()`

### 8.5 Footer

- `components/portfolio/footer.tsx`
- Social links: GitHub, LinkedIn, X (Remix Icon Fill variants)
- Commit SHA badge linking to GitHub commit (from `NEXT_PUBLIC_COMMIT_SHA`)
- Uses `section-inner` for consistent max-width

---

## 9. Content Collections Configuration

File: `content-collections.ts`

```ts
// Posts: Markdown files in content/posts/*.md
// Gists: MDX files in content/gist/*.mdx
```

- Posts use `compileMDX` only if needed (currently raw content passed to Streamdown).
- Gists use `compileMDX` with `remarkGfm`, `rehypeCode`, and `remarkHeading`.
- Both collections use Zod for schema validation.
- Gists compute `readingTime` via `reading-time` library.

---

## 10. Environment Variables

Validated via `@t3-oss/env-nextjs` in `lib/env.ts`:

| Variable | Type | Purpose |
|----------|------|---------|
| `NEXT_PUBLIC_CLARITY_ID` | client | Microsoft Clarity project ID |
| `NEXT_PUBLIC_GA_ID` | client | Google Analytics measurement ID |
| `CLARITY_API_TOKEN` | server | Optional Clarity API token |
| `NEXT_PUBLIC_COMMIT_SHA` | client | Git commit SHA for footer link |

Load `.env.local` for the gist script (`lib/scripts/gists.ts` reads it manually since it runs outside Next.js).

---

## 11. Writing & Copy Guidelines

- **Never use em dashes (—)** in any prose, UI copy, or content. Use commas, colons, periods, or restructure the sentence instead.
- Prefer sentence case for headings.
- Use `text-balance` and `text-pretty` on headings and paragraphs.
- Keep link text descriptive and actionable ("View my work" not "Click here").

---

## 12. Git Guidelines

- Never attribute AI as co-author in commits or PRs.
- Only commit when explicitly asked.
- Never push unless explicitly asked.
- Prefer atomic commits with clear messages describing the "why".

---

## 13. How to Update This File

After completing any task that introduces or modifies:

1. **New dependencies**: Add to Section 2 (Stack) with version and purpose.
2. **New file patterns**: Add to Section 3 (File Structure).
3. **New commands**: Add to Section 4.
4. **New styling conventions**: Add to Section 5.3.
5. **New animation patterns**: Add to Section 6.
6. **New features/pages**: Add to Section 7.
7. **New components**: Add to Section 8.
8. **New env vars**: Add to Section 10.
9. **New writing rules**: Add to Section 11.

If a convention is **replaced**, mark the old one as deprecated with a strikethrough and add the new one immediately below it. Do not delete old conventions without explicit user confirmation, as they may apply to legacy code.

**This file was last comprehensively updated based on a full repository analysis.**
