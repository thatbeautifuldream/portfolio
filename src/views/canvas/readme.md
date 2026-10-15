# Canvas

Run `pnpm dev`, then visit `/canvas/` (English) or `/hi/canvas/` (Hindi). These
routes, their isolated previews, and dedicated OG images are also publicly
accessible in production. Canvas uses dedicated routes and is not part of the
portfolio page registry or primary navigation. Both locales allow search
indexing and appear in the sitemap. Legacy `/studio/` URLs permanently redirect
here.

The canvas wraps existing components without editing their source. Its inventory
accounts for every module in `src/components`, plus `Icon` and `Image`. Page views
are compositions rather than additional standalone widgets. `DocumentLayout`
provides the real fonts, styles, and theme host. The shared page `Layout` is not
mounted because it also mounts tracking clients.

Pan empty space with a mouse, trackpad, or touch. Control/Command-wheel zooms
around the cursor; two touches on empty space pinch. Focus the canvas itself to
use arrows, +/−, F (fit), or 0 (reset). Preview controls retain native input.
The fixed toolbar has zoom, fit, reset, and the existing theme toggle. Groups
cannot be dragged. The browser title on the shell also describes these controls.

Hash links to groups move the camera. Other preview links, including downloads,
external destinations, and mail links, are intercepted without navigation.
Clipboard buttons copy only when explicitly activated. EmailLink uses its own
repository-authored public contact address, not a private account or credential.

Only the camera is persisted under `portfolio:canvas:camera` (version 2). Older
`portfolio:studio:camera` and `portfolio:component-canvas:camera` values
migrate automatically. Unknown or invalid storage falls back to fit-all. Storage
failures are harmless. Reset changes the camera only and leaves component state
intact.

Zoom supports 1%–300% so fit-all includes every component group even on narrow
screens.

Localized titles, descriptions, authors, canonical/hreflang links, Open Graph,
Twitter cards, and CollectionPage structured data use the centralized SEO and
metadata helpers. `/canvas/og.png` and `/hi/canvas/og.png` reuse the existing OG
renderer. Canvas allows indexing and includes both locales with language
alternates in the sitemap. Isolated preview documents remain noindex/nofollow
and excluded from the sitemap to avoid duplicate component pages.

## X Player Card embed

Canvas public sharing metadata advertises an experimental X Player Card with the
existing OG image as its poster and a 640 × 640 HTTPS player URL at
`/canvas/embed/` (or `/hi/canvas/embed/`). The embed reuses the real component
samples, starts focused on PageHeader, and keeps its camera in memory without
reading or overwriting the standalone Canvas camera. The standard toolbar and
theme toggle remain usable in small frames.

Embedded samples use `/canvas/embed/preview/`, which reuses the existing
allowlisted preview renderer. Only the embed and its nested preview routes
permit frame ancestors from the same origin and HTTPS X/Twitter domains.
These routes omit X-Frame-Options because DENY and SAMEORIGIN both block an
external X ancestor. Ordinary Canvas still denies framing; its ordinary preview
documents retain SAMEORIGIN. Production CSP never includes development eval
or WebSocket allowances. Embed documents are noindex/nofollow, canonicalize to
the ordinary Canvas page, and remain absent from the sitemap.

Next metadata emits the native player card, title, image, and description. Only
the player URL and dimensions use `other`: Next's typed player descriptor requires
a media stream URL and this app is not an audio/video stream. No fake stream URL
or duplicate card tag is emitted. No packages or tracking clients are added.
Actual rendering inside X requires testing a real post; metadata and browser
iframe checks do not establish X client support or approval.

AboutMotion and Tooltip measure viewport coordinates, so AboutHeadline, Tooltip,
and Footer (which contains tooltips) run in same-origin preview documents. CodeCopy
also uses a document so the existing viewport-wide prose styles stay contained. This
keeps native measurements correct under canvas transforms. These frames share
the existing theme toggle and link policy; heights follow the real content.
No component DOM or browser API is patched.

Ordinary Canvas preview documents allow only same-origin framing. Apart from
the scoped embed exceptions above, all other routes retain the original framing
restrictions. Production preview CSP does not include development-only
unsafe-eval or WebSocket allowances.

Next.js development indicators are disabled through its public configuration so
each preview document does not put a developer-tools launcher over the sample.

`inventory.ts` lists supported examples and safety omissions. The inventory and
camera math/storage checks run through `pnpm test:libraries`, including in the
shared CI and Husky gate. Analytics, PostHog, and the live GitHub chart are not
mounted. The shared document retains the site's normal service-worker
registration in production (a no-op in development). There are no modal or
portal components to preview.
