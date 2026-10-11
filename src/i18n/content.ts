import { getCollection } from "../lib/content";
import type { Locale } from ".";

const translations = {
  posts: { hi: "hiPosts" },
  gists: { hi: "hiGists" },
  projects: { hi: "hiProjects" },
  uses: { hi: "hiUses" },
} as const;

// English entries with each one swapped for its translation when one exists,
// so every English slug also has a page in the other locale.
export async function getLocalizedCollection<
  T extends keyof typeof translations,
>(name: T, locale: Locale) {
  const entries = await getCollection(name);
  if (locale === "en") return entries;
  const translated = new Map(
    (await getCollection(translations[name][locale])).map((entry) => [
      entry.id,
      entry,
    ]),
  );
  return entries.map(
    (entry) => (translated.get(entry.id) as typeof entry | undefined) ?? entry,
  );
}
