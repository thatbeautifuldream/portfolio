import { createHash } from "node:crypto";
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
