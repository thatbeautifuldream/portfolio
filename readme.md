# Milind's portfolio

Next.js App Router portfolio with prerendered pages, English and Hindi content, Markdown/MDX articles, raw Markdown for each page, and native React view transitions and Next.js-generated social images.

Use Node 22.12+ and pnpm.

All authored filenames use lowercase kebab-case, including source, content, assets, and documentation. Dotfiles and compound extensions are allowed; `AGENTS.md` retains its reserved spelling for agent discovery. Framework route directories (`[slug]`, `(en)`) are unaffected. `pnpm lint` checks tracked and non-ignored untracked files; pre-commit checks staged filenames and `pnpm verify` enforces the rule in CI. Run `pnpm test:filenames` to test the rule.

| Command               | Purpose                                                                                               |
| --------------------- | ----------------------------------------------------------------------------------------------------- |
| `pnpm install`        | Install dependencies                                                                                  |
| `pnpm dev`            | Generate content/resources and start Next.js on port 4321                                             |
| `pnpm check`          | Check TypeScript                                                                                      |
| `pnpm build`          | Generate content/resources and build Next.js for Vercel                                               |
| `pnpm preview`        | Run the production Next.js server on port 4321                                                        |
| `pnpm lint`           | Enforce kebab-case filenames across the project                                                       |
| `pnpm verify`         | Filename lint, formatting, TypeScript, and production build                                           |
| `pnpm test:content`   | Validate Markdown resources, removed endpoints, and Next.js routing rules                             |
| `pnpm test:migration` | Compare every migrated route with the captured Astro baseline, plus native OG image regression checks |
| `pnpm lighthouse`     | Audit mobile and desktop builds                                                                       |

Explicit page routes live in `src/app/(en)` and `src/app/hi`, preserving the English and Hindi URLs. Each locale has a root layout sharing `src/layouts/document-layout.tsx`; content views live in `src/views`, reusable UI in `src/components`, and authored content in `src/content`. Dynamic article routes use `generateStaticParams` and reject unknown slugs. `scripts/generate.ts` compiles content and writes raw Markdown to `public`; RSS and robots.txt are App Router Route Handlers. Generated output is ignored by Git.

SEO uses Next.js `generateMetadata`, with a shared builder in `src/lib/metadata.ts` and site identity in `src/lib/seo.ts`. Redirects, Markdown negotiation, security headers, and service-worker caching rules live in `src/lib/routing.ts`, consumed by `next.config.ts`. Vercel uses its native Next.js integration; there is no static export or `dist` copy. Local tests and Lighthouse start the actual production server through `scripts/serve-next.ts`.

Images use the native Next.js optimizer and responsive source sets, with tiny blur placeholders for content images. Inter and Noto Sans Devanagari use `next/font/local` with the same font files and metric-matched fallbacks. React Strict Mode is enabled. Portfolio links use the Next.js router and React ViewTransition, preserving cross-blur navigation and the diagonal theme wipe. Downloads and external destinations retain browser navigation. Enhancement scopes clean up listeners, timers, observers, and generated code-copy controls when effects replay or pages unmount; analytics remain deferred.

OG and story images are prerendered by App Router Route Handlers using `next/og` ImageResponse. They retain the existing URLs, dimensions, palette, fonts, and layout. Hindi cards use current Satori/HarfBuzz shaping before ImageResponse composition because Next.js bundles an older Satori version. PNG encoding and rasterization differ from the original CanvasKit output.

The migration baseline in `scripts/fixtures/astro-parity.json` captures page content/metadata and resource hashes before the framework change. The native OG fixture records the reviewed renderer output separately. Intentional future content, SEO, or image design edits require updating the matching expectations.

The PWA setup follows [Better T Stack’s Next.js template](https://github.com/AmanVarshney01/create-better-t-stack/tree/f552531400912cc275e39499f3349084c099485a/packages/template-generator/templates/addons/pwa/apps/web/next). The production-only worker precaches a standalone offline page and uses the network for document navigation; it does not cache portfolio pages or Next.js router responses. Run `pnpm test:pwa` after building to check installation resources, worker lifecycle, offline fallback, and Next.js headers. Bump the worker cache version whenever changing `public/offline.html`.
