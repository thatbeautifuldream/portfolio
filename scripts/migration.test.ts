import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import test from "node:test";
import { isDeepStrictEqual } from "node:util";
import { apiSignature, sitemapSignature } from "./resource-parity";
import { fromHtml } from "hast-util-from-html";

const baseline = JSON.parse(
  await fs.readFile("scripts/fixtures/astro-parity.json", "utf8"),
);
function text(node: any): string {
  return node?.type === "text"
    ? node.value
    : (node?.children ?? []).map(text).join("");
}
function summarize(html: string) {
  const elements: any[] = [];
  function walk(node: any) {
    if (node.type === "element") elements.push(node);
    for (const child of node.children ?? []) walk(child);
  }
  walk(fromHtml(html));
  const content: any[] = [];
  function visit(node: any) {
    if (node.type === "element") {
      if (node.properties?.className?.includes("gh-chart")) return;
      if (
        ["h1", "h2", "h3", "h4", "p", "pre", "table", "iframe", "a"].includes(
          node.tagName,
        )
      ) {
        content.push({
          tag: node.tagName,
          text: node.tagName === "iframe" ? "" : text(node).replace(/\s/g, ""),
          href: node.properties?.href,
          src: node.tagName === "iframe" ? node.properties?.src : undefined,
        });
      }
    }
    for (const child of node.children ?? []) visit(child);
  }
  const main = elements.find((e) => e.tagName === "main");
  if (main) visit(main);
  const meta = Object.fromEntries(
    elements
      .filter(
        (e) =>
          e.tagName === "meta" && (e.properties.name || e.properties.property),
      )
      .map((e) => [
        e.properties.name ?? e.properties.property,
        e.properties.content,
      ]),
  );
  delete meta.generator;
  const links = elements
    .filter(
      (e) =>
        e.tagName === "link" &&
        ["canonical", "alternate"].includes(e.properties.rel?.[0]),
    )
    .map((e) => ({
      rel: e.properties.rel[0],
      href: e.properties.href,
      lang: e.properties.hrefLang,
      type: e.properties.type,
    }));
  return JSON.parse(
    JSON.stringify({
      title: text(elements.find((e) => e.tagName === "title")),
      lang: elements.find((e) => e.tagName === "html")?.properties.lang,
      meta,
      links,
      content,
      structuredData: elements
        .filter(
          (e) =>
            e.tagName === "script" &&
            e.properties.type === "application/ld+json",
        )
        .map((e) => JSON.parse(text(e))),
    }),
  );
}

test("all Astro page routes retain their content and SEO", async () => {
  const differences: string[] = [];
  for (const [file, expected] of Object.entries(baseline.pages)) {
    if (file === "whatsapp/index.html") continue; // Hosting redirect in vercel.json.
    try {
      const actual = summarize(
        await fs.readFile(path.join("dist", file), "utf8"),
      );
      for (const key of [
        "title",
        "lang",
        "meta",
        "links",
        "content",
        "structuredData",
      ]) {
        if (!isDeepStrictEqual(actual[key], (expected as any)[key])) {
          differences.push(`${file}: ${key}`);
        }
      }
    } catch (error) {
      differences.push(`${file}: ${String(error)}`);
    }
  }
  await fs.writeFile(
    "/tmp/portfolio-migration-differences.json",
    JSON.stringify(differences, null, 2),
  );
  assert.deepEqual(differences, []);
});

test("every public machine-readable resource and OG image exists", async () => {
  const missing: string[] = [];
  const resourceDifferences: string[] = [];
  for (const [file, hash] of Object.entries(baseline.resources)) {
    try {
      const bytes = await fs.readFile(path.join("dist", file));
      if (
        file !== "sitemap-0.xml" &&
        /\.(png|md|txt|xml)$/.test(file) &&
        createHash("sha256").update(bytes).digest("hex") !== hash
      )
        resourceDifferences.push(file);
    } catch {
      missing.push(file);
    }
  }
  assert.deepEqual(missing, []);
  assert.deepEqual(resourceDifferences, []);
});

test("JSON API fields and rendered content preserve the Astro contract", async () => {
  const differences: string[] = [];
  for (const [file, expected] of Object.entries(baseline.apiSignatures)) {
    const actual = apiSignature(
      JSON.parse(await fs.readFile(path.join("dist", file), "utf8")),
    );
    if (actual !== expected) differences.push(file);
  }
  assert.deepEqual(differences, []);
});

test("sitemap retains every URL, priority, frequency, and language alternate", async () => {
  assert.equal(
    sitemapSignature(await fs.readFile("dist/sitemap-0.xml", "utf8")),
    baseline.sitemapSignature,
  );
});
