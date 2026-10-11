import { fromHtml } from "hast-util-from-html";
import { createHash } from "node:crypto";
function text(node: any): string {
  return node.type === "text"
    ? node.value
    : (node.children ?? []).map(text).join("");
}
export function apiSignature(input: unknown): string {
  function normalize(value: any, key = ""): any {
    if (key === "html")
      return text(fromHtml(value, { fragment: true })).replace(/\s/g, "");
    if (typeof value === "string")
      return value.replace(
        /\/_astro\/([^/]+)\.[\w-]+\.(png|jpe?g|webp|avif)/g,
        "/content-assets/$1.$2",
      );
    if (Array.isArray(value)) return value.map((v) => normalize(v));
    if (value && typeof value === "object")
      return Object.fromEntries(
        Object.keys(value)
          .sort()
          .map((k) => [k, normalize(value[k], k)]),
      );
    return value;
  }
  return createHash("sha256")
    .update(JSON.stringify(normalize(input)))
    .digest("hex");
}

// Alternate-link order has no semantic effect; compare each complete URL entry.
export function sitemapSignature(xml: string): string {
  const entries = [...xml.matchAll(/<url>(.*?)<\/url>/g)]
    .map(([, body]) => {
      const links = [...body!.matchAll(/<xhtml:link[^>]*\/>/g)]
        .map((match) => match[0])
        .sort();
      return body!.replace(/<xhtml:link[^>]*\/>/g, "") + links.join("");
    })
    .sort();
  return createHash("sha256").update(JSON.stringify(entries)).digest("hex");
}
