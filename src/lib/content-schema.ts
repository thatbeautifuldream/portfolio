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

export type CollectionName = keyof typeof contentSchemas;
export interface CoverImage {
  src: string;
  width: number;
  height: number;
}
type ProcessedData<Data> = Omit<Data, "coverImage"> &
  ("coverImage" extends keyof Data ? { coverImage?: CoverImage } : unknown);
export type CollectionData = {
  [Name in CollectionName]: ProcessedData<
    z.output<(typeof contentSchemas)[Name]>
  >;
};
export type CollectionEntry<Name extends CollectionName = CollectionName> = {
  [Key in Name]: {
    id: string;
    collection: Key;
    data: CollectionData[Key];
    body: string;
    html: string;
  };
}[Name];
export type ContentManifest = {
  [Name in CollectionName]: CollectionEntry<Name>[];
};
