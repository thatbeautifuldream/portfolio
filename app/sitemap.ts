import type { MetadataRoute } from "next"
import { allPosts, allGists } from "content-collections"

const SITE_URL = "https://milindmishra.com"

const staticRoutes: { url: string; lastModified: Date }[] = [
  { url: SITE_URL, lastModified: new Date() },
  { url: `${SITE_URL}/work`, lastModified: new Date() },
  { url: `${SITE_URL}/projects`, lastModified: new Date() },
  { url: `${SITE_URL}/talks`, lastModified: new Date() },
  { url: `${SITE_URL}/blog`, lastModified: new Date() },
  { url: `${SITE_URL}/gist`, lastModified: new Date() },
  { url: `${SITE_URL}/tweets`, lastModified: new Date() },
  { url: `${SITE_URL}/contact`, lastModified: new Date() },
  { url: `${SITE_URL}/guestbook`, lastModified: new Date() },
  { url: `${SITE_URL}/spotify`, lastModified: new Date() },
  { url: `${SITE_URL}/wakatime`, lastModified: new Date() },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseEntries = staticRoutes.map((route) => ({
    url: route.url,
    lastModified: route.lastModified,
  }))

  const postEntries = allPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: (() => {
      const d = new Date(post.date)
      return Number.isNaN(d.getTime()) ? new Date() : d
    })(),
  }))

  const gistEntries = allGists.map((gist) => ({
    url: `${SITE_URL}/gist/${gist.slug}`,
    lastModified: gist.date instanceof Date ? gist.date : new Date(),
  }))

  return [...baseEntries, ...postEntries, ...gistEntries]
}
