import fs from "node:fs/promises";
import type {
  CollectionEntry,
  CollectionName,
  ContentManifest,
} from "./content-schema";
export type { CollectionEntry } from "./content-schema";

let entries: Promise<ContentManifest> | undefined;
async function load(): Promise<ContentManifest> {
  entries ??= fs
    .readFile(".generated/content.json", "utf8")
    .then(
      (text) =>
        JSON.parse(text, (key, value) =>
          ["date", "datePublished"].includes(key) && typeof value === "string"
            ? new Date(value)
            : value,
        ) as ContentManifest,
    );
  return entries;
}
export async function getCollection<Name extends CollectionName>(
  name: Name,
): Promise<CollectionEntry<Name>[]> {
  return [...(await load())[name]] as CollectionEntry<Name>[];
}
