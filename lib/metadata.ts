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
}

export function createMetadata({
  title,
  description,
  canonical,
  image,
  ogType = "home",
  slug,
}: MetadataOptions): Metadata {
  const siteUrl = "https://milindmishra.com"

  let ogImageUrl: string
  if (image) {
    ogImageUrl = image
  } else if (ogType === "blog-post" && slug) {
    ogImageUrl = `${siteUrl}/api/og?type=blog&slug=${slug}`
  } else {
    ogImageUrl = `${siteUrl}/api/og?type=${ogType}`
  }

  return {
    title,
    description,
    alternates: {
      canonical: canonical,
    },
    openGraph: {
      title,
      description,
      type: "article",
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
