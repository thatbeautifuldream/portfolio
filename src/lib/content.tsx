import fs from "node:fs/promises";
export interface EntryData {
  title: string;
  description?: string;
  date: Date;
  datePublished?: Date;
  category: string;
  coverImage?: { src: string; width: number; height: number };
  url: string;
  gistId: string;
  gistUrl: string;
  isPublic: boolean;
  tags?: string;
}
export interface CollectionEntry<T = string> {
  id: string;
  collection: T;
  data: EntryData;
  body: string;
  html: string;
}
let entries: Promise<Record<string, CollectionEntry[]>> | undefined;
async function load() {
  entries ??= fs
    .readFile(".generated/content.json", "utf8")
    .then((text) =>
      JSON.parse(text, (key, value) =>
        ["date", "datePublished"].includes(key) && typeof value === "string"
          ? new Date(value)
          : value,
      ),
    );
  return entries;
}
export async function getCollection<T extends string>(
  name: T,
): Promise<CollectionEntry<T>[]> {
  return [...(await load())[name]!] as CollectionEntry<T>[];
}
