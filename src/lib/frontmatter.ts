import { parseDocument } from "yaml";

export function parseFrontmatter(source: string) {
  const match = source.match(
    /^\uFEFF?---\r?\n([\s\S]*?)\r?\n(?:---|\.\.\.)(?:\r?\n|$)/,
  );
  if (!match) throw new Error("Content must start with YAML frontmatter");
  const document = parseDocument(match[1]!, { uniqueKeys: true });
  if (document.errors.length) throw document.errors[0];
  const data: unknown = document.toJS({ maxAliasCount: 100 });
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("Frontmatter must be a YAML mapping");
  }
  return { data, content: source.slice(match[0].length) };
}
