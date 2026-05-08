import type { Metadata } from "next"

type MetadataOptions = {
  title: string
  description: string
  canonical?: string
  image?: string
  ogType?:
    | "home"
    | "blog"
    | "blog-post"
    | "projects"
    | "work"
    | "talks"
    | "contact"
    | "tweets"
  slug?: string
  keywords?: string[]
  noIndex?: boolean
}

const siteUrl = "https://milindmishra.com"

const articleTypes = new Set(["blog-post", "blog", "tweets", "work", "talks"])

export function createMetadata({
  title,
  description,
  canonical,
  image,
  ogType = "home",
  slug,
  keywords,
  noIndex,
}: MetadataOptions): Metadata {
  let ogImageUrl: string
  if (image) {
    ogImageUrl = image
  } else if (ogType === "blog-post" && slug) {
    ogImageUrl = `${siteUrl}/api/og/blog/${slug}`
  } else if (ogType === "tweets") {
    ogImageUrl = `${siteUrl}/api/og/blog`
  } else {
    ogImageUrl = `${siteUrl}/api/og/${ogType}`
  }

  return {
    title,
    description,
    alternates: {
      canonical: canonical,
    },
    keywords: keywords,
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      type: articleTypes.has(ogType) ? "article" : "website",
      url: canonical,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  }
}
