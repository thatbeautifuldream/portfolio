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
  {
    file: "content",
    omitted: "Prose HTML is composed on real pages; omitted from canvas.",
  },
  { file: "email-link", group: "email", variants: ["localized"] },
  { file: "footer", group: "footer", variants: ["localized-footer"] },
  {
    file: "git-hub-chart",
    omitted: "Fetches live GitHub data with no fixture API.",
  },
  {
    file: "index-list",
    group: "index-list",
    variants: ["plain"],
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
      "Nonvisual service-worker registration; the shared document mounts the site's normal registration (a no-op in development).",
  },
  {
    file: "site-link",
    omitted: "Composed inside PageHeader and Footer on canvas.",
  },
  {
    file: "theme-transition",
    omitted: "Hosted on DocumentLayout; toggled from the canvas toolbar.",
  },
  {
    file: "tooltip",
    omitted: "Composed inside Footer on canvas.",
  },
  {
    file: "tooltip-shell",
    omitted: "Shared tooltip markup on the canvas toolbar controls.",
  },
] as const;

export const primitiveInventory = [] as const;
