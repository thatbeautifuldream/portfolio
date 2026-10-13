import { getCollection } from "../lib/content";
import type { CollectionEntry } from "../lib/content-schema";
import type { Locale } from ".";

const translations = {
  posts: { hi: "hiPosts" },
  gists: { hi: "hiGists" },
  projects: { hi: "hiProjects" },
  uses: { hi: "hiUses" },
} as const;

type LocalizedCollection<Name extends keyof typeof translations> =
  CollectionEntry<Name | (typeof translations)[Name]["hi"]>;

// English entries with each one swapped for its translation when one exists,
// so every English slug also has a page in the other locale.
export async function getLocalizedCollection<
  T extends keyof typeof translations,
>(name: T, locale: Locale): Promise<LocalizedCollection<T>[]> {
  const entries = await getCollection(name);
  if (locale === "en") return entries as LocalizedCollection<T>[];
  const translated = new Map(
    (await getCollection(translations[name][locale])).map((entry) => [
      entry.id,
      entry,
    ]),
  );
  return entries.map(
    (entry) => translated.get(entry.id) ?? entry,
  ) as LocalizedCollection<T>[];
}
