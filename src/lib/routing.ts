import type { NextConfig } from "next";
import { sitePages } from "./seo";
import { defaultLocale } from "../i18n";
const securityPolicy =
  "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; frame-src 'self' https://jsonvisualiser.com https://markdownvisualizer.com; img-src 'self' data: https:; font-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://*.clarity.ms https://static.cloudflareinsights.com https://us.i.posthog.com https://us-assets.i.posthog.com; worker-src 'self' blob:; connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.clarity.ms https://c.bing.com https://cloudflareinsights.com https://us.i.posthog.com https://us-assets.i.posthog.com";
export const headers: NonNullable<NextConfig["headers"]> = async () => [
  {
    source: "/:path*",
    headers: [
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
      {
        key: "Permissions-Policy",
        value: "browsing-topics=(), interest-cohort=()",
      },
      {
        key: "Content-Security-Policy",
        value:
          process.env.NODE_ENV === "development"
            ? securityPolicy
                .replace("script-src 'self'", "script-src 'self' 'unsafe-eval'")
                .replace("connect-src 'self'", "connect-src 'self' ws: wss:")
            : securityPolicy,
      },
      { key: "Vary", value: "Accept, Accept-Encoding" },
    ],
  },
  {
    source: "/:path((?!(?:en/|hi/)?canvas/embed(?:/preview)?/?$).*)",
    headers: [{ key: "X-Frame-Options", value: "DENY" }],
  },
  {
    source: "/sw.js",
    headers: [
      { key: "Content-Type", value: "application/javascript; charset=utf-8" },
      { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
      {
        key: "Content-Security-Policy",
        value: "default-src 'self'; script-src 'self'",
      },
    ],
  },
  {
    source: "/fonts/:path*",
    headers: [
      { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
    ],
  },
  ...["/canvas/preview", "/:locale(en|hi)/canvas/preview"].map((source) => ({
    source,
    headers: [
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      {
        key: "Content-Security-Policy",
        value: (process.env.NODE_ENV === "development"
          ? securityPolicy
              .replace("script-src 'self'", "script-src 'self' 'unsafe-eval'")
              .replace("connect-src 'self'", "connect-src 'self' ws: wss:")
          : securityPolicy
        ).replace("frame-ancestors 'none'", "frame-ancestors 'self'"),
      },
    ],
  })),
  ...[
    "/canvas/embed",
    "/:locale(en|hi)/canvas/embed",
    "/canvas/embed/preview",
    "/:locale(en|hi)/canvas/embed/preview",
  ].map((source) => ({
    source,
    headers: [
      { key: "X-Robots-Tag", value: "noindex, nofollow" },
      {
        key: "Content-Security-Policy",
        value: (process.env.NODE_ENV === "development"
          ? securityPolicy
              .replace("script-src 'self'", "script-src 'self' 'unsafe-eval'")
              .replace("connect-src 'self'", "connect-src 'self' ws: wss:")
          : securityPolicy
        ).replace(
          "frame-ancestors 'none'",
          "frame-ancestors 'self' https://x.com https://*.x.com https://twitter.com https://*.twitter.com",
        ),
      },
    ],
  })),
];
export const redirects: NonNullable<NextConfig["redirects"]> = async () => [
  {
    source: `/${defaultLocale}/:path*`,
    destination: "/:path*/",
    permanent: true,
  },
  {
    source: "/whatsapp",
    destination: "https://wa.me/919631333128",
    permanent: true,
  },
  { source: "/about.md", destination: "/index.md", permanent: true },
  {
    source: "/markdown-visualizer/:path*",
    destination: "/project/markdown-visualizer",
    permanent: true,
  },
  {
    source: "/json-visualiser/:path*",
    destination: "/project/json-visualiser",
    permanent: true,
  },
  { source: "/about", destination: "/", permanent: true },
  { source: "/studio", destination: "/canvas/", permanent: true },
  { source: "/studio/", destination: "/canvas/", permanent: true },
  { source: "/studio/:path*", destination: "/canvas/:path*", permanent: true },
  { source: "/hi/studio", destination: "/hi/canvas/", permanent: true },
  { source: "/hi/studio/", destination: "/hi/canvas/", permanent: true },
  {
    source: "/hi/studio/:path*",
    destination: "/hi/canvas/:path*",
    permanent: true,
  },
];
export const rewrites: NonNullable<NextConfig["rewrites"]> = async () => ({
  beforeFiles: [
    { source: "/canvas", destination: "/en/canvas" },
    { source: "/canvas/og.png", destination: "/en/canvas/og.png" },
    { source: "/canvas/embed", destination: "/en/canvas/embed" },
    {
      source: "/canvas/embed/preview",
      destination: "/en/canvas/embed/preview",
    },
    {
      source: "/canvas/preview",
      destination: "/en/canvas/preview",
    },
    {
      source: "/",
      has: [{ type: "header", key: "accept", value: "text/markdown.*" }],
      destination: "/index.md",
    },
    {
      source: "/hi",
      has: [{ type: "header", key: "accept", value: "text/markdown.*" }],
      destination: "/index.md",
    },
    {
      source: "/hi/:path((?!api(?:/|$)|_next/|.*\\.[^/]+$)[^/]+(?:/[^/]+)*)",
      has: [{ type: "header", key: "accept", value: "text/markdown.*" }],
      destination: "/:path.md",
    },
    {
      source: "/:path((?!api(?:/|$)|_next/|.*\\.[^/]+$)[^/]+(?:/[^/]+)*)",
      has: [{ type: "header", key: "accept", value: "text/markdown.*" }],
      destination: "/:path.md",
    },
    ...sitePages.map(({ path }) => ({
      source: path,
      destination: `/${defaultLocale}${path === "/" ? "" : path}`,
    })),
    {
      source: "/:section(blog|gist|project|uses)/:slug([^/.]+)",
      destination: `/${defaultLocale}/:section/:slug`,
    },
  ],
  afterFiles: [
    {
      source: "/resume",
      destination:
        "https://cdn.jsdelivr.net/gh/thatbeautifuldream/resume-tex/resume.pdf",
    },
  ],
  fallback: [],
});
