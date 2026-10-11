# Agent Instructions

## Self-Healing Feedback Loop

After making code changes, run the fastest loop that can catch and fix issues, in order:

1. `pnpm format` — apply project formatting (Prettier).
2. `pnpm check` — catch TypeScript diagnostics (`tsc --noEmit`).
3. `pnpm build` — generate resources and validate the static Next.js export.

If any command fails, fix the reported issue and rerun the failed command before continuing. Do not hand off with a failing command.

Run `pnpm verify` before final handoff. It runs `format:check`, TypeScript diagnostics, and the production build — the same gate to keep `main` always green.

Keep pre-commit fast: it only runs `lint-staged` (Prettier on staged files). The heavier `check` + `build` validation lives in `pnpm verify` and CI.

## Project Notes

- Next.js App Router static export (`output: "export"`). Route dispatch and localized root layout live in `src/app/[[...path]]`; page views live in `src/views`, with shared chrome in `src/layouts/Layout.tsx`.
- Content lives in Markdown/MDX collections loaded by `src/lib/content-build.tsx`. `scripts/generate.ts` renders them into `.generated/content.json` and writes public Markdown resources. `src/lib/content.tsx` reads that manifest in Server Components. `src/content/` is excluded from Prettier — do not reformat authored content.
- SEO is centralized in `src/lib/seo.ts` (`siteConfig`, `sitePages`, structured-data builders). Sitemap priorities and `robots.txt` derive from it — update there, not in scattered files.
- Package manager is **pnpm**. Use `pnpm`, never `npm`/`npx`.
- Match the surrounding style: 2-space indentation, double quotes, semicolons. Prettier enforces this.
- Prefer small, targeted changes that reuse existing layout, content, and SEO patterns.

## Lighthouse Verification

Run `pnpm lighthouse` to audit **mobile + desktop** in one pass. It builds, serves `dist`, drives Lighthouse through its Node API for both form factors, and prints each category score plus every audit below 100%. Each form factor runs 3 times and the **median** run is reported so scores don't jitter between runs.

The work is split into three composable TypeScript modules (run directly via Node's type stripping, no build step):

- `scripts/serve-dist.ts` — exports `startServer()`, a static `dist` server that gzips responses and mirrors the `vercel.json` headers so the local run matches production. Run it directly (`node scripts/serve-dist.ts [port]`) to just serve.
- `scripts/lighthouse-runner.ts` — exports `withChrome`, `runOnce`, `runMedian`, `scores`, and `gapsByCategory`. Knows nothing about serving: give it any URL and a Chrome port and it audits it.
- `scripts/lighthouse.ts` — the CLI that composes the two (build → serve → audit → report).

- `pnpm lighthouse --no-build` — reuse the existing `dist` (skip the rebuild).
- `pnpm lighthouse --runs 5` — change how many runs the median is taken over (default 3; use 1 for a quick smoke test).
- `pnpm lighthouse --url https://milindmishra.com/` — audit production directly instead of the local build.
- `PUBLIC_DISABLE_ANALYTICS=true pnpm build` then `pnpm lighthouse --no-build` — measure the code's own ceiling with third-party analytics excluded.

Interpreting results:

- The local server is HTTP/1.1, so Lighthouse's lantern simulation over-penalizes **mobile** (inflated FCP/LCP vs production's HTTP/3). Trust **desktop** locally; use `--url` (or PageSpeed Insights) for the real mobile picture.
- `Analytics.tsx` loads GA4 + Clarity only on first user interaction, so they stay out of the audit trace — don't "fix" this by eagerly loading them.
- Response headers (HSTS, CSP, X-Frame-Options, COOP, etc.) live in **`vercel.json`** — the site is on Vercel (Cloudflare only proxies the domain). A Cloudflare `public/_headers` file is ignored. Update `vercel.json`, and keep `scripts/serve-dist.ts`'s parser in sync if the header shape changes.
- **Fonts:** Inter and Noto Sans Devanagari are self-hosted in `public/fonts`, with the original metric-matched fallbacks in `src/styles/fonts.css`. The OG-image cards use static TTF fonts in `src/assets/fonts` for `next/og`.
- Best-Practices is capped below 100 by Cloudflare's injected bot script (`/cdn-cgi/challenge-platform/...`, the `deprecations` audit) — that is a Cloudflare dashboard setting (Bot Fight Mode / JavaScript Detections), not a code issue. Don't chase it in the repo.

## Migration verification

`pnpm test:migration` verifies route/resource parity against the checked-in manifest, semantic content, and OG/story image hashes. Run `pnpm test:content` against the current export too. `pnpm build` writes Next output to `out` and mirrors it to `dist` for the existing audit tools.
