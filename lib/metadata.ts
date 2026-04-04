import type { Metadata } from "next";

type MetadataOptions = {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
};

export function createMetadata({
  title,
  description,
  canonical,
  image,
}: MetadataOptions): Metadata {
  const siteUrl = "https://milind.app";
  const defaultImage = `${siteUrl}/og.png`;

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
          url: image || defaultImage,
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
      images: [image || defaultImage],
    },
  };
}
