import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test, { after } from "node:test";
import { rewrites, redirects, headers } from "../src/lib/routing";
import { startServer, resourcePath } from "./serve-next.ts";
const server = await startServer();
after(() => server.close());

const root = new URL("../", import.meta.url);

async function readDist(path: string) {
  const response = await fetch(new URL(resourcePath(path), server.url));
  assert.equal(response.status, path.startsWith("404") ? 404 : 200, path);
  return response.text();
}

async function readRoot(path: string) {
  return readFile(new URL(path, root), "utf8");
}

test("homepage exposes semantic content without JavaScript", async () => {
  const html = await readDist("index.html");
  const content = html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  assert.match(html, /<h1\b/);
  assert.match(html, /<h2[^>]*>\s*Projects\s*<\/h2>/);
  assert.match(html, /<h2[^>]*>\s*More\s*<\/h2>/);
  assert.ok(content.length >= 500);
});

test("homepage includes complete organization identity data", async () => {
  const html = await readDist("index.html");

  assert.match(html, /"@type":"Organization"/);
  assert.match(html, /"contactPoint"/);
  assert.match(html, /"contactType":"professional inquiries"/);
  assert.match(html, /"address":\{"@type":"PostalAddress"/);
});

test("404 page contains simple recovery links", async () => {
  const html = await readDist("404.html");

  assert.match(html, /Read the blog/);
  assert.match(html, /\/index\.md/);
  assert.doesNotMatch(html, /href="\/docs/);
});

test("robots explicitly allows major AI crawlers", async () => {
  const robots = await readDist("robots.txt");

  for (const crawler of [
    "GPTBot",
    "ChatGPT-User",
    "ClaudeBot",
    "Google-Extended",
    "Applebot-Extended",
    "DeepSeekBot",
    "ora-agent",
  ]) {
    assert.match(robots, new RegExp(`User-agent: ${crawler}`));
  }
});

test("markdown representation and discovery guidance are published", async () => {
  const markdown = await readDist("index.md");
  const pages = await Promise.all(
    ["blog.md", "gist.md", "uses.md"].map(readDist),
  );

  assert.match(markdown, /^# Milind Kumar Mishra/m);
  assert.doesNotMatch(markdown, /\/api\/|\/docs|\/openapi\.json/);
  assert.match(pages[0], /^# Blog/m);
  assert.match(pages[1], /^# Gists/m);
  assert.match(pages[2], /^# Uses/m);
  assert.doesNotMatch(markdown, /llms(?:-full)?\.txt/);
});
test("resume is available as direct Markdown content", async () => {
  const resume = await readDist("resume.md");
  const gist = await readDist("gist/resume/index.html");

  assert.match(resume, /^# Milind Kumar Mishra/m);
  assert.match(resume, /Merlin AI by Foyer/);
  assert.match(resume, /130\+ tagged releases/);
  assert.match(resume, /x\.com\/milindmishra_/);
  assert.doesNotMatch(resume, /^```/m);
  assert.match(gist, /Merlin AI by Foyer/);
  assert.match(gist, /x\.com\/milindmishra_/);
});

test("trust anchor pages contain substantive content", async () => {
  for (const path of ["index.html", "privacy/index.html"]) {
    const html = await readDist(path);
    const text = html
      .replace(/<script[\s\S]*?<\/script>/g, " ")
      .replace(/<style[\s\S]*?<\/style>/g, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    assert.ok(text.length >= 500, `${path} should contain at least 500 chars`);
  }
});

test("Next routing declares Markdown negotiation and existing redirects", async () => {
  const rules = await rewrites();
  assert.ok(!Array.isArray(rules));
  const before = !Array.isArray(rules) ? (rules.beforeFiles ?? []) : [];
  assert.ok(
    before.some(
      (rule) => rule.source === "/" && rule.destination === "/index.md",
    ),
  );
  assert.ok(
    before.some(
      (rule) =>
        rule.destination === "/:path.md" &&
        rule.has?.some(
          (condition) =>
            condition.type === "header" && condition.key === "accept",
        ),
    ),
  );
  assert.ok(
    !Array.isArray(rules) &&
      rules.afterFiles?.some(
        (rule) =>
          rule.source === "/resume" && rule.destination.endsWith("resume.pdf"),
      ),
  );
  assert.ok(
    (await redirects()).some(
      (rule) => rule.source === "/about" && rule.destination === "/",
    ),
  );
  assert.ok(
    (await headers()).some(
      (rule) =>
        rule.source === "/:path*" &&
        rule.headers.some(
          (header) => header.key === "Vary" && header.value.includes("Accept"),
        ),
    ),
  );
});

test("docs and JSON APIs are absent while page Markdown remains accessible", async () => {
  const baseline = JSON.parse(
    await readRoot("scripts/fixtures/astro-parity.json"),
  );
  for (const path of Object.keys(baseline.pages) as string[]) {
    if (path.startsWith("hi/") || /^(404|whatsapp)/.test(path)) continue;
    const markdownPath =
      path === "index.html"
        ? "index.md"
        : path.replace(/\/index\.html$/, ".md");
    assert.match(await readDist(markdownPath), /^# /, markdownPath);
  }

  for (const path of [
    "docs/",
    "docs.md",
    "openapi.json",
    "llms.txt",
    "llms-full.txt",
    "api/v1/profile.json",
    "api/anything",
  ]) {
    assert.equal((await fetch(new URL(path, server.url))).status, 404, path);
  }
  for (const path of [
    "work/",
    "blog/probably-the-best-work/",
    "hi/blog/probably-the-best-work/",
  ]) {
    const response = await fetch(new URL(path, server.url), {
      headers: { Accept: "text/markdown" },
    });
    assert.equal(response.status, path.startsWith("404") ? 404 : 200, path);
    assert.match(response.headers.get("content-type")!, /text\/markdown/);
    assert.match(await response.text(), /^# /);
  }
});
