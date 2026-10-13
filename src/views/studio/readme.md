# Studio

Run `pnpm dev`, then visit `/studio/` (English) or
`/hi/studio/` (Hindi). This route returns 404 outside development and
is not part of the public page registry, sitemap, or production navigation.

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

Only the camera is persisted under `portfolio:studio:camera` (version
2). Version 1 camera values migrate; unknown or invalid storage falls back to
fit-all. Storage failures are harmless. Reset changes the camera only and leaves
component state intact.

Existing camera data under the old `portfolio:component-canvas:camera` key
migrates to the Studio key. Zoom supports 1%–300% so fit-all includes the entire
image gallery even on narrow screens. Click an image to focus its preview.

The gallery derives from the same `getOGPages` and `getStoryPages` registries as
the real image routes: all existing OG cards (including the default site card),
English/Hindi story cards, and both dedicated Studio cards. Groups contain up to
four images with titles, locale, dimensions, and exact resource paths. They use
the real local image endpoints, not live services or placeholder artwork.

Localized titles, descriptions, authors, canonical/hreflang links, Open Graph,
Twitter cards, and CollectionPage structured data use the centralized SEO and
metadata helpers. `/studio/og.png` and `/hi/studio/og.png` reuse the existing OG
renderer. Studio remains development-only, noindex/nofollow, and excluded from
the public page registry and sitemap; its metadata does not make it public.

AboutMotion and Tooltip measure viewport coordinates, so AboutHeadline, Tooltip,
and Footer (which contains tooltips) run in same-origin preview documents. CodeCopy
also uses a document so the existing viewport-wide prose styles stay contained. This
keeps native measurements correct under canvas transforms. These frames share
the existing theme toggle and link policy; heights follow the real content.
No component DOM or browser API is patched.

Only these new preview-document routes allow same-origin framing in development.
All existing routes and all production responses retain the original framing
restrictions.

Next.js development indicators are disabled through its public configuration so
each preview document does not put a developer-tools launcher over the sample.

`inventory.ts` lists supported examples and safety omissions. The inventory and
camera math/storage checks run through `pnpm test:libraries`, including in the
shared CI and Husky gate. Analytics, PostHog, and the live GitHub chart are not
mounted. Service-worker registration is the existing document's development
no-op. There are no modal or portal components to preview.
