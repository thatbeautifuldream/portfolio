import type { Locale } from "../i18n";

export type SitePage = {
  path: string;
  changefreq: "weekly" | "monthly";
  priority: number;
};

export const siteConfig = {
  name: "Milind Kumar Mishra",
  shortName: "Milind Mishra",
  tagline: "Product engineer building AI-native interfaces",
  description:
    "Product engineer building AI-native interfaces, product systems, and tools people return to.",
  url: "https://milindmishra.com",
  language: "en",
  locale: "en_US",
  themeColor: "#0a0a0a",
  defaultImage: "/og.png",
  twitter: "@milindmishra_",
  // Centralized identity — the single source of truth so author name,
  // email, and location never drift between pages and structured data.
  email: "hey@milindmishra.com",
  location: {
    city: "Bengaluru",
    region: "Karnataka",
    country: "India",
    countryCode: "IN",
    /** IANA timezone, used for availability windows and schema. */
    timezone: "Asia/Kolkata",
    /** Human-readable offset label for the homepage availability block. */
    timezoneLabel: "IST (UTC+5:30)",
  },
  currentRole: {
    title: "Product Engineer",
    company: "Merlin AI",
    url: "https://www.getmerlin.in",
  },
  sameAs: [
    "https://github.com/thatbeautifuldream",
    "https://www.linkedin.com/in/mishramilind/",
    "https://x.com/milindmishra_",
  ],
  alumniOf: [
    {
      name: "Visvesvaraya Technological University",
      url: "https://www.vtu.ac.in/",
      area: "Electronics and Communication",
      studyType: "Bachelor of Engineering",
    },
    {
      name: "National Yang Ming Chiao Tung University",
      url: "https://www.nycu.edu.tw/",
      area: "Computer Software Engineering",
      studyType: "Short Term Research Program",
    },
  ],
} as const;

export const canvasCopy = {
  en: {
    title: "Canvas",
    description:
      "Explore Milind Mishra's real interface components and localized variants on an interactive canvas.",
  },
  hi: {
    title: "कैनवास",
    description:
      "मिलिंद मिश्रा के इंटरफ़ेस कंपोनेंट और स्थानीयकृत रूप एक इंटरैक्टिव कैनवास पर देखें।",
  },
} as const;

export const canvasSitePage = {
  path: "/canvas",
  changefreq: "monthly",
  priority: 0.4,
} satisfies SitePage;

export function canvasPath(locale: Locale) {
  return locale === "hi" ? "/hi/canvas/" : "/canvas/";
}

export function canvasImagePath(locale: Locale) {
  return `${canvasPath(locale)}og.png`;
}

export function canvasEmbedPath(locale: Locale) {
  return `${canvasPath(locale)}embed/`;
}

export const canvasPlayerSize = { width: 640, height: 640 } as const;

export function buildCanvasSchema(locale: Locale) {
  const copy = canvasCopy[locale];
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${siteConfig.shortName} · ${copy.title}`,
    description: copy.description,
    url: new URL(canvasPath(locale), siteConfig.url).href,
    inLanguage: locale,
    author: buildPersonRef(),
    isPartOf: { "@id": `${siteConfig.url}/#website` },
  };
}

export const sitePages = [
  { path: "/", changefreq: "weekly", priority: 1.0 },
  { path: "/work", changefreq: "monthly", priority: 0.9 },
  { path: "/blog", changefreq: "weekly", priority: 0.8 },
  { path: "/gist", changefreq: "weekly", priority: 0.8 },
  { path: "/project", changefreq: "monthly", priority: 0.8 },
  { path: "/talks", changefreq: "monthly", priority: 0.7 },
  { path: "/uses", changefreq: "monthly", priority: 0.6 },
  { path: "/contact", changefreq: "monthly", priority: 0.6 },
  { path: "/privacy", changefreq: "monthly", priority: 0.4 },
] satisfies SitePage[];

export const defaultKeywords = [
  "product engineer",
  "design engineer",
  "AI interfaces",
  "frontend engineer",
  "React",
  "motion design",
  "Milind Mishra",
];

export function normalizePath(path: string) {
  if (path === "/") return path;
  return path.replace(/\/$/, "");
}

