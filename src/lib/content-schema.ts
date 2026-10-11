import { z } from "zod";

const dated = {
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
};
const post = z.object({
  ...dated,
  category: z.string(),
  coverImage: z.string().optional(),
});
const gist = z.object({
  title: z.string(),
  description: z.string().optional(),
  date: z.coerce.date().optional(),
  datePublished: z.coerce.date().optional(),
  slug: z.string().optional(),
  tags: z.string().optional(),
  gistId: z.string(),
  gistUrl: z.string(),
  isPublic: z.boolean(),
});
const project = z.object({ ...dated, url: z.string() });
const use = z.object({
  ...dated,
  category: z.string(),
  url: z.string().optional(),
  coverImage: z.string().optional(),
});
export const contentSchemas = {
  posts: post,
  hiPosts: post,
  gists: gist,
  hiGists: gist,
  projects: project,
  hiProjects: project,
  uses: use,
  hiUses: use,
};
