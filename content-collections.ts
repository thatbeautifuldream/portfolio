import { defineCollection, defineConfig } from "@content-collections/core";
import { z } from "zod";

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
  }),
  transform: (document) => {
    return {
      ...document,
      slug: document._meta.path.replace(/\.md$/, ""),
    };
  },
});

export default defineConfig({
  content: [posts],
});