export function getSitePage(path: string) {
  const normalized = normalizePath(path);
  if (normalized === canvasSitePage.path) return canvasSitePage;
  if (normalized.startsWith("/blog/"))
    return { path: normalized, changefreq: "monthly", priority: 0.7 } as const;
  if (normalized.startsWith("/gist/"))
    return { path: normalized, changefreq: "monthly", priority: 0.6 } as const;
  if (normalized.startsWith("/project/"))
    return { path: normalized, changefreq: "monthly", priority: 0.8 } as const;
  return sitePages.find((page) => page.path === normalized);
}

export function getSiteOrigin(site?: URL | null) {
  return new URL(site?.toString() ?? siteConfig.url).origin;
}

export function absoluteUrl(path: string, site?: URL | null) {
  return new URL(path, `${getSiteOrigin(site)}/`).toString();
}

/**
 * Minimal Person reference for embedded `author` fields. Use this inside
 * Article/Blog/etc. schemas so every page points at the same `@id` and the
 * canonical Person entity, instead of re-declaring a free-standing one.
 */
export function buildPersonRef(site?: URL | null) {
  const origin = getSiteOrigin(site);
  return {
    "@type": "Person",
    "@id": `${origin}/#person`,
    name: siteConfig.name,
    url: `${origin}/`,
  };
}

export function buildPersonSchema(site?: URL | null) {
  const origin = getSiteOrigin(site);
  const { city, region, country } = siteConfig.location;

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${origin}/#person`,
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    givenName: "Milind",
    familyName: "Mishra",
    url: `${origin}/`,
    image: absoluteUrl(siteConfig.defaultImage, site),
    jobTitle: siteConfig.currentRole.title,
    description: siteConfig.description,
    email: `mailto:${siteConfig.email}`,
    gender: "Male",
    nationality: {
      "@type": "Country",
      name: country,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: city,
      addressRegion: region,
      addressCountry: country,
    },
    knowsAbout: [
      "Product engineering",
      "AI-native interfaces",
      "Design engineering",
      "React",
      "TypeScript",
      "Motion design",
      "Design systems",
    ],
    knowsLanguage: [
      { "@type": "Language", name: "English", alternateName: "en" },
      { "@type": "Language", name: "Hindi", alternateName: "hi" },
    ],
    alumniOf: siteConfig.alumniOf.map((school) => ({
      "@type": "EducationalOrganization",
      name: school.name,
      url: school.url,
      department: { "@type": "Organization", name: school.area },
    })),
    worksFor: {
      "@type": "Organization",
      name: siteConfig.currentRole.company,
      url: siteConfig.currentRole.url,
    },
    sameAs: [...siteConfig.sameAs],
  };
}

export function buildOrganizationSchema(site?: URL | null) {
  const origin = getSiteOrigin(site);
  const { city, region, country } = siteConfig.location;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${origin}/#organization`,
    name: siteConfig.name,
    url: `${origin}/`,
    description: siteConfig.description,
    sameAs: [...siteConfig.sameAs],
    contactPoint: {
      "@type": "ContactPoint",
      email: siteConfig.email,
      contactType: "professional inquiries",
      availableLanguage: ["English"],
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: city,
      addressRegion: region,
      addressCountry: country,
    },
  };
}
export function buildWebsiteSchema(site?: URL | null) {
  const origin = getSiteOrigin(site);

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${origin}/#website`,
    name: siteConfig.name,
    url: `${origin}/`,
    description: siteConfig.description,
    inLanguage: siteConfig.language,
    publisher: { "@id": `${origin}/#person` },
  };
}

/**
 * Google's recommended type for a personal site homepage. `ProfilePage`
 * paired with `Person` is what drives the Knowledge Panel and gives AI
 * assistants a clear "this is a person" signal to cite.
 */
export function buildProfilePageSchema(site?: URL | null) {
  const origin = getSiteOrigin(site);

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${origin}/#profilepage`,
    url: `${origin}/`,
    name: `${siteConfig.name} · ${siteConfig.currentRole.title}`,
    description: siteConfig.description,
    inLanguage: siteConfig.language,
    isPartOf: { "@id": `${origin}/#website` },
    mainEntity: {
      "@id": `${origin}/#person`,
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: absoluteUrl(siteConfig.defaultImage, site),
    },
    about: { "@id": `${origin}/#person` },
  };
}
