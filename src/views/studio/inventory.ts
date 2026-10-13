export const inventory = [
  { file: "about-headline", group: "about", variants: ["localized-headline"] },
  { file: "about-motion", group: "about", variants: ["interactive-morph"] },
  { file: "analytics", omitted: "Loads real analytics; no isolated provider." },
  { file: "analytics-client", omitted: "Loads real tracking scripts." },
  {
    file: "client-enhancement",
    group: "code",
    variants: ["enhancement-lifecycle"],
  },
  { file: "code-copy", group: "code", variants: ["copy-code"] },
  { file: "content", group: "content", variants: ["html", "image-html"] },
  { file: "email-link", group: "email", variants: ["english", "hindi"] },
  { file: "footer", group: "footer", variants: ["localized-footer"] },
  {
    file: "git-hub-chart",
    omitted: "Fetches live GitHub data with no fixture API.",
  },
  {
    file: "index-list",
    group: "index-list",
    variants: ["plain", "metadata", "grouped", "external", "empty"],
  },
  {
    file: "page-header",
    group: "page-header",
    variants: ["title", "metadata", "children"],
  },
  { file: "posthog", omitted: "Initializes a live analytics client." },
  {
    file: "pwa-registration",
    omitted:
      "Nonvisual service-worker registration; existing document mounts its development no-op.",
  },
  {
    file: "site-link",
    group: "links",
    variants: ["internal", "external", "hash", "download", "email"],
  },
  { file: "theme-transition", group: "theme", variants: ["light-dark"] },
  { file: "tooltip", group: "tooltip", variants: ["label", "metadata"] },
] as const;

export const primitiveInventory = [
  {
    file: "src/lib/ui.tsx",
    group: "icons",
    variants: ["inline", "small", "large", "accessible"],
  },
  {
    file: "src/lib/ui.tsx",
    group: "images",
    variants: ["optimized", "intrinsic", "fallback"],
  },
] as const;
