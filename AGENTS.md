# Agent Instructions

## Self-Healing Feedback Loop

After making code changes, run the fastest loop that can catch and fix issues, in order:

1. `pnpm format` — apply project formatting (Prettier).
2. `pnpm check` — catch TypeScript diagnostics (`tsc --noEmit`).
3. `pnpm build` — generate resources and validate the production Next.js build.

If any command fails, fix the reported issue and rerun the failed command before continuing. Do not hand off with a failing command.

Run `pnpm verify` before final handoff. It runs filename lint, `format:check`, TypeScript diagnostics, and the production build — the same gate to keep `main` always green.

Keep pre-commit fast: it only runs `lint-staged` (filename lint and Prettier on staged files). The heavier `check` + `build` validation lives in `pnpm verify` and CI.

## Project Notes

- Every authored filename must use lowercase kebab-case, including components, content, images, fonts, and documentation. Dotfiles and compound extensions such as `next-env.d.ts` and `content.test.ts` are supported. `AGENTS.md` is the only reserved-name exception so agents can discover these instructions. Next.js route directories such as `[slug]` and `(en)` retain their framework syntax; this rule applies to filenames, not directories. Run `pnpm lint` to check tracked and non-ignored untracked files. Generated output and dependencies are excluded through Git ignore rules. Filename lint runs on staged files before commit and in `pnpm verify`/CI.

- Next.js App Router with standard Vercel deployment. All localized pages share `src/app/[locale]/[[...path]]/page.tsx` and one locale-aware root layout. `src/lib/page-routes.ts` is the typed view registry and enumerates prerendered locale/path combinations; add pages there rather than duplicating locale wrappers. English URLs stay unprefixed through rewrites in `src/lib/routing.ts`, Hindi stays under `/hi`, and direct `/en` aliases redirect to the public English URL. Shared document markup lives in `src/layouts/document-layout.tsx`, page chrome in `src/layouts/layout.tsx`, and content views in `src/views`.
- Content lives in Markdown/MDX collections loaded by `src/lib/content-build.tsx`. `scripts/generate.ts` renders them into `.generated/content.json` and writes public Markdown resources. `src/lib/content.tsx` reads that manifest in Server Components. `src/content/` is excluded from Prettier — do not reformat authored content.
- SEO is centralized in `src/lib/seo.ts` (`siteConfig`, `sitePages`, structured-data builders). Sitemap priorities and `robots.txt` derive from it. Native route metadata is built by `src/lib/metadata.ts` — update these centralized helpers, not scattered tags.
- Package manager is **pnpm**. Use `pnpm`, never `npm`/`npx`.
- Use Node 24 LTS or newer and the pinned pnpm version in `package.json`. Run `pnpm test:libraries` when changing content schemas, analytics configuration, enhancement lifecycle, or Lighthouse median selection. Markdown/MDX is trusted repository-authored content, never untrusted user input. All trackers must respect `PUBLIC_DISABLE_ANALYTICS`; PostHog requires a token and masks inputs. Keep client enhancements typed and scope their listeners, timers, and observers.
- Match the surrounding style: 2-space indentation, double quotes, semicolons. Prettier enforces this.
- Prefer small, targeted changes that reuse existing layout, content, and SEO patterns.

## Lighthouse Verification

Run `pnpm lighthouse` to audit **mobile + desktop** in one pass. It builds, starts the production Next.js server, drives Lighthouse through its Node API for both form factors, and prints each category score plus every audit below 100%. Each form factor runs 3 times and the **median** run is reported so scores don't jitter between runs.

The work is split into three composable TypeScript modules (run directly via Node's type stripping, no build step):

- `scripts/serve-next.ts` — exports `startServer()`, starting `next start` so local audits and tests exercise the actual routing, headers, and optimizer. Run it directly (`node scripts/serve-next.ts [port]`) to serve an existing production build.
- `scripts/lighthouse-runner.ts` — exports `withChrome`, `runOnce`, `runMedian`, `scores`, and `gapsByCategory`. Knows nothing about serving: give it any URL and a Chrome port and it audits it.
- `scripts/lighthouse.ts` — the CLI that composes the two (build → serve → audit → report).

- `pnpm lighthouse --no-build` — reuse the existing `.next` build (skip the rebuild).
- `pnpm lighthouse --runs 5` — change how many runs the median is taken over (default 3; use 1 for a quick smoke test).
- `pnpm lighthouse --url https://milindmishra.com/` — audit production directly instead of the local build.
- `PUBLIC_DISABLE_ANALYTICS=true pnpm build` then `pnpm lighthouse --no-build` — measure the code's own ceiling with third-party analytics excluded.

Interpreting results:

- The local server is HTTP/1.1, so Lighthouse's lantern simulation over-penalizes **mobile** (inflated FCP/LCP vs production's HTTP/3). Trust **desktop** locally; use `--url` (or PageSpeed Insights) for the real mobile picture.
- `analytics.tsx` loads GA4 + Clarity only on first user interaction, so they stay out of the audit trace — don't "fix" this by eagerly loading them.
- Response headers, redirects, and Markdown negotiation live in **`src/lib/routing.ts`**, consumed by `next.config.ts`. The site is on Vercel (Cloudflare only proxies the domain). `vercel.json` only selects Next.js and the build command.
- **Fonts:** Inter and Noto Sans Devanagari use `next/font/local` with the existing self-hosted font files and original metric-matched fallbacks in `src/styles/fonts.css`. The OG-image cards use static TTF fonts in `src/assets/fonts` for `next/og`.
- Best-Practices is capped below 100 by Cloudflare's injected bot script (`/cdn-cgi/challenge-platform/...`, the `deprecations` audit) — that is a Cloudflare dashboard setting (Bot Fight Mode / JavaScript Detections), not a code issue. Don't chase it in the repo.

## Migration verification

`pnpm test:migration` verifies route/resource parity against the checked-in manifest, semantic content, and OG/story image hashes. Run `pnpm test:content`, `pnpm test:i18n`, and `pnpm test:pwa` against the current production build too. The i18n tests verify public-route parity, prerendering, locale metadata, default-locale redirects, unknown-route 404s, and resource routing. Tests start isolated `next start` processes and validate real HTTP responses; no static export or `dist` mirror is needed.
