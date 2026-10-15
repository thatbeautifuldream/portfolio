import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { createHash } from "node:crypto";
import test, { after } from "node:test";
import { startServer, resourcePath } from "./serve-next";
const server = await startServer();
after(() => server.close());
async function readResource(file: string) {
  const response = await fetch(new URL(resourcePath(file), server.url));
  assert.equal(response.status, file.startsWith("404") ? 404 : 200, file);
  return Buffer.from(await response.arrayBuffer());
}
import sharp from "sharp";
import { isDeepStrictEqual } from "node:util";
import { sitemapSignature } from "./resource-parity";
import { siteConfig, canvasPath } from "../src/lib/seo";
import { fromHtml } from "hast-util-from-html";

const baseline = JSON.parse(
  await fs.readFile("scripts/fixtures/astro-parity.json", "utf8"),
);
const nativeOG = JSON.parse(
  await fs.readFile("scripts/fixtures/next-og.json", "utf8"),
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
      links: links.sort((a, b) =>
        JSON.stringify(a).localeCompare(JSON.stringify(b)),
      ),
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
      const actual = summarize((await readResource(file)).toString());
      for (const key of [
        "title",
        "lang",
        "meta",
        "links",
        "content",
        "structuredData",
      ]) {
        // Next Link applies trailingSlash to internal hrefs. The two forms
        // address the same prerendered page; preserve all other content fields.
        const normalize = (value: any) => {
          if (key === "content")
            return value.map((item: any) => ({
              ...item,
              text:
                (file === "index.html" || file === "hi/index.html") &&
                item.tag === "p"
                  ? item.text
                      .replace(
                        /^Updated[A-Z][a-z]{2}\d{1,2},\d{4}$/,
                        "Updated<build-date>",
                      )
                      .replace(
                        /^अपडेट:\d{1,2}[^\d]+\d{4}$/,
                        "अपडेट:<build-date>",
                      )
                      .replace(
                        /^[\d,]+(?=contributionsinthelastyear)/,
                        "<contributions>",
                      )
                      .replace(
                        /(?<=पिछलेएकसालमें)[\d,]+(?=कॉन्ट्रिब्यूशन)/,
                        "<contributions>",
                      )
                  : item.text,
              href:
                typeof item.href === "string" && item.href.startsWith("/")
                  ? item.href.replace(/\/(?=[?#]|$)/, "")
                  : item.href,
            }));
          // Native metadata normalizes canonical/language URLs to trailingSlash.
          // URL identity, keywords, and every other SEO field remain unchanged.
          if (key === "links")
            return value
              .map((item: any) => ({
                ...item,
                href: item.type ? item.href : item.href.replace(/\/$/, ""),
              }))
              .sort((a: any, b: any) =>
                JSON.stringify(a).localeCompare(JSON.stringify(b)),
              );
          if (key === "meta")
            return { ...value, "og:url": value["og:url"]?.replace(/\/$/, "") };
          return value;
        };
        if (
          !isDeepStrictEqual(
            normalize(actual[key]),
            normalize((expected as any)[key]),
          )
        ) {
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
      const bytes = await readResource(file);
      if (
        file !== "sitemap-0.xml" &&
        !nativeOG[file] &&
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

test("sitemap adds Canvas while retaining every migrated URL and language alternate", async () => {
  const sitemap = (await readResource("sitemap-0.xml")).toString();
  const canvasURLs = ["en", "hi"].map(
    (locale) => siteConfig.url + canvasPath(locale as "en" | "hi"),
  );
  const canvasEntries = [...sitemap.matchAll(/<url>(.*?)<\/url>/g)].filter(
    (match) =>
      canvasURLs.some((url) => match[1]!.includes(`<loc>${url}</loc>`)),
  );
  assert.equal(canvasEntries.length, 2);
  const migratedSitemap = canvasEntries.reduce(
    (xml, entry) => xml.replace(entry[0], ""),
    sitemap,
  );
  assert.equal(sitemapSignature(migratedSitemap), baseline.sitemapSignature);
});

test("native Next.js OG and story routes retain their reviewed design", async () => {
  const expectedURLs = Object.keys(baseline.resources).filter(
    (file) => file === "og.png" || /^(og|share)\//.test(file),
  );
  assert.deepEqual(Object.keys(nativeOG).sort(), expectedURLs.sort());
  for (const [file, expected] of Object.entries(nativeOG) as [
    string,
    { sha256: string; width: number; height: number },
  ][]) {
    const bytes = await readResource(file);
    const meta = await sharp(bytes).metadata();
    assert.equal(meta.format, "png", file);
    assert.equal(meta.width, file.startsWith("share/") ? 1080 : 1200, file);
    assert.equal(meta.height, file.startsWith("share/") ? 1920 : 630, file);
    assert.equal(
      createHash("sha256").update(bytes).digest("hex"),
      expected.sha256,
      file,
    );
    const pixel = await sharp(bytes)
      .extract({ left: 0, top: 0, width: 1, height: 1 })
      .removeAlpha()
      .raw()
      .toBuffer();
    assert.deepEqual([...pixel], [253, 253, 252], file);
  }
});

test("content images use native blur placeholders and retain responsive sources", async () => {
  const images = JSON.parse(
    await fs.readFile(".generated/images.json", "utf8"),
  );
  const bySrc = new Map(
    Object.values(images).map((image: any) => [image.src, image]),
  );
  for (const image of bySrc.values()) {
    if (!image.blurDataURL) continue;
    const preview = Buffer.from(image.blurDataURL.split(",")[1], "base64");
    const metadata = await sharp(preview).metadata();
    assert.ok(metadata.width! <= 10 && metadata.height! <= 10);
    assert.ok(preview.length < 1024, "placeholder should stay tiny");
  }
  let checked = 0;
  for (const file of Object.keys(baseline.pages)) {
    if (file === "whatsapp/index.html") continue;
    function walk(node: any) {
      const optimizedURL =
        node.tagName === "img" &&
        node.properties.src?.startsWith("/_next/image")
          ? new URL(node.properties.src, server.url)
          : undefined;
      const image =
        optimizedURL && bySrc.get(optimizedURL.searchParams.get("url"));
      if (image?.blurDataURL) {
        checked++;
        assert.equal(node.properties.dataNimg, "1", file);
        assert.match(node.properties.style, /background-image:url\(/, file);
        assert.equal(node.properties.width, image.width, file);
        assert.equal(node.properties.height, image.height, file);
        assert.match(node.properties.srcSet, /\/_next\/image\/?\?/);
        assert.equal(node.properties.sizes, image.sizes, file);
      }
      for (const child of node.children ?? []) walk(child);
    }
    walk(fromHtml((await readResource(file)).toString()));
  }
  assert.ok(checked > 0, "check rendered images, including Markdown images");
});

test("native image endpoint resizes content images", async () => {
  const images = JSON.parse(
    await fs.readFile(".generated/images.json", "utf8"),
  );
  const image: any = Object.values(images).find(
    (image: any) => image.width > 640 && image.blurDataURL,
  );
  assert.ok(image);
  const response = await fetch(
    new URL(
      `/_next/image?url=${encodeURIComponent(image.src)}&w=640&q=75`,
      server.url,
    ),
    { headers: { Accept: "image/webp" } },
  );
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type")!, /image\/webp/);
  const metadata = await sharp(
    Buffer.from(await response.arrayBuffer()),
  ).metadata();
  assert.equal(metadata.width, 640);
});
