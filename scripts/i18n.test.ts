import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test, { after } from "node:test";
import { isLocale, localizePath } from "../src/i18n";
import { localizedPageParams, resolvePageRoute } from "../src/lib/page-routes";
import { sitePages } from "../src/lib/seo";
import { startServer } from "./serve-next";

const server = await startServer();
after(() => server.close());

test("development component canvas and preview documents remain private in production", async () => {
  for (const path of [
    "/studio/",
    "/hi/studio/",
    "/studio/preview/?sample=about",
    "/hi/studio/preview/?sample=code",
    "/studio/og.png",
    "/hi/studio/og.png",
    "/component-canvas/",
    "/hi/component-canvas/",
  ]) {
    const response = await fetch(server.url + path);
    assert.equal(response.status, 404, path);
    assert.equal(response.headers.get("x-frame-options"), "DENY", path);
    assert.ok(
      response.headers
        .get("content-security-policy")
        ?.includes("frame-ancestors 'none'"),
      path,
    );
  }
});

test("locale and route resolution reject unsupported and malformed paths", () => {
  assert.equal(isLocale("en"), true);
  assert.equal(isLocale("hi"), true);
  for (const locale of ["fr", "EN", "toString", "constructor"])
    assert.equal(isLocale(locale), false);
  for (const params of [
    { locale: "fr", path: [] },
    { locale: "hi", path: ["404"] },
    { locale: "en", path: ["missing"] },
    { locale: "en", path: ["work", "extra"] },
    { locale: "en", path: ["blog", "post", "extra"] },
    { locale: "en", path: ["constructor", "post"] },
  ])
    assert.equal(resolvePageRoute(params), undefined);
  assert.equal(resolvePageRoute({ locale: "hi" })?.path, "/");
  assert.equal(
    resolvePageRoute({ locale: "en", path: ["work"] })?.path,
    "/work/",
  );
  const article = resolvePageRoute({
    locale: "hi",
    path: ["blog", "probably-the-best-work"],
  });
  assert.equal(article?.kind, "content");
  if (article?.kind === "content") {
    assert.equal(article.section, "blog");
    assert.equal(article.prop, "post");
  }
});

test("one registry retains every public page and prerenders every locale", async () => {
  const params = await localizedPageParams();
  const paths = params.map(
    ({ locale, path = [] }) =>
      localizePath("/" + path.join("/"), locale).replace(/\/$/, "") || "/",
  );
  assert.equal(new Set(paths).size, paths.length);
  const baseline = JSON.parse(
    await readFile("scripts/fixtures/astro-parity.json", "utf8"),
  );
  const expected = Object.keys(baseline.pages)
    .filter((file) => !file.startsWith("whatsapp") && file !== "404.html")
    .map(
      (file) =>
        ("/" + file.replace(/index\.html$/, "")).replace(/\/$/, "") || "/",
    );
  assert.deepEqual(paths.toSorted(), expected.toSorted());
  assert.deepEqual(
    params
      .filter(({ locale, path }) => locale === "en" && path.length <= 1)
      .map(({ path }) => "/" + path.join("/"))
      .toSorted(),
    sitePages.map(({ path }) => path).toSorted(),
  );
  for (const page of sitePages)
    assert.ok(
      resolvePageRoute({
        locale: "en",
        path: page.path.split("/").filter(Boolean),
      }),
    );
  const manifest = JSON.parse(
    await readFile(".next/prerender-manifest.json", "utf8"),
  );
  for (const { locale, path = [] } of params) {
    const internal = `/${locale}${path.length ? "/" + path.join("/") : ""}`;
    assert.ok(Object.hasOwn(manifest.routes, internal), internal);
  }
});

test("localized URLs preserve document language, canonicals, and alternates", async () => {
  for (const path of ["", "work", "blog/probably-the-best-work"]) {
    for (const locale of ["en", "hi"] as const) {
      const pathname = localizePath("/" + path, locale);
      const response = await fetch(new URL(pathname, server.url));
      assert.equal(response.status, 200, pathname);
      const html = await response.text();
      assert.match(html, new RegExp(`<html[^>]*lang="${locale}"`));
      const canonical = `https://milindmishra.com${pathname.replace(/\/?$/, "/")}`;
      assert.ok(html.includes(`rel="canonical" href="${canonical}"`), pathname);
      assert.match(html, /hrefLang="en"/);
      assert.match(html, /hrefLang="hi"/);
      assert.doesNotMatch(html, /href="https:\/\/milindmishra\.com\/en\//);
    }
  }
});

test("default-locale aliases redirect without losing queries", async () => {
  for (const path of ["", "work", "blog/probably-the-best-work"]) {
    const response = await fetch(
      new URL(`/en/${path}${path ? "/" : ""}?source=i18n`, server.url),
      { redirect: "manual" },
    );
    assert.equal(response.status, 308);
    const location = new URL(response.headers.get("location")!, server.url);
    assert.equal(location.pathname, path ? `/${path}/` : "/");
    assert.equal(location.search, "?source=i18n");
  }
});

test("unknown locales, pages, and articles return real 404 responses", async () => {
  for (const path of [
    "/missing/",
    "/404/",
    "/hi/missing/",
    "/fr/work/",
    "/toString/",
    "/hi/404/",
    "/blog/does-not-exist/",
    "/hi/blog/does-not-exist/",
    "/hi/blog/probably-the-best-work/extra/",
  ]) {
    const response = await fetch(new URL(path, server.url));
    assert.equal(response.status, 404, path);
    assert.match(await response.text(), /This page wandered off/);
  }
});

test("localized HTML rewrites leave Markdown and resource routes intact", async () => {
  for (const path of [
    "/",
    "/hi/",
    "/blog/probably-the-best-work/",
    "/hi/blog/probably-the-best-work/",
  ]) {
    const response = await fetch(new URL(path, server.url), {
      headers: { Accept: "text/markdown" },
    });
    assert.equal(response.status, 200, path);
    assert.match(response.headers.get("content-type")!, /text\/markdown/);
    assert.match(await response.text(), /^# /);
  }
  for (const path of [
    "/robots.txt",
    "/rss.xml",
    "/og.png",
    "/og/hi.png",
    "/share/hi/probably-the-best-work.png",
    "/manifest.webmanifest",
    "/sw.js",
  ]) {
    const response = await fetch(new URL(path, server.url));
    assert.equal(response.status, 200, path);
  }
});
