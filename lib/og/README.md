# Dynamic OG Images

This portfolio uses Satori and Next.js ImageResponse to generate dynamic Open Graph images for social media sharing.

## Structure

```
lib/og/
├── config.ts          # OG image configuration
├── font.ts            # Font loading utility
└── templates/
    ├── base.tsx       # Base template component
    ├── home.tsx       # Home page OG
    ├── blog-post.tsx  # Individual blog posts
    ├── blog-index.tsx # Blog listing page
    ├── projects.tsx   # Projects page
    ├── work.tsx       # Work experience page
    ├── talks.tsx      # Talks page
    └── contact.tsx    # Contact page

app/api/og/
└── route.tsx          # API route for generating OG images
```

## Usage

OG images are generated dynamically via the API route:

```
/api/og?type=home
/api/og?type=blog
/api/og?type=blog-post&slug=post-slug
/api/og?type=projects
/api/og?type=work
/api/og?type=talks
/api/og?type=contact
```

## Design System

- **Theme:** Dark mode only
- **Colors:** Black background (#0a0a0a), white/off-white text (#fafafa, #a3a3a3)
- **Font:** Inter SemiBold with OpenType features
- **Layout:** Minimal, editorial aesthetic with no gradients or decorative elements
- **Size:** 1200x630px (standard OG image dimensions)

## Integration

The `createMetadata` function in `lib/metadata.ts` automatically generates OG image URLs based on the page type:

```typescript
createMetadata({
  title: "Page Title",
  description: "Page description",
  ogType: "blog-post",
  slug: "post-slug", // Only for blog posts
})
```

## Fonts

Inter fonts are stored in `public/fonts/`:

- Inter-Regular.woff2
- Inter-SemiBold.woff2

Fonts are loaded via the Edge runtime API route.
