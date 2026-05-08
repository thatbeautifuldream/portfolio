import { defineCollection, defineConfig } from "@content-collections/core"
import { compileMDX } from "@content-collections/mdx"
import {
  type RehypeCodeOptions,
  rehypeCode,
  remarkGfm,
  remarkHeading,
} from "fumadocs-core/mdx-plugins"
import readingTime from "reading-time"
import { z } from "zod"

const rehypeCodeOptions: RehypeCodeOptions = {
  themes: {
    light: "github-light",
    dark: "github-dark-default",
  },
}

const posts = defineCollection({
  name: "posts",
  directory: "content/posts",
  include: "*.md",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    content: z.string(),
    category: z.string(),
    date: z.string(),
    coverImage: z.string().optional(),
  }),
  transform: (document) => {
    return {
      ...document,
      slug: document._meta.path.replace(/\.md$/, ""),
    }
  },
})

const gists = defineCollection({
  name: "gists",
  directory: "content",
  include: "gist/*.mdx",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    content: z.string(),
    date: z.coerce.date().optional(),
    datePublished: z.coerce.date().optional(),
    slug: z.string().optional(),
    tags: z.string().optional(),
    gistId: z.string(),
    gistUrl: z.string(),
    isPublic: z.boolean(),
  }),
  transform: async (page, context) => {
    const body = await compileMDX(context, page, {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [[rehypeCode, rehypeCodeOptions], remarkHeading],
    })

    const gistDate = page.datePublished || page.date || new Date()

    return {
      ...page,
      date: new Date(gistDate),
      body,
      slug: page.slug || page._meta.path,
      readingTime: readingTime(page.content).text,
    }
  },
})

export default defineConfig({
  content: [posts, gists],
})
