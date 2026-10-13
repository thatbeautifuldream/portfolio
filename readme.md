# Milind's portfolio

Next.js App Router portfolio with prerendered pages, English and Hindi content, Markdown/MDX articles, raw Markdown for each page, and native React view transitions and Next.js-generated social images.

Use Node 24 LTS (or newer) and pnpm 12.11.2, pinned in `package.json`. CI verifies every push and pull request on Node 24. Run `pnpm install --frozen-lockfile` for reproducible installs. Native build scripts are explicitly allowed for Sharp and esbuild; core-js's optional postinstall is disabled.

Markdown/MDX is trusted, repository-authored code: raw HTML is intentionally supported and MDX evaluation can execute JavaScript during generation. Never feed untrusted submissions into this pipeline. Frontmatter uses YAML parsing and collection-specific Zod validation; compiler dependencies are development-only, and Server Components read the generated manifest rather than compiling content per request.

Analytics are deferred until interaction or the 10-second idle fallback. `PUBLIC_DISABLE_ANALYTICS=true` disables Google Analytics, Clarity, and PostHog. PostHog additionally requires `PUBLIC_POSTHOG_PROJECT_TOKEN` and masks input values in session recordings. Only public tracking configuration is passed to client code. DOM enhancements use typed React effects with explicit listener, timer, observer, and DOM cleanup rather than injected JavaScript strings.

Security fixes for transitive `source-map-js` and `fflate` are scoped in `pnpm-workspace.yaml`. Keep these overrides until upstream dependency ranges include the patched versions, then rerun `pnpm audit` and the regression suite before removing them. Satori's renderer version stays pinned to its existing minor range to preserve the reviewed Hindi OG image output.

All authored filenames use lowercase kebab-case, including source, content, assets, and documentation. Dotfiles and compound extensions are allowed; `AGENTS.md` retains its reserved spelling for agent discovery. Framework route directories (`[slug]`, `(en)`) are unaffected. `pnpm lint` checks tracked and non-ignored untracked files; pre-commit checks staged filenames and `pnpm verify` enforces the rule in CI. Run `pnpm test:filenames` to test the rule.

Husky pre-commit first formats and checks staged files with `pnpm lint-staged`, then runs `pnpm verify:ci`, the same full gate used by GitHub Actions: dependency audit, filename/format checks, TypeScript, a production build, and every regression test. Any failure blocks the commit. This checks the working tree and takes longer than the old formatting-only hook; keep staged and unstaged changes consistent and do not bypass it.

| Command               | Purpose                                                                                               |
| --------------------- | ----------------------------------------------------------------------------------------------------- |
| `pnpm install`        | Install dependencies                                                                                  |
| `pnpm dev`            | Generate content/resources and start Next.js on port 4321                                             |
| `pnpm check`          | Check TypeScript                                                                                      |
| `pnpm build`          | Generate content/resources and build Next.js for Vercel                                               |
| `pnpm preview`        | Run the production Next.js server on port 4321                                                        |
| `pnpm lint`           | Enforce kebab-case filenames across the project                                                       |
| `pnpm verify`         | Filename lint, formatting, TypeScript, and production build                                           |
| `pnpm verify:ci`      | Full CI/pre-commit gate: dependency audit, verification build, and every regression test              |
| `pnpm test:hooks`     | Validate pre-commit sequencing, failure blocking, and the shared CI command                           |
| `pnpm test:content`   | Validate Markdown resources, removed endpoints, and Next.js routing rules                             |
| `pnpm test:libraries` | Validate analytics opt-out, effect cleanup, content parsing, and Lighthouse median selection          |
| `pnpm test:migration` | Compare every migrated route with the captured Astro baseline, plus native OG image regression checks |
| `pnpm lighthouse`     | Audit mobile and desktop builds                                                                       |

All localized pages share `src/app/[locale]/[[...path]]/page.tsx` and one locale-aware layout. The typed registry in `src/lib/page-routes.ts` maps routes to separate views and enumerates locale/path combinations for `generateStaticParams`; unknown locales, paths, and slugs return 404. English URLs remain unprefixed through configuration rewrites, Hindi stays under `/hi`, and direct `/en` aliases redirect to the public English URL. Add pages to the registry rather than creating locale-specific route wrappers. Shared document markup lives in `src/layouts/document-layout.tsx`, content views in `src/views`, reusable UI in `src/components`, and authored content in `src/content`. `scripts/generate.ts` compiles content and writes raw Markdown to `public`; RSS and robots.txt remain dedicated App Router Route Handlers. Generated output is ignored by Git. Run `pnpm test:i18n` against the production build to verify locale routing, prerendering, metadata, and resource parity.

SEO uses Next.js `generateMetadata`, with a shared builder in `src/lib/metadata.ts` and site identity in `src/lib/seo.ts`. Redirects, Markdown negotiation, security headers, and service-worker caching rules live in `src/lib/routing.ts`, consumed by `next.config.ts`. Vercel uses its native Next.js integration; there is no static export or `dist` copy. Local tests and Lighthouse start the actual production server through `scripts/serve-next.ts`.

Images use the native Next.js optimizer and responsive source sets, with tiny blur placeholders for content images. Inter and Noto Sans Devanagari use `next/font/local` with the same font files and metric-matched fallbacks. React Strict Mode is enabled. Portfolio links use the Next.js router and React ViewTransition, preserving cross-blur navigation and the diagonal theme wipe. Downloads and external destinations retain browser navigation. Enhancement scopes clean up listeners, timers, observers, and generated code-copy controls when effects replay or pages unmount; analytics remain deferred.

OG and story images are prerendered by App Router Route Handlers using `next/og` ImageResponse. They retain the existing URLs, dimensions, palette, fonts, and layout. Hindi cards use current Satori/HarfBuzz shaping before ImageResponse composition because Next.js bundles an older Satori version. PNG encoding and rasterization differ from the original CanvasKit output.

The migration baseline in `scripts/fixtures/astro-parity.json` captures page content/metadata and resource hashes before the framework change. The native OG fixture records the reviewed renderer output separately. Intentional future content, SEO, or image design edits require updating the matching expectations.

Displayed calendar dates and year groups use `siteConfig.location.timezone` through `src/lib/dates.ts`, not the build host's timezone. This keeps local, CI, and production page content identical; machine-readable ISO timestamps remain unchanged.

The PWA setup follows [Better T Stack’s Next.js template](https://github.com/AmanVarshney01/create-better-t-stack/tree/f552531400912cc275e39499f3349084c099485a/packages/template-generator/templates/addons/pwa/apps/web/next). The production-only worker precaches a standalone offline page and uses the network for document navigation; it does not cache portfolio pages or Next.js router responses. Run `pnpm test:pwa` after building to check installation resources, worker lifecycle, offline fallback, and Next.js headers. Bump the worker cache version whenever changing `public/offline.html`.
